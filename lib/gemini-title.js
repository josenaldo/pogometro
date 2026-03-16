import { readFileSync } from 'fs'
import { join } from 'path'

import { ALL_ITEMS } from './pog-catalog.js'

const TITLE_PROMPT_TEMPLATE = readFileSync(join(process.cwd(), 'lib', 'gemini-title-prompt.md'), 'utf-8')
const TITLE_ARCHETYPE_PATTERNS = [
    { key: 'arquiteto', pattern: /\barquitet(?:o|a)s?\b/ },
    { key: 'mestre', pattern: /\bmestr(?:e|a)s?\b/ },
    { key: 'senhor', pattern: /\bsenhor(?:a|es)?\b/ },
    { key: 'rei', pattern: /\b(?:reis?|rainhas?)\b/ },
    { key: 'imperador', pattern: /\b(?:imperadores?|imperatrizes?)\b/ },
    { key: 'guardiao', pattern: /\b(?:guardi(?:ao|oes)|guardias?)\b/ },
    { key: 'arquimago', pattern: /\barquimag(?:o|a)s?\b/ },
    { key: 'artifice', pattern: /\bartific(?:e|es)\b/ },
    { key: 'artesao', pattern: /\b(?:artesao(?:es)?|artesas?)\b/ },
    { key: 'tecnomante', pattern: /\btecnomantes?\b/ },
    { key: 'codamante', pattern: /\bcodamantes?\b/ },
    { key: 'doutor', pattern: /\bdoutor(?:a|es|as)?\b/ },
    { key: 'chanceler', pattern: /\bchanceler(?:es)?\b/ },
    { key: 'sentinela', pattern: /\bsentinelas?\b/ },
    { key: 'alquimista', pattern: /\balquimistas?\b/ },
    { key: 'alfaiate', pattern: /\balfaiates?\b/ },
    { key: 'curador', pattern: /\bcurador(?:a|es|as)?\b/ },
]
const TITLE_MASCULINE_MARKERS = [
    /\barquitetos?\b/,
    /\bmestres?\b/,
    /\bsenhores?\b/,
    /\breis?\b/,
    /\bimperadores?\b/,
    /\bguardi(?:ao|oes)\b/,
    /\barquimagos?\b/,
    /\bartesao(?:es)?\b/,
    /\bdoutores?\b/,
    /\bcuradores?\b/,
]
const TITLE_FEMININE_MARKERS = [
    /\barquitetas?\b/,
    /\bmestras?\b/,
    /\bsenhoras?\b/,
    /\brainhas?\b/,
    /\bimperatrizes?\b/,
    /\bguardias?\b/,
    /\barquimagas?\b/,
    /\bartesas?\b/,
    /\bdoutoras?\b/,
    /\bcuradoras?\b/,
]
const TITLE_STOPWORDS = new Set(['o', 'a', 'os', 'as', 'do', 'da', 'dos', 'das', 'de', 'e'])
const MAX_REPEATED_OPENING_TOKENS = 3
const MAX_REPEATED_ARCHETYPE_TITLES = 3
const MAX_REPEATED_ARCHETYPE_CONNECTOR_TITLES = 5
const TITLE_FAMILY_FALLBACKS = [
    'Oficina',
    'Santuário',
    'Labirinto',
    'Museu',
    'Bazar',
    'Relicário',
    'Usina',
    'Monólito',
    'Catacumba',
    'Atlas',
    'Crônicas',
]
const TITLE_THEME_MAP = {
    'zipomatic-versioning': 'Zips Sagrados',
    'incremental-patching-debug': 'Remendos Infinitos',
    'my-precious': 'Contexto Cativo',
    'monkey-patching': 'Patches de Runtime',
    psychoding: 'Psicódigo',
    'wtf-qpe': 'Macarronada Hermética',
    'rcp-reuse-by-copy-paste': 'Copy Paste Cerimonial',
    'hardcoded-data': 'Hardcodes Eternos',
    forceps: 'Correções na Marra',
    'ostrich-syndrome': 'Warnings Ignorados',
    'nonsense-flag-naming': 'Flags Sem Nome',
    'commented-code-forever': 'Código Comentado',
    'you-shall-not-pass': 'Exceções Domadas',
    bulletproof: 'Sucesso Obrigatório',
    'exception-success': 'Exceções Vitoriosas',
    'string-sushiman': 'Sushiman de Strings',
    'sleeper-human-factor': 'Sono Operacional',
    'black-cat-dark-room': 'Mapas Obscuros',
    'mega-zord': 'Mega Zord',
}

export function formatRecentTitlesForPrompt(titles = []) {
    if (!titles.length) {
        return '- Nenhum título recente disponível.'
    }

    return titles.slice(0, 20).map((title) => `- ${title}`).join('\n')
}

function normalizeText(value = '') {
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
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

function getSignificantTokens(title) {
    return normalizeText(title)
        .split(' ')
        .filter(Boolean)
        .filter((token) => !TITLE_STOPWORDS.has(token))
}

function getTitleSignature(title) {
    return getSignificantTokens(title).slice(0, 2).join(' ')
}

function getTitleArchetypes(title = '') {
    const normalizedTitle = normalizeText(title)
    return TITLE_ARCHETYPE_PATTERNS.filter(({ pattern }) => pattern.test(normalizedTitle)).map(({ key }) => key)
}

function getTitleVoice(githubData = {}) {
    return githubData?.sinais_publicos_linguagem?.voz_titulo || 'unknown'
}

function buildInclusiveTitleGuidance(githubData = {}) {
    const signals = githubData?.sinais_publicos_linguagem || {}
    const evidence = signals.evidencia_publica ? ` Sinal público detectado: "${signals.evidencia_publica}".` : ''
    const pronouns = signals.pronomes_publicos ? ` Pronomes públicos: "${signals.pronomes_publicos}".` : ''

    switch (getTitleVoice(githubData)) {
        case 'feminine':
            return [
                '- Há sinais públicos explícitos de linguagem feminina. Se o título usar cargo ou arquétipo flexionado, prefira formas femininas: arquiteta, mestra, guardiã, rainha, doutora, arquimaga.' + evidence + pronouns,
                '- Não masculinize esse perfil por padrão. Formas invariáveis também são ótimas: artífice, sentinela, tecnomante, codamante, alquimista, chanceler.',
            ].join('\n')
        case 'masculine':
            return [
                '- Há sinais públicos explícitos de linguagem masculina. Se o título usar cargo ou arquétipo flexionado, prefira formas masculinas quando natural.' + evidence + pronouns,
                '- Formas invariáveis também são bem-vindas: artífice, sentinela, tecnomante, codamante, alquimista, chanceler.',
            ].join('\n')
        case 'neutral':
            return [
                '- Há sinais públicos explícitos de linguagem neutra ou não-binária. NÃO masculinize por padrão.' + evidence + pronouns,
                '- Prefira formas invariáveis ou neutras: artífice, sentinela, tecnomante, codamante, alquimista, chanceler. Só use forma flexionada se ela estiver explicitamente refletida nos sinais públicos.',
            ].join('\n')
        case 'collective':
            return [
                '- A conta analisada é coletiva ou organizacional. Não presuma uma pessoa masculina por trás do repositório.' + evidence,
                '- Prefira títulos de lugar, artefato, coletivo ou formas invariáveis em vez de cargos marcados por gênero.',
            ].join('\n')
        default:
            return [
                '- Não há sinal público explícito de pronomes ou gênero. NÃO masculinize por padrão.',
                '- Prefira títulos neutros, imagéticos, situacionais ou formas invariáveis: artífice, sentinela, tecnomante, codamante, alquimista, chanceler.',
            ].join('\n')
    }
}

function getTitleGenderMarkers(title = '') {
    const normalizedTitle = normalizeText(title)

    return {
        masculine: TITLE_MASCULINE_MARKERS.some((pattern) => pattern.test(normalizedTitle)),
        feminine: TITLE_FEMININE_MARKERS.some((pattern) => pattern.test(normalizedTitle)),
    }
}

function isTitleVoiceMismatch(title, titleVoice) {
    const markers = getTitleGenderMarkers(title)
    if (!markers.masculine && !markers.feminine) {
        return false
    }

    if (titleVoice === 'feminine') {
        return markers.masculine
    }

    if (titleVoice === 'masculine') {
        return markers.feminine
    }

    return markers.masculine || markers.feminine
}

function hasArchetypeConnectorStructure(title = '') {
    const normalizedTitle = normalizeText(title)
    if (!normalizedTitle || getTitleArchetypes(title).length === 0) {
        return false
    }

    return /^(?:[a-z0-9]+\s+){1,4}(?:de|do|da|dos|das)\b/.test(normalizedTitle)
}

function isTitleTooGenericOrRepeated(title, recentTitles = [], titleVoice = 'unknown') {
    if (!title) return true

    const normalizedTitle = normalizeText(title)
    if (!normalizedTitle) return true

    if (isTitleVoiceMismatch(title, titleVoice)) {
        return true
    }

    const tokens = normalizedTitle.split(' ').filter(Boolean)
    if (tokens.length < 4 || tokens.length > 10) {
        return true
    }

    const recentNormalizedTitles = recentTitles.map((item) => normalizeText(item)).filter(Boolean)
    if (recentNormalizedTitles.includes(normalizedTitle)) {
        return true
    }

    const archetypes = getTitleArchetypes(title)
    if (
        archetypes.some(
            (archetype) =>
                recentTitles.filter((recentTitle) => getTitleArchetypes(recentTitle).includes(archetype)).length >=
                MAX_REPEATED_ARCHETYPE_TITLES
        )
    ) {
        return true
    }

    if (
        hasArchetypeConnectorStructure(title) &&
        recentTitles.filter((recentTitle) => hasArchetypeConnectorStructure(recentTitle)).length >=
        MAX_REPEATED_ARCHETYPE_CONNECTOR_TITLES
    ) {
        return true
    }

    const titleSignature = getTitleSignature(title)
    if (!titleSignature) return true

    if (recentTitles.some((recentTitle) => getTitleSignature(recentTitle) === titleSignature)) {
        return true
    }

    const firstToken = getSignificantTokens(title)[0]
    if (!firstToken) return true

    const firstTokenRepetitions = recentTitles.filter((recentTitle) => getSignificantTokens(recentTitle)[0] === firstToken).length
    return firstTokenRepetitions >= MAX_REPEATED_OPENING_TOKENS
}

function buildDetectedItemsSummary(items = []) {
    if (!items.length) {
        return '- Nenhum item detectado com confiança. Baseie-se no clima geral do projeto.'
    }

    return items
        .sort((left, right) => right.pontos - left.pontos)
        .slice(0, 6)
        .map((item) => {
            const evidencias = (item.evidencias || []).slice(0, 2).join('; ')
            return `- ${item.nome} (${item.tipo}, ${item.pontos} pts): ${item.descricao}${evidencias ? ` | Evidências: ${evidencias}` : ''}`
        })
        .join('\n')
}

function buildProjectContext(githubData) {
    const context = {
        tipo: githubData.tipo,
        nome: githubData.nome,
        descricao: githubData.descricao || githubData.bio || '',
        linguagem_principal: githubData.linguagem_principal || '',
        linguagens: githubData.linguagens || [],
        topicos: githubData.topicos || [],
        commit_messages: (githubData.commit_messages || []).slice(0, 8),
        file_list: (githubData.file_list || []).slice(0, 20),
        pessoa_responsavel: githubData.pessoa_responsavel || null,
        sinais_publicos_linguagem: githubData.sinais_publicos_linguagem || null,
    }

    return JSON.stringify(context, null, 2)
}

function enrichDetectedItems(items = []) {
    return items
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

function extractThemeFromItems(items = [], githubData) {
    const topItem = [...items].sort((left, right) => right.pontos - left.pontos)[0]
    if (topItem && TITLE_THEME_MAP[topItem.id]) {
        return TITLE_THEME_MAP[topItem.id]
    }

    const repoName = githubData.nome
        ?.split(/[\/\-_]/)
        .map((chunk) => chunk.trim())
        .find((chunk) => chunk.length >= 4)

    if (repoName) {
        return repoName.charAt(0).toUpperCase() + repoName.slice(1)
    }

    return githubData.tipo === 'profile' ? 'Legado Distribuido' : 'Gambiarra Estrutural'
}

function buildFallbackTitle({ items, githubData, recentTitles = [] }) {
    const theme = extractThemeFromItems(items, githubData)
    const blockedFamilies = new Set(
        recentTitles
            .map((title) => getSignificantTokens(title)[0])
            .filter(Boolean)
    )

    const family =
        TITLE_FAMILY_FALLBACKS.find((candidate) => !blockedFamilies.has(normalizeText(candidate))) ||
        TITLE_FAMILY_FALLBACKS[0]

    return `${family} de ${theme}`
}

async function generateTitleWithGemini({ ai, model, githubData, detectedItems, currentTitle, recentTitles }) {
    const prompt = TITLE_PROMPT_TEMPLATE
        .replace('{{PROJECT_CONTEXT}}', buildProjectContext(githubData))
        .replace('{{TITLE_VOICE_GUIDANCE}}', buildInclusiveTitleGuidance(githubData))
        .replace('{{DETECTED_ITEMS}}', buildDetectedItemsSummary(detectedItems))
        .replace('{{CURRENT_TITLE}}', currentTitle || 'Sem rascunho anterior.')
        .replace('{{RECENT_TITLES}}', formatRecentTitlesForPrompt(recentTitles))

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            temperature: 1,
            maxOutputTokens: 256,
            responseMimeType: 'application/json',
        },
    })

    const parsed = parseModelJson(response.text || '')
    return parsed?.titulo_pog?.trim() || ''
}

export async function finalizeTitle({ ai, model, githubData, evaluation, recentTitles = [] }) {
    const detectedItems = enrichDetectedItems(evaluation.itens_detectados || [])
    const currentTitle = evaluation.titulo_pog?.trim() || ''
    const titleVoice = getTitleVoice(githubData)

    if (!isTitleTooGenericOrRepeated(currentTitle, recentTitles, titleVoice)) {
        return currentTitle
    }

    for (let attempt = 0; attempt < 2; attempt += 1) {
        const title = await generateTitleWithGemini({
            ai,
            model,
            githubData,
            detectedItems,
            currentTitle,
            recentTitles,
        }).catch(() => '')

        if (!isTitleTooGenericOrRepeated(title, recentTitles, titleVoice)) {
            return title
        }
    }

    if (!isTitleTooGenericOrRepeated(currentTitle, recentTitles, titleVoice)) {
        return currentTitle
    }

    return buildFallbackTitle({ items: detectedItems, githubData, recentTitles })
}