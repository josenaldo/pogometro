import nextEnv from '@next/env'
import { GoogleGenAI } from '@google/genai'

import { fetchProfileData, fetchRepoData, parseGithubUrl } from '../lib/github.js'
import { finalizeTitle } from '../lib/gemini-title.js'
import { getRecentPublicResultsWithPayload, replaceMuralEntries, replaceStoredResult } from '../lib/storage.js'

const { loadEnvConfig } = nextEnv

loadEnvConfig(process.cwd())

function getRequiredEnv(name) {
    const value = process.env[name]
    if (!value) {
        throw new Error(`${name} nao configurada.`)
    }

    return value
}

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

async function main() {
    const options = parseCliOptions(process.argv.slice(2))
    const apiKey = getRequiredEnv('GEMINI_API_KEY')
    const model = getRequiredEnv('GEMINI_MODEL')
    const ai = new GoogleGenAI({ apiKey })
    const storedEntries = await getRecentPublicResultsWithPayload(options.limit)
    const chronologicalEntries = [...storedEntries].reverse()
    const updatedById = new Map()
    const recentTitles = []
    const summary = []

    for (const item of chronologicalEntries) {
        const { entry, result, ttlSeconds } = item
        let nextTitle = result.titulo_pog || ''
        let status = 'unchanged'
        let error = null

        try {
            const githubData = await fetchGithubDataFromResult(result)
            nextTitle = await finalizeTitle({
                ai,
                model,
                githubData,
                evaluation: result,
                recentTitles,
            })

            if (nextTitle !== result.titulo_pog) {
                status = 'updated'
            }
        } catch (caughtError) {
            status = 'error'
            error = caughtError.message
        }

        const nextResult = {
            ...result,
            titulo_pog: nextTitle,
        }

        const nextEntry = {
            ...entry,
            titulo_pog: nextTitle,
        }

        updatedById.set(result.id, {
            entry: nextEntry,
            result: nextResult,
            ttlSeconds,
        })

        recentTitles.unshift(nextTitle)
        if (recentTitles.length > 24) {
            recentTitles.length = 24
        }

        summary.push({
            id: result.id,
            nome: result.nome_projeto || entry.nome,
            status,
            oldTitle: result.titulo_pog,
            newTitle: nextTitle,
            error,
        })
    }

    if (options.apply) {
        for (const item of updatedById.values()) {
            await replaceStoredResult(item.result.id, item.result, item.ttlSeconds)
        }

        const muralEntries = storedEntries.map((item) => updatedById.get(item.result.id)?.entry || item.entry)
        await replaceMuralEntries(muralEntries)
    }

    console.log(
        JSON.stringify(
            {
                apply: options.apply,
                limit: options.limit,
                processed: summary.length,
                updated: summary.filter((item) => item.status === 'updated').length,
                errored: summary.filter((item) => item.status === 'error').length,
                items: summary,
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