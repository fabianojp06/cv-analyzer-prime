

# Smart ATS Dashboard - AI Copilot

## Visão Geral
Um painel de recrutador premium com Dark Mode nativo, focado em visualizar análises de currículos geradas por IA. SPA com design sofisticado, glassmorphism e componentes interativos.

## Design System
- **Fundo**: Zinc-950/Slate-900 (Dark Mode nativo)
- **Cor principal**: Indigo-500
- **Scores semânticos**: Emerald-500 (Alto ≥70), Amber-500 (Médio 40-69), Rose-500 (Baixo <40)
- **Tipografia**: Inter
- **Estilo**: Glassmorphism sutil nos cards

## Dados Mock
Array de ~8 candidatos fictícios com: id, name, email, phone, role, status (coluna kanban), aiScore (0-100), aiJustification, skills, qualifications e jobHistory.

---

## Seções da Aplicação

### 1. Header & Topbar
- Título "Smart ATS - AI Copilot" com ícone Sparkles
- Barra de pesquisa de candidatos
- Avatar do recrutador no canto direito
- 3 cards de resumo rápido: Total de Candidatos, Análises Concluídas, Média de Score

### 2. Kanban Board (Visão Principal)
- 4 colunas: "Novos (IA Analisando)", "Triagem Concluída", "Entrevistar", "Descartados"
- Cada coluna com contador de candidatos
- Layout responsivo horizontal com scroll

### 3. Candidate Card (dentro do Kanban)
- Estilo glassmorphism (fundo semi-transparente com backdrop-blur)
- Iniciais do candidato em avatar colorido
- Nome e vaga aplicada
- **Ring Progress** circular exibindo o aiScore com cor semântica
- 2-3 badges de skills principais
- Clicável para abrir o modal de detalhes

### 4. Candidate Detail Modal
- **Cabeçalho**: Avatar, nome, email, telefone e Score da IA em destaque com Ring Progress grande
- **Corpo com 2 abas (Tabs)**:
  - **Aba "AI Insights"**: aiJustification em card com borda gradiente indigo/brilhante + ícone Sparkles, indicando conteúdo gerado por IA
  - **Aba "Currículo"**: Qualificações e histórico profissional com tipografia limpa e timeline visual
- **Rodapé**: Botões "Aprovar para Entrevista" (indigo), "Rejeitar" (rose) e "Baixar PDF" (outline)

### 5. Funcionalidade de Pesquisa
- Filtro em tempo real dos candidatos por nome ou vaga no Kanban

