import { getRecentResults } from '@/lib/storage'

export const metadata = {
  title: 'Mural da Fama — As Maiores Lendas POG do GitHub',
  description:
    'Os projetos e perfis GitHub com maior nível de gambiarra certificados pelo Pogômetro. Hall of Fame da Programação Orientada a Gambiarra.',
}

export const revalidate = 60 // ISR: revalida a cada 60 segundos

function NivelBadge({ nivel }) {
  const cor = nivel?.cor || 'text-violet-400'
  return (
    <span className={`text-sm font-semibold ${cor}`}>
      {nivel?.emoji} {nivel?.nome}
    </span>
  )
}

export default async function MuralPage() {
  let resultados = []
  let storageError = false

  try {
    resultados = await getRecentResults(20)
  } catch {
    storageError = true
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10 space-y-3">
        <div className="text-5xl">🏆</div>
        <h1 className="text-3xl font-bold pog-title-gradient">Mural da Fama</h1>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          As grandes lendas POG do GitHub. Certificadas, validadas e eternizadas pelo Oráculo da
          Gambiarra.
        </p>
      </div>

      {/* Error state */}
      {storageError && (
        <div className="text-center py-8 text-slate-600 border border-dashed border-[var(--pog-border)] rounded-xl mb-8">
          <p className="text-sm">
            O Redis da Gambiarra está em manutenção. Tente novamente em instantes.
          </p>
        </div>
      )}

      {/* Empty state */}
      {!storageError && resultados.length === 0 && (
        <div className="text-center py-16 space-y-4">
          <div className="text-5xl">🥚</div>
          <p className="text-slate-400 text-lg font-semibold">O mural ainda está vazio.</p>
          <p className="text-sm text-slate-600">
            Seja o primeiro a certificar seu projeto e entrar para a história da POG.
          </p>
          <a
            href="/"
            className="inline-block mt-4 bg-violet-700 hover:bg-violet-600 text-white text-sm font-medium py-3 px-8 rounded-xl transition-colors"
          >
            ⚒️ Certificar agora
          </a>
        </div>
      )}

      {/* Lista */}
      {resultados.length > 0 && (
        <div className="space-y-4">
          {resultados.map((item, index) => (
            <a
              key={item.id}
              href={`/r/${item.id}`}
              className="block bg-[var(--pog-surface)] border border-[var(--pog-border)] hover:border-violet-700 rounded-xl p-5 transition-colors group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* Ranking */}
                  <span className="text-slate-600 text-sm font-mono w-6 flex-shrink-0 pt-0.5">
                    #{index + 1}
                  </span>

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-lg">{item.nivel?.emoji || '⚒️'}</span>
                      <span className="text-slate-200 font-semibold text-sm group-hover:text-violet-300 transition-colors truncate">
                        {item.titulo_pog || item.nome}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 truncate">{item.nome}</div>
                    {item.frase_abertura && (
                      <p className="text-xs text-slate-500 italic line-clamp-2 leading-relaxed">
                        &ldquo;{item.frase_abertura}&rdquo;
                      </p>
                    )}
                  </div>
                </div>

                {/* Score + nível */}
                <div className="text-right flex-shrink-0 space-y-1">
                  <div className="text-xl font-bold text-amber-400">{item.score_total} pts</div>
                  <NivelBadge nivel={item.nivel} />
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="mt-12 text-center">
        <a
          href="/"
          className="inline-block bg-violet-700 hover:bg-violet-600 text-white text-sm font-medium py-3 px-8 rounded-xl transition-colors"
        >
          ⚒️ Certificar meu projeto
        </a>
      </div>
    </div>
  )
}
