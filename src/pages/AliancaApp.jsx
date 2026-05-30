import { useState, useEffect } from 'react'
import { useAuthContext } from '../context/AuthContext'
import { useFinanceContext } from '../context/FinanceContext'
import { useExpenses } from '../hooks/useExpenses'
import { useGoals } from '../hooks/useGoals'
import { useComunhaoBens } from '../hooks/useComunhaoBens'
import { usePlan } from '../hooks/usePlan'
import { AliancaDashboard } from '../alianca/components/AliancaShared'
import { AliancaCBModule } from '../alianca/screens/AliancaCBModule'
import { AliancaLancamentos } from '../alianca/screens/AliancaExpenses'
import { AliancaGoals, AliancaSimulator } from '../alianca/screens/AliancaFeatures'
import { AliancaProfile } from '../alianca/screens/AliancaProfileCB'
import { Toast } from '../components/UI/Toast'

const MONTH_NAMES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']

const buildRecommendations = (freeBalance, incomeTotal, totalFixed, totalVar) => {
  const expPct = incomeTotal > 0 ? ((totalFixed + totalVar) / incomeTotal) * 100 : 0
  const recs = []
  if (expPct < 85) {
    recs.push({ type: 'success', icon: '✨', title: 'Saldo livre saudável', desc: `Vocês comprometem ${expPct.toFixed(0)}% da renda — abaixo do limite de 85%. Continue assim!` })
  } else {
    recs.push({ type: 'warning', icon: '⚠️', title: 'Orçamento apertado', desc: `${expPct.toFixed(0)}% da renda comprometida. Reveja as despesas para abrir espaço.` })
  }
  if (freeBalance < 0) {
    recs.push({ type: 'warning', icon: '🚨', title: 'Saldo negativo', desc: 'As despesas superam a renda. Ajuste o orçamento o quanto antes.' })
  }
  if (recs.length < 3) {
    recs.push({ type: 'info', icon: '🎯', title: 'Registre suas metas', desc: 'Defina uma meta financeira e acompanhe o progresso todo mês.' })
  }
  return recs
}

export const AliancaApp = () => {
  const { user, profile, updateProfile, updateAuth } = useAuthContext()
  const { plan, expenses, showToast } = useFinanceContext()
  const { savePlan } = usePlan()
  const { loadExpenses, saveExpenses } = useExpenses()
  const { goals, loadGoals, createGoal, updateGoal, deleteGoal } = useGoals()
  const { config, historico, addDevolucao, saveConfig } = useComunhaoBens()

  const [activeScreen, setActiveScreen] = useState('home')

  useEffect(() => {
    loadExpenses()
    loadGoals()
  }, [])

  // Derived financial values
  const fixedExpenses = expenses.filter(e => e.expense_type === 'fixed')
  const variableExpenses = expenses.filter(e => e.expense_type === 'variable')
  const totalFixed = fixedExpenses.reduce((s, e) => s + (Number(e.amount) || 0), 0)
  const totalVar = variableExpenses.reduce((s, e) => s + (Number(e.amount) || 0), 0)
  const incomeTotal = (plan?.monthly_income || 0) + (plan?.partner_income || 0)
  const cbPct = (config?.percentual || 15) / 100
  const cbValue = incomeTotal * cbPct
  const freeBalance = incomeTotal - totalFixed - totalVar - cbValue
  const streak = config?.meses_consecutivos || 0

  // Couple display
  const p1Name = profile?.full_name?.split(' ')[0] || 'Você'
  const p2Name = plan?.partner_name?.split(' ')[0] || 'Parceiro(a)'
  const couple = {
    type: plan?.plan_type || 'casal',
    p1: { name: p1Name, income: plan?.monthly_income || 0, color: '#2D2D8F' },
    p2: { name: p2Name, income: plan?.partner_income || 0, color: '#E5A53C' },
  }

  // Category grouping for dashboard
  const allExp = [...fixedExpenses, ...variableExpenses]
  const byCategory = (() => {
    const m = {}
    allExp.forEach(e => {
      const cat = e.category || e.cat || 'Outros'
      m[cat] = (m[cat] || 0) + Number(e.amount || 0)
    })
    return Object.entries(m).map(([cat, amount]) => ({ cat, amount })).sort((a, b) => b.amount - a.amount)
  })()

  const topExpenses = allExp
    .filter(e => Number(e.amount) > 0)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5)
    .map(e => ({ name: e.custom_label || e.category || e.name || 'Despesa', amount: Number(e.amount || 0) }))

  // Goals mapping (real schema → display schema)
  const mappedGoals = goals.map((g, i) => ({
    id: g.id,
    name: g.name,
    target: g.target_value || g.target || 0,
    current: g.current_value || g.current || 0,
    due: g.due_date ? new Date(g.due_date).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }) : g.due || '',
    icon: g.icon || '🎯',
    color: ['emerald', 'sky', 'amber'][i % 3],
    status: g.status || 'active',
    priority: g.priority || i + 1,
  }))

  // CB history mapping (real schema → display schema)
  const cbHistory = historico.slice(0, 12).map(h => {
    const [, m] = (h.mes_referencia || '2026-01').split('-').map(Number)
    return {
      month: MONTH_NAMES[(m || 1) - 1],
      amount: h.valor_devolvido || 0,
      paid: h.status === 'devolvido',
    }
  }).reverse()

  // Expense mappers (real schema → aliança display schema)
  const mapForDisplay = (exp) => ({
    id: exp.id,
    name: exp.custom_label || exp.category || exp.name || '',
    cat: exp.category || 'Outros',
    amount: Number(exp.amount || 0),
    icon: exp.icon || '💰',
    ownership: exp.ownership || 'shared',
  })

  const recommendations = buildRecommendations(freeBalance, incomeTotal, totalFixed, totalVar)

  const nav = (id) => setActiveScreen(id)
  const shared = { onNavigate: nav, couple }

  const screens = {
    home: (
      <AliancaDashboard
        couple={couple}
        incomeTotal={incomeTotal}
        totalFixed={totalFixed}
        totalVar={totalVar}
        freeBalance={freeBalance}
        cbValue={cbValue}
        streak={streak}
        goals={mappedGoals.length ? mappedGoals : undefined}
        byCategory={byCategory.length ? byCategory : undefined}
        topExpenses={topExpenses.length ? topExpenses : undefined}
        recommendations={recommendations}
        {...shared}
      />
    ),
    cb: (
      <AliancaCBModule
        incomeTotal={incomeTotal}
        cbConfig={config}
        cbHistory={cbHistory.length ? cbHistory : undefined}
        streak={streak}
        onRegisterDevolucao={addDevolucao}
        {...shared}
      />
    ),
    metas: (
      <AliancaGoals
        initialGoals={mappedGoals}
        onCreateGoal={async (data) => createGoal({
          name: data.name,
          target_value: data.target,
          current_value: data.current || 0,
          due_date: data.due,
          icon: data.icon,
          status: 'active',
        })}
        onUpdateGoal={async (id, updates) => updateGoal(id, updates)}
        onDeleteGoal={async (id) => deleteGoal(id)}
        {...shared}
      />
    ),
    sim: (
      <AliancaSimulator
        fixedExpenses={fixedExpenses.map(mapForDisplay)}
        variableExpenses={variableExpenses.map(mapForDisplay)}
        incomeTotal={incomeTotal}
        cbValue={cbValue}
        {...shared}
      />
    ),
    mov: (
      <AliancaLancamentos
        fixedExpenses={fixedExpenses.map(mapForDisplay)}
        variableExpenses={variableExpenses.map(mapForDisplay)}
        incomeTotal={incomeTotal}
        coupleNames={{ p1: couple.p1.name, p2: couple.p2.name }}
        onSaveFixed={async (rows) => saveExpenses([
          ...rows.map(r => ({ ...r, expense_type: 'fixed' })),
          ...variableExpenses,
        ])}
        onSaveVariable={async (rows) => saveExpenses([
          ...fixedExpenses,
          ...rows.map(r => ({ ...r, expense_type: 'variable' })),
        ])}
        {...shared}
      />
    ),
    profile: (
      <AliancaProfile
        profile={profile}
        user={user}
        plan={plan}
        cbConfig={config}
        updateProfile={updateProfile}
        updateAuth={updateAuth}
        savePlan={savePlan}
        saveCBConfig={saveConfig}
        showToast={showToast}
        {...shared}
      />
    ),
  }

  return (
    <>
      {screens[activeScreen] || screens.home}
      <Toast />
    </>
  )
}
