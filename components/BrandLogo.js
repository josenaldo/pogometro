'use client'

import Image from 'next/image'
import Link from 'next/link'

import { Box, Typography } from '@mui/material'

import { useConfig } from '@/contexts/ConfigContext'

export function BrandLogo({ showTagline = true }) {
    const { colorMode } = useConfig()
    const logoColor = colorMode === 'dark' ? 'dark' : 'light'

    return (
        <Box
            component={Link}
            href="/"
            sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1.5,
                textDecoration: 'none',
                color: 'inherit',
                minWidth: 0,
            }}
        >
            <Image
                src={`/images/logo/brand-${logoColor}.png`}
                alt="Logo do universo Programação Orientada a Gambiarra"
                width={48}
                height={48}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <Typography
                    sx={{
                        fontWeight: 800,
                        lineHeight: 1,
                        background: (theme) => theme.brandGradient,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}
                >
                    Pogômetro
                </Typography>
                {showTagline ? (
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: { xs: 'none', sm: 'block' } }}
                    >
                        Certificação Oficial de Gambiarra
                    </Typography>
                ) : null}
            </Box>
        </Box>
    )
}