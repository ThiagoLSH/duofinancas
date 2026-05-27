# DuoFinanças

Plataforma de gestão financeira pessoal desenvolvida para membros da **Comunidade Shalom**. O app centraliza o planejamento do orçamento mensal, o cálculo automático da **Comunhão de Bens (CB)** e o acompanhamento de metas financeiras — tudo num único lugar, acessível de qualquer dispositivo.

---

## O que é

Membros da Comunidade Shalom possuem um compromisso de partilha financeira (CB) cujo percentual varia conforme o vínculo:

| Vínculo | Percentual |
|---|---|
| Comunidade de Aliança | 15% (10% Obra + 5% Necessitados) |
| Vocacionados | 15% |
| Membros da Obra | 10% |

O DuoFinanças automatiza esse cálculo, envia lembretes mensais via WhatsApp e ainda oferece um planejamento financeiro completo para que o membro organize receitas, despesas e metas com clareza.

---

## Funcionalidades

### Planejamento financeiro guiado
Wizard passo a passo que coleta renda, despesas fixas e variáveis, e gera um plano financeiro personalizado com distribuição recomendada do orçamento.

### Comunhão de Bens (CB)
- Cálculo automático do valor da CB com base no vínculo e renda informados
- Histórico de pagamentos e **streak de fidelidade** (marcos em 3, 6 e 12 meses consecutivos)
- Lembrete mensal via WhatsApp integrado com N8N + Evolution API
- Geração de QR Code PIX com o valor exato

### Dashboard financeiro
- Gráficos de gastos por categoria (donut chart)
- Comparativo entre parceiros do casal
- Maiores despesas do mês (bar chart)
- Resumo do saldo disponível, metas e CB

### Metas financeiras
Criação e acompanhamento de objetivos financeiros com valor-alvo, prazo e progresso visual.

### Simulador "E se?"
Simule cenários — "E se eu aumentar minha renda em R$ 500?" — e visualize o impacto no orçamento e na CB.

### Exportação em PDF
Relatório completo do planejamento financeiro exportável em PDF para consulta offline ou envio.

### Sincronização em tempo real
Supabase Realtime mantém os dados atualizados entre dispositivos simultaneamente.

---

## Tech Stack

| Camada | Tecnologia |
|---|---|
| Frontend | React 19 + Vite |
| Estilização | Tailwind CSS |
| Banco de dados / Auth | Supabase (PostgreSQL + Row Level Security) |
| Gráficos | Recharts |
| PDF | jsPDF + html2canvas |
| QR Code | qrcode.react |
| Deploy | Netlify |

---

## Começando

### Pré-requisitos

- Node.js 20+
- Conta no [Supabase](https://supabase.com)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/thiagoow7534/duofinancas.git
cd duofinancas

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais do Supabase
```

### Variáveis de ambiente

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

### Banco de dados

Execute o schema SQL no seu projeto Supabase:

```bash
# Via Supabase CLI
supabase db push

# Ou cole o conteúdo de supabase/schema.sql no SQL Editor do painel Supabase
```

### Rodando localmente

```bash
npm run dev
```

Acesse `http://localhost:5173`.

### Build para produção

```bash
npm run build
```

---

## Deploy

O projeto está configurado para deploy automático no Netlify via `netlify.toml`. Basta conectar o repositório e definir as variáveis de ambiente `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` no painel do Netlify.

---

## Estrutura do projeto

```
src/
├── components/
│   ├── Auth/          # Login e SignUp
│   ├── Charts/        # Gráficos (donut, barras, comparativo casal)
│   ├── ComunhaoDeBens/# Módulo completo da CB
│   ├── Features/      # Metas, simulador, PDF, perfil
│   ├── Layout/        # Header, barra de progresso
│   ├── Steps/         # Etapas do wizard (anamnese, despesas, dashboard)
│   └── UI/            # Componentes base (Button, Card, Modal, Toast…)
├── context/           # AuthContext e FinanceContext
├── hooks/             # Lógica reutilizável (expenses, goals, plan, realtime…)
├── lib/               # Cliente Supabase
├── pages/             # LandingPage, AuthPage, PlannerPage, AppPage
└── utils/             # Cálculos, formatadores, gerador de PDF, PIX
```

---

## Segurança

- Autenticação gerenciada pelo Supabase Auth
- **Row Level Security (RLS)** ativa em todas as tabelas — cada usuário acessa apenas seus próprios dados
- Variáveis de ambiente nunca são commitadas (`.env` listado no `.gitignore`)

---

## Licença

Projeto desenvolvido como ferramenta de serviço para a Comunidade Shalom. Uso interno — não destinado a distribuição comercial.
