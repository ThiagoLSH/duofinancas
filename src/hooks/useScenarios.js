import { useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { useAuthContext } from '../context/AuthContext'
import { useFinanceContext } from '../context/FinanceContext'
import { useLocalCache } from './useLocalCache'

export const useScenarios = () => {
  const { isDemo } = useAuthContext()
  const { plan, scenarios, setScenarios, showToast } = useFinanceContext()
  const cache = useLocalCache()

  const loadScenarios = useCallback(async () => {
    if (!plan) return []
    try {
      if (isDemo || !isSupabaseConfigured()) {
        const cached = cache.get(`scenarios_${plan.id}`) || []
        setScenarios(cached)
        return cached
      }
      const { data, error } = await supabase
        .from('scenarios')
        .select('*')
        .eq('plan_id', plan.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      cache.set(`scenarios_${plan.id}`, data)
      setScenarios(data)
      return data
    } catch (err) {
      const cached = cache.get(`scenarios_${plan.id}`) || []
      setScenarios(cached)
      return cached
    }
  }, [plan, isDemo])

  const saveScenario = useCallback(async (scenarioData) => {
    if (!plan) return null
    const newScenario = { ...scenarioData, plan_id: plan.id }
    try {
      if (isDemo || !isSupabaseConfigured()) {
        const scenario = { ...newScenario, id: `demo-sc-${Date.now()}`, created_at: new Date().toISOString() }
        const updated = [scenario, ...scenarios]
        cache.set(`scenarios_${plan.id}`, updated)
        setScenarios(updated)
        showToast('Cenário salvo!')
        return scenario
      }
      const { data, error } = await supabase
        .from('scenarios')
        .insert(newScenario)
        .select()
        .single()
      if (error) throw error
      const updated = [data, ...scenarios]
      cache.set(`scenarios_${plan.id}`, updated)
      setScenarios(updated)
      showToast('Cenário salvo!')
      return data
    } catch (err) {
      console.error('saveScenario error:', err)
      return null
    }
  }, [plan, scenarios, isDemo])

  const deleteScenario = useCallback(async (scenarioId) => {
    try {
      if (!isDemo && isSupabaseConfigured()) {
        await supabase.from('scenarios').delete().eq('id', scenarioId)
      }
      const updated = scenarios.filter((s) => s.id !== scenarioId)
      cache.set(`scenarios_${plan.id}`, updated)
      setScenarios(updated)
    } catch (err) {
      console.error('deleteScenario error:', err)
    }
  }, [plan, scenarios, isDemo])

  return { scenarios, loadScenarios, saveScenario, deleteScenario }
}
