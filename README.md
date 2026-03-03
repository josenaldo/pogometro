# Pogômetro

**A Certificação Oficial de Gambiarra** — analise um repositório GitHub e descubra quantos Princípios, Técnicas e Gambi Design Patterns do livro [Programação Orientada a Gambiarra](https://livropog.com.br) o seu projeto conquistou. Quanto mais gambiarra, maior a lenda!

---

## Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: Tailwind CSS v4
- **IA**: Google Gemini 2.0 Flash (via REST, sem SDK)
- **Storage**: Upstash Redis (via REST, sem SDK)
- **GitHub data**: GitHub REST API
- **Deploy**: Vercel (free tier)

---

## Setup rápido

```bash
# 1. Clone e instale
git clone https://github.com/josenaldo/pogometro.git
cd pogometro
npm install

# 2. Configure as chaves
cp .env.example .env.local
# edite .env.local com suas chaves (ver tabela abaixo)

# 3. Rode
npm run dev
```

### Variáveis de ambiente

| Variável | Como obter | Obrigatória |
|---|---|---|
| `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/app/apikey) — Free: 1.500 req/dia | ✅ |
| `UPSTASH_REDIS_REST_URL` | [Upstash Console](https://console.upstash.com) — Free: 10k ops/dia | ✅ |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Console (mesmo banco) | ✅ |
| `GITHUB_TOKEN` | [GitHub Tokens](https://github.com/settings/tokens) — aumenta limite de 60 para 5.000 req/hora | Recomendado |
| `NEXT_PUBLIC_SITE_URL` | URL pública sem barra final | Em produção |

---

## Escala de Mjolnir

| Pontos | Martelo | Título |
|---|---|---|
| 0–5 | 🔨 | Martelinho de Bebê |
| 6–15 | 🪚 | Martelo de Carpinteiro |
| 16–30 | ⚒️ | Marreta do Pedreiro |
| 31–45 | ⚡ | Mjolnir |
| 46+ | 🪓 | Rompe Tormentas |

---

Baseado no livro **Programação Orientada a Gambiarra** — [livropog.com.br](https://livropog.com.br)
