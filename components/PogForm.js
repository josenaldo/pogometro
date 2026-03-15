'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Alert, Box, Button, Checkbox, CircularProgress, FormControlLabel, Link as MuiLink, Stack, TextField, Typography } from '@mui/material'
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
    <Stack component="form" onSubmit={handleSubmit} spacing={2.5}>
      <TextField
        id="github-url"
        label="URL do repositório ou perfil no GitHub"
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://github.com/usuario/repositorio"
        required
        fullWidth
        disabled={loading}
        autoComplete="off"
        inputProps={{ spellCheck: false, autoCapitalize: 'none', autoCorrect: 'off' }}
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={publico}
            onChange={(e) => setPublico(e.target.checked)}
            disabled={loading}
            color="primary"
          />
        }
        label={
          <Typography variant="body2" color="text.secondary">
            Aparecer no{' '}
            <MuiLink component={Link} href="/mural" onClick={(e) => e.stopPropagation()} underline="hover">
              Mural da Fama
            </MuiLink>{' '}
            com as grandes lendas POG
          </Typography>
        }
        sx={{ alignItems: 'flex-start', m: 0 }}
      />

      {erro ? (
        <Alert severity="error" variant="outlined">
          {erro}
        </Alert>
      ) : null}

      <Button
        type="submit"
        variant="contained"
        color="primary"
        size="large"
        fullWidth
        disabled={loading || !url.trim()}
        startIcon={
          loading ? <CircularProgress size={18} color="inherit" /> : <IconHammer size={18} stroke={2.2} />
        }
        sx={{ py: 1.6 }}
      >
        {loading ? 'Certificando...' : 'Certificar meu projeto'}
      </Button>

      {loading ? (
        <Box>
          <Typography variant="caption" color="text.secondary" textAlign="center" sx={{ display: 'block', fontStyle: 'italic' }}>
            {loadingMsg}
          </Typography>
        </Box>
      ) : null}
    </Stack>
  )
}
