import { useState, useEffect } from 'react'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { Button } from '../UI/Button'
import { CurrencyInput } from '../UI/CurrencyInput'
import { Toggle } from '../UI/Toggle'
import { usePlan } from '../../hooks/usePlan'
import { useFinanceContext } from '../../context/FinanceContext'
import { useAuthContext } from '../../context/AuthContext'
import { GOAL_LABELS, TIMEFRAME_LABELS } from '../../utils/formatters'
import { clsx } from 'clsx'

const SectionTitle = ({ children, emoji }) => (
  <div className="flex items-center gap-2 mb-4">
    <span className="text-xl">{emoji}</span>
    <h3 className="text-base font-semibold text-slate-200">{children}</h3>
  </div>
)

const PersonForm = ({ data, onChange, prefix = '', title, emoji }) => (
  <div className="glass-card p-5 space-y-4">
    <SectionTitle emoji={emoji}>{title}</SectionTitle>
    <div className="grid sm:grid-cols-2 gap-4">
      <div>
        <label className="label-text">Nome</label>
        <input
          className="input-field"
          value={data[`${prefix}full_name`] || ''}
          onChange={(e) => onChange(`${prefix}full_name`, e.target.value)}
          placeholder="Seu nome"
        />
      </div>
      <div>
        <label className="label-text">Idade</label>
        <input
          type="number"
          className="input-field"
          value={data[`${prefix}age`] || ''}
          onChange={(e) => onChange(`${prefix}age`, parseInt(e.target.value) || '')}
          placeholder="30"
          min="16"
          max="99"
        />
      </div>
      <div className="sm:col-span-2">
        <label className="label-text">Profissão</label>
        <input
          className="input-field"
          value={data[`${prefix}occupation`] || ''}
          onChange={(e) => onChange(`${prefix}occupation`, e.target.value)}
          placeholder="Ex: Analista, Professor, Autônomo..."
        />
      </div>
    </div>
    <CurrencyInput
      label="Renda líquida mensal"
      value={data[`${prefix}monthly_income`] || 0}
      onChange={(v) => onChange(`${prefix}monthly_income`, v)}
    />
    <Toggle
      label="Tem renda extra?"
      description="Freelance, aluguel, dividendos, etc."
      checked={data[`${prefix}has_extra_income`] || false}
      onChange={(v) => onChange(`${prefix}has_extra_income`, v)}
    />
    {data[`${prefix}has_extra_income`] && (
      <div className="pl-4 border-l-2 border-emerald-500/30 space-y-3 animate-fade-in">
        <CurrencyInput
          label="Valor da renda extra (mensal)"
          value={data[`${prefix}extra_income_value`] || 0}
          onChange={(v) => onChange(`${prefix}extra_income_value`, v)}
        />
        <div>
          <label className="label-text">Descrição da renda extra</label>
          <input
            className="input-field"
            value={data[`${prefix}extra_income_description`] || ''}
            onChange={(e) => onChange(`${prefix}extra_income_description`, e.target.value)}
            placeholder="Ex: Freelance de design"
          />
        </div>
      </div>
    )}
    <Toggle
      label="Tem reserva de emergência?"
      checked={data[`${prefix}has_emergency_fund`] || false}
      onChange={(v) => onChange(`${prefix}has_emergency_fund`, v)}
    />
    {data[`${prefix}has_emergency_fund`] && (
      <div className="pl-4 border-l-2 border-emerald-500/30 animate-fade-in">
        <CurrencyInput
          label="Valor da reserva atual"
          value={data[`${prefix}emergency_fund_value`] || 0}
          onChange={(v) => onChange(`${prefix}emergency_fund_value`, v)}
        />
      </div>
    )}
    <Toggle
      label="Tem dívidas em atraso?"
      description="Cartão, cheque especial, empréstimo atrasado"
      checked={data[`${prefix}has_overdue_debts`] || false}
      onChange={(v) => onChange(`${prefix}has_overdue_debts`, v)}
    />
  </div>
)

export const Anamnesis = () => {
  const { plan, savePlan } = usePlan()
  const { setStep } = useFinanceContext()
  const { profile } = useAuthContext()
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const isCouple = plan?.plan_type === 'couple'

  useEffect(() => {
    if (plan) {
      setForm({
        full_name: profile?.full_name || '',
        age: profile?.age || '',
        occupation: profile?.occupation || '',
        monthly_income: plan.monthly_income || 0,
        has_extra_income: plan.has_extra_income || false,
        extra_income_value: plan.extra_income_value || 0,
        extra_income_description: plan.extra_income_description || '',
        has_emergency_fund: plan.has_emergency_fund || false,
        emergency_fund_value: plan.emergency_fund_value || 0,
        has_overdue_debts: plan.has_overdue_debts || false,
        main_goal: plan.main_goal || '',
        goal_target_value: plan.goal_target_value || 0,
        goal_timeframe: plan.goal_timeframe || '',
        goal_custom_description: plan.goal_custom_description || '',
        // couple fields
        partner_name: plan.partner_name || '',
        partner_age: plan.partner_age || '',
        partner_occupation: plan.partner_occupation || '',
        partner_monthly_income: plan.partner_monthly_income || 0,
        partner_has_extra_income: plan.partner_has_extra_income || false,
        partner_extra_income_value: plan.partner_extra_income_value || 0,
        partner_extra_income_description: plan.partner_extra_income_description || '',
        partner_has_emergency_fund: plan.partner_has_emergency_fund || false,
        partner_emergency_fund_value: plan.partner_emergency_fund_value || 0,
        partner_has_overdue_debts: plan.partner_has_overdue_debts || false,
        unified_finances: plan.unified_finances || 'parcialmente',
        shared_expense_percentage: plan.shared_expense_percentage ?? 50,
        couple_goal: plan.couple_goal || '',
      })
    }
  }, [plan, profile])

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const handleSave = async () => {
    setSaving(true)
    await savePlan({
      monthly_income: form.monthly_income,
      has_extra_income: form.has_extra_income,
      extra_income_value: form.extra_income_value,
      extra_income_description: form.extra_income_description,
      has_emergency_fund: form.has_emergency_fund,
      emergency_fund_value: form.emergency_fund_value,
      has_overdue_debts: form.has_overdue_debts,
      main_goal: form.main_goal || null,
      goal_target_value: form.goal_target_value,
      goal_timeframe: form.goal_timeframe || null,
      goal_custom_description: form.goal_custom_description,
      partner_name: form.partner_name,
      partner_age: form.partner_age || null,
      partner_occupation: form.partner_occupation,
      partner_monthly_income: form.partner_monthly_income,
      partner_has_extra_income: form.partner_has_extra_income,
      partner_extra_income_value: form.partner_extra_income_value,
      partner_has_emergency_fund: form.partner_has_emergency_fund,
      partner_emergency_fund_value: form.partner_emergency_fund_value,
      partner_has_overdue_debts: form.partner_has_overdue_debts,
      unified_finances: form.unified_finances,
      shared_expense_percentage: form.shared_expense_percentage,
      couple_goal: form.couple_goal,
    })
    setSaving(false)
    setStep(2)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-white">Dados financeiros</h2>
        <p className="text-slate-400 mt-1">Essas informações ajudam a montar seu plano personalizado</p>
      </div>

      {/* Person 1 */}
      <PersonForm
        data={form}
        onChange={setField}
        prefix=""
        title={isCouple ? 'Pessoa 1 (Você)' : 'Suas informações'}
        emoji={isCouple ? '👤' : '👤'}
      />

      {/* Person 2 — casal */}
      {isCouple && (
        <PersonForm
          data={form}
          onChange={setField}
          prefix="partner_"
          title="Pessoa 2 (Parceiro/a)"
          emoji="👤"
        />
      )}

      {/* Couple config */}
      {isCouple && (
        <div className="glass-card p-5 space-y-4">
          <SectionTitle emoji="💑">Configurações do casal</SectionTitle>
          <div>
            <label className="label-text">Como vocês administram as finanças?</label>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {[
                { value: 'sim', label: '100% juntos' },
                { value: 'parcialmente', label: 'Parcialmente' },
                { value: 'nao', label: 'Separados' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setField('unified_finances', opt.value)}
                  className={clsx(
                    'py-2 px-3 rounded-xl text-sm font-medium border transition-all',
                    form.unified_finances === opt.value
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          {form.unified_finances !== 'nao' && (
            <div>
              <label className="label-text">% das despesas comuns pagas por você</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={form.shared_expense_percentage ?? 50}
                  onChange={(e) => setField('shared_expense_percentage', Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-emerald-400 font-bold w-12 text-right">{form.shared_expense_percentage ?? 50}%</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>Você: {form.shared_expense_percentage ?? 50}%</span>
                <span>Parceiro(a): {100 - (form.shared_expense_percentage ?? 50)}%</span>
              </div>
            </div>
          )}
          <div>
            <label className="label-text">Objetivo financeiro do casal</label>
            <input
              className="input-field"
              value={form.couple_goal || ''}
              onChange={(e) => setField('couple_goal', e.target.value)}
              placeholder="Ex: Comprar uma casa, Fazer intercâmbio juntos..."
            />
          </div>
        </div>
      )}

      {/* Goals */}
      <div className="glass-card p-5 space-y-4">
        <SectionTitle emoji="🎯">Objetivo financeiro principal</SectionTitle>
        <div className="grid sm:grid-cols-2 gap-2">
          {Object.entries(GOAL_LABELS).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setField('main_goal', value)}
              className={clsx(
                'py-2.5 px-4 rounded-xl text-sm font-medium border text-left transition-all',
                form.main_goal === value
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
              )}
            >
              {label}
            </button>
          ))}
        </div>
        {form.main_goal === 'outro' && (
          <input
            className="input-field"
            value={form.goal_custom_description || ''}
            onChange={(e) => setField('goal_custom_description', e.target.value)}
            placeholder="Descreva seu objetivo..."
          />
        )}
        {form.main_goal && (
          <div className="grid sm:grid-cols-2 gap-4 animate-fade-in">
            <CurrencyInput
              label="Valor da meta (R$)"
              value={form.goal_target_value || 0}
              onChange={(v) => setField('goal_target_value', v)}
            />
            <div>
              <label className="label-text">Prazo</label>
              <select
                className="input-field"
                value={form.goal_timeframe || ''}
                onChange={(e) => setField('goal_timeframe', e.target.value)}
              >
                <option value="">Selecione...</option>
                {Object.entries(TIMEFRAME_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-2">
        <Button variant="ghost" onClick={() => setStep(0)}>
          <ChevronLeft size={18} /> Voltar
        </Button>
        <Button onClick={handleSave} loading={saving}>
          Próximo <ChevronRight size={18} />
        </Button>
      </div>
    </div>
  )
}
