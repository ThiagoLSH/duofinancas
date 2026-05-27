import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '../../utils/formatters'

const COLORS = [
  '#10B981', '#F59E0B', '#3B82F6', '#8B5CF6', '#EF4444',
  '#06B6D4', '#F97316', '#EC4899', '#84CC16', '#6366F1',
  '#14B8A6', '#FB923C', '#A855F7', '#22C55E', '#EAB308',
]

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="glass-card px-3 py-2 text-sm border border-slate-600 shadow-xl">
      <p className="text-slate-200 font-semibold">{d.name}</p>
      <p className="text-emerald-400 font-bold">{formatCurrency(d.value)}</p>
      <p className="text-slate-400">{d.payload.pct?.toFixed(1)}%</p>
    </div>
  )
}

export const ExpenseDonut = ({ data }) => {
  const total = data.reduce((s, d) => s + d.value, 0)
  const enriched = data
    .map((d) => ({ ...d, pct: total > 0 ? (d.value / total) * 100 : 0 }))
    .sort((a, b) => b.value - a.value)

  if (!data.length || total === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-500 text-sm">
        Nenhuma despesa registrada
      </div>
    )
  }

  const TOP_N = 6
  const top = enriched.slice(0, TOP_N)
  const rest = enriched.slice(TOP_N)
  const legendItems = rest.length > 0
    ? [...top, {
        name: `+${rest.length} outros`,
        value: rest.reduce((s, d) => s + d.value, 0),
        pct: rest.reduce((s, d) => s + d.pct, 0),
        colorIdx: TOP_N,
      }]
    : top.map((item, i) => ({ ...item, colorIdx: i }))

  return (
    <div className="flex flex-col gap-5">
      {/* Donut with center label overlay */}
      <div className="relative" style={{ height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={enriched}
              cx="50%"
              cy="50%"
              innerRadius={62}
              outerRadius={88}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {enriched.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} cursor={false} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center text overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] text-slate-500 uppercase tracking-wide">Total</span>
          <span className="text-sm font-bold text-slate-100 mt-0.5">{formatCurrency(total)}</span>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2">
        {legendItems.map((item, i) => (
          <div key={item.name} className="flex items-center gap-2.5">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: COLORS[(item.colorIdx ?? i) % COLORS.length] }}
            />
            <span className="text-xs text-slate-400 flex-1 truncate min-w-0">{item.name}</span>
            <span className="text-xs font-medium text-slate-300 tabular-nums">{formatCurrency(item.value)}</span>
            <span className="text-xs text-slate-500 tabular-nums w-9 text-right">{item.pct.toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
