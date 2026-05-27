import { useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { useAuthContext } from '../context/AuthContext'
import { useFinanceContext } from '../context/FinanceContext'
import { useLocalCache } from './useLocalCache'

export const useGoals = () => {
  const { isDemo } = useAuthContext()
  const { plan, goals, setGoals, showToast } = useFinanceContext()
  const cache = useLocalCache()

  const loadGoals = useCallback(async () => {
    if (!plan) return []
    try {
      if (isDemo || !isSupabaseConfigured()) {
        const cached = cache.get(`goals_${plan.id}`) || []
        setGoals(cached)
        return cached
      }
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('plan_id', plan.id)
        .order('priority')
      if (error) throw error
      cache.set(`goals_${plan.id}`, data)
      setGoals(data)
      return data
    } catch (err) {
      const cached = cache.get(`goals_${plan.id}`) || []
      setGoals(cached)
      return cached
    }
  }, [plan, isDemo])

  const createGoal = useCallback(async (goalData) => {
    if (!plan) return null
    const newGoal = {
      ...goalData,
      plan_id: plan.id,
      status: 'active',
      current_value: goalData.current_value || 0,
    }
    try {
      if (isDemo || !isSupabaseConfigured()) {
        const goal = { ...newGoal, id: `demo-goal-${Date.now()}`, created_at: new Date().toISOString() }
        const updated = [...goals, goal]
        cache.set(`goals_${plan.id}`, updated)
        setGoals(updated)
        showToast('Meta criada!')
        return goal
      }
      const { data, error } = await supabase
        .from('goals')
        .insert(newGoal)
        .select()
        .single()
      if (error) throw error
      const updated = [...goals, data]
      cache.set(`goals_${plan.id}`, updated)
      setGoals(updated)
      showToast('Meta criada!')
      return data
    } catch (err) {
      console.error('createGoal error:', err)
      const goal = { ...newGoal, id: `local-goal-${Date.now()}`, created_at: new Date().toISOString() }
      const updated = [...goals, goal]
      cache.set(`goals_${plan.id}`, updated)
      setGoals(updated)
      return goal
    }
  }, [plan, goals, isDemo])

  const updateGoal = useCallback(async (goalId, updates) => {
    try {
      if (isDemo || !isSupabaseConfigured()) {
        const updated = goals.map((g) => g.id === goalId ? { ...g, ...updates } : g)
        cache.set(`goals_${plan.id}`, updated)
        setGoals(updated)
        showToast('Meta atualizada!')
        return
      }
      const { data, error } = await supabase
        .from('goals')
        .update(updates)
        .eq('id', goalId)
        .select()
        .single()
      if (error) throw error
      const updated = goals.map((g) => g.id === goalId ? data : g)
      cache.set(`goals_${plan.id}`, updated)
      setGoals(updated)
      showToast('Meta atualizada!')
    } catch (err) {
      console.error('updateGoal error:', err)
    }
  }, [plan, goals, isDemo])

  const deleteGoal = useCallback(async (goalId) => {
    try {
      if (!isDemo && isSupabaseConfigured()) {
        await supabase.from('goals').delete().eq('id', goalId)
      }
      const updated = goals.filter((g) => g.id !== goalId)
      cache.set(`goals_${plan.id}`, updated)
      setGoals(updated)
      showToast('Meta removida')
    } catch (err) {
      console.error('deleteGoal error:', err)
    }
  }, [plan, goals, isDemo])

  return { goals, loadGoals, createGoal, updateGoal, deleteGoal }
}
