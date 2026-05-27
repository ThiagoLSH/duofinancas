import { useEffect } from 'react'
import { Header } from '../components/Layout/Header'
import { ProgressBar } from '../components/Layout/ProgressBar'
import { Welcome } from '../components/Steps/Welcome'
import { Anamnesis } from '../components/Steps/Anamnesis'
import { FixedExpenses } from '../components/Steps/FixedExpenses'
import { VariableExpenses } from '../components/Steps/VariableExpenses'
import { AppPage } from './AppPage'
import { Toast } from '../components/UI/Toast'
import { useFinanceContext } from '../context/FinanceContext'
import { usePlan } from '../hooks/usePlan'

// Wizard steps only — after completion the user sees AppPage
const WIZARD_STEPS = [Welcome, Anamnesis, FixedExpenses, VariableExpenses]

export const PlannerPage = () => {
  const { currentStep, setStep } = useFinanceContext()
  const { loadActivePlan } = usePlan()

  useEffect(() => {
    loadActivePlan().then((loaded) => {
      if (loaded?.monthly_income > 0) {
        // Setup complete — enter app mode (step >= 4)
        setStep(4)
      } else if (loaded) {
        // Plan exists but wizard not finished — resume from Anamnesis
        setStep(1)
      }
    })
  }, [])

  // App mode: wizard completed
  if (currentStep >= 4) return <AppPage />

  const WizardStep = WIZARD_STEPS[currentStep]
  const showProgress = currentStep > 0

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Header />
      {showProgress && (
        <ProgressBar
          currentStep={currentStep - 1}
          onStepClick={(i) => setStep(i + 1)}
        />
      )}
      <main className="flex-1 overflow-y-auto">
        {WizardStep && <WizardStep />}
      </main>
      <Toast />
    </div>
  )
}
