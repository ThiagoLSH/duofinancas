import { clsx } from 'clsx'
import { Check } from 'lucide-react'

const STEPS = [
  { label: 'Dados', short: '1' },
  { label: 'Fixas', short: '2' },
  { label: 'Variáveis', short: '3' },
]

export const ProgressBar = ({ currentStep, onStepClick }) => {
  const percent = Math.round((currentStep / (STEPS.length - 1)) * 100)

  return (
    <div className="bg-slate-900/60 border-b border-slate-700/50 px-4 py-3">
      <div className="max-w-3xl mx-auto">
        {/* Bar */}
        <div className="relative h-1.5 bg-slate-700 rounded-full mb-3">
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
        {/* Steps */}
        <div className="flex justify-between">
          {STEPS.map((step, i) => {
            const done = i < currentStep
            const active = i === currentStep
            return (
              <button
                key={i}
                onClick={() => done && onStepClick?.(i)}
                className={clsx(
                  'flex flex-col items-center gap-1 group',
                  done && 'cursor-pointer',
                  !done && !active && 'cursor-default'
                )}
              >
                <div className={clsx(
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                  active && 'bg-emerald-500 text-white ring-2 ring-emerald-500/30 ring-offset-1 ring-offset-slate-900',
                  done && 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 group-hover:bg-emerald-500/30',
                  !active && !done && 'bg-slate-800 text-slate-500 border border-slate-700'
                )}>
                  {done ? <Check size={12} /> : i + 1}
                </div>
                <span className={clsx(
                  'hidden sm:block text-xs font-medium transition-colors',
                  active && 'text-emerald-400',
                  done && 'text-slate-400',
                  !active && !done && 'text-slate-600'
                )}>
                  {step.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
