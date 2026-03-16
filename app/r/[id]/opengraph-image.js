import { ImageResponse } from 'next/og'

import { SITE_NAME, SITE_TAGLINE } from '@/lib/seo'
import { getResult } from '@/lib/storage'
import { MAX_SCORE } from '@/lib/pog-catalog'

export const runtime = 'nodejs'
export const size = {
    width: 1200,
    height: 630,
}
export const contentType = 'image/png'

const LEVEL_STYLES = {
    default: {
        accent: '#673ab7',
        soft: '#ede7f6',
        glow: 'rgba(103, 58, 183, 0.28)',
    },
    martelinho: {
        accent: '#2e7d32',
        soft: '#e8f5e9',
        glow: 'rgba(46, 125, 50, 0.24)',
    },
    serrote: {
        accent: '#ef6c00',
        soft: '#fff3e0',
        glow: 'rgba(239, 108, 0, 0.24)',
    },
    marreta: {
        accent: '#6d4c41',
        soft: '#efebe9',
        glow: 'rgba(109, 76, 65, 0.24)',
    },
    mjolnir: {
        accent: '#1565c0',
        soft: '#e3f2fd',
        glow: 'rgba(21, 101, 192, 0.24)',
    },
    'rompe-tormentas': {
        accent: '#8e24aa',
        soft: '#f3e5f5',
        glow: 'rgba(142, 36, 170, 0.24)',
    },
}

function getLevelStyle(levelId) {
    return LEVEL_STYLES[levelId] || LEVEL_STYLES.default
}

function truncate(text, maxLength) {
    if (!text) return ''
    if (text.length <= maxLength) return text
    return `${text.slice(0, maxLength - 1).trimEnd()}…`
}

function buildFallbackImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '56px',
                    background: 'linear-gradient(135deg, #f7f5fb 0%, #ffffff 55%, #e8f5e9 100%)',
                    color: '#120f1c',
                    fontFamily: 'sans-serif',
                }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <div style={{ display: 'flex', fontSize: 26, fontWeight: 700, color: '#673ab7' }}>
                        {SITE_NAME}
                    </div>
                    <div style={{ display: 'flex', fontSize: 64, fontWeight: 800, lineHeight: 1.05 }}>
                        Certificado POG nao encontrado
                    </div>
                    <div style={{ display: 'flex', maxWidth: '860px', fontSize: 28, lineHeight: 1.4, color: '#4a4458' }}>
                        Esse resultado nao existe mais ou expirou. Gere uma nova avaliacao para produzir um certificado compartilhavel.
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div style={{ display: 'flex', fontSize: 22, color: '#5f5a6b' }}>{SITE_TAGLINE}</div>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '999px',
                            background: '#ede7f6',
                            color: '#673ab7',
                            padding: '14px 22px',
                            fontSize: 20,
                            fontWeight: 700,
                        }}
                    >
                        pogometro.com.br
                    </div>
                </div>
            </div>
        ),
        size
    )
}

export default async function OpengraphImage({ params }) {
    const { id } = await params
    const data = await getResult(id).catch(() => null)

    if (!data) {
        return buildFallbackImage()
    }

    const levelStyle = getLevelStyle(data.nivel?.id)
    const score = Number(data.score_total) || 0
    const progress = Math.max(8, Math.min(Math.round((score / MAX_SCORE) * 100), 100))
    const projectName = truncate(data.nome_projeto || 'Projeto sem nome', 54)
    const certificateTitle = truncate(data.titulo_pog || 'Certificado POG', 80)
    const openingText = truncate(data.frase_abertura || SITE_TAGLINE, 170)
    const levelName = data.nivel?.nome || 'Nivel POG'
    const badges = [
        `${score}/${MAX_SCORE} pts`,
        levelName,
        data.tipo === 'profile' ? 'Perfil GitHub' : 'Repositorio GitHub',
    ]

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '48px',
                    background: `radial-gradient(circle at top left, ${levelStyle.glow} 0%, transparent 32%), linear-gradient(135deg, #f7f5fb 0%, #ffffff 55%, ${levelStyle.soft} 100%)`,
                    color: '#120f1c',
                    fontFamily: 'sans-serif',
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '760px' }}>
                        <div style={{ display: 'flex', fontSize: 24, fontWeight: 700, color: levelStyle.accent }}>
                            {SITE_NAME}
                        </div>
                        <div style={{ display: 'flex', fontSize: 26, color: '#5f5a6b' }}>
                            Certificacao oficial de gambiarra
                        </div>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            gap: '10px',
                        }}
                    >
                        <div style={{ display: 'flex', fontSize: 20, color: '#5f5a6b' }}>Score POG</div>
                        <div style={{ display: 'flex', fontSize: 74, fontWeight: 800, color: levelStyle.accent }}>
                            {String(score)}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', fontSize: 28, color: '#5f5a6b' }}>{projectName}</div>
                        <div style={{ display: 'flex', fontSize: 62, fontWeight: 800, lineHeight: 1.05 }}>
                            {certificateTitle}
                        </div>
                    </div>

                    <div style={{ display: 'flex', maxWidth: '980px', fontSize: 30, lineHeight: 1.35, color: '#2f2936' }}>
                        {openingText}
                    </div>

                    <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                        {badges.map((badge) => (
                            <div
                                key={badge}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '999px',
                                    padding: '12px 18px',
                                    background: '#ffffff',
                                    border: `2px solid ${levelStyle.soft}`,
                                    color: '#372f3f',
                                    fontSize: 22,
                                    fontWeight: 700,
                                }}
                            >
                                {badge}
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div
                        style={{
                            display: 'flex',
                            width: '100%',
                            height: '18px',
                            borderRadius: '999px',
                            background: 'rgba(18, 15, 28, 0.08)',
                            overflow: 'hidden',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                width: `${progress}%`,
                                height: '100%',
                                borderRadius: '999px',
                                background: levelStyle.accent,
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', fontSize: 22, color: '#5f5a6b' }}>{SITE_TAGLINE}</div>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '999px',
                                background: levelStyle.soft,
                                color: levelStyle.accent,
                                padding: '14px 22px',
                                fontSize: 20,
                                fontWeight: 700,
                            }}
                        >
                            {SITE_NAME}
                        </div>
                    </div>
                </div>
            </div>
        ),
        size
    )
}