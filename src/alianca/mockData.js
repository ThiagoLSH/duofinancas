// Helpers and mock data — Aliança UI kit.
// Replace these with real data from your FinanceContext / Supabase hooks when integrating.

// ─────────── Formatters ───────────
export const fmt = (n) =>
  'R$ ' + Number(n || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const fmtCompact = (n) => {
  const v = Number(n || 0);
  if (v >= 1000) return 'R$ ' + (v / 1000).toFixed(1).replace('.', ',') + 'k';
  return 'R$ ' + v.toLocaleString('pt-BR');
};

export const fmtPct = (n) => Number(n || 0).toFixed(0) + '%';

// ─────────── Mock data (substitua pelos dados reais) ───────────
export const COUPLE = {
  type: 'couple',
  p1: { name: 'João', income: 5500, color: '#2D2D8F' },
  p2: { name: 'Maria', income: 4300, color: '#E5A53C' },
  sharedPct: 60,
};

export const INCOME_TOTAL = COUPLE.p1.income + COUPLE.p2.income; // 9800

export const FIXED_EXPENSES = [
  { id: 'f1', name: 'Aluguel', cat: 'Moradia', amount: 1800, icon: '🏠', ownership: 'shared' },
  { id: 'f2', name: 'Condomínio', cat: 'Moradia', amount: 480, icon: '🏢', ownership: 'shared' },
  { id: 'f3', name: 'Energia + Água', cat: 'Moradia', amount: 280, icon: '💡', ownership: 'shared' },
  { id: 'f4', name: 'Internet + Streaming', cat: 'Moradia', amount: 220, icon: '📡', ownership: 'shared' },
  { id: 'f5', name: 'Plano de saúde', cat: 'Saúde', amount: 450, icon: '🏥', ownership: 'shared' },
  { id: 'f6', name: 'Combustível', cat: 'Transporte', amount: 420, icon: '⛽', ownership: 'person_1' },
  { id: 'f7', name: 'Academia', cat: 'Saúde', amount: 180, icon: '🏋️', ownership: 'person_2' },
  { id: 'f8', name: 'Curso de inglês', cat: 'Educação', amount: 350, icon: '🎓', ownership: 'person_1' },
];

export const VARIABLE_EXPENSES = [
  { id: 'v1', name: 'Mercado', cat: 'Alimentação', amount: 950, icon: '🛒', ownership: 'shared' },
  { id: 'v2', name: 'Restaurantes', cat: 'Alimentação', amount: 380, icon: '🍔', ownership: 'shared' },
  { id: 'v3', name: 'Uber + Apps', cat: 'Transporte', amount: 180, icon: '🚗', ownership: 'shared' },
  { id: 'v4', name: 'Lazer e cinema', cat: 'Lazer', amount: 320, icon: '🎬', ownership: 'shared' },
  { id: 'v5', name: 'Vestuário', cat: 'Outros', amount: 260, icon: '👕', ownership: 'person_2' },
];

export const FIXED_CATEGORIES = [
  { category: 'Aluguel/Financiamento', icon: '🏠' },
  { category: 'Energia elétrica', icon: '💡' },
  { category: 'Água', icon: '💧' },
  { category: 'Internet', icon: '📶' },
  { category: 'Celular', icon: '📱' },
  { category: 'Parcela veículo', icon: '🚗' },
  { category: 'Combustível/Transporte', icon: '⛽' },
  { category: 'Supermercado', icon: '🛒' },
  { category: 'Plano de saúde', icon: '🏥' },
  { category: 'Farmácia', icon: '💊' },
  { category: 'Educação', icon: '🎓' },
  { category: 'Empréstimo/Cartão', icon: '🏦' },
  { category: 'Pet', icon: '🐾' },
];
export const VARIABLE_CATEGORIES = [
  { category: 'Lazer', icon: '🎬' },
  { category: 'Delivery/Restaurantes', icon: '🍔' },
  { category: 'Roupas/Acessórios', icon: '👕' },
  { category: 'Assinaturas', icon: '📺' },
  { category: 'Cuidados pessoais', icon: '💇' },
  { category: 'Presentes', icon: '🎁' },
  { category: 'Viagens/Passeios', icon: '✈️' },
  { category: 'Compras online', icon: '🛍️' },
];

export const TOTAL_FIXED = FIXED_EXPENSES.reduce((s, e) => s + e.amount, 0);
export const TOTAL_VAR = VARIABLE_EXPENSES.reduce((s, e) => s + e.amount, 0);

export const CB_PCT = 0.15;
export const CB_VALUE = INCOME_TOTAL * CB_PCT; // 1470
export const CB_OBRA = INCOME_TOTAL * 0.10;    // 980
export const CB_NEC = INCOME_TOTAL * 0.05;     // 490
export const FREE_BALANCE = INCOME_TOTAL - TOTAL_FIXED - TOTAL_VAR - CB_VALUE;

export const BY_CATEGORY = (() => {
  const all = [...FIXED_EXPENSES, ...VARIABLE_EXPENSES];
  const m = {};
  all.forEach((e) => { m[e.cat] = (m[e.cat] || 0) + e.amount; });
  return Object.entries(m)
    .map(([cat, amount]) => ({ cat, amount }))
    .sort((a, b) => b.amount - a.amount);
})();

export const TOP_EXPENSES = [...FIXED_EXPENSES, ...VARIABLE_EXPENSES]
  .sort((a, b) => b.amount - a.amount).slice(0, 5);

export const CB_HISTORY = (() => {
  const months = ['Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai'];
  const amounts = [1320, 0, 1380, 0, 1410, 1410, 1440, 1440, 1440, 1470, 1470, 1470];
  return months.map((m, i) => ({ month: m, amount: amounts[i], paid: amounts[i] > 0 }));
})();

export const STREAK = 8;
export const STREAK_MILESTONES = [3, 6, 12];
export const NEXT_MILESTONE = 12;

export const GOALS = [
  { name: 'Reserva de emergência', target: 30000, current: 23400, due: 'Dez 2026', icon: '🛟', color: 'emerald' },
  { name: 'Viagem Roma 2026',       target: 18000, current: 6300,  due: 'Out 2026', icon: '✈️', color: 'sky' },
  { name: 'Entrada do apartamento', target: 60000, current: 14200, due: 'Mar 2028', icon: '🏡', color: 'amber' },
];

export const PROFILE = {
  full_name: 'João Silva Mendes',
  email: 'joao.mendes@email.com',
  initials: 'JM',
  age: 32,
  occupation: 'Analista de Sistemas',
  monthly_income: 5500,
  has_extra_income: true,
  extra_income_value: 800,
  extra_income_description: 'Freelance de design',
  has_emergency_fund: true,
  emergency_fund_value: 12000,
  has_overdue_debts: false,
  telefone: '5584999887766',
  telefone_display: '+55 (84) 99988-7766',
  tipo_vinculo: 'Comunidade de Aliança',
  percentual: 15,
  dia_lembrete: 5,
  lembrete_whatsapp: true,
  lembrete_browser: true,
};

export const SCENARIOS = [
  { id: 's1', name: 'Sem delivery', delta: 380, notes: 'Cortar restaurantes do mês.' },
  { id: 's2', name: 'Internet mais barata', delta: 80, notes: 'Migrar para plano básico.' },
];

export const RECOMMENDATIONS = [
  { type: 'success', icon: '✨', title: 'Saldo livre saudável',
    desc: 'Vocês comprometem 79% da renda — abaixo do limite de 85%. Continue assim!' },
  { type: 'info', icon: '🎯', title: 'Acelere a Reserva',
    desc: 'Faltam R$ 6.600 para concluir. Aumentar a poupança em R$ 700/mês cumpre a meta em Dez.' },
  { type: 'warning', icon: '🍽️', title: 'Restaurantes acima da média',
    desc: 'R$ 380 esse mês — 27% acima da sua média trimestral. Reveja se necessário.' },
];

export const WIZARD_STEPS = [
  { id: 'perfil', label: 'Perfil', short: '01' },
  { id: 'renda', label: 'Renda', short: '02' },
  { id: 'fixas', label: 'Fixas', short: '03' },
  { id: 'variaveis', label: 'Variáveis', short: '04' },
  { id: 'cb', label: 'Comunhão', short: '05' },
  { id: 'metas', label: 'Metas', short: '06' },
];
