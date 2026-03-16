import './globals.css'
import { Box } from '@mui/material'
import Script from 'next/script'

import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import {
    DEFAULT_OG_IMAGE,
    SITE_AUTHOR,
    SITE_DESCRIPTION,
    SITE_KEYWORDS,
    SITE_NAME,
    SITE_TITLE,
    SITE_TITLE_TEMPLATE,
    SITE_URL,
    TWITTER_HANDLE,
} from '@/lib/seo'

import { Providers } from './providers'

export const metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: SITE_TITLE,
        template: SITE_TITLE_TEMPLATE,
    },
    description: SITE_DESCRIPTION,
    applicationName: SITE_NAME,
    authors: [{ name: SITE_AUTHOR, url: 'https://josenaldo.com' }],
    creator: SITE_AUTHOR,
    publisher: SITE_NAME,
    keywords: SITE_KEYWORDS,
    category: 'technology',
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
        url: SITE_URL,
        siteName: 'Pogômetro',
        locale: 'pt_BR',
        type: 'website',
        images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
        card: 'summary_large_image',
        creator: TWITTER_HANDLE,
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
        images: [DEFAULT_OG_IMAGE.url],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
        },
    },
    manifest: '/manifest.webmanifest',
    icons: {
        icon: [{ url: '/icons/favicon-48x48.png', sizes: '48x48', type: 'image/png' }],
        shortcut: ['/icons/favicon-48x48.png'],
        apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
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
                            backgroundImage:
                                'radial-gradient(circle at top, rgba(103, 58, 183, 0.1), transparent 32%), radial-gradient(circle at bottom right, rgba(139, 195, 74, 0.08), transparent 26%)',
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
