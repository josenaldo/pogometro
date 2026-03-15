'use client'

import Link from 'next/link'

import DarkModeIcon from '@mui/icons-material/DarkMode'
import LeaderboardIcon from '@mui/icons-material/Leaderboard'
import LightModeIcon from '@mui/icons-material/LightMode'
import { AppBar, Box, Button, Container, IconButton, Stack, Toolbar, Tooltip } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { IconBook, IconTrophy } from '@tabler/icons-react'

import { useConfig } from '@/contexts/ConfigContext'

import { BrandLogo } from './BrandLogo'

export function SiteHeader() {
    const theme = useTheme()
    const { colorMode, toggleColorMode } = useConfig()

    const isDark = colorMode === 'dark'

    return (
        <AppBar
            position="sticky"
            color="transparent"
            elevation={0}
            sx={{
                backdropFilter: 'blur(18px)',
                backgroundColor: alpha(
                    theme.palette.background.appbar || theme.palette.background.paper,
                    theme.palette.mode === 'dark' ? 0.9 : 0.86
                ),
                borderBottom: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
            }}
        >
            <Container maxWidth="lg">
                <Toolbar disableGutters sx={{ minHeight: 76, gap: 2, justifyContent: 'space-between' }}>
                    <BrandLogo />

                    <Stack direction="row" spacing={1} alignItems="center">
                        <Button
                            component={Link}
                            href="/mural"
                            color="inherit"
                            startIcon={<IconTrophy size={16} stroke={2.2} />}
                            sx={{
                                color: 'text.secondary',
                                display: { xs: 'none', sm: 'inline-flex' },
                                '&:hover': {
                                    color: 'text.primary',
                                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                },
                            }}
                        >
                            Mural da Fama
                        </Button>

                        <Button
                            component={Link}
                            href="/ranking"
                            color="inherit"
                            startIcon={<LeaderboardIcon fontSize="small" />}
                            sx={{
                                color: 'text.secondary',
                                display: { xs: 'none', sm: 'inline-flex' },
                                '&:hover': {
                                    color: 'text.primary',
                                    backgroundColor: alpha(theme.palette.secondary.main, 0.08),
                                },
                            }}
                        >
                            Ranking
                        </Button>

                        <Button
                            component="a"
                            href="https://livropog.com.br"
                            target="_blank"
                            rel="noopener noreferrer"
                            color="secondary"
                            variant="contained"
                            startIcon={<IconBook size={16} stroke={2.2} />}
                            sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
                        >
                            O Livro
                        </Button>

                        <Tooltip title={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}>
                            <IconButton aria-label="Alternar tema" onClick={toggleColorMode} color="inherit">
                                {isDark ? <LightModeIcon /> : <DarkModeIcon />}
                            </IconButton>
                        </Tooltip>

                        <Stack direction="row" spacing={0.5} sx={{ display: { xs: 'flex', sm: 'none' } }}>
                            <Button
                                component={Link}
                                href="/mural"
                                color="inherit"
                                sx={{
                                    minWidth: 0,
                                    color: 'text.secondary',
                                    px: 1.25,
                                }}
                            >
                                Mural
                            </Button>
                            <Button
                                component={Link}
                                href="/ranking"
                                color="inherit"
                                sx={{
                                    minWidth: 0,
                                    color: 'text.secondary',
                                    px: 1.25,
                                }}
                            >
                                Ranking
                            </Button>
                        </Stack>
                    </Stack>
                </Toolbar>
            </Container>
        </AppBar>
    )
}