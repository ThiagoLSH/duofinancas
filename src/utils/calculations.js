// Cálculos financeiros centrais

export const calcTotalIncome = (plan) => {
  if (!plan) return 0
  const base = parseFloat(plan.monthly_income) || 0
  const extra = plan.has_extra_income ? (parseFloat(plan.extra_income_value) || 0) : 0
  if (plan.plan_type === 'couple') {
    const partnerBase = parseFloat(plan.partner_monthly_income) || 0
    const partnerExtra = plan.partner_has_extra_income
      ? (parseFloat(plan.partner_extra_income_value) || 0) : 0
    return base + extra + partnerBase + partnerExtra
  }
  return base + extra
}

export const calcPerson1Income = (plan) => {
  if (!plan) return 0
  const base = parseFloat(plan.monthly_income) || 0
  const extra = plan.has_extra_income ? (parseFloat(plan.extra_income_value) || 0) : 0
  return base + extra
}

export const calcPerson2Income = (plan) => {
  if (!plan) return 0
  const base = parseFloat(plan.partner_monthly_income) || 0
  const extra = plan.partner_has_extra_income
    ? (parseFloat(plan.partner_extra_income_value) || 0) : 0
  return base + extra
}

export const calcFixedExpenses = (expenses) => {
  if (!expenses) return 0
  return expenses
    .filter((e) => e.expense_type === 'fixed')
    .reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0)
}

export const calcVariableExpenses = (expenses) => {
  if (!expenses) return 0
  return expenses
    .filter((e) => e.expense_type === 'variable')
    .reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0)
}

export const calcTotalExpenses = (expenses) => {
  if (!expenses) return 0
  return expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0)
}

export const calcFreeBalance = (plan, expenses) => {
  return calcTotalIncome(plan) - calcTotalExpenses(expenses)
}

export const calcCommittedPercent = (plan, expenses) => {
  const income = calcTotalIncome(plan)
  if (!income) return 0
  return (calcTotalExpenses(expenses) / income) * 100
}

export const calcRequiredMonthlySavings = (plan, expenses) => {
  if (!plan || !plan.goal_target_value || !plan.goal_timeframe) return 0
  const target = parseFloat(plan.goal_target_value) || 0
  const timeframeMonths = {
    '3_meses': 3,
    '6_meses': 6,
    '1_ano': 12,
    '2_anos': 24,
    '5_anos': 60,
  }
  const months = timeframeMonths[plan.goal_timeframe] || 12
  const emergencyFund = plan.has_emergency_fund ? (parseFloat(plan.emergency_fund_value) || 0) : 0
  const remaining = Math.max(0, target - emergencyFund)
  return remaining / months
}

export const getFinancialHealth = (committedPercent) => {
  if (committedPercent < 70) return { status: 'green', label: 'Saudável', color: '#10B981' }
  if (committedPercent <= 90) return { status: 'yellow', label: 'Atenção', color: '#F59E0B' }
  return { status: 'red', label: 'Crítico', color: '#EF4444' }
}

export const calcExpensesByCategory = (expenses) => {
  if (!expenses) return []
  const map = {}
  expenses.forEach((e) => {
    const key = e.category
    map[key] = (map[key] || 0) + (parseFloat(e.amount) || 0)
  })
  return Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
}

export const calcTopExpenses = (expenses, limit = 5) => {
  if (!expenses) return []
  return [...expenses]
    .sort((a, b) => (parseFloat(b.amount) || 0) - (parseFloat(a.amount) || 0))
    .slice(0, limit)
}

export const calcSharedExpenses = (expenses, sharedPercent = 50) => {
  if (!expenses) return { shared: 0, person1: 0, person2: 0 }
  let shared = 0, person1 = 0, person2 = 0
  expenses.forEach((e) => {
    const amt = parseFloat(e.amount) || 0
    if (e.ownership === 'shared') {
      shared += amt
      person1 += amt * (sharedPercent / 100)
      person2 += amt * ((100 - sharedPercent) / 100)
    } else if (e.ownership === 'person_1') {
      person1 += amt
    } else if (e.ownership === 'person_2') {
      person2 += amt
    }
  })
  return { shared, person1, person2 }
}

export const generateRecommendations = (plan, expenses) => {
  const recommendations = []
  if (!plan || !expenses) return recommendations

  const totalIncome = calcTotalIncome(plan)
  const totalExpenses = calcTotalExpenses(expenses)
  const committedPercent = calcCommittedPercent(plan, expenses)
  const freeBalance = calcFreeBalance(plan, expenses)

  if (committedPercent > 90) {
    recommendations.push({
      type: 'danger',
      icon: '🔴',
      title: 'Gastos comprometendo mais de 90% da renda',
      description: 'Situação crítica — revise despesas variáveis com urgência.',
    })
  } else if (committedPercent > 70) {
    recommendations.push({
      type: 'warning',
      icon: '🟡',
      title: 'Gastos entre 70% e 90% da renda',
      description: 'Há margem reduzida. Considere cortar gastos variáveis.',
    })
  } else {
    recommendations.push({
      type: 'success',
      icon: '🟢',
      title: 'Orçamento saudável',
      description: `Você tem ${((100 - committedPercent)).toFixed(0)}% da renda disponível. Continue assim!`,
    })
  }

  if (!plan.has_emergency_fund || (parseFloat(plan.emergency_fund_value) || 0) < totalIncome * 3) {
    const target = totalIncome * 6
    const current = plan.has_emergency_fund ? (parseFloat(plan.emergency_fund_value) || 0) : 0
    recommendations.push({
      type: 'info',
      icon: '🏦',
      title: 'Reserva de emergência',
      description: `Meta ideal: 6x a renda mensal (R$ ${(target).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}). Faltam R$ ${(target - current).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}.`,
    })
  }

  if (plan.has_overdue_debts) {
    recommendations.push({
      type: 'danger',
      icon: '💸',
      title: 'Dívidas em atraso detectadas',
      description: 'Priorize quitar dívidas com juros altos antes de investir.',
    })
  }

  if (plan.goal_target_value) {
    const required = calcRequiredMonthlySavings(plan, expenses)
    if (required > freeBalance) {
      recommendations.push({
        type: 'warning',
        icon: '🎯',
        title: 'Meta financeira desafiadora',
        description: `Você precisa guardar R$ ${required.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}/mês, mas tem saldo livre de R$ ${freeBalance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}. Revise o prazo ou reduza gastos.`,
      })
    } else if (required > 0) {
      recommendations.push({
        type: 'success',
        icon: '🎯',
        title: 'Meta alcançável!',
        description: `Guardando R$ ${required.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}/mês você atinge sua meta no prazo.`,
      })
    }
  }

  // Categorias com gasto alto
  const byCategory = calcExpensesByCategory(expenses)
  byCategory.forEach((cat) => {
    const pct = totalIncome > 0 ? (cat.value / totalIncome) * 100 : 0
    if (pct > 30) {
      recommendations.push({
        type: 'warning',
        icon: '📊',
        title: `${cat.name} comprometendo ${pct.toFixed(0)}% da renda`,
        description: 'Categoria acima do recomendado. Avalie se pode reduzir.',
      })
    }
  })

  return recommendations
}
