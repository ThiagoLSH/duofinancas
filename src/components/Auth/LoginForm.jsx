import { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { Button } from '../UI/Button'
import { useAuthContext } from '../../context/AuthContext'
import { isSupabaseConfigured } from '../../lib/supabase'

export const LoginForm = ({ onSwitch }) => {
  const { signInWithEmail, signInWithMagicLink, signInWithGoogle, isDemo } = useAuthContext()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [magicLoading, setMagicLoading] = useState(false)
  const [error, setError] = useState('')
  const [magicSent, setMagicSent] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signInWithEmail(email, password)
    if (error) setError(error.message === 'Invalid login credentials'
      ? 'Email ou senha incorretos'
      : error.message)
    setLoading(false)
  }

  const handleMagicLink = async () => {
    if (!email) return setError('Digite seu email primeiro')
    setError('')
    setMagicLoading(true)
    const { error } = await signInWithMagicLink(email)
    if (error) setError(error.message)
    else setMagicSent(true)
    setMagicLoading(false)
  }

  const handleGoogle = () => signInWithGoogle()

  return (
    <div className="space-y-6">
      {!isSupabaseConfigured() && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 flex gap-2">
          <AlertCircle size={16} className="text-yellow-400 flex-shrink-0 mt-0.5" />
          <p className="text-yellow-300 text-xs">
            Modo demo ativo — Supabase não configurado. Configure o .env para habilitar autenticação real.
          </p>
        </div>
      )}

      {magicSent ? (
        <div className="text-center space-y-3 py-4">
          <div className="text-4xl">📬</div>
          <p className="text-slate-200 font-medium">Link enviado!</p>
          <p className="text-slate-400 text-sm">Verifique seu email <strong>{email}</strong> e clique no link para entrar.</p>
          <button onClick={() => setMagicSent(false)} className="text-emerald-400 text-sm underline">
            Tentar novamente
          </button>
        </div>
      ) : (
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="label-text">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="input-field pl-9"
                required
              />
            </div>
          </div>
          <div>
            <label className="label-text">Senha</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                className="input-field pl-9 pr-10"
                required={isSupabaseConfigured()}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg">
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" loading={loading}>
            Entrar
          </Button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-700" />
            <span className="text-slate-500 text-xs">ou</span>
            <div className="flex-1 h-px bg-slate-700" />
          </div>

          {isSupabaseConfigured() && (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleMagicLink}
              loading={magicLoading}
            >
              <Mail size={16} />
              Entrar por link mágico
            </Button>
          )}

          {isSupabaseConfigured() && (
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={handleGoogle}
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"/>
                <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z"/>
                <path fill="#4A90E2" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z"/>
                <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z"/>
              </svg>
              Continuar com Google
            </Button>
          )}
        </form>
      )}

      <p className="text-center text-sm text-slate-400">
        Não tem conta?{' '}
        <button onClick={onSwitch} className="text-emerald-400 hover:text-emerald-300 font-medium">
          Criar conta grátis
        </button>
      </p>
    </div>
  )
}
