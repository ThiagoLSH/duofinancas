import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isDemo, setIsDemo] = useState(!isSupabaseConfigured())

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      const demoUser = JSON.parse(localStorage.getItem('demo_user') || 'null')
      setUser(demoUser)
      setProfile(demoUser ? JSON.parse(localStorage.getItem('demo_profile') || 'null') : null)
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setProfile(null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    setProfile(data)
  }

  const updateProfile = async (updates) => {
    if (isDemo) {
      const updated = { ...(profile || {}), ...updates }
      localStorage.setItem('demo_profile', JSON.stringify(updated))
      setProfile(updated)
      return updated
    }
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, ...updates })
      .select()
      .single()
    if (error) throw error
    setProfile(data)
    return data
  }

  const signInWithEmail = async (email, password) => {
    if (isDemo) {
      const demoUser = { id: 'demo-user', email, user_metadata: { full_name: email.split('@')[0] } }
      localStorage.setItem('demo_user', JSON.stringify(demoUser))
      setUser(demoUser)
      return { data: { user: demoUser }, error: null }
    }
    return supabase.auth.signInWithPassword({ email, password })
  }

  // metadata = { telefone, tipo_vinculo, percentual, nivel_formativo?, celula?, formador_comunitario?, grupo_oracao?, pastor_grupo?, acompanhador? }
  const signUpWithEmail = async (email, password, fullName, metadata = {}) => {
    if (isDemo) {
      const demoUser = { id: 'demo-user', email, user_metadata: { full_name: fullName } }
      const demoProfile = { id: 'demo-user', full_name: fullName }

      // Salva config CB no localStorage (modo demo)
      const cbConfig = {
        user_id: 'demo-user',
        nome: fullName,
        telefone: metadata.telefone || '',
        tipo_vinculo: metadata.tipo_vinculo || '',
        percentual: metadata.percentual || 10,
        ativo: true,
        lembrete_whatsapp: !!metadata.telefone,
        lembrete_browser: true,
        status_mes_atual: 'pendente',
        meses_consecutivos: 0,
        ...extraFields(metadata),
      }
      localStorage.setItem('demo_user', JSON.stringify(demoUser))
      localStorage.setItem('demo_profile', JSON.stringify(demoProfile))
      localStorage.setItem('cb_config', JSON.stringify(cbConfig))
      setUser(demoUser)
      setProfile(demoProfile)
      return { data: { user: demoUser }, error: null }
    }

    // Modo real: cria o usuário no Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })

    if (error || !data?.user) return { data, error }

    // Salva na tabela comunhao_bens_config via service role não é possível
    // no frontend — usamos a anon key com RLS.
    // A RLS permite INSERT quando auth.uid() = user_id.
    // O trigger de confirmação de email vai ativar o usuário,
    // mas inserimos já com ativo = false e atualizamos via trigger no Supabase
    // OU inserimos direto — depende se email confirmation está ligado.
    // Estratégia: inserir agora, o usuário já está autenticado na sessão.
    const userId = data.user.id

    const cbPayload = {
      user_id: userId,
      nome: fullName,
      telefone: metadata.telefone || '',
      tipo_vinculo: metadata.tipo_vinculo || '',
      percentual: metadata.percentual || 10,
      ativo: true,
      lembrete_whatsapp: !!metadata.telefone,
      lembrete_browser: true,
      status_mes_atual: 'pendente',
      meses_consecutivos: 0,
      ...extraFields(metadata),
    }

    // Tenta inserir — não bloqueia o cadastro se falhar (pode ser feito depois)
    await supabase.from('comunhao_bens_config').insert(cbPayload)

    return { data, error: null }
  }

  // Extrai campos extras do metadata de acordo com tipo_vinculo
  const extraFields = (metadata) => {
    const { tipo_vinculo, nivel_formativo, celula, formador_comunitario, grupo_oracao, pastor_grupo, acompanhador } = metadata
    if (tipo_vinculo === 'comunidade_alianca') {
      return { nivel_formativo, celula, formador_comunitario }
    }
    return { grupo_oracao, pastor_grupo, acompanhador }
  }

  const signInWithMagicLink = async (email) => {
    if (isDemo) return { data: null, error: { message: 'Magic link não disponível no modo demo' } }
    return supabase.auth.signInWithOtp({ email })
  }

  const resetPassword = async (email) => {
    if (isDemo) return { data: null, error: { message: 'Reset de senha não disponível no modo demo' } }
    return supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin })
  }

  const signInWithGoogle = async () => {
    if (isDemo) return { data: null, error: { message: 'Google OAuth não disponível no modo demo' } }
    return supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
  }

  const updateAuth = async (updates) => {
    if (isDemo) {
      const updated = { ...user }
      if (updates.email) updated.email = updates.email
      if (updates.data) updated.user_metadata = { ...(user?.user_metadata || {}), ...updates.data }
      localStorage.setItem('demo_user', JSON.stringify(updated))
      setUser(updated)
      return { error: null }
    }
    const { data, error } = await supabase.auth.updateUser(updates)
    if (data?.user) setUser(data.user)
    return { error }
  }

  const uploadAvatar = async (file) => {
    const toBase64 = (f) =>
      new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.readAsDataURL(f)
      })

    if (isDemo || !isSupabaseConfigured()) {
      const url = await toBase64(file)
      return { url, error: null }
    }

    const ext = file.name.split('.').pop()
    const path = `${user.id}/avatar.${ext}`
    const { error } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true })

    if (error) {
      const url = await toBase64(file)
      return { url, error: null }
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(path)
    return { url: `${data.publicUrl}?t=${Date.now()}`, error: null }
  }

  const signOut = async () => {
    if (isDemo) {
      localStorage.removeItem('demo_user')
      localStorage.removeItem('demo_profile')
      localStorage.removeItem('demo_plan')
      localStorage.removeItem('demo_expenses')
      localStorage.removeItem('demo_goals')
      localStorage.removeItem('cb_config')
      setUser(null)
      setProfile(null)
      return
    }
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{
      user, profile, loading, isDemo,
      signInWithEmail, signUpWithEmail,
      signInWithMagicLink, signInWithGoogle, resetPassword,
      signOut, updateProfile, updateAuth, uploadAvatar, fetchProfile,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext deve ser usado dentro de AuthProvider')
  return ctx
}