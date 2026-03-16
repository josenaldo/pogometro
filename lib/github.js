/**
 * GitHub REST API helpers — sem SDK, apenas fetch
 */

const GITHUB_API = 'https://api.github.com'
const GITHUB_GRAPHQL_API = `${GITHUB_API}/graphql`
const PUBLIC_TITLE_VOICE_PATTERNS = [
    {
        voice: 'neutral',
        pattern:
            /\b(?:she\s*\/\s*they|they\s*\/\s*she|he\s*\/\s*they|they\s*\/\s*he|ela\s*\/\s*elu|elu\s*\/\s*ela|ele\s*\/\s*elu|elu\s*\/\s*ele|elu\s*\/\s*delu|delu\s*\/\s*elu|they\s*\/\s*them|them\s*\/\s*they|non[\s-]?binary|nao[\s-]?binar(?:ie|io|ia)|nb)\b/i,
    },
    {
        voice: 'feminine',
        pattern: /\b(?:ela\s*\/\s*dela|dela\s*\/\s*ela|she\s*\/\s*her|her\s*\/\s*she)\b/i,
    },
    {
        voice: 'masculine',
        pattern: /\b(?:ele\s*\/\s*dele|dele\s*\/\s*ele|he\s*\/\s*him|him\s*\/\s*he)\b/i,
    },
]

function githubHeaders() {
    const headers = {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
    }
    if (process.env.GITHUB_TOKEN) {
        headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`
    }
    return headers
}

async function githubFetch(path) {
    const res = await fetch(`${GITHUB_API}${path}`, {
        headers: githubHeaders(),
        next: { revalidate: 300 }, // cache 5 min
    })
    if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || `GitHub API error ${res.status} on ${path}`)
    }
    return res.json()
}

async function githubGraphqlFetch(query, variables = {}) {
    if (!process.env.GITHUB_TOKEN) {
        return null
    }

    const res = await fetch(GITHUB_GRAPHQL_API, {
        method: 'POST',
        headers: {
            ...githubHeaders(),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, variables }),
    })

    if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || `GitHub GraphQL error ${res.status}`)
    }

    const data = await res.json()
    if (data.errors?.length) {
        throw new Error(data.errors[0].message || 'GitHub GraphQL error')
    }

    return data.data || null
}

function normalizeSignalText(value = '') {
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
}

function detectPublicTitleVoice({ pronouns = '', bio = '' } = {}) {
    const sources = [
        { source: 'pronouns', value: pronouns },
        { source: 'bio', value: bio },
    ].filter((entry) => entry.value)

    for (const entry of sources) {
        const normalizedValue = normalizeSignalText(entry.value)
        for (const candidate of PUBLIC_TITLE_VOICE_PATTERNS) {
            const match = normalizedValue.match(candidate.pattern)
            if (match) {
                return {
                    voice: candidate.voice,
                    source: entry.source,
                    evidence: match[0],
                }
            }
        }
    }

    return null
}

async function fetchUserPronouns(login) {
    const data = await githubGraphqlFetch(
        `query($login: String!) {
            user(login: $login) {
                pronouns
            }
        }`,
        { login }
    ).catch(() => null)

    return data?.user?.pronouns || null
}

async function fetchAccountProfile(login, accountType = 'User') {
    const path = accountType === 'Organization' ? `/orgs/${login}` : `/users/${login}`
    const profile = await githubFetch(path)
    const pronouns = profile.type === 'User' ? await fetchUserPronouns(login).catch(() => null) : null

    return {
        ...profile,
        pronouns: profile.pronouns || pronouns || '',
    }
}

function buildPublicLanguageSignals(profile = {}) {
    if (profile.type === 'Organization') {
        return {
            tipo_conta: 'organization',
            voz_titulo: 'collective',
            fonte_voz_titulo: 'account_type',
            evidencia_publica: 'conta organizacional',
            pronomes_publicos: '',
        }
    }

    const detection = detectPublicTitleVoice({
        pronouns: profile.pronouns,
        bio: profile.bio,
    })

    return {
        tipo_conta: profile.type === 'User' ? 'user' : 'unknown',
        voz_titulo: detection?.voice || 'unknown',
        fonte_voz_titulo: detection?.source || 'none',
        evidencia_publica: detection?.evidence || '',
        pronomes_publicos: profile.pronouns || '',
    }
}

function buildProfileSummary(profile = {}) {
    if (!profile?.login) {
        return null
    }

    return {
        login: profile.login,
        nome: profile.name || '',
        bio: profile.bio || '',
        tipo_conta: profile.type || '',
        pronomes_publicos: profile.pronouns || '',
    }
}

/**
 * Parseia uma URL do GitHub e retorna { tipo: 'repo'|'profile', owner, repo? }
 */
export function parseGithubUrl(rawUrl) {
    try {
        const url = new URL(rawUrl.trim())
        if (url.hostname !== 'github.com') return null

        const parts = url.pathname.replace(/^\//, '').replace(/\/$/, '').split('/')
        if (parts.length === 1 && parts[0]) {
            return { tipo: 'profile', owner: parts[0] }
        }
        if (parts.length >= 2 && parts[0] && parts[1]) {
            return { tipo: 'repo', owner: parts[0], repo: parts[1] }
        }
        return null
    } catch {
        return null
    }
}

/**
 * Tenta ler o conteúdo de um arquivo do repositório (retorna string ou null)
 */
async function fetchFileContent(owner, repo, filepath) {
    try {
        const data = await githubFetch(`/repos/${owner}/${repo}/contents/${filepath}`)
        if (data.encoding === 'base64' && data.content) {
            return Buffer.from(data.content, 'base64').toString('utf-8').slice(0, 4000)
        }
        return null
    } catch {
        return null
    }
}

/**
 * Busca dados de um repositório para análise POG
 */
export async function fetchRepoData(owner, repo) {
    const [repoInfo, commits, issues, languages] = await Promise.all([
        githubFetch(`/repos/${owner}/${repo}`),
        githubFetch(`/repos/${owner}/${repo}/commits?per_page=30`).catch(() => []),
        githubFetch(`/repos/${owner}/${repo}/issues?state=open&per_page=20`).catch(() => []),
        githubFetch(`/repos/${owner}/${repo}/languages`).catch(() => ({})),
    ])

    // Tenta ler arquivos-chave para análise
    const [readme, packageJson, requirements, pomXml, composerJson, rootTree] =
        await Promise.all([
            fetchFileContent(owner, repo, 'README.md').then(
                (c) => c || fetchFileContent(owner, repo, 'readme.md')
            ),
            fetchFileContent(owner, repo, 'package.json'),
            fetchFileContent(owner, repo, 'requirements.txt'),
            fetchFileContent(owner, repo, 'pom.xml'),
            fetchFileContent(owner, repo, 'composer.json'),
            githubFetch(`/repos/${owner}/${repo}/git/trees/HEAD?recursive=0`).catch(() => null),
        ])

    const commitMessages = commits.slice(0, 30).map((c) => c.commit?.message?.split('\n')[0] || '')
    const fileList = rootTree?.tree?.map((f) => f.path).slice(0, 100) || []
    const ownerProfile = await fetchAccountProfile(owner, repoInfo.owner?.type || 'User').catch(() => null)

    return {
        tipo: 'repo',
        nome: repoInfo.full_name,
        descricao: repoInfo.description || '',
        linguagem_principal: repoInfo.language || '',
        linguagens: Object.keys(languages),
        estrelas: repoInfo.stargazers_count,
        forks: repoInfo.forks_count,
        issues_abertas: issues.length,
        topicos: repoInfo.topics || [],
        criado_em: repoInfo.created_at,
        ultimo_push: repoInfo.pushed_at,
        commit_messages: commitMessages,
        readme: readme ? readme.slice(0, 2000) : null,
        package_json: packageJson,
        requirements_txt: requirements,
        pom_xml: pomXml ? pomXml.slice(0, 2000) : null,
        composer_json: composerJson,
        file_list: fileList,
        issues_titulos: issues.map((i) => i.title),
        pessoa_responsavel: buildProfileSummary(ownerProfile),
        sinais_publicos_linguagem: buildPublicLanguageSignals(ownerProfile || repoInfo.owner || {}),
        url: `https://github.com/${owner}/${repo}`,
    }
}

/**
 * Busca dados de um perfil de usuário para análise POG
 */
export async function fetchProfileData(username) {
    const user = await fetchAccountProfile(username).catch(() => null)
    if (!user) {
        throw new Error('Perfil não encontrado.')
    }

    const repos = await githubFetch(`/users/${username}/repos?sort=pushed&per_page=20`).catch(() => [])

    const repoSummaries = repos.map((r) => ({
        nome: r.name,
        descricao: r.description || '',
        linguagem: r.language || '',
        estrelas: r.stargazers_count,
        ultimo_push: r.pushed_at,
        topicos: r.topics || [],
        tem_readme: !r.description === false,
        arquivado: r.archived,
    }))

    const linguagens = [...new Set(repos.map((r) => r.language).filter(Boolean))]

    return {
        tipo: 'profile',
        nome: user.login,
        nome_completo: user.name || '',
        bio: user.bio || '',
        empresa: user.company || '',
        repos_publicos: user.public_repos,
        seguidores: user.followers,
        criado_em: user.created_at,
        linguagens,
        repos: repoSummaries,
        pronomes_publicos: user.pronouns || '',
        sinais_publicos_linguagem: buildPublicLanguageSignals(user),
        url: `https://github.com/${username}`,
    }
}
