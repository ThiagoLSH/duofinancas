import { useState } from 'react'
import { AliancaLogin, AliancaSignup } from '../alianca/screens/AliancaAuth'
import { useAuthContext } from '../context/AuthContext'

export const AuthPage = () => {
  const [mode, setMode] = useState('login')
  const { signInWithEmail, signUpWithEmail, signInWithMagicLink, signInWithGoogle, isDemo } = useAuthContext()

  if (mode === 'signup') {
    return (
      <AliancaSignup
        onLogin={() => setMode('login')}
        signUpWithEmail={signUpWithEmail}
        signInWithGoogle={signInWithGoogle}
      />
    )
  }

  return (
    <AliancaLogin
      onSignup={() => setMode('signup')}
      signInWithEmail={signInWithEmail}
      signInWithMagicLink={signInWithMagicLink}
      signInWithGoogle={signInWithGoogle}
      isDemo={isDemo}
    />
  )
}
