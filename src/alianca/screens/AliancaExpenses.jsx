// Auto-generated from prototype. Aliança UI kit for DuoFinanças.
import React from 'react';
import {
  fmt, fmtCompact, INCOME_TOTAL, FIXED_EXPENSES, VARIABLE_EXPENSES,
  FIXED_CATEGORIES, VARIABLE_CATEGORIES, TOTAL_FIXED, TOTAL_VAR,
} from '../mockData';
import { AlIcon, AlSidebar } from '../components/AliancaShared';

const OWNERSHIP = [
  { value: 'shared', label: 'Compartilhada', icon: '👫' },
  { value: 'person_1', label: 'Só eu', icon: '👤' },
  { value: 'person_2', label: 'Só parceiro(a)', icon: '👥' },
];

// Unified lançamentos view — manages fixed / variable sub-tab internally
const AliancaLancamentos = ({
  fixedExpenses: fixedProp,
  variableExpenses: variableProp,
  incomeTotal = INCOME_TOTAL,
  coupleNames,
  onSaveFixed,
  onSaveVariable,
  onNavigate,
  couple,
  tweaks = {},
}) => {
  const [kind, setKind] = React.useState('fixed');
  const isFixed = kind === 'fixed';
  const accent = isFixed ? 'var(--indigo)' : 'var(--amber)';
  const accentSoft = isFixed ? 'var(--indigo-soft)' : 'var(--amber-soft)';
  const categories = isFixed ? FIXED_CATEGORIES : VARIABLE_CATEGORIES;

  // Seed state from props on first mount and when prop identity changes
  const [fixedRows, setFixedRows] = React.useState(() => seedRows(fixedProp ?? FIXED_EXPENSES, FIXED_CATEGORIES));
  const [varRows, setVarRows] = React.useState(() => seedRows(variableProp ?? VARIABLE_EXPENSES, VARIABLE_CATEGORIES));

  React.useEffect(() => {
    if (fixedProp) setFixedRows(seedRows(fixedProp, FIXED_CATEGORIES));
  }, [JSON.stringify(fixedProp)]);

  React.useEffect(() => {
    if (variableProp) setVarRows(seedRows(variableProp, VARIABLE_CATEGORIES));
  }, [JSON.stringify(variableProp)]);

  const rows = isFixed ? fixedRows : varRows;
  const setRows = isFixed ? setFixedRows : setVarRows;
  const onSave = isFixed ? onSaveFixed : onSaveVariable;

  // Debounced auto-save
  const saveTimer = React.useRef(null);
  const triggerSave = (newRows) => {
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      onSave?.(newRows.filter(r => Number(r.amount) > 0));
    }, 800);
  };

  const update = (id, field, value) => {
    const next = rows.map(r => r.id === id ? { ...r, [field]: value } : r);
    setRows(next);
    triggerSave(next);
  };
  const remove = (id) => {
    const next = rows.filter(r => r.id !== id);
    setRows(next);
    triggerSave(next);
  };
  const addRow = () => {
    const next = [...rows, { id: `new-${Date.now()}`, name: '', cat: 'Outros', amount: 0, icon: '💰', ownership: 'shared', isNew: true }];
    setRows(next);
  };

  const total = rows.reduce((s, r) => s + (Number(r.amount) || 0), 0);
  const filled = rows.filter(r => (Number(r.amount) || 0) > 0).length;
  const byOwner = rows.reduce((acc, r) => {
    acc[r.ownership || 'shared'] = (acc[r.ownership || 'shared'] || 0) + Number(r.amount || 0);
    return acc;
  }, { shared: 0, person_1: 0, person_2: 0 });

  const totalFixed = fixedRows.reduce((s, r) => s + (Number(r.amount) || 0), 0);
  const totalVar = varRows.reduce((s, r) => s + (Number(r.amount) || 0), 0);

  const p1Name = coupleNames?.p1 || 'Você';
  const p2Name = coupleNames?.p2 || 'Parceiro(a)';
  const ownerLabels = [
    { key: 'shared', label: 'Compartilhada', icon: '👫', c: 'var(--ink)' },
    { key: 'person_1', label: p1Name, icon: '👤', c: 'var(--indigo)' },
    { key: 'person_2', label: p2Name, icon: '👥', c: 'var(--amber)' },
  ];

  return (
    <div className="alianca-root" style={{ display: 'flex' }}>
      <AlSidebar active="mov" onNavigate={onNavigate} couple={couple} />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '16px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--line)' }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--ink-mute)' }}>Lançamentos</div>
            <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 2 }}>Despesas {isFixed ? 'fixas' : 'variáveis'}</div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {onSave && <div className="chip chip-success">● Auto-save</div>}
            <button className="btn btn-primary" onClick={addRow}><AlIcon shape="plus" color="#fff" /> Nova despesa</button>
          </div>
        </div>

        {/* Sub tabs */}
        <div style={{ display: 'flex', gap: 0, padding: '12px 28px 0', borderBottom: '1px solid var(--line)' }}>
          {[
            { id: 'fixed', label: 'Fixas', sum: totalFixed },
            { id: 'variable', label: 'Variáveis', sum: totalVar },
          ].map((t) => {
            const active = t.id === kind;
            const tabAccent = t.id === 'fixed' ? 'var(--indigo)' : 'var(--amber)';
            return (
              <div key={t.id} onClick={() => setKind(t.id)} style={{
                padding: '10px 16px', borderBottom: '2px solid ' + (active ? tabAccent : 'transparent'),
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                color: active ? 'var(--ink)' : 'var(--ink-soft)',
              }}>
                <span style={{ fontWeight: 600, fontSize: 13 }}>{t.label}</span>
                <span className="num" style={{ fontSize: 11, color: 'var(--ink-mute)' }}>{fmtCompact(t.sum)}</span>
              </div>
            );
          })}
        </div>

        <div style={{ padding: '18px 28px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: 18, flex: 1, overflow: 'auto' }}>
          {/* List */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '40px 1.4fr 1fr 1.3fr 40px', gap: 12, padding: '12px 18px', borderBottom: '1px solid var(--line)', fontSize: 10, color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, background: 'var(--bg-2)' }}>
              <div></div><div>Descrição</div><div style={{ textAlign: 'right' }}>Valor</div><div>Quem paga</div><div></div>
            </div>

            {rows.map((r, idx) => {
              const active = (Number(r.amount) || 0) > 0;
              return (
                <div key={r.id} style={{
                  display: 'grid', gridTemplateColumns: '40px 1.4fr 1fr 1.3fr 40px', gap: 12,
                  padding: '14px 18px', alignItems: 'center',
                  borderBottom: idx < rows.length - 1 ? '1px solid var(--line)' : 'none',
                  background: active ? accentSoft + '50' : 'transparent',
                  borderLeft: '3px solid ' + (active ? accent : 'transparent'),
                  paddingLeft: 15, transition: 'background .15s',
                }}>
                  <div style={{ fontSize: 20 }}>{r.icon}</div>
                  <div>
                    <input value={r.name} onChange={(e) => update(r.id, 'name', e.target.value)}
                      placeholder="Nome da despesa"
                      style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', fontFamily: 'inherit', fontSize: 13, fontWeight: 500, color: 'var(--ink)' }} />
                    <div style={{ fontSize: 10, color: 'var(--ink-mute)', marginTop: 2 }}>{r.cat}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: 11, color: 'var(--ink-mute)' }}>R$</span>
                    <input
                      value={r.amount > 0 ? r.amount.toLocaleString('pt-BR') : ''}
                      onChange={(e) => update(r.id, 'amount', Number(e.target.value.replace(/\D/g, '')) || 0)}
                      placeholder="0"
                      className="num"
                      style={{ width: 92, textAlign: 'right', border: 'none', outline: 'none', background: 'transparent', fontFamily: 'Sora, sans-serif', fontSize: 16, color: active ? 'var(--ink)' : 'var(--ink-mute)' }} />
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {OWNERSHIP.map((o) => (
                      <button key={o.value} onClick={() => update(r.id, 'ownership', o.value)}
                        title={o.label}
                        style={{
                          padding: '5px 8px', borderRadius: 6, cursor: 'pointer',
                          border: '1px solid ' + (r.ownership === o.value ? accent : 'var(--line-strong)'),
                          background: r.ownership === o.value ? accentSoft : 'transparent',
                          color: r.ownership === o.value ? accent : 'var(--ink-soft)',
                          fontSize: 11, fontWeight: 500, fontFamily: 'inherit',
                          display: 'flex', alignItems: 'center', gap: 4,
                        }}>
                        <span>{o.icon}</span>
                        <span style={{ display: r.ownership === o.value ? 'inline' : 'none' }}>{o.value === 'person_1' ? p1Name : o.value === 'person_2' ? p2Name : 'Casal'}</span>
                      </button>
                    ))}
                  </div>
                  <button onClick={() => remove(r.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--ink-mute)', fontSize: 14, padding: 4 }} title="Remover">×</button>
                </div>
              );
            })}

            <div style={{ padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg)', borderTop: '1px solid var(--line)' }}>
              <button className="btn btn-ghost" style={{ fontSize: 12, padding: '8px 12px' }} onClick={addRow}><AlIcon shape="plus" /> Adicionar despesa</button>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 11, color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total</span>
                <span className="num" style={{ fontSize: 22, color: accent }}>{fmt(total)}</span>
              </div>
            </div>
          </div>

          {/* Side panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="card" style={{ padding: 18 }}>
              <div style={{ fontSize: 11, color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Total {isFixed ? 'fixas' : 'variáveis'}</div>
              <div className="num" style={{ fontSize: 32, color: accent, marginTop: 4 }}>{fmt(total)}</div>
              <div style={{ display: 'flex', gap: 12, marginTop: 12, fontSize: 11, color: 'var(--ink-mute)' }}>
                <div><span className="num" style={{ color: 'var(--ink)' }}>{filled}</span> ativas</div>
                <div>·</div>
                <div><span className="num" style={{ color: 'var(--ink)' }}>{rows.length - filled}</span> em branco</div>
              </div>
              {incomeTotal > 0 && (
                <div style={{ marginTop: 14, padding: 12, background: 'var(--bg-2)', borderRadius: 10 }}>
                  <div style={{ fontSize: 11, color: 'var(--ink-mute)' }}>Representa <span className="num" style={{ color: 'var(--ink)' }}>{((total / incomeTotal) * 100).toFixed(0)}%</span> da renda do casal.</div>
                </div>
              )}
            </div>

            <div className="card" style={{ padding: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Divisão por pessoa</div>
              {ownerLabels.map((p) => {
                const v = byOwner[p.key] || 0;
                const pct = total > 0 ? (v / total) * 100 : 0;
                return (
                  <div key={p.key} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span>{p.icon}</span>{p.label}</span>
                      <span className="num" style={{ color: p.c, fontWeight: 600 }}>{fmtCompact(v)} <span style={{ color: 'var(--ink-mute)', fontWeight: 400 }}>· {pct.toFixed(0)}%</span></span>
                    </div>
                    <div style={{ height: 5, background: 'var(--bg-2)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: p.c }}></div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="card" style={{ padding: 18, background: isFixed ? 'var(--indigo-soft)' : 'var(--amber-soft)', borderColor: 'transparent' }}>
              <div style={{ fontSize: 11, color: isFixed ? 'var(--indigo)' : '#A4751E', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>💡 Dica</div>
              <div style={{ fontSize: 12, marginTop: 6, lineHeight: 1.5, color: 'var(--ink)' }}>
                {isFixed
                  ? 'Despesas fixas mudam pouco. Salve aqui apenas o que se repete todo mês.'
                  : 'Para despesas variáveis, use uma média dos últimos 3 meses para mais precisão no plano.'}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

function seedRows(expenses, categories) {
  const rows = expenses.map(e => ({
    id: e.id || `seed-${Math.random()}`,
    name: e.name || e.custom_label || e.category || '',
    cat: e.cat || e.category || 'Outros',
    amount: Number(e.amount) || 0,
    icon: e.icon || '💰',
    ownership: e.ownership || 'shared',
  }));
  // Add empty slots from categories not already covered
  const covered = new Set(rows.map(r => r.cat));
  categories
    .filter(c => !covered.has(c.category))
    .slice(0, 5)
    .forEach((c, i) => {
      rows.push({ id: `empty-${i}`, name: c.category, cat: c.category, amount: 0, icon: c.icon, ownership: 'shared' });
    });
  return rows;
}

// Legacy single-kind wrappers (kept for back-compat)
const AliancaFixedExpenses = (props) => <AliancaLancamentos {...props} />;
const AliancaVariableExpenses = (props) => <AliancaLancamentos {...props} defaultKind="variable" />;

export { AliancaFixedExpenses, AliancaVariableExpenses, AliancaLancamentos };
