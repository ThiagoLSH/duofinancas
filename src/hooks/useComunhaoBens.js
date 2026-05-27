import { useState, useCallback, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { useAuthContext } from '../context/AuthContext'
import { useFinanceContext } from '../context/FinanceContext'

const CACHE_CONFIG_KEY = 'cb_config'
const CACHE_HISTORICO_KEY = 'cb_historico'

const loadLocal = (key) => {
  try { return JSON.parse(localStorage.getItem(key) || 'null') }
  catch { return null }
}

const saveLocal = (key, data) =>
  localStorage.setItem(key, JSON.stringify(data))

// Computes streak (meses_consecutivos) from historico array.
// Historico items must have: { mes_referencia: "YYYY-MM", status: "devolvido"|"pendente" }
const computeStreak = (historico) => {
  const devolvidos = [...historico]
    .filter((r) => r.status === 'devolvido')
    .sort((a, b) => b.mes_referencia.localeCompare(a.mes_referencia))

  if (devolvidos.length === 0) return 0

  let streak = 0
  let [expectY, expectM] = devolvidos[0].mes_referencia.split('-').map(Number)

  for (const r of devolvidos) {
    const [y, m] = r.mes_referencia.split('-').map(Number)
    if (y === expectY && m === expectM) {
      streak++
      if (expectM === 1) { expectM = 12; expectY-- }
      else { expectM-- }
    } else {
      break
    }
  }

  return streak
}

const mesAtualISO = () => new Date().toISOString().slice(0, 7)

export const useComunhaoBens = () => {
  const { user, isDemo } = useAuthContext()
  const { showToast } = useFinanceContext()

  const [config, setConfig] = useState(null)
  const [historico, setHistorico] = useState([])
  const [loadingConfig, setLoadingConfig] = useState(true)
  const [loadingHistorico, setLoadingHistorico] = useState(true)
  const [saving, setSaving] = useState(false)

  const useLocal = isDemo || !isSupabaseConfigured()

  // ─── Config ────────────────────────────────────────────────────────────────

  const fetchConfig = useCallback(async () => {
    setLoadingConfig(true)
    try {
      if (useLocal) {
        const cached = loadLocal(CACHE_CONFIG_KEY)
        setConfig(cached)
        return cached
      }
      const { data, error } = await supabase
        .from('comunhao_bens_config')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()
      if (error) throw error
      setConfig(data)
      return data
    } catch (err) {
      console.error('fetchConfig error:', err)
      const cached = loadLocal(CACHE_CONFIG_KEY)
      setConfig(cached)
      return cached
    } finally {
      setLoadingConfig(false)
    }
  }, [user, useLocal])

  const saveConfig = useCallback(async (formData) => {
    setSaving(true)
    try {
      if (useLocal) {
        const updated = {
          ...formData,
          user_id: 'demo',
          updated_at: new Date().toISOString(),
        }
        saveLocal(CACHE_CONFIG_KEY, updated)
        setConfig(updated)
        showToast('Configuração salva!')
        return updated
      }
      const payload = { ...formData, user_id: user.id }
      const { data, error } = await supabase
        .from('comunhao_bens_config')
        .upsert(payload, { onConflict: 'user_id' })
        .select()
        .single()
      if (error) throw error
      setConfig(data)
      showToast('Configuração salva!')
      return data
    } catch (err) {
      console.error('saveConfig error:', err)
      showToast('Erro ao salvar. Tente novamente.', 'error')
      throw err
    } finally {
      setSaving(false)
    }
  }, [user, useLocal, showToast])

  // ─── Histórico ──────────────────────────────────────────────────────────────

  const fetchHistorico = useCallback(async () => {
    setLoadingHistorico(true)
    try {
      if (useLocal) {
        const cached = loadLocal(CACHE_HISTORICO_KEY) || []
        setHistorico(cached)
        return cached
      }
      const { data, error } = await supabase
        .from('comunhao_bens_historico')
        .select('*')
        .eq('user_id', user.id)
        .order('mes_referencia', { ascending: false })
      if (error) throw error
      setHistorico(data || [])
      return data || []
    } catch (err) {
      console.error('fetchHistorico error:', err)
      const cached = loadLocal(CACHE_HISTORICO_KEY) || []
      setHistorico(cached)
      return cached
    } finally {
      setLoadingHistorico(false)
    }
  }, [user, useLocal])

  // Syncs meses_consecutivos and status_mes_atual in config after historico changes.
  const syncConfigFromHistorico = useCallback(async (newHistorico, configSnapshot) => {
    if (!configSnapshot) return
    const streak = computeStreak(newHistorico)
    const mesAtual = mesAtualISO()
    const thisMonth = newHistorico.find((r) => r.mes_referencia === mesAtual)
    const newStatus = thisMonth?.status === 'devolvido' ? 'devolvido' : 'pendente'

    const updated = { ...configSnapshot, meses_consecutivos: streak, status_mes_atual: newStatus }

    if (useLocal) {
      saveLocal(CACHE_CONFIG_KEY, updated)
      setConfig(updated)
    } else {
      const { data } = await supabase
        .from('comunhao_bens_config')
        .update({ meses_consecutivos: streak, status_mes_atual: newStatus })
        .eq('user_id', user.id)
        .select()
        .single()
      if (data) setConfig(data)
    }
  }, [user, useLocal])

  const addDevolucao = useCallback(async (formData) => {
    // formData: { mes_referencia, valor_renda, percentual_aplicado, valor_devolvido, status, forma_devolucao }
    setSaving(true)
    try {
      let newHistorico

      if (useLocal) {
        const entry = {
          ...formData,
          id: `local-${Date.now()}`,
          user_id: 'demo',
          data_devolucao: formData.status === 'devolvido' ? new Date().toISOString() : null,
          created_at: new Date().toISOString(),
        }
        const filtered = historico.filter((r) => r.mes_referencia !== entry.mes_referencia)
        newHistorico = [entry, ...filtered].sort((a, b) =>
          b.mes_referencia.localeCompare(a.mes_referencia)
        )
        saveLocal(CACHE_HISTORICO_KEY, newHistorico)
        setHistorico(newHistorico)
      } else {
        const payload = {
          ...formData,
          user_id: user.id,
          data_devolucao: formData.status === 'devolvido' ? new Date().toISOString() : null,
        }
        const { data, error } = await supabase
          .from('comunhao_bens_historico')
          .upsert(payload, { onConflict: 'user_id,mes_referencia' })
          .select()
          .single()
        if (error) throw error
        const filtered = historico.filter((r) => r.mes_referencia !== data.mes_referencia)
        newHistorico = [data, ...filtered].sort((a, b) =>
          b.mes_referencia.localeCompare(a.mes_referencia)
        )
        setHistorico(newHistorico)
      }

      await syncConfigFromHistorico(newHistorico, config)
      showToast('Devolução registrada!')
    } catch (err) {
      console.error('addDevolucao error:', err)
      showToast('Erro ao registrar. Tente novamente.', 'error')
      throw err
    } finally {
      setSaving(false)
    }
  }, [user, useLocal, historico, config, showToast, syncConfigFromHistorico])

  const deleteDevolucao = useCallback(async (id) => {
    try {
      let newHistorico
      if (useLocal) {
        newHistorico = historico.filter((r) => r.id !== id)
        saveLocal(CACHE_HISTORICO_KEY, newHistorico)
        setHistorico(newHistorico)
      } else {
        await supabase.from('comunhao_bens_historico').delete().eq('id', id)
        newHistorico = historico.filter((r) => r.id !== id)
        setHistorico(newHistorico)
      }
      await syncConfigFromHistorico(newHistorico, config)
      showToast('Registro removido')
    } catch (err) {
      console.error('deleteDevolucao error:', err)
      showToast('Erro ao remover.', 'error')
    }
  }, [user, useLocal, historico, config, showToast, syncConfigFromHistorico])

  // ─── Bootstrap ─────────────────────────────────────────────────────────────

  useEffect(() => {
    if (user) {
      fetchConfig()
      fetchHistorico()
    }
  }, [user])

  return {
    config,
    historico,
    loadingConfig,
    loadingHistorico,
    saving,
    saveConfig,
    addDevolucao,
    deleteDevolucao,
    fetchConfig,
    fetchHistorico,
  }
}
