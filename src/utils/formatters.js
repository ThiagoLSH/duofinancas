// Formata valor para moeda brasileira
export const formatCurrency = (value) => {
  const num = parseFloat(value) || 0
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(num)
}

// Formata valor numérico para exibição (sem símbolo R$)
export const formatNumber = (value) => {
  const num = parseFloat(value) || 0
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)
}

// Converte string formatada em número (ex: "1.234,56" → 1234.56)
export const parseCurrency = (str) => {
  if (!str) return 0
  const cleaned = String(str)
    .replace(/[R$\s]/g, '')
    .replace(/\./g, '')
    .replace(',', '.')
  return parseFloat(cleaned) || 0
}

// Formata porcentagem
export const formatPercent = (value, decimals = 1) => {
  return `${(parseFloat(value) || 0).toFixed(decimals)}%`
}

// Formata data
export const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Intl.DateTimeFormat('pt-BR').format(new Date(dateStr))
}

// Mapas de rótulos
export const GOAL_LABELS = {
  quitar_dividas: 'Quitar dívidas',
  montar_reserva: 'Montar reserva de emergência',
  investir: 'Começar a investir',
  comprar_algo: 'Comprar algo específico',
  viajar: 'Fazer uma viagem',
  outro: 'Outro objetivo',
}

export const TIMEFRAME_LABELS = {
  '3_meses': '3 meses',
  '6_meses': '6 meses',
  '1_ano': '1 ano',
  '2_anos': '2 anos',
  '5_anos': '5 anos',
}

export const UNIFIED_LABELS = {
  sim: 'Sim, finanças unificadas',
  parcialmente: 'Parcialmente',
  nao: 'Não, finanças separadas',
}

export const OWNERSHIP_LABELS = {
  shared: 'Compartilhada',
  person_1: 'Só minha',
  person_2: 'Só do(a) parceiro(a)',
}
