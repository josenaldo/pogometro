'use client'

import Link from 'next/link'

import { Avatar, Box, Card, CardActionArea, CardContent, Chip, LinearProgress, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'

import NivelIcon from '@/components/NivelIcon'
import { MAX_SCORE } from '@/lib/pog-catalog'
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

function getScorePercentage(score) {
    return Math.max(0, Math.min(Math.round(((score || 0) / MAX_SCORE) * 100), 100))
}

export default function PublicResultsList({ resultados }) {
    return (
        <Stack spacing={2}>
            {resultados.map((item, index) => {
                const displayName = getDisplayName(item)
                const scorePercentage = getScorePercentage(item.score_total)

                return (
                    <Card
                        key={item.id}
                        variant="outlined"
                        sx={{
                            overflow: 'hidden',
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
                        <CardActionArea component={Link} href={`/r/${item.id}`} sx={{ display: 'block' }}>
                            <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                                <Box sx={{ px: 3, pt: 3, pb: 2.25 }}>
                                    <Box
                                        sx={{
                                            display: 'grid',
                                            gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) auto' },
                                            gap: 2.5,
                                            alignItems: 'start',
                                        }}
                                    >
                                        <Stack direction="row" spacing={2} alignItems="flex-start">
                                            <Avatar
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    fontWeight: 800,
                                                    color: (theme) => getLevelPalette(theme, item.nivel).main,
                                                    backgroundColor: (theme) => getLevelPalette(theme, item.nivel).background,
                                                }}
                                            >
                                                #{index + 1}
                                            </Avatar>

                                            <Stack spacing={1.25} sx={{ minWidth: 0, flex: 1 }}>
                                                <Stack direction="row" spacing={1.25} alignItems="center">
                                                    <Box sx={{ color: (theme) => getLevelPalette(theme, item.nivel).main, display: 'inline-flex' }}>
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

                                    <Stack direction="row" justifyContent="space-between" spacing={2} sx={{ mt: 2.25 }}>
                                        <Typography variant="caption" color="text.secondary">
                                            Índice de gambiarra
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {scorePercentage}% do caos teórico
                                        </Typography>
                                    </Stack>
                                </Box>

                                <LinearProgress
                                    variant="determinate"
                                    value={scorePercentage}
                                    sx={{
                                        height: 6,
                                        backgroundColor: (theme) => alpha(theme.palette.text.primary, 0.08),
                                        '& .MuiLinearProgress-bar': {
                                            backgroundColor: (theme) => getLevelPalette(theme, item.nivel).main,
                                        },
                                    }}
                                />
                            </CardContent>
                        </CardActionArea>
                    </Card>
                )
            })}
        </Stack>
    )
}