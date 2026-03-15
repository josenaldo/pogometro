import Link from 'next/link'
import {
  IconBook,
  IconBrandWhatsapp,
  IconBrandX,
  IconBuilding,
  IconEgg,
  IconHammer,
  IconTool,
} from '@tabler/icons-react'
import { notFound } from 'next/navigation'

import NivelIcon from '@/components/NivelIcon'
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

function ScoreRing({ score, max = 87 }) {
  const radius = 45
  const circumference = 2 * Math.PI * radius
  const pct = Math.min(score / max, 1)
  const offset = circumference * (1 - pct)

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="120" height="120" viewBox="0 0 100 100" className="-rotate-90">
        <circle
          cx="50" cy="50" r={radius}
          fill="none"
          stroke="var(--pog-border)"
          strokeWidth="8"
        />
        <circle
          cx="50" cy="50" r={radius}
          fill="none"
          stroke="url(#scoreGrad)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
        />
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--pog-primary)" />
            <stop offset="100%" stopColor="var(--pog-secondary)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        <div className="text-2xl font-bold text-[var(--pog-text-primary)]">{score}</div>
        <div className="text-xs text-[var(--pog-text-muted)]">pts</div>
      </div>
    </div>
  )
}

function BadgeItem({ item }) {
  const toneMap = {
    principio: {
      borderColor: 'var(--pog-info-strong)',
      backgroundColor: 'var(--pog-info-bg)',
      color: 'var(--pog-info)',
    },
    tecnica: {
      borderColor: 'var(--pog-secondary-hover)',
      backgroundColor: 'var(--pog-secondary-bg)',
      color: 'var(--pog-secondary)',
    },
    gdp: {
      borderColor: 'var(--pog-warning-strong)',
      backgroundColor: 'var(--pog-warning-bg)',
      color: 'var(--pog-warning)',
    },
  }

  const tone = toneMap[item.tipo] || toneMap.principio

  const labelMap = {
    principio: { label: 'Princípio', Icon: IconHammer },
    tecnica: { label: 'Técnica', Icon: IconTool },
    gdp: { label: 'GDP', Icon: IconBuilding },
  }

  const labelConfig = labelMap[item.tipo] || labelMap.principio
  const LabelIcon = labelConfig.Icon

  return (
    <div className="border rounded-xl p-4 space-y-2" style={tone}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-xs opacity-60 inline-flex items-center gap-1.5">
            <LabelIcon size={14} stroke={2.2} aria-hidden="true" />
            <span>{labelConfig.label} · +{item.pontos} pts</span>
          </span>
          <h3 className="font-semibold text-sm leading-snug mt-0.5">{item.nome}</h3>
        </div>
      </div>
      {item.evidencias && item.evidencias.length > 0 && (
        <ul className="space-y-1">
          {item.evidencias.map((ev, i) => (
            <li key={i} className="text-xs opacity-80 flex items-start gap-1.5">
              <span className="mt-0.5 flex-shrink-0">•</span>
              <span>{ev}</span>
            </li>
          ))}
        </ul>
      )}
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block text-xs pog-link mt-1"
      >
        Ver no livro →
      </a>
    </div>
  )
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

  const principios = data.itens_detectados?.filter((i) => i.tipo === 'principio') || []
  const tecnicas = data.itens_detectados?.filter((i) => i.tipo === 'tecnica') || []
  const gdps = data.itens_detectados?.filter((i) => i.tipo === 'gdp') || []
  const nivel = data.nivel || {}
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pogometro.com.br'
  const shareUrl = `${siteUrl}/r/${id}`
  const shareText = encodeURIComponent(
    `Meu projeto conquistou ${data.score_total} pts no Pogômetro e atingiu o nível "${nivel.nome}"! ${nivel.emoji} — "${data.titulo_pog}"\n\nConfira: ${shareUrl}`
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      {/* Cabeçalho do resultado */}
      <div
        className={`rounded-2xl border p-8 text-center space-y-4 ${nivel.bgCor || 'bg-[var(--pog-primary-bg)]'} ${nivel.bordaCor || 'border-[var(--pog-primary-strong)]'}`}
      >
        <div className="flex justify-center">
          <NivelIcon nivelId={nivel.id} size={50} className={nivel.cor || 'text-[var(--pog-primary)]'} />
        </div>

        <div>
          <p className="text-xs text-[var(--pog-text-muted)] uppercase tracking-widest mb-1">
            {data.tipo === 'profile' ? 'Perfil' : 'Repositório'} certificado
          </p>
          <h1 className={`text-2xl sm:text-3xl font-bold ${nivel.cor || 'text-[var(--pog-primary)]'}`}>
            &ldquo;{data.titulo_pog}&rdquo;
          </h1>
          <p className="text-[var(--pog-text-secondary)] text-sm mt-1">{data.nome_projeto}</p>
        </div>

        <ScoreRing score={data.score_total} />

        <div>
          <div className={`text-xl font-bold ${nivel.cor || 'text-[var(--pog-primary)]'}`}>{nivel.nome}</div>
          <div className="text-sm text-[var(--pog-text-secondary)] italic">{nivel.descricao}</div>
        </div>

        <p className="text-[var(--pog-text-secondary)] text-sm max-w-xl mx-auto leading-relaxed italic">
          &ldquo;{data.frase_abertura}&rdquo;
        </p>

        {/* Resumo de conquistas */}
        <div className="flex items-center justify-center gap-6 text-sm pt-2">
          <div className="text-center">
            <div className="text-[var(--pog-info)] font-bold text-lg">{principios.length}</div>
            <div className="text-[var(--pog-text-muted)] text-xs">Princípios</div>
          </div>
          <div className="text-[var(--pog-text-subtle)]">|</div>
          <div className="text-center">
            <div className="text-[var(--pog-secondary)] font-bold text-lg">{tecnicas.length}</div>
            <div className="text-[var(--pog-text-muted)] text-xs">Técnicas</div>
          </div>
          <div className="text-[var(--pog-text-subtle)]">|</div>
          <div className="text-center">
            <div className="text-[var(--pog-warning)] font-bold text-lg">{gdps.length}</div>
            <div className="text-[var(--pog-text-muted)] text-xs">GDPs</div>
          </div>
        </div>
      </div>

      {/* Gambi Design Patterns detectados */}
      {gdps.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-[var(--pog-warning)] uppercase tracking-widest mb-4 flex items-center gap-2">
            <IconBuilding size={18} stroke={2.2} aria-hidden="true" />
            <span>Gambi Design Patterns Desbloqueados</span>
            <span className="text-[var(--pog-warning-strong)] font-normal normal-case tracking-normal">
              (+{gdps.reduce((s, i) => s + i.pontos, 0)} pts)
            </span>
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {gdps.map((item) => (
              <BadgeItem key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Técnicas detectadas */}
      {tecnicas.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-[var(--pog-secondary)] uppercase tracking-widest mb-4 flex items-center gap-2">
            <IconTool size={18} stroke={2.2} aria-hidden="true" />
            <span>Técnicas Dominadas</span>
            <span className="text-[var(--pog-secondary-hover)] font-normal normal-case tracking-normal">
              (+{tecnicas.reduce((s, i) => s + i.pontos, 0)} pts)
            </span>
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {tecnicas.map((item) => (
              <BadgeItem key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Princípios detectados */}
      {principios.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-[var(--pog-info)] uppercase tracking-widest mb-4 flex items-center gap-2">
            <IconHammer size={18} stroke={2.2} aria-hidden="true" />
            <span>Princípios Incorporados</span>
            <span className="text-[var(--pog-info-strong)] font-normal normal-case tracking-normal">
              (+{principios.reduce((s, i) => s + i.pontos, 0)} pts)
            </span>
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {principios.map((item) => (
              <BadgeItem key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Nenhum item */}
      {data.itens_detectados?.length === 0 && (
        <div className="text-center py-12 text-[var(--pog-text-muted)] space-y-2">
          <div className="flex justify-center">
            <IconEgg size={46} stroke={2.2} className="text-[var(--pog-text-secondary)]" aria-hidden="true" />
          </div>
          <p className="text-lg font-semibold text-[var(--pog-text-secondary)]">Martelinho de Bebê</p>
          <p className="text-sm">
            Seu código ainda não apresenta sinais visíveis de POG. Mas há broto de potencial
            ali!
          </p>
        </div>
      )}

      {/* Comentário final da IA */}
      {data.comentario_final && (
        <div className="pog-card rounded-xl p-5 text-center">
          <p className="text-sm text-[var(--pog-text-secondary)] italic leading-relaxed">
            &ldquo;{data.comentario_final}&rdquo;
          </p>
        </div>
      )}

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href={`https://twitter.com/intent/tweet?text=${shareText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 text-center pog-btn-primary text-sm font-bold py-3 px-6 rounded-xl"
        >
          <IconBrandX size={18} stroke={2.2} aria-hidden="true" />
          <span>Compartilhar no Twitter/X</span>
        </a>
        <a
          href={`https://wa.me/?text=${shareText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 text-center pog-btn-secondary text-sm font-bold py-3 px-6 rounded-xl"
        >
          <IconBrandWhatsapp size={18} stroke={2.2} aria-hidden="true" />
          <span>Compartilhar no WhatsApp</span>
        </a>
        <Link
          href="/"
          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 text-center pog-btn-outline text-sm font-bold py-3 px-6 rounded-xl"
        >
          <IconHammer size={18} stroke={2.2} aria-hidden="true" />
          <span>Certificar outro projeto</span>
        </Link>
      </div>

      {/* Promo do livro */}
      <div className="bg-[var(--pog-warning-bg)] border border-[var(--pog-warning-strong)] rounded-2xl p-6 text-center space-y-3">
        <div className="flex justify-center">
          <IconBook size={28} stroke={2.2} className="text-[var(--pog-warning)]" aria-hidden="true" />
        </div>
        <h3 className="text-[var(--pog-warning)] font-semibold">Conheça o livro que definiu esses critérios</h3>
        <p className="text-sm text-[var(--pog-text-secondary)] max-w-md mx-auto">
          Quer entender (e dominar) cada princípio, técnica e Gambi Design Pattern detectado? O
          livro <span className="text-[var(--pog-warning)] font-semibold">Programação Orientada a Gambiarra</span> está esperando por você.
        </p>
        <a
          href="https://livropog.com.br"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block pog-btn-secondary font-bold text-sm py-3 px-8 rounded-xl"
        >
          Acessar o Livro POG →
        </a>
      </div>
    </div>
  )
}
