// Auto-generated from prototype. Aliança UI kit for DuoFinanças.
import React from 'react';
import {
  fmt, fmtCompact, INCOME_TOTAL, FIXED_EXPENSES, VARIABLE_EXPENSES, FREE_BALANCE, CB_VALUE, GOALS, WIZARD_STEPS, SCENARIOS
} from '../mockData';
import { AlIcon, AlSidebar } from '../components/AliancaShared';

// ============ GOALS / METAS ============
const AliancaGoals = ({ initialGoals, onCreateGoal, onUpdateGoal, onDeleteGoal, onNavigate, couple, tweaks = {} }) => {
  const [showNew, setShowNew] = React.useState(false);
  const [filter, setFilter] = React.useState('active');
  const [newName, setNewName] = React.useState('');
  const [newTarget, setNewTarget] = React.useState('');
  const [newCurrent, setNewCurrent] = React.useState('');
  const [newDate, setNewDate] = React.useState('');
  const [newIcon, setNewIcon] = React.useState('🎯');

  // Use real goals if provided, otherwise fall back to mock
  const baseGoals = initialGoals && initialGoals.length > 0
    ? initialGoals
    : [
        ...GOALS.map((g, i) => ({ ...g, id: `g${i}`, status: 'active', priority: i + 1 })),
        { id: 'g-done', name: 'Comprar geladeira nova', current: 4200, target: 4200, due: 'Mar 2026', icon: '🧊', color: 'emerald', status: 'completed', priority: 4 },
        { id: 'g-paused', name: 'Curso Coursera anual', current: 240, target: 720, due: 'Dez 2026', icon: '📚', color: 'amber', status: 'paused', priority: 5 },
      ];
  const [localGoals, setLocalGoals] = React.useState(baseGoals);

  React.useEffect(() => {
    if (initialGoals) setLocalGoals(initialGoals);
  }, [JSON.stringify(initialGoals)]);

  const all = localGoals;

  const counts = {
    active: all.filter((g) => g.status === 'active').length,
    paused: all.filter((g) => g.status === 'paused').length,
    completed: all.filter((g) => g.status === 'completed').length,
  };

  const visible = all.filter((g) => g.status === filter);
  const totalSaved = all.reduce((s, g) => s + g.current, 0);
  const totalTarget = all.filter((g) => g.status !== 'completed').reduce((s, g) => s + g.target, 0);
  const overallPct = (totalSaved / totalTarget) * 100;

  return (
    <div className="alianca-root" style={{ display: 'flex' }}>
      <AlSidebar active="metas" onNavigate={onNavigate} couple={couple} />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '16px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--line)' }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--ink-mute)' }}>Acompanhamento</div>
            <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 2 }}>Metas financeiras</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost">Exportar resumo</button>
            <button className="btn btn-primary" onClick={() => setShowNew(true)}><AlIcon shape="plus" color="#fff" /> Nova meta</button>
          </div>
        </div>

        <div style={{ padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: 16, overflow: 'auto', flex: 1 }}>
          {/* Overall summary */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 12 }}>
            <div className="card" style={{ padding: 22, background: 'linear-gradient(135deg, #1F1F6E 0%, #2D2D8F 100%)', color: '#fff', position: 'relative', overflow: 'hidden' }}>
              <svg style={{ position: 'absolute', right: -30, top: -30, opacity: 0.07 }} width="180" height="180" viewBox="0 0 180 180"><circle cx="90" cy="90" r="60" stroke="#fff" strokeWidth="2" fill="none" /><circle cx="90" cy="90" r="30" stroke="#fff" strokeWidth="2" fill="none" /></svg>
              <div style={{ fontSize: 11, color: '#A8A8E0', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Total acumulado · todas as metas</div>
              <div className="num" style={{ fontSize: 40, lineHeight: 1, marginTop: 6 }}>{fmt(totalSaved)}</div>
              <div style={{ fontSize: 12, color: '#A8A8E0', marginTop: 6 }}>de {fmt(totalTarget)} em metas ativas · <span style={{ color: '#fff', fontWeight: 600 }}>{overallPct.toFixed(0)}%</span></div>
              <div style={{ marginTop: 16, height: 8, background: 'rgba(255,255,255,0.12)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${overallPct}%`, background: 'linear-gradient(90deg, var(--amber) 0%, #F5C77A 100%)', borderRadius: 99 }}></div>
              </div>
            </div>
            {[
              { label: 'Ativas', value: counts.active, color: 'var(--indigo)' },
              { label: 'Pausadas', value: counts.paused, color: 'var(--amber)' },
              { label: 'Concluídas', value: counts.completed, color: 'var(--green)' },
            ].map((s, i) => (
              <div key={i} className="card" style={{ padding: 18 }}>
                <div style={{ fontSize: 11, color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{s.label}</div>
                <div className="num" style={{ fontSize: 32, color: s.color, marginTop: 4 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-mute)' }}>{s.value === 1 ? 'meta' : 'metas'}</div>
              </div>
            ))}
          </div>

          {/* Filter tabs */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 0, padding: 4, background: 'var(--bg-2)', borderRadius: 10 }}>
              {[
                { id: 'active', label: 'Ativas', n: counts.active },
                { id: 'paused', label: 'Pausadas', n: counts.paused },
                { id: 'completed', label: 'Concluídas', n: counts.completed },
              ].map((f) => (
                <button key={f.id} onClick={() => setFilter(f.id)}
                  style={{
                    padding: '7px 14px', borderRadius: 7, cursor: 'pointer', border: 'none',
                    background: filter === f.id ? 'var(--paper)' : 'transparent',
                    color: filter === f.id ? 'var(--ink)' : 'var(--ink-soft)',
                    fontWeight: filter === f.id ? 600 : 500, fontSize: 12, fontFamily: 'inherit',
                    display: 'flex', alignItems: 'center', gap: 6,
                    boxShadow: filter === f.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  }}>{f.label} <span style={{ color: 'var(--ink-mute)', fontSize: 10 }}>{f.n}</span></button>
              ))}
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-mute)' }}>Ordenar por <span style={{ color: 'var(--ink)', fontWeight: 600, cursor: 'pointer' }}>prioridade</span> ↓</div>
          </div>

          {/* Goals grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 12 }}>
            {visible.map((g, idx) => {
              const pct = (g.current / g.target) * 100;
              const remaining = g.target - g.current;
              const colorMap = { emerald: 'var(--green)', sky: 'var(--indigo)', amber: 'var(--amber)' };
              const c = colorMap[g.color] || 'var(--indigo)';
              const isDone = g.status === 'completed';
              const isPaused = g.status === 'paused';
              return (
                <div key={g.id} className="card" style={{ padding: 20, position: 'relative', opacity: isDone ? 0.85 : 1 }}>
                  {isDone && <div style={{ position: 'absolute', top: 14, right: 14 }} className="chip chip-success">✓ Concluída</div>}
                  {isPaused && <div style={{ position: 'absolute', top: 14, right: 14 }} className="chip chip-amber">⏸ Pausada</div>}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: c + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{g.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, color: 'var(--ink-mute)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ display: 'inline-block', width: 18, height: 18, borderRadius: 4, background: 'var(--bg-2)', textAlign: 'center', fontSize: 9, lineHeight: '18px', fontWeight: 700 }}>{g.priority}</span>
                        Prioridade · até {g.due}
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 700, marginTop: 4 }}>{g.name}</div>
                    </div>
                  </div>

                  <div style={{ marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div className="num" style={{ fontSize: 22, color: c }}>{fmt(g.current)}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-mute)' }}>de <span className="num" style={{ color: 'var(--ink)' }}>{fmt(g.target)}</span></div>
                  </div>
                  <div style={{ height: 8, background: 'var(--bg-2)', borderRadius: 99, overflow: 'hidden', position: 'relative' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: c, borderRadius: 99, transition: 'width 1s' }}></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11 }}>
                    <span className="num" style={{ color: c, fontWeight: 600 }}>{pct.toFixed(0)}% completo</span>
                    {!isDone && <span style={{ color: 'var(--ink-mute)' }}>Faltam <span className="num" style={{ color: 'var(--ink)' }}>{fmt(remaining)}</span></span>}
                  </div>

                  {!isDone && (
                    <React.Fragment>
                      <div className="divider" style={{ margin: '16px 0' }}></div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ flex: 1 }}>
                          <label style={{ fontSize: 10, color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Adicionar guardado</label>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4, padding: '6px 10px', border: '1px solid var(--line-strong)', borderRadius: 8 }}>
                            <span style={{ fontSize: 11, color: 'var(--ink-mute)' }}>R$</span>
                            <input placeholder="0,00" className="num" style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', fontSize: 14 }} />
                          </div>
                        </div>
                        <button className="btn btn-primary" style={{ marginTop: 16, padding: '8px 12px', fontSize: 11 }}>+ Guardar</button>
                      </div>
                      <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                        {isPaused ? (
                          <button className="btn btn-ghost" style={{ fontSize: 10, padding: '5px 10px' }}>▶ Retomar</button>
                        ) : (
                          <button className="btn btn-ghost" style={{ fontSize: 10, padding: '5px 10px' }}>⏸ Pausar</button>
                        )}
                        <button className="btn btn-ghost" style={{ fontSize: 10, padding: '5px 10px' }}>✏️ Editar</button>
                        <button className="btn btn-ghost" style={{ fontSize: 10, padding: '5px 10px', marginLeft: 'auto', color: 'var(--red)' }}>Excluir</button>
                      </div>
                    </React.Fragment>
                  )}
                </div>
              );
            })}

            {/* New goal card */}
            {showNew && (
              <div className="card" style={{ padding: 20, border: '2px dashed var(--indigo)', background: 'var(--indigo-soft)' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--indigo)', marginBottom: 14 }}>+ Nova meta</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Nome</label>
                    <input className="input" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Ex: Casa nova, Intercâmbio…" style={{ marginTop: 4 }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div>
                      <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Valor da meta</label>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, padding: '8px 10px', border: '1px solid var(--line-strong)', borderRadius: 8, background: 'var(--paper)', marginTop: 4 }}>
                        <span style={{ fontSize: 11 }}>R$</span>
                        <input value={newTarget} onChange={e => setNewTarget(e.target.value)} placeholder="20.000" className="num" style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', fontSize: 14 }} />
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Já guardado</label>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, padding: '8px 10px', border: '1px solid var(--line-strong)', borderRadius: 8, background: 'var(--paper)', marginTop: 4 }}>
                        <span style={{ fontSize: 11 }}>R$</span>
                        <input value={newCurrent} onChange={e => setNewCurrent(e.target.value)} placeholder="0" className="num" style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', fontSize: 14 }} />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Prazo</label>
                    <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className="input" style={{ marginTop: 4, fontFamily: 'inherit' }} />
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                    <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowNew(false)}>Cancelar</button>
                    <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={async () => {
                      const goalData = { name: newName, target: Number(newTarget.replace(/\D/g, '')) || 0, current: Number(newCurrent.replace(/\D/g, '')) || 0, due: newDate, icon: newIcon };
                      if (onCreateGoal) {
                        const created = await onCreateGoal(goalData);
                        if (created) setLocalGoals(prev => [...prev, { ...goalData, id: created.id || `g-${Date.now()}`, status: 'active', priority: prev.length + 1 }]);
                      } else {
                        setLocalGoals(prev => [...prev, { ...goalData, id: `g-${Date.now()}`, status: 'active', priority: prev.length + 1 }]);
                      }
                      setShowNew(false); setNewName(''); setNewTarget(''); setNewCurrent(''); setNewDate('');
                    }}>Criar meta</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

// ============ WHAT-IF SIMULATOR ============
const AliancaSimulator = ({
  fixedExpenses: fixedProp,
  variableExpenses: variableProp,
  incomeTotal: incomeProp,
  cbValue: cbProp,
  onNavigate,
  couple,
  tweaks = {},
}) => {
  const fixedEx = fixedProp && fixedProp.length > 0 ? fixedProp : FIXED_EXPENSES;
  const varEx = variableProp && variableProp.length > 0 ? variableProp : VARIABLE_EXPENSES;
  const incomeUsed = incomeProp != null ? incomeProp : INCOME_TOTAL;
  const cbUsed = cbProp != null ? cbProp : CB_VALUE;
  const allExpenses = [...fixedEx, ...varEx];
  const [adjustments, setAdjustments] = React.useState({});
  const [extraSavings, setExtraSavings] = React.useState(500);
  const [scenarioName, setScenarioName] = React.useState('Cortar delivery + Uber');

  const adjustedExpenses = allExpenses.map((e) => ({ ...e, amount: adjustments[e.id] ?? e.amount }));
  const origTotal = allExpenses.reduce((s, e) => s + e.amount, 0);
  const simTotal = adjustedExpenses.reduce((s, e) => s + e.amount, 0);
  const origFree = incomeUsed - origTotal - cbUsed;
  const simFree = incomeUsed - simTotal - cbUsed - extraSavings;
  const origPct = incomeUsed > 0 ? ((origTotal + cbUsed) / incomeUsed) * 100 : 0;
  const simPct = incomeUsed > 0 ? ((simTotal + cbUsed + extraSavings) / incomeUsed) * 100 : 0;
  const delta = simFree - origFree;

  const adjustable = [...varEx, ...fixedEx.slice(0, 5)];

  return (
    <div className="alianca-root" style={{ display: 'flex' }}>
      <AlSidebar active="sim" onNavigate={onNavigate} couple={couple} />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '16px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--line)' }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--ink-mute)' }}>Planejamento</div>
            <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 2 }}>Simulador "E se?"</div>
          </div>
          <div className="chip chip-indigo">🔮 Sandbox · não afeta seu plano</div>
        </div>

        <div style={{ padding: '20px 28px', display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 16, flex: 1, overflow: 'auto' }}>
          {/* Adjusters */}
          <div className="card" style={{ padding: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>Ajuste suas despesas</div>
              <button onClick={() => setAdjustments({})} style={{ fontSize: 11, color: 'var(--indigo)', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>↺ Resetar</button>
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginBottom: 18 }}>Mexa nos sliders para simular o impacto no orçamento.</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {adjustable.map((e) => {
                const current = adjustments[e.id] ?? e.amount;
                const pct = e.amount > 0 ? (current / (e.amount * 1.5)) * 100 : 0;
                const cut = e.amount - current;
                return (
                  <div key={e.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 14 }}>{e.icon}</span>
                        <div style={{ fontSize: 12, fontWeight: 500 }}>{e.name}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                        {cut !== 0 && (
                          <span className="chip" style={{ fontSize: 10, background: cut > 0 ? 'var(--green-soft)' : 'var(--amber-soft)', color: cut > 0 ? 'var(--green)' : '#A4751E' }}>
                            {cut > 0 ? '−' : '+'}{fmtCompact(Math.abs(cut))}
                          </span>
                        )}
                        <span className="num" style={{ fontSize: 14, color: cut > 0 ? 'var(--green)' : 'var(--ink)' }}>{fmt(current)}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input type="range" min={0} max={Math.round(e.amount * 1.5)} step={10} value={current}
                        onChange={(ev) => setAdjustments({ ...adjustments, [e.id]: Number(ev.target.value) })}
                        style={{ flex: 1, accentColor: cut > 0 ? '#1D8F6A' : '#2D2D8F' }} />
                      <div style={{ width: 60, textAlign: 'right', fontSize: 10, color: 'var(--ink-mute)' }} className="num">R$ {e.amount.toLocaleString('pt-BR')}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="divider" style={{ margin: '20px 0' }}></div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <div style={{ fontSize: 12, fontWeight: 600 }}>💰 Quanto a mais quero guardar?</div>
                <span className="num" style={{ fontSize: 18, color: 'var(--indigo)' }}>{fmt(extraSavings)}</span>
              </div>
              <input type="range" min={0} max={2000} step={50} value={extraSavings}
                onChange={(e) => setExtraSavings(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#2D2D8F', marginTop: 6 }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--ink-mute)', marginTop: 4 }}>
                <span className="num">R$ 0</span><span className="num">R$ 2.000</span>
              </div>
            </div>
          </div>

          {/* Result */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="card" style={{ padding: 22, background: delta > 0 ? 'linear-gradient(135deg, #1D8F6A 0%, #2EA77F 100%)' : 'var(--paper)', color: delta > 0 ? '#fff' : 'var(--ink)' }}>
              <div style={{ fontSize: 11, color: delta > 0 ? '#C7EBD9' : 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Resultado · saldo livre</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 6 }}>
                <div className="num" style={{ fontSize: 40, lineHeight: 1 }}>{fmt(simFree)}</div>
                <div className="num" style={{ fontSize: 13, color: delta > 0 ? '#C7EBD9' : 'var(--ink-mute)', textDecoration: 'line-through' }}>{fmt(origFree)}</div>
              </div>
              <div style={{ marginTop: 10, fontSize: 13 }}>
                {delta > 0
                  ? <React.Fragment>💚 Você economiza <span className="num" style={{ fontWeight: 700 }}>{fmt(delta)}</span> por mês com esses ajustes.</React.Fragment>
                  : delta < 0
                  ? <React.Fragment>⚠️ Saldo cai <span className="num" style={{ fontWeight: 700, color: 'var(--red)' }}>{fmt(Math.abs(delta))}</span> por mês.</React.Fragment>
                  : <span style={{ color: 'var(--ink-mute)' }}>Nenhum ajuste aplicado.</span>}
              </div>
            </div>

            <div className="card" style={{ padding: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>Comparativo</div>
              {[
                { label: 'Total de despesas', o: origTotal, s: simTotal, lower: true },
                { label: '% comprometida', o: origPct, s: simPct, lower: true, isPct: true },
                { label: 'Saldo livre', o: origFree, s: simFree, lower: false },
              ].map((row, i) => {
                const improved = row.lower ? row.s < row.o : row.s > row.o;
                return (
                  <div key={i} style={{ padding: '10px 0', borderBottom: i < 2 ? '1px solid var(--line)' : 'none' }}>
                    <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>{row.label}</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 4 }}>
                      <span className="num" style={{ fontSize: 11, color: 'var(--ink-mute)', textDecoration: 'line-through' }}>
                        {row.isPct ? row.o.toFixed(0) + '%' : fmtCompact(row.o)}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--ink-mute)' }}>→</span>
                      <span className="num" style={{ fontSize: 18, color: improved ? 'var(--green)' : (row.s !== row.o ? 'var(--red)' : 'var(--ink)') }}>
                        {row.isPct ? row.s.toFixed(0) + '%' : fmtCompact(row.s)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="card" style={{ padding: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>Salvar como cenário</div>
              <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginBottom: 12 }}>Volte depois para revisitar esta simulação.</div>
              <input className="input" value={scenarioName} onChange={(e) => setScenarioName(e.target.value)} placeholder="Nome do cenário" />
              <textarea className="input" placeholder="Observações…" style={{ marginTop: 8, resize: 'none', height: 60, fontFamily: 'inherit' }}></textarea>
              <button className="btn btn-primary" style={{ marginTop: 10, width: '100%', justifyContent: 'center' }}>💾 Salvar cenário</button>

              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 10, color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 8 }}>Cenários salvos</div>
                {SCENARIOS.map((s) => (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, background: 'var(--bg-2)', marginBottom: 6 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{s.name}</div>
                      <div style={{ fontSize: 10, color: 'var(--ink-mute)' }}>{s.notes}</div>
                    </div>
                    <div className="num" style={{ fontSize: 12, color: 'var(--green)' }}>+{fmtCompact(s.delta)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// ============ ANAMNESIS / Onboarding Step 1 ============
const AliancaAnamnesis = ({ onBack, onNext, plan: planProp, profile: profileProp, savePlan, tweaks = {} }) => {
  const [unified, setUnified] = React.useState(planProp?.unified_finances || 'parcialmente');
  const [sharedPct, setSharedPct] = React.useState(planProp?.shared_expense_percentage || 60);
  const [mainGoal, setMainGoal] = React.useState(planProp?.main_goal || 'casa');
  const [hasReserve, setHasReserve] = React.useState(true);
  const [hasDebt, setHasDebt] = React.useState(false);

  const GOAL_OPTIONS = [
    { id: 'reserva', label: '🛟 Reserva de emergência' },
    { id: 'casa', label: '🏡 Comprar casa' },
    { id: 'carro', label: '🚗 Comprar carro' },
    { id: 'viagem', label: '✈️ Viagem' },
    { id: 'estudos', label: '🎓 Estudos / Pós' },
    { id: 'aposentadoria', label: '🌅 Aposentadoria' },
    { id: 'casamento', label: '💍 Casamento' },
    { id: 'outro', label: '✏️ Outro' },
  ];

  const p1Name = profileProp?.full_name?.split(' ')[0] || 'Você';
  const p2Name = planProp?.partner_name || 'Parceiro(a)';

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
                background: i === 0 ? 'var(--ink)' : 'transparent',
                color: i === 0 ? '#fff' : 'var(--ink-mute)',
              }}>
                <span className="num" style={{ fontSize: 11, fontWeight: 700 }}>{s.short}</span>
                <span style={{ fontSize: 11, fontWeight: 500 }}>{s.label}</span>
              </div>
              {i < WIZARD_STEPS.length - 1 && <div style={{ width: 10, height: 1, background: 'var(--line-strong)' }}></div>}
            </React.Fragment>
          ))}
        </div>
        <button className="btn btn-ghost">Salvar e sair</button>
      </header>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ maxWidth: 980, margin: '0 auto', padding: '40px 32px 60px' }}>
          <div className="chip chip-indigo">Passo 01 · Anamnese</div>
          <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.03em', margin: '14px 0 6px' }}>Vamos conhecer melhor o casal</h1>
          <p style={{ fontSize: 14, color: 'var(--ink-soft)', maxWidth: 640, margin: 0, lineHeight: 1.5 }}>Algumas informações permitem montar um plano personalizado. Você pode editar tudo depois pelo Perfil.</p>

          <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Person 1 */}
            <div className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <div style={{ width: 32, height: 32, borderRadius: 99, background: 'var(--indigo)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>{p1Name[0]}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>Pessoa 1 · {p1Name}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-mute)' }}>Dados principais</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)' }}>Nome</label>
                  <input className="input" defaultValue={profileProp?.full_name || p1Name} style={{ marginTop: 4 }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)' }}>Idade</label>
                  <input className="input" defaultValue="32" type="number" style={{ marginTop: 4 }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)' }}>Profissão</label>
                  <input className="input" defaultValue="Analista de Sistemas" style={{ marginTop: 4 }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Card label="Tem reserva de emergência?" desc="Recomendado: 6 meses de despesas" toggle={hasReserve} setToggle={setHasReserve}>
                  {hasReserve && (
                    <div style={{ marginTop: 12 }}>
                      <label style={{ fontSize: 10, color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Valor da reserva</label>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, padding: '8px 10px', border: '1px solid var(--line-strong)', borderRadius: 8, marginTop: 4 }}>
                        <span style={{ fontSize: 12, color: 'var(--ink-mute)' }}>R$</span>
                        <input defaultValue="12.000" className="num" style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', fontSize: 16 }} />
                      </div>
                    </div>
                  )}
                </Card>
                <Card label="Tem dívidas em atraso?" desc="Cartão, cheque especial, empréstimo" toggle={hasDebt} setToggle={setHasDebt} />
              </div>
            </div>

            {/* Person 2 */}
            <div className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <div style={{ width: 32, height: 32, borderRadius: 99, background: 'var(--amber)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>{p2Name[0]}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>Pessoa 2 · {p2Name}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-mute)' }}>Os mesmos campos para {p2Name}</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)' }}>Nome</label>
                  <input className="input" defaultValue={planProp?.partner_name || ''} placeholder={p2Name} style={{ marginTop: 4 }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)' }}>Idade</label>
                  <input className="input" defaultValue="30" type="number" style={{ marginTop: 4 }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)' }}>Profissão</label>
                  <input className="input" defaultValue="Designer UX" style={{ marginTop: 4 }} />
                </div>
              </div>
            </div>

            {/* Couple config */}
            <div className="card" style={{ padding: 24, background: 'var(--indigo-soft)', borderColor: 'transparent' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <span style={{ fontSize: 22 }}>💑</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>Configuração do casal</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>Como vocês administram juntos</div>
                </div>
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)' }}>Como vocês lidam com as finanças?</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 8 }}>
                  {[
                    { id: 'sim', label: '100% juntos', sub: 'Tudo compartilhado' },
                    { id: 'parcialmente', label: 'Parcialmente', sub: 'Algumas despesas comuns' },
                    { id: 'nao', label: 'Separados', sub: 'Contas independentes' },
                  ].map((o) => (
                    <button key={o.id} onClick={() => setUnified(o.id)}
                      style={{
                        padding: '14px 12px', borderRadius: 12, cursor: 'pointer',
                        border: '1px solid ' + (unified === o.id ? 'var(--indigo)' : 'var(--line-strong)'),
                        background: unified === o.id ? 'var(--paper)' : 'transparent',
                        textAlign: 'left', fontFamily: 'inherit',
                      }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: unified === o.id ? 'var(--indigo)' : 'var(--ink)' }}>{o.label}</div>
                      <div style={{ fontSize: 10, color: 'var(--ink-mute)', marginTop: 2 }}>{o.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {unified !== 'nao' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)' }}>% das despesas comuns pagas pela Pessoa 1 ({p1Name})</label>
                    <span className="num" style={{ fontSize: 22, color: 'var(--indigo)' }}>{sharedPct}%</span>
                  </div>
                  <input type="range" min={0} max={100} step={5} value={sharedPct} onChange={(e) => setSharedPct(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#2D2D8F' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: 'var(--ink-mute)' }}>
                    <span>{p1Name} · <span className="num" style={{ color: 'var(--indigo)', fontWeight: 600 }}>{sharedPct}%</span></span>
                    <span>{p2Name} · <span className="num" style={{ color: 'var(--amber)', fontWeight: 600 }}>{100 - sharedPct}%</span></span>
                  </div>
                </div>
              )}
            </div>

            {/* Main goal */}
            <div className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <span style={{ fontSize: 22 }}>🎯</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>Objetivo financeiro principal</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-mute)' }}>Pelo que vocês estão trabalhando este ano?</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {GOAL_OPTIONS.map((g) => (
                  <button key={g.id} onClick={() => setMainGoal(g.id)}
                    style={{
                      padding: '14px 10px', borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                      border: '1px solid ' + (mainGoal === g.id ? 'var(--indigo)' : 'var(--line-strong)'),
                      background: mainGoal === g.id ? 'var(--indigo-soft)' : 'transparent',
                      color: mainGoal === g.id ? 'var(--indigo)' : 'var(--ink)',
                      fontWeight: mainGoal === g.id ? 600 : 500, fontFamily: 'inherit', fontSize: 12,
                    }}>{g.label}</button>
                ))}
              </div>
              {mainGoal && (
                <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)' }}>Valor da meta</label>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, padding: '8px 10px', border: '1px solid var(--line-strong)', borderRadius: 8, marginTop: 4 }}>
                      <span style={{ fontSize: 12, color: 'var(--ink-mute)' }}>R$</span>
                      <input defaultValue="60.000" className="num" style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', fontSize: 16 }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)' }}>Prazo</label>
                    <select className="input" style={{ marginTop: 4, fontFamily: 'inherit' }} defaultValue="2-anos">
                      <option value="6-meses">Em 6 meses</option>
                      <option value="1-ano">Em 1 ano</option>
                      <option value="2-anos">Em 2 anos</option>
                      <option value="5-anos">Em até 5 anos</option>
                      <option value="longo">Longo prazo</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
              <button className="btn btn-ghost" onClick={() => onBack && onBack()}>← Voltar</button>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}
                onClick={async () => {
                  if (savePlan) await savePlan({ main_goal: mainGoal, unified_finances: unified, shared_expense_percentage: sharedPct });
                  onNext && onNext();
                }}>
                Continuar → Renda <AlIcon shape="arrow" color="#fff" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Small helper card for anamnesis toggles
const Card = ({ label, desc, toggle, setToggle, children }) => (
  <div style={{ padding: 14, border: '1px solid var(--line)', borderRadius: 10 }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 2 }}>{desc}</div>
      </div>
      <button onClick={() => setToggle(v => !v)} style={{ width: 38, height: 22, borderRadius: 99, background: toggle ? 'var(--indigo)' : 'var(--line-strong)', border: 'none', position: 'relative', cursor: 'pointer', flexShrink: 0 }}>
        <div style={{ position: 'absolute', top: 2, left: toggle ? 18 : 2, width: 18, height: 18, borderRadius: 99, background: '#fff', transition: 'left .15s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}></div>
      </button>
    </div>
    {children}
  </div>
);

// ─── Exports ─────────────────────────────────────────────
export { AliancaGoals, AliancaSimulator, AliancaAnamnesis };
