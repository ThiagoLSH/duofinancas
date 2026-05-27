import { clsx } from 'clsx'

export const Card = ({ children, className, glass = true, ...props }) => {
  return (
    <div
      className={clsx(
        'rounded-2xl border',
        glass
          ? 'bg-slate-800/60 backdrop-blur-sm border-slate-700/50'
          : 'bg-slate-800 border-slate-700',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export const CardHeader = ({ children, className }) => (
  <div className={clsx('px-6 py-4 border-b border-slate-700/50', className)}>
    {children}
  </div>
)

export const CardBody = ({ children, className }) => (
  <div className={clsx('px-6 py-5', className)}>
    {children}
  </div>
)

export const KPICard = ({ label, value, icon, trend, color = 'emerald', className }) => {
  const colors = {
    emerald: 'text-emerald-400',
    red: 'text-red-400',
    yellow: 'text-yellow-400',
    blue: 'text-blue-400',
    slate: 'text-slate-400',
  }
  return (
    <div className={clsx('glass-card p-5', className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-400 text-sm font-medium">{label}</span>
        {icon && <span className="text-xl">{icon}</span>}
      </div>
      <div className={clsx('text-2xl font-bold', colors[color])}>{value}</div>
      {trend && <div className="text-xs text-slate-500 mt-1">{trend}</div>}
    </div>
  )
}
