import nextEnv from '@next/env'
import { GoogleGenAI } from '@google/genai'

import { finalizeTitle } from '../lib/gemini-title.js'
import { getRecentPublicTitles } from '../lib/storage.js'

const { loadEnvConfig } = nextEnv

loadEnvConfig(process.cwd())

const SCENARIOS = [
    {
        label: 'ERP de legado remendado',
        githubData: {
            tipo: 'repo',
            nome: 'erp-legado-bridge',
            descricao: 'Integracoes entre ERP antigo, faturamento e portal comercial com patches acumulados e deploy manual.',
            linguagem_principal: 'JavaScript',
            linguagens: ['JavaScript', 'SQL', 'Shell'],
            topicos: ['legacy', 'integration', 'erp'],
            commit_messages: ['fix do fix do faturamento', 'hotfix urgente no legado', 'retry manual da integracao'],
            file_list: ['src/legacy/bridge.js', 'scripts/deploy-final.sh', 'sql/patch_2020_08.sql'],
        },
        evaluation: {
            titulo_pog: 'Titulo Generico',
            itens_detectados: [
                { id: 'hardcoded-data', evidencias: ['credenciais e hosts definidos direto no codigo'] },
                { id: 'rcp-reuse-by-copy-paste', evidencias: ['modulos duplicados para integracoes parecidas'] },
                { id: 'forceps', evidencias: ['correcoes cirurgicas empilhadas sobre o fluxo principal'] },
            ],
        },
    },
    {
        label: 'CLI ritual de deploy',
        githubData: {
            tipo: 'repo',
            nome: 'deploy-ritual-cli',
            descricao: 'Ferramenta de deploy com scripts de rollback, pacotes zipados e overrides de runtime.',
            linguagem_principal: 'Node.js',
            linguagens: ['JavaScript', 'Bash'],
            topicos: ['cli', 'deploy', 'ops'],
            commit_messages: ['agora vai o deploy', 'zip final mesmo', 'patch no bootstrap de producao'],
            file_list: ['bin/deploy.js', 'scripts/reempacotar.sh', 'runtime/monkeyPatch.js'],
        },
        evaluation: {
            titulo_pog: 'Titulo Generico',
            itens_detectados: [
                { id: 'zipomatic-versioning', evidencias: ['artifacts versionados por zip numerado'] },
                { id: 'monkey-patching', evidencias: ['patch dinamico em runtime para corrigir biblioteca'] },
                { id: 'bulletproof', evidencias: ['scripts assumem sucesso obrigatorio em producao'] },
            ],
        },
    },
    {
        label: 'Portal das flags obscuras',
        githubData: {
            tipo: 'repo',
            nome: 'feature-flag-catacomb',
            descricao: 'Portal interno com dezenas de flags, comentarios historicos e comportamento dificil de rastrear.',
            linguagem_principal: 'TypeScript',
            linguagens: ['TypeScript', 'HTML', 'CSS'],
            topicos: ['internal-tool', 'feature-flags', 'frontend'],
            commit_messages: ['mantem comportamento antigo', 'nao apagar comentario importante', 'flag nova para contornar flag velha'],
            file_list: ['src/config/flags.ts', 'src/legacy/comments.ts', 'src/ui/toggles.tsx'],
        },
        evaluation: {
            titulo_pog: 'Titulo Generico',
            itens_detectados: [
                { id: 'nonsense-flag-naming', evidencias: ['flags com nomes cripticos e efeito acumulado'] },
                { id: 'black-cat-dark-room', evidencias: ['configuracao dificil de rastrear em multiplos arquivos'] },
                { id: 'commented-code-forever', evidencias: ['blocos comentados preservados como documentacao operacional'] },
            ],
        },
    },
    {
        label: 'Perfil do mantenedor insones',
        githubData: {
            tipo: 'profile',
            nome: 'mantenedor-noturno',
            bio: 'Mantenedor de sistemas legados, integracoes improvaveis e correcoes em horario critico.',
            linguagem_principal: 'Python',
            linguagens: ['Python', 'Shell'],
            topicos: ['legacy', 'automation', 'ops'],
            commit_messages: ['corrige madrugada', 'ajuste no script que acorda o outro script', 'segue o baile'],
            file_list: ['README.md', 'scripts/night-runner.sh', 'automation/heal_legacy.py'],
            sinais_publicos_linguagem: {
                voz_titulo: 'unknown',
                fonte_voz_titulo: 'none',
                evidencia_publica: '',
                pronomes_publicos: '',
                tipo_conta: 'user',
            },
        },
        evaluation: {
            titulo_pog: 'Titulo Generico',
            itens_detectados: [
                { id: 'psychoding', evidencias: ['logica moldada por intuicao operacional e contexto tacito'] },
                { id: 'sleeper-human-factor', evidencias: ['rotinas noturnas e execucao dependente do operador'] },
                { id: 'ostrich-syndrome', evidencias: ['warnings ignorados para preservar o fluxo atual'] },
            ],
        },
    },
    {
        label: 'Perfil da mantenedora de integrações',
        githubData: {
            tipo: 'profile',
            nome: 'engenheira-ritual',
            bio: 'Construo integrações legadas e automações de produção. ela/dela.',
            linguagem_principal: 'TypeScript',
            linguagens: ['TypeScript', 'Shell'],
            topicos: ['integration', 'legacy', 'automation'],
            commit_messages: ['ajusta o patch da madrugada', 'mais um remendo para produção', 'segura o deploy'],
            file_list: ['src/integration/orchestrator.ts', 'scripts/redeploy.sh'],
            sinais_publicos_linguagem: {
                voz_titulo: 'feminine',
                fonte_voz_titulo: 'pronouns',
                evidencia_publica: 'ela/dela',
                pronomes_publicos: 'ela/dela',
                tipo_conta: 'user',
            },
        },
        evaluation: {
            titulo_pog: 'Titulo Generico',
            itens_detectados: [
                { id: 'forceps', evidencias: ['correcoes cirurgicas empilhadas em integracoes sensiveis'] },
                { id: 'hardcoded-data', evidencias: ['endpoints e credenciais definidos no codigo'] },
                { id: 'incremental-patching-debug', evidencias: ['serie de patches para manter o fluxo vivo'] },
            ],
        },
    },
    {
        label: 'Perfil de automação não-binárie',
        githubData: {
            tipo: 'profile',
            nome: 'operacao-plana',
            bio: 'Cuido de runtimes feridos, automação e scripts estranhos. elu/delu.',
            linguagem_principal: 'Python',
            linguagens: ['Python', 'Bash'],
            topicos: ['ops', 'automation', 'legacy'],
            commit_messages: ['remendo final do runtime', 'agora vai sem derrubar', 'aceita o warning e segue'],
            file_list: ['ops/heal.py', 'scripts/runtime_patch.sh'],
            sinais_publicos_linguagem: {
                voz_titulo: 'neutral',
                fonte_voz_titulo: 'pronouns',
                evidencia_publica: 'elu/delu',
                pronomes_publicos: 'elu/delu',
                tipo_conta: 'user',
            },
        },
        evaluation: {
            titulo_pog: 'Titulo Generico',
            itens_detectados: [
                { id: 'monkey-patching', evidencias: ['patches de runtime para domar dependencias'] },
                { id: 'ostrich-syndrome', evidencias: ['warnings ignorados para manter o job vivo'] },
                { id: 'sleeper-human-factor', evidencias: ['execucao noturna dependente de cuidado humano'] },
            ],
        },
    },
    {
        label: 'Sistema de excecoes domesticadas',
        githubData: {
            tipo: 'repo',
            nome: 'exception-tamer-core',
            descricao: 'Backend que transforma excecoes em sucesso operacional por sobrevivencia do negocio.',
            linguagem_principal: 'Java',
            linguagens: ['Java', 'XML'],
            topicos: ['backend', 'exceptions', 'legacy'],
            commit_messages: ['na pratica funciona', 'trata exception do jeito certo errado', 'sucesso operacional'],
            file_list: ['src/main/java/core/FlowService.java', 'src/main/java/core/ErrorMapper.java', 'src/main/resources/app.xml'],
        },
        evaluation: {
            titulo_pog: 'Titulo Generico',
            itens_detectados: [
                { id: 'you-shall-not-pass', evidencias: ['excecoes usadas como barreira de fluxo'] },
                { id: 'exception-success', evidencias: ['erro capturado e convertido em resposta vencedora'] },
                { id: 'string-sushiman', evidencias: ['montagem manual de payloads e mensagens'] },
            ],
        },
    },
    {
        label: 'Monorepo cerimonial',
        githubData: {
            tipo: 'repo',
            nome: 'mega-suite-ritual',
            descricao: 'Monorepo com muitos modulos, estilos divergentes e documentacao minima, mas tudo conectado por fe.',
            linguagem_principal: 'TypeScript',
            linguagens: ['TypeScript', 'Go', 'Shell'],
            topicos: ['monorepo', 'platform', 'legacy'],
            commit_messages: ['integra mais um modulo', 'padroniza depois', 'ajuste temporario definitivo'],
            file_list: ['packages/core/index.ts', 'services/bridge/main.go', 'docs/README-old.md'],
        },
        evaluation: {
            titulo_pog: 'Titulo Generico',
            itens_detectados: [
                { id: 'mega-zord', evidencias: ['multiplos modulos costurados num fluxo unico'] },
                { id: 'criatividade-diversificativa', evidencias: ['cada pacote resolveu o mesmo problema de um jeito'] },
                { id: 'documentacao-espartana', evidencias: ['readmes minimos e decisoes sem registro formal'] },
            ],
        },
    },
]

function getRequiredEnv(name) {
    const value = process.env[name]
    if (!value) {
        throw new Error(`${name} nao configurada.`)
    }

    return value
}

async function loadRecentTitles() {
    try {
        return await getRecentPublicTitles(24)
    } catch (error) {
        return {
            error: error.message,
            titles: [],
        }
    }
}

async function main() {
    const apiKey = getRequiredEnv('GEMINI_API_KEY')
    const model = getRequiredEnv('GEMINI_MODEL')
    const ai = new GoogleGenAI({ apiKey })
    const recentTitleState = await loadRecentTitles()
    let recentTitles = Array.isArray(recentTitleState) ? recentTitleState : recentTitleState.titles
    const results = []

    for (const scenario of SCENARIOS) {
        const title = await finalizeTitle({
            ai,
            model,
            githubData: scenario.githubData,
            evaluation: scenario.evaluation,
            recentTitles,
        })

        results.push({
            scenario: scenario.label,
            title,
        })

        recentTitles = [title, ...recentTitles].slice(0, 24)
    }

    console.log(
        JSON.stringify(
            {
                recentTitlesLoaded: recentTitles.length,
                recentTitlesWarning: Array.isArray(recentTitleState) ? null : recentTitleState.error,
                results,
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