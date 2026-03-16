import HomePageView from '@/components/HomePageView'
import { getTopResults } from '@/lib/storage'
import { buildMetadata, buildSoftwareApplicationJsonLd, serializeJsonLd } from '@/lib/seo'

export const metadata = buildMetadata({
    description:
        'Cole a URL de um repositório ou perfil no GitHub e descubra quantos Princípios, Técnicas e Gambi Design Patterns do livro POG o seu projeto conquistou.',
    path: '/',
})

export const revalidate = 60

export default async function Home() {
    let topResultados = []
    let rankingError = false
    const softwareApplicationJsonLd = serializeJsonLd(buildSoftwareApplicationJsonLd())

    try {
        topResultados = await getTopResults(3)
    } catch {
        rankingError = true
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: softwareApplicationJsonLd }}
            />
            <HomePageView topResultados={topResultados} rankingError={rankingError} />
        </>
    )
}
