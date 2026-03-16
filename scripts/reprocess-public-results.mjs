import nextEnv from '@next/env'

import { evaluateRepo } from '../lib/gemini.js'
import { fetchProfileData, fetchRepoData, parseGithubUrl } from '../lib/github.js'
import { ALL_ITEMS, getNivel } from '../lib/pog-catalog.js'
import { getRecentPublicResultsWithPayload, replaceMuralEntries, replaceStoredResult } from '../lib/storage.js'

const { loadEnvConfig } = nextEnv

loadEnvConfig(process.cwd())

function parseCliOptions(argv = []) {
    const options = {
        apply: false,
        limit: 50,
    }

    for (let index = 0; index < argv.length; index += 1) {
        const arg = argv[index]

        if (arg === '--apply') {
            options.apply = true
            continue
        }

        if (arg === '--limit') {
            const rawValue = argv[index + 1]
            const limit = Number(rawValue)
            if (!Number.isFinite(limit) || limit <= 0) {
                throw new Error('Use --limit com um numero inteiro positivo.')
            }

            options.limit = Math.min(Math.trunc(limit), 50)
            index += 1
        }
    }

    return options
}

async function fetchGithubDataFromResult(result) {
    const parsed = parseGithubUrl(result.url_github || '')
    if (!parsed) {
        throw new Error('URL do GitHub invalida ou ausente no resultado salvo.')
    }

    if (parsed.tipo === 'repo') {
        return fetchRepoData(parsed.owner, parsed.repo)
    }

    return fetchProfileData(parsed.owner)
}

function enrichDetectedItems(rawItems = []) {
    return rawItems
        .map((item) => {
            const catalogItem = ALL_ITEMS.find((catalogEntry) => catalogEntry.id === item.id)
            if (!catalogItem) return null

            return {
                ...catalogItem,
                evidencias: item.evidencias || [],
            }
        })
        .filter(Boolean)
}

function buildStoredResult(previousResult, githubData, evaluation) {
    const itensDetectadosCompletos = enrichDetectedItems(evaluation.itens_detectados || [])
    const scoreReal = itensDetectadosCompletos.reduce((sum, item) => sum + item.pontos, 0)
    const nivel = getNivel(scoreReal)

    return {
        ...previousResult,
        tipo: githubData.tipo,
        nome_projeto: githubData.nome,
        url_github: githubData.url,
        titulo_pog: evaluation.titulo_pog,
        frase_abertura: evaluation.frase_abertura,
        comentario_final: evaluation.comentario_final,
        score_total: scoreReal,
        nivel,
        itens_detectados: itensDetectadosCompletos,
        total_principios: itensDetectadosCompletos.filter((item) => item.tipo === 'principio').length,
        total_tecnicas: itensDetectadosCompletos.filter((item) => item.tipo === 'tecnica').length,
        total_gdps: itensDetectadosCompletos.filter((item) => item.tipo === 'gdp').length,
    }
}

function buildPublicEntry(result) {
    return {
        id: result.id,
        nome: result.nome || result.nome_projeto,
        url_github: result.url_github,
        tipo: result.tipo,
        score_total: result.score_total,
        nivel: result.nivel,
        titulo_pog: result.titulo_pog,
        frase_abertura: result.frase_abertura,
        criado_em: result.criado_em,
    }
}

function summarizeTypes(result) {
    return {
        principios: result.total_principios ?? result.itens_detectados?.filter((item) => item.tipo === 'principio').length ?? 0,
        tecnicas: result.total_tecnicas ?? result.itens_detectados?.filter((item) => item.tipo === 'tecnica').length ?? 0,
        gdps: result.total_gdps ?? result.itens_detectados?.filter((item) => item.tipo === 'gdp').length ?? 0,
    }
}

function buildSummaryItem(previousResult, nextResult, error = null) {
    const beforeTypes = summarizeTypes(previousResult)
    const afterTypes = summarizeTypes(nextResult)
    const changed =
        previousResult.score_total !== nextResult.score_total ||
        previousResult.titulo_pog !== nextResult.titulo_pog ||
        beforeTypes.principios !== afterTypes.principios ||
        beforeTypes.tecnicas !== afterTypes.tecnicas ||
        beforeTypes.gdps !== afterTypes.gdps

    return {
        id: previousResult.id,
        nome: previousResult.nome_projeto,
        status: error ? 'error' : changed ? 'updated' : 'unchanged',
        before: {
            titulo: previousResult.titulo_pog,
            score: previousResult.score_total,
            ...beforeTypes,
        },
        after: {
            titulo: nextResult.titulo_pog,
            score: nextResult.score_total,
            ...afterTypes,
        },
        error,
    }
}

function buildAggregate(summaryItems = []) {
    const aggregate = {
        before: { score: 0, principios: 0, tecnicas: 0, gdps: 0 },
        after: { score: 0, principios: 0, tecnicas: 0, gdps: 0 },
    }

    for (const item of summaryItems.filter((entry) => entry.status !== 'error')) {
        aggregate.before.score += item.before.score
        aggregate.before.principios += item.before.principios
        aggregate.before.tecnicas += item.before.tecnicas
        aggregate.before.gdps += item.before.gdps

        aggregate.after.score += item.after.score
        aggregate.after.principios += item.after.principios
        aggregate.after.tecnicas += item.after.tecnicas
        aggregate.after.gdps += item.after.gdps
    }

    return aggregate
}

async function main() {
    const options = parseCliOptions(process.argv.slice(2))
    const storedEntries = await getRecentPublicResultsWithPayload(options.limit)
    const chronologicalEntries = [...storedEntries].reverse()
    const updatedById = new Map()
    const recentTitles = []
    const summaryItems = []
    const total = chronologicalEntries.length

    for (const [index, item] of chronologicalEntries.entries()) {
        const { entry, result, ttlSeconds } = item
        let nextResult = result
        let error = null

        try {
            const githubData = await fetchGithubDataFromResult(result)
            const evaluation = await evaluateRepo(githubData, { recentTitles })
            nextResult = buildStoredResult(result, githubData, evaluation)
        } catch (caughtError) {
            error = caughtError.message
        }

        updatedById.set(result.id, {
            result: nextResult,
            entry: buildPublicEntry(nextResult),
            ttlSeconds,
        })

        recentTitles.unshift(nextResult.titulo_pog)
        if (recentTitles.length > 24) {
            recentTitles.length = 24
        }

        summaryItems.push(buildSummaryItem(result, nextResult, error))
        console.error(`[${index + 1}/${total}] ${result.nome_projeto} -> ${error ? `erro: ${error}` : 'avaliado'}`)
    }

    if (options.apply) {
        console.error(`Persistindo ${updatedById.size} resultados e reconstruindo o mural publico...`)

        for (const item of updatedById.values()) {
            await replaceStoredResult(item.result.id, item.result, item.ttlSeconds)
        }

        const muralEntries = storedEntries.map((item) => updatedById.get(item.result.id)?.entry || item.entry)
        await replaceMuralEntries(muralEntries)
        console.error('Persistencia concluida.')
    }

    const aggregate = buildAggregate(summaryItems)

    console.log(
        JSON.stringify(
            {
                apply: options.apply,
                limit: options.limit,
                processed: summaryItems.length,
                updated: summaryItems.filter((item) => item.status === 'updated').length,
                unchanged: summaryItems.filter((item) => item.status === 'unchanged').length,
                errored: summaryItems.filter((item) => item.status === 'error').length,
                aggregate,
                items: summaryItems,
            },
            null,
            2
        )
    )
}

main().catch((error) => {
    console.error(error)
    process.exit(1)
})