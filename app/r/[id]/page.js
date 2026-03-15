import { notFound } from 'next/navigation'

import ResultPageView from '@/components/ResultPageView'
import { getResult } from '@/lib/storage'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pogometro.com.br'

export async function generateMetadata({ params }) {
  const { id } = await params
  const data = await getResult(id).catch(() => null)
  if (!data) return { title: 'Resultado não encontrado' }

  return {
    title: `${data.nivel?.emoji} ${data.nome_projeto} — ${data.nivel?.nome}`,
    description: `${data.frase_abertura} Score: ${data.score_total} pts | ${data.nivel?.nome}`,
    openGraph: {
      title: `${data.titulo_pog} | Pogômetro`,
      description: data.frase_abertura,
      url: `${siteUrl}/r/${id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${data.titulo_pog} | Pogômetro`,
      description: data.frase_abertura,
    },
  }
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

  return <ResultPageView data={data} id={id} siteUrl={siteUrl} />
}
