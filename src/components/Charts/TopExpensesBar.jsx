import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { formatCurrency } from '../../utils/formatters'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-card px-3 py-2 text-sm border border-slate-600">
      <p className="text-slate-300 font-medium">{label}</p>
      <p className="text-emerald-400 font-bold">{formatCurrency(payload[0].value)}</p>
    </div>
  )
}

export const TopExpensesBar = ({ data }) => {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-500 text-sm">
        Nenhuma despesa registrada
      </div>
    )
  }

  const truncated = data.map((d) => ({
    ...d,
    shortName: d.name.length > 14 ? d.name.slice(0, 14) + '…' : d.name,
  }))

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={truncated} layout="vertical" margin={{ left: 8, right: 16, top: 4, bottom: 4 }}>
        <XAxis
          type="number"
          tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
          tick={{ fill: '#64748b', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="shortName"
          width={100}
          tick={{ fill: '#94a3b8', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
        <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={14}>
          {truncated.map((_, i) => (
            <Cell
              key={i}
              fill={i === 0 ? '#10B981' : i === 1 ? '#34D399' : '#1E3A2F'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
