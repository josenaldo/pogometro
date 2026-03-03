import PogForm from "@/components/PogForm"

export const metadata = {
  title: "Pogometro - Certificacao Oficial de Gambiarra",
  description: "Cole a URL de um repositorio GitHub e descubra quantos Principios, Tecnicas e Gambi Design Patterns do livro POG o seu projeto conquistou.",
}

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12 space-y-4">
        <div className="text-6xl mb-4">&#x2692;&#xfe0f;</div>
        <h1 className="text-4xl sm:text-5xl font-bold pog-title-gradient leading-tight">
          Pogometro
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          A Certificacao Oficial de Gambiarra
        </p>
        <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
          Cole a URL de um repositorio GitHub e descubra quantos dos{" "}
          <span className="text-amber-400 font-semibold">17 Principios</span>,{" "}
          <span className="text-amber-400 font-semibold">5 Tecnicas</span> e{" "}
          <span className="text-amber-400 font-semibold">20 Gambi Design Patterns</span> do livro{" "}
          <a href="https://livropog.com.br" target="_blank" rel="noopener noreferrer" className="text-violet-400 underline hover:text-violet-300">
            Programacao Orientada a Gambiarra
          </a>{" "}
          o seu projeto conquistou.
        </p>
        <p className="text-amber-400 text-sm font-semibold italic">
          Quanto mais gambiarra, maior a lenda! &#x1f3c6;
        </p>
      </div>
      <div className="max-w-xl mx-auto bg-[var(--pog-surface)] border border-[var(--pog-border)] rounded-2xl p-6 mb-12">
        <PogForm />
        <p className="text-center text-xs text-slate-600 mt-4">Funciona com repositorios e perfis publicos</p>
      </div>
      <div className="grid sm:grid-cols-3 gap-6 mb-16">
        {[
          { emoji: "&#x1f50d;", titulo: "Analisamos o codigo", desc: "Lemos commits, README, estrutura de arquivos e dependencias do seu repositorio." },
          { emoji: "&#x1f916;", titulo: "IA certifica a POG", desc: "O Oraculo da Gambiarra identifica cada principio, tecnica e pattern do livro presente no projeto." },
          { emoji: "&#x1f3c6;", titulo: "Voce recebe seu nivel", desc: "De Martelinho de Bebe a Rompe Tormentas - cada item encontrado vale pontos e gloria eterna." },
        ].map(({ emoji, titulo, desc }) => (
          <div key={titulo} className="bg-[var(--pog-surface)] border border-[var(--pog-border)] rounded-xl p-5 text-center space-y-2">
            <div className="text-3xl" dangerouslySetInnerHTML={{ __html: emoji }} />
            <h3 className="text-sm font-semibold text-violet-300">{titulo}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
