/**
 * GitHub REST API helpers — sem SDK, apenas fetch
 */

const GITHUB_API = 'https://api.github.com'
const GITHUB_GRAPHQL_API = `${GITHUB_API}/graphql`
const MAX_RECURSIVE_TREE_SIZE_KB = 50_000
const MAX_TREE_ENTRIES_CONSIDERED = 3_000
const MAX_SOURCE_SAMPLES = 8
const MAX_SOURCE_SAMPLE_CHARS = 1_200
const SOURCE_FILE_PATTERN = /(?:\.(?:js|jsx|ts|tsx|mjs|cjs|py|java|kt|go|rb|php|cs|rs|c|cc|cpp|h|hpp|sh|bash|zsh|ps1|sql|lua|dart|swift|scala|groovy|yml|yaml|json|xml|toml|ini|cfg|conf|properties)|(?:^|\/)(?:Dockerfile|docker-compose\.(?:ya?ml)|Makefile))$/i
const HIGH_PRIORITY_PATH_SEGMENTS = [
    'src/',
    'app/',
    'lib/',
    'server/',
    'api/',
    'scripts/',
    'internal/',
    'cmd/',
    'pkg/',
    'core/',
    'services/',
    'controllers/',
    'routes/',
    'pages/',
    'components/',
]
const LOW_SIGNAL_PATH_SEGMENTS = [
    'node_modules/',
    '.next/',
    'dist/',
    'build/',
    'coverage/',
    'vendor/',
    'public/',
    'assets/',
    'images/',
    'fonts/',
    'docs/',
    'storybook-static/',
    '__snapshots__/',
    '__fixtures__/',
]
const SUSPICIOUS_PATH_PATTERN = /\b(?:legacy|deprecated|temp|tmp|final|backup|copy|copia|old|draft|experimental|workaround|patch|retry|debug)\b/i
const TEST_PATH_PATTERN = /\b(?:test|tests|spec|specs|__tests__|stories)\b/i
const ARCHIVE_ARTIFACT_PATTERN = /\.(?:zip|tar|tgz|gz|bz2|7z|rar)$/i
const VERSIONED_COPY_PATH_PATTERN = /\b(?:backup|old|antigo|copia|copy|final(?:\d+)?|agora[_-]?vai|v\d+|vers(?:ao|ão)\d*)\b/i
const CURATIVE_COMMIT_PATTERN = /\b(?:fix(?:\b|\d)|fix do fix|fix again|hotfix|rollback|revert|agora vai|tentativa|retry|quick fix|temp(?:orary)? fix|workaround)\b/i
const CURATIVE_ISSUE_PATTERN = /\b(?:bug|erro|fix|hotfix|retry|rollback|timeout|regression|regressao|regressão)\b/i
const CURATIVE_CODE_PATTERN = /\b(?:temporary fix|temp fix|quick fix|workaround|adicionado para corrigir|added to fix|gambiarra para|hack to fix|fix bug)\b/gi
const MONKEY_PATCH_PATTERN = /\b(?:Object|Array|String|Number|Promise|Date|Error|Function|RegExp)\.prototype\.[A-Za-z_$][\w$]*\s*=|Object\.defineProperty\(\s*(?:Object|Array|String|Number|Promise|Date|Error|Function|RegExp)\.prototype|monkey[\s-]?patch\b/gi
const PSYCHODING_PATTERN = /\b(?:works?\s+(?:for\s+some\s+reason|somehow)|not\s+sure\s+why|dont\s+ask|don't\s+ask|nao\s+sei\s+por\s+que\s+funciona|não\s+sei\s+por\s+que\s+funciona|nao\s+me\s+pergunte|não\s+me\s+pergunte|magic(?:al)?|magia\s+negra)\b/gi
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

async function fetchRepositoryTree(owner, repo, repoSize = 0) {
    if (repoSize <= MAX_RECURSIVE_TREE_SIZE_KB) {
        const recursiveTree = await githubFetch(`/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`).catch(() => null)
        if (recursiveTree?.tree?.length) {
            return recursiveTree
        }
    }

    return githubFetch(`/repos/${owner}/${repo}/git/trees/HEAD?recursive=0`).catch(() => null)
}

function isLowSignalPath(path = '') {
    return LOW_SIGNAL_PATH_SEGMENTS.some((segment) => path.includes(segment))
}

function isLikelySourcePath(path = '') {
    if (!path || isLowSignalPath(path)) {
        return false
    }

    return SOURCE_FILE_PATTERN.test(path)
}

function scoreSourcePath(path = '') {
    let score = 0

    if (HIGH_PRIORITY_PATH_SEGMENTS.some((segment) => path.includes(segment))) {
        score += 6
    }

    if (SUSPICIOUS_PATH_PATTERN.test(path)) {
        score += 3
    }

    if (TEST_PATH_PATTERN.test(path)) {
        score -= 4
    }

    if (/\b(?:config|env|settings|service|controller|manager|handler|middleware|worker|job|queue|deploy|script|patch)\b/i.test(path)) {
        score += 2
    }

    if (/\.(?:sql|sh|bash|zsh|ps1|ya?ml|json|xml|properties|conf)$/i.test(path)) {
        score += 1
    }

    return score
}

function pickRepresentativeSourcePaths(treeEntries = []) {
    return treeEntries
        .filter((entry) => entry?.type === 'blob' && isLikelySourcePath(entry.path))
        .slice(0, MAX_TREE_ENTRIES_CONSIDERED)
        .sort((left, right) => scoreSourcePath(right.path) - scoreSourcePath(left.path))
        .slice(0, MAX_SOURCE_SAMPLES)
        .map((entry) => entry.path)
}

function normalizeSourceExcerpt(content = '') {
    return content
        .replace(/\r/g, '')
        .split('\n')
        .slice(0, 80)
        .join('\n')
        .slice(0, MAX_SOURCE_SAMPLE_CHARS)
        .trim()
}

async function fetchSourceSamples(owner, repo, filePaths = []) {
    const samples = []

    for (const path of filePaths) {
        const content = await fetchFileContent(owner, repo, path)
        if (!content) continue

        const excerpt = normalizeSourceExcerpt(content)
        if (!excerpt) continue

        samples.push({
            path,
            excerpt,
        })
    }

    return samples
}

function countMatches(text = '', pattern) {
    const regex = new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`)
    return [...text.matchAll(regex)].length
}

function hasMatch(text = '', pattern) {
    const regex = new RegExp(pattern.source, pattern.flags.replace(/g/g, ''))
    return regex.test(text)
}

function uniqueItems(items = []) {
    return [...new Set(items.filter(Boolean))]
}

function buildListCounter(items = [], pattern, key = 'itens') {
    const matches = uniqueItems(items.filter((item) => hasMatch(item, pattern)))

    return {
        ocorrencias: matches.length,
        [key]: matches.slice(0, 5),
    }
}

function buildSignalCounter(samples = [], pattern) {
    const files = []
    let count = 0

    for (const sample of samples) {
        const sampleCount = countMatches(sample.excerpt, pattern)
        if (sampleCount === 0) continue

        count += sampleCount
        files.push(sample.path)
    }

    return {
        ocorrencias: count,
        arquivos: files.slice(0, 5),
    }
}

function buildCommitOwnershipStats(commits = []) {
    const authorCounts = new Map()

    for (const commit of commits) {
        const author = commit.author?.login || commit.commit?.author?.name || commit.commit?.committer?.name
        if (!author) continue

        authorCounts.set(author, (authorCounts.get(author) || 0) + 1)
    }

    const total = [...authorCounts.values()].reduce((sum, count) => sum + count, 0)
    const topAuthors = [...authorCounts.entries()]
        .sort((left, right) => right[1] - left[1])
        .slice(0, 3)
        .map(([author, count]) => ({
            autor: author,
            commits: count,
            percentual: total ? Number((count / total).toFixed(2)) : 0,
        }))

    return {
        total_commits_considerados: total,
        autores_principais: topAuthors,
        autor_dominante: topAuthors[0] || null,
    }
}

function buildTechniqueSignals({ fileList = [], sourceSamples = [], commitMessages = [], issueTitles = [], commitOwnership = null }) {
    return {
        'zipomatic-versioning': {
            artefatos_compactados: buildListCounter(fileList, ARCHIVE_ARTIFACT_PATTERN, 'arquivos'),
            copias_nomeadas: buildListCounter(fileList, VERSIONED_COPY_PATH_PATTERN, 'arquivos'),
            commits_de_backup: buildListCounter(commitMessages, /\b(?:backup|restore|restaura|old version|versao anterior|versão anterior)\b/i, 'exemplos'),
        },
        'incremental-patching-debug': {
            commits_curativos: buildListCounter(commitMessages, CURATIVE_COMMIT_PATTERN, 'exemplos'),
            issues_curativas: buildListCounter(issueTitles, CURATIVE_ISSUE_PATTERN, 'exemplos'),
            comentarios_curativos: buildSignalCounter(sourceSamples, CURATIVE_CODE_PATTERN),
        },
        'my-precious': {
            ownership_autoral: commitOwnership || {
                total_commits_considerados: 0,
                autores_principais: [],
                autor_dominante: null,
            },
        },
        'monkey-patching': {
            overrides_em_runtime: buildSignalCounter(sourceSamples, MONKEY_PATCH_PATTERN),
            arquivos_de_patch: buildListCounter(fileList, /\bpatch(?:es)?\b/i, 'arquivos'),
        },
        psychoding: {
            comentarios_intuitivos: buildSignalCounter(sourceSamples, PSYCHODING_PATTERN),
            commits_experimentais: buildListCounter(commitMessages, /\b(?:tentativa|trying|trying again|experiment|experimento|agora vai)\b/i, 'exemplos'),
        },
    }
}

function buildRepositoryHeuristics({
    fileList = [],
    sourceSamples = [],
    commits = [],
    commitMessages = [],
    issueTitles = [],
    repositoryTree = null,
}) {
    const suspiciousPaths = fileList.filter((path) => SUSPICIOUS_PATH_PATTERN.test(path)).slice(0, 20)
    const commitHints = commitMessages
        .filter((message) => /\b(?:fix do fix|tentativa|agora vai|hotfix|revert|rollback|temporary|temporario|workaround|retry|debug)\b/i.test(message))
        .slice(0, 10)
    const issueHints = issueTitles
        .filter((title) => /\b(?:bug|erro|fix|hotfix|retry|timeout|legacy|todo|hack|workaround)\b/i.test(title))
        .slice(0, 10)
    const commitOwnership = buildCommitOwnershipStats(commits)

    return {
        profundidade_coleta: {
            arvore_truncada: Boolean(repositoryTree?.truncated),
            arquivos_listados: fileList.length,
            amostras_codigo: sourceSamples.length,
        },
        caminhos_suspeitos: suspiciousPaths,
        pistas_em_commits: commitHints,
        pistas_em_issues: issueHints,
        sinais_por_tecnica: buildTechniqueSignals({
            fileList,
            sourceSamples,
            commitMessages,
            issueTitles,
            commitOwnership,
        }),
        sinais_em_codigo: {
            comentarios_temporarios: buildSignalCounter(sourceSamples, /\b(?:TODO|FIXME|HACK|XXX|WORKAROUND|TEMP|temporario|provisorio)\b/gi),
            retry_e_sono: buildSignalCounter(sourceSamples, /\b(?:retry|retries|tentativa|backoff|sleep|setTimeout|setInterval|Thread\.sleep)\b/gi),
            logs_e_debug: buildSignalCounter(sourceSamples, /\b(?:console\.log|println\(|print\(|logger\.(?:debug|info)|fmt\.Print|System\.out\.print)\b/gi),
            hardcodes_e_hosts: buildSignalCounter(sourceSamples, /\b(?:localhost|127\.0\.0\.1|0\.0\.0\.0|https?:\/\/|password|secret|token|api[_-]?key)\b/gi),
            excecoes_e_capturas: buildSignalCounter(sourceSamples, /\b(?:catch\s*\(|except\b|rescue\b|throw\b|raise\b)\b/gi),
        },
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
    const [readme, packageJson, requirements, pomXml, composerJson, repositoryTree] =
        await Promise.all([
            fetchFileContent(owner, repo, 'README.md').then(
                (c) => c || fetchFileContent(owner, repo, 'readme.md')
            ),
            fetchFileContent(owner, repo, 'package.json'),
            fetchFileContent(owner, repo, 'requirements.txt'),
            fetchFileContent(owner, repo, 'pom.xml'),
            fetchFileContent(owner, repo, 'composer.json'),
            fetchRepositoryTree(owner, repo, repoInfo.size || 0),
        ])

    const commitMessages = commits.slice(0, 30).map((c) => c.commit?.message?.split('\n')[0] || '')
    const treeEntries = repositoryTree?.tree || []
    const fileList = treeEntries.map((f) => f.path).slice(0, 200)
    const samplePaths = pickRepresentativeSourcePaths(treeEntries)
    const sourceSamples = await fetchSourceSamples(owner, repo, samplePaths)
    const heuristics = buildRepositoryHeuristics({
        fileList,
        sourceSamples,
        commits,
        commitMessages,
        issueTitles: issues.map((issue) => issue.title),
        repositoryTree,
    })
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
        amostras_codigo: sourceSamples,
        heuristicas_repositorio: heuristics,
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
