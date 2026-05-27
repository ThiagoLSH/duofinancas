import { useState } from 'react'
import { Save, Trash2, Play, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '../UI/Button'
import { CurrencyInput } from '../UI/CurrencyInput'
import { useScenarios } from '../../hooks/useScenarios'
import { useFinanceContext } from '../../context/FinanceContext'
import {
  calcTotalIncome, calcTotalExpenses, calcFreeBalance, calcCommittedPercent, getFinancialHealth
} from '../../utils/calculations'
import { formatCurrency, formatPercent } from '../../utils/formatters'
import { clsx } from 'clsx'

const SimResult = ({ label, original, simulated, better }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-slate-400">{label}</span>
    <div className="flex items-center gap-2">
      <span className="text-slate-500 line-through text-xs">{original}</span>
      <span className={clsx('font-bold', better ? 'text-emerald-400' : 'text-red-400')}>
        {simulated}
      </span>
    </div>
  </div>
)

export const WhatIfSimulator = () => {
  const { plan, expenses } = useFinanceContext()
  const { scenarios, loadScenarios, saveScenario, deleteScenario } = useScenarios()
  const [scenarioName, setScenarioName] = useState('')
  const [adjustments, setAdjustments] = useState({})
  const [extraSavings, setExtraSavings] = useState(0)
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [expanded, setExpanded] = useState(true)

  const adjustedExpenses = expenses.map((e) => ({
    ...e,
    amount: adjustments[e.id] ?? e.amount,
  }))

  const origTotal = calcTotalExpenses(expenses)
  const simTotal = calcTotalExpenses(adjustedExpenses)
  const origFree = calcFreeBalance(plan, expenses)
  const simFree = calcFreeBalance(plan, adjustedExpenses) - extraSavings
  const origPct = calcCommittedPercent(plan, expenses)
  const simPct = calcCommittedPercent(plan, adjustedExpenses)

  const handleSave = async () => {
    if (!scenarioName) return
    setSaving(true)
    await saveScenario({
      scenario_name: scenarioName,
      adjusted_expenses: Object.entries(adjustments).map(([id, amount]) => ({ id, amount })),
      extra_savings: extraSavings,
      notes,
    })
    setScenarioName('')
    setAdjustments({})
    setExtraSavings(0)
    setNotes('')
    setSaving(false)
  }

  return (
    <div className="space-y-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full"
      >
        <h3 className="text-base font-semibold text-slate-200">🔮 Simulador "E se..."</h3>
        {expanded ? <ChevronUp size={18} className="text-slate-500" /> : <ChevronDown size={18} className="text-slate-500" />}
      </button>

      {expanded && (
        <div className="space-y-4 animate-fade-in">
          <p className="text-sm text-slate-400">
            Ajuste os valores abaixo para simular diferentes cenários sem afetar seu plano real.
          </p>

          {/* Ajuste de despesas */}
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {expenses.filter((e) => (parseFloat(e.amount) || 0) > 0).map((expense) => (
              <div key={expense.id} className="flex items-center gap-3">
                <span className="text-xs text-slate-400 flex-1 truncate">{expense.category}</span>
                <div className="w-36">
                  <CurrencyInput
                    value={adjustments[expense.id] ?? expense.amount}
                    onChange={(v) => setAdjustments((a) => ({ ...a, [expense.id]: v }))}
                    placeholder={formatCurrency(expense.amount)}
                  />
                </div>
              </div>
            ))}
          </div>

          <CurrencyInput
            label="Quanto a mais quero guardar por mês?"
            value={extraSavings}
            onChange={setExtraSavings}
          />

          {/* Resultado */}
          <div className="glass-card p-4 space-y-3 border-emerald-500/20">
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">Resultado da simulação</p>
            <SimResult
              label="Total de despesas"
              original={formatCurrency(origTotal)}
              simulated={formatCurrency(simTotal)}
              better={simTotal <= origTotal}
            />
            <SimResult
              label="Saldo livre"
              original={formatCurrency(origFree)}
              simulated={formatCurrency(simFree)}
              better={simFree >= origFree}
            />
            <SimResult
              label="% comprometida"
              original={formatPercent(origPct)}
              simulated={formatPercent(simPct)}
              better={simPct <= origPct}
            />
            {simFree > origFree && (
              <p className="text-xs text-emerald-400 bg-emerald-500/10 rounded-lg p-2">
                💚 Você economizaria {formatCurrency(simFree - origFree)} por mês com esses ajustes!
              </p>
            )}
          </div>

          {/* Salvar cenário */}
          <div className="space-y-2">
            <input
              className="input-field"
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
              placeholder="Nome do cenário (ex: Cortar delivery)"
            />
            <textarea
              className="input-field resize-none h-16 text-sm"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observações sobre esse cenário..."
            />
            <Button
              onClick={handleSave}
              loading={saving}
              disabled={!scenarioName}
              className="w-full"
              variant="outline"
            >
              <Save size={15} /> Salvar cenário
            </Button>
          </div>

          {/* Cenários salvos */}
          {scenarios.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Cenários salvos</p>
              {scenarios.map((sc) => (
                <div key={sc.id} className="flex items-center justify-between glass-card px-4 py-2.5">
                  <div>
                    <p className="text-sm font-medium text-slate-200">{sc.scenario_name}</p>
                    {sc.notes && <p className="text-xs text-slate-500">{sc.notes}</p>}
                  </div>
                  <button
                    onClick={() => deleteScenario(sc.id)}
                    className="text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
