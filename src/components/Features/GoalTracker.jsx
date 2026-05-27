import { useState, useEffect } from 'react'
import { Plus, Trash2, CheckCircle, PauseCircle, Target } from 'lucide-react'
import { Button } from '../UI/Button'
import { CurrencyInput } from '../UI/CurrencyInput'
import { Modal } from '../UI/Modal'
import { useGoals } from '../../hooks/useGoals'
import { useFinanceContext } from '../../context/FinanceContext'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { clsx } from 'clsx'

const GoalCard = ({ goal, onUpdate, onDelete }) => {
  const pct = goal.target_value > 0
    ? Math.min(100, (goal.current_value / goal.target_value) * 100)
    : 0

  const statusColors = {
    active: 'text-emerald-400',
    paused: 'text-yellow-400',
    completed: 'text-blue-400',
  }

  return (
    <div className={clsx(
      'glass-card p-4 space-y-3',
      goal.status === 'completed' && 'opacity-75'
    )}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Target size={16} className={statusColors[goal.status]} />
          <span className="text-sm font-semibold text-slate-200 truncate">{goal.title}</span>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {goal.status === 'active' && (
            <button
              onClick={() => onUpdate(goal.id, { status: 'completed' })}
              className="p-1 text-slate-500 hover:text-emerald-400 transition-colors"
              title="Marcar como concluída"
            >
              <CheckCircle size={15} />
            </button>
          )}
          {goal.status === 'active' && (
            <button
              onClick={() => onUpdate(goal.id, { status: 'paused' })}
              className="p-1 text-slate-500 hover:text-yellow-400 transition-colors"
              title="Pausar"
            >
              <PauseCircle size={15} />
            </button>
          )}
          {goal.status !== 'active' && (
            <button
              onClick={() => onUpdate(goal.id, { status: 'active' })}
              className="p-1 text-slate-500 hover:text-emerald-400 transition-colors text-xs"
              title="Reativar"
            >
              ▶
            </button>
          )}
          <button
            onClick={() => onDelete(goal.id)}
            className="p-1 text-slate-500 hover:text-red-400 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-1.5">
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={clsx(
              'h-full rounded-full transition-all duration-500',
              goal.status === 'completed' ? 'bg-blue-400' :
              goal.status === 'paused' ? 'bg-yellow-400' : 'bg-emerald-500'
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-500">
          <span>{formatCurrency(goal.current_value)} guardado</span>
          <span className="font-medium">{pct.toFixed(0)}%</span>
          <span>{formatCurrency(goal.target_value)} meta</span>
        </div>
      </div>

      {/* Update current value */}
      {goal.status === 'active' && (
        <CurrencyInput
          value={goal.current_value}
          onChange={(v) => onUpdate(goal.id, { current_value: v })}
          placeholder="Quanto já guardou?"
        />
      )}

      {goal.deadline && (
        <p className="text-xs text-slate-600">
          Prazo: {formatDate(goal.deadline)}
        </p>
      )}
    </div>
  )
}

const NewGoalForm = ({ onSave, onClose }) => {
  const [form, setForm] = useState({ title: '', target_value: 0, current_value: 0, deadline: '', priority: 1 })

  const handleSave = () => {
    if (!form.title || !form.target_value) return
    onSave(form)
    onClose()
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="label-text">Nome da meta</label>
        <input
          className="input-field"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          placeholder="Ex: Fundo de emergência, Viagem..."
        />
      </div>
      <CurrencyInput
        label="Valor da meta"
        value={form.target_value}
        onChange={(v) => setForm((f) => ({ ...f, target_value: v }))}
      />
      <CurrencyInput
        label="Quanto já tem guardado?"
        value={form.current_value}
        onChange={(v) => setForm((f) => ({ ...f, current_value: v }))}
      />
      <div>
        <label className="label-text">Prazo (opcional)</label>
        <input
          type="date"
          className="input-field"
          value={form.deadline}
          onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
        />
      </div>
      <div className="flex gap-3 pt-2">
        <Button variant="secondary" onClick={onClose} className="flex-1">Cancelar</Button>
        <Button onClick={handleSave} className="flex-1" disabled={!form.title || !form.target_value}>
          Criar meta
        </Button>
      </div>
    </div>
  )
}

export const GoalTracker = () => {
  const { plan } = useFinanceContext()
  const { goals, loadGoals, createGoal, updateGoal, deleteGoal } = useGoals()
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (plan) loadGoals()
  }, [plan?.id])

  const active = goals.filter((g) => g.status === 'active')
  const done = goals.filter((g) => g.status === 'completed')

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-200">🎯 Minhas metas</h3>
        <Button size="sm" onClick={() => setShowModal(true)}>
          <Plus size={15} /> Nova meta
        </Button>
      </div>

      {goals.length === 0 ? (
        <div className="glass-card p-8 text-center space-y-2">
          <div className="text-4xl">🎯</div>
          <p className="text-slate-400 text-sm">Nenhuma meta criada ainda</p>
          <p className="text-slate-600 text-xs">Crie metas para acompanhar seu progresso</p>
        </div>
      ) : (
        <div className="space-y-3">
          {active.map((g) => (
            <GoalCard key={g.id} goal={g} onUpdate={updateGoal} onDelete={deleteGoal} />
          ))}
          {done.length > 0 && (
            <>
              <p className="text-xs text-slate-600 font-medium uppercase tracking-wide">Concluídas</p>
              {done.map((g) => (
                <GoalCard key={g.id} goal={g} onUpdate={updateGoal} onDelete={deleteGoal} />
              ))}
            </>
          )}
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Nova meta financeira">
        <NewGoalForm onSave={createGoal} onClose={() => setShowModal(false)} />
      </Modal>
    </div>
  )
}
