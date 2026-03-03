'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const LOADING_MESSAGES = [
  'Contando as variáveis de uma letra...',
  'Avaliando a qualidade dos comentários "// não sei por que funciona"...',
  'Calculando a quantidade de TODO comments com mais de 1 ano...',
  'Verificando se o README tem mais que duas linhas...',
  'Analisando os commits "agora vai" e "fix do fix"...',
  'Detectando hardcodes suspeitos na camada de negócio...',
  'Consultando o Oráculo da Gambiarra...',
  'Verificando presença de _FINAL_v2_AGORA_VAI no repositório...',
  'Auditando a arquitetura de camadas (ou a ausência delas)...',
  'Invocando o Mjolnir da Análise POG...',
]

export default function PogForm() {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [publico, setPublico] = useState(true)
  const [loading, setLoading] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0])
  const [erro, setErro] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!url.trim()) return

    setErro(null)
    setLoading(true)
    setLoadingMsg(LOADING_MESSAGES[0])

    // Rotaciona mensagens de loading
    let msgIndex = 0
    const msgInterval = setInterval(() => {
      msgIndex = (msgIndex + 1) % LOADING_MESSAGES.length
      setLoadingMsg(LOADING_MESSAGES[msgIndex])
    }, 2500)

    try {
      const res = await fetch('/api/avaliar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ githubUrl: url.trim(), publico }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErro(data.erro || 'Erro inesperado. Tente novamente.')
        return
      }

      router.push(`/r/${data.id}`)
    } catch {
      setErro('Falha na conexão. Verifique sua internet e tente novamente.')
    } finally {
      clearInterval(msgInterval)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      {/* Input URL */}
      <div>
        <label htmlFor="github-url" className="block text-sm text-slate-400 mb-2">
          URL do repositório ou perfil no GitHub
        </label>
        <input
          id="github-url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://github.com/usuario/repositorio"
          required
          disabled={loading}
          className="w-full bg-[var(--pog-surface)] border border-[var(--pog-border)] rounded-lg px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 disabled:opacity-50 transition-colors text-sm"
        />
      </div>

      {/* Opção de privacidade */}
      <label className="flex items-center gap-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={publico}
          onChange={(e) => setPublico(e.target.checked)}
          disabled={loading}
          className="w-4 h-4 accent-violet-500 cursor-pointer"
        />
        <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
          Aparecer no{' '}
          <a href="/mural" className="text-violet-400 underline hover:text-violet-300" onClick={(e) => e.stopPropagation()}>
            Mural da Fama
          </a>{' '}
          com as grandes lendas POG
        </span>
      </label>

      {/* Erro */}
      {erro && (
        <div className="bg-red-950/50 border border-red-800 rounded-lg px-4 py-3 text-red-300 text-sm">
          <span className="mr-2">⚠️</span>
          {erro}
        </div>
      )}

      {/* Botão */}
      <button
        type="submit"
        disabled={loading || !url.trim()}
        className="w-full bg-violet-700 hover:bg-violet-600 disabled:bg-violet-900 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-lg transition-colors text-sm tracking-wide uppercase"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="flex gap-1">
              <span className="pog-loading-dot w-2 h-2 bg-white rounded-full inline-block" />
              <span className="pog-loading-dot w-2 h-2 bg-white rounded-full inline-block" />
              <span className="pog-loading-dot w-2 h-2 bg-white rounded-full inline-block" />
            </span>
            Certificando...
          </span>
        ) : (
          '⚒️ Certificar Meu Projeto'
        )}
      </button>

      {/* Mensagem de loading */}
      {loading && (
        <p className="text-center text-xs text-slate-500 italic animate-pulse">
          {loadingMsg}
        </p>
      )}
    </form>
  )
}
