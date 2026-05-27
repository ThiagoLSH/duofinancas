import { useState, useEffect, useRef } from 'react'

const APP_URL = 'https://duofinancascb.netlify.app'

const faqs = [
  { q: 'Quem pode usar o DuoFinanças?', a: 'O DuoFinanças foi desenvolvido para membros da Comunidade Shalom — Comunidade de Aliança (15%), Vocacionados (15%) e Membros da Obra (10%). Qualquer membro pode criar sua conta gratuitamente.' },
  { q: 'Como o sistema calcula o valor da minha CB?', a: 'Você informa sua renda mensal e o sistema aplica o percentual do seu vínculo automaticamente. Para a Comunidade de Aliança, detalha ainda a divisão: 10% para a Obra Shalom e 5% para necessitados da Comunidade.' },
  { q: 'O lembrete de WhatsApp é obrigatório?', a: 'Não. Você ativa o lembrete de WhatsApp se quiser. Também é possível usar apenas a notificação no navegador, ou consultar o app manualmente a qualquer momento.' },
  { q: 'Meus dados financeiros ficam seguros?', a: 'Sim. Os dados são armazenados no Supabase com autenticação segura e Row Level Security — ninguém além de você tem acesso. Não vendemos nem compartilhamos suas informações.' },
  { q: 'O DuoFinanças é gratuito?', a: 'Sim, completamente gratuito para todos os membros da Comunidade Shalom. É um projeto de serviço desenvolvido com amor para facilitar a vida comunitária.' },
]

const steps = [
  { num: '01', title: 'Crie sua conta', desc: 'Informe seu vínculo, renda e WhatsApp. Leva menos de 2 minutos.' },
  { num: '02', title: 'Configure seu lembrete', desc: 'Escolha o dia do mês. O percentual (10% ou 15%) é aplicado automaticamente.' },
  { num: '03', title: 'Receba no WhatsApp', desc: 'Mensagem mensal com o valor exato da sua CB e uma frase espiritual.' },
]

const features = [
  { icon: '↗', title: 'Cálculo automático', desc: 'Informe sua renda e veja o valor da CB em tempo real, com detalhamento por destino.' },
  { icon: '◎', title: 'Lembrete via WhatsApp', desc: 'Integrado ao N8N e Evolution API. Mensagem mensal no dia e horário que você escolher.' },
  { icon: '▲', title: 'Streak de fidelidade', desc: 'Acompanhe meses consecutivos de fidelidade. Marcos em 3, 6 e 12 meses.' },
  { icon: '⬡', title: 'Dados seguros', desc: 'Supabase com RLS. Seus dados financeiros são visíveis apenas por você.' },
  { icon: '◇', title: 'Gratuito', desc: 'Sem custo, sem cartão. Uma ferramenta feita de e para a Comunidade.' },
  { icon: '□', title: 'Multi-dispositivo', desc: 'Funciona no celular, tablet e computador. Interface responsiva e acessível.' },
]

const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: '100%', background: 'none', border: 'none', color: '#fff', fontFamily: 'inherit', fontSize: 15, fontWeight: 400, textAlign: 'left', padding: '22px 0', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24, letterSpacing: '-0.1px' }}
      >
        <span style={{ color: open ? '#34D399' : '#E6EDF3' }}>{q}</span>
        <span style={{ color: '#10B981', fontSize: 18, transition: 'transform 0.25s', transform: open ? 'rotate(45deg)' : 'none', flexShrink: 0, lineHeight: 1 }}>+</span>
      </button>
      <div style={{ maxHeight: open ? 200 : 0, overflow: 'hidden', transition: 'max-height 0.35s ease', color: '#8B949E', fontSize: 14, lineHeight: 1.8, paddingBottom: open ? 20 : 0 }}>
        {a}
      </div>
    </div>
  )
}

const Reveal = ({ children, delay = 0 }) => {
  const ref = useRef(null)
  const [v, setV] = useState(false)
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true) }, { threshold: 0.08 })
    if (ref.current) o.observe(ref.current)
    return () => o.disconnect()
  }, [])
  return (
    <div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? 'translateY(0)' : 'translateY(16px)', transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms` }}>
      {children}
    </div>
  )
}

export const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: '#0D1117', color: '#E6EDF3', overflowX: 'hidden', lineHeight: 1.6 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        .lp-nav-link { color: #8B949E; text-decoration: none; font-size: 14px; transition: color 0.2s; }
        .lp-nav-link:hover { color: #E6EDF3; }

        .lp-btn { display: inline-flex; align-items: center; gap: 8px; border-radius: 8px; font-size: 14px; font-weight: 500; text-decoration: none; transition: all 0.2s; cursor: pointer; border: none; font-family: inherit; }
        .lp-btn-primary { background: #10B981; color: #fff; padding: 10px 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.3), 0 0 0 1px rgba(16,185,129,0.3); }
        .lp-btn-primary:hover { background: #0EA572; box-shadow: 0 4px 16px rgba(16,185,129,0.25), 0 0 0 1px rgba(16,185,129,0.4); transform: translateY(-1px); }
        .lp-btn-outline { background: transparent; color: #E6EDF3; padding: 10px 20px; border: 1px solid rgba(255,255,255,0.12); }
        .lp-btn-outline:hover { border-color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.04); }
        .lp-btn-lg { padding: 13px 28px; font-size: 15px; border-radius: 10px; }

        .lp-feature { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 28px; transition: all 0.2s; }
        .lp-feature:hover { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.1); }

        @media (max-width: 768px) {
          .lp-hero-title { font-size: 36px !important; letter-spacing: -1.5px !important; }
          .lp-section { padding: 72px 20px !important; }
          .lp-steps { grid-template-columns: 1fr !important; }
          .lp-features { grid-template-columns: 1fr !important; }
          .lp-nav-links { display: none !important; }
          .lp-nav { padding: 0 20px !important; }
          .lp-hero { padding: 100px 20px 80px !important; }
          .lp-footer { flex-direction: column !important; gap: 12px !important; }
        }
      `}</style>

      {/* NAV */}
      <nav className="lp-nav" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', background: scrolled ? 'rgba(13,17,23,0.92)' : 'transparent', backdropFilter: scrolled ? 'blur(16px)' : 'none', borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent', transition: 'all 0.3s' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex' }}>
            <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#10B981', opacity: 0.9 }}/>
            <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#34D399', opacity: 0.6, marginLeft: -6 }}/>
          </div>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#E6EDF3', letterSpacing: '-0.3px' }}>DuoFinanças</span>
        </div>
        <div className="lp-nav-links" style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <a href="#como-funciona" className="lp-nav-link">Como funciona</a>
          <a href="#faq" className="lp-nav-link">FAQ</a>
        </div>
        <a href={APP_URL} className="lp-btn lp-btn-primary">Criar conta grátis</a>
      </nav>

      {/* HERO */}
      <section className="lp-hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '100px 32px 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)', backgroundSize: '64px 64px', maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 100%)' }}/>
        <div style={{ position: 'absolute', width: 600, height: 400, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(16,185,129,0.06) 0%, transparent 70%)', filter: 'blur(60px)', top: '10%', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }}/>

        <div style={{ position: 'relative', maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.18)', color: '#34D399', padding: '5px 14px', borderRadius: 100, fontSize: 12, fontWeight: 500, marginBottom: 32, letterSpacing: '0.2px' }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10B981', display: 'inline-block' }}/>
            Para membros da Comunidade Shalom
          </div>

          <h1 className="lp-hero-title" style={{ fontSize: 'clamp(40px, 5.5vw, 60px)', fontWeight: 600, lineHeight: 1.1, letterSpacing: '-2px', marginBottom: 20, color: '#E6EDF3' }}>
            Sua Comunhão de Bens{' '}
            <span style={{ color: '#10B981' }}>organizada</span>{' '}
            e fiel
          </h1>

          <p style={{ fontSize: 17, fontWeight: 300, color: '#8B949E', lineHeight: 1.75, marginBottom: 36, maxWidth: 460, margin: '0 auto 36px' }}>
            Calcule seu valor de CB, receba lembretes mensais pelo WhatsApp e acompanhe sua fidelidade ao Reino — tudo em um só lugar.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={APP_URL} className="lp-btn lp-btn-primary lp-btn-lg">Criar conta grátis →</a>
            <a href="#como-funciona" className="lp-btn lp-btn-outline lp-btn-lg">Como funciona</a>
          </div>

          <p style={{ marginTop: 60, fontSize: 13, color: 'rgba(255,255,255,0.18)', fontStyle: 'italic' }}>
            "Buscai primeiro o Reino de Deus e tudo mais vos será dado por acréscimo." — Lc 12,31
          </p>
        </div>
      </section>

      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }}/>

      {/* COMO FUNCIONA */}
      <section className="lp-section" id="como-funciona" style={{ padding: '96px 32px', maxWidth: 1080, margin: '0 auto' }}>
        <Reveal>
          <div style={{ marginBottom: 56 }}>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#10B981', marginBottom: 12 }}>Como funciona</p>
            <h2 style={{ fontSize: 'clamp(26px, 3vw, 38px)', fontWeight: 600, letterSpacing: '-1px', lineHeight: 1.2, color: '#E6EDF3', maxWidth: 440 }}>
              Três passos para nunca esquecer sua CB
            </h2>
          </div>
        </Reveal>

        <div className="lp-steps" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 16, overflow: 'hidden', marginBottom: 48 }}>
          {steps.map((s, i) => (
            <Reveal key={i} delay={i * 80}>
              <div style={{ background: '#0D1117', padding: '36px 32px', height: '100%' }}>
                <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '1.5px', color: '#10B981', textTransform: 'uppercase', marginBottom: 16 }}>{s.num}</p>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#E6EDF3', marginBottom: 8, letterSpacing: '-0.2px' }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: '#8B949E', lineHeight: 1.75 }}>{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="lp-features" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {features.map((f, i) => (
            <Reveal key={i} delay={i * 50}>
              <div className="lp-feature">
                <div style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(16,185,129,0.08)', borderRadius: 8, marginBottom: 14, color: '#10B981', fontSize: 13 }}>{f.icon}</div>
                <h4 style={{ fontSize: 14, fontWeight: 600, color: '#E6EDF3', marginBottom: 6 }}>{f.title}</h4>
                <p style={{ fontSize: 13, color: '#8B949E', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }}/>

      {/* FAQ */}
      <section id="faq" style={{ padding: '96px 32px' }}>
        <div style={{ maxWidth: 620, margin: '0 auto' }}>
          <Reveal>
            <div style={{ marginBottom: 40 }}>
              <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#10B981', marginBottom: 12 }}>FAQ</p>
              <h2 style={{ fontSize: 'clamp(26px, 3vw, 38px)', fontWeight: 600, letterSpacing: '-1px', lineHeight: 1.2, color: '#E6EDF3' }}>Perguntas frequentes</h2>
            </div>
          </Reveal>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {faqs.map((f, i) => (
              <Reveal key={i} delay={i * 40}>
                <FaqItem q={f.q} a={f.a} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }}/>

      {/* CTA FINAL */}
      <section style={{ padding: '96px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 500, height: 300, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(16,185,129,0.05) 0%, transparent 70%)', filter: 'blur(60px)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }}/>
        <div style={{ position: 'relative', maxWidth: 480, margin: '0 auto' }}>
          <Reveal>
            <h2 style={{ fontSize: 'clamp(26px, 3vw, 38px)', fontWeight: 600, letterSpacing: '-1px', lineHeight: 1.2, color: '#E6EDF3', marginBottom: 16 }}>
              Comece a usar hoje.<br/>É gratuito.
            </h2>
            <p style={{ fontSize: 15, color: '#8B949E', lineHeight: 1.75, marginBottom: 32 }}>
              Crie sua conta em menos de 2 minutos e nunca mais esqueça sua Comunhão de Bens.
            </p>
            <a href={APP_URL} className="lp-btn lp-btn-primary lp-btn-lg">
              Criar minha conta grátis →
            </a>
            <p style={{ marginTop: 40, fontSize: 12, color: 'rgba(255,255,255,0.16)', fontStyle: 'italic' }}>
              "A Economia do Reino é a Divina Providência." — Moyses Azevedo
            </p>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }}/>
      <footer className="lp-footer" style={{ padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{ display: 'flex' }}>
            <div style={{ width: 13, height: 13, borderRadius: '50%', background: '#10B981', opacity: 0.7 }}/>
            <div style={{ width: 13, height: 13, borderRadius: '50%', background: '#34D399', opacity: 0.45, marginLeft: -5 }}/>
          </div>
          <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.25)' }}>DuoFinanças</span>
        </div>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.18)' }}>Feito com cuidado para a Comunidade Shalom · Gratuito · Dados seguros</p>
      </footer>
    </div>
  )
}