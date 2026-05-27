import { useAuthContext } from '../../context/AuthContext'

export const AuthGuard = ({ children, fallback }) => {
  const { user, loading } = useAuthContext()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) return fallback || null
  return children
}
