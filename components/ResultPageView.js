'use client'

import Link from 'next/link'

import { Avatar, Box, Button, Card, CardActions, CardContent, Chip, CircularProgress, Container, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import {
    IconBook,
    IconBrandWhatsapp,
    IconBrandX,
    IconBuilding,
    IconEgg,
    IconHammer,
    IconTool,
} from '@tabler/icons-react'

import NivelIcon from '@/components/NivelIcon'
import { MAX_SCORE } from '@/lib/pog-catalog'
import { getItemPalette, getItemTone, getLevelPalette, getLevelTone } from '@/lib/level-visuals'

function ScoreRingCard({ score, max = MAX_SCORE, tone }) {
    const percentage = Math.min((score / max) * 100, 100)

    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
                variant="determinate"
                value={100}
                size={132}
                thickness={4}
                sx={{ color: (theme) => alpha(theme.palette.text.primary, 0.08) }}
            />
            <CircularProgress
                variant="determinate"
                value={percentage}
                size={132}
                thickness={4}
                sx={{
                    position: 'absolute',
                    inset: 0,
                    color: (theme) => getLevelPalette(theme, { tone }).main,
                    '& .MuiCircularProgress-circle': {
                        strokeLinecap: 'round',
                    },
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Stack spacing={0.25} alignItems="center">
                    <Typography variant="h3">{score}</Typography>
                    <Typography variant="caption" color="text.secondary">
                        pts
                    </Typography>
                </Stack>
            </Box>
        </Box>
    )
}

function BadgeItem({ item }) {
    const labelMap = {
        principio: { label: 'Princípio', Icon: IconHammer },
        tecnica: { label: 'Técnica', Icon: IconTool },
        gdp: { label: 'GDP', Icon: IconBuilding },
    }

    const labelConfig = labelMap[item.tipo] || labelMap.principio
    const LabelIcon = labelConfig.Icon

    return (
        <Card
            variant="outlined"
            sx={{
                borderColor: (theme) => getItemPalette(theme, item.tipo).border,
                backgroundColor: (theme) => getItemPalette(theme, item.tipo).background,
            }}
        >
            <CardContent sx={{ p: 3, '&:last-child': { pb: 2 } }}>
                <Stack spacing={2}>
                    <Stack spacing={1}>
                        <Chip
                            size="small"
                            icon={<LabelIcon size={14} stroke={2.2} />}
                            label={`${labelConfig.label} · +${item.pontos} pts`}
                            sx={{
                                alignSelf: 'flex-start',
                                color: (theme) => getItemPalette(theme, item.tipo).main,
                                backgroundColor: (theme) => getItemPalette(theme, item.tipo).softBackground,
                            }}
                        />
                        <Typography variant="h5">{item.nome}</Typography>
                    </Stack>

                    {item.evidencias && item.evidencias.length > 0 ? (
                        <Box component="ul" sx={{ m: 0, pl: 2.5, color: 'text.secondary' }}>
                            {item.evidencias.map((ev, i) => (
                                <Typography key={i} component="li" variant="body2" sx={{ mb: 0.75 }}>
                                    {ev}
                                </Typography>
                            ))}
                        </Box>
                    ) : null}
                </Stack>
            </CardContent>
            <CardActions sx={{ px: 3, pb: 3, pt: 0 }}>
                <Button
                    component="a"
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="text"
                    color={getItemTone(item.tipo)}
                    sx={{ px: 0 }}
                >
                    Ver no livro
                </Button>
            </CardActions>
        </Card>
    )
}

function DetectedSection({ title, items, tone, Icon }) {
    if (items.length === 0) return null

    const total = items.reduce((sum, item) => sum + item.pontos, 0)

    return (
        <Stack spacing={2.5}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between">
                <Stack direction="row" spacing={1.25} alignItems="center">
                    <Box sx={{ color: `${tone}.main`, display: 'inline-flex' }}>
                        <Icon size={18} stroke={2.2} aria-hidden="true" />
                    </Box>
                    <Typography variant="h4">{title}</Typography>
                </Stack>
                <Chip label={`+${total} pts`} color={tone} />
            </Stack>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
                    gap: 2,
                }}
            >
                {items.map((item) => (
                    <BadgeItem key={item.id} item={item} />
                ))}
            </Box>
        </Stack>
    )
}

export default function ResultPageView({ data, id, siteUrl }) {
    const principios = data.itens_detectados?.filter((item) => item.tipo === 'principio') || []
    const tecnicas = data.itens_detectados?.filter((item) => item.tipo === 'tecnica') || []
    const gdps = data.itens_detectados?.filter((item) => item.tipo === 'gdp') || []
    const nivel = data.nivel || {}
    const levelTone = getLevelTone(nivel)
    const shareUrl = `${siteUrl}/r/${id}`
    const shareText = encodeURIComponent(
        `Meu projeto conquistou ${data.score_total} pts no Pogômetro e atingiu o nível "${nivel.nome}"! ${nivel.emoji} — "${data.titulo_pog}"\n\nConfira: ${shareUrl}`
    )

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
            <Stack spacing={4}>
                <Card
                    variant="outlined"
                    sx={{
                        borderColor: (theme) => getLevelPalette(theme, nivel).border,
                        background: (theme) => {
                            const colors = getLevelPalette(theme, nivel)
                            return `linear-gradient(135deg, ${colors.background}, ${colors.softBackground})`
                        },
                    }}
                >
                    <CardContent sx={{ p: { xs: 3, md: 5 }, '&:last-child': { pb: { xs: 3, md: 5 } } }}>
                        <Stack spacing={3} alignItems="center" textAlign="center">
                            <Avatar
                                sx={{
                                    width: 72,
                                    height: 72,
                                    color: (theme) => getLevelPalette(theme, nivel).main,
                                    backgroundColor: (theme) => getLevelPalette(theme, nivel).softBackground,
                                }}
                            >
                                <NivelIcon nivelId={nivel.id} size={36} />
                            </Avatar>

                            <Stack spacing={1}>
                                <Typography variant="overline" color="text.secondary">
                                    {data.tipo === 'profile' ? 'Perfil' : 'Repositório'} certificado
                                </Typography>
                                <Typography variant="h2" sx={{ color: (theme) => getLevelPalette(theme, nivel).main }}>
                                    &ldquo;{data.titulo_pog}&rdquo;
                                </Typography>
                                <Typography color="text.secondary">{data.nome_projeto}</Typography>
                            </Stack>

                            <ScoreRingCard score={data.score_total} tone={levelTone} />

                            <Stack spacing={0.5}>
                                <Typography variant="h4" sx={{ color: (theme) => getLevelPalette(theme, nivel).main }}>
                                    {nivel.nome}
                                </Typography>
                                <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                    {nivel.descricao}
                                </Typography>
                            </Stack>

                            <Typography color="text.secondary" sx={{ maxWidth: 680, fontStyle: 'italic', lineHeight: 1.8 }}>
                                &ldquo;{data.frase_abertura}&rdquo;
                            </Typography>

                            <Box
                                sx={{
                                    width: '100%',
                                    display: 'grid',
                                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' },
                                    gap: 2,
                                }}
                            >
                                {[
                                    { label: 'Princípios', value: principios.length, tone: 'info' },
                                    { label: 'Técnicas', value: tecnicas.length, tone: 'secondary' },
                                    { label: 'GDPs', value: gdps.length, tone: 'warning' },
                                ].map((item) => {
                                    const itemType = item.tone === 'info' ? 'principio' : item.tone === 'secondary' ? 'tecnica' : 'gdp'

                                    return (
                                        <Card
                                            key={item.label}
                                            variant="outlined"
                                            sx={{
                                                borderColor: (theme) => getItemPalette(theme, itemType).border,
                                                backgroundColor: (theme) => getItemPalette(theme, itemType).softBackground,
                                            }}
                                        >
                                            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                                                <Typography variant="h4" sx={{ color: `${item.tone}.main` }}>
                                                    {item.value}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {item.label}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>

                <DetectedSection title="Gambi Design Patterns Desbloqueados" items={gdps} tone="warning" Icon={IconBuilding} />
                <DetectedSection title="Técnicas Dominadas" items={tecnicas} tone="secondary" Icon={IconTool} />
                <DetectedSection title="Princípios Incorporados" items={principios} tone="info" Icon={IconHammer} />

                {data.itens_detectados?.length === 0 ? (
                    <Card variant="outlined">
                        <CardContent sx={{ p: { xs: 4, md: 6 }, '&:last-child': { pb: { xs: 4, md: 6 } } }}>
                            <Stack spacing={2} alignItems="center" textAlign="center">
                                <Avatar sx={{ width: 56, height: 56, bgcolor: 'action.hover', color: 'text.secondary' }}>
                                    <IconEgg size={26} stroke={2.2} aria-hidden="true" />
                                </Avatar>
                                <Typography variant="h4">Martelinho de Bebê</Typography>
                                <Typography color="text.secondary">
                                    Seu código ainda não apresenta sinais visíveis de POG. Mas há broto de potencial ali.
                                </Typography>
                            </Stack>
                        </CardContent>
                    </Card>
                ) : null}

                {data.comentario_final ? (
                    <Card variant="outlined">
                        <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                            <Typography color="text.secondary" sx={{ fontStyle: 'italic', lineHeight: 1.8, textAlign: 'center' }}>
                                &ldquo;{data.comentario_final}&rdquo;
                            </Typography>
                        </CardContent>
                    </Card>
                ) : null}

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="center">
                    <Button
                        component="a"
                        href={`https://twitter.com/intent/tweet?text=${shareText}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="contained"
                        color="primary"
                        startIcon={<IconBrandX size={18} stroke={2.2} />}
                    >
                        Compartilhar no Twitter/X
                    </Button>
                    <Button
                        component="a"
                        href={`https://wa.me/?text=${shareText}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="contained"
                        color="secondary"
                        startIcon={<IconBrandWhatsapp size={18} stroke={2.2} />}
                    >
                        Compartilhar no WhatsApp
                    </Button>
                    <Button
                        component={Link}
                        href="/"
                        variant="outlined"
                        color="inherit"
                        startIcon={<IconHammer size={18} stroke={2.2} />}
                    >
                        Certificar outro projeto
                    </Button>
                </Stack>

                <Card
                    variant="outlined"
                    sx={{
                        borderColor: (theme) => getItemPalette(theme, 'gdp').border,
                        backgroundColor: (theme) => getItemPalette(theme, 'gdp').background,
                    }}
                >
                    <CardContent sx={{ p: { xs: 3, md: 4 }, '&:last-child': { pb: { xs: 3, md: 4 } } }}>
                        <Stack spacing={2} alignItems="center" textAlign="center">
                            <Avatar sx={{ width: 56, height: 56, bgcolor: 'warning.light', color: 'warning.dark' }}>
                                <IconBook size={26} stroke={2.2} aria-hidden="true" />
                            </Avatar>
                            <Typography variant="h4" sx={{ color: 'warning.main' }}>
                                Conheça o livro que definiu esses critérios
                            </Typography>
                            <Typography color="text.secondary" sx={{ maxWidth: 620 }}>
                                Quer entender cada princípio, técnica e Gambi Design Pattern detectado? O livro
                                Programação Orientada a Gambiarra está esperando por você.
                            </Typography>
                            <Button
                                component="a"
                                href="https://livropog.com.br"
                                target="_blank"
                                rel="noopener noreferrer"
                                variant="contained"
                                color="secondary"
                            >
                                Acessar o livro POG
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>
            </Stack>
        </Container>
    )
}