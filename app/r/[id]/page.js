import { notFound } from 'next/navigation'

import ResultPageView from '@/components/ResultPageView'
import { buildMetadata, SITE_URL } from '@/lib/seo'
import { getResult } from '@/lib/storage'

export async function generateMetadata({ params }) {
    const { id } = await params
    const data = await getResult(id).catch(() => null)

    if (!data) {
        return buildMetadata({
            title: 'Resultado não encontrado',
            description: 'O certificado POG solicitado não existe ou já expirou.',
            path: `/r/${id}`,
            image: {
                url: `/r/${id}/opengraph-image`,
                width: 1200,
                height: 630,
                alt: 'Certificado POG não encontrado',
                type: 'image/png',
            },
            noIndex: true,
        })
    }

    const title = `${data.nivel?.emoji || '🔨'} ${data.nome_projeto} — ${data.nivel?.nome || 'Certificado POG'}`
    const description = `${data.frase_abertura} Score: ${data.score_total} pts | ${data.nivel?.nome || 'Nível POG'}`

    return buildMetadata({
        title,
        description,
        path: `/r/${id}`,
        image: {
            url: `/r/${id}/opengraph-image`,
            width: 1200,
            height: 630,
            alt: `${data.nome_projeto} no Pogômetro`,
            type: 'image/png',
        },
        noIndex: data.publico === false,
        keywords: [
            'resultado pogometro',
            'certificado pog',
            data.nome_projeto,
            data.nivel?.nome || 'nivel pog',
        ].filter(Boolean),
    })
}

export default async function ResultPage({ params }) {
    const { id } = await params
    let data

    try {
        data = await getResult(id)
    } catch {
        notFound()
    }

    if (!data) notFound()

    return <ResultPageView data={data} id={id} siteUrl={SITE_URL} />
}
