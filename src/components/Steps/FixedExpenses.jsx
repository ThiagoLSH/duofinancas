import { useState, useEffect } from 'react'
import { ChevronRight, ChevronLeft, Plus, Trash2, Save } from 'lucide-react'
import { Button } from '../UI/Button'
import { CurrencyInput } from '../UI/CurrencyInput'
import { useExpenses } from '../../hooks/useExpenses'
import { useFinanceContext } from '../../context/FinanceContext'
import { clsx } from 'clsx'

const FIXED_CATEGORIES = [
  { category: 'Aluguel/Financiamento', icon: '🏠' },
  { category: 'Energia elétrica', icon: '💡' },
  { category: 'Água', icon: '💧' },
  { category: 'Internet', icon: '📶' },
  { category: 'Celular', icon: '📱' },
  { category: 'Parcela veículo', icon: '🚗' },
  { category: 'Combustível/Transporte', icon: '⛽' },
  { category: 'Supermercado', icon: '🛒' },
  { category: 'Plano de saúde', icon: '🏥' },
  { category: 'Farmácia', icon: '💊' },
  { category: 'Educação', icon: '🎓' },
  { category: 'Empréstimo/Cartão', icon: '🏦' },
  { category: 'Pet', icon: '🐾' },
]

const OWNERSHIP_OPTIONS = [
  { value: 'shared', label: 'Compartilhada', color: 'emerald' },
  { value: 'person_1', label: 'Só minha', color: 'blue' },
  { value: 'person_2', label: 'Só dele/a', color: 'purple' },
]

const ExpenseRow = ({ expense, onChange, onRemove, isCouple }) => {
  return (
    <div className={clsx(
      'glass-card p-4 space-y-3',
      parseFloat(expense.amount) > 0 && 'border-emerald-500/20'
    )}>
      <div className="flex items-center gap-3">
        <span className="text-xl flex-shrink-0">{expense.icon}</span>
        <div className="flex-1 min-w-0">
          {expense.custom_label !== undefined ? (
            <input
              className="input-field text-sm"
              value={expense.custom_label}
              onChange={(e) => onChange('custom_label', e.target.value)}
              placeholder="Nome da despesa..."
            />
          ) : (
            <span className="text-sm font-medium text-slate-200">{expense.category}</span>
          )}
        </div>
        {expense.isCustom && (
          <button onClick={onRemove} className="text-slate-500 hover:text-red-400 transition-colors flex-shrink-0">
            <Trash2 size={16} />
          </button>
        )}
      </div>
      <CurrencyInput
        value={expense.amount}
        onChange={(v) => onChange('amount', v)}
        placeholder="R$ 0,00"
      />
      {isCouple && (
        <div className="flex gap-1.5">
          {OWNERSHIP_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange('ownership', opt.value)}
              className={clsx(
                'flex-1 py-1 px-2 rounded-lg text-xs font-medium border transition-all',
                expense.ownership === opt.value
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-800 border-slate-700 text-slate-500 hover:border-slate-600'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export const FixedExpenses = ({ tabMode = false }) => {
  const { expenses, loadExpenses, saveExpenses } = useExpenses()
  const { plan, setStep, showToast } = useFinanceContext()
  const [rows, setRows] = useState([])
  const [saving, setSaving] = useState(false)
  const isCouple = plan?.plan_type === 'couple'

  useEffect(() => {
    loadExpenses().then((loaded) => {
      const fixedLoaded = loaded.filter((e) => e.expense_type === 'fixed')
      if (fixedLoaded.length > 0) {
        setRows(fixedLoaded)
      } else {
        setRows(
          FIXED_CATEGORIES.map((c) => ({
            ...c,
            amount: 0,
            expense_type: 'fixed',
            ownership: 'shared',
            id: `new-${c.category}`,
          }))
        )
      }
    })
  }, [plan?.id])

  const updateRow = (idx, field, value) => {
    setRows((prev) => prev.map((r, i) => i === idx ? { ...r, [field]: value } : r))
  }

  const addCustom = () => {
    setRows((prev) => [
      ...prev,
      {
        category: 'Personalizada',
        custom_label: '',
        icon: '➕',
        amount: 0,
        expense_type: 'fixed',
        ownership: 'shared',
        isCustom: true,
        id: `custom-${Date.now()}`,
      },
    ])
  }

  const removeRow = (idx) => {
    setRows((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSave = async () => {
    setSaving(true)
    const valid = rows.map((r) => ({
      category: r.custom_label || r.category,
      custom_label: r.custom_label || null,
      expense_type: 'fixed',
      amount: parseFloat(r.amount) || 0,
      ownership: r.ownership || 'shared',
      icon: r.icon || '📌',
    }))
    // Only save rows with value > 0 or all (keep zeros for reference)
    await saveExpenses([
      ...valid,
      ...expenses.filter((e) => e.expense_type === 'variable'),
    ])
    setSaving(false)
    if (tabMode) {
      showToast('Despesas fixas salvas!')
    } else {
      setStep(3)
    }
  }

  const totalFixed = rows.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0)

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Despesas fixas</h2>
          <p className="text-slate-400 mt-1">Gastos mensais recorrentes e previsíveis</p>
        </div>
        {totalFixed > 0 && (
          <div className="text-right">
            <p className="text-xs text-slate-500">Total</p>
            <p className="text-emerald-400 font-bold text-lg">
              {totalFixed.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
        )}
      </div>

      {isCouple && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-sm text-blue-300">
          💡 Para cada despesa, defina se é compartilhada, sua ou do(a) parceiro(a)
        </div>
      )}

      <div className="space-y-3">
        {rows.map((row, idx) => (
          <ExpenseRow
            key={row.id || idx}
            expense={row}
            onChange={(field, value) => updateRow(idx, field, value)}
            onRemove={() => removeRow(idx)}
            isCouple={isCouple}
          />
        ))}
      </div>

      <Button variant="outline" onClick={addCustom} className="w-full">
        <Plus size={16} /> Adicionar despesa personalizada
      </Button>

      {tabMode ? (
        <div className="flex justify-end pt-2">
          <Button onClick={handleSave} loading={saving}>
            <Save size={16} /> Salvar alterações
          </Button>
        </div>
      ) : (
        <div className="flex justify-between pt-2">
          <Button variant="ghost" onClick={() => setStep(1)}>
            <ChevronLeft size={18} /> Voltar
          </Button>
          <Button onClick={handleSave} loading={saving}>
            Próximo <ChevronRight size={18} />
          </Button>
        </div>
      )}
    </div>
  )
}
