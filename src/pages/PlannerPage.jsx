import { useEffect } from 'react'
import { Header } from '../components/Layout/Header'
import { Welcome } from '../components/Steps/Welcome'
import { AppPage } from './AppPage'
import { Toast } from '../components/UI/Toast'
import { useFinanceContext } from '../context/FinanceContext'
import { useAuthContext } from '../context/AuthContext'
import { usePlan } from '../hooks/usePlan'
import { AliancaAnamnesis } from '../alianca/screens/AliancaFeatures'
import { AliancaOnboarding } from '../alianca/screens/AliancaCBModule'

// Wizard wrapper for the Anamnesis step
const AliancaAnamnesisStep = () => {
  const { setStep } = useFinanceContext()
  const { profile } = useAuthContext()
  const { plan, savePlan } = usePlan()
  return (
    <AliancaAnamnesis
      plan={plan}
      profile={profile}
      savePlan={savePlan}
      onBack={() => setStep(0)}
      onNext={() => setStep(2)}
    />
  )
}

// Wizard wrapper for the Onboarding (income) step
const AliancaOnboardingStep = () => {
  const { setStep } = useFinanceContext()
  const { profile } = useAuthContext()
  const { plan, savePlan } = usePlan()
  const p1Name = profile?.full_name?.split(' ')[0] || 'Você'
  const p2Name = plan?.partner_name || 'Parceiro(a)'
  return (
    <AliancaOnboarding
      p1Name={p1Name}
      p2Name={p2Name}
      savePlan={savePlan}
      onBack={() => setStep(1)}
      onComplete={() => setStep(4)}
    />
  )
}

// Steps 1 and 2 render Aliança full-page layouts (no wrapper div)
const ALIANCA_STEPS = { 1: AliancaAnamnesisStep, 2: AliancaOnboardingStep }

export const PlannerPage = () => {
  const { currentStep, setStep } = useFinanceContext()
  const { loadActivePlan } = usePlan()

  useEffect(() => {
    loadActivePlan().then((loaded) => {
      if (loaded?.monthly_income > 0) {
        setStep(4)
      } else if (loaded) {
        setStep(1)
      }
    })
  }, [])

  if (currentStep >= 4) return <AppPage />

  // Aliança wizard steps render full-page without the old dark wrapper
  const AliancaStep = ALIANCA_STEPS[currentStep]
  if (AliancaStep) return <><AliancaStep /><Toast /></>

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Header />
      <main className="flex-1 overflow-y-auto">
        <Welcome />
      </main>
      <Toast />
    </div>
  )
}
