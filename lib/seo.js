const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pogometro.com.br'
const SITE_NAME = 'Pogômetro'
const SITE_TITLE = 'Pogômetro — Certificação Oficial de Gambiarra'
const SITE_TITLE_TEMPLATE = '%s | Pogômetro'
const SITE_DESCRIPTION =
    'Cole a URL de um repositório ou perfil no GitHub e descubra quantos Princípios, Técnicas e Gambi Design Patterns do livro POG o seu projeto conquistou.'
const TWITTER_HANDLE = '@josenaldomatos'
const SITE_AUTHOR = 'Josenaldo de Oliveira Matos Filho'
const DEFAULT_OG_IMAGE = {
    url: '/images/og/pogometro-share.jpg',
    width: 1200,
    height: 630,
    alt: SITE_TITLE,
    type: 'image/jpeg',
}
const SITE_KEYWORDS = [
    'pogometro',
    'programacao orientada a gambiarra',
    'gambiarra',
    'github',
    'certificacao github',
    'codigo legado',
    'code review divertido',
    'analise de repositorio',
]

function normalizePath(pathname = '/') {
    if (!pathname || pathname === '/') return '/'
    return pathname.startsWith('/') ? pathname : `/${pathname}`
}

export function absoluteUrl(pathname = '/') {
    return new URL(normalizePath(pathname), SITE_URL).toString()
}

function resolveImage(image = DEFAULT_OG_IMAGE) {
    const source = typeof image === 'string' ? { url: image } : image
    const url = source.url || DEFAULT_OG_IMAGE.url

    return {
        ...DEFAULT_OG_IMAGE,
        ...source,
        url: url.startsWith('http') ? url : absoluteUrl(url),
    }
}

export function buildMetadata({
    title,
    description = SITE_DESCRIPTION,
    path = '/',
    image = DEFAULT_OG_IMAGE,
    type = 'website',
    noIndex = false,
    keywords = SITE_KEYWORDS,
} = {}) {
    const normalizedPath = normalizePath(path)
    const canonicalUrl = absoluteUrl(normalizedPath)
    const resolvedImage = resolveImage(image)
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_TITLE

    return {
        title: normalizedPath === '/' ? { absolute: SITE_TITLE } : title,
        description,
        keywords,
        alternates: {
            canonical: normalizedPath,
        },
        openGraph: {
            title: fullTitle,
            description,
            url: canonicalUrl,
            siteName: SITE_NAME,
            locale: 'pt_BR',
            type,
            images: [resolvedImage],
        },
        twitter: {
            card: 'summary_large_image',
            creator: TWITTER_HANDLE,
            title: fullTitle,
            description,
            images: [resolvedImage.url],
        },
        ...(noIndex
            ? {
                robots: {
                    index: false,
                    follow: false,
                    googleBot: {
                        index: false,
                        follow: false,
                        noimageindex: true,
                    },
                },
            }
            : {}),
    }
}

export {
    DEFAULT_OG_IMAGE,
    SITE_AUTHOR,
    SITE_DESCRIPTION,
    SITE_KEYWORDS,
    SITE_NAME,
    SITE_TITLE,
    SITE_TITLE_TEMPLATE,
    SITE_URL,
    TWITTER_HANDLE,
}