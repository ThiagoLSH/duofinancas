// Aliança UI kit — Auth screens for DuoFinanças.
import React from 'react';
import { isSupabaseConfigured } from '../../lib/supabase';

// ─────────── Hero panel (left side, shared) ───────────
const AuthHero = () => {
  return (
    <div style={{
      flex: 1, background: 'linear-gradient(135deg, var(--indigo-deep) 0%, var(--indigo) 60%, #4242B8 100%)',
      color: '#fff', padding: '48px 56px', display: 'flex', flexDirection: 'column',
      justifyContent: 'space-between', position: 'relative', overflow: 'hidden',
    }}>
      <svg style={{ position: 'absolute', right: -80, top: -80, opacity: 0.08 }} width="380" height="380" viewBox="0 0 380 380">
        <circle cx="190" cy="190" r="160" stroke="#fff" strokeWidth="2" fill="none" />
        <circle cx="190" cy="190" r="110" stroke="#fff" strokeWidth="2" fill="none" />
        <circle cx="190" cy="190" r="60" stroke="#fff" strokeWidth="2" fill="none" />
      </svg>
      <svg style={{ position: 'absolute', left: -60, bottom: -120, opacity: 0.05 }} width="320" height="320" viewBox="0 0 320 320">
        <circle cx="160" cy="160" r="140" stroke="#fff" strokeWidth="2" fill="none" />
      </svg>

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 9, background: '#fff', color: 'var(--indigo)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18 }}>D</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 17, letterSpacing: '-0.02em' }}>DuoFinanças</div>
          <div style={{ fontSize: 11, color: '#C0C0F0' }}>Suas finanças em sintonia</div>
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <h1 style={{ fontSize: 36, lineHeight: 1.05, letterSpacing: '-0.03em', fontWeight: 700, margin: 0 }}>
          Organize seu mês.<br/>
          <span style={{ color: 'var(--amber)' }}>Devolva com fidelidade.</span>
        </h1>
        <p style={{ fontSize: 14, color: '#C0C0F0', lineHeight: 1.5, marginTop: 14, maxWidth: 420 }}>
          Planejamento financeiro e Comunhão de Bens no mesmo lugar. Feito para membros da Comunidade Shalom.
        </p>
        <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { icon: '🕊️', label: 'CB calculada e lembrada', sub: 'WhatsApp + PIX QR code' },
            { icon: '📊', label: 'Dashboard do casal', sub: 'Saldo, despesas, metas em tempo real' },
            { icon: '🎯', label: 'Metas com tracking', sub: 'Reserva, viagem, casa própria' },
          ].map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{f.icon}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{f.label}</div>
                <div style={{ fontSize: 11, color: '#A8A8E0' }}>{f.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 1, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.12)' }}>
        <div style={{ fontSize: 12, color: '#C0C0F0', fontStyle: 'italic', lineHeight: 1.5 }}>
          "Finalmente um app que entende o compromisso da Aliança. Em três meses já tinha um streak de fidelidade."
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
          <div style={{ width: 28, height: 28, borderRadius: 99, background: 'var(--amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff' }}>AP</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600 }}>Ana Paula · Aliança T3</div>
            <div style={{ fontSize: 10, color: '#A8A8E0' }}>CECE Natal · Tirol</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const GoogleG = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z" />
    <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z" />
    <path fill="#4A90E2" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z" />
    <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z" />
  </svg>
);

const InputWithIcon = ({ icon, type = 'text', placeholder, value, onChange, right, autoFocus }) => (
  <div style={{ position: 'relative' }}>
    {icon && <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: 'var(--ink-mute)', pointerEvents: 'none' }}>{icon}</span>}
    <input
      type={type}
      placeholder={placeholder}
      value={value || ''}
      onChange={(e) => onChange && onChange(e.target.value)}
      autoFocus={autoFocus}
      style={{
        width: '100%', padding: `11px 14px 11px ${icon ? 40 : 14}px`,
        paddingRight: right ? 40 : 14,
        borderRadius: 10, background: 'var(--paper)', border: '1px solid var(--line-strong)',
        fontFamily: 'inherit', fontSize: 14, color: 'var(--ink)', outline: 'none',
        transition: 'border-color .12s', boxSizing: 'border-box',
      }}
      onFocus={(e) => (e.target.style.borderColor = 'var(--indigo)')}
      onBlur={(e) => (e.target.style.borderColor = 'var(--line-strong)')}
    />
    {right && <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>{right}</span>}
  </div>
);

const ErrorBanner = ({ msg }) => msg ? (
  <div style={{ padding: '10px 14px', borderRadius: 10, background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
    ⚠️ {msg}
  </div>
) : null;

const DemoBanner = () => (
  <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--amber-soft, #FFF8E6)', border: '1px solid var(--amber)', color: '#92600A', fontSize: 12, lineHeight: 1.4 }}>
    <strong>Modo demo</strong> — Supabase não configurado. Configure o <code>.env</code> para ativar autenticação real.
  </div>
);

// ─────────── LOGIN ───────────
const AliancaLogin = ({ onSignup, signInWithEmail, signInWithMagicLink, signInWithGoogle, resetPassword, isDemo, tweaks = {} }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPw, setShowPw] = React.useState(false);
  const [magicSent, setMagicSent] = React.useState(false);
  const [resetSent, setResetSent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const supabaseOn = isSupabaseConfigured();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await signInWithEmail(email, password);
    if (err) setError(err.message === 'Invalid login credentials' ? 'Email ou senha incorretos.' : err.message);
    setLoading(false);
  };

  const handleMagicLink = async () => {
    if (!email) { setError('Digite seu email primeiro.'); return; }
    setError('');
    setLoading(true);
    const { error: err } = await signInWithMagicLink(email);
    if (err) setError(err.message);
    else setMagicSent(true);
    setLoading(false);
  };

  return (
    <div className="alianca-root" style={{ display: 'flex', minHeight: '100vh' }}>
      <AuthHero />

      <div style={{ width: 520, background: 'var(--bg)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--line)' }}>
          <div className="chip">Acesso seguro · Supabase</div>
          <a href="/lp" style={{ fontSize: 12, color: 'var(--ink-mute)', cursor: 'pointer', textDecoration: 'none' }}>← Voltar para o site</a>
        </div>

        <div style={{ flex: 1, padding: '48px 40px', display: 'flex', flexDirection: 'column', gap: 0, overflow: 'auto' }}>
          {magicSent ? (
            <div style={{ textAlign: 'center', padding: '24px 12px' }}>
              <div style={{ width: 72, height: 72, borderRadius: 18, background: 'var(--indigo-soft)', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>📬</div>
              <div style={{ fontSize: 22, fontWeight: 700, marginTop: 18, letterSpacing: '-0.02em' }}>Link enviado!</div>
              <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 8, lineHeight: 1.5 }}>
                Verifique seu email <strong style={{ color: 'var(--ink)' }}>{email || 'seu@email.com'}</strong><br />
                e clique no link para entrar. Pode levar até <span className="num">2 min</span>.
              </div>
              <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button className="btn btn-primary" style={{ justifyContent: 'center' }} onClick={() => window.open('mailto:', '_blank')}>Abrir email</button>
                <button onClick={() => setMagicSent(false)} className="btn btn-ghost" style={{ justifyContent: 'center' }}>← Tentar de novo</button>
              </div>
            </div>
          ) : (
            <React.Fragment>
              <div>
                <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em', margin: 0 }}>Entrar</h2>
                <p style={{ fontSize: 14, color: 'var(--ink-soft)', margin: '6px 0 0' }}>Acesse seu planejamento e devolução da CB.</p>
              </div>

              {!supabaseOn && <div style={{ marginTop: 16 }}><DemoBanner /></div>}

              <form onSubmit={handleSubmit} style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>E-mail</label>
                  <div style={{ marginTop: 6 }}>
                    <InputWithIcon icon="✉" type="email" placeholder="seu@email.com" value={email} onChange={setEmail} autoFocus />
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Senha</label>
                    <a onClick={async () => {
                      if (!email) { setError('Digite seu email acima primeiro.'); return; }
                      setError(''); setLoading(true);
                      const { error: err } = await resetPassword?.(email) || {};
                      if (err) setError(err.message);
                      else setResetSent(true);
                      setLoading(false);
                    }} style={{ fontSize: 11, color: 'var(--indigo)', cursor: 'pointer', fontWeight: 500 }}>
                      {resetSent ? '✓ Email enviado' : 'Esqueci minha senha'}
                    </a>
                  </div>
                  <div style={{ marginTop: 6 }}>
                    <InputWithIcon icon="🔒" type={showPw ? 'text' : 'password'} placeholder="••••••••"
                      value={password} onChange={setPassword}
                      right={<span onClick={() => setShowPw(v => !v)} style={{ color: 'var(--ink-mute)', fontSize: 14 }}>{showPw ? '🙈' : '👁'}</span>} />
                  </div>
                </div>

                {error && <ErrorBanner msg={error} />}

                <button type="submit" className="btn btn-primary" disabled={loading}
                  style={{ marginTop: 6, justifyContent: 'center', padding: '13px 16px', fontSize: 14 }}>
                  {loading ? 'Entrando…' : 'Entrar →'}
                </button>
              </form>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
                <div style={{ flex: 1, height: 1, background: 'var(--line)' }}></div>
                <span style={{ fontSize: 11, color: 'var(--ink-mute)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>ou</span>
                <div style={{ flex: 1, height: 1, background: 'var(--line)' }}></div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {supabaseOn && (
                  <button className="btn btn-ghost" style={{ justifyContent: 'center', padding: '11px 16px' }}
                    onClick={handleMagicLink} disabled={loading}>
                    ✨ Entrar por link mágico
                  </button>
                )}
                {supabaseOn && (
                  <button className="btn btn-ghost" style={{ justifyContent: 'center', padding: '11px 16px' }}
                    onClick={() => signInWithGoogle?.()}>
                    <GoogleG /> Continuar com Google
                  </button>
                )}
              </div>

              <div style={{ marginTop: 'auto', paddingTop: 28 }}>
                <div style={{ fontSize: 13, color: 'var(--ink-soft)', textAlign: 'center' }}>
                  Ainda não tem conta?{' '}
                  <a onClick={() => onSignup?.()} style={{ color: 'var(--indigo)', fontWeight: 600, cursor: 'pointer' }}>Criar conta grátis →</a>
                </div>
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
};

// ─────────── SIGNUP ───────────
const AliancaSignup = ({ onLogin, signUpWithEmail, signInWithGoogle, tweaks = {} }) => {
  const [step, setStep] = React.useState(1);
  const [form, setForm] = React.useState({
    name: '', email: '', password: '', telefone: '',
    tipo_vinculo: 'comunidade_alianca',
    nivel_formativo: 'T3', celula: '', formador: '',
    grupo_oracao: '', pastor: '', acompanhador: '',
  });
  const [showPw, setShowPw] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const VINCULOS = [
    { value: 'comunidade_alianca', label: 'Comunidade de Aliança', sub: '15% · 10% Obra + 5% Necessitados', icon: '🕊️' },
    { value: 'vocacionado', label: 'Vocacionado(a)', sub: '15% · Integral à Obra', icon: '✨' },
    { value: 'obra', label: 'Membro da Obra', sub: '10% · Integral à Obra', icon: '🤝' },
  ];
  const NIVEIS = ['P1', 'P2', 'D1', 'D2', 'T1', 'T2', 'T3', 'T4', 'T5', 'Permanente', 'Definitivo'];

  const formatPhone = (val) => {
    const nums = val.replace(/\D/g, '').slice(0, 11);
    if (nums.length <= 2) return nums;
    if (nums.length <= 7) return `(${nums.slice(0, 2)}) ${nums.slice(2)}`;
    return `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7)}`;
  };

  const isAlianca = form.tipo_vinculo === 'comunidade_alianca';
  const percentual = form.tipo_vinculo === 'obra' ? 10 : 15;

  const handleStep1 = () => {
    if (!form.name.trim()) { setError('Digite seu nome.'); return; }
    if (!form.email.includes('@')) { setError('Email inválido.'); return; }
    if (form.password.length < 6) { setError('Senha precisa ter pelo menos 6 caracteres.'); return; }
    setError('');
    setStep(2);
  };

  const handleSignup = async () => {
    setError('');
    setLoading(true);
    const metadata = {
      telefone: form.telefone.replace(/\D/g, ''),
      tipo_vinculo: form.tipo_vinculo,
      percentual,
      ...(isAlianca
        ? { nivel_formativo: form.nivel_formativo, celula: form.celula, formador_comunitario: form.formador }
        : { grupo_oracao: form.grupo_oracao, pastor_grupo: form.pastor, acompanhador: form.acompanhador }),
    };
    const { error: err } = await signUpWithEmail(form.email, form.password, form.name, metadata);
    if (err) setError(err.message);
    else setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="alianca-root" style={{ display: 'flex', minHeight: '100vh' }}>
        <AuthHero />
        <div style={{ width: 560, background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
          <div style={{ width: 72, height: 72, borderRadius: 18, background: 'var(--green-soft, #D1FAE5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>✅</div>
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 20 }}>Conta criada!</div>
          <div style={{ fontSize: 14, color: 'var(--ink-soft)', marginTop: 8, textAlign: 'center', maxWidth: 360, lineHeight: 1.5 }}>
            Verifique seu email <strong style={{ color: 'var(--ink)' }}>{form.email}</strong> para confirmar sua conta antes de entrar.
          </div>
          <button className="btn btn-primary" style={{ marginTop: 28, justifyContent: 'center', padding: '12px 32px' }}
            onClick={() => onLogin?.()}>
            Ir para o login →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="alianca-root" style={{ display: 'flex', minHeight: '100vh' }}>
      <AuthHero />

      <div style={{ width: 560, background: 'var(--bg)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--line)' }}>
          <div className="chip">Etapa <span className="num" style={{ color: 'var(--ink)' }}>{step}</span> de 2 · Cadastro</div>
          <a onClick={() => onLogin?.()} style={{ fontSize: 12, color: 'var(--ink-mute)', cursor: 'pointer' }}>Já tenho conta · Entrar</a>
        </div>

        <div style={{ padding: '16px 40px 0' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {[1, 2].map((s) => (
              <div key={s} style={{
                flex: 1, height: 4, borderRadius: 99,
                background: step >= s ? 'var(--indigo)' : 'var(--line-strong)',
                transition: 'background .2s',
              }}></div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, padding: '24px 40px 32px', overflow: 'auto' }}>
          {step === 1 ? (
            <React.Fragment>
              <div>
                <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.03em', margin: 0 }}>Criar sua conta</h2>
                <p style={{ fontSize: 13, color: 'var(--ink-soft)', margin: '4px 0 0' }}>Dados básicos. No próximo passo, conta sobre seu vínculo na Comunidade.</p>
              </div>

              <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Nome completo</label>
                  <div style={{ marginTop: 6 }}>
                    <InputWithIcon icon="👤" placeholder="Seu nome" value={form.name} onChange={(v) => set('name', v)} autoFocus />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>E-mail</label>
                  <div style={{ marginTop: 6 }}>
                    <InputWithIcon icon="✉" type="email" placeholder="seu@email.com" value={form.email} onChange={(v) => set('email', v)} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Senha</label>
                  <div style={{ marginTop: 6 }}>
                    <InputWithIcon icon="🔒" type={showPw ? 'text' : 'password'} placeholder="Mínimo 6 caracteres"
                      value={form.password} onChange={(v) => set('password', v)}
                      right={<span onClick={() => setShowPw(v => !v)} style={{ color: 'var(--ink-mute)', fontSize: 14 }}>{showPw ? '🙈' : '👁'}</span>} />
                  </div>
                  <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} style={{
                        flex: 1, height: 3, borderRadius: 99,
                        background: form.password.length >= i * 2 ? (form.password.length >= 8 ? 'var(--green)' : 'var(--amber)') : 'var(--line-strong)',
                      }}></div>
                    ))}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 4 }}>
                    {form.password.length === 0 ? '6+ caracteres recomendados' :
                      form.password.length < 6 ? 'Muito curta' :
                      form.password.length < 8 ? 'OK · pode melhorar' : '✓ Forte'}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>WhatsApp</label>
                  <div style={{ marginTop: 6 }}>
                    <InputWithIcon icon="📱" type="tel" placeholder="(84) 99999-9999" value={form.telefone} onChange={(v) => set('telefone', formatPhone(v))} />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 4 }}>Receberá lembretes da Comunhão de Bens neste número.</div>
                </div>

                {error && <ErrorBanner msg={error} />}

                <button onClick={handleStep1} className="btn btn-primary" style={{ marginTop: 8, justifyContent: 'center', padding: '13px 16px', fontSize: 14 }}>
                  Continuar → Vínculo
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
                <div style={{ flex: 1, height: 1, background: 'var(--line)' }}></div>
                <span style={{ fontSize: 11, color: 'var(--ink-mute)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>ou</span>
                <div style={{ flex: 1, height: 1, background: 'var(--line)' }}></div>
              </div>
              {isSupabaseConfigured() && (
                <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => signInWithGoogle?.()}>
                  <GoogleG /> Cadastrar com Google
                </button>
              )}
            </React.Fragment>
          ) : (
            <React.Fragment>
              <div>
                <button onClick={() => setStep(1)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--ink-mute)', fontSize: 12, padding: 0, marginBottom: 12 }}>← Dados básicos</button>
                <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.03em', margin: 0 }}>Seu vínculo</h2>
                <p style={{ fontSize: 13, color: 'var(--ink-soft)', margin: '4px 0 0' }}>Define o percentual da Comunhão e habilita os campos certos no app.</p>
              </div>

              <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {VINCULOS.map((v) => {
                  const active = form.tipo_vinculo === v.value;
                  return (
                    <button key={v.value} onClick={() => set('tipo_vinculo', v.value)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 14, padding: 14, borderRadius: 12, cursor: 'pointer',
                        border: '1.5px solid ' + (active ? 'var(--indigo)' : 'var(--line-strong)'),
                        background: active ? 'var(--indigo-soft)' : 'var(--paper)',
                        textAlign: 'left', fontFamily: 'inherit',
                      }}>
                      <div style={{ width: 18, height: 18, borderRadius: 99, border: '2px solid ' + (active ? 'var(--indigo)' : 'var(--line-strong)'), background: active ? 'var(--indigo)' : 'transparent', boxShadow: active ? 'inset 0 0 0 3px var(--paper)' : 'none', flexShrink: 0 }}></div>
                      <span style={{ fontSize: 20, flexShrink: 0 }}>{v.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: active ? 'var(--indigo)' : 'var(--ink)' }}>{v.label}</div>
                        <div style={{ fontSize: 11, color: 'var(--ink-mute)' }}>{v.sub}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 10, background: 'var(--green-soft, #D1FAE5)', color: 'var(--green)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                ✓ Comunhão de Bens · <span className="num" style={{ fontSize: 14 }}>{percentual}%</span> da sua renda mensal
              </div>

              <div style={{ marginTop: 20, padding: 16, borderRadius: 12, background: 'var(--bg-2)' }}>
                <div style={{ fontSize: 11, color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 12 }}>
                  {isAlianca ? 'Dados da Aliança' : 'Grupo de Oração'}
                </div>
                {isAlianca ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)' }}>Nível formativo</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
                        {NIVEIS.map((n) => (
                          <button key={n} onClick={() => set('nivel_formativo', n)}
                            style={{
                              padding: '5px 10px', borderRadius: 6, cursor: 'pointer',
                              background: form.nivel_formativo === n ? 'var(--indigo)' : 'var(--paper)',
                              color: form.nivel_formativo === n ? '#fff' : 'var(--ink-soft)',
                              border: '1px solid ' + (form.nivel_formativo === n ? 'var(--indigo)' : 'var(--line)'),
                              fontSize: 11, fontWeight: 600, fontFamily: 'inherit',
                            }}>{n}</button>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)' }}>Célula comunitária</label>
                        <input className="input" placeholder="Nome da sua célula" value={form.celula} onChange={(e) => set('celula', e.target.value)} style={{ marginTop: 6, background: 'var(--paper)' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)' }}>Formador comunitário</label>
                        <input className="input" placeholder="Nome do formador" value={form.formador} onChange={(e) => set('formador', e.target.value)} style={{ marginTop: 6, background: 'var(--paper)' }} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)' }}>Grupo de oração</label>
                      <input className="input" placeholder="Nome do grupo" value={form.grupo_oracao} onChange={(e) => set('grupo_oracao', e.target.value)} style={{ marginTop: 6, background: 'var(--paper)' }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)' }}>Pastor do grupo</label>
                        <input className="input" placeholder="Nome do pastor" value={form.pastor} onChange={(e) => set('pastor', e.target.value)} style={{ marginTop: 6, background: 'var(--paper)' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)' }}>Acompanhador(a)</label>
                        <input className="input" placeholder="Nome" value={form.acompanhador} onChange={(e) => set('acompanhador', e.target.value)} style={{ marginTop: 6, background: 'var(--paper)' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 16, lineHeight: 1.5 }}>
                Ao continuar, você concorda com os <a style={{ color: 'var(--indigo)', cursor: 'pointer' }}>Termos de Uso</a> e a <a style={{ color: 'var(--indigo)', cursor: 'pointer' }}>Política de Privacidade</a>. Seus dados são protegidos por RLS no Supabase.
              </div>

              {error && <div style={{ marginTop: 12 }}><ErrorBanner msg={error} /></div>}

              <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
                <button onClick={() => setStep(1)} className="btn btn-ghost">← Voltar</button>
                <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '13px 16px', fontSize: 14 }}
                  onClick={handleSignup} disabled={loading}>
                  {loading ? 'Criando conta…' : 'Criar conta grátis →'}
                </button>
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
};

// ─────────── MOBILE LOGIN ───────────
const AliancaLoginMobile = ({ onSignup, signInWithEmail, signInWithMagicLink, signInWithGoogle, tweaks = {} }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPw, setShowPw] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await signInWithEmail(email, password);
    if (err) setError(err.message === 'Invalid login credentials' ? 'Email ou senha incorretos.' : err.message);
    setLoading(false);
  };

  return (
    <div className="alianca-root" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={{ height: 50, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px', fontSize: 14, fontWeight: 700 }}>
        <span>9:41</span>
        <div style={{ display: 'flex', gap: 4, fontSize: 10 }}><span>●●●</span><span>📶</span><span>🔋</span></div>
      </div>

      <div style={{ padding: '24px 24px 32px', background: 'linear-gradient(135deg, var(--indigo-deep) 0%, var(--indigo) 100%)', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <svg style={{ position: 'absolute', right: -60, top: -60, opacity: 0.08 }} width="220" height="220" viewBox="0 0 220 220">
          <circle cx="110" cy="110" r="90" stroke="#fff" strokeWidth="2" fill="none" />
          <circle cx="110" cy="110" r="50" stroke="#fff" strokeWidth="2" fill="none" />
        </svg>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: '#fff', color: 'var(--indigo)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 17 }}>D</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>DuoFinanças</div>
            <div style={{ fontSize: 10, color: '#C0C0F0' }}>Suas finanças em sintonia</div>
          </div>
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1, marginTop: 18, position: 'relative' }}>
          Bem-vindo de volta.<br/><span style={{ color: 'var(--amber)' }}>Devolva com fidelidade.</span>
        </h1>
      </div>

      <div style={{ padding: '20px 22px 0', marginTop: -22, position: 'relative', flex: 1, overflowY: 'auto' }}>
        <div className="card" style={{ padding: 22, boxShadow: '0 -8px 28px -10px rgba(0,0,0,0.10)' }}>
          <div style={{ display: 'flex', gap: 0, padding: 4, background: 'var(--bg-2)', borderRadius: 10, marginBottom: 22 }}>
            <button style={{ flex: 1, padding: '8px', borderRadius: 7, background: 'var(--paper)', color: 'var(--ink)', border: 'none', fontWeight: 600, fontSize: 12, fontFamily: 'inherit', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>Entrar</button>
            <button onClick={() => onSignup?.()} style={{ flex: 1, padding: '8px', borderRadius: 7, background: 'transparent', color: 'var(--ink-soft)', border: 'none', fontWeight: 500, fontSize: 12, fontFamily: 'inherit', cursor: 'pointer' }}>Criar conta</button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)' }}>E-mail</label>
              <div style={{ marginTop: 4 }}>
                <InputWithIcon icon="✉" type="email" placeholder="seu@email.com" value={email} onChange={setEmail} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)' }}>Senha</label>
                <a style={{ fontSize: 10, color: 'var(--indigo)' }}>Esqueci</a>
              </div>
              <div style={{ marginTop: 4 }}>
                <InputWithIcon icon="🔒" type={showPw ? 'text' : 'password'} placeholder="••••••••"
                  value={password} onChange={setPassword}
                  right={<span onClick={() => setShowPw(v => !v)} style={{ color: 'var(--ink-mute)', fontSize: 13 }}>{showPw ? '🙈' : '👁'}</span>} />
              </div>
            </div>
            {error && <ErrorBanner msg={error} />}
            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ marginTop: 4, justifyContent: 'center', padding: '12px', fontSize: 14 }}>
              {loading ? 'Entrando…' : 'Entrar →'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '16px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--line)' }}></div>
            <span style={{ fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>ou</span>
            <div style={{ flex: 1, height: 1, background: 'var(--line)' }}></div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {isSupabaseConfigured() && (
              <button className="btn btn-ghost" style={{ justifyContent: 'center', padding: '10px', fontSize: 12 }}
                onClick={() => signInWithMagicLink?.(email)}>
                ✨ Link mágico no email
              </button>
            )}
            {isSupabaseConfigured() && (
              <button className="btn btn-ghost" style={{ justifyContent: 'center', padding: '10px', fontSize: 12 }}
                onClick={() => signInWithGoogle?.()}>
                <GoogleG size={14} /> Continuar com Google
              </button>
            )}
          </div>

          <div style={{ marginTop: 18, fontSize: 11, color: 'var(--ink-mute)', textAlign: 'center' }}>
            Membros da <strong>Comunidade Shalom</strong> · Dados protegidos por RLS
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 22, fontSize: 10, color: 'var(--ink-mute)' }}>
          <a style={{ cursor: 'pointer' }}>Termos</a>
          <a style={{ cursor: 'pointer' }}>Privacidade</a>
          <a style={{ cursor: 'pointer' }}>Suporte</a>
        </div>
      </div>
    </div>
  );
};

// ─── Exports ─────────────────────────────────────────────
export { AliancaLogin, AliancaSignup, AliancaLoginMobile };
