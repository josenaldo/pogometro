import MuralPageView from '@/components/MuralPageView'
import { buildMetadata } from '@/lib/seo'
import { getRecentResults } from '@/lib/storage'

export const metadata = buildMetadata({
    title: 'Mural da Fama — As Maiores Lendas POG do GitHub',
    description:
        'Os projetos e perfis GitHub com maior nível de gambiarra certificados pelo Pogômetro. Hall of Fame da Programação Orientada a Gambiarra.',
    path: '/mural',
    keywords: [
        'mural pogometro',
        'ranking github',
        'hall da fama github',
        'programacao orientada a gambiarra',
    ],
})

export const revalidate = 60 // ISR: revalida a cada 60 segundos

export default async function MuralPage() {
    let resultados = []
    let storageError = false

    try {
        resultados = await getRecentResults(20)
    } catch {
        storageError = true
    }

    return <MuralPageView resultados={resultados} storageError={storageError} />
}
