import { AuthProvider } from './context/AuthContext'
import { FinanceProvider } from './context/FinanceContext'
import { AuthGuard } from './components/Auth/AuthGuard'
import { AuthPage } from './pages/AuthPage'
import { PlannerPage } from './pages/PlannerPage'
import { LandingPage } from './pages/LandingPage'
import { useAuthContext } from './context/AuthContext'

const AuthenticatedApp = () => {
  const { user } = useAuthContext()
  return (
    <FinanceProvider key={user.id}>
      <PlannerPage />
    </FinanceProvider>
  )
}

// Roteamento simples sem React Router
const isLandingPage = () => {
  const path = window.location.pathname
  return path === '/lp' || path === '/lp/'
}

export default function App() {
  // LP não precisa de autenticação — renderiza direto
  if (isLandingPage()) {
    return <LandingPage />
  }

  return (
    <AuthProvider>
      <AuthGuard fallback={<AuthPage />}>
        <AuthenticatedApp />
      </AuthGuard>
    </AuthProvider>
  )
}