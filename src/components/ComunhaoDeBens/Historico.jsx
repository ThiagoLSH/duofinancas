import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts'
import { clsx } from 'clsx'
import { Button } from '../UI/Button'
import { Modal } from '../UI/Modal'
import { CurrencyInput } from '../UI/CurrencyInput'
import { Skeleton } from '../UI/Skeleton'
import { formatCurrency } from '../../utils/formatters'
import { useAuthContext } from '../../context/AuthContext'

const WEBHOOK_RECEBIMENTO = 'https://duofinancas.app.n8n.cloud/webhook/cb-recebimento'

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

const FORMAS = ['PIX', 'Urna', 'Transferência', 'App', 'Outro']

const mesReferenciaAtual = () => new Date().toISOString().slice(0, 7)

const emptyForm = () => {
  return {
    mes_referencia: mesReferenciaAtual(),
    valor_renda: 0,
    percentual_aplicado: 10,
    valor_devolvido: 0,
    status: 'devolvido',
    forma_devolucao: 'PIX',
  }
}

const mesRefToLabel = (ref) => {
  const [y, m] = ref.split('-').map(Number)
  return `${MESES[m - 1]} ${y}`
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-card px-3 py-2 text-xs border border-slate-600 shadow-xl">
      <p className="text-slate-400">{label}</p>
      <p className="text-emerald-400 font-bold">{formatCurrency(payload[0].value)}</p>
    </div>
  )
}

const computeStreak = (historico) => {
  const devolvidos = [...historico]
    .filter((r) => r.status === 'devolvido')
    .sort((a, b) => b.mes_referencia.localeCompare(a.mes_referencia))

  if (devolvidos.length === 0) return 0

  let streak = 0
  let [expectY, expectM] = devolvidos[0].mes_referencia.split('-').map(Number)

  for (const r of devolvidos) {
    const [y, m] = r.mes_referencia.split('-').map(Number)
    if (y === expectY && m === expectM) {
      streak++
      if (expectM === 1) { expectM = 12; expectY-- }
      else { expectM-- }
    } else {
      break
    }
  }

  return streak
}

// Dispara webhook de confirmação de recebimento
const notificarRecebimento = async ({ nome, telefone, tipo_vinculo, valor_devolvido, percentual_aplicado }) => {
  try {
    const isAlianca = tipo_vinculo === 'comunidade_alianca' || percentual_aplicado === 15

    const payload = {
      nome,
      telefone,
      tipo_vinculo: isAlianca ? 'comunidade_alianca' : 'obra',
      valor_10: isAlianca
        ? parseFloat((valor_devolvido * (10 / 15)).toFixed(2))
        : valor_devolvido,
      ...(isAlianca && {
        valor_5: parseFloat((valor_devolvido * (5 / 15)).toFixed(2)),
      }),
    }

    await fetch(WEBHOOK_RECEBIMENTO, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch (_) {
    // Falha silenciosa — não bloqueia o salvamento
  }
}

export const Historico = ({ historico, loadingHistorico, saving, addDevolucao, deleteDevolucao, config }) => {
  const { user, profile } = useAuthContext()
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm())

  const anoAtual = new Date().getFullYear()
  const registrosAno = historico.filter((r) => r.mes_referencia?.startsWith(String(anoAtual)))
  const totalAno = registrosAno.reduce((s, r) => s + (r.valor_devolvido || 0), 0)
  const mediaMenusal = registrosAno.length > 0 ? totalAno / registrosAno.length : 0
  const consecutivos = computeStreak(historico)

  const chartData = MESES.map((nome, idx) => {
    const ref = `${anoAtual}-${String(idx + 1).padStart(2, '0')}`
    const reg = registrosAno.find((r) => r.mes_referencia === ref)
    return { nome: nome.slice(0, 3), valor: reg?.valor_devolvido || 0 }
  })

  const handleAdd = async () => {
    await addDevolucao(form)

    // Dispara notificação WhatsApp só quando status = devolvido e tem telefone
    const telefone = config?.telefone || ''
    const nome = config?.nome || profile?.full_name || user?.user_metadata?.full_name || ''

    if (form.status === 'devolvido' && telefone && form.valor_devolvido > 0) {
      await notificarRecebimento({
        nome,
        telefone,
        tipo_vinculo: config?.tipo_vinculo || '',
        valor_devolvido: form.valor_devolvido,
        percentual_aplicado: form.percentual_aplicado,
      })
    }

    setModalOpen(false)
    setForm(emptyForm())
  }

  if (loadingHistorico) {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="glass-card p-4">
              <Skeleton className="h-3 w-2/3 mb-2" />
              <Skeleton className="h-5 w-1/2" />
            </div>
          ))}
        </div>
        <div className="glass-card p-5 space-y-2">
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card p-4 text-center">
          <p className="text-xs text-slate-500 mb-1">Total {anoAtual}</p>
          <p className="text-emerald-400 font-bold text-base leading-tight">{formatCurrency(totalAno)}</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-xs text-slate-500 mb-1">Média mensal</p>
          <p className="text-slate-200 font-bold text-base leading-tight">{formatCurrency(mediaMenusal)}</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-xs text-slate-500 mb-1">Fidelidade</p>
          <p className="text-yellow-400 font-bold text-base leading-tight">
            {consecutivos} {consecutivos === 1 ? 'mês' : 'meses'}
          </p>
        </div>
      </div>

      {/* Gráfico */}
      {totalAno > 0 && (
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Evolução mensal — {anoAtual}</h3>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={chartData} barSize={16} barCategoryGap="30%">
              <XAxis
                dataKey="nome"
                tick={{ fill: '#64748b', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="valor" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.valor > 0 ? '#10B981' : '#1e293b'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Lista */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-200">Registros</h3>
          <Button size="sm" onClick={() => setModalOpen(true)}>
            <Plus size={14} /> Adicionar
          </Button>
        </div>

        {historico.length === 0 && (
          <div className="glass-card p-8 text-center">
            <p className="text-2xl mb-2">🙏</p>
            <p className="text-sm text-slate-400">Nenhum registro ainda.</p>
            <p className="text-xs text-slate-500 mt-1">Adicione sua primeira devolução!</p>
          </div>
        )}

        {historico.map((r) => (
          <div key={r.id} className="glass-card p-4 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-slate-200">
                  {mesRefToLabel(r.mes_referencia)}
                </span>
                <span className={clsx(
                  'text-xs px-2 py-0.5 rounded-full font-medium',
                  r.status === 'devolvido'
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : 'bg-yellow-500/15 text-yellow-400'
                )}>
                  {r.status === 'devolvido' ? '✓ Devolvido' : '⏳ Pendente'}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-xs text-slate-500">{r.percentual_aplicado}%</span>
                {r.forma_devolucao && (
                  <>
                    <span className="text-slate-700">·</span>
                    <span className="text-xs text-slate-500">{r.forma_devolucao}</span>
                  </>
                )}
                {r.valor_renda > 0 && (
                  <>
                    <span className="text-slate-700">·</span>
                    <span className="text-xs text-slate-500">Renda: {formatCurrency(r.valor_renda)}</span>
                  </>
                )}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-emerald-400 font-bold text-sm">{formatCurrency(r.valor_devolvido)}</p>
            </div>
            <button
              onClick={() => deleteDevolucao(r.id)}
              className="text-slate-600 hover:text-red-400 transition-colors p-1 flex-shrink-0"
              aria-label="Remover registro"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Modal de adição */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Registrar devolução">
        <div className="space-y-4">
          <div>
            <label className="label-text">Mês de referência</label>
            <input
              className="input-field"
              type="month"
              value={form.mes_referencia}
              onChange={(e) => setForm((f) => ({ ...f, mes_referencia: e.target.value }))}
            />
          </div>

          <CurrencyInput
            label="Renda do mês"
            value={form.valor_renda}
            onChange={(v) => setForm((f) => ({ ...f, valor_renda: v }))}
          />

          <div>
            <label className="label-text">Percentual aplicado</label>
            <select
              className="input-field"
              value={form.percentual_aplicado}
              onChange={(e) => setForm((f) => ({ ...f, percentual_aplicado: parseInt(e.target.value) }))}
            >
              <option value={10}>10% — Grupo de Oração</option>
              <option value={15}>15% — Comunidade de Aliança</option>
            </select>
          </div>

          <CurrencyInput
            label="Valor devolvido"
            value={form.valor_devolvido}
            onChange={(v) => setForm((f) => ({ ...f, valor_devolvido: v }))}
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-text">Status</label>
              <select
                className="input-field"
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              >
                <option value="devolvido">Devolvido</option>
                <option value="pendente">Pendente</option>
              </select>
            </div>
            <div>
              <label className="label-text">Forma</label>
              <select
                className="input-field"
                value={form.forma_devolucao}
                onChange={(e) => setForm((f) => ({ ...f, forma_devolucao: e.target.value }))}
              >
                {FORMAS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>

          {form.status === 'devolvido' && config?.telefone && (
            <div className="flex items-center gap-2 bg-emerald-500/8 border border-emerald-500/20 rounded-lg px-3 py-2">
              <span className="text-emerald-400 text-xs">💬</span>
              <p className="text-xs text-emerald-300">
                Uma confirmação será enviada via WhatsApp ao salvar.
              </p>
            </div>
          )}

          <Button onClick={handleAdd} loading={saving} className="w-full justify-center">
            Salvar registro
          </Button>
        </div>
      </Modal>
    </div>
  )
}