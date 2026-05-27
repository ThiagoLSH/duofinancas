import { clsx } from 'clsx'

const variants = {
  primary: 'bg-emerald-500 hover:bg-emerald-600 text-white focus:ring-emerald-500',
  secondary: 'bg-slate-700 hover:bg-slate-600 text-slate-100 focus:ring-slate-500',
  danger: 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 focus:ring-red-500',
  ghost: 'text-slate-400 hover:text-slate-100 hover:bg-slate-800 focus:ring-slate-500',
  outline: 'border border-slate-600 hover:border-emerald-500 text-slate-300 hover:text-emerald-400 focus:ring-emerald-500',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  loading,
  icon,
  ...props
}) => {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-semibold rounded-xl',
        'transition-all duration-200 active:scale-95',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon ? (
        <span className="w-4 h-4 flex-shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  )
}
