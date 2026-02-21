

# Smart ATS Multi-Telas com Sidebar e Dashboard

## Visao Geral
Transformar a SPA atual (tela unica com Kanban) em uma aplicacao multi-telas com sidebar de navegacao, dashboard global com graficos, gestao de vagas e pipeline por vaga.

---

## Arquitetura de Navegacao

O estado `activeView` controlara qual tela e renderizada. A sidebar ficara fixa a esquerda com 3 itens de menu.

```text
+-------------+----------------------------------+
|             |                                  |
|   Sidebar   |        Area Principal            |
|             |                                  |
|  - Dashboard|   Renderiza dinamicamente:       |
|  - Vagas    |   - DashboardView                |
|  - Config   |   - JobsView                     |
|             |   - KanbanView (por vaga)         |
|             |   - SettingsView                  |
+-------------+----------------------------------+
```

---

## Dados Mock (Modelo Relacional)

### `src/data/jobs.ts`
Array de vagas com campos: `id`, `title`, `department`, `location`, `status`, `createdAt`, `candidateCount`, `newCount`.

### `src/data/candidates.ts` (Atualizado)
Adicionar campo `jobId` a cada candidato para vincular a uma vaga. Expandir para ~12-15 candidatos distribuidos entre as vagas.

---

## Componentes e Telas

### 1. Layout Base (`src/components/AppLayout.tsx`)
- Sidebar fixa a esquerda (w-60, colapsavel para w-14)
- Logo "AI ATS" com icone Sparkles no topo
- 3 itens de menu: Dashboard (LayoutDashboard), Vagas (Briefcase), Configuracoes (Settings)
- Item ativo destacado com bg-primary/20 e texto primary
- Area principal ocupa o restante com overflow-y-auto

### 2. Tela 1: Dashboard Global (`src/components/DashboardView.tsx`)
- **KPI Cards** (3 cards no topo):
  - Total de Vagas Abertas
  - Total de Candidatos Triados pela IA
  - Media Geral de Score IA
- **Grafico de Barras** (Recharts): "Candidatos por Vaga" -- BarChart com dados agrupados por vaga
- **Grafico de Linha** (Recharts): "Evolucao de Contratacoes (SLA)" -- LineChart com dados mensais mockados
- **Tabela de Atividades Recentes**: Lista das ultimas 5-6 atividades da IA (ex: "A IA avaliou Carlos para a vaga Dev Frontend com Score 92")

### 3. Tela 2: Gestao de Vagas (`src/components/JobsView.tsx`)
- Grid de cards (2-3 colunas)
- **Job Card**: Titulo da vaga, departamento, badge "Aberta" (verde), indicadores rapidos (total candidatos, novos nao lidos), botao "Ver Pipeline" com icone ArrowRight
- Clicar em "Ver Pipeline" muda o `activeView` para "kanban" e seta `selectedJobId`

### 4. Tela 3: Kanban da Vaga (`src/components/PipelineView.tsx`)
- Botao "Voltar para Vagas" no topo (ArrowLeft)
- Subtitulo com nome da vaga selecionada
- Reutiliza o KanbanBoard existente, filtrando candidatos pelo `jobId`
- Reutiliza CandidateCard, CandidateModal, RingProgress existentes
- Mantem Drag & Drop funcional com @hello-pangea/dnd

### 5. Tela 4: Configuracoes (`src/components/SettingsView.tsx`)
- Placeholder simples com titulo e texto indicando que esta em construcao

---

## Mudancas nos Arquivos Existentes

### `src/App.tsx`
- Remover roteamento (react-router nao e necessario para navegacao interna baseada em estado)
- Ou manter react-router e criar rotas: `/`, `/jobs`, `/jobs/:id/pipeline`, `/settings`

**Decisao**: Usar react-router com rotas, pois e mais escalavel e permite URLs compartilhaveis.

### Rotas:
- `/` -- Dashboard Global
- `/jobs` -- Gestao de Vagas
- `/jobs/:jobId` -- Pipeline/Kanban da vaga
- `/settings` -- Configuracoes

### `src/pages/Index.tsx`
- Substituir pelo layout com sidebar que renderiza `<Outlet />`
- Mover logica atual do Kanban para PipelineView

---

## Detalhes Tecnicos

### Graficos (Recharts)
- Usar `BarChart`, `Bar`, `XAxis`, `YAxis`, `Tooltip`, `ResponsiveContainer` para candidatos por vaga
- Usar `LineChart`, `Line` para evolucao de contratacoes
- Dados mockados diretamente nos componentes
- Integrar com ChartContainer do shadcn para estilizacao consistente

### Estado Global
- Candidatos e vagas ficam em estado local no layout raiz ou em contexto simples
- `selectedJobId` derivado da rota (`useParams`)
- Status dos candidatos mutavel via `useState` para suportar D&D

### Arquivos Novos
1. `src/data/jobs.ts` -- Mock de vagas
2. `src/components/AppSidebar.tsx` -- Sidebar de navegacao
3. `src/components/DashboardView.tsx` -- Tela do dashboard com graficos
4. `src/components/JobsView.tsx` -- Grid de vagas
5. `src/components/PipelineView.tsx` -- Kanban filtrado por vaga
6. `src/components/SettingsView.tsx` -- Placeholder
7. `src/components/RecentActivity.tsx` -- Tabela de atividades

### Arquivos Editados
1. `src/App.tsx` -- Novas rotas
2. `src/data/candidates.ts` -- Adicionar `jobId`
3. `src/pages/Index.tsx` -- Layout base com sidebar + Outlet

