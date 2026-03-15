'use client'

import Link from 'next/link'

import { Box, Chip, Paper, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'

import NivelIcon from '@/components/NivelIcon'
import { getLevelPalette } from '@/lib/level-visuals'

function NivelBadge({ nivel }) {
    return (
        <Box
            sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                color: (theme) => getLevelPalette(theme, nivel).main,
            }}
        >
            <NivelIcon nivelId={nivel?.id} size={16} />
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'inherit' }}>
                {nivel?.nome}
            </Typography>
        </Box>
    )
}

function getDisplayName(item) {
    return item.nome || item.nome_projeto || 'Projeto sem nome'
}

export default function PublicResultsList({ resultados }) {
    return (
        <Stack spacing={2}>
            {resultados.map((item, index) => {
                const displayName = getDisplayName(item)

                return (
                    <Paper
                        key={item.id}
                        component={Link}
                        href={`/r/${item.id}`}
                        variant="outlined"
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            textDecoration: 'none',
                            borderColor: (theme) => alpha(theme.palette.text.primary, 0.08),
                            transition: 'border-color 160ms ease, transform 160ms ease, box-shadow 160ms ease',
                            '&:hover': {
                                transform: 'translateY(-1px)',
                                borderColor: (theme) => getLevelPalette(theme, item.nivel).border,
                                boxShadow: (theme) => `0 18px 40px ${alpha(theme.palette.common.black, theme.palette.mode === 'dark' ? 0.24 : 0.1)}`,
                            },
                            '&:hover .mural-title': {
                                color: (theme) => getLevelPalette(theme, item.nivel).main,
                            },
                        }}
                    >
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) auto' },
                                gap: 2.5,
                                alignItems: 'start',
                            }}
                        >
                            <Stack direction="row" spacing={2} alignItems="flex-start">
                                <Typography variant="overline" color="text.secondary" sx={{ minWidth: 30 }}>
                                    #{index + 1}
                                </Typography>

                                <Stack spacing={1} sx={{ minWidth: 0, flex: 1 }}>
                                    <Stack direction="row" spacing={1.25} alignItems="center">
                                        <Box sx={{ color: (theme) => getLevelPalette(theme, item.nivel).main }}>
                                            <NivelIcon nivelId={item.nivel?.id} size={20} />
                                        </Box>
                                        <Typography className="mural-title" variant="h5" sx={{ transition: 'color 160ms ease' }}>
                                            {item.titulo_pog || displayName}
                                        </Typography>
                                    </Stack>

                                    <Typography color="text.secondary">{displayName}</Typography>

                                    {item.frase_abertura ? (
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                fontStyle: 'italic',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            &ldquo;{item.frase_abertura}&rdquo;
                                        </Typography>
                                    ) : null}
                                </Stack>
                            </Stack>

                            <Stack spacing={1.25} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
                                <Chip
                                    label={`${item.score_total} pts`}
                                    sx={{
                                        fontWeight: 800,
                                        color: (theme) => getLevelPalette(theme, item.nivel).main,
                                        backgroundColor: (theme) => getLevelPalette(theme, item.nivel).background,
                                    }}
                                />
                                <NivelBadge nivel={item.nivel} />
                            </Stack>
                        </Box>
                    </Paper>
                )
            })}
        </Stack>
    )
}