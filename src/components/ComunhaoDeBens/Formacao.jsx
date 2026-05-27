import { useState } from 'react'
import { ChevronDown, ExternalLink } from 'lucide-react'
import { clsx } from 'clsx'

const TOPICOS = [
  {
    titulo: 'O que é a Comunhão de Bens?',
    emoji: '✝️',
    conteudo: 'É a partilha total da vida, inspirada em Atos dos Apóstolos 2 e 4, onde os primeiros cristãos colocavam tudo em comum. Na Comunidade Shalom, é expressa na devolução mensal de no mínimo 10% (Obra Shalom) ou 15% (Comunidade de Aliança) dos rendimentos.',
  },
  {
    titulo: 'Qual a diferença entre Dízimo e Comunhão de Bens?',
    emoji: '⚖️',
    conteudo: 'O Dízimo tem base no Antigo Testamento e está ligado à justiça para com Deus. A Comunhão de Bens vai além — está relacionada à caridade, inspirada nos primeiros cristãos que tinham tudo em comum (At 2; 4).',
  },
  {
    titulo: 'O que é a Economia do Reino?',
    emoji: '👑',
    conteudo: 'Nos Estatutos da Comunidade Shalom (ECCSh), o fundador Moysés Azevedo escreve que "a economia do Reino é a Divina Providência". É a forma que Deus escolheu para, através de nós como causas segundas, conduzir cada pessoa para o céu. A base é a lógica do "dar-se ao outro" — esvaziar-se para que o outro tenha vida.',
  },
  {
    titulo: 'Para onde vai o valor devolvido?',
    emoji: '🕊️',
    conteudo: 'Os 10% são destinados à manutenção dos Centros de Evangelização, sustento da vida missionária e ações evangelizadoras (eventos, seminários, cursos). Os 5% adicionais da Comunidade de Aliança vão para os necessitados dentro da Comunidade e para os pobres — para que não haja necessitados entre nós.',
  },
  {
    titulo: 'Mesmo desempregado ou estudante devo devolver?',
    emoji: '🙏',
    conteudo: 'Sim. O movimento é de fidelidade e reconhecimento de pertença total a Deus. Irmãos com realidades financeiras desafiantes são chamados a partilhar os recursos que recebem (ajuda da família, mesada, etc.). O mais importante não é a quantia, mas o desejo do coração.',
  },
  {
    titulo: 'A dimensão espiritual da Comunhão de Bens',
    emoji: '✨',
    conteudo: 'A devolução é uma ação estatutária (ECCSh 140) que faz crescer simultaneamente na obediência, na pobreza e na castidade. Reter bens para si não garante a vida — pelo contrário, rouba o homem de si mesmo, de Deus e dos irmãos. Usamos a palavra "devolver" porque tudo pertence a Deus; somos meros administradores.',
  },
  {
    titulo: 'Cuidado com a mentalidade errada',
    emoji: '⚠️',
    conteudo: 'A Comunhão de Bens NÃO é teologia da prosperidade. Não se devolve esperando que Deus aumente a renda. É um gesto gratuito de amor — não uma ação interesseira.',
  },
]

const Accordion = ({ topico, isOpen, onToggle }) => (
  <div className="glass-card overflow-hidden">
    <button
      className="w-full flex items-center gap-3 p-4 text-left"
      onClick={onToggle}
      aria-expanded={isOpen}
    >
      <span className="text-base flex-shrink-0">{topico.emoji}</span>
      <span className="flex-1 text-sm font-medium text-slate-200 leading-snug">{topico.titulo}</span>
      <ChevronDown
        size={16}
        className={clsx(
          'flex-shrink-0 text-slate-400 transition-transform duration-200',
          isOpen && 'rotate-180'
        )}
      />
    </button>
    {isOpen && (
      <div className="px-4 pb-4 pt-0">
        <div className="border-t border-slate-700/50 pt-3">
          <p className="text-sm text-slate-400 leading-relaxed">{topico.conteudo}</p>
        </div>
      </div>
    )}
  </div>
)

export const Formacao = () => {
  const [aberto, setAberto] = useState(null)

  const toggle = (idx) => setAberto((prev) => (prev === idx ? null : idx))

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-semibold text-slate-200">📖 Formação sobre Comunhão de Bens</h3>
        <p className="text-xs text-slate-500 mt-0.5">Toque em cada tópico para expandir</p>
      </div>

      <div className="space-y-2">
        {TOPICOS.map((t, i) => (
          <Accordion
            key={i}
            topico={t}
            isOpen={aberto === i}
            onToggle={() => toggle(i)}
          />
        ))}
      </div>

      {/* Link externo */}
      <div className="glass-card p-4 border-emerald-500/20">
        <p className="text-xs text-slate-500 mb-2">📚 Para aprofundar</p>
        <a
          href="https://livrariashalom.org/economia-o-segredo-da-providencia-divina"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-3 group"
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-emerald-400 group-hover:text-emerald-300 transition-colors leading-snug">
              O Segredo da Providência Divina
            </p>
            <p className="text-xs text-slate-500 mt-0.5">Emmir Nogueira e Leandro Formolo — Edições Shalom</p>
          </div>
          <ExternalLink size={14} className="text-slate-500 group-hover:text-emerald-400 transition-colors flex-shrink-0 mt-0.5" />
        </a>
      </div>
    </div>
  )
}
