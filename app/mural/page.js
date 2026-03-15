import MuralPageView from '@/components/MuralPageView'
import { getRecentResults } from '@/lib/storage'

export const metadata = {
  title: 'Mural da Fama — As Maiores Lendas POG do GitHub',
  description:
    'Os projetos e perfis GitHub com maior nível de gambiarra certificados pelo Pogômetro. Hall of Fame da Programação Orientada a Gambiarra.',
}

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
