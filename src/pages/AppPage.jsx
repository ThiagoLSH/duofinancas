import { useState } from 'react'
import { LayoutDashboard, Home, ShoppingBag, Target, FileText, Heart } from 'lucide-react'
import { clsx } from 'clsx'
import { Header } from '../components/Layout/Header'
import { Dashboard } from '../components/Steps/Dashboard'
import { FixedExpenses } from '../components/Steps/FixedExpenses'
import { VariableExpenses } from '../components/Steps/VariableExpenses'
import { Goals } from '../components/Steps/Goals'
import { ActionPlan } from '../components/Steps/ActionPlan'
import { ComunhaoDeBens } from '../components/ComunhaoDeBens'
import { Toast } from '../components/UI/Toast'

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'fixed', label: 'Fixas', icon: Home },
  { id: 'variable', label: 'Variáveis', icon: ShoppingBag },
  { id: 'goals', label: 'Metas', icon: Target },
  { id: 'plan', label: 'Plano', icon: FileText },
  { id: 'comunhao', label: 'Comunhão', icon: Heart },
]

export const AppPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Header />

      {/* Tab navigation */}
      <div className="sticky top-16 z-30 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-4xl mx-auto px-2 sm:px-4">
          <div className="flex overflow-x-auto scrollbar-none">
            {TABS.map((tab) => {
              const Icon = tab.icon
              const active = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    'flex items-center gap-1.5 px-3 sm:px-4 py-3.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap flex-shrink-0',
                    active
                      ? 'border-emerald-500 text-emerald-400'
                      : 'border-transparent text-slate-500 hover:text-slate-300 hover:border-slate-600'
                  )}
                >
                  <Icon size={15} />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'fixed' && <FixedExpenses tabMode />}
        {activeTab === 'variable' && <VariableExpenses tabMode />}
        {activeTab === 'goals' && <Goals />}
        {activeTab === 'plan' && <ActionPlan />}
        {activeTab === 'comunhao' && <ComunhaoDeBens />}
      </main>

      <Toast />
    </div>
  )
}
