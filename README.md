# 🤖 Smart ATS — AI Copilot

Sistema inteligente de **Applicant Tracking System (ATS)** com motor de IA para triagem automática de currículos, busca semântica de talentos e gestão completa de pipelines de recrutamento.

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [Instalação](#-instalação)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Rotas](#-rotas)
- [Integrações](#-integrações)
- [Design System](#-design-system)
- [Contribuição](#-contribuição)

---

## 🎯 Visão Geral

O **Smart ATS** é uma plataforma moderna de recrutamento que combina automação com Inteligência Artificial para otimizar o processo de seleção. O sistema analisa currículos automaticamente, atribui scores de compatibilidade e permite buscas semânticas no banco de talentos usando linguagem natural.

### Dois portais distintos

| Portal | Rota | Público-alvo |
|--------|------|---------------|
| **Painel RH** | `/` | Equipa de Recursos Humanos |
| **Portal de Carreiras** | `/carreiras` | Candidatos externos |

---

## ✨ Funcionalidades

### Painel do RH (interno)

- **Dashboard** — Visão geral com métricas e atividades recentes
- **Vagas Ativas** — Gestão de vagas abertas com criação e edição
- **Pipeline Kanban** — Board drag-and-drop para gerir candidatos por etapa (Novo → Triagem → Entrevista → Rejeitado)
- **Enviar CV** — Upload manual de currículos para análise por IA
- **Busca de Talentos** — Pesquisa semântica (vetorial) no banco de currículos usando linguagem natural
- **Modal do Candidato** — Visualização detalhada com:
  - Score de IA com justificação
  - Resumo gerado por IA
  - Pontos fortes e fracos
  - Texto extraído do CV
  - Download do PDF original
- **Configurações** — Parâmetros do sistema

### Portal de Carreiras (público)

- Listagem de vagas abertas com pesquisa por texto
- Candidatura com upload de currículo
- Interface responsiva e acessível

---

## 🛠 Tecnologias

### Frontend

| Tecnologia | Utilização |
|------------|-----------|
| **React 18** | Biblioteca UI com componentes funcionais e hooks |
| **TypeScript** | Tipagem estática para segurança e DX |
| **Vite** | Build tool rápido com HMR |
| **Tailwind CSS** | Framework utility-first para estilização |
| **shadcn/ui** | Componentes acessíveis baseados em Radix UI |
| **React Router v6** | Routing SPA com nested routes |
| **TanStack React Query** | Gestão de estado assíncrono e cache |
| **@hello-pangea/dnd** | Drag and drop para o Kanban board |
| **Recharts** | Gráficos e visualizações de dados |
| **Lucide React** | Ícones consistentes |

### Backend (externo)

| Serviço | Utilização |
|---------|-----------|
| **Webhooks n8n / Make** | Orquestração de workflows de IA |
| **Supabase Storage** | Armazenamento de PDFs de currículos |
| **Motor Vetorial** | Busca semântica de candidatos |

---

## 🏗 Arquitetura

```
┌─────────────────────────────────────────────┐
│                  Frontend                    │
│          React + TypeScript + Vite           │
├──────────┬──────────┬───────────┬────────────┤
│ Dashboard│  Vagas   │  Pipeline │  Busca IA  │
│          │          │  Kanban   │  Semântica  │
└────┬─────┴────┬─────┴─────┬─────┴─────┬──────┘
     │          │           │           │
     ▼          ▼           ▼           ▼
┌─────────────────────────────────────────────┐
│           API Webhooks (Backend)             │
│    n8n / Make — Orquestração de IA           │
├─────────────────────────────────────────────┤
│  • POST /webhook/receber-curriculo          │
│  • GET  /webhook/listar-candidatos          │
│  • GET  /webhook/listar-vagas               │
│  • POST /webhook/buscar-talentos            │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│          Supabase (Storage + DB)             │
│    Armazenamento de PDFs e dados             │
└─────────────────────────────────────────────┘
```

---

## 🚀 Instalação

### Pré-requisitos

- [Node.js](https://nodejs.org/) >= 18
- [Bun](https://bun.sh/) (recomendado) ou npm

### Setup

```bash
# Clonar o repositório
git clone https://github.com/SEU_USUARIO/smart-ats.git
cd smart-ats

# Instalar dependências
bun install
# ou
npm install

# Iniciar servidor de desenvolvimento
bun dev
# ou
npm run dev
```

O app estará disponível em `http://localhost:5173`.

### Build para produção

```bash
bun run build
# ou
npm run build
```

---

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── ui/                    # Componentes shadcn/ui (Button, Card, Dialog, etc.)
│   ├── AppSidebar.tsx         # Sidebar de navegação do RH
│   ├── CandidateCard.tsx      # Card de candidato no Kanban
│   ├── CandidateModal.tsx     # Modal detalhado do candidato
│   ├── DashboardView.tsx      # Página do dashboard
│   ├── JobsView.tsx           # Listagem de vagas
│   ├── JobsModal.tsx          # Modal de detalhes da vaga
│   ├── NewJobModal.tsx        # Modal de criação de vaga
│   ├── KanbanBoard.tsx        # Board drag-and-drop
│   ├── NavLink.tsx            # Link de navegação com estado ativo
│   ├── PipelineView.tsx       # Página do pipeline por vaga
│   ├── RecentActivity.tsx     # Feed de atividades recentes
│   ├── ResumeUploadForm.tsx   # Formulário de upload de CV
│   ├── ResumeUploadView.tsx   # Página de upload de CV
│   ├── RingProgress.tsx       # Componente circular de progresso (AI Score)
│   ├── SettingsView.tsx       # Página de configurações
│   └── TalentSearchView.tsx   # Página de busca semântica de talentos
├── data/
│   ├── candidates.ts          # Interface e tipos de candidatos
│   └── jobs.ts                # Interface e tipos de vagas
├── hooks/
│   ├── use-mobile.tsx         # Hook para deteção de dispositivo móvel
│   └── use-toast.ts           # Hook para notificações toast
├── lib/
│   └── utils.ts               # Utilitários (cn helper)
├── pages/
│   ├── Carreiras.tsx          # Portal público de carreiras
│   ├── Index.tsx              # Layout principal do RH (sidebar + outlet)
│   └── NotFound.tsx           # Página 404
├── App.tsx                    # Configuração de rotas
├── App.css                    # Estilos globais adicionais
├── index.css                  # Design tokens e tema (dark mode)
└── main.tsx                   # Entry point
```

---

## 🗺 Rotas

| Rota | Componente | Descrição |
|------|-----------|-----------|
| `/` | `DashboardView` | Dashboard com métricas |
| `/jobs` | `JobsView` | Lista de vagas ativas |
| `/jobs/:jobId` | `PipelineView` | Pipeline Kanban da vaga |
| `/upload` | `ResumeUploadView` | Upload de currículos |
| `/talent-search` | `TalentSearchView` | Busca semântica por IA |
| `/settings` | `SettingsView` | Configurações do sistema |
| `/carreiras` | `Carreiras` | Portal público de carreiras |

---

## 🔌 Integrações

### Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/webhook/listar-vagas` | Lista vagas ativas |
| `GET` | `/webhook/listar-candidatos?vaga_id=X` | Lista candidatos por vaga |
| `POST` | `/webhook/receber-curriculo` | Upload de CV para análise IA |
| `POST` | `/webhook/buscar-talentos` | Busca semântica de candidatos |

### Supabase Storage

Os PDFs dos currículos são armazenados no Supabase Storage e acessíveis via:

```
https://rwmzthlfotknbewrxkbs.supabase.co/storage/v1/object/public/{url_pdf}
```

---

## 🎨 Design System

O projeto usa um tema **dark mode** com design tokens definidos em CSS custom properties:

- **Cores primárias**: Azul-violeta (`hsl(239, 84%, 67%)`)
- **Glassmorphism**: Cards com `backdrop-blur` e bordas semi-transparentes
- **Score visual**: Verde (>70%), Amarelo (40-70%), Vermelho (<40%)
- **Tipografia**: Inter (300-800)
- **Componentes**: shadcn/ui customizados com Radix UI

---

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para a sua feature (`git checkout -b feature/nova-feature`)
3. Commit as suas alterações (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto é privado e de uso interno.

---

<p align="center">
  Feito com ❤️ usando <a href="https://lovable.dev">Lovable</a>
</p>
