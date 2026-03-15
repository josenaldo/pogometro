import Link from 'next/link'
import { IconEgg, IconHammer, IconTrophy } from '@tabler/icons-react'

import NivelIcon from '@/components/NivelIcon'
import { getRecentResults } from '@/lib/storage'

export const metadata = {
  title: 'Mural da Fama — As Maiores Lendas POG do GitHub',
  description:
    'Os projetos e perfis GitHub com maior nível de gambiarra certificados pelo Pogômetro. Hall of Fame da Programação Orientada a Gambiarra.',
}

export const revalidate = 60 // ISR: revalida a cada 60 segundos

function NivelBadge({ nivel }) {
  const cor = nivel?.cor || 'text-[var(--pog-primary)]'
  return (
    <div className={`inline-flex items-center gap-1.5 text-sm font-semibold ${cor}`}>
      <NivelIcon nivelId={nivel?.id} size={16} className={cor} />
      <span>{nivel?.nome}</span>
    </div>
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
        <div className="flex justify-center">
          <IconTrophy size={46} stroke={2.2} className="text-[var(--pog-primary)]" aria-hidden="true" />
        </div>
        <h1 className="text-3xl font-bold pog-title-gradient">Mural da Fama</h1>
        <p className="text-[var(--pog-text-secondary)] text-sm max-w-lg mx-auto">
          As grandes lendas POG do GitHub. Certificadas, validadas e eternizadas pelo Oráculo da
          Gambiarra.
        </p>
      </div>

      {/* Error state */}
      {storageError && (
        <div className="text-center py-8 text-[var(--pog-text-muted)] border border-dashed border-[var(--pog-border)] rounded-xl mb-8">
          <p className="text-sm">
            O Redis da Gambiarra está em manutenção. Tente novamente em instantes.
          </p>
        </div>
      )}

      {/* Empty state */}
      {!storageError && resultados.length === 0 && (
        <div className="text-center py-16 space-y-4">
          <div className="flex justify-center">
            <IconEgg size={46} stroke={2.2} className="text-[var(--pog-text-secondary)]" aria-hidden="true" />
          </div>
          <p className="text-[var(--pog-text-secondary)] text-lg font-semibold">O mural ainda está vazio.</p>
          <p className="text-sm text-[var(--pog-text-muted)]">
            Seja o primeiro a certificar seu projeto e entrar para a história da POG.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 mt-4 pog-btn-primary text-sm font-bold py-3 px-8 rounded-xl"
          >
            <IconHammer size={18} stroke={2.2} aria-hidden="true" />
            <span>Certificar agora</span>
          </Link>
        </div>
      )}

      {/* Lista */}
      {resultados.length > 0 && (
        <div className="space-y-4">
          {resultados.map((item, index) => (
            <Link
              key={item.id}
              href={`/r/${item.id}`}
              className="block pog-card hover:border-[var(--pog-primary)] rounded-xl p-5 transition-colors group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* Ranking */}
                  <span className="text-[var(--pog-text-subtle)] text-sm font-mono w-6 flex-shrink-0 pt-0.5">
                    #{index + 1}
                  </span>

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <NivelIcon nivelId={item.nivel?.id} size={18} className="text-[var(--pog-primary)]" />
                      <span className="text-[var(--pog-text-primary)] font-semibold text-sm group-hover:text-[var(--pog-primary)] transition-colors truncate">
                        {item.titulo_pog || item.nome}
                      </span>
                    </div>
                    <div className="text-xs text-[var(--pog-text-muted)] truncate">{item.nome}</div>
                    {item.frase_abertura && (
                      <p className="text-xs text-[var(--pog-text-muted)] italic line-clamp-2 leading-relaxed">
                        &ldquo;{item.frase_abertura}&rdquo;
                      </p>
                    )}
                  </div>
                </div>

                {/* Score + nível */}
                <div className="text-right flex-shrink-0 space-y-1">
                  <div className="text-xl font-bold text-[var(--pog-secondary)]">{item.score_total} pts</div>
                  <NivelBadge nivel={item.nivel} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="mt-12 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 pog-btn-primary text-sm font-bold py-3 px-8 rounded-xl"
        >
          <IconHammer size={18} stroke={2.2} aria-hidden="true" />
          <span>Certificar meu projeto</span>
        </Link>
      </div>
    </div>
  )
}
