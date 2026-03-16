import RankingPageView from '@/components/RankingPageView'
import { buildMetadata } from '@/lib/seo'
import { getTopResults } from '@/lib/storage'

export const metadata = buildMetadata({
    title: 'Ranking POG — Top 10 Lendas da Gambiarra',
    description:
        'As 10 maiores pontuações públicas já certificadas pelo Pogômetro. Veja quem ocupa o topo absoluto da Programação Orientada a Gambiarra.',
    path: '/ranking',
    keywords: [
        'ranking pogometro',
        'top 10 gambiarra',
        'ranking github',
        'programacao orientada a gambiarra',
    ],
})

export const revalidate = 60

export default async function RankingPage() {
    let resultados = []
    let storageError = false

    try {
        resultados = await getTopResults(10)
    } catch {
        storageError = true
    }

    return <RankingPageView resultados={resultados} storageError={storageError} />
}