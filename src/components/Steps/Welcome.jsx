import { User, Users, TrendingUp, Shield, Target } from 'lucide-react'
import { Button } from '../UI/Button'
import { usePlan } from '../../hooks/usePlan'
import { useFinanceContext } from '../../context/FinanceContext'
import { useAuthContext } from '../../context/AuthContext'
import { useState } from 'react'

const FeatureBadge = ({ icon, text }) => (
  <div className="flex items-center gap-2 text-sm text-slate-400">
    <span className="text-emerald-400">{icon}</span>
    {text}
  </div>
)

export const Welcome = () => {
  const { createPlan } = usePlan()
  const { setStep, setLoading } = useFinanceContext()
  const { profile } = useAuthContext()
  const [selecting, setSelecting] = useState(null)

  const handleSelect = async (type) => {
    setSelecting(type)
    setLoading(true)
    await createPlan(type)
    setLoading(false)
    setSelecting(null)
    setStep(1)
  }

  return (
    <div className="flex flex-col items-center text-center max-w-2xl mx-auto px-4 py-12 space-y-10 animate-fade-in">
      {/* Hero */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 text-emerald-400 text-sm font-medium">
          ✨ Planejamento financeiro simplificado
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
          Bem-vindo{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}!
        </h1>
        <p className="text-xl text-slate-400 leading-relaxed">
          Suas finanças em sintonia — escolha seu perfil para começar
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-3 gap-4 text-center">
        {[
          { icon: <TrendingUp size={20} />, label: 'Dashboard em tempo real' },
          { icon: <Target size={20} />, label: 'Metas com tracking' },
          { icon: <Shield size={20} />, label: 'Dados seguros' },
        ].map((f) => (
          <div key={f.label} className="glass-card p-3 space-y-2">
            <div className="text-emerald-400 flex justify-center">{f.icon}</div>
            <p className="text-xs text-slate-400">{f.label}</p>
          </div>
        ))}
      </div>

      {/* Profile Cards */}
      <div className="grid sm:grid-cols-2 gap-4 w-full">
        <button
          onClick={() => handleSelect('single')}
          disabled={!!selecting}
          className="glass-card p-6 text-left hover:border-emerald-500/50 hover:bg-slate-700/50 transition-all duration-200 active:scale-95 disabled:opacity-60 group"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:bg-emerald-500/30 transition-colors">
              👤
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-100">Solteiro(a)</h3>
              <p className="text-sm text-slate-400">Planejamento individual — controle total das suas finanças pessoais</p>
              <div className="pt-2 space-y-1">
                <FeatureBadge icon="✓" text="Orçamento pessoal" />
                <FeatureBadge icon="✓" text="Metas individuais" />
                <FeatureBadge icon="✓" text="Simulador de cenários" />
              </div>
            </div>
          </div>
          {selecting === 'single' && (
            <div className="mt-4 flex justify-center">
              <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </button>

        <button
          onClick={() => handleSelect('couple')}
          disabled={!!selecting}
          className="glass-card p-6 text-left hover:border-emerald-500/50 hover:bg-slate-700/50 transition-all duration-200 active:scale-95 disabled:opacity-60 group relative overflow-hidden"
        >
          <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            CASAL
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:bg-emerald-500/30 transition-colors">
              👫
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-100">Casal</h3>
              <p className="text-sm text-slate-400">Planejamento a dois — visão conjunta e gestão colaborativa</p>
              <div className="pt-2 space-y-1">
                <FeatureBadge icon="✓" text="Finanças do casal" />
                <FeatureBadge icon="✓" text="Divisão de despesas" />
                <FeatureBadge icon="✓" text="Sync em tempo real" />
              </div>
            </div>
          </div>
          {selecting === 'couple' && (
            <div className="mt-4 flex justify-center">
              <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </button>
      </div>

      <p className="text-xs text-slate-600">
        Você pode alterar o tipo de plano a qualquer momento. Seus dados ficam seguros.
      </p>
    </div>
  )
}
