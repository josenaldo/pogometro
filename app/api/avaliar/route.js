import { v4 as uuidv4 } from 'uuid'
import { parseGithubUrl, fetchRepoData, fetchProfileData } from '@/lib/github'
import { evaluateRepo } from '@/lib/gemini'
import { getRecentPublicTitles, saveResult } from '@/lib/storage'
import { ALL_ITEMS, getNivel } from '@/lib/pog-catalog'

export const runtime = 'nodejs'

// Rate limit: máximo 5 avaliações por IP em 10 minutos (requer Redis configurado)
const RATE_LIMIT = 5
const RATE_WINDOW = 60 * 10 // 10 minutos em segundos

async function checkRateLimit(ip) {
  // Se Redis não estiver configurado, ignora rate limit (dev local)
  if (!process.env.UPSTASH_REDIS_REST_URL) return true

  try {
    const key = `pogometro:ratelimit:${ip}`
    const url = `${process.env.UPSTASH_REDIS_REST_URL}/INCR/${encodeURIComponent(key)}`
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` },
    })
    const data = await res.json()
    const count = data.result

    if (count === 1) {
      // Primeira request — define TTL
      await fetch(
        `${process.env.UPSTASH_REDIS_REST_URL}/EXPIRE/${encodeURIComponent(key)}/${RATE_WINDOW}`,
        { headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` } }
      )
    }

    return count <= RATE_LIMIT
  } catch {
    return true // se Redis falhar, deixa passar
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { githubUrl, publico = true } = body

    if (!githubUrl) {
      return Response.json({ erro: 'URL do GitHub é obrigatória.' }, { status: 400 })
    }

    // Parse da URL
    const parsed = parseGithubUrl(githubUrl)
    if (!parsed) {
      return Response.json(
        {
          erro: 'URL inválida. Use o formato: https://github.com/usuario/repositorio ou https://github.com/usuario',
        },
        { status: 400 }
      )
    }

    // Rate limiting por IP
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown'
    const allowed = await checkRateLimit(ip)
    if (!allowed) {
      return Response.json(
        {
          erro: 'Calma lá, POGramador! Você já avaliou muitos projetos em pouco tempo. Aguarde 10 minutos antes de invocar o Mjolnir novamente.',
        },
        { status: 429 }
      )
    }

    // Busca dados no GitHub
    let githubData
    try {
      if (parsed.tipo === 'repo') {
        githubData = await fetchRepoData(parsed.owner, parsed.repo)
      } else {
        githubData = await fetchProfileData(parsed.owner)
      }
    } catch (err) {
      const msg = err.message || ''
      if (msg.includes('404') || msg.includes('Not Found')) {
        return Response.json(
          {
            erro: 'Repositório ou perfil não encontrado. Verifique se a URL está correta e se o repositório é público.',
          },
          { status: 404 }
        )
      }
      if (msg.includes('rate limit') || msg.includes('403')) {
        return Response.json(
          {
            erro: 'Rate limit da API do GitHub atingido. Tente novamente em alguns minutos.',
          },
          { status: 503 }
        )
      }
      throw err
    }

    // Avalia com Gemini
    let avaliacao
    let recentTitles = []

    try {
      recentTitles = await getRecentPublicTitles(24)
    } catch {
      recentTitles = []
    }

    try {
      avaliacao = await evaluateRepo(githubData, { recentTitles })
    } catch (err) {
      console.error('Gemini error:', err)
      return Response.json(
        {
          erro: 'O oráculo POG está indisponível no momento. Tente novamente em instantes.',
        },
        { status: 503 }
      )
    }

    // Enriquece os itens detectados com dados do catálogo
    const itensDetectadosCompletos = (avaliacao.itens_detectados || [])
      .map((item) => {
        const catalogItem = ALL_ITEMS.find((c) => c.id === item.id)
        if (!catalogItem) return null
        return {
          ...catalogItem,
          evidencias: item.evidencias || [],
        }
      })
      .filter(Boolean)

    // Recalcula score baseado nos itens válidos do catálogo
    const scoreReal = itensDetectadosCompletos.reduce((sum, item) => sum + item.pontos, 0)
    const nivel = getNivel(scoreReal)

    const resultado = {
      id: uuidv4(),
      tipo: githubData.tipo,
      nome_projeto: githubData.nome,
      url_github: githubData.url,
      titulo_pog: avaliacao.titulo_pog,
      frase_abertura: avaliacao.frase_abertura,
      comentario_final: avaliacao.comentario_final,
      score_total: scoreReal,
      nivel: nivel,
      itens_detectados: itensDetectadosCompletos,
      total_principios: itensDetectadosCompletos.filter((i) => i.tipo === 'principio').length,
      total_tecnicas: itensDetectadosCompletos.filter((i) => i.tipo === 'tecnica').length,
      total_gdps: itensDetectadosCompletos.filter((i) => i.tipo === 'gdp').length,
      publico,
    }

    // Persiste no Redis
    try {
      await saveResult(resultado.id, resultado, publico)
    } catch (err) {
      console.error('Redis save error:', err)
      // Retorna o resultado mesmo sem persistência (sem mural)
      return Response.json({ id: resultado.id, resultado })
    }

    return Response.json({ id: resultado.id, resultado })
  } catch (err) {
    console.error('Unexpected error in /api/avaliar:', err)
    return Response.json(
      {
        erro: 'Erro interno no Certificador POG. Os deuses da gambiarra estão em manutenção.',
      },
      { status: 500 }
    )
  }
}
