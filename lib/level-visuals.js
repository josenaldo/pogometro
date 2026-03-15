import { alpha } from '@mui/material/styles'

const LEVEL_TONES = {
    martelinho: 'info',
    carpinteiro: 'secondary',
    marreta: 'primary',
    mjolnir: 'warning',
    'rompe-tormentas': 'error',
}

const ITEM_TONES = {
    principio: 'info',
    tecnica: 'secondary',
    gdp: 'warning',
}

export function getLevelTone(nivel = {}) {
    return nivel.tone || LEVEL_TONES[nivel.id] || 'primary'
}

export function getItemTone(tipo) {
    return ITEM_TONES[tipo] || 'primary'
}

export function getTonePalette(theme, tone) {
    const palette = theme.palette[tone] || theme.palette.primary

    return {
        tone,
        main: palette.main,
        dark: palette.dark || palette.main,
        light: palette.light || palette.main,
        contrastText: palette.contrastText || theme.palette.text.primary,
        border: alpha(palette.main, theme.palette.mode === 'dark' ? 0.44 : 0.3),
        background: alpha(palette.main, theme.palette.mode === 'dark' ? 0.16 : 0.1),
        softBackground: alpha(palette.main, theme.palette.mode === 'dark' ? 0.12 : 0.06),
    }
}

export function getLevelPalette(theme, nivel = {}) {
    return getTonePalette(theme, getLevelTone(nivel))
}

export function getItemPalette(theme, tipo) {
    return getTonePalette(theme, getItemTone(tipo))
}