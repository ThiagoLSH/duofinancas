import { clsx } from 'clsx'

export const Skeleton = ({ className, lines = 1 }) => {
  if (lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={clsx(
              'h-4 rounded-lg animate-shimmer',
              i === lines - 1 && 'w-3/4',
              className
            )}
          />
        ))}
      </div>
    )
  }
  return (
    <div className={clsx('h-4 rounded-lg animate-shimmer', className)} />
  )
}

export const CardSkeleton = () => (
  <div className="glass-card p-5 space-y-3">
    <Skeleton className="h-3 w-1/3" />
    <Skeleton className="h-8 w-2/3" />
    <Skeleton className="h-3 w-1/4" />
  </div>
)
