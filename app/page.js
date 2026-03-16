import HomePageView from '@/components/HomePageView'
import { getTopResults } from '@/lib/storage'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
    description:
        'Cole a URL de um repositório ou perfil no GitHub e descubra quantos Princípios, Técnicas e Gambi Design Patterns do livro POG o seu projeto conquistou.',
    path: '/',
})

export const revalidate = 60

export default async function Home() {
    let topResultados = []
    let rankingError = false

    try {
        topResultados = await getTopResults(3)
    } catch {
        rankingError = true
    }

    return <HomePageView topResultados={topResultados} rankingError={rankingError} />
}
