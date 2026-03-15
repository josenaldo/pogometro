'use client'

import Image from 'next/image'
import Link from 'next/link'

import LeaderboardIcon from '@mui/icons-material/Leaderboard'
import { Box, Button, Chip, Container, Paper, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { IconHammer, IconRobot, IconSearch, IconTrophy } from '@tabler/icons-react'

import NivelIcon from '@/components/NivelIcon'
import PogForm from '@/components/PogForm'
import { getLevelPalette } from '@/lib/level-visuals'

function TopRankingCard({ item, position }) {
    return (
        <Paper
            component={Link}
            href={`/r/${item.id}`}
            variant="outlined"
            sx={{
                p: 3,
                borderRadius: 4,
                textDecoration: 'none',
                borderColor: (theme) => getLevelPalette(theme, item.nivel).border,
                background: (theme) => {
                    const colors = getLevelPalette(theme, item.nivel)
                    return `linear-gradient(180deg, ${colors.softBackground}, ${alpha(theme.palette.background.paper, theme.palette.mode === 'dark' ? 0.94 : 0.98)})`
                },
                transition: 'transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: (theme) => `0 20px 42px ${alpha(theme.palette.common.black, theme.palette.mode === 'dark' ? 0.28 : 0.1)}`,
                    borderColor: (theme) => getLevelPalette(theme, item.nivel).main,
                },
            }}
        >
            <Stack spacing={2.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
                        <Box
                            sx={{
                                width: 42,
                                height: 42,
                                borderRadius: '50%',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 800,
                                color: (theme) => getLevelPalette(theme, item.nivel).main,
                                backgroundColor: (theme) => getLevelPalette(theme, item.nivel).background,
                                flexShrink: 0,
                            }}
                        >
                            #{position}
                        </Box>
                        <Stack spacing={0.75} sx={{ minWidth: 0 }}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
                                <Box sx={{ color: (theme) => getLevelPalette(theme, item.nivel).main, display: 'inline-flex' }}>
                                    <NivelIcon nivelId={item.nivel?.id} size={18} />
                                </Box>
                                <Typography variant="h5" sx={{ minWidth: 0 }}>
                                    {item.titulo_pog || item.nome}
                                </Typography>
                            </Stack>
                            <Typography color="text.secondary">{item.nome}</Typography>
                        </Stack>
                    </Stack>

                    <Chip
                        label={`${item.score_total} pts`}
                        sx={{
                            fontWeight: 800,
                            color: (theme) => getLevelPalette(theme, item.nivel).main,
                            backgroundColor: (theme) => getLevelPalette(theme, item.nivel).background,
                            flexShrink: 0,
                        }}
                    />
                </Stack>

                {item.frase_abertura ? (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            fontStyle: 'italic',
                            lineHeight: 1.7,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        &ldquo;{item.frase_abertura}&rdquo;
                    </Typography>
                ) : null}

                <Typography
                    variant="body2"
                    sx={{
                        fontWeight: 700,
                        color: (theme) => getLevelPalette(theme, item.nivel).main,
                    }}
                >
                    {item.nivel?.nome}
                </Typography>
            </Stack>
        </Paper>
    )
}

export default function HomePageView({ topResultados = [], rankingError = false }) {
    return (
        <>
            <Box
                sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    minHeight: { xs: 460, md: 540 },
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <Image
                    src="/images/cover/hero-md.webp"
                    alt=""
                    fill
                    priority
                    fetchPriority="high"
                    aria-hidden="true"
                    sizes="100vw"
                    style={{ objectFit: 'cover', objectPosition: 'center top' }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        background: (theme) => theme.heroOverlay,
                    }}
                />

                <Container
                    maxWidth="lg"
                    sx={{
                        position: 'relative',
                        zIndex: 1,
                        py: { xs: 10, md: 13 },
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <Stack
                        spacing={3}
                        sx={{
                            width: '100%',
                            maxWidth: { xs: '100%', md: 760 },
                            alignItems: 'center',
                            textAlign: 'center',
                        }}
                    >
                        <Typography variant="overline" color="secondary.main">
                            O radar oficial do universo POG
                        </Typography>

                        <Typography
                            variant="h1"
                            component="h1"
                            sx={{
                                color: (theme) =>
                                    theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary,
                            }}
                        >
                            Pogômetro
                        </Typography>

                        <Typography
                            variant="subtitle1"
                            sx={{
                                maxWidth: 620,
                                color: (theme) =>
                                    theme.palette.mode === 'dark'
                                        ? alpha(theme.palette.common.white, 0.86)
                                        : theme.palette.text.primary,
                            }}
                        >
                            A certificação oficial de gambiarra ligada diretamente ao livro Programação
                            Orientada a Gambiarra.
                        </Typography>

                        <Typography
                            sx={{
                                maxWidth: 640,
                                color: (theme) =>
                                    theme.palette.mode === 'dark'
                                        ? alpha(theme.palette.common.white, 0.76)
                                        : theme.palette.text.secondary,
                                lineHeight: 1.8,
                            }}
                        >
                            Cole a URL de um repositório GitHub e descubra quantos dos{' '}
                            <Box component="span" sx={{ color: 'secondary.main', fontWeight: 700 }}>
                                17 Princípios
                            </Box>
                            ,{' '}
                            <Box component="span" sx={{ color: 'secondary.main', fontWeight: 700 }}>
                                5 Técnicas
                            </Box>{' '}
                            e{' '}
                            <Box component="span" sx={{ color: 'secondary.main', fontWeight: 700 }}>
                                20 Gambi Design Patterns
                            </Box>{' '}
                            do livro o seu projeto conquistou.
                        </Typography>

                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={2}
                            alignItems={{ xs: 'stretch', sm: 'center' }}
                            justifyContent="center"
                        >
                            <Button href="#certificar" variant="contained" color="primary" size="large">
                                Certificar meu projeto
                            </Button>
                            <Button
                                component="a"
                                href="https://livropog.com.br"
                                target="_blank"
                                rel="noopener noreferrer"
                                variant="contained"
                                color="secondary"
                                size="large"
                            >
                                Conhecer o livro
                            </Button>
                        </Stack>

                        <Stack direction="row" spacing={1.2} alignItems="center" justifyContent="center" sx={{ color: 'primary.main' }}>
                            <IconTrophy size={18} stroke={2.2} aria-hidden="true" />
                            <Typography sx={{ fontWeight: 700, fontStyle: 'italic' }}>
                                Quanto mais gambiarra, maior a lenda.
                            </Typography>
                        </Stack>
                    </Stack>
                </Container>
            </Box>

            <Container
                maxWidth="lg"
                sx={{
                    position: 'relative',
                    zIndex: 2,
                    mt: { xs: -6, md: -8 },
                    pb: { xs: 8, md: 10 },
                }}
            >
                <Paper
                    id="certificar"
                    elevation={18}
                    sx={{
                        p: { xs: 3, md: 4 },
                        borderRadius: 4,
                        border: (theme) => `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
                        backgroundColor: (theme) =>
                            alpha(theme.palette.background.paper, theme.palette.mode === 'dark' ? 0.92 : 0.96),
                        backdropFilter: 'blur(18px)',
                    }}
                >
                    <Stack spacing={2.5}>
                        <Stack spacing={1} alignItems="center" textAlign="center">
                            <Box
                                sx={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: '50%',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.16),
                                    color: 'primary.main',
                                }}
                            >
                                <IconHammer size={28} stroke={2.2} aria-hidden="true" />
                            </Box>
                            <Typography variant="overline" color="text.secondary">
                                Certificação instantânea
                            </Typography>
                            <Typography variant="h3">Cole a URL e invoque o Oráculo da Gambiarra</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 620 }}>
                                A interface agora segue a mesma família visual do livro, mas o objetivo continua o
                                mesmo: medir a glória da sua gambiarra sem cerimônia.
                            </Typography>
                        </Stack>

                        <PogForm />

                        <Typography variant="caption" color="text.secondary" textAlign="center">
                            Funciona com repositórios e perfis públicos.
                        </Typography>
                    </Stack>
                </Paper>

                <Paper
                    variant="outlined"
                    sx={{
                        mt: 4,
                        p: { xs: 3, md: 4 },
                        borderRadius: 4,
                        borderColor: (theme) => alpha(theme.palette.secondary.main, 0.24),
                        background: (theme) =>
                            `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, theme.palette.mode === 'dark' ? 0.14 : 0.08)}, ${alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.08 : 0.03)})`,
                    }}
                >
                    <Stack spacing={3}>
                        <Stack
                            direction={{ xs: 'column', md: 'row' }}
                            spacing={2}
                            justifyContent="space-between"
                            alignItems={{ xs: 'flex-start', md: 'center' }}
                        >
                            <Stack spacing={1}>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'secondary.main' }}>
                                    <LeaderboardIcon fontSize="small" />
                                    <Typography variant="overline" color="inherit">
                                        Ranking ao vivo
                                    </Typography>
                                </Stack>
                                <Typography variant="h3">Top 3 da gambiarra certificada</Typography>
                                <Typography color="text.secondary" sx={{ maxWidth: 680 }}>
                                    Uma prévia das maiores lendas públicas do momento. O ranking completo mostra o Top 10.
                                </Typography>
                            </Stack>

                            <Button
                                component={Link}
                                href="/ranking"
                                variant="contained"
                                color="secondary"
                                startIcon={<IconTrophy size={18} stroke={2.2} />}
                            >
                                Ver Top 10
                            </Button>
                        </Stack>

                        {rankingError ? (
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
                                <Typography>O ranking está indisponível no momento. Tente novamente em instantes.</Typography>
                            </Paper>
                        ) : null}

                        {!rankingError && topResultados.length === 0 ? (
                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 3,
                                    borderRadius: 3,
                                    textAlign: 'center',
                                    borderColor: (theme) => alpha(theme.palette.text.primary, 0.08),
                                }}
                            >
                                <Stack spacing={1.5} alignItems="center">
                                    <Typography variant="h5">O ranking ainda está vazio.</Typography>
                                    <Typography color="text.secondary">
                                        Certifique um projeto público e abra a disputa pelo topo da POG.
                                    </Typography>
                                </Stack>
                            </Paper>
                        ) : null}

                        {topResultados.length > 0 ? (
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: { xs: '1fr', lg: 'repeat(3, minmax(0, 1fr))' },
                                    gap: 2,
                                }}
                            >
                                {topResultados.map((item, index) => (
                                    <TopRankingCard key={item.id} item={item} position={index + 1} />
                                ))}
                            </Box>
                        ) : null}
                    </Stack>
                </Paper>

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
                        gap: 3,
                        mt: 4,
                    }}
                >
                    {[
                        {
                            Icon: IconSearch,
                            titulo: 'Analisamos o código',
                            desc: 'Lemos commits, README, estrutura de arquivos e dependências do seu repositório.',
                        },
                        {
                            Icon: IconRobot,
                            titulo: 'IA certifica a POG',
                            desc: 'O Oráculo da Gambiarra identifica cada princípio, técnica e pattern do livro presente no projeto.',
                        },
                        {
                            Icon: IconTrophy,
                            titulo: 'Você recebe seu nível',
                            desc: 'De Martelinho de Bebê a Rompe Tormentas: cada item encontrado rende pontos e glória eterna.',
                        },
                    ].map(({ Icon, titulo, desc }) => (
                        <Paper
                            key={titulo}
                            variant="outlined"
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.86),
                                borderColor: (theme) => alpha(theme.palette.text.primary, 0.08),
                            }}
                        >
                            <Stack spacing={1.5} alignItems="center" textAlign="center">
                                <Box
                                    sx={{
                                        width: 160,
                                        height: 160,
                                        borderRadius: 2.5,
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: (theme) => theme.palette.mode === 'dark' ? 'common.white' : 'primary.main',
                                        //backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.14),
                                    }}
                                >
                                    <Icon size={130} stroke={2.2} aria-hidden="true" />
                                </Box>
                                <Typography variant="h5">{titulo}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {desc}
                                </Typography>
                            </Stack>
                        </Paper>
                    ))}
                </Box>
            </Container>
        </>
    )
}