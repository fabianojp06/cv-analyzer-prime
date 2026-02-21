

# Drag & Drop no Kanban com @hello-pangea/dnd

## Resumo
Adicionar funcionalidade de arrastar e soltar nos cards do Kanban, permitindo mover candidatos entre colunas (ex: de "Novos" para "Triagem Concluída").

## Mudancas Necessarias

### 1. Instalar dependencia
- `@hello-pangea/dnd` -- fork mantido do react-beautiful-dnd

### 2. Index.tsx -- Estado mutavel dos candidatos
- Trocar de `initialCandidates` (constante importada) para `useState(initialCandidates)` para que o estado dos candidatos seja mutavel
- Adicionar callback `onStatusChange(candidateId, newStatus)` que atualiza o status do candidato no array
- Passar essa funcao para o KanbanBoard
- Recalcular KPIs a partir do estado mutavel

### 3. KanbanBoard.tsx -- Wrapper de DnD
- Envolver o grid com `<DragDropContext onDragEnd={...}>`
- Cada coluna vira um `<Droppable droppableId={col.key}>`
- Cada CandidateCard e envolvido por `<Draggable draggableId={candidate.id}>`
- No `onDragEnd`, chamar `onStatusChange` com o `destination.droppableId` como novo status
- Remover o ScrollArea (conflita com droppable) e usar overflow-y-auto nativo

### 4. CandidateCard.tsx -- Ajustes menores
- Receber `ref`, `draggableProps` e `dragHandleProps` via render do Draggable
- Garantir que o click para abrir modal nao dispare durante drag

## Detalhes Tecnicos

- `DragDropContext` fica no KanbanBoard, `onDragEnd` recebe `result` com `source` e `destination`
- Se `destination` for null ou igual ao source, nao faz nada
- O Droppable precisa de um elemento filho com `ref` e `droppableProps`
- O Draggable precisa de um elemento filho com `ref`, `draggableProps` e `dragHandleProps`
- Toast (sonner) ao mover candidato confirmando a mudanca de status

