import { alpha } from '@mui/material/styles'

import { Palettes } from '@/styles/Palettes'

const BaseTheme = {
    palette: Palettes.dark,
    shape: {
        borderRadius: 4,
    },
    typography: {
        fontFamily:
            '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
        button: {
            textTransform: 'none',
            fontWeight: 700,
            letterSpacing: 0.15,
        },
    },
    scroll: ({ theme }) => ({
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        '&::-webkit-scrollbar': {
            width: '12px',
        },
        '&::-webkit-scrollbar-track': {
            backgroundColor: theme.palette.scroll.track,
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.scroll.thumb,
            borderRadius: '10px',
            border: `2px solid ${theme.palette.scroll.track}`,
        },
        '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: theme.palette.scroll.hover,
        },
    }),
    components: {
        MuiBox: {
            styleOverrides: {
                root: ({ theme }) => ({
                    '&::-webkit-scrollbar': {
                        width: '12px',
                    },
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: theme.palette.scroll.track,
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: theme.palette.scroll.thumb,
                        borderRadius: '10px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        backgroundColor: theme.palette.scroll.hover,
                    },
                }),
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: ({ theme }) => ({
                    '&::-webkit-scrollbar': {
                        width: '12px',
                    },
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: theme.palette.scroll.track,
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: theme.palette.scroll.thumb,
                        borderRadius: '10px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        backgroundColor: theme.palette.scroll.hover,
                    },
                }),
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
        MuiButton: {
            defaultProps: {
                disableElevation: true,
            },
            styleOverrides: {
                root: ({ theme }) => ({
                    borderRadius: theme.shape.borderRadius,
                    paddingInline: theme.spacing(2.5),
                    paddingBlock: theme.spacing(1.25),
                    fontWeight: 700,
                }),
                outlined: ({ theme }) => ({
                    borderColor: alpha(theme.palette.text.primary, 0.12),
                    '&:hover': {
                        borderColor: theme.palette.primary.main,
                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    },
                }),
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: ({ theme }) => ({
                    border: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
                }),
            },
        },
        MuiChip: {
            styleOverrides: {
                root: ({ theme }) => ({
                    fontWeight: 700,
                    borderRadius: theme.shape.borderRadius * 2.5,
                }),
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: ({ theme }) => ({
                    borderRadius: theme.shape.borderRadius,
                    backgroundColor: alpha(theme.palette.background.paper, theme.palette.mode === 'dark' ? 0.88 : 1),
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: alpha(theme.palette.text.primary, 0.12),
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: alpha(theme.palette.primary.main, 0.42),
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderWidth: 1,
                        borderColor: theme.palette.primary.main,
                    },
                }),
            },
        },
        MuiLink: {
            styleOverrides: {
                root: ({ theme }) => ({
                    textUnderlineOffset: '0.18em',
                    transition: 'color 160ms ease',
                    '&:hover': {
                        color: theme.palette.primary.main,
                    },
                }),
            },
        },
    },
}

const extendTheme = (theme) => {
    theme.brandGradient = `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
    theme.heroOverlay =
        theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, rgba(18, 18, 18, 0.84), rgba(18, 18, 18, 0.68) 40%, rgba(18, 18, 18, 0.92))'
            : 'linear-gradient(135deg, rgba(250, 250, 250, 0.88), rgba(250, 250, 250, 0.74) 40%, rgba(250, 250, 250, 0.92))'

    theme.typography.h1 = {
        fontSize: 'clamp(2.4rem, 8vw, 4.2rem)',
        fontWeight: 800,
        lineHeight: 1.02,
    }

    theme.typography.h2 = {
        fontSize: 'clamp(1.9rem, 6vw, 3rem)',
        fontWeight: 800,
        lineHeight: 1.08,
    }

    theme.typography.h3 = {
        fontSize: 'clamp(1.4rem, 4vw, 2rem)',
        fontWeight: 700,
        lineHeight: 1.14,
    }

    theme.typography.h4 = {
        fontSize: 'clamp(1.15rem, 3vw, 1.45rem)',
        fontWeight: 700,
        lineHeight: 1.2,
    }

    theme.typography.h5 = {
        fontSize: 'clamp(1rem, 2.2vw, 1.2rem)',
        fontWeight: 700,
    }

    theme.typography.subtitle1 = {
        fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
        lineHeight: 1.6,
        color: theme.palette.text.secondary,
    }

    theme.typography.overline = {
        fontSize: '0.72rem',
        fontWeight: 700,
        letterSpacing: '0.24em',
        textTransform: 'uppercase',
    }
}

export { BaseTheme, extendTheme }