/**
 * Avaliação POG via Google Gemini 2.0 Flash — sem SDK, apenas fetch
 * Free tier: 1.500 req/dia, 15 RPM
 * Docs: https://ai.google.dev/api/generate-content
 */

import { ALL_ITEMS } from './pog-catalog.js'

const GEMINI_API = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

/**
 * Monta o catálogo completo como texto para o prompt
 */
function buildCatalogText() {
    const sections = [
        { label: 'PRINCÍPIOS (1 ponto cada)', items: ALL_ITEMS.filter((i) => i.tipo === 'principio') },
        { label: 'TÉCNICAS (2 pontos cada)', items: ALL_ITEMS.filter((i) => i.tipo === 'tecnica') },
        {
            label: 'GAMBI DESIGN PATTERNS (3 pontos cada)',
            items: ALL_ITEMS.filter((i) => i.tipo === 'gdp'),
        },
    ]

    return sections
        .map(({ label, items }) => {
            const itemLines = items
                .map(
                    (item) =>
                        `- ID: "${item.id}" | Nome: "${item.nome}" | Descrição: ${item.descricao}\n  Sinais no código: ${item.sinais.join('; ')}`
                )
                .join('\n')
            return `### ${label}\n${itemLines}`
        })
        .join('\n\n')
}

/**
 * Avalia dados de um repositório/perfil GitHub e retorna resultado estruturado
 * @param {object} githubData - dados retornados por fetchRepoData ou fetchProfileData
 * @returns {object} resultado da avaliação
 */
export async function evaluateRepo(githubData) {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) throw new Error('GEMINI_API_KEY não configurada.')

    const catalogText = buildCatalogText()
    const dataText = JSON.stringify(githubData, null, 2).slice(0, 8000)

    const prompt = `Você é o Certificador Oficial de POG (Programação Orientada a Gambiarra), um especialista que CELEBRA e PARABENIZA quando encontra gambiarras, código legado glorioso e padrões improvisados em repositórios do GitHub.

Seu trabalho é analisar os dados de um repositório/perfil GitHub e identificar quais princípios, técnicas e Gambi Design Patterns do livro "Programação Orientada a Gambiarra" estão presentes no projeto. Quanto mais você encontrar, maior a pontuação e mais glorioso o desenvolvedor.

## TOM E VOZ
- SEMPRE celebre as gambiarras encontradas — elas são conquistas, não erros
- Use humor respeitoso e admiração genuína pelo esforço criativo
- Fale como um nerd apaixonado por história da programação brasileira
- NÃO critique negativamente — cada item encontrado é uma medalha

## CATÁLOGO COMPLETO DOS ITENS DETECTÁVEIS

${catalogText}

## DADOS DO REPOSITÓRIO/PERFIL PARA ANÁLISE

${dataText}

## INSTRUÇÕES DE RESPOSTA

Responda APENAS com um JSON válido, sem markdown, sem explicações fora do JSON, no seguinte formato exato:

{
  "titulo_pog": "string — apelido criativo e glorioso para o projeto/dev (ex: 'O Santuário da Macarronada Eterna', 'O Senhor dos Hardcodes')",
  "frase_abertura": "string — 1-2 frases celebratórias sobre o nível POG encontrado, com humor e admiração",
  "score_total": number — soma dos pontos de todos os itens detectados,
  "itens_detectados": [
    {
      "id": "string — id exato do item do catálogo acima",
      "evidencias": ["string — frase celebratória explicando onde/como aparece no repo (2-3 evidências específicas)"]
    }
  ],
  "comentario_final": "string — parágrafo final de 2-3 frases parabenizando o desenvolvedor pela conquista POG obtida"
}

REGRAS IMPORTANTES:
1. Inclua em "itens_detectados" APENAS os itens para os quais você encontrou evidências REAIS nos dados fornecidos — não invente
2. O "score_total" deve ser a soma correta dos pontos de cada item detectado
3. Se poucos itens forem encontrados, celebre o potencial e encoraje o desenvolvedor
4. Os IDs devem ser EXATAMENTE os IDs listados no catálogo acima
5. Responda SOMENTE com o JSON, sem nenhum texto antes ou depois`

    const body = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 4096,
            responseMimeType: 'application/json',
        },
    }

    const res = await fetch(`${GEMINI_API}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    })

    if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(`Gemini API error ${res.status}: ${err?.error?.message || JSON.stringify(err)}`)
    }

    const data = await res.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) throw new Error('Gemini retornou resposta vazia.')

    try {
        // Tenta parsear direto — responseMimeType: application/json garante JSON puro
        const result = JSON.parse(text)
        return result
    } catch {
        // Fallback: extrai JSON de dentro de blocos markdown se necessário
        const match = text.match(/```(?:json)?\s*([\s\S]*?)```/)
        if (match) return JSON.parse(match[1].trim())
        throw new Error('Não foi possível parsear a resposta da IA como JSON.')
    }
}
