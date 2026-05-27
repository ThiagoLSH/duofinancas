import { useState, useEffect, useRef } from 'react'
import { Camera, User, DollarSign, Check, Eye, EyeOff } from 'lucide-react'
import { clsx } from 'clsx'
import { Modal } from '../UI/Modal'
import { Button } from '../UI/Button'
import { CurrencyInput } from '../UI/CurrencyInput'
import { useAuthContext } from '../../context/AuthContext'
import { usePlan } from '../../hooks/usePlan'

const TABS = [
  { id: 'account', label: 'Conta', icon: User },
  { id: 'finance', label: 'Finanças', icon: DollarSign },
]

const getInitials = (name, email) => {
  const src = name || email || 'U'
  return src
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export const ProfileModal = ({ open, onClose }) => {
  const { user, profile, updateProfile, updateAuth, uploadAvatar } = useAuthContext()
  const { plan, savePlan } = usePlan()
  const avatarRef = useRef()

  const [tab, setTab] = useState('account')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  // Account fields
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [avatarFile, setAvatarFile] = useState(null)

  // Finance fields
  const [income, setIncome] = useState(0)
  const [hasExtra, setHasExtra] = useState(false)
  const [extraValue, setExtraValue] = useState(0)
  const [extraDesc, setExtraDesc] = useState('')

  // Sync state when modal opens
  useEffect(() => {
    if (!open) return
    setTab('account')
    setError('')
    setSuccess('')
    setName(profile?.full_name || user?.user_metadata?.full_name || '')
    setEmail(user?.email || '')
    setPassword('')
    setConfirmPassword('')
    setShowPassword(false)
    setAvatarPreview(user?.user_metadata?.avatar_url || profile?.avatar_url || null)
    setAvatarFile(null)
    setIncome(plan?.monthly_income || 0)
    setHasExtra(plan?.has_extra_income || false)
    setExtraValue(plan?.extra_income_value || 0)
    setExtraDesc(plan?.extra_income_description || '')
  }, [open])

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const maxMB = 0.8
    if (file.size > maxMB * 1024 * 1024) {
      setError('Foto muito grande. Escolha uma imagem menor que 800 KB.')
      e.target.value = ''
      return
    }

    setError('')
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleSaveAccount = async () => {
    setError('')
    if (password && password !== confirmPassword) {
      setError('As senhas não coincidem')
      return
    }
    if (password && password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return
    }
    setSaving(true)
    try {
      // 1. Upload do avatar e salva URL no user_metadata (não depende de coluna no DB)
      let newAvatarUrl = null
      if (avatarFile) {
        const { url } = await uploadAvatar(avatarFile)
        newAvatarUrl = url || null
      }

      // 2. Monta as atualizações de Auth (email, senha, avatar no metadata)
      const authUpdates = {}
      if (email && email !== user?.email) authUpdates.email = email
      if (password) authUpdates.password = password
      if (newAvatarUrl) authUpdates.data = { avatar_url: newAvatarUrl }

      if (Object.keys(authUpdates).length > 0) {
        const { error: authErr } = await updateAuth(authUpdates)
        if (authErr) throw authErr
      }

      // 3. Atualiza nome na tabela profiles (com fallback se coluna avatar_url não existir)
      const profileUpdates = { full_name: name }
      if (newAvatarUrl) profileUpdates.avatar_url = newAvatarUrl

      try {
        await updateProfile(profileUpdates)
      } catch {
        // Coluna avatar_url pode não existir — salva só o nome
        await updateProfile({ full_name: name })
      }

      setSuccess('Perfil atualizado com sucesso!')
      setPassword('')
      setConfirmPassword('')
      setAvatarFile(null)
      setTimeout(() => setSuccess(''), 4000)
    } catch (err) {
      const msg = err.message || ''
      if (msg.includes('too large') || msg.includes('1048576')) {
        setError('Foto muito grande. Escolha uma imagem menor que 800 KB.')
      } else if (msg.includes('Invalid login') || msg.includes('invalid_credentials')) {
        setError('Senha atual incorreta.')
      } else if (msg.includes('Email') || msg.includes('email')) {
        setError('E-mail inválido ou já está em uso.')
      } else {
        setError('Não foi possível salvar. Tente novamente.')
      }
    } finally {
      setSaving(false)
    }
  }

  const handleSaveFinance = async () => {
    if (!plan) {
      setError('Nenhum plano ativo. Conclua o cadastro primeiro.')
      return
    }
    setError('')
    setSaving(true)
    try {
      const result = await savePlan({
        monthly_income: income,
        has_extra_income: hasExtra,
        extra_income_value: hasExtra ? extraValue : 0,
        extra_income_description: hasExtra ? extraDesc : '',
      })
      if (!result) throw new Error('Falha ao salvar plano')
      setSuccess('Dados financeiros atualizados!')
      setTimeout(() => setSuccess(''), 4000)
    } catch (err) {
      setError(err.message || 'Erro ao salvar dados financeiros')
    } finally {
      setSaving(false)
    }
  }

  const avatarSrc = user?.user_metadata?.avatar_url || profile?.avatar_url || null
  const initials = getInitials(profile?.full_name, user?.email)

  return (
    <Modal open={open} onClose={onClose} title="Editar perfil" size="md">
      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-slate-800/60 rounded-xl p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setError(''); setSuccess('') }}
            className={clsx(
              'flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all',
              tab === t.id
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            )}
          >
            <t.icon size={15} />
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Account Tab ── */}
      {tab === 'account' && (
        <div className="space-y-5">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-2">
            <button
              className="relative group w-20 h-20 rounded-full overflow-hidden focus:outline-none ring-2 ring-slate-700 hover:ring-emerald-500/60 transition-all"
              onClick={() => avatarRef.current?.click()}
              type="button"
            >
              {(avatarPreview || avatarSrc) ? (
                <img
                  src={avatarPreview || avatarSrc}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-emerald-500/20 flex items-center justify-center text-2xl font-bold text-emerald-400">
                  {initials}
                </div>
              )}
              <div className="absolute inset-0 bg-black/55 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={22} className="text-white" />
              </div>
            </button>
            <p className="text-xs text-slate-500">Clique para alterar a foto</p>
            <input
              ref={avatarRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          {/* Name */}
          <div>
            <label className="label-text">Nome completo</label>
            <input
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome completo"
            />
          </div>

          {/* Email */}
          <div>
            <label className="label-text">E-mail</label>
            <input
              className="input-field"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
            />
            {email !== user?.email && email && (
              <p className="text-xs text-yellow-400 mt-1">
                Um e-mail de confirmação será enviado para o novo endereço
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-3">
            <div>
              <label className="label-text">
                Nova senha{' '}
                <span className="text-slate-500 font-normal">(deixe em branco para não alterar)</span>
              </label>
              <div className="relative">
                <input
                  className="input-field pr-10"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {password && (
              <div>
                <label className="label-text">Confirmar nova senha</label>
                <input
                  className="input-field"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            )}
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
          {success && (
            <p className="text-emerald-400 text-sm flex items-center gap-1.5">
              <Check size={14} /> {success}
            </p>
          )}

          <Button onClick={handleSaveAccount} loading={saving} className="w-full justify-center">
            Salvar alterações
          </Button>
        </div>
      )}

      {/* ── Finance Tab ── */}
      {tab === 'finance' && (
        <div className="space-y-5">
          {!plan && (
            <div className="rounded-xl bg-yellow-500/10 border border-yellow-500/20 p-3 text-xs text-yellow-300">
              Conclua o cadastro inicial para editar seus dados financeiros aqui.
            </div>
          )}

          <CurrencyInput
            label="Salário mensal"
            value={income}
            onChange={setIncome}
            disabled={!plan}
          />

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <button
                type="button"
                onClick={() => plan && setHasExtra((v) => !v)}
                className={clsx(
                  'relative w-10 h-6 rounded-full transition-colors flex-shrink-0',
                  hasExtra ? 'bg-emerald-500' : 'bg-slate-600',
                  !plan && 'opacity-40 cursor-not-allowed'
                )}
              >
                <span
                  className={clsx(
                    'absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all',
                    hasExtra ? 'left-5' : 'left-1'
                  )}
                />
              </button>
              <span className="text-sm text-slate-300">Tenho renda extra</span>
            </label>

            {hasExtra && plan && (
              <div className="space-y-3 pl-4 border-l border-slate-700/60">
                <CurrencyInput
                  label="Valor da renda extra"
                  value={extraValue}
                  onChange={setExtraValue}
                />
                <div>
                  <label className="label-text">Descrição</label>
                  <input
                    className="input-field"
                    value={extraDesc}
                    onChange={(e) => setExtraDesc(e.target.value)}
                    placeholder="Ex: Freelance, aluguel, comissão…"
                  />
                </div>
              </div>
            )}
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
          {success && (
            <p className="text-emerald-400 text-sm flex items-center gap-1.5">
              <Check size={14} /> {success}
            </p>
          )}

          <Button
            onClick={handleSaveFinance}
            loading={saving}
            disabled={!plan}
            className="w-full justify-center"
          >
            Salvar dados financeiros
          </Button>
        </div>
      )}
    </Modal>
  )
}
