/**
 * Storage via Upstash Redis REST API — sem SDK, apenas fetch
 * Documentação: https://upstash.com/docs/redis/features/restapi
 */

const BASE_URL = process.env.UPSTASH_REDIS_REST_URL
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN
const MURAL_KEY = 'pogometro:mural'
const TTL_SECONDS = 60 * 60 * 24 * 90 // 90 dias

async function redisCommand(...args) {
    if (!BASE_URL || !TOKEN) {
        throw new Error('Upstash Redis não configurado. Defina UPSTASH_REDIS_REST_URL e UPSTASH_REDIS_REST_TOKEN.')
    }
    const res = await fetch(`${BASE_URL}/${args.map(encodeURIComponent).join('/')}`, {
        headers: { Authorization: `Bearer ${TOKEN}` },
        cache: 'no-store',
    })
    const data = await res.json()
    if (data.error) throw new Error(`Redis error: ${data.error}`)
    return data.result
}

/**
 * Salva resultado de avaliação no Redis
 * @param {string} id - UUID da avaliação
 * @param {object} data - resultado completo
 * @param {boolean} publico - se deve aparecer no mural
 */
export async function saveResult(id, data, publico = true) {
    const key = `pogometro:resultado:${id}`
    const payload = JSON.stringify({ ...data, id, publico, criado_em: new Date().toISOString() })

    // SET com TTL
    await redisCommand('SET', key, payload, 'EX', String(TTL_SECONDS))

    // Adiciona ao mural se público (LPUSH + limita a 50 entradas)
    if (publico) {
        const muralEntry = JSON.stringify({
            id,
            nome: data.nome_projeto,
            url_github: data.url_github,
            tipo: data.tipo,
            score_total: data.score_total,
            nivel: data.nivel,
            titulo_pog: data.titulo_pog,
            frase_abertura: data.frase_abertura,
            criado_em: new Date().toISOString(),
        })
        await redisCommand('LPUSH', MURAL_KEY, muralEntry)
        await redisCommand('LTRIM', MURAL_KEY, '0', '49')
    }

    return id
}

/**
 * Recupera resultado de avaliação pelo UUID
 * @param {string} id
 * @returns {object|null}
 */
export async function getResult(id) {
    const key = `pogometro:resultado:${id}`
    const raw = await redisCommand('GET', key)
    if (!raw) return null
    try {
        return JSON.parse(raw)
    } catch {
        return null
    }
}

/**
 * Recupera as últimas N entradas do mural público
 * @param {number} n
 * @returns {Array}
 */
export async function getRecentResults(n = 20) {
    try {
        const raw = await redisCommand('LRANGE', MURAL_KEY, '0', String(n - 1))
        if (!raw || !Array.isArray(raw)) return []
        return raw.map((item) => {
            try {
                return JSON.parse(item)
            } catch {
                return null
            }
        }).filter(Boolean)
    } catch {
        return []
    }
}
