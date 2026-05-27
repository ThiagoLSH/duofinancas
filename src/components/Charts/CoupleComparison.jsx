import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { formatCurrency } from '../../utils/formatters'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-card px-3 py-2 text-sm border border-slate-600 space-y-1">
      <p className="text-slate-300 font-medium">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.fill }} className="font-bold">
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  )
}

export const CoupleComparison = ({ data }) => {
  if (!data?.length) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-500 text-sm">
        Dados insuficientes para comparação
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ left: 8, right: 8, top: 4, bottom: 4 }}>
        <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis
          tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
          tick={{ fill: '#64748b', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
        <Legend formatter={(v) => <span className="text-slate-400 text-xs">{v}</span>} />
        <Bar dataKey="Pessoa 1" fill="#10B981" radius={[4, 4, 0, 0]} barSize={28} />
        <Bar dataKey="Pessoa 2" fill="#6EE7B7" radius={[4, 4, 0, 0]} barSize={28} />
      </BarChart>
    </ResponsiveContainer>
  )
}
