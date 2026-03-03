export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center space-y-6">
      <div className="text-6xl">🔨</div>
      <h1 className="text-2xl font-bold pog-title-gradient">
        404 — Avaliação não encontrada
      </h1>
      <p className="text-slate-400 text-sm">
        Este resultado pode ter expirado (TTL de 90 dias) ou o UUID tá errado. Clássico hardcode
        de link, né?
      </p>
      <a
        href="/"
        className="inline-block bg-violet-700 hover:bg-violet-600 text-white text-sm font-medium py-3 px-8 rounded-xl transition-colors"
      >
        ⚒️ Certificar um novo projeto
      </a>
    </div>
  )
}
