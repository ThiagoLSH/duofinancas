import { useEffect } from 'react'
import { Edit3 } from 'lucide-react'
import { Button } from '../UI/Button'
import { KPICard } from '../UI/Card'
import { ExpenseDonut } from '../Charts/ExpenseDonut'
import { TopExpensesBar } from '../Charts/TopExpensesBar'
import { CoupleComparison } from '../Charts/CoupleComparison'
import { useExpenses } from '../../hooks/useExpenses'
import { useRealtimeSync } from '../../hooks/useRealtimeSync'
import { useFinanceContext } from '../../context/FinanceContext'
import {
  calcTotalIncome, calcFixedExpenses, calcVariableExpenses,
  calcFreeBalance, calcCommittedPercent, getFinancialHealth,
  calcExpensesByCategory, calcTopExpenses,
  calcPerson1Income, calcPerson2Income, calcSharedExpenses,
  generateRecommendations,
} from '../../utils/calculations'
import { formatCurrency, formatPercent } from '../../utils/formatters'
import { clsx } from 'clsx'

const SemaphoreBar = ({ pct }) => {
  const health = getFinancialHealth(pct)
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-400">Renda comprometida</span>
        <span className="font-bold" style={{ color: health.color }}>
          {formatPercent(pct)} — {health.label}
        </span>
      </div>
      <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${Math.min(pct, 100)}%`,
            backgroundColor: health.color,
          }}
        />
      </div>
      <div className="flex justify-between text-xs text-slate-600">
        <span>🟢 Saudável &lt;70%</span>
        <span>🟡 Atenção 70-90%</span>
        <span>🔴 Crítico &gt;90%</span>
      </div>
    </div>
  )
}

const RecommendationCard = ({ rec }) => {
  const bg = {
    success: 'bg-emerald-500/10 border-emerald-500/20',
    warning: 'bg-yellow-500/10 border-yellow-500/20',
    danger: 'bg-red-500/10 border-red-500/20',
    info: 'bg-blue-500/10 border-blue-500/20',
  }
  const text = {
    success: 'text-emerald-300',
    warning: 'text-yellow-300',
    danger: 'text-red-300',
    info: 'text-blue-300',
  }
  return (
    <div className={clsx('rounded-xl border p-4 space-y-1', bg[rec.type])}>
      <p className={clsx('text-sm font-semibold', text[rec.type])}>
        {rec.icon} {rec.title}
      </p>
      <p className="text-xs text-slate-400 leading-relaxed">{rec.description}</p>
    </div>
  )
}

export const Dashboard = () => {
  const { plan, expenses, setStep } = useFinanceContext()
  const { loadExpenses } = useExpenses()
  useRealtimeSync()

  useEffect(() => {
    loadExpenses()
  }, [plan?.id])

  const totalIncome = calcTotalIncome(plan)
  const fixed = calcFixedExpenses(expenses)
  const variable = calcVariableExpenses(expenses)
  const free = calcFreeBalance(plan, expenses)
  const pct = calcCommittedPercent(plan, expenses)
  const byCategory = calcExpensesByCategory(expenses)
  const top5 = calcTopExpenses(expenses, 5)
  const recommendations = generateRecommendations(plan, expenses)
  const isCouple = plan?.plan_type === 'couple'

  const coupleData = isCouple ? (() => {
    const p1 = calcPerson1Income(plan)
    const p2 = calcPerson2Income(plan)
    const { person1, person2 } = calcSharedExpenses(expenses, plan?.shared_expense_percentage ?? 50)
    return [
      { name: 'Renda', 'Pessoa 1': p1, 'Pessoa 2': p2 },
      { name: 'Despesas', 'Pessoa 1': person1, 'Pessoa 2': person2 },
      { name: 'Saldo', 'Pessoa 1': Math.max(0, p1 - person1), 'Pessoa 2': Math.max(0, p2 - person2) },
    ]
  })() : []

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-fade-in" id="dashboard-export">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Dashboard financeiro</h2>
          <p className="text-slate-400 mt-1">Visão geral do seu planejamento</p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => { setStep(1) }}>
          <Edit3 size={15} /> Editar dados
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPICard label="Renda total" value={formatCurrency(totalIncome)} icon="💰" color="emerald" />
        <KPICard label="Despesas fixas" value={formatCurrency(fixed)} icon="🏠" color="slate" />
        <KPICard label="Despesas variáveis" value={formatCurrency(variable)} icon="🛍️" color="yellow" />
        <KPICard
          label="Saldo livre"
          value={formatCurrency(free)}
          icon={free >= 0 ? '✅' : '⚠️'}
          color={free >= 0 ? 'emerald' : 'red'}
        />
      </div>

      {/* Semáforo */}
      <div className="glass-card p-5">
        <SemaphoreBar pct={pct} />
      </div>

      {/* Charts */}
      <div className={clsx('grid gap-4', isCouple ? 'lg:grid-cols-3' : 'lg:grid-cols-2')}>
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-3">Distribuição por categoria</h3>
          <ExpenseDonut data={byCategory} />
        </div>
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-3">Top 5 maiores gastos</h3>
          <TopExpensesBar data={top5.map((e) => ({ name: e.category, value: parseFloat(e.amount) || 0 }))} />
        </div>
        {isCouple && (
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Comparativo do casal</h3>
            <CoupleComparison data={coupleData} />
          </div>
        )}
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-slate-200">💡 Recomendações</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {recommendations.map((rec, i) => (
              <RecommendationCard key={i} rec={rec} />
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
