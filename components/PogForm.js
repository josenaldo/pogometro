'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { IconHammer } from '@tabler/icons-react'

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
        <label htmlFor="github-url" className="block text-sm text-[var(--pog-text-secondary)] mb-2">
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
          className="w-full bg-[var(--pog-surface)] border border-[var(--pog-border)] rounded-lg px-4 py-3 text-[var(--pog-text-primary)] placeholder-[var(--pog-text-subtle)] focus:outline-none focus:border-[var(--pog-primary)] focus:ring-1 focus:ring-[var(--pog-primary)] disabled:opacity-50 transition-colors text-sm"
        />
      </div>

      {/* Opção de privacidade */}
      <label className="flex items-center gap-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={publico}
          onChange={(e) => setPublico(e.target.checked)}
          disabled={loading}
          className="w-4 h-4 accent-[var(--pog-primary)] cursor-pointer"
        />
        <span className="text-sm text-[var(--pog-text-secondary)] group-hover:text-[var(--pog-text-primary)] transition-colors">
          Aparecer no{' '}
          <a href="/mural" className="pog-link" onClick={(e) => e.stopPropagation()}>
            Mural da Fama
          </a>{' '}
          com as grandes lendas POG
        </span>
      </label>

      {/* Erro */}
      {erro && (
        <div className="rounded-lg px-4 py-3 text-sm border" style={{ backgroundColor: 'var(--pog-danger-bg)', borderColor: 'var(--pog-danger-border)', color: 'var(--pog-danger-text)' }}>
          <span className="mr-2">⚠️</span>
          {erro}
        </div>
      )}

      {/* Botão */}
      <button
        type="submit"
        disabled={loading || !url.trim()}
        className="w-full pog-btn-primary font-bold py-3 px-6 rounded-lg text-sm tracking-wide uppercase"
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
          <span className="flex items-center justify-center gap-2">
            <IconHammer size={18} stroke={2.2} aria-hidden="true" />
            <span>Certificar Meu Projeto</span>
          </span>
        )}
      </button>

      {/* Mensagem de loading */}
      {loading && (
        <p className="text-center text-xs text-[var(--pog-text-muted)] italic animate-pulse">
          {loadingMsg}
        </p>
      )}
    </form>
  )
}
