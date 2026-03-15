'use client'

import Link from 'next/link'

import { Box, Button, Chip, Container, Paper, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { IconEgg, IconHammer, IconTrophy } from '@tabler/icons-react'

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

export default function MuralPageView({ resultados, storageError }) {
    return (
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
            <Stack spacing={4}>
                <Paper
                    variant="outlined"
                    sx={{
                        p: { xs: 3, md: 4 },
                        borderRadius: 4,
                        textAlign: 'center',
                        borderColor: (theme) => alpha(theme.palette.primary.main, 0.2),
                        background: (theme) =>
                            `linear-gradient(135deg, ${alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.16 : 0.08)}, ${alpha(theme.palette.secondary.main, theme.palette.mode === 'dark' ? 0.12 : 0.05)})`,
                    }}
                >
                    <Stack spacing={1.5} alignItems="center">
                        <Box
                            sx={{
                                width: 60,
                                height: 60,
                                borderRadius: '50%',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'primary.main',
                                backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.16),
                            }}
                        >
                            <IconTrophy size={30} stroke={2.2} aria-hidden="true" />
                        </Box>
                        <Typography variant="overline" color="text.secondary">
                            Hall of fame oficial
                        </Typography>
                        <Typography
                            variant="h2"
                            sx={{
                                background: (theme) => theme.brandGradient,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            Mural da Fama
                        </Typography>
                        <Typography color="text.secondary" sx={{ maxWidth: 620 }}>
                            As grandes lendas POG do GitHub. Certificadas, validadas e eternizadas pelo Oráculo da
                            Gambiarra.
                        </Typography>
                    </Stack>
                </Paper>

                {storageError ? (
                    <Paper
                        variant="outlined"
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            borderStyle: 'dashed',
                            textAlign: 'center',
                            color: 'text.secondary',
                        }}
                    >
                        <Typography>O Redis da Gambiarra está em manutenção. Tente novamente em instantes.</Typography>
                    </Paper>
                ) : null}

                {!storageError && resultados.length === 0 ? (
                    <Paper variant="outlined" sx={{ p: { xs: 4, md: 6 }, borderRadius: 4, textAlign: 'center' }}>
                        <Stack spacing={2} alignItems="center">
                            <Box sx={{ color: 'text.secondary' }}>
                                <IconEgg size={40} stroke={2.2} aria-hidden="true" />
                            </Box>
                            <Typography variant="h4">O mural ainda está vazio.</Typography>
                            <Typography color="text.secondary">
                                Seja o primeiro a certificar seu projeto e entrar para a história da POG.
                            </Typography>
                            <Button component={Link} href="/" variant="contained" color="primary" startIcon={<IconHammer size={18} stroke={2.2} />}>
                                Certificar agora
                            </Button>
                        </Stack>
                    </Paper>
                ) : null}

                {resultados.length > 0 ? (
                    <Stack spacing={2}>
                        {resultados.map((item, index) => (
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
                                                    {item.titulo_pog || item.nome}
                                                </Typography>
                                            </Stack>

                                            <Typography color="text.secondary">{item.nome}</Typography>

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
                        ))}
                    </Stack>
                ) : null}

                <Box sx={{ textAlign: 'center' }}>
                    <Button component={Link} href="/" variant="contained" color="primary" startIcon={<IconHammer size={18} stroke={2.2} />}>
                        Certificar meu projeto
                    </Button>
                </Box>
            </Stack>
        </Container>
    )
}