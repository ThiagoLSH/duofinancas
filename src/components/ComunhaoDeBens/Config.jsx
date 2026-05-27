import { useState, useEffect, useRef } from 'react'
import { Save, User, Phone, Wallet, Link2, Bell, Monitor } from 'lucide-react'
import { CurrencyInput } from '../UI/CurrencyInput'
import { Toggle } from '../UI/Toggle'
import { Button } from '../UI/Button'
import { CardSkeleton } from '../UI/Skeleton'
import { formatCurrency } from '../../utils/formatters'
import { useAuthContext } from '../../context/AuthContext'

const WEBHOOK_URL = 'https://duofinancas.app.n8n.cloud/webhook/cb-ativacao'

// ─── Formatação de telefone ──────────────────────────────────────────────────
const formatPhoneDisplay = (raw) => {
  const digits = raw.replace(/\D/g, '').slice(0, 13)
  if (digits.length <= 2) return digits.length ? `+${digits}` : ''
  if (digits.length <= 4) return `+${digits.slice(0, 2)} (${digits.slice(2)}`
  if (digits.length <= 9) return `+${digits.slice(0, 2)} (${digits.slice(2, 4)}) ${digits.slice(4)}`
  return `+${digits.slice(0, 2)} (${digits.slice(2, 4)}) ${digits.slice(4, 9)}-${digits.slice(9)}`
}

const stripPhone = (display) => display.replace(/\D/g, '')

// ─── Validação ───────────────────────────────────────────────────────────────
const validate = (form) => {
  const errors = {}
  if (!form.nome.trim()) errors.nome = 'Nome obrigatório'
  const digits = stripPhone(form.telefoneDisplay)
  if (digits.length < 12 || digits.length > 13)
    errors.telefone = 'Informe DDD + número completo (ex: 5584999999999)'
  if (!form.renda || form.renda <= 0) errors.renda = 'Informe sua renda mensal'
  return errors
}

// ─── Componente ──────────────────────────────────────────────────────────────
export const Config = ({ config, loadingConfig, saving, saveConfig }) => {
  const { user, profile } = useAuthContext()

  const defaultNome =
    config?.nome ||
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    ''

  const [form, setForm] = useState({
    nome: defaultNome,
    telefoneDisplay: config?.telefone ? formatPhoneDisplay(config.telefone) : '',
    renda: config?.renda ?? 0,
    tipo_vinculo: config?.tipo_vinculo ?? 'Grupo de Oração',
    percentual: config?.percentual ?? 10,
    dia_lembrete: config?.dia_lembrete ?? 5,
    lembrete_whatsapp: config?.lembrete_whatsapp ?? false,
    lembrete_browser: config?.lembrete_browser ?? false,
  })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState(false)

  // Rastreia se o lembrete whatsapp estava ativo antes de salvar
  const prevWhatsapp = useRef(config?.lembrete_whatsapp ?? false)

  useEffect(() => {
    if (!config) return
    prevWhatsapp.current = config.lembrete_whatsapp ?? false
    setForm({
      nome: config.nome || defaultNome,
      telefoneDisplay: config.telefone ? formatPhoneDisplay(config.telefone) : '',
      renda: config.renda ?? 0,
      tipo_vinculo: config.tipo_vinculo ?? 'Grupo de Oração',
      percentual: config.percentual ?? 10,
      dia_lembrete: config.dia_lembrete ?? 5,
      lembrete_whatsapp: config.lembrete_whatsapp ?? false,
      lembrete_browser: config.lembrete_browser ?? false,
    })
  }, [config])

  const set = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }))
    if (touched) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const handleVinculo = (val) => {
    const percentual = val === 'Comunidade de Aliança' ? 15 : 10
    setForm((f) => ({ ...f, tipo_vinculo: val, percentual }))
  }

  const handlePhoneChange = (e) => {
    const display = formatPhoneDisplay(e.target.value)
    setForm((f) => ({ ...f, telefoneDisplay: display }))
    if (touched) setErrors((e) => ({ ...e, telefone: undefined }))
  }

  const handleBrowserToggle = async (val) => {
    if (val && typeof Notification !== 'undefined' && Notification.permission !== 'granted') {
      await Notification.requestPermission()
    }
    set('lembrete_browser', val)
  }

  // Dispara webhook de confirmação se o lembrete WhatsApp foi ativado
  const dispararConfirmacao = async (nome, telefone) => {
    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, telefone }),
      })
    } catch (_) {
      // Falha silenciosa — não bloqueia o salvamento
    }
  }

  const handleSave = async () => {
    setTouched(true)
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }

    const payload = {
      nome: form.nome.trim(),
      telefone: stripPhone(form.telefoneDisplay),
      renda: form.renda,
      tipo_vinculo: form.tipo_vinculo,
      percentual: form.percentual,
      dia_lembrete: form.dia_lembrete,
      lembrete_whatsapp: form.lembrete_whatsapp,
      lembrete_browser: form.lembrete_browser,
      ativo: true,
    }

    await saveConfig(payload)

    // Dispara confirmação WhatsApp apenas quando o lembrete é ativado pela primeira vez
    const foiAtivado = form.lembrete_whatsapp && !prevWhatsapp.current
    if (foiAtivado) {
      await dispararConfirmacao(payload.nome, payload.telefone)
    }

    prevWhatsapp.current = form.lembrete_whatsapp
  }

  // ─── Preview do valor calculado ───────────────────────────────────────────
  const base = form.renda || 0
  const valor = base * (form.percentual / 100)
  const isAlianca = form.tipo_vinculo === 'Comunidade de Aliança'

  if (loadingConfig) {
    return (
      <div className="space-y-3">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    )
  }

  return (
    <div className="glass-card p-5 space-y-6">
      <div>
        <h3 className="text-base font-semibold text-slate-200">⚙️ Configuração do lembrete N8N</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Esses dados alimentam o lembrete automático de WhatsApp via N8N
        </p>
      </div>

      {/* Dados pessoais */}
      <div className="space-y-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Dados pessoais</p>

        <div>
          <label className="label-text flex items-center gap-1.5">
            <User size={12} className="text-slate-500" /> Nome
          </label>
          <input
            className={`input-field ${errors.nome ? 'border-red-500 focus:ring-red-500' : ''}`}
            type="text"
            value={form.nome}
            onChange={(e) => set('nome', e.target.value)}
            placeholder="Seu nome completo"
          />
          {errors.nome && <p className="text-red-400 text-xs mt-1">{errors.nome}</p>}
        </div>

        <div>
          <label className="label-text flex items-center gap-1.5">
            <Phone size={12} className="text-slate-500" /> WhatsApp
          </label>
          <input
            className={`input-field ${errors.telefone ? 'border-red-500 focus:ring-red-500' : ''}`}
            type="tel"
            inputMode="numeric"
            value={form.telefoneDisplay}
            onChange={handlePhoneChange}
            placeholder="+55 (84) 99999-9999"
          />
          {errors.telefone
            ? <p className="text-red-400 text-xs mt-1">{errors.telefone}</p>
            : <p className="text-xs text-slate-600 mt-1">Formato salvo: {stripPhone(form.telefoneDisplay) || '—'}</p>
          }
        </div>
      </div>

      {/* Dados financeiros */}
      <div className="space-y-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Dados financeiros</p>

        <CurrencyInput
          label={<span className="flex items-center gap-1.5"><Wallet size={12} className="text-slate-500" /> Renda mensal</span>}
          value={form.renda}
          onChange={(v) => set('renda', v)}
          error={errors.renda}
        />

        <div>
          <label className="label-text flex items-center gap-1.5">
            <Link2 size={12} className="text-slate-500" /> Tipo de vínculo
          </label>
          <select
            className="input-field"
            value={form.tipo_vinculo}
            onChange={(e) => handleVinculo(e.target.value)}
          >
            <option value="Grupo de Oração">Grupo de Oração (10%)</option>
            <option value="Comunidade de Aliança">Comunidade de Aliança (15%)</option>
          </select>
        </div>

        {base > 0 && (
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-emerald-300">Valor mensal da CB</span>
              <span className="text-xl font-bold text-emerald-400">{formatCurrency(valor)}</span>
            </div>
            {isAlianca && (
              <div className="border-t border-emerald-500/20 pt-2 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">🕊️ 10% — Obra Shalom</span>
                  <span className="text-emerald-400 font-semibold">{formatCurrency(base * 0.10)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">🤝 5% — Necessitados</span>
                  <span className="text-yellow-400 font-semibold">{formatCurrency(base * 0.05)}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lembretes */}
      <div className="space-y-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Lembretes</p>

        <div>
          <label className="label-text flex items-center gap-1.5">
            <Bell size={12} className="text-slate-500" /> Dia do lembrete WhatsApp
          </label>
          <select
            className="input-field"
            value={form.dia_lembrete}
            onChange={(e) => set('dia_lembrete', parseInt(e.target.value))}
          >
            {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>Dia {d} de cada mês</option>
            ))}
          </select>
          <p className="text-xs text-slate-600 mt-1">
            O N8N enviará a mensagem no dia {form.dia_lembrete} de cada mês
          </p>
        </div>

        <Toggle
          checked={form.lembrete_whatsapp}
          onChange={(v) => set('lembrete_whatsapp', v)}
          label="Ativar lembrete por WhatsApp"
          description="O N8N envia mensagem no número cadastrado acima"
        />

        <Toggle
          checked={form.lembrete_browser}
          onChange={handleBrowserToggle}
          label="Ativar notificação no navegador"
          description={
            typeof Notification !== 'undefined' && Notification.permission === 'denied'
              ? 'Permissão negada — verifique as configurações do navegador'
              : 'Notificação local no dispositivo'
          }
        />
      </div>

      <Button onClick={handleSave} loading={saving} className="w-full justify-center">
        <Save size={15} />
        {config ? 'Atualizar configuração' : 'Salvar configuração'}
      </Button>
    </div>
  )
}