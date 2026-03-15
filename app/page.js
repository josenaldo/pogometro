import PogForm from "@/components/PogForm"
import { IconHammer, IconRobot, IconSearch, IconTrophy } from '@tabler/icons-react'

export const metadata = {
  title: "Pogometro - Certificacao Oficial de Gambiarra",
  description: "Cole a URL de um repositorio GitHub e descubra quantos Principios, Tecnicas e Gambi Design Patterns do livro POG o seu projeto conquistou.",
}

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12 space-y-4">
        <div className="mb-4 flex justify-center">
          <IconHammer size={56} stroke={2.2} className="text-[var(--pog-primary)]" aria-hidden="true" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold pog-title-gradient leading-tight">
          Pogometro
        </h1>
        <p className="text-xl text-[var(--pog-text-secondary)] max-w-2xl mx-auto leading-relaxed">
          A Certificação Oficial de Gambiarra
        </p>
        <p className="text-[var(--pog-text-secondary)] max-w-xl mx-auto text-sm leading-relaxed">
          Cole a URL de um repositorio GitHub e descubra quantos dos{" "}
          <span className="text-[var(--pog-secondary)] font-semibold">17 Principios</span>,{" "}
          <span className="text-[var(--pog-secondary)] font-semibold">5 Tecnicas</span> e{" "}
          <span className="text-[var(--pog-secondary)] font-semibold">20 Gambi Design Patterns</span> do livro{" "}
          <a href="https://livropog.com.br" target="_blank" rel="noopener noreferrer" className="pog-link">
            Programacao Orientada a Gambiarra
          </a>{" "}
          o seu projeto conquistou.
        </p>
        <p className="text-[var(--pog-primary)] text-sm font-semibold italic inline-flex items-center gap-1.5 justify-center">
          <span>Quanto mais gambiarra, maior a lenda!</span>
          <IconTrophy size={16} stroke={2.2} aria-hidden="true" />
        </p>
      </div>
      <div className="max-w-xl mx-auto pog-card rounded-2xl p-6 mb-12">
        <PogForm />
        <p className="text-center text-xs text-[var(--pog-text-subtle)] mt-4">Funciona com repositorios e perfis publicos</p>
      </div>
      <div className="grid sm:grid-cols-3 gap-6 mb-16">
        {[
          { Icon: IconSearch, titulo: "Analisamos o codigo", desc: "Lemos commits, README, estrutura de arquivos e dependencias do seu repositorio." },
          { Icon: IconRobot, titulo: "IA certifica a POG", desc: "O Oraculo da Gambiarra identifica cada principio, tecnica e pattern do livro presente no projeto." },
          { Icon: IconTrophy, titulo: "Voce recebe seu nivel", desc: "De Martelinho de Bebe a Rompe Tormentas - cada item encontrado vale pontos e gloria eterna." },
        ].map(({ Icon, titulo, desc }) => (
          <div key={titulo} className="pog-card rounded-xl p-5 text-center space-y-2">
            <div className="flex justify-center">
              <Icon size={30} stroke={2.2} className="text-[var(--pog-primary)]" aria-hidden="true" />
            </div>
            <h3 className="text-sm font-semibold text-[var(--pog-primary)]">{titulo}</h3>
            <p className="text-xs text-[var(--pog-text-muted)] leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
