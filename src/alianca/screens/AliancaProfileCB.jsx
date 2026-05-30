// Auto-generated from prototype. Aliança UI kit for DuoFinanças.
import React from 'react';
import {
  fmt, fmtCompact, INCOME_TOTAL, PROFILE
} from '../mockData';
import { AlIcon, AlSidebar } from '../components/AliancaShared';

// ============ PROFILE / PERFIL ============
const AliancaProfile = ({ onNavigate, couple, profile: profileProp, user: userProp, plan: planProp, cbConfig, updateProfile, updateAuth, savePlan, saveCBConfig, showToast, tweaks = {} }) => {
  const realName = profileProp?.full_name || userProp?.user_metadata?.full_name || PROFILE.full_name;
  const realEmail = userProp?.email || PROFILE.email;

  const [tab, setTab] = React.useState('account');
  const [name, setName] = React.useState(realName);
  const [email, setEmail] = React.useState(realEmail);
  const [income, setIncome] = React.useState(planProp?.monthly_income || PROFILE.monthly_income);
  const [hasExtra, setHasExtra] = React.useState(PROFILE.has_extra_income);
  const [extraValue, setExtraValue] = React.useState(PROFILE.extra_income_value);
  const [extraDesc, setExtraDesc] = React.useState(PROFILE.extra_income_description);
  const [showPassword, setShowPassword] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [vinculo, setVinculo] = React.useState(cbConfig?.tipo_vinculo || 'comunidade_alianca');

  React.useEffect(() => {
    if (profileProp?.full_name) setName(profileProp.full_name);
  }, [profileProp?.full_name]);
  React.useEffect(() => {
    if (userProp?.email) setEmail(userProp.email);
  }, [userProp?.email]);
  React.useEffect(() => {
    if (planProp?.monthly_income) setIncome(planProp.monthly_income);
  }, [planProp?.monthly_income]);
  React.useEffect(() => {
    if (cbConfig?.tipo_vinculo) setVinculo(cbConfig.tipo_vinculo);
  }, [cbConfig?.tipo_vinculo]);

  const initials = name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?';

  const handleSaveAccount = async () => {
    setSaving(true);
    try {
      if (updateProfile) await updateProfile({ full_name: name });
      if (updateAuth) await updateAuth({ data: { full_name: name }, ...(email !== realEmail ? { email } : {}) });
      showToast?.('Perfil atualizado com sucesso!');
    } catch (err) {
      showToast?.('Erro ao salvar perfil. Tente novamente.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveFinance = async () => {
    setSaving(true);
    try {
      if (savePlan) await savePlan({ monthly_income: income });
      else showToast?.('Renda atualizada!');
    } catch (err) {
      showToast?.('Erro ao salvar renda. Tente novamente.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCommunity = async () => {
    setSaving(true);
    try {
      const pct = vinculo === 'obra' ? 10 : 15;
      if (saveCBConfig) await saveCBConfig({ tipo_vinculo: vinculo, percentual: pct });
      else showToast?.('Vínculo atualizado!');
    } catch (err) {
      showToast?.('Erro ao salvar vínculo. Tente novamente.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="alianca-root" style={{ display: 'flex' }}>
      <AlSidebar active="profile" onNavigate={onNavigate} couple={couple} />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '16px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--line)' }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--ink-mute)' }}>Conta</div>
            <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 2 }}>Editar perfil</div>
          </div>
          <button className="btn btn-ghost" onClick={() => onNavigate?.('home')}>Cancelar</button>
        </div>

        <div style={{ padding: '24px 28px', overflowY: 'auto', flex: 1, maxWidth: 880, margin: '0 auto', width: '100%' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 2, padding: 4, background: 'var(--bg-2)', borderRadius: 12, marginBottom: 24, width: 'fit-content' }}>
            {[
              { id: 'account', label: 'Conta', icon: '👤' },
              { id: 'finance', label: 'Finanças', icon: '💰' },
              { id: 'community', label: 'Comunidade', icon: '🕊️' },
            ].map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '8px 18px', borderRadius: 8, cursor: 'pointer',
                  background: tab === t.id ? 'var(--paper)' : 'transparent',
                  color: tab === t.id ? 'var(--ink)' : 'var(--ink-soft)',
                  fontWeight: tab === t.id ? 600 : 500,
                  border: 'none', fontFamily: 'inherit', fontSize: 13,
                  boxShadow: tab === t.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                }}>
                <span>{t.icon}</span>{t.label}
              </button>
            ))}
          </div>

          {tab === 'account' && (
            <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24 }}>
              {/* Avatar card */}
              <div className="card" style={{ padding: 24, textAlign: 'center', height: 'fit-content' }}>
                <div style={{ width: 110, height: 110, borderRadius: 99, background: 'linear-gradient(135deg, var(--indigo) 0%, var(--indigo-deep) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 38, fontWeight: 700, margin: '0 auto', position: 'relative', cursor: 'pointer' }}>
                  {initials}
                  <div style={{ position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, borderRadius: 99, background: 'var(--paper)', border: '2px solid var(--paper)', boxShadow: '0 2px 6px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink)', fontSize: 14 }}>📷</div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, marginTop: 14 }}>{name}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-mute)', marginTop: 2 }}>{email}</div>
                <div className="chip chip-indigo" style={{ marginTop: 12 }}>🕊️ Comunidade de Aliança</div>
                <div className="divider" style={{ margin: '18px 0' }}></div>
                <div style={{ fontSize: 11, color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'left' }}>Conta criada</div>
                <div style={{ fontSize: 13, marginTop: 4, textAlign: 'left' }} className="tnum">12 Set 2025 · 8 meses</div>
                <div style={{ fontSize: 11, color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 14, textAlign: 'left' }}>Último acesso</div>
                <div style={{ fontSize: 13, marginTop: 4, textAlign: 'left' }} className="tnum">hoje · 09:42</div>
              </div>

              {/* Form */}
              <div className="card" style={{ padding: 24 }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Informações pessoais</div>
                <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginBottom: 20 }}>Como você aparece no app e nas comunicações.</div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)' }}>Nome completo</label>
                    <input className="input" value={name} onChange={(e) => setName(e.target.value)} style={{ marginTop: 6 }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)' }}>E-mail</label>
                    <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} style={{ marginTop: 6 }} />
                    {email !== realEmail && (
                      <div style={{ fontSize: 11, color: 'var(--amber)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>⚠️ Confirmação será enviada ao novo endereço.</div>
                    )}
                  </div>
                  <div className="divider" style={{ margin: '6px 0' }}></div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)' }}>Senha</div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)' }}>Nova senha · opcional</label>
                    <div style={{ position: 'relative', marginTop: 6 }}>
                      <input className="input" type={showPassword ? 'text' : 'password'} placeholder="••••••••" />
                      <button onClick={() => setShowPassword(v => !v)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--ink-mute)', fontSize: 12 }}>
                        {showPassword ? '🙈' : '👁'}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)' }}>Confirmar nova senha</label>
                    <input className="input" type={showPassword ? 'text' : 'password'} placeholder="••••••••" style={{ marginTop: 6 }} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8, marginTop: 24, justifyContent: 'flex-end' }}>
                  <button className="btn btn-ghost" onClick={() => { setName(realName); setEmail(realEmail); }}>Descartar</button>
                  <button className="btn btn-primary" onClick={handleSaveAccount} disabled={saving}>
                    {saving ? 'Salvando…' : 'Salvar alterações'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {tab === 'finance' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="card" style={{ padding: 24 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>Renda principal</div>
                <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 2 }}>Atualize quando seu salário mudar.</div>
                <div style={{ marginTop: 20 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Salário mensal</label>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8, padding: '12px 14px', border: '1px solid var(--line-strong)', borderRadius: 12, background: 'var(--bg)' }}>
                    <span style={{ fontSize: 16, color: 'var(--ink-mute)' }}>R$</span>
                    <input value={income.toLocaleString('pt-BR')} onChange={(e) => setIncome(Number(e.target.value.replace(/\D/g, '')) || 0)} className="num" style={{ fontSize: 28, border: 'none', outline: 'none', background: 'transparent', flex: 1 }} />
                  </div>
                </div>
                <div style={{ marginTop: 16, padding: 14, borderRadius: 10, background: 'var(--bg-2)' }}>
                  <div style={{ fontSize: 11, color: 'var(--ink-mute)' }}>Equivalente a</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 12 }}>
                    <span className="num">{fmt(income / 4.33)}</span>
                    <span style={{ color: 'var(--ink-mute)' }}>por semana</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2, fontSize: 12 }}>
                    <span className="num">{fmt(income / 22)}</span>
                    <span style={{ color: 'var(--ink-mute)' }}>por dia útil</span>
                  </div>
                </div>
              </div>

              <div className="card" style={{ padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>Renda extra</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 2 }}>Freelance, aluguel, dividendos, comissões.</div>
                  </div>
                  <button onClick={() => setHasExtra(v => !v)} style={{ width: 40, height: 22, borderRadius: 99, background: hasExtra ? 'var(--indigo)' : 'var(--line-strong)', border: 'none', position: 'relative', cursor: 'pointer', transition: 'background .15s' }}>
                    <div style={{ position: 'absolute', top: 2, left: hasExtra ? 20 : 2, width: 18, height: 18, borderRadius: 99, background: '#fff', transition: 'left .15s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}></div>
                  </button>
                </div>
                {hasExtra ? (
                  <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Valor mensal</label>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8, padding: '12px 14px', border: '1px solid var(--line-strong)', borderRadius: 12, background: 'var(--bg)' }}>
                        <span style={{ fontSize: 16, color: 'var(--ink-mute)' }}>R$</span>
                        <input value={extraValue.toLocaleString('pt-BR')} onChange={(e) => setExtraValue(Number(e.target.value.replace(/\D/g, '')) || 0)} className="num" style={{ fontSize: 28, border: 'none', outline: 'none', background: 'transparent', flex: 1 }} />
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)' }}>Descrição</label>
                      <input className="input" value={extraDesc} onChange={(e) => setExtraDesc(e.target.value)} style={{ marginTop: 6 }} placeholder="Ex: Freelance, aluguel…" />
                    </div>
                  </div>
                ) : (
                  <div style={{ marginTop: 20, padding: 20, borderRadius: 12, background: 'var(--bg-2)', textAlign: 'center', fontSize: 12, color: 'var(--ink-mute)' }}>
                    Sem renda extra cadastrada. Ative o switch acima.
                  </div>
                )}
              </div>

              <div className="card" style={{ padding: 22, gridColumn: 'span 2' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>Renda total considerada</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>É a base para o cálculo da Comunhão de Bens e do orçamento.</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="num" style={{ fontSize: 32, color: 'var(--indigo)' }}>{fmt(income + (hasExtra ? extraValue : 0))}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-mute)' }}>15% · CB = <span className="num" style={{ color: 'var(--ink)' }}>{fmt((income + (hasExtra ? extraValue : 0)) * 0.15)}</span></div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 18 }}>
                  <button className="btn btn-ghost" onClick={() => setIncome(planProp?.monthly_income || PROFILE.monthly_income)}>Descartar</button>
                  <button className="btn btn-primary" onClick={handleSaveFinance} disabled={saving}>
                    {saving ? 'Salvando…' : 'Salvar dados financeiros'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {tab === 'community' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="card" style={{ padding: 24 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>Vínculo com a Comunidade</div>
                <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 2, marginBottom: 18 }}>Define o percentual da Comunhão de Bens.</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { id: 'oracao', label: 'Grupo de Oração', sub: '10% sobre a renda', pct: 10 },
                    { id: 'comunidade_alianca', label: 'Comunidade de Aliança', sub: '15% sobre a renda', pct: 15 },
                    { id: 'vocacionado', label: 'Vocacionado(a)', sub: '15% — Obra integral', pct: 15 },
                    { id: 'obra', label: 'Membro da Obra', sub: '10% — Obra integral', pct: 10 },
                  ].map((v) => {
                    const active = vinculo === v.id;
                    return (
                      <button key={v.id} onClick={() => setVinculo(v.id)} style={{
                        display: 'flex', alignItems: 'center', gap: 14, padding: 14, borderRadius: 10, cursor: 'pointer',
                        border: '1px solid ' + (active ? 'var(--indigo)' : 'var(--line)'),
                        background: active ? 'var(--indigo-soft)' : 'var(--paper)',
                        textAlign: 'left', fontFamily: 'inherit', width: '100%',
                      }}>
                        <div style={{ width: 18, height: 18, borderRadius: 99, border: '2px solid ' + (active ? 'var(--indigo)' : 'var(--line-strong)'), background: active ? 'var(--indigo)' : 'transparent', boxShadow: active ? 'inset 0 0 0 3px var(--paper)' : 'none', flexShrink: 0 }}></div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: active ? 'var(--indigo)' : 'var(--ink)' }}>{v.label}</div>
                          <div style={{ fontSize: 11, color: 'var(--ink-mute)' }}>{v.sub}</div>
                        </div>
                        <div className="num" style={{ fontSize: 18, color: active ? 'var(--indigo)' : 'var(--ink-mute)' }}>{v.pct}%</div>
                      </button>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 18 }}>
                  <button className="btn btn-primary" onClick={handleSaveCommunity} disabled={saving}>
                    {saving ? 'Salvando…' : 'Salvar vínculo'}
                  </button>
                </div>
              </div>

              <div className="card" style={{ padding: 24 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>Comunidade local</div>
                <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 2, marginBottom: 18 }}>Onde você atua e participa.</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)' }}>Centro de evangelização</label>
                    <select className="input" style={{ marginTop: 6, fontFamily: 'inherit' }}>
                      <option>CECE Natal — Tirol</option>
                      <option>CECE Recife</option>
                      <option>CECE São Paulo</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)' }}>Coordenador(a)</label>
                    <input className="input" defaultValue="Pe. Ricardo Almeida" style={{ marginTop: 6 }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)' }}>Data da Aliança</label>
                    <input type="date" className="input" defaultValue="2018-12-08" style={{ marginTop: 6, fontFamily: 'inherit' }} />
                  </div>
                </div>
                <div style={{ marginTop: 12, padding: 10, borderRadius: 8, background: 'var(--bg-2)', fontSize: 11, color: 'var(--ink-mute)' }}>
                  ℹ️ Esses dados são informativos. Use o card ao lado para alterar seu vínculo e percentual.
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// ============ CB CONFIG ============
const AliancaCBConfig = ({ tweaks = {} }) => {
  const [nome, setNome] = React.useState(PROFILE.full_name);
  const [tel, setTel] = React.useState(PROFILE.telefone_display);
  const [renda, setRenda] = React.useState(INCOME_TOTAL);
  const [vinculo, setVinculo] = React.useState('alianca');
  const [dia, setDia] = React.useState(5);
  const [wpp, setWpp] = React.useState(true);
  const [browser, setBrowser] = React.useState(true);

  const pct = vinculo === 'alianca' ? 0.15 : 0.10;
  const valor = renda * pct;
  const obra = renda * 0.10;
  const nec = renda * 0.05;

  return (
    <div className="alianca-root" style={{ display: 'flex' }}>
      <AlSidebar active="cb" />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '16px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <a style={{ fontSize: 13, color: 'var(--ink-mute)', cursor: 'pointer' }}>← Comunhão</a>
            <span style={{ color: 'var(--line-strong)' }}>/</span>
            <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-0.02em' }}>Configurar lembrete</div>
          </div>
          <div className="chip chip-success">● Ativo · próximo dia {dia}</div>
        </div>

        <div style={{ padding: '20px 28px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16, flex: 1, overflow: 'auto' }}>
          {/* Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="card" style={{ padding: 22 }}>
              <div style={{ fontSize: 11, color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 14 }}>I · Dados pessoais</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)' }}>Nome</label>
                  <input className="input" value={nome} onChange={(e) => setNome(e.target.value)} style={{ marginTop: 6 }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)' }}>WhatsApp</label>
                  <input className="input" value={tel} onChange={(e) => setTel(e.target.value)} style={{ marginTop: 6, fontFamily: 'Sora, monospace', letterSpacing: '0.02em' }} />
                  <div style={{ fontSize: 10, color: 'var(--ink-mute)', marginTop: 4 }} className="tnum">Formato salvo: {tel.replace(/\D/g, '')}</div>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: 22 }}>
              <div style={{ fontSize: 11, color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 14 }}>II · Vínculo e renda</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)' }}>Renda mensal</label>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6, padding: '10px 14px', border: '1px solid var(--line-strong)', borderRadius: 10, background: 'var(--paper)' }}>
                    <span style={{ fontSize: 14, color: 'var(--ink-mute)' }}>R$</span>
                    <input value={renda.toLocaleString('pt-BR')} onChange={(e) => setRenda(Number(e.target.value.replace(/\D/g, '')) || 0)} className="num" style={{ fontSize: 22, border: 'none', outline: 'none', background: 'transparent', flex: 1 }} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)' }}>Tipo de vínculo</label>
                  <div style={{ display: 'flex', gap: 0, marginTop: 6, padding: 4, background: 'var(--bg-2)', borderRadius: 10 }}>
                    {[
                      { id: 'oracao', label: 'Grupo de Oração · 10%' },
                      { id: 'alianca', label: 'Comunidade de Aliança · 15%' },
                    ].map((v) => (
                      <button key={v.id} onClick={() => setVinculo(v.id)}
                        style={{
                          flex: 1, padding: '8px 10px', borderRadius: 8, cursor: 'pointer', border: 'none',
                          background: vinculo === v.id ? 'var(--paper)' : 'transparent',
                          color: vinculo === v.id ? 'var(--ink)' : 'var(--ink-soft)',
                          fontWeight: vinculo === v.id ? 600 : 500, fontSize: 12,
                          boxShadow: vinculo === v.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                          fontFamily: 'inherit',
                        }}>{v.label}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: 22 }}>
              <div style={{ fontSize: 11, color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 14 }}>III · Lembretes</div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)' }}>Dia do mês para o lembrete</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(14, 1fr)', gap: 4, marginTop: 8 }}>
                  {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => (
                    <button key={d} onClick={() => setDia(d)}
                      style={{
                        padding: '7px 0', borderRadius: 6, cursor: 'pointer', border: 'none',
                        background: dia === d ? 'var(--indigo)' : 'var(--bg-2)',
                        color: dia === d ? '#fff' : 'var(--ink-soft)',
                        fontSize: 11, fontWeight: dia === d ? 700 : 500, fontFamily: 'inherit',
                      }}>{d}</button>
                  ))}
                </div>
                <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 8 }}>3 dias antes do dia <span className="num">{dia}</span> aparecerá um banner; no próprio dia, a notificação dispara.</div>
              </div>

              <div className="divider" style={{ margin: '16px 0' }}></div>

              {[
                { val: wpp, set: setWpp, icon: '💬', label: 'WhatsApp · via N8N', sub: 'Mensagem enviada no dia configurado' },
                { val: browser, set: setBrowser, icon: '🔔', label: 'Navegador', sub: 'Notificação local no dispositivo' },
              ].map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i === 0 ? '1px solid var(--line)' : 'none' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>{t.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{t.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-mute)' }}>{t.sub}</div>
                  </div>
                  <button onClick={() => t.set(v => !v)} style={{ width: 40, height: 22, borderRadius: 99, background: t.val ? 'var(--indigo)' : 'var(--line-strong)', border: 'none', position: 'relative', cursor: 'pointer', transition: 'background .15s' }}>
                    <div style={{ position: 'absolute', top: 2, left: t.val ? 20 : 2, width: 18, height: 18, borderRadius: 99, background: '#fff', transition: 'left .15s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}></div>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Live preview */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="card" style={{ padding: 22, background: 'linear-gradient(135deg, var(--indigo-deep) 0%, var(--indigo) 100%)', color: '#fff', position: 'relative', overflow: 'hidden' }}>
              <svg style={{ position: 'absolute', right: -30, top: -30, opacity: 0.07 }} width="160" height="160" viewBox="0 0 160 160"><circle cx="80" cy="80" r="60" stroke="#fff" strokeWidth="2" fill="none" /></svg>
              <div style={{ fontSize: 10, color: '#C0C0F0', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Comunhão mensal</div>
              <div className="num" style={{ fontSize: 42, lineHeight: 1, marginTop: 6 }}>{fmt(valor)}</div>
              <div style={{ marginTop: 16, padding: 14, borderRadius: 10, background: 'rgba(255,255,255,0.08)' }}>
                {vinculo === 'alianca' ? (
                  <React.Fragment>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                      <span style={{ color: '#C0C0F0' }}>🕊️ 10% · Obra Shalom</span>
                      <span className="num">{fmt(obra)}</span>
                    </div>
                    <div className="divider" style={{ margin: '8px 0', background: '#ffffff22' }}></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                      <span style={{ color: '#F5C77A' }}>🤝 5% · Necessitados</span>
                      <span className="num" style={{ color: '#F5C77A' }}>{fmt(nec)}</span>
                    </div>
                  </React.Fragment>
                ) : (
                  <div style={{ fontSize: 12, color: '#C0C0F0' }}>🕊️ Destinado integralmente à Obra Shalom</div>
                )}
              </div>
            </div>

            <div className="card" style={{ padding: 20 }}>
              <div style={{ fontSize: 11, color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Próximo lembrete</div>
              <div style={{ fontSize: 18, fontWeight: 700, marginTop: 6 }}>5 de Junho · 09:00</div>
              <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 2 }}>Faltam <span className="num" style={{ color: 'var(--indigo)' }}>9 dias</span></div>
              <div className="divider" style={{ margin: '14px 0' }}></div>
              <div style={{ fontSize: 11, color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Prévia da mensagem</div>
              <div style={{ marginTop: 8, padding: 12, borderRadius: 10, background: '#D5F4DC', color: '#0B4D2E', fontSize: 12, lineHeight: 1.45, fontFamily: 'Sora, sans-serif', borderTopLeftRadius: 4 }}>
                Olá, <strong>{nome.split(' ')[0]}</strong>! 🕊️<br/>
                Sua Comunhão de Bens de Junho é <strong className="num">{fmt(valor)}</strong>.<br/>
                <span style={{ color: '#0B4D2E', opacity: 0.7 }}>Distribuição: {fmtCompact(obra)} Obra · {fmtCompact(nec)} Necessitados.</span><br/>
                <em style={{ color: '#0B4D2E', opacity: 0.7 }}>Que sua devolução continue florescendo. 🌱</em>
              </div>
            </div>

            <button className="btn btn-primary" style={{ justifyContent: 'center' }}>Salvar configuração</button>
          </div>
        </div>
      </main>
    </div>
  );
};

// ─── Exports ─────────────────────────────────────────────
export { AliancaProfile, AliancaCBConfig };
