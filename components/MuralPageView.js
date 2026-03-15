'use client'

import Link from 'next/link'

import LeaderboardIcon from '@mui/icons-material/Leaderboard'
import { Alert, Avatar, Box, Button, Card, CardContent, Container, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { IconEgg, IconHammer, IconTrophy } from '@tabler/icons-react'

import PublicResultsList from '@/components/PublicResultsList'

export default function MuralPageView({ resultados, storageError }) {
    return (
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
            <Stack spacing={4}>
                <Card
                    variant="outlined"
                    sx={{
                        borderColor: (theme) => alpha(theme.palette.primary.main, 0.2),
                        background: (theme) =>
                            `linear-gradient(135deg, ${alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.16 : 0.08)}, ${alpha(theme.palette.secondary.main, theme.palette.mode === 'dark' ? 0.12 : 0.05)})`,
                    }}
                >
                    <CardContent sx={{ p: { xs: 3, md: 4 }, '&:last-child': { pb: { xs: 3, md: 4 } } }}>
                        <Stack spacing={1.5} alignItems="center" textAlign="center">
                            <Avatar
                                sx={{
                                    width: 60,
                                    height: 60,
                                    color: 'primary.main',
                                    backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.16),
                                }}
                            >
                                <IconTrophy size={30} stroke={2.2} aria-hidden="true" />
                            </Avatar>
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
                    </CardContent>
                </Card>

                {storageError ? (
                    <Alert severity="warning" variant="outlined">
                        O Redis da Gambiarra está em manutenção. Tente novamente em instantes.
                    </Alert>
                ) : null}

                {!storageError && resultados.length === 0 ? (
                    <Card variant="outlined">
                        <CardContent sx={{ p: { xs: 4, md: 6 }, '&:last-child': { pb: { xs: 4, md: 6 } } }}>
                            <Stack spacing={2} alignItems="center" textAlign="center">
                                <Avatar sx={{ width: 56, height: 56, bgcolor: 'action.hover', color: 'text.secondary' }}>
                                    <IconEgg size={28} stroke={2.2} aria-hidden="true" />
                                </Avatar>
                                <Typography variant="h4">O mural ainda está vazio.</Typography>
                                <Typography color="text.secondary">
                                    Seja o primeiro a certificar seu projeto e entrar para a história da POG.
                                </Typography>
                                <Button component={Link} href="/" variant="contained" color="primary" startIcon={<IconHammer size={18} stroke={2.2} />}>
                                    Certificar agora
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                ) : null}

                {resultados.length > 0 ? (
                    <PublicResultsList resultados={resultados} />
                ) : null}

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                    <Button
                        component={Link}
                        href="/ranking"
                        variant="outlined"
                        color="inherit"
                        startIcon={<LeaderboardIcon fontSize="small" />}
                    >
                        Ver ranking
                    </Button>
                    <Button component={Link} href="/" variant="contained" color="primary" startIcon={<IconHammer size={18} stroke={2.2} />}>
                        Certificar meu projeto
                    </Button>
                </Stack>
            </Stack>
        </Container>
    )
}