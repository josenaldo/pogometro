import './globals.css'
import { Box } from '@mui/material'
import Script from 'next/script'

import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'

import { Providers } from './providers'

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
    themeColor: '#673ab7',
}

export default function RootLayout({ children }) {
    return (
        <html lang="pt-BR">
            <body suppressHydrationWarning>
                <Providers>
                    <Box
                        sx={{
                            minHeight: '100vh',
                            display: 'flex',
                            flexDirection: 'column',
                            backgroundColor: 'background.default',
                        }}
                    >
                        <SiteHeader />
                        <Box component="main" sx={{ flex: 1 }}>
                            {children}
                        </Box>
                        <SiteFooter />
                    </Box>
                </Providers>
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
