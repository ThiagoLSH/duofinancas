// Auto-generated from prototype. Aliança UI kit for DuoFinanças.
import React from 'react';
import {
  fmt, fmtCompact, COUPLE, INCOME_TOTAL, TOTAL_FIXED, TOTAL_VAR, FREE_BALANCE, BY_CATEGORY, CB_VALUE, CB_HISTORY, STREAK, STREAK_MILESTONES, GOALS, WIZARD_STEPS
} from '../mockData';
import { AlIcon, AlSidebar, AlAreaChart } from '../components/AliancaShared';

// CB Module — desktop
const AliancaCBModule = ({
  incomeTotal: incomeProp,
  cbConfig,
  cbHistory: cbHistProp,
  streak: streakProp,
  onNavigate,
  onRegisterDevolucao,
  couple,
  tweaks = {},
}) => {
  const cbHist = cbHistProp && cbHistProp.length > 0 ? cbHistProp : CB_HISTORY;
  const streakVal = streakProp != null ? streakProp : STREAK;
  const [renda, setRenda] = React.useState(incomeProp || 9800);
  const [vinculo, setVinculo] = React.useState(cbConfig?.tipo_vinculo === 'comunidade_alianca' ? 'alianca' : 'alianca');
  const [showRegistro, setShowRegistro] = React.useState(false);
  const [regMes, setRegMes] = React.useState(new Date().toISOString().slice(0, 7));
  const [regValor, setRegValor] = React.useState('');
  const [regSaving, setRegSaving] = React.useState(false);
  const [showPix, setShowPix] = React.useState(false);
  const pct = vinculo === 'alianca' ? 0.15 : 0.10;
  const valor = renda * pct;
  const obra = renda * 0.10;
  const nec = renda * 0.05;
  const totalDevolvido = cbHist.reduce((s, h) => s + (h.amount || 0), 0);

  const handleRegistrar = async () => {
    const v = Number(regValor.replace(/\D/g, '')) || 0;
    if (!v) return;
    setRegSaving(true);
    await onRegisterDevolucao?.({
      mes_referencia: regMes,
      valor_renda: renda,
      percentual_aplicado: pct * 100,
      valor_devolvido: v,
      status: 'devolvido',
      forma_devolucao: 'pix',
    });
    setRegValor('');
    setShowRegistro(false);
    setRegSaving(false);
  };

  return (
    <div className="alianca-root" style={{ display: 'flex' }}>
      <AlSidebar active="cb" onNavigate={onNavigate} couple={couple} />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '16px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--line)' }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--ink-mute)' }}>Módulo</div>
            <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 2 }}>Comunhão de Bens</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div className="chip chip-amber"><AlIcon shape="dove" size={12} /> Comunidade de Aliança · {(pct * 100).toFixed(0)}%</div>
            <button className="btn btn-ghost" onClick={() => onNavigate?.('profile')}>Configurar lembrete</button>
          </div>
        </div>

        <div style={{ padding: '18px 28px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, flex: 1, overflow: 'auto' }}>
          {/* Calculator + result */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="card" style={{ padding: 22 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>Calculadora</div>
              <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>Atualiza enquanto você digita.</div>

              <div style={{ marginTop: 18 }}>
                <label style={{ fontSize: 11, color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Renda bruta mensal</label>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8, padding: '10px 14px', border: '1px solid var(--line-strong)', borderRadius: 12, background: 'var(--bg)' }}>
                  <span style={{ fontSize: 18, color: 'var(--ink-mute)' }}>R$</span>
                  <input value={renda.toLocaleString('pt-BR')}
                    onChange={(e) => setRenda(Number(e.target.value.replace(/\D/g, '')) || 0)}
                    className="num"
                    style={{ fontSize: 32, border: 'none', outline: 'none', background: 'transparent', flex: 1, color: 'var(--ink)' }} />
                </div>
              </div>

              <div style={{ marginTop: 18 }}>
                <label style={{ fontSize: 11, color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Vínculo</label>
                <div style={{ display: 'flex', gap: 0, marginTop: 8, padding: 4, background: 'var(--bg-2)', borderRadius: 10 }}>
                  {[
                    { id: 'oracao', label: 'Grupo de Oração', sub: '10%' },
                    { id: 'alianca', label: 'Comunidade de Aliança', sub: '15%' },
                  ].map((v) => (
                    <button key={v.id} onClick={() => setVinculo(v.id)}
                      style={{
                        flex: 1, padding: '10px 12px', borderRadius: 8, cursor: 'pointer', border: 'none',
                        background: vinculo === v.id ? 'var(--paper)' : 'transparent',
                        color: vinculo === v.id ? 'var(--ink)' : 'var(--ink-soft)',
                        fontWeight: vinculo === v.id ? 600 : 500,
                        boxShadow: vinculo === v.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                        fontFamily: 'inherit', fontSize: 12, textAlign: 'center',
                      }}>
                      <div>{v.label}</div>
                      <div className="num" style={{ fontSize: 18, marginTop: 2, color: vinculo === v.id ? 'var(--indigo)' : 'var(--ink-mute)' }}>{v.sub}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: 24, background: 'linear-gradient(135deg, var(--indigo-deep) 0%, var(--indigo) 100%)', color: '#fff', position: 'relative', overflow: 'hidden' }}>
              <svg style={{ position: 'absolute', right: -30, top: -30, opacity: 0.07 }} width="180" height="180" viewBox="0 0 180 180"><circle cx="90" cy="90" r="70" stroke="#fff" strokeWidth="3" fill="none" /><circle cx="90" cy="90" r="40" stroke="#fff" strokeWidth="3" fill="none" /></svg>
              <div style={{ fontSize: 11, color: '#C0C0F0', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Valor da Comunhão · Maio</div>
              <div className="num" style={{ fontSize: 52, lineHeight: 1, marginTop: 6 }}>{fmt(valor)}</div>
              <div style={{ marginTop: 18, display: 'flex', gap: 8 }}>
                {vinculo === 'alianca' ? (
                  <>
                    <div style={{ flex: 1, padding: 14, borderRadius: 12, background: 'rgba(255,255,255,0.08)' }}>
                      <div style={{ fontSize: 10, color: '#C0C0F0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>🕊️ Obra</div>
                      <div className="num" style={{ fontSize: 22, marginTop: 4 }}>{fmt(obra)}</div>
                      <div style={{ fontSize: 10, color: '#A8A8E0', marginTop: 2 }}>10% · Evangelização</div>
                    </div>
                    <div style={{ flex: 1, padding: 14, borderRadius: 12, background: 'rgba(229,165,60,0.18)', border: '1px solid rgba(229,165,60,0.3)' }}>
                      <div style={{ fontSize: 10, color: 'var(--amber)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>🤝 Necessitados</div>
                      <div className="num" style={{ fontSize: 22, marginTop: 4, color: '#F5C77A' }}>{fmt(nec)}</div>
                      <div style={{ fontSize: 10, color: '#F5C77A', marginTop: 2, opacity: 0.8 }}>5% · Comunidade</div>
                    </div>
                  </>
                ) : (
                  <div style={{ flex: 1, padding: 14, borderRadius: 12, background: 'rgba(255,255,255,0.08)' }}>
                    <div style={{ fontSize: 11, color: '#C0C0F0' }}>🕊️ Destinado integralmente à Obra Shalom</div>
                  </div>
                )}
              </div>
              <button className="btn" style={{ marginTop: 16, background: '#fff', color: 'var(--indigo)', justifyContent: 'center', width: '100%' }}
                onClick={() => setShowPix(v => !v)}>
                {showPix ? 'Fechar PIX' : 'Gerar QR Code PIX'}  <AlIcon shape="arrow" color="var(--indigo)" />
              </button>
              {showPix && (
                <div style={{ marginTop: 12, padding: 16, borderRadius: 12, background: 'rgba(255,255,255,0.1)', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#C0C0F0', marginBottom: 8 }}>Chave PIX · Obra Shalom</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', fontFamily: 'monospace', wordBreak: 'break-all' }}>comunidade@shalom.com.br</div>
                  <div style={{ fontSize: 11, color: '#A8A8E0', marginTop: 6 }}>Valor sugerido: <span style={{ color: '#fff', fontWeight: 700 }}>{fmt(valor)}</span></div>
                  <button className="btn" style={{ marginTop: 10, background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: 11, width: '100%', justifyContent: 'center' }}
                    onClick={() => { navigator.clipboard?.writeText('comunidade@shalom.com.br'); }}>
                    📋 Copiar chave PIX
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* History + streak */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="card" style={{ padding: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>Fidelidade · streak</div>
                <div className="chip chip-amber"><span className="num">{streakVal}</span> meses</div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginBottom: 18 }}>Marcos: 3 · 6 · 12 meses de devoluções consecutivas.</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {Array.from({ length: 12 }).map((_, i) => {
                  const m = i + 1;
                  const done = m <= streakVal;
                  const isMile = STREAK_MILESTONES.includes(m);
                  return (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <div style={{
                        width: '100%', height: isMile ? 24 : 16, borderRadius: 4,
                        background: done ? (isMile ? 'var(--amber)' : 'var(--indigo)') : 'var(--bg-2)',
                        border: isMile ? '2px solid var(--amber)' : 'none',
                        boxShadow: done && isMile ? '0 0 0 2px var(--amber-soft)' : 'none',
                      }}></div>
                      <div style={{ fontSize: 9, color: 'var(--ink-mute)', fontWeight: isMile ? 700 : 400 }}>{m}m</div>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14, fontSize: 11, color: 'var(--ink-soft)' }}>
                <span>✓ Marco de 6 meses alcançado em <span className="num" style={{ color: 'var(--ink)' }}>Mar/26</span></span>
                <span>→ Próximo: <span className="num" style={{ color: 'var(--indigo)' }}>1 ano</span> · Set/26</span>
              </div>
            </div>

            <div className="card" style={{ padding: 22, flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>Histórico · 12 meses</div>
                <div style={{ fontSize: 11, color: 'var(--ink-mute)' }}>Total <span className="num" style={{ color: 'var(--ink)' }}>{fmt(totalDevolvido)}</span></div>
              </div>
              <div style={{ marginTop: 18, paddingBottom: 4 }}>
                <AlAreaChart data={cbHist} color="#2D2D8F" height={70} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 9, color: 'var(--ink-mute)' }}>
                  {cbHist.map((h, i) => <span key={i}>{h.month}</span>)}
                </div>
              </div>
              <div className="divider" style={{ margin: '14px 0' }}></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                {cbHist.slice(-4).reverse().map((h, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 7, background: h.paid ? 'var(--green-soft)' : 'var(--bg-2)', color: h.paid ? 'var(--green)' : 'var(--ink-mute)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{h.paid ? '✓' : '—'}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500 }}>{h.month} 2026 · PIX</div>
                      <div style={{ fontSize: 10, color: 'var(--ink-mute)' }}>Aliança · 15%</div>
                    </div>
                    <div className="num" style={{ color: h.paid ? 'var(--indigo)' : 'var(--ink-mute)' }}>{h.amount > 0 ? fmt(h.amount) : 'Pendente'}</div>
                  </div>
                ))}
              </div>
              <button className="btn btn-ghost" style={{ marginTop: 10, justifyContent: 'center' }} onClick={() => setShowRegistro(v => !v)}>
                {showRegistro ? 'Cancelar' : '+ Adicionar registro'}
              </button>
              {showRegistro && (
                <div style={{ marginTop: 12, padding: 14, borderRadius: 10, background: 'var(--indigo-soft)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Mês de referência</label>
                    <input type="month" value={regMes} onChange={e => setRegMes(e.target.value)}
                      className="input" style={{ marginTop: 4, fontFamily: 'inherit' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Valor devolvido</label>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4, padding: '8px 12px', border: '1px solid var(--line-strong)', borderRadius: 8, background: 'var(--paper)' }}>
                      <span style={{ fontSize: 12, color: 'var(--ink-mute)' }}>R$</span>
                      <input value={regValor} onChange={e => setRegValor(e.target.value.replace(/\D/g, ''))}
                        placeholder={Math.round(valor).toString()} className="num"
                        style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', fontSize: 16 }} />
                    </div>
                  </div>
                  <button className="btn btn-primary" style={{ justifyContent: 'center' }} disabled={regSaving} onClick={handleRegistrar}>
                    {regSaving ? 'Registrando…' : '✓ Confirmar devolução'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Mobile dashboard
const AliancaMobile = ({ tweaks = {} }) => {
  return (
    <div className="alianca-root" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 50, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px', fontSize: 14, fontWeight: 700 }}>
        <span>9:41</span>
        <div style={{ display: 'flex', gap: 4, fontSize: 10 }}><span>●●●</span><span>📶</span><span>🔋</span></div>
      </div>

      <div style={{ padding: '8px 18px 20px', display: 'flex', flexDirection: 'column', gap: 12, flex: 1, overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--ink-mute)' }}>Maio · 2026</div>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>Olá, João</div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--bg-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><AlIcon shape="settings" /></div>
            <div style={{ width: 32, height: 32, borderRadius: 99, background: 'var(--indigo)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600 }}>J</div>
          </div>
        </div>

        {/* Hero balance card */}
        <div className="card" style={{ padding: 20, background: 'linear-gradient(135deg, var(--indigo-deep) 0%, var(--indigo) 100%)', color: '#fff', position: 'relative', overflow: 'hidden' }}>
          <svg style={{ position: 'absolute', right: -30, top: -30, opacity: 0.07 }} width="160" height="160" viewBox="0 0 160 160"><circle cx="80" cy="80" r="60" stroke="#fff" strokeWidth="2" fill="none" /></svg>
          <div style={{ fontSize: 10, color: '#A8A8E0', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Saldo livre · casal</div>
          <div className="num" style={{ fontSize: 38, lineHeight: 1, marginTop: 6 }}>{fmt(FREE_BALANCE)}</div>
          <div style={{ display: 'flex', gap: 4, marginTop: 14 }}>
            <div style={{ flex: TOTAL_FIXED, height: 5, background: '#5454C7', borderRadius: 2 }}></div>
            <div style={{ flex: TOTAL_VAR, height: 5, background: '#E5A53C', borderRadius: 2 }}></div>
            <div style={{ flex: CB_VALUE, height: 5, background: '#fff', borderRadius: 2 }}></div>
            <div style={{ flex: FREE_BALANCE, height: 5, background: '#74D2A8', borderRadius: 2 }}></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 10, color: '#A8A8E0' }}>
            <span>Fixas</span><span>Var.</span><span>CB</span><span>Livre</span>
          </div>
        </div>

        {/* Quick stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div className="card" style={{ padding: 14 }}>
            <div style={{ fontSize: 10, color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Renda</div>
            <div className="num" style={{ fontSize: 18, marginTop: 4 }}>{fmtCompact(INCOME_TOTAL)}</div>
            <span className="chip chip-success" style={{ fontSize: 9, padding: '2px 6px', marginTop: 4 }}>+3,4%</span>
          </div>
          <div className="card" style={{ padding: 14 }}>
            <div style={{ fontSize: 10, color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Despesas</div>
            <div className="num" style={{ fontSize: 18, marginTop: 4 }}>{fmtCompact(TOTAL_FIXED + TOTAL_VAR)}</div>
            <span className="chip" style={{ fontSize: 9, padding: '2px 6px', marginTop: 4 }}>79% comprometida</span>
          </div>
        </div>

        {/* CB streak card */}
        <div className="card" style={{ padding: 16, background: 'linear-gradient(90deg, var(--amber-soft) 0%, #fff 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--amber)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="num" style={{ fontSize: 22 }}>{STREAK}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: '#A4751E', fontWeight: 600 }}>🕊️ COMUNHÃO · STREAK</div>
              <div style={{ fontSize: 14, fontWeight: 700, marginTop: 2 }}>Oito meses fiel</div>
              <div style={{ fontSize: 10, color: 'var(--ink-soft)' }}>Marco 1 ano · em 4 meses</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 3, marginTop: 12 }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} style={{
                flex: 1, height: 5, borderRadius: 2,
                background: i < STREAK ? 'var(--amber)' : 'var(--bg-2)',
              }}></div>
            ))}
          </div>
          <button className="btn btn-indigo" style={{ marginTop: 12, width: '100%', justifyContent: 'center', fontSize: 12 }}>Devolver maio · {fmt(CB_VALUE)}</button>
        </div>

        {/* Categories */}
        <div className="card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Por categoria</div>
            <a style={{ fontSize: 11, color: 'var(--indigo)' }}>Detalhes →</a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {BY_CATEGORY.slice(0, 5).map((c, i) => {
              const palette = ['#2D2D8F', '#E5A53C', '#1D8F6A', '#C03A4C', '#7E48A5'];
              const pct = (c.amount / (TOTAL_FIXED + TOTAL_VAR)) * 100;
              return (
                <div key={c.cat}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 6, height: 6, borderRadius: 99, background: palette[i] }}></span>{c.cat}</span>
                    <span className="num">{fmtCompact(c.amount)}</span>
                  </div>
                  <div style={{ height: 3, background: 'var(--bg-2)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: palette[i] }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Goals strip */}
        <div className="card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Metas</div>
            <a style={{ fontSize: 11, color: 'var(--indigo)' }}>Ver →</a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {GOALS.slice(0, 2).map((g, i) => {
              const pct = (g.current / g.target) * 100;
              const c = ['var(--green)', 'var(--indigo)'][i];
              return (
                <div key={g.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--bg-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>{g.icon}</div>
                      <div style={{ fontSize: 12, fontWeight: 500 }}>{g.name}</div>
                    </div>
                    <span className="num" style={{ fontSize: 11 }}>{pct.toFixed(0)}%</span>
                  </div>
                  <div style={{ height: 4, background: 'var(--bg-2)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: c }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ borderTop: '1px solid var(--line)', background: 'var(--paper)', padding: '8px 12px 20px', display: 'flex', justifyContent: 'space-around' }}>
        {[
          { i: 'home', label: 'Início', active: true },
          { i: 'dove', label: 'Comunhão' },
          { i: 'target', label: 'Metas' },
          { i: 'list', label: 'Mais' },
        ].map((t, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '6px 14px', color: t.active ? 'var(--indigo)' : 'var(--ink-mute)' }}>
            <AlIcon shape={t.i} size={18} />
            <div style={{ fontSize: 10, fontWeight: t.active ? 700 : 500 }}>{t.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Onboarding
const AliancaOnboarding = ({ onBack, onComplete, p1Name: p1NameProp, p2Name: p2NameProp, savePlan, tweaks = {} }) => {
  const [renda1, setRenda1] = React.useState(5500);
  const [renda2, setRenda2] = React.useState(4300);
  const p1Display = p1NameProp || COUPLE.p1.name;
  const p2Display = p2NameProp || COUPLE.p2.name;

  return (
    <div className="alianca-root" style={{ display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '18px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--ink)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>D</div>
          <div style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>DuoFinanças</div>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {WIZARD_STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: 99,
                background: i === 1 ? 'var(--ink)' : (i < 1 ? 'var(--green-soft)' : 'transparent'),
                color: i === 1 ? '#fff' : (i < 1 ? 'var(--green)' : 'var(--ink-mute)'),
              }}>
                <span className="num" style={{ fontSize: 11, fontWeight: 700 }}>{i < 1 ? '✓' : s.short}</span>
                <span style={{ fontSize: 11, fontWeight: 500 }}>{s.label}</span>
              </div>
              {i < WIZARD_STEPS.length - 1 && <div style={{ width: 10, height: 1, background: 'var(--line-strong)' }}></div>}
            </React.Fragment>
          ))}
        </div>
        <button className="btn btn-ghost">Salvar e sair</button>
      </header>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 0.9fr', minHeight: 0 }}>
        <div style={{ padding: '40px 56px', display: 'flex', flexDirection: 'column', gap: 22, overflow: 'auto' }}>
          <div>
            <div className="chip chip-indigo">Passo 02 · Renda</div>
            <h1 style={{ fontSize: 38, lineHeight: 1.05, margin: '12px 0 8px', fontWeight: 700, letterSpacing: '-0.03em' }}>
              Quanto vocês recebem por mês?
            </h1>
            <p style={{ fontSize: 14, color: 'var(--ink-soft)', maxWidth: 480, lineHeight: 1.5, margin: 0 }}>
              Salários, autônomos, freelas, aluguéis — toda renda recorrente. A Comunhão é calculada sobre o bruto, e você pode editar a qualquer momento.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { name: p1Display, val: renda1, setVal: setRenda1, c: 'var(--indigo)' },
              { name: p2Display, val: renda2, setVal: setRenda2, c: 'var(--amber)' },
            ].map(({ name, val, setVal, c }) => (
              <div key={name} className="card" style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: c, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{name[0]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: 'var(--ink-mute)', fontWeight: 500 }}>{name} · renda mensal bruta</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 2 }}>
                    <span style={{ fontSize: 16, color: 'var(--ink-mute)' }}>R$</span>
                    <input value={val.toLocaleString('pt-BR')}
                      onChange={(e) => setVal(Number(e.target.value.replace(/\D/g, '')) || 0)}
                      className="num"
                      style={{ fontSize: 28, border: 'none', outline: 'none', background: 'transparent', flex: 1, color: 'var(--ink)' }} />
                  </div>
                </div>
                <button className="btn btn-ghost" style={{ fontSize: 11, padding: '6px 10px' }}>+ Renda extra</button>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 14, background: 'var(--indigo-soft)', borderRadius: 12, fontSize: 12, color: 'var(--indigo)' }}>
            <AlIcon shape="dove" /> Como ambos são da Aliança, vamos calcular 15% da renda total — mais detalhes na próxima etapa.
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 'auto' }}>
            <button className="btn btn-ghost" onClick={() => onBack && onBack()}>← Voltar</button>
            <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}
              onClick={async () => {
                if (savePlan) await savePlan({ monthly_income: renda1, partner_income: renda2, partner_name: p2Display });
                onComplete && onComplete();
              }}>
              Continuar → Despesas fixas <AlIcon shape="arrow" color="#fff" />
            </button>
          </div>
        </div>

        <div style={{ background: 'var(--bg-2)', padding: 40, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 18 }}>
          <div className="chip">Pré-visualização ao vivo</div>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>Sua Comunhão em maio</div>

          <div className="card" style={{ padding: 22, background: 'linear-gradient(135deg, var(--indigo-deep) 0%, var(--indigo) 100%)', color: '#fff' }}>
            <div style={{ fontSize: 10, color: '#C0C0F0', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Renda total · casal</div>
            <div className="num" style={{ fontSize: 38, lineHeight: 1, marginTop: 6 }}>{fmt(renda1 + renda2)}</div>
            <div style={{ marginTop: 16, padding: 14, borderRadius: 12, background: 'rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontSize: 11, color: '#C0C0F0' }}>10% · 🕊️ Obra Shalom</div>
                <div className="num">{fmt((renda1 + renda2) * 0.10)}</div>
              </div>
              <div className="divider" style={{ margin: '10px 0', background: '#ffffff22' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontSize: 11, color: '#F5C77A' }}>5% · 🤝 Necessitados</div>
                <div className="num" style={{ color: '#F5C77A' }}>{fmt((renda1 + renda2) * 0.05)}</div>
              </div>
            </div>
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px dashed #ffffff33', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ fontSize: 12, fontWeight: 600 }}>Total a devolver</div>
              <div className="num" style={{ fontSize: 26 }}>{fmt((renda1 + renda2) * 0.15)}</div>
            </div>
          </div>

          <div style={{ fontSize: 11, color: 'var(--ink-mute)', fontStyle: 'italic', lineHeight: 1.6 }}>
            "A Comunidade orienta sobre a renda bruta, mas o importante é a fidelidade do coração."
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Exports ─────────────────────────────────────────────
export { AliancaCBModule, AliancaMobile, AliancaOnboarding };
