import { useState } from 'react'
import { LoginForm } from '../components/Auth/LoginForm'
import { SignupForm } from '../components/Auth/SignupForm'

const DuoLogo = () => (
  <div className="flex items-center justify-center gap-3">
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="24" r="14" fill="#10B981" opacity="0.9"/>
      <circle cx="30" cy="24" r="14" fill="#34D399" opacity="0.7"/>
    </svg>
    <div>
      <h1 className="text-3xl font-bold text-white leading-none">
        Duo<span className="font-light text-emerald-400">Finanças</span>
      </h1>
      <p className="text-emerald-400/70 text-sm font-light">Suas finanças em sintonia</p>
    </div>
  </div>
)

export const AuthPage = () => {
  const [mode, setMode] = useState('login')

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/30" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md space-y-8 animate-fade-in">
        {/* Logo */}
        <DuoLogo />

        {/* Card */}
        <div className="glass-card p-8 shadow-2xl">
          {/* Tabs */}
          <div className="flex rounded-xl bg-slate-900/60 p-1 mb-6">
            {[
              { key: 'login', label: 'Entrar' },
              { key: 'signup', label: 'Criar conta' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setMode(tab.key)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                  mode === tab.key
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {mode === 'login' ? (
            <LoginForm onSwitch={() => setMode('signup')} />
          ) : (
            <SignupForm onSwitch={() => setMode('login')} />
          )}
        </div>

        {/* Features strip */}
        <div className="flex justify-center gap-6 text-xs text-slate-600">
          <span>✓ Gratuito</span>
          <span>✓ Dados seguros</span>
          <span>✓ Sem cartão</span>
        </div>
      </div>
    </div>
  )
}
