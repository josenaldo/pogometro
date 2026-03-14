/**
 * Avaliação POG via Google Gemini — usando @google/genai SDK
 * Docs: https://ai.google.dev/gemini-api/docs
 */

import { GoogleGenAI } from '@google/genai'
import { readFileSync } from 'fs'
import { join } from 'path'
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

/**
 * Avalia dados de um repositório/perfil GitHub e retorna resultado estruturado
 * @param {object} githubData - dados retornados por fetchRepoData ou fetchProfileData
 * @returns {object} resultado da avaliação
 */
export async function evaluateRepo(githubData) {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) throw new Error('GEMINI_API_KEY não configurada.')

    const model = process.env.GEMINI_MODEL
    if (!model) throw new Error('GEMINI_MODEL não configurada.')

    const catalogText = buildCatalogText()
    const dataText = JSON.stringify(githubData, null, 2).slice(0, 8000)

    const prompt = PROMPT_TEMPLATE.replace('{{CATALOG}}', catalogText).replace('{{DATA}}', dataText)

    const ai = new GoogleGenAI({ apiKey })

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            temperature: 0.8,
            maxOutputTokens: 4096,
            responseMimeType: 'application/json',
        },
    })

    const text = response.text
    if (!text) throw new Error('Gemini retornou resposta vazia.')

    try {
        return JSON.parse(text)
    } catch {
        const match = text.match(/```(?:json)?\s*([\s\S]*?)```/)
        if (match) return JSON.parse(match[1].trim())
        throw new Error('Não foi possível parsear a resposta da IA como JSON.')
    }
}
