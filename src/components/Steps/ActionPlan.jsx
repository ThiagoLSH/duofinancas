import { useEffect } from 'react'
import { RotateCcw } from 'lucide-react'
import { Button } from '../UI/Button'
import { WhatIfSimulator } from '../Features/WhatIfSimulator'
import { PdfExport } from '../Features/PdfExport'
import { useScenarios } from '../../hooks/useScenarios'
import { useFinanceContext } from '../../context/FinanceContext'
import { usePlan } from '../../hooks/usePlan'
import {
  calcTotalIncome, calcFreeBalance, calcRequiredMonthlySavings,
  generateRecommendations
} from '../../utils/calculations'
import { formatCurrency, GOAL_LABELS, TIMEFRAME_LABELS } from '../../utils/formatters'
import { clsx } from 'clsx'

const SuggestionItem = ({ emoji, text, saving }) => (
  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/30">
    <span className="text-lg flex-shrink-0">{emoji}</span>
    <div className="flex-1 min-w-0">
      <p className="text-sm text-slate-300">{text}</p>
    </div>
    {saving > 0 && (
      <span className="text-xs font-bold text-emerald-400 flex-shrink-0">
        +{formatCurrency(saving)}/mês
      </span>
    )}
  </div>
)

export const ActionPlan = () => {
  const { plan, expenses, setStep, reset, showToast } = useFinanceContext()
  const { resetPlan } = usePlan()
  const { loadScenarios } = useScenarios()

  useEffect(() => {
    loadScenarios()
  }, [plan?.id])

  const totalIncome = calcTotalIncome(plan)
  const free = calcFreeBalance(plan, expenses)
  const requiredSavings = calcRequiredMonthlySavings(plan, expenses)
  const recommendations = generateRecommendations(plan, expenses)

  const highExpenses = expenses
    .filter((e) => (parseFloat(e.amount) || 0) > totalIncome * 0.15)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3)

  const handleReset = async () => {
    if (window.confirm('Tem certeza que deseja resetar o planejamento? Todos os dados serão removidos.')) {
      await resetPlan()
      reset()
      showToast('Planejamento resetado')
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-white">Plano de ação</h2>
        <p className="text-slate-400 mt-1">Seu roteiro financeiro personalizado</p>
      </div>

      {/* Goal Summary */}
      {plan?.main_goal && (
        <div className="glass-card p-5 space-y-4 border-emerald-500/20">
          <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wide">🎯 Seu objetivo</h3>
          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <p className="text-xs text-slate-500">Objetivo</p>
              <p className="text-sm font-medium text-slate-200">
                {GOAL_LABELS[plan.main_goal] || plan.goal_custom_description || 'Personalizado'}
              </p>
            </div>
            {plan.goal_target_value > 0 && (
              <div>
                <p className="text-xs text-slate-500">Meta</p>
                <p className="text-sm font-bold text-emerald-400">{formatCurrency(plan.goal_target_value)}</p>
              </div>
            )}
            {plan.goal_timeframe && (
              <div>
                <p className="text-xs text-slate-500">Prazo</p>
                <p className="text-sm font-medium text-slate-200">{TIMEFRAME_LABELS[plan.goal_timeframe]}</p>
              </div>
            )}
          </div>
          {requiredSavings > 0 && (
            <div className={clsx(
              'rounded-xl p-3 text-sm',
              requiredSavings <= free
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
                : 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-300'
            )}>
              {requiredSavings <= free ? '✅' : '⚠️'} Para atingir sua meta, você precisa guardar{' '}
              <strong>{formatCurrency(requiredSavings)}/mês</strong>.
              {requiredSavings > free && (
                <span> Seu saldo livre atual é de {formatCurrency(free)} — considere cortar gastos.</span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Suggestions */}
      {highExpenses.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-slate-200">✂️ Sugestões de corte</h3>
          <p className="text-xs text-slate-500">
            Despesas que representam mais de 15% da sua renda e podem ser revistas
          </p>
          <div className="space-y-2">
            {highExpenses.map((e) => {
              const pct = totalIncome > 0 ? ((e.amount / totalIncome) * 100).toFixed(0) : 0
              const potential = parseFloat(e.amount) * 0.2
              return (
                <SuggestionItem
                  key={e.id}
                  emoji="📊"
                  text={`${e.category} representa ${pct}% da sua renda. Reduzir 20% libera ${formatCurrency(potential)}/mês.`}
                  saving={potential}
                />
              )
            })}
          </div>
        </div>
      )}

      {/* Additional recommendations */}
      {recommendations.filter((r) => r.type !== 'success').length > 0 && (
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-slate-200">📋 Próximos passos</h3>
          <div className="space-y-2">
            {recommendations
              .filter((r) => r.type !== 'success')
              .slice(0, 4)
              .map((rec, i) => (
                <SuggestionItem key={i} emoji={rec.icon} text={`${rec.title}: ${rec.description}`} />
              ))}
          </div>
        </div>
      )}

      {/* What-If Simulator */}
      <div className="glass-card p-5">
        <WhatIfSimulator />
      </div>

      {/* Export */}
      <div className="glass-card p-5 space-y-3">
        <h3 className="text-base font-semibold text-slate-200">📄 Exportar</h3>
        <PdfExport />
      </div>

      {/* Reset */}
      <div className="flex justify-end pt-2">
        <Button
          variant="danger"
          size="sm"
          onClick={handleReset}
        >
          <RotateCcw size={15} /> Resetar planejamento
        </Button>
      </div>
    </div>
  )
}
