'use client'

import Image from 'next/image'

import { Box, Button, Container, Paper, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { IconHammer, IconRobot, IconSearch, IconTrophy } from '@tabler/icons-react'

import PogForm from '@/components/PogForm'

export default function HomePageView() {
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
                                        color: 'white',
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