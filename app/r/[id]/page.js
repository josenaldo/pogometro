import { notFound } from 'next/navigation'
import { getResult } from '@/lib/storage'
import { ALL_ITEMS } from '@/lib/pog-catalog'

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
          stroke="#2d2d4e"
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
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        <div className="text-2xl font-bold text-white">{score}</div>
        <div className="text-xs text-slate-500">pts</div>
      </div>
    </div>
  )
}

function BadgeItem({ item }) {
  const corMap = {
    principio: 'border-blue-700 bg-blue-950/40 text-blue-300',
    tecnica: 'border-emerald-700 bg-emerald-950/40 text-emerald-300',
    gdp: 'border-amber-700 bg-amber-950/40 text-amber-300',
  }
  const labelMap = {
    principio: '📐 Princípio',
    tecnica: '🔧 Técnica',
    gdp: '🏗️ GDP',
  }

  return (
    <div className={`border rounded-xl p-4 space-y-2 ${corMap[item.tipo]}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-xs opacity-60">{labelMap[item.tipo]} · +{item.pontos} pts</span>
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
        className="inline-block text-xs underline opacity-50 hover:opacity-80 transition-opacity mt-1"
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
        className={`rounded-2xl border p-8 text-center space-y-4 ${nivel.bgCor || 'bg-violet-950/30'} ${nivel.bordaCor || 'border-violet-700'}`}
      >
        <div className="text-5xl">{nivel.emoji}</div>

        <div>
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">
            {data.tipo === 'profile' ? 'Perfil' : 'Repositório'} certificado
          </p>
          <h1 className={`text-2xl sm:text-3xl font-bold ${nivel.cor || 'text-violet-300'}`}>
            &ldquo;{data.titulo_pog}&rdquo;
          </h1>
          <p className="text-slate-400 text-sm mt-1">{data.nome_projeto}</p>
        </div>

        <ScoreRing score={data.score_total} />

        <div>
          <div className={`text-xl font-bold ${nivel.cor || 'text-violet-300'}`}>{nivel.nome}</div>
          <div className="text-sm text-slate-400 italic">{nivel.descricao}</div>
        </div>

        <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed italic">
          &ldquo;{data.frase_abertura}&rdquo;
        </p>

        {/* Resumo de conquistas */}
        <div className="flex items-center justify-center gap-6 text-sm pt-2">
          <div className="text-center">
            <div className="text-blue-400 font-bold text-lg">{principios.length}</div>
            <div className="text-slate-500 text-xs">Princípios</div>
          </div>
          <div className="text-slate-700">|</div>
          <div className="text-center">
            <div className="text-emerald-400 font-bold text-lg">{tecnicas.length}</div>
            <div className="text-slate-500 text-xs">Técnicas</div>
          </div>
          <div className="text-slate-700">|</div>
          <div className="text-center">
            <div className="text-amber-400 font-bold text-lg">{gdps.length}</div>
            <div className="text-slate-500 text-xs">GDPs</div>
          </div>
        </div>
      </div>

      {/* Gambi Design Patterns detectados */}
      {gdps.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-amber-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span>🏗️</span> Gambi Design Patterns Desbloqueados
            <span className="text-amber-600 font-normal normal-case tracking-normal">
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
          <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span>🔧</span> Técnicas Dominadas
            <span className="text-emerald-600 font-normal normal-case tracking-normal">
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
          <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span>📐</span> Princípios Incorporados
            <span className="text-blue-600 font-normal normal-case tracking-normal">
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
        <div className="text-center py-12 text-slate-500 space-y-2">
          <div className="text-5xl">🥚</div>
          <p className="text-lg font-semibold text-slate-400">Martelinho de Bebê</p>
          <p className="text-sm">
            Seu código ainda não apresenta sinais visíveis de POG. Mas há broto de potencial
            ali!
          </p>
        </div>
      )}

      {/* Comentário final da IA */}
      {data.comentario_final && (
        <div className="bg-[var(--pog-surface)] border border-[var(--pog-border)] rounded-xl p-5 text-center">
          <p className="text-sm text-slate-400 italic leading-relaxed">
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
          className="flex-1 sm:flex-none text-center bg-sky-800 hover:bg-sky-700 text-white text-sm font-medium py-3 px-6 rounded-xl transition-colors"
        >
          🐦 Compartilhar no Twitter/X
        </a>
        <a
          href={`https://wa.me/?text=${shareText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 sm:flex-none text-center bg-green-800 hover:bg-green-700 text-white text-sm font-medium py-3 px-6 rounded-xl transition-colors"
        >
          💬 Compartilhar no WhatsApp
        </a>
        <a
          href="/"
          className="flex-1 sm:flex-none text-center bg-[var(--pog-surface)] hover:bg-[var(--pog-border)] text-slate-300 text-sm font-medium py-3 px-6 rounded-xl border border-[var(--pog-border)] transition-colors"
        >
          ⚒️ Certificar outro projeto
        </a>
      </div>

      {/* Promo do livro */}
      <div className="bg-amber-950/30 border border-amber-800/50 rounded-2xl p-6 text-center space-y-3">
        <div className="text-2xl">📖</div>
        <h3 className="text-amber-400 font-semibold">Conheça o livro que definiu esses critérios</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Quer entender (e dominar) cada princípio, técnica e Gambi Design Pattern detectado? O
          livro <span className="text-amber-300 font-semibold">Programação Orientada a Gambiarra</span> está esperando por você.
        </p>
        <a
          href="https://livropog.com.br"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-amber-600 hover:bg-amber-500 text-black font-bold text-sm py-3 px-8 rounded-xl transition-colors"
        >
          Acessar o Livro POG →
        </a>
      </div>
    </div>
  )
}
