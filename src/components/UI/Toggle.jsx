import { clsx } from 'clsx'

export const Toggle = ({ checked, onChange, label, description, disabled }) => {
  return (
    <label className={clsx(
      'flex items-center justify-between gap-4 cursor-pointer',
      disabled && 'opacity-50 cursor-not-allowed'
    )}>
      <div className="flex-1">
        {label && <span className="text-sm font-medium text-slate-200">{label}</span>}
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
      </div>
      <div
        className={clsx(
          'relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0',
          checked ? 'bg-emerald-500' : 'bg-slate-600'
        )}
        onClick={() => !disabled && onChange(!checked)}
      >
        <span
          className={clsx(
            'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200',
            checked && 'translate-x-5'
          )}
        />
      </div>
    </label>
  )
}
