import Link from 'next/link'
import { IconHammer } from '@tabler/icons-react'

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center space-y-6">
      <div className="flex justify-center">
        <IconHammer size={56} stroke={2.2} className="text-[var(--pog-primary)]" aria-hidden="true" />
      </div>
      <h1 className="text-2xl font-bold pog-title-gradient">
        404 — Avaliação não encontrada
      </h1>
      <p className="text-[var(--pog-text-secondary)] text-sm">
        Este resultado pode ter expirado (TTL de 90 dias) ou o UUID tá errado. Clássico hardcode
        de link, né?
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 pog-btn-primary text-sm font-bold py-3 px-8 rounded-xl"
      >
        <IconHammer size={18} stroke={2.2} aria-hidden="true" />
        <span>Certificar um novo projeto</span>
      </Link>
    </div>
  )
}
