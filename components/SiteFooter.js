'use client'

import Link from 'next/link'

import { Box, Button, Card, CardContent, Container, IconButton, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { IconBook, IconBrandGithubFilled, IconHammer, IconTrophy } from '@tabler/icons-react'

import { BrandLogo } from './BrandLogo'

const POGOMETRO_REPO_URL = 'https://github.com/josenaldo/pogometro'

export function SiteFooter() {
    return (
        <Box
            component="footer"
            sx={{
                mt: { xs: 8, md: 12 },
                borderTop: (theme) => `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
                backgroundColor: (theme) => alpha(theme.palette.background.paper, theme.palette.mode === 'dark' ? 0.9 : 0.96),
            }}
        >
            <Container
                maxWidth="lg"
                sx={{
                    py: { xs: 5, md: 6 },
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1.2fr 0.9fr 0.9fr' },
                    gap: 4,
                }}
            >
                <Card variant="outlined">
                    <CardContent sx={{ p: 3 }}>
                        <Stack spacing={1.5}>
                            <BrandLogo showTagline={false} />
                            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 380 }}>
                                Nenhum código limpo foi criado durante o desenvolvimento deste site. O objetivo aqui é
                                medir, celebrar e documentar a gambiarra com uma linguagem mais próxima de produto MUI.
                            </Typography>
                        </Stack>
                    </CardContent>
                </Card>

                <Card variant="outlined">
                    <CardContent sx={{ p: 3 }}>
                        <Stack spacing={1}>
                            <Typography variant="overline" color="text.secondary">
                                Navegação
                            </Typography>
                            <Button component={Link} href="/" variant="text" color="inherit" sx={{ justifyContent: 'flex-start', px: 0 }}>
                                Certificar um projeto
                            </Button>
                            <Button component={Link} href="/mural" variant="text" color="inherit" sx={{ justifyContent: 'flex-start', px: 0 }}>
                                Mural da Fama
                            </Button>
                            <Button component={Link} href="/ranking" variant="text" color="inherit" sx={{ justifyContent: 'flex-start', px: 0 }}>
                                Ranking POG
                            </Button>
                            <Button
                                component="a"
                                href="https://livropog.com.br"
                                target="_blank"
                                rel="noopener noreferrer"
                                variant="text"
                                color="inherit"
                                sx={{ justifyContent: 'flex-start', px: 0 }}
                            >
                                Ler Programação Orientada a Gambiarra
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>

                <Card variant="outlined">
                    <CardContent sx={{ p: 3 }}>
                        <Stack spacing={1.25}>
                            <Typography variant="overline" color="text.secondary">
                                Ecossistema POG
                            </Typography>
                            <Stack direction="row" spacing={1}>
                                <IconButton
                                    component="a"
                                    href="https://livropog.com.br"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Abrir o livro Programação Orientada a Gambiarra"
                                    color="inherit"
                                >
                                    <IconBook size={22} stroke={2.2} />
                                </IconButton>
                                <IconButton
                                    component={Link}
                                    href="/"
                                    aria-label="Voltar para a certificação do Pogômetro"
                                    color="inherit"
                                >
                                    <IconHammer size={22} stroke={2.2} />
                                </IconButton>
                                <IconButton
                                    component={Link}
                                    href="/mural"
                                    aria-label="Abrir o Mural da Fama"
                                    color="inherit"
                                >
                                    <IconTrophy size={22} stroke={2.2} />
                                </IconButton>
                                <IconButton
                                    component="a"
                                    href={POGOMETRO_REPO_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Abrir o repositório do Pogômetro"
                                    color="inherit"
                                >
                                    <IconBrandGithubFilled size={22} stroke={2.2} />
                                </IconButton>
                            </Stack>
                            <Typography variant="body2" color="text.secondary">
                                Powered by gambiarra, fé e token gratuito da Gemini.
                            </Typography>
                        </Stack>
                    </CardContent>
                </Card>
            </Container>

            <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                    display: 'block',
                    textAlign: 'center',
                    px: 3,
                    pb: 4,
                }}
            >
                © {new Date().getFullYear()} Pogômetro. Baseado no livro Programação Orientada a Gambiarra.
            </Typography>
        </Box>
    )
}