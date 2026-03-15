import { IconAxe, IconBolt, IconFlame, IconHammer, IconTool } from '@tabler/icons-react'

const ICON_BY_LEVEL_ID = {
    martelinho: IconHammer,
    carpinteiro: IconTool,
    marreta: IconFlame,
    mjolnir: IconBolt,
    'rompe-tormentas': IconAxe,
}

export default function NivelIcon({ nivelId, size = 20, className = '', color, style }) {
    const Icon = ICON_BY_LEVEL_ID[nivelId] || IconHammer

    return (
        <Icon
            size={size}
            stroke={2.2}
            className={className}
            color={color}
            style={style}
            aria-hidden="true"
        />
    )
}
