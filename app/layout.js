import './globals.css'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pogometro.com.br'

export const metadata = {
  title: {
    default: 'Pogômetro — Certificação Oficial de Gambiarra',
    template: '%s | Pogômetro',
  },
  description:
    'Analise o seu repositório GitHub e descubra quantos Princípios, Técnicas e Gambi Design Patterns do livro POG o seu projeto conquistou. Quanto mais gambiarra, maior a lenda!',
  metadataBase: new URL(siteUrl),
  openGraph: {
    siteName: 'Pogômetro',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@josenaldomatos',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen flex flex-col antialiased">
        {/* Header */}
        <header className="border-b border-[var(--pog-border)] bg-[var(--pog-surface)]/80 backdrop-blur sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 group">
              <span className="text-2xl">⚒️</span>
              <div>
                <span className="font-bold text-violet-300 group-hover:text-violet-200 transition-colors">
                  Pogômetro
                </span>
                <span className="hidden sm:inline text-xs text-slate-500 ml-2">
                  Certificação Oficial de Gambiarra
                </span>
              </div>
            </a>
            <nav className="flex items-center gap-4 text-sm">
              <a
                href="/mural"
                className="text-slate-400 hover:text-violet-300 transition-colors"
              >
                Mural da Fama
              </a>
              <a
                href="https://livropog.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 transition-colors border border-amber-700 hover:border-amber-500 px-3 py-1 rounded-full text-xs"
              >
                📖 O Livro
              </a>
            </nav>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="border-t border-[var(--pog-border)] bg-[var(--pog-surface)]/50 mt-16">
          <div className="max-w-4xl mx-auto px-4 py-6 text-center text-xs text-slate-500 space-y-1">
            <p>Nenhum código limpo foi criado durante o desenvolvimento deste site.</p>
            <p>
              Baseado no livro{' '}
              <a
                href="https://livropog.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-500 hover:text-amber-400 underline"
              >
                Programação Orientada a Gambiarra
              </a>{' '}
              por Josenaldo de Oliveira Matos Filho.
            </p>
            <p className="text-slate-600">
              © {new Date().getFullYear()} Pogômetro — powered by gambiarra, fé e token gratuito da Gemini.
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
