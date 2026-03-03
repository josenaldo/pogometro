/**
 * GitHub REST API helpers — sem SDK, apenas fetch
 */

const GITHUB_API = 'https://api.github.com'

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
        url: `https://github.com/${owner}/${repo}`,
    }
}

/**
 * Busca dados de um perfil de usuário para análise POG
 */
export async function fetchProfileData(username) {
    const [user, repos] = await Promise.all([
        githubFetch(`/users/${username}`),
        githubFetch(`/users/${username}/repos?sort=pushed&per_page=20`).catch(() => []),
    ])

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
        url: `https://github.com/${username}`,
    }
}
