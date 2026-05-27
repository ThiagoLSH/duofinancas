import { useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { useAuthContext } from '../context/AuthContext'
import { useFinanceContext } from '../context/FinanceContext'
import { useLocalCache } from './useLocalCache'

export const useExpenses = () => {
  const { isDemo } = useAuthContext()
  const { plan, expenses, setExpenses, showToast } = useFinanceContext()
  const cache = useLocalCache()

  const loadExpenses = useCallback(async () => {
    if (!plan) return []
    try {
      if (isDemo || !isSupabaseConfigured()) {
        const cached = cache.get(`expenses_${plan.id}`) || []
        setExpenses(cached)
        return cached
      }
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('plan_id', plan.id)
        .order('created_at')
      if (error) throw error
      // Prefer Supabase data if non-empty; otherwise keep local cache to avoid losing
      // expenses that were saved locally when a previous Supabase operation failed
      const cached = cache.get(`expenses_${plan.id}`) || []
      const result = data.length > 0 ? data : cached
      cache.set(`expenses_${plan.id}`, result)
      setExpenses(result)
      return result
    } catch (err) {
      console.error('loadExpenses error:', err)
      const cached = cache.get(`expenses_${plan.id}`) || []
      setExpenses(cached)
      return cached
    }
  }, [plan, isDemo])

  const saveExpenses = useCallback(async (newExpenses) => {
    if (!plan) return
    const toSave = newExpenses.map((e) => ({
      ...e,
      plan_id: plan.id,
      id: e.id || `local-${Date.now()}-${Math.random()}`,
    }))
    try {
      if (isDemo || !isSupabaseConfigured()) {
        cache.set(`expenses_${plan.id}`, toSave)
        setExpenses(toSave)
        showToast('Despesas salvas!')
        return toSave
      }
      // Delete existing and reinsert (batch upsert)
      await supabase.from('expenses').delete().eq('plan_id', plan.id)
      const cleanExpenses = newExpenses.map(({ id: _id, ...rest }) => ({
        ...rest,
        plan_id: plan.id,
      }))
      const { data, error } = await supabase
        .from('expenses')
        .insert(cleanExpenses)
        .select()
      if (error) throw error
      cache.set(`expenses_${plan.id}`, data)
      setExpenses(data)
      showToast('Despesas salvas!')
      return data
    } catch (err) {
      console.error('saveExpenses error:', err)
      cache.set(`expenses_${plan.id}`, toSave)
      cache.setPending(`expenses_${plan.id}`, toSave)
      setExpenses(toSave)
      showToast('Salvo localmente (sem conexão)', 'warning')
      return toSave
    }
  }, [plan, isDemo])

  return { expenses, loadExpenses, saveExpenses }
}
