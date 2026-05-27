# Aliança — UI kit do DuoFinanças

Sistema visual completo da direção **02 · Aliança** (fintech moderno, indigo + amber, Sora variable).
Drop-in para seu projeto **React 19 + Vite + Tailwind**.

---

## Conteúdo

```
alianca-export/
├── alianca.css                       Tokens (CSS vars) + classes base
├── mockData.js                       Dados de exemplo + formatadores (fmt, fmtCompact...)
├── index.js                          Barrel — importe tudo daqui
├── components/
│   └── AliancaShared.jsx             AlIcon, AlSidebar, AlAreaChart + AliancaDashboard
└── screens/
    ├── AliancaCBModule.jsx           CB module, Mobile, Onboarding Renda (passo 2)
    ├── AliancaProfileCB.jsx          Editar perfil + Configurar lembrete CB
    ├── AliancaExpenses.jsx           Despesas Fixas + Variáveis
    └── AliancaFeatures.jsx           Metas, Simulador "E se?", Anamnese (passo 1)
```

Total: **11 telas** prontas (dashboard, CB module, CB config, despesas fixas, despesas
variáveis, metas, simulador, perfil, anamnese, onboarding renda, mobile dashboard).

---

## Como integrar

### 1. Copie a pasta para `src/`

```bash
cp -r alianca-export src/alianca
```

### 2. Importe o CSS uma vez (em `main.jsx`)

```jsx
import './alianca/alianca.css';
```

### 3. Use um componente

```jsx
import { AliancaDashboard } from './alianca';

export default function AppPage() {
  return <AliancaDashboard />;
}
```

### 4. Troque os dados mock pelos reais

Os componentes leem de `mockData.js` (importações no topo de cada arquivo).
Para plugar nos seus hooks (`useExpenses`, `useGoals`, `useFinanceContext`),
passe via props ou substitua os imports.

**Padrão sugerido — props com defaults:**

```jsx
// Antes (mock direto):
const AliancaDashboard = () => {
  // usa INCOME_TOTAL, FIXED_EXPENSES, GOALS, etc. de mockData.js
};

// Depois (props):
const AliancaDashboard = ({
  income = INCOME_TOTAL,
  fixedExpenses = FIXED_EXPENSES,
  goals = GOALS,
  // ...
}) => {
  // mesmo render, mas com dados de fora
};

// No seu wrapper:
function DashboardPage() {
  const { plan, expenses } = useFinanceContext();
  const { goals } = useGoals();
  return (
    <AliancaDashboard
      income={calcTotalIncome(plan)}
      fixedExpenses={expenses.filter(e => e.expense_type === 'fixed')}
      goals={goals}
    />
  );
}
```

---

## Componentes exportados

| Nome | Tela | Hook real correspondente |
|---|---|---|
| `AliancaDashboard` | Dashboard principal (KPIs, charts, CB strip, metas, recomendações) | `useFinanceContext`, `useExpenses` |
| `AliancaCBModule` | Módulo Comunhão (calculadora, histórico, streak) | `useCBConfig`, `useCBHistorico` |
| `AliancaCBConfig` | Configurar lembrete CB (form + prévia WhatsApp) | `useCBConfig` |
| `AliancaFixedExpenses` | Tabela de despesas fixas com ownership | `useExpenses` |
| `AliancaVariableExpenses` | Tabela de despesas variáveis | `useExpenses` |
| `AliancaGoals` | Metas (lista, criar, pausar, concluir) | `useGoals` |
| `AliancaSimulator` | Simulador "E se?" (sliders + before/after) | `useScenarios` |
| `AliancaProfile` | Editar perfil (3 tabs: Conta, Finanças, Comunidade) | `useAuthContext`, `usePlan` |
| `AliancaAnamnesis` | Onboarding passo 1 (dados do casal, meta principal) | `usePlan` |
| `AliancaOnboarding` | Onboarding passo 2 (renda) | `usePlan` |
| `AliancaMobile` | Dashboard mobile | mesmo do desktop |

E os primitivos:

- `AlIcon` — ícones geométricos (`shape`: home, dove, target, flask, list, settings, plus, arrow)
- `AlSidebar` — navegação lateral com avatar do casal
- `AlAreaChart` — gráfico de área para histórico CB

---

## Tokens (CSS variables)

Todas as variáveis ficam escopadas em `.alianca-root` para não colidir com seu tema dark/emerald atual:

```css
--al-bg: #F4F5F9;
--al-paper: #FFFFFF;
--al-ink: #0B0F1F;
--al-indigo: #2D2D8F;
--al-amber: #E5A53C;
--al-green: #1D8F6A;
/* ... ver alianca.css completo */
```

Para customizar, sobrescreva em uma classe filha:
```css
.alianca-root.custom { --indigo: #4040A8; }
```

---

## Fontes

O CSS importa **Sora** via Google Fonts (linha 1 do `alianca.css`).
Se você já tem um sistema de fontes (Inter no `tailwind.config.js`),
remova a linha `@import url(...)` se quiser usar só a Inter — a font-stack
de fallback inclui Inter como segunda opção.

---

## Ícones

Os componentes usam o `AlIcon` (SVGs geométricos próprios) para se manterem
auto-contidos. Se preferir `lucide-react` (que já está nas suas dependências),
basta substituir as chamadas:

```jsx
// Antes:
<AlIcon shape="dove" />

// Depois:
import { Bird } from 'lucide-react';
<Bird size={14} />
```

---

## Comportamento

- **Auto-save visual**: as edições de campo são instantâneas (state local).
  Plugue um `useEffect` com debounce + `saveExpenses(...)` no seu wrapper.
- **Charts**: SVG puro, sem dependências. Se preferir trocar pelo Recharts
  (já tem no projeto), os shapes de dados são compatíveis com o que o
  `ExpenseDonut` e `TopExpensesBar` já consomem.
- **Density / Color tweaks**: o componente aceita `tweaks` como prop. Por
  enquanto é ignorado, mas serve de gancho para você adicionar suas
  configurações de UI.

---

## Próximos passos sugeridos

1. Copiar e testar 1 tela (sugiro `AliancaDashboard`) com dados estáticos
2. Migrar os dados para seus hooks (`useFinanceContext`, `useExpenses`...)
3. Substituir as outras telas conforme for migrando
4. Ajustar a cor do `--indigo` se quiser puxar para o teu emerald atual
   (mantendo o resto do sistema)

Qualquer dúvida sobre integração específica, é só chamar.
