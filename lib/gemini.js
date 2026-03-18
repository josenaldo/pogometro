/**
 * Avaliação POG via Google Gemini — usando @google/genai SDK
 * Docs: https://ai.google.dev/gemini-api/docs
 */

import { GoogleGenAI } from '@google/genai'
import { readFileSync } from 'fs'
import { join } from 'path'

import { finalizeTitle, formatRecentTitlesForPrompt } from './gemini-title.js'
import { ALL_ITEMS } from './pog-catalog.js'

const PROMPT_TEMPLATE = readFileSync(join(process.cwd(), 'lib', 'gemini-prompt.md'), 'utf-8')

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

function parseModelJson(text) {
    try {
        return JSON.parse(text)
    } catch {
        const match = text.match(/```(?:json)?\s*([\s\S]*?)```/)
        if (match) return JSON.parse(match[1].trim())
        throw new Error('Não foi possível parsear a resposta da IA como JSON.')
    }
}

function buildEvaluationDataText(githubData) {
    const baseData = {
        tipo: githubData.tipo,
        nome: githubData.nome,
        nome_completo: githubData.nome_completo,
        descricao: githubData.descricao || githubData.bio || '',
        empresa: githubData.empresa || '',
        linguagem_principal: githubData.linguagem_principal || '',
        linguagens: githubData.linguagens || [],
        estrelas: githubData.estrelas,
        forks: githubData.forks,
        issues_abertas: githubData.issues_abertas,
        topicos: githubData.topicos || [],
        criado_em: githubData.criado_em,
        ultimo_push: githubData.ultimo_push,
        pessoa_responsavel: githubData.pessoa_responsavel || null,
        sinais_publicos_linguagem: githubData.sinais_publicos_linguagem || null,
        commit_messages: (githubData.commit_messages || []).slice(0, 20),
        issues_titulos: (githubData.issues_titulos || []).slice(0, 15),
        file_list: (githubData.file_list || []).slice(0, 200),
        heuristicas_repositorio: githubData.heuristicas_repositorio || null,
        amostras_codigo: (githubData.amostras_codigo || []).slice(0, 8),
        readme: githubData.readme ? githubData.readme.slice(0, 2500) : null,
        package_json: githubData.package_json ? githubData.package_json.slice(0, 1800) : null,
        requirements_txt: githubData.requirements_txt ? githubData.requirements_txt.slice(0, 1800) : null,
        pom_xml: githubData.pom_xml ? githubData.pom_xml.slice(0, 1800) : null,
        composer_json: githubData.composer_json ? githubData.composer_json.slice(0, 1800) : null,
        repos: (githubData.repos || []).slice(0, 15),
        url: githubData.url,
    }

    return JSON.stringify(baseData, null, 2).slice(0, 18_000)
}

/**
 * Avalia dados de um repositório/perfil GitHub e retorna resultado estruturado
 * @param {object} githubData - dados retornados por fetchRepoData ou fetchProfileData
 * @returns {object} resultado da avaliação
 */
export async function evaluateRepo(githubData, options = {}) {
    const { recentTitles = [] } = options
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) throw new Error('GEMINI_API_KEY não configurada.')

    const model = process.env.GEMINI_MODEL
    if (!model) throw new Error('GEMINI_MODEL não configurada.')

    const catalogText = buildCatalogText()
    const dataText = buildEvaluationDataText(githubData)
    const recentTitlesText = formatRecentTitlesForPrompt(recentTitles)

    const prompt = PROMPT_TEMPLATE
        .replace('{{CATALOG}}', catalogText)
        .replace('{{DATA}}', dataText)
        .replace('{{RECENT_TITLES}}', recentTitlesText)

    const ai = new GoogleGenAI({ apiKey })

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            temperature: 0.6,
            maxOutputTokens: 8192,
            responseMimeType: 'application/json',
        },
    })

    const text = response.text
    if (!text) throw new Error('Gemini retornou resposta vazia.')

    const evaluation = parseModelJson(text)
    evaluation.titulo_pog = await finalizeTitle({
        ai,
        model,
        githubData,
        evaluation,
        recentTitles,
    })

    return evaluation
}
