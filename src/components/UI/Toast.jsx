import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react'
import { clsx } from 'clsx'
import { useFinanceContext } from '../../context/FinanceContext'

const icons = {
  success: <CheckCircle size={18} className="text-emerald-400" />,
  warning: <AlertTriangle size={18} className="text-yellow-400" />,
  error: <XCircle size={18} className="text-red-400" />,
  info: <Info size={18} className="text-blue-400" />,
}

const colors = {
  success: 'border-emerald-500/30 bg-slate-800',
  warning: 'border-yellow-500/30 bg-slate-800',
  error: 'border-red-500/30 bg-slate-800',
  info: 'border-blue-500/30 bg-slate-800',
}

export const Toast = () => {
  const { toast } = useFinanceContext()
  if (!toast) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className={clsx(
        'flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl',
        colors[toast.type] || colors.success
      )}>
        {icons[toast.type] || icons.success}
        <span className="text-sm text-slate-100 font-medium">{toast.message}</span>
      </div>
    </div>
  )
}
