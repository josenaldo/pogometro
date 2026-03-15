import './globals.css'
import Link from 'next/link'
import Script from 'next/script'
import { IconBook, IconHammer } from '@tabler/icons-react'

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

export const viewport = {
  themeColor: '#121212',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen flex flex-col antialiased">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-[var(--pog-border)] bg-[var(--pog-surface)]/95 backdrop-blur">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <IconHammer size={24} stroke={2.2} aria-hidden="true" />
              <div>
                <span className="font-bold pog-title-gradient">
                  Pogômetro
                </span>
                <span className="hidden sm:inline text-xs text-[var(--pog-text-muted)] ml-2">
                  Certificação Oficial de Gambiarra
                </span>
              </div>
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link
                href="/mural"
                className="text-[var(--pog-text-secondary)] hover:text-[var(--pog-primary)] transition-colors"
              >
                Mural da Fama
              </Link>
              <a
                href="https://livropog.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="pog-btn-secondary border border-transparent px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5"
              >
                <IconBook size={14} stroke={2.2} aria-hidden="true" />
                <span>O Livro</span>
              </a>
            </nav>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="mt-16 border-t border-[var(--pog-border)] bg-[var(--pog-surface)]">
          <div className="max-w-4xl mx-auto px-4 py-6 text-center text-xs text-[var(--pog-text-secondary)] space-y-1">
            <p>Nenhum código limpo foi criado durante o desenvolvimento deste site.</p>
            <p>
              Baseado no livro{' '}
              <a
                href="https://livropog.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="pog-link"
              >
                Programação Orientada a Gambiarra
              </a>{' '}
              por Josenaldo de Oliveira Matos Filho.
            </p>
            <p className="text-[var(--pog-text-subtle)]">
              © {new Date().getFullYear()} Pogômetro — powered by gambiarra, fé e token gratuito da Gemini.
            </p>
          </div>
        </footer>

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-57YXT306JW"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-57YXT306JW');
          `}
        </Script>
      </body>
    </html>
  )
}
