import HomePageView from '@/components/HomePageView'
import { getTopResults } from '@/lib/storage'

export const metadata = {
  title: "Pogometro - Certificacao Oficial de Gambiarra",
  description: "Cole a URL de um repositorio GitHub e descubra quantos Principios, Tecnicas e Gambi Design Patterns do livro POG o seu projeto conquistou.",
}

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
