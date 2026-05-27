import { useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { useAuthContext } from '../context/AuthContext'
import { useFinanceContext } from '../context/FinanceContext'
import { useLocalCache } from './useLocalCache'

export const usePlan = () => {
  const { user, isDemo } = useAuthContext()
  const { plan, setPlan, setLoading, showToast } = useFinanceContext()
  const cache = useLocalCache()

  const loadActivePlan = useCallback(async () => {
    if (!user) return null
    setLoading(true)
    try {
      if (isDemo || !isSupabaseConfigured()) {
        const cached = cache.get(`plan_${user.id}`)
        setPlan(cached)
        return cached
      }
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .eq('owner_id', user.id)
        .eq('is_active', true)
        .single()
      if (error && error.code !== 'PGRST116') throw error
      cache.set(`plan_${user.id}`, data)
      setPlan(data)
      return data
    } catch (err) {
      console.error('loadActivePlan error:', err)
      const cached = cache.get(`plan_${user.id}`)
      setPlan(cached)
      return cached
    } finally {
      setLoading(false)
    }
  }, [user, isDemo])

  const createPlan = useCallback(async (planType) => {
    if (!user) return null
    const newPlan = {
      owner_id: user.id,
      plan_type: planType,
      monthly_income: 0,
      is_active: true,
    }
    try {
      if (isDemo || !isSupabaseConfigured()) {
        const plan = { ...newPlan, id: `demo-plan-${Date.now()}`, created_at: new Date().toISOString() }
        cache.set(`plan_${user.id}`, plan)
        setPlan(plan)
        return plan
      }
      // Desativa plano anterior
      await supabase
        .from('plans')
        .update({ is_active: false })
        .eq('owner_id', user.id)
        .eq('is_active', true)
      const { data, error } = await supabase
        .from('plans')
        .insert(newPlan)
        .select()
        .single()
      if (error) throw error
      cache.set(`plan_${user.id}`, data)
      setPlan(data)
      return data
    } catch (err) {
      console.error('createPlan error:', err)
      // fallback local
      const plan = { ...newPlan, id: `local-plan-${Date.now()}`, created_at: new Date().toISOString() }
      cache.set(`plan_${user.id}`, plan)
      cache.setPending(`plan_${user.id}`, plan)
      setPlan(plan)
      return plan
    }
  }, [user, isDemo])

  const savePlan = useCallback(async (updates) => {
    if (!plan) return null
    const updated = { ...plan, ...updates, updated_at: new Date().toISOString() }
    try {
      if (isDemo || !isSupabaseConfigured()) {
        cache.set(`plan_${user.id}`, updated)
        setPlan(updated)
        showToast('Plano salvo localmente')
        return updated
      }
      const { data, error } = await supabase
        .from('plans')
        .update(updates)
        .eq('id', plan.id)
        .select()
        .single()
      if (error) throw error
      cache.set(`plan_${user.id}`, data)
      setPlan(data)
      showToast('Plano salvo com sucesso!')
      return data
    } catch (err) {
      console.error('savePlan error:', err)
      cache.set(`plan_${user.id}`, updated)
      cache.setPending(`plan_${user.id}`, updated)
      setPlan(updated)
      showToast('Salvo localmente (sem conexão)', 'warning')
      return updated
    }
  }, [plan, user, isDemo])

  const resetPlan = useCallback(async () => {
    if (!user || !plan) return
    try {
      if (!isDemo && isSupabaseConfigured()) {
        await supabase
          .from('plans')
          .update({ is_active: false })
          .eq('id', plan.id)
      }
      cache.remove(`plan_${user.id}`)
      cache.remove(`expenses_${plan.id}`)
      cache.remove(`goals_${plan.id}`)
    } catch (err) {
      console.error('resetPlan error:', err)
    }
    setPlan(null)
  }, [plan, user, isDemo])

  return { plan, loadActivePlan, createPlan, savePlan, resetPlan }
}
