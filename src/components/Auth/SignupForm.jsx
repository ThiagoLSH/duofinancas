import { useState } from 'react'
import { Mail, Lock, User, Phone, Eye, EyeOff, AlertCircle, CheckCircle, ChevronDown } from 'lucide-react'
import { Button } from '../UI/Button'
import { useAuthContext } from '../../context/AuthContext'

const NIVEIS_FORMATIVOS = ['P1', 'P2', 'D1', 'D2', 'T1', 'T2', 'T3', 'T4', 'T5', 'Permanente', 'Definitivo']

const TIPO_VINCULO_OPTIONS = [
  { value: 'comunidade_alianca', label: 'Membro da Comunidade de Aliança', percentual: 15 },
  { value: 'vocacionado', label: 'Vocacionado', percentual: 15 },
  { value: 'obra', label: 'Membro da Obra', percentual: 10 },
]

const SelectField = ({ label, value, onChange, options, placeholder }) => (
  <div>
    <label className="label-text">{label}</label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-field appearance-none pr-9 w-full"
        required
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
            {typeof opt === 'string' ? opt : opt.label}
          </option>
        ))}
      </select>
      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
    </div>
  </div>
)

const TextField = ({ label, value, onChange, placeholder, icon: Icon }) => (
  <div>
    <label className="label-text">{label}</label>
    <div className="relative">
      {Icon && <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`input-field ${Icon ? 'pl-9' : ''}`}
        required
      />
    </div>
  </div>
)

export const SignupForm = ({ onSwitch }) => {
  const { signUpWithEmail } = useAuthContext()

  // Dados básicos
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [telefone, setTelefone] = useState('')

  // Vínculo
  const [tipoVinculo, setTipoVinculo] = useState('')

  // Campos Comunidade de Aliança
  const [nivelFormativo, setNivelFormativo] = useState('')
  const [celula, setCelula] = useState('')
  const [formador, setFormador] = useState('')

  // Campos Vocacionado / Obra
  const [grupoOracao, setGrupoOracao] = useState('')
  const [pastor, setPastor] = useState('')
  const [acompanhador, setAcompanhador] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const percentual = TIPO_VINCULO_OPTIONS.find(o => o.value === tipoVinculo)?.percentual || null

  const formatTelefone = (val) => {
    // Remove tudo que não é número
    const nums = val.replace(/\D/g, '')
    // Formata para exibição: (84) 99999-9999
    if (nums.length <= 2) return nums
    if (nums.length <= 7) return `(${nums.slice(0, 2)}) ${nums.slice(2)}`
    if (nums.length <= 11) return `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7)}`
    return `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7, 11)}`
  }

  const handleTelefone = (val) => {
    setTelefone(formatTelefone(val))
  }

  const getTelefoneRaw = () => {
    // Converte para formato Evolution API: 5584XXXXXXXXX
    const nums = telefone.replace(/\D/g, '')
    return nums.length === 11 ? `55${nums}` : nums
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) return setError('Senha precisa ter ao menos 6 caracteres')
    if (!tipoVinculo) return setError('Selecione seu tipo de vínculo')
    if (telefone.replace(/\D/g, '').length < 10) return setError('Telefone inválido')

    setLoading(true)

    const metadata = {
      name,
      telefone: getTelefoneRaw(),
      tipo_vinculo: tipoVinculo,
      percentual,
      ...(tipoVinculo === 'comunidade_alianca' && {
        nivel_formativo: nivelFormativo,
        celula,
        formador_comunitario: formador,
      }),
      ...(tipoVinculo !== 'comunidade_alianca' && {
        grupo_oracao: grupoOracao,
        pastor_grupo: pastor,
        acompanhador,
      }),
    }

    const { error } = await signUpWithEmail(email, password, name, metadata)
    if (error) setError(error.message)
    else setSuccess(true)

    setLoading(false)
  }

  if (success) {
    return (
      <div className="text-center space-y-4 py-6">
        <CheckCircle size={48} className="text-emerald-400 mx-auto" />
        <h3 className="text-xl font-bold text-slate-100">Conta criada!</h3>
        <p className="text-slate-400 text-sm">
          Verifique seu email <strong>{email}</strong> para confirmar sua conta.
        </p>
        <Button onClick={onSwitch} variant="outline" className="mx-auto">
          Ir para o login
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSignup} className="space-y-4">

        {/* Dados básicos */}
        <TextField label="Nome completo" value={name} onChange={setName} placeholder="Seu nome" icon={User} />
        <TextField label="Email" value={email} onChange={setEmail} placeholder="seu@email.com" icon={Mail} />

        <div>
          <label className="label-text">Senha</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="input-field pl-9 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Telefone */}
        <div>
          <label className="label-text">Telefone (WhatsApp)</label>
          <div className="relative">
            <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="tel"
              value={telefone}
              onChange={(e) => handleTelefone(e.target.value)}
              placeholder="(84) 99999-9999"
              className="input-field pl-9"
              required
            />
          </div>
        </div>

        {/* Tipo de vínculo */}
        <SelectField
          label="Tipo de vínculo"
          value={tipoVinculo}
          onChange={setTipoVinculo}
          options={TIPO_VINCULO_OPTIONS}
          placeholder="Selecione seu vínculo"
        />

        {/* Badge percentual */}
        {percentual && (
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-2">
            <CheckCircle size={14} className="text-emerald-400" />
            <span className="text-emerald-300 text-sm">
              Comunhão de Bens: <strong>{percentual}%</strong> da renda mensal
            </span>
          </div>
        )}

        {/* Campos Comunidade de Aliança */}
        {tipoVinculo === 'comunidade_alianca' && (
          <>
            <SelectField
              label="Nível formativo"
              value={nivelFormativo}
              onChange={setNivelFormativo}
              options={NIVEIS_FORMATIVOS}
              placeholder="Selecione seu nível"
            />
            <TextField label="Célula comunitária" value={celula} onChange={setCelula} placeholder="Nome da sua célula" />
            <TextField label="Formador comunitário" value={formador} onChange={setFormador} placeholder="Nome do formador" />
          </>
        )}

        {/* Campos Vocacionado / Obra */}
        {(tipoVinculo === 'vocacionado' || tipoVinculo === 'obra') && (
          <>
            <TextField label="Grupo de oração" value={grupoOracao} onChange={setGrupoOracao} placeholder="Nome do grupo" />
            <TextField label="Pastor do grupo" value={pastor} onChange={setPastor} placeholder="Nome do pastor" />
            <TextField label="Acompanhador" value={acompanhador} onChange={setAcompanhador} placeholder="Nome do acompanhador" />
          </>
        )}

        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg">
            <AlertCircle size={15} />
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" loading={loading}>
          Criar conta grátis
        </Button>
      </form>

      <p className="text-center text-sm text-slate-400">
        Já tem conta?{' '}
        <button onClick={onSwitch} className="text-emerald-400 hover:text-emerald-300 font-medium">
          Entrar
        </button>
      </p>
    </div>
  )
}