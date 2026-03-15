'use client'

import Link from 'next/link'

import { Box, Container, IconButton, Link as MuiLink, Stack, Typography } from '@mui/material'
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
                backgroundColor: 'background.paper',
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
                <Stack spacing={1.5}>
                    <BrandLogo showTagline={false} />
                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 380 }}>
                        Nenhum código limpo foi criado durante o desenvolvimento deste site. O objetivo
                        aqui é medir, celebrar e documentar a gambiarra com o mesmo universo visual do livro.
                    </Typography>
                </Stack>

                <Stack spacing={1.25}>
                    <Typography variant="overline" color="text.secondary">
                        Navegação
                    </Typography>
                    <MuiLink component={Link} href="/" underline="hover">
                        Certificar um projeto
                    </MuiLink>
                    <MuiLink component={Link} href="/mural" underline="hover">
                        Mural da Fama
                    </MuiLink>
                    <MuiLink href="https://livropog.com.br" target="_blank" rel="noopener noreferrer" underline="hover">
                        Ler Programação Orientada a Gambiarra
                    </MuiLink>
                </Stack>

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