import { useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { useFinanceContext } from '../context/FinanceContext'

export const useRealtimeSync = () => {
  const { plan, setExpenses, setGoals } = useFinanceContext()

  useEffect(() => {
    if (!plan || !isSupabaseConfigured() || plan.plan_type !== 'couple') return

    const channel = supabase
      .channel(`plan-${plan.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'expenses', filter: `plan_id=eq.${plan.id}` },
        async () => {
          const { data } = await supabase
            .from('expenses')
            .select('*')
            .eq('plan_id', plan.id)
            .order('created_at')
          if (data) setExpenses(data)
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'goals', filter: `plan_id=eq.${plan.id}` },
        async () => {
          const { data } = await supabase
            .from('goals')
            .select('*')
            .eq('plan_id', plan.id)
            .order('priority')
          if (data) setGoals(data)
        }
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [plan?.id])
}
