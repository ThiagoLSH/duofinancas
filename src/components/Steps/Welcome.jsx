import { usePlan } from '../../hooks/usePlan'
import { useFinanceContext } from '../../context/FinanceContext'
import { useAuthContext } from '../../context/AuthContext'
import { useState } from 'react'

export const Welcome = () => {
  const { createPlan } = usePlan()
  const { setStep, setLoading } = useFinanceContext()
  const { profile } = useAuthContext()
  const [selecting, setSelecting] = useState(null)

  const firstName = profile?.full_name?.split(' ')[0] || ''

  const handleSelect = async (type) => {
    setSelecting(type)
    setLoading(true)
    await createPlan(type)
    setLoading(false)
    setSelecting(null)
    setStep(1)
  }

  return (
    <div className="alianca-root" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 560, width: '100%' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--indigo)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18 }}>D</div>
          <div style={{ fontWeight: 700, fontSize: 17, letterSpacing: '-0.02em', color: 'var(--ink)' }}>DuoFinanças</div>
        </div>

        {/* Hero */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--indigo-soft)', color: 'var(--indigo)', fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 99, marginBottom: 16 }}>
            ✨ Suas finanças em sintonia
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--ink)', lineHeight: 1.15, margin: 0 }}>
            Bem-vindo{firstName ? `, ${firstName}` : ''}!
          </h1>
          <p style={{ fontSize: 15, color: 'var(--ink-soft)', marginTop: 10, lineHeight: 1.6 }}>
            Escolha seu perfil para começar o planejamento.
          </p>
        </div>

        {/* Profile Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 28 }}>
          {/* Solo */}
          <button
            onClick={() => handleSelect('single')}
            disabled={!!selecting}
            style={{
              padding: 22, borderRadius: 16, border: '1px solid var(--line)',
              background: selecting === 'single' ? 'var(--indigo-soft)' : 'var(--paper)',
              cursor: 'pointer', textAlign: 'left', transition: 'all .15s',
              opacity: selecting && selecting !== 'single' ? 0.5 : 1,
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 10 }}>👤</div>
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink)', marginBottom: 6 }}>Solteiro(a)</div>
            <div style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: 12 }}>Planejamento individual — controle total das suas finanças pessoais</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {['Orçamento pessoal', 'Metas individuais', 'Simulador de cenários'].map(f => (
                <div key={f} style={{ fontSize: 11, color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ fontWeight: 700 }}>✓</span> {f}
                </div>
              ))}
            </div>
            {selecting === 'single' && (
              <div style={{ marginTop: 14, display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: 18, height: 18, borderRadius: 99, border: '2px solid var(--indigo)', borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite' }} />
              </div>
            )}
          </button>

          {/* Couple */}
          <button
            onClick={() => handleSelect('couple')}
            disabled={!!selecting}
            style={{
              padding: 22, borderRadius: 16, border: '2px solid var(--indigo)',
              background: selecting === 'couple' ? 'var(--indigo-soft)' : 'var(--paper)',
              cursor: 'pointer', textAlign: 'left', transition: 'all .15s', position: 'relative',
              opacity: selecting && selecting !== 'couple' ? 0.5 : 1,
            }}
          >
            <div style={{ position: 'absolute', top: 12, right: 12, background: 'var(--indigo)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99 }}>
              CASAL
            </div>
            <div style={{ fontSize: 28, marginBottom: 10 }}>👫</div>
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink)', marginBottom: 6 }}>Casal</div>
            <div style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: 12 }}>Planejamento a dois — visão conjunta e gestão colaborativa</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {['Finanças do casal', 'Divisão de despesas', 'Sync em tempo real'].map(f => (
                <div key={f} style={{ fontSize: 11, color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ fontWeight: 700 }}>✓</span> {f}
                </div>
              ))}
            </div>
            {selecting === 'couple' && (
              <div style={{ marginTop: 14, display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: 18, height: 18, borderRadius: 99, border: '2px solid var(--indigo)', borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite' }} />
              </div>
            )}
          </button>
        </div>

        <p style={{ fontSize: 11, color: 'var(--ink-mute)', textAlign: 'center' }}>
          Você pode alterar o tipo de plano a qualquer momento.
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
