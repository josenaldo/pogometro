const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pogometro.com.br'
const SITE_NAME = 'Pogômetro'
const SITE_TITLE = 'Pogômetro — Certificação Oficial de Gambiarra'
const SITE_TITLE_TEMPLATE = '%s | Pogômetro'
const SITE_DESCRIPTION =
    'Cole a URL de um repositório ou perfil no GitHub e descubra quantos Princípios, Técnicas e Gambi Design Patterns do livro POG o seu projeto conquistou.'
const SITE_TAGLINE = 'A certificação oficial de gambiarra para repositórios e perfis no GitHub.'
const TWITTER_HANDLE = '@josenaldomatos'
const SITE_AUTHOR = 'Josenaldo de Oliveira Matos Filho'
const SITE_AUTHOR_URL = 'https://josenaldo.com'
const BOOK_URL = 'https://livropog.com.br'
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

export function serializeJsonLd(data) {
    return JSON.stringify(data).replace(/</g, '\\u003c')
}

export function buildWebSiteJsonLd() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${SITE_URL}#website`,
        url: SITE_URL,
        name: SITE_NAME,
        alternateName: SITE_TITLE,
        description: SITE_DESCRIPTION,
        inLanguage: 'pt-BR',
        publisher: {
            '@type': 'Person',
            '@id': `${SITE_AUTHOR_URL}#person`,
            name: SITE_AUTHOR,
            url: SITE_AUTHOR_URL,
        },
        about: {
            '@type': 'Book',
            name: 'Programação Orientada a Gambiarra',
            url: BOOK_URL,
        },
    }
}

export function buildSoftwareApplicationJsonLd() {
    return {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        '@id': `${SITE_URL}#app`,
        name: SITE_NAME,
        url: SITE_URL,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Web',
        description: SITE_DESCRIPTION,
        slogan: SITE_TAGLINE,
        inLanguage: 'pt-BR',
        isAccessibleForFree: true,
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'BRL',
        },
        author: {
            '@type': 'Person',
            '@id': `${SITE_AUTHOR_URL}#person`,
            name: SITE_AUTHOR,
            url: SITE_AUTHOR_URL,
        },
        image: absoluteUrl(DEFAULT_OG_IMAGE.url),
        sameAs: [BOOK_URL],
        featureList: [
            'Avalia repositórios e perfis no GitHub com base nos princípios do livro POG',
            'Gera certificado compartilhável com score, nível e diagnóstico de gambiarra',
            'Exibe mural público e ranking com os maiores scores do Pogômetro',
        ],
    }
}

export {
    BOOK_URL,
    DEFAULT_OG_IMAGE,
    SITE_AUTHOR,
    SITE_AUTHOR_URL,
    SITE_DESCRIPTION,
    SITE_KEYWORDS,
    SITE_NAME,
    SITE_TAGLINE,
    SITE_TITLE,
    SITE_TITLE_TEMPLATE,
    SITE_URL,
    TWITTER_HANDLE,
}