// Auto-generated from prototype. Aliança UI kit for DuoFinanças.
import React from 'react';
import {
  fmt, fmtCompact,
  COUPLE, INCOME_TOTAL, TOTAL_FIXED, TOTAL_VAR, FREE_BALANCE,
  BY_CATEGORY, TOP_EXPENSES, CB_VALUE, STREAK, GOALS, RECOMMENDATIONS,
} from '../mockData';

const AlIcon = ({ shape, color = 'currentColor', size = 14 }) => {
  switch (shape) {
    case 'home': return <svg width={size} height={size} viewBox="0 0 20 20" fill="none"><path d="M3 9 L10 3 L17 9 V17 H3 Z" stroke={color} strokeWidth="1.6" /></svg>;
    case 'dove': return <svg width={size} height={size} viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="6" stroke={color} strokeWidth="1.6" /><circle cx="10" cy="10" r="2.5" fill={color} /></svg>;
    case 'target': return <svg width={size} height={size} viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke={color} strokeWidth="1.6" /><circle cx="10" cy="10" r="3" stroke={color} strokeWidth="1.6" /></svg>;
    case 'flask': return <svg width={size} height={size} viewBox="0 0 20 20" fill="none"><rect x="6" y="3" width="8" height="14" rx="2" stroke={color} strokeWidth="1.6" /><line x1="6" y1="9" x2="14" y2="9" stroke={color} strokeWidth="1.6" /></svg>;
    case 'list': return <svg width={size} height={size} viewBox="0 0 20 20" fill="none"><line x1="4" y1="6" x2="16" y2="6" stroke={color} strokeWidth="1.6" strokeLinecap="round"/><line x1="4" y1="10" x2="16" y2="10" stroke={color} strokeWidth="1.6" strokeLinecap="round"/><line x1="4" y1="14" x2="12" y2="14" stroke={color} strokeWidth="1.6" strokeLinecap="round"/></svg>;
    case 'settings': return <svg width={size} height={size} viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="2" stroke={color} strokeWidth="1.6"/><circle cx="10" cy="10" r="6" stroke={color} strokeWidth="1.6" strokeDasharray="2 2"/></svg>;
    case 'plus': return <svg width={size} height={size} viewBox="0 0 20 20" fill="none"><line x1="4" y1="10" x2="16" y2="10" stroke={color} strokeWidth="1.8" strokeLinecap="round"/><line x1="10" y1="4" x2="10" y2="16" stroke={color} strokeWidth="1.8" strokeLinecap="round"/></svg>;
    case 'arrow': return <svg width={size} height={size} viewBox="0 0 20 20" fill="none"><path d="M5 10 H15 M11 6 L15 10 L11 14" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case 'user': return <svg width={size} height={size} viewBox="0 0 20 20" fill="none"><circle cx="10" cy="7" r="3.5" stroke={color} strokeWidth="1.6"/><path d="M3 17c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke={color} strokeWidth="1.6" strokeLinecap="round"/></svg>;
    default: return null;
  }
};

const AlSidebar = ({ active = 'home', compact = false, onNavigate, couple: coupleProp }) => {
  const c = coupleProp || COUPLE;
  const items = [
    { id: 'home', icon: 'home', label: 'Visão geral' },
    { id: 'cb', icon: 'dove', label: 'Comunhão' },
    { id: 'metas', icon: 'target', label: 'Metas' },
    { id: 'sim', icon: 'flask', label: 'Simulador' },
    { id: 'mov', icon: 'list', label: 'Lançamentos' },
    { id: 'profile', icon: 'user', label: 'Perfil' },
  ];
  return (
    <aside style={{ width: compact ? 64 : 220, borderRight: '1px solid var(--line)', padding: 18, display: 'flex', flexDirection: 'column', gap: 16, background: 'var(--paper)', flex: '0 0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 4px' }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--ink)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, letterSpacing: '-0.02em' }}>D</div>
        {!compact && <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.02em' }}>DuoFinanças</div>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map((it) => (
          <div
            key={it.id}
            onClick={() => onNavigate?.(it.id)}
            className={`navitem ${active === it.id ? 'active' : ''}`}
            style={{ cursor: 'pointer' }}
          >
            <span className="navicon"><AlIcon shape={it.icon} /></span>
            {!compact && <span>{it.label}</span>}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 'auto', background: 'var(--bg-2)', padding: 12, borderRadius: 12, cursor: 'pointer' }} onClick={() => onNavigate?.('profile')}>
        <div style={{ fontSize: 10, color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Casal · sync</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: -8, marginTop: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 99, background: 'var(--indigo)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, border: '2px solid var(--paper)' }}>{(c.p1?.name || 'V')[0]}</div>
          <div style={{ width: 28, height: 28, borderRadius: 99, background: 'var(--amber)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, border: '2px solid var(--paper)', marginLeft: -8 }}>{(c.p2?.name || 'P')[0]}</div>
          <div style={{ marginLeft: 8, fontSize: 11 }}>
            <div style={{ fontWeight: 600 }}>{c.p1?.name || 'Você'} & {c.p2?.name || 'Parceiro(a)'}</div>
            <div style={{ color: 'var(--green)', fontSize: 9 }}>● ao vivo</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

const AlAreaChart = ({ data, color, height = 60 }) => {
  const max = Math.max(...data.map(d => d.amount || 0));
  const w = 100;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = max > 0 ? height - ((d.amount - 0) / (max - 0)) * height : height;
    return [x, y];
  });
  const path = pts.map((p, i) => (i === 0 ? `M${p[0]} ${p[1]}` : `L${p[0]} ${p[1]}`)).join(' ');
  const area = `${path} L${w} ${height} L0 ${height} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" style={{ width: '100%', height, display: 'block' }}>
      <defs>
        <linearGradient id={`alarea-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#alarea-${color})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      {pts.map((p, i) => data[i].amount > 0 ? <circle key={i} cx={p[0]} cy={p[1]} r="1.4" fill={color} vectorEffect="non-scaling-stroke" /> : null)}
    </svg>
  );
};

const AliancaDashboard = ({
  couple = COUPLE,
  incomeTotal = INCOME_TOTAL,
  totalFixed = TOTAL_FIXED,
  totalVar = TOTAL_VAR,
  freeBalance = FREE_BALANCE,
  cbValue = CB_VALUE,
  streak = STREAK,
  goals = GOALS,
  byCategory = BY_CATEGORY,
  topExpenses = TOP_EXPENSES,
  recommendations = RECOMMENDATIONS,
  onNavigate,
  tweaks = {},
}) => {
  const incomePct = incomeTotal > 0 ? ((freeBalance / incomeTotal) * 100).toFixed(0) : 0;
  const expPct = incomeTotal > 0 ? (((totalFixed + totalVar) / incomeTotal) * 100).toFixed(0) : 0;

  const now = new Date();
  const mesAno = now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const mesCapit = mesAno.charAt(0).toUpperCase() + mesAno.slice(1);

  return (
    <div className="alianca-root" style={{ display: 'flex' }}>
      <AlSidebar active="home" onNavigate={onNavigate} couple={couple} />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '16px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--line)' }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--ink-mute)' }}>{mesCapit}</div>
            <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 2 }}>Olá, {couple.p1?.name || 'Você'} & {couple.p2?.name || 'Parceiro(a)'}</div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div className="chip chip-success"><span style={{ width: 5, height: 5, borderRadius: 99, background: 'currentColor' }}></span>Sincronizado · agora</div>
            <button className="btn btn-ghost">Exportar PDF</button>
            <button className="btn btn-primary" onClick={() => onNavigate?.('mov')}><AlIcon shape="plus" color="#fff" /> Lançamento</button>
          </div>
        </div>

        <div style={{ padding: '18px 28px', display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto', flex: 1 }}>
          {/* Hero KPI */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12 }}>
            <div className="card" style={{ padding: 22, background: 'linear-gradient(135deg, #1F1F6E 0%, #2D2D8F 100%)', color: '#fff', position: 'relative', overflow: 'hidden' }}>
              <svg style={{ position: 'absolute', right: -40, bottom: -40, opacity: 0.06 }} width="200" height="200" viewBox="0 0 200 200"><circle cx="100" cy="100" r="80" stroke="#fff" strokeWidth="2" fill="none" /><circle cx="100" cy="100" r="50" stroke="#fff" strokeWidth="2" fill="none" /></svg>
              <div style={{ fontSize: 11, color: '#A8A8E0', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Saldo livre · casal</div>
              <div className="num" style={{ fontSize: 44, lineHeight: 1, marginTop: 8 }}>{fmt(freeBalance)}</div>
              <div style={{ display: 'flex', gap: 14, marginTop: 14, fontSize: 11 }}>
                <div><span style={{ color: '#A8A8E0' }}>{incomePct}% da renda</span></div>
                <div style={{ width: 1, background: '#ffffff33' }}></div>
                <div><span style={{ color: '#A8A8E0' }}>Após CB · {fmtCompact(cbValue)} devolvidos</span></div>
              </div>
              <div style={{ display: 'flex', gap: 4, marginTop: 14 }}>
                {[
                  { name: 'Fixas', v: totalFixed, c: '#5454C7' },
                  { name: 'Variáveis', v: totalVar, c: '#E5A53C' },
                  { name: 'CB', v: cbValue, c: '#FFFFFF' },
                  { name: 'Livre', v: Math.max(freeBalance, 0), c: '#74D2A8' },
                ].map((b, i) => (
                  <div key={i} style={{ flex: b.v || 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ height: 6, background: b.c, borderRadius: 4, opacity: 0.95 }}></div>
                    <div style={{ fontSize: 10, color: '#ffffff99' }}>{b.name} <span className="num" style={{ color: '#fff' }}>{fmtCompact(b.v).replace('R$ ', '')}</span></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card" style={{ padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: 11, color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Renda total</div>
              </div>
              <div className="num" style={{ fontSize: 28, marginTop: 8 }}>{fmt(incomeTotal)}</div>
              <div style={{ display: 'flex', gap: 12, marginTop: 14, fontSize: 11 }}>
                <div>
                  <div style={{ color: 'var(--ink-mute)' }}>{couple.p1?.name || 'Você'}</div>
                  <div className="num" style={{ fontSize: 14, color: 'var(--indigo)' }}>{fmtCompact(couple.p1?.income || 0)}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--ink-mute)' }}>{couple.p2?.name || 'Parceiro(a)'}</div>
                  <div className="num" style={{ fontSize: 14, color: 'var(--amber)' }}>{fmtCompact(couple.p2?.income || 0)}</div>
                </div>
              </div>
            </div>
            <div className="card" style={{ padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: 11, color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Despesas</div>
                <span className="chip">{expPct}% comprometida</span>
              </div>
              <div className="num" style={{ fontSize: 28, marginTop: 8 }}>{fmt(totalFixed + totalVar)}</div>
              <div style={{ display: 'flex', gap: 12, marginTop: 14, fontSize: 11 }}>
                <div>
                  <div style={{ color: 'var(--ink-mute)' }}>Fixas</div>
                  <div className="num" style={{ fontSize: 14 }}>{fmtCompact(totalFixed)}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--ink-mute)' }}>Variáveis</div>
                  <div className="num" style={{ fontSize: 14, color: 'var(--amber)' }}>{fmtCompact(totalVar)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* CB strip */}
          <div className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 22, background: 'linear-gradient(90deg, #FCEED1 0%, #FFFFFF 60%)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: 'var(--amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>
                <span className="num" style={{ fontSize: 24 }}>{streak}</span>
              </div>
              <div>
                <div className="chip chip-amber"><AlIcon shape="dove" size={12} /> Comunhão de Bens</div>
                <div style={{ fontSize: 16, fontWeight: 600, marginTop: 4 }}>{streak > 0 ? `${streak} ${streak === 1 ? 'mês consecutivo' : 'meses consecutivos'} · streak ativa` : 'Nenhuma devolução ainda'}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 2 }}>
                  {streak < 12 ? `Faltam ${12 - streak} meses para o marco de 1 ano` : '🎉 Marco de 1 ano alcançado!'}
                </div>
              </div>
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
              {[3, 6, 9, 12].map((m) => (
                <React.Fragment key={m}>
                  <div style={{
                    width: 24, height: 24, borderRadius: 99,
                    border: '2px solid ' + (streak >= m ? 'var(--amber)' : 'var(--line-strong)'),
                    background: streak >= m ? 'var(--amber)' : 'transparent',
                    color: streak >= m ? '#fff' : 'var(--ink-mute)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flex: '0 0 auto',
                  }}>{streak >= m ? '✓' : m}</div>
                  {m < 12 && <div style={{ flex: 1, height: 2, background: streak >= m ? 'var(--amber)' : 'var(--line-strong)' }}></div>}
                </React.Fragment>
              ))}
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: 'var(--ink-mute)' }}>Devolução do mês</div>
              <div className="num" style={{ fontSize: 22, color: 'var(--indigo)' }}>{fmt(cbValue)}</div>
              <button className="btn btn-indigo" style={{ marginTop: 6, fontSize: 11, padding: '6px 12px' }} onClick={() => onNavigate?.('cb')}>Ver comunhão →</button>
            </div>
          </div>

          {/* Lower grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 0.9fr', gap: 12 }}>
            <div className="card" style={{ padding: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>Despesas por categoria</div>
                <button className="chip" style={{ cursor: 'pointer', border: 'none' }} onClick={() => onNavigate?.('mov')}>Ver →</button>
              </div>
              {byCategory.length === 0 ? (
                <div style={{ fontSize: 12, color: 'var(--ink-mute)', textAlign: 'center', padding: '20px 0' }}>Nenhuma despesa cadastrada</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {byCategory.slice(0, 6).map((c, i) => {
                    const palette = ['#2D2D8F', '#E5A53C', '#1D8F6A', '#C03A4C', '#7E48A5', '#5BA0C7'];
                    const total = totalFixed + totalVar;
                    const pct = total > 0 ? (c.amount / total) * 100 : 0;
                    return (
                      <div key={c.cat} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 24, height: 4, borderRadius: 2, background: palette[i % palette.length] }}></div>
                        <div style={{ flex: 1, fontSize: 12 }}>{c.cat}</div>
                        <div className="num" style={{ fontSize: 12 }}>{fmtCompact(c.amount)}</div>
                        <div className="tnum" style={{ fontSize: 10, color: 'var(--ink-mute)', width: 32, textAlign: 'right' }}>{pct.toFixed(0)}%</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="card" style={{ padding: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>Top 5 lançamentos</div>
                <button className="chip" style={{ cursor: 'pointer', border: 'none' }} onClick={() => onNavigate?.('mov')}>Mai</button>
              </div>
              {topExpenses.length === 0 ? (
                <div style={{ fontSize: 12, color: 'var(--ink-mute)', textAlign: 'center', padding: '20px 0' }}>Nenhuma despesa cadastrada</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {topExpenses.map((e, i) => {
                    const max = topExpenses[0].amount;
                    const pct = max > 0 ? (e.amount / max) * 100 : 0;
                    return (
                      <div key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                          <div style={{ fontSize: 12 }}>{e.name}</div>
                          <div className="num" style={{ fontSize: 12 }}>{fmtCompact(e.amount)}</div>
                        </div>
                        <div style={{ height: 4, background: 'var(--bg-2)', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: 'var(--indigo)', borderRadius: 2 }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="card" style={{ padding: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>Metas</div>
                <button style={{ fontSize: 11, color: 'var(--indigo)', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => onNavigate?.('metas')}>Ver →</button>
              </div>
              {goals.length === 0 ? (
                <div style={{ fontSize: 12, color: 'var(--ink-mute)', textAlign: 'center', padding: '20px 0' }}>
                  <button className="btn btn-primary" style={{ fontSize: 11 }} onClick={() => onNavigate?.('metas')}>+ Criar meta</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {goals.slice(0, 3).map((g, i) => {
                    const pct = g.target > 0 ? Math.min((g.current / g.target) * 100, 100) : 0;
                    const cs = ['var(--green)', 'var(--indigo)', 'var(--amber)'];
                    return (
                      <div key={g.name || i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                          <span>{g.name}</span>
                          <span className="tnum">{pct.toFixed(0)}%</span>
                        </div>
                        <div style={{ height: 5, background: 'var(--bg-2)', borderRadius: 99, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: cs[i % 3], borderRadius: 99 }}></div>
                        </div>
                        {g.due && <div style={{ fontSize: 10, color: 'var(--ink-mute)', marginTop: 3 }} className="tnum">{fmtCompact(g.current)} / {fmtCompact(g.target)} · {g.due}</div>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Recommendations */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {recommendations.map((r, i) => {
              const accent = { success: 'var(--green)', info: 'var(--indigo)', warning: 'var(--amber)' }[r.type];
              const bg = { success: 'var(--green-soft)', info: 'var(--indigo-soft)', warning: 'var(--amber-soft)' }[r.type];
              return (
                <div key={i} className="card" style={{ padding: 14, display: 'flex', gap: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: bg, color: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{r.icon}</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{r.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 2, lineHeight: 1.4 }}>{r.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export { AlIcon, AlSidebar, AlAreaChart, AliancaDashboard };
