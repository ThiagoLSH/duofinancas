import { clsx } from 'clsx'

export const SliderInput = ({ value, onChange, min = 0, max = 100, step = 1, label, description, formatValue }) => {
  const display = formatValue ? formatValue(value) : `${value}%`
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div className="w-full space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-slate-300">{label}</label>
          <span className="text-sm font-bold text-emerald-400">{display}</span>
        </div>
      )}
      {description && <p className="text-xs text-slate-500">{description}</p>}
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={clsx(
            'w-full h-2 rounded-full appearance-none cursor-pointer',
            'bg-slate-700',
            '[&::-webkit-slider-thumb]:appearance-none',
            '[&::-webkit-slider-thumb]:w-4',
            '[&::-webkit-slider-thumb]:h-4',
            '[&::-webkit-slider-thumb]:rounded-full',
            '[&::-webkit-slider-thumb]:bg-emerald-500',
            '[&::-webkit-slider-thumb]:cursor-pointer',
            '[&::-webkit-slider-thumb]:shadow-md',
            '[&::-moz-range-thumb]:w-4',
            '[&::-moz-range-thumb]:h-4',
            '[&::-moz-range-thumb]:rounded-full',
            '[&::-moz-range-thumb]:bg-emerald-500',
            '[&::-moz-range-thumb]:border-0',
          )}
          style={{
            background: `linear-gradient(to right, #10B981 0%, #10B981 ${pct}%, #334155 ${pct}%, #334155 100%)`
          }}
        />
      </div>
      <div className="flex justify-between text-xs text-slate-500">
        <span>{formatValue ? formatValue(min) : `${min}%`}</span>
        <span>{formatValue ? formatValue(max) : `${max}%`}</span>
      </div>
    </div>
  )
}
