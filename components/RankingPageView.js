'use client'

import Link from 'next/link'

import LeaderboardIcon from '@mui/icons-material/Leaderboard'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import { Alert, Avatar, Box, Button, Card, CardContent, Container, Paper, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { IconEgg, IconHammer, IconTrophy } from '@tabler/icons-react'

import PublicResultsList from '@/components/PublicResultsList'

export default function RankingPageView({ resultados, storageError }) {
    const topResult = resultados[0]

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
            <Stack spacing={4}>
                <Card
                    variant="outlined"
                    sx={{
                        borderColor: (theme) => alpha(theme.palette.secondary.main, 0.24),
                        background: (theme) =>
                            `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, theme.palette.mode === 'dark' ? 0.18 : 0.1)}, ${alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.1 : 0.04)})`,
                    }}
                >
                    <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                        <Stack spacing={1.5} alignItems="center" textAlign="center">
                            <Avatar
                                sx={{
                                    width: 60,
                                    height: 60,
                                    color: 'secondary.main',
                                    backgroundColor: (theme) => alpha(theme.palette.secondary.main, 0.16),
                                }}
                            >
                                <LeaderboardIcon sx={{ fontSize: 30 }} aria-hidden="true" />
                            </Avatar>
                            <Typography variant="overline" color="text.secondary">
                                Top 10 oficial
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
                                Ranking POG
                            </Typography>
                            <Typography color="text.secondary" sx={{ maxWidth: 680 }}>
                                As 10 maiores pontuações públicas já certificadas pelo Pogômetro. Em caso de empate,
                                a gambiarra mais recente sobe na frente.
                            </Typography>
                        </Stack>
                    </CardContent>
                </Card>

                {storageError ? (
                    <Alert severity="warning" variant="outlined">
                        O cofre do ranking está temporariamente indisponível. Tente novamente em instantes.
                    </Alert>
                ) : null}

                {!storageError && resultados.length > 0 ? (
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
                            gap: 2,
                        }}
                    >
                        {[
                            {
                                label: 'Maior score',
                                value: `${topResult?.score_total || 0} pts`,
                                caption: topResult?.titulo_pog || topResult?.nome || 'Sem líder ainda',
                                Icon: WorkspacePremiumIcon,
                            },
                            {
                                label: 'Faixa exibida',
                                value: `${resultados.length} posições`,
                                caption: 'Top público atualizado em tempo quase real',
                                Icon: LeaderboardIcon,
                            },
                            {
                                label: 'Regra de desempate',
                                value: 'Mais recente vence',
                                caption: 'Mesma pontuação, maior frescor de gambiarra',
                                Icon: LocalFireDepartmentIcon,
                            },
                        ].map(({ label, value, caption, Icon }) => (
                            <Card key={label} variant="outlined">
                                <CardContent>
                                    <Stack spacing={1.5}>
                                        <Avatar
                                            sx={{
                                                width: 40,
                                                height: 40,
                                                bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.14),
                                                color: 'secondary.main',
                                            }}
                                        >
                                            <Icon fontSize="small" />
                                        </Avatar>
                                        <Typography variant="overline" color="text.secondary">
                                            {label}
                                        </Typography>
                                        <Typography variant="h4">{value}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {caption}
                                        </Typography>
                                    </Stack>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                ) : null}

                {!storageError && resultados.length === 0 ? (
                    <Paper variant="outlined" sx={{ p: { xs: 4, md: 6 }, textAlign: 'center' }}>
                        <Stack spacing={2} alignItems="center">
                            <Box sx={{ color: 'text.secondary' }}>
                                <IconEgg size={40} stroke={2.2} aria-hidden="true" />
                            </Box>
                            <Typography variant="h4">O ranking ainda não foi inaugurado.</Typography>
                            <Typography color="text.secondary">
                                Certifique alguns projetos públicos para começar a disputa pelo topo da POG.
                            </Typography>
                            <Button component={Link} href="/" variant="contained" color="primary" startIcon={<IconHammer size={18} stroke={2.2} />}>
                                Certificar agora
                            </Button>
                        </Stack>
                    </Paper>
                ) : null}

                {resultados.length > 0 ? <PublicResultsList resultados={resultados} /> : null}

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                    <Button component={Link} href="/mural" variant="outlined" color="inherit" startIcon={<IconTrophy size={18} stroke={2.2} />}>
                        Ver mural
                    </Button>
                    <Button component={Link} href="/" variant="contained" color="primary" startIcon={<IconHammer size={18} stroke={2.2} />}>
                        Certificar meu projeto
                    </Button>
                </Stack>
            </Stack>
        </Container>
    )
}