import { useState, useEffect } from 'react'
import { clsx } from 'clsx'

const formatDisplay = (cents) => {
  if (!cents && cents !== 0) return ''
  const str = String(cents).padStart(3, '0')
  const reais = str.slice(0, -2)
  const centavos = str.slice(-2)
  const formatted = parseInt(reais, 10).toLocaleString('pt-BR')
  return `R$ ${formatted},${centavos}`
}

const toCents = (value) => {
  const digits = String(value).replace(/\D/g, '')
  return parseInt(digits || '0', 10)
}

export const CurrencyInput = ({
  value,
  onChange,
  label,
  placeholder = 'R$ 0,00',
  error,
  className,
  disabled,
  id,
}) => {
  const [display, setDisplay] = useState('')

  useEffect(() => {
    const cents = Math.round((parseFloat(value) || 0) * 100)
    setDisplay(cents > 0 ? formatDisplay(cents) : '')
  }, [value])

  const handleChange = (e) => {
    const raw = e.target.value
    const cents = toCents(raw)
    setDisplay(formatDisplay(cents))
    onChange(cents / 100)
  }

  const handleFocus = (e) => {
    e.target.select()
  }

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="label-text">
          {label}
        </label>
      )}
      <input
        id={id}
        type="text"
        inputMode="numeric"
        value={display}
        onChange={handleChange}
        onFocus={handleFocus}
        placeholder={placeholder}
        disabled={disabled}
        className={clsx(
          'input-field',
          error && 'border-red-500 focus:ring-red-500',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  )
}
