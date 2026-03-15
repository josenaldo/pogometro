'use client'

import Link from 'next/link'

import { Box, Button, Container, Paper, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { IconHammer } from '@tabler/icons-react'

export default function NotFound() {
  return (
    <Container maxWidth="sm" sx={{ py: { xs: 10, md: 14 } }}>
      <Paper
        variant="outlined"
        sx={{
          p: { xs: 4, md: 5 },
          borderRadius: 4,
          textAlign: 'center',
          borderColor: (theme) => alpha(theme.palette.primary.main, 0.24),
          backgroundColor: (theme) => alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.1 : 0.05),
        }}
      >
        <Stack spacing={2.5} alignItems="center">
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'primary.main',
              backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.16),
            }}
          >
            <IconHammer size={30} stroke={2.2} aria-hidden="true" />
          </Box>

          <Typography
            variant="h3"
            sx={{
              background: (theme) => theme.brandGradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            404 — Avaliação não encontrada
          </Typography>

          <Typography color="text.secondary">
            Este resultado pode ter expirado ou o UUID tá errado. Clássico hardcode de link, né?
          </Typography>

          <Button component={Link} href="/" variant="contained" color="primary" startIcon={<IconHammer size={18} stroke={2.2} />}>
            Certificar um novo projeto
          </Button>
        </Stack>
      </Paper>
    </Container>
  )
}
