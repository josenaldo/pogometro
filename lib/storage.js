/**
 * Storage via Upstash Redis REST API — sem SDK, apenas fetch
 * Documentação: https://upstash.com/docs/redis/features/restapi
 */

const MURAL_KEY = 'pogometro:mural'
const RANKING_KEY = 'pogometro:ranking'
const TTL_SECONDS = 60 * 60 * 24 * 90 // 90 dias
const RANKING_SCORE_FACTOR = 100_000_000_000_000

function getResultKey(id) {
    return `pogometro:resultado:${id}`
}

function parseStoredJson(raw) {
    try {
        return JSON.parse(raw)
    } catch {
        return null
    }
}

function buildPublicEntry(data) {
    return {
        id: data.id,
        nome: data.nome || data.nome_projeto,
        url_github: data.url_github,
        tipo: data.tipo,
        score_total: data.score_total,
        nivel: data.nivel,
        titulo_pog: data.titulo_pog,
        frase_abertura: data.frase_abertura,
        criado_em: data.criado_em,
    }
}

function buildRankingScore(scoreTotal, createdAt) {
    const normalizedScore = Number(scoreTotal) || 0
    const createdAtMs = Date.parse(createdAt)
    const timestamp = Number.isFinite(createdAtMs) ? createdAtMs : 0

    return normalizedScore * RANKING_SCORE_FACTOR + timestamp
}

function sortRankingEntries(entries) {
    return [...entries].sort((left, right) => {
        const scoreDiff = (right.score_total || 0) - (left.score_total || 0)
        if (scoreDiff !== 0) return scoreDiff

        return Date.parse(right.criado_em || '') - Date.parse(left.criado_em || '')
    })
}

async function redisCommand(...args) {
    const baseUrl = process.env.UPSTASH_REDIS_REST_URL
    const token = process.env.UPSTASH_REDIS_REST_TOKEN

    if (!baseUrl || !token) {
        throw new Error('Upstash Redis não configurado. Defina UPSTASH_REDIS_REST_URL e UPSTASH_REDIS_REST_TOKEN.')
    }

    const res = await fetch(`${baseUrl}/${args.map(encodeURIComponent).join('/')}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
    })
    const data = await res.json()
    if (data.error) throw new Error(`Redis error: ${data.error}`)
    return data.result
}

async function getMuralEntries(limit = 20) {
    const raw = await redisCommand('LRANGE', MURAL_KEY, '0', String(limit - 1))
    if (!raw || !Array.isArray(raw)) return []

    return raw.map((item) => parseStoredJson(item)).filter(Boolean)
}

async function getResultTtlSeconds(id) {
    const ttl = await redisCommand('TTL', getResultKey(id))
    return Number.isFinite(Number(ttl)) ? Number(ttl) : -2
}

// O ranking nasceu depois do mural. Se o índice estiver vazio, reconstruímos a partir
// das entradas públicas já existentes para não depender apenas de avaliações novas.
async function backfillRankingFromMural(limit = 50) {
    const entries = (await getMuralEntries(limit)).filter((entry) => entry?.id)

    if (entries.length === 0) return []

    const commandArgs = ['ZADD', RANKING_KEY]

    entries.forEach((entry) => {
        commandArgs.push(String(buildRankingScore(entry.score_total, entry.criado_em)), entry.id)
    })

    await redisCommand(...commandArgs)

    return entries
}

/**
 * Salva resultado de avaliação no Redis
 * @param {string} id - UUID da avaliação
 * @param {object} data - resultado completo
 * @param {boolean} publico - se deve aparecer no mural
 */
export async function saveResult(id, data, publico = true) {
    const key = getResultKey(id)
    const criadoEm = new Date().toISOString()
    const payload = JSON.stringify({ ...data, id, publico, criado_em: criadoEm })

    // SET com TTL
    await redisCommand('SET', key, payload, 'EX', String(TTL_SECONDS))

    // Adiciona ao mural e ao ranking se público
    if (publico) {
        const muralEntry = JSON.stringify(buildPublicEntry({ ...data, id, criado_em: criadoEm }))
        await redisCommand('LPUSH', MURAL_KEY, muralEntry)
        await redisCommand('LTRIM', MURAL_KEY, '0', '49')
        await redisCommand('ZADD', RANKING_KEY, String(buildRankingScore(data.score_total, criadoEm)), id)
    }

    return id
}

/**
 * Recupera resultado de avaliação pelo UUID
 * @param {string} id
 * @returns {object|null}
 */
export async function getResult(id) {
    const key = getResultKey(id)
    const raw = await redisCommand('GET', key)
    if (!raw) return null
    return parseStoredJson(raw)
}

/**
 * Recupera as últimas N entradas do mural público
 * @param {number} n
 * @returns {Array}
 */
export async function getRecentResults(n = 20) {
    return getMuralEntries(n)
}

export async function getRecentPublicResultsWithPayload(n = 20) {
    const entries = await getMuralEntries(n)
    const results = []

    for (const entry of entries) {
        if (!entry?.id) continue

        const [result, ttlSeconds] = await Promise.all([
            getResult(entry.id),
            getResultTtlSeconds(entry.id),
        ])

        if (!result) continue

        results.push({
            entry,
            result,
            ttlSeconds,
        })
    }

    return results
}

export async function getRecentPublicTitles(n = 20) {
    const results = await getRecentResults(n)
    return results.map((item) => item?.titulo_pog).filter(Boolean)
}

export async function replaceStoredResult(id, data, ttlSeconds = TTL_SECONDS) {
    const key = getResultKey(id)
    const payload = JSON.stringify(data)
    const ttl = Number(ttlSeconds)

    if (Number.isFinite(ttl) && ttl > 0) {
        await redisCommand('SET', key, payload, 'EX', String(ttl))
        return
    }

    await redisCommand('SET', key, payload)
}

export async function replaceMuralEntries(entries = []) {
    await redisCommand('DEL', MURAL_KEY)

    if (!entries.length) {
        return
    }

    const payloads = entries.map((entry) => JSON.stringify(entry))
    await redisCommand('RPUSH', MURAL_KEY, ...payloads)
    await redisCommand('LTRIM', MURAL_KEY, '0', '49')
}

/**
 * Recupera as N maiores pontuações públicas
 * @param {number} n
 * @returns {Array}
 */
export async function getTopResults(n = 10) {
    const lookupSize = Math.max(n * 10, 30)
    let ids = await redisCommand('ZREVRANGE', RANKING_KEY, '0', String(lookupSize - 1))

    if (!ids || !Array.isArray(ids)) {
        ids = []
    }

    if (ids.length === 0) {
        const backfilledEntries = await backfillRankingFromMural(Math.max(lookupSize, 50))

        return sortRankingEntries(backfilledEntries)
            .slice(0, n)
            .map((item) => buildPublicEntry(item))
    }

    const keys = ids.map((id) => getResultKey(id))
    const rawResults = await redisCommand('MGET', ...keys)
    const staleIds = []
    const parsedResults = []

    if (!Array.isArray(rawResults)) return []

    rawResults.forEach((item, index) => {
        if (!item) {
            staleIds.push(ids[index])
            return
        }

        const parsed = parseStoredJson(item)
        if (!parsed) {
            staleIds.push(ids[index])
            return
        }

        parsedResults.push(parsed)
    })

    if (staleIds.length > 0) {
        await redisCommand('ZREM', RANKING_KEY, ...staleIds)
    }

    const sortedResults = sortRankingEntries(parsedResults.filter((item) => item.publico !== false))

    if (sortedResults.length === 0) {
        const backfilledEntries = await backfillRankingFromMural(Math.max(lookupSize, 50))

        return sortRankingEntries(backfilledEntries)
            .slice(0, n)
            .map((item) => buildPublicEntry(item))
    }

    return sortedResults.slice(0, n).map((item) => buildPublicEntry(item))
}
