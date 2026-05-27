import { createContext, useContext, useReducer, useCallback } from 'react'

const FinanceContext = createContext(null)

const initialState = {
  currentStep: 0,
  plan: null,
  expenses: [],
  goals: [],
  scenarios: [],
  loading: false,
  error: null,
  toast: null,
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload }
    case 'SET_PLAN':
      return { ...state, plan: action.payload }
    case 'SET_EXPENSES':
      return { ...state, expenses: action.payload }
    case 'SET_GOALS':
      return { ...state, goals: action.payload }
    case 'SET_SCENARIOS':
      return { ...state, scenarios: action.payload }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'SET_TOAST':
      return { ...state, toast: action.payload }
    case 'CLEAR_TOAST':
      return { ...state, toast: null }
    case 'RESET':
      return { ...initialState }
    default:
      return state
  }
}

export const FinanceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const setStep = useCallback((step) => dispatch({ type: 'SET_STEP', payload: step }), [])
  const setPlan = useCallback((plan) => dispatch({ type: 'SET_PLAN', payload: plan }), [])
  const setExpenses = useCallback((expenses) => dispatch({ type: 'SET_EXPENSES', payload: expenses }), [])
  const setGoals = useCallback((goals) => dispatch({ type: 'SET_GOALS', payload: goals }), [])
  const setScenarios = useCallback((scenarios) => dispatch({ type: 'SET_SCENARIOS', payload: scenarios }), [])
  const setLoading = useCallback((val) => dispatch({ type: 'SET_LOADING', payload: val }), [])
  const setError = useCallback((err) => dispatch({ type: 'SET_ERROR', payload: err }), [])
  const reset = useCallback(() => dispatch({ type: 'RESET' }), [])

  const showToast = useCallback((message, type = 'success') => {
    dispatch({ type: 'SET_TOAST', payload: { message, type } })
    setTimeout(() => dispatch({ type: 'CLEAR_TOAST' }), 3500)
  }, [])

  return (
    <FinanceContext.Provider value={{
      ...state,
      setStep, setPlan, setExpenses, setGoals,
      setScenarios, setLoading, setError, reset, showToast,
    }}>
      {children}
    </FinanceContext.Provider>
  )
}

export const useFinanceContext = () => {
  const ctx = useContext(FinanceContext)
  if (!ctx) throw new Error('useFinanceContext deve ser usado dentro de FinanceProvider')
  return ctx
}
