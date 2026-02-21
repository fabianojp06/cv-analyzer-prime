import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Candidate } from "@/data/candidates";
import { CandidateCard } from "./CandidateCard";
import { Loader2, CheckCircle2, CalendarCheck, XCircle } from "lucide-react";
import { toast } from "sonner";

const columns: { key: Candidate["status"]; label: string; icon: React.ReactNode }[] = [
  { key: "new", label: "Novos (IA Analisando)", icon: <Loader2 className="h-4 w-4 animate-spin text-primary" /> },
  { key: "screened", label: "Triagem Concluída", icon: <CheckCircle2 className="h-4 w-4 text-score-high" /> },
  { key: "interview", label: "Entrevistar", icon: <CalendarCheck className="h-4 w-4 text-score-medium" /> },
  { key: "rejected", label: "Descartados", icon: <XCircle className="h-4 w-4 text-score-low" /> },
];

const statusLabels: Record<Candidate["status"], string> = {
  new: "Novos",
  screened: "Triagem Concluída",
  interview: "Entrevistar",
  rejected: "Descartados",
};

interface KanbanBoardProps {
  candidates: Candidate[];
  onCardClick: (candidate: Candidate) => void;
  onStatusChange: (candidateId: string, newStatus: Candidate["status"]) => void;
}

export function KanbanBoard({ candidates, onCardClick, onStatusChange }: KanbanBoardProps) {
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    const newStatus = destination.droppableId as Candidate["status"];
    onStatusChange(draggableId, newStatus);

    const candidate = candidates.find((c) => c.id === draggableId);
    if (candidate) {
      toast.success(`${candidate.name} movido para "${statusLabels[newStatus]}"`);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      {/* Mobile/Tablet: horizontal scroll carousel; Desktop: grid */}
      <div className="flex lg:grid lg:grid-cols-4 gap-4 overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory lg:snap-none pb-4 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0">
        {columns.map((col) => {
          const items = candidates.filter((c) => c.status === col.key);
          return (
            <div
              key={col.key}
              className="flex-shrink-0 w-[85vw] sm:w-[70vw] md:w-[45vw] lg:w-auto snap-center lg:snap-align-none flex flex-col rounded-xl border border-border bg-card/50 min-h-[400px]"
            >
              <div className="flex items-center gap-2 p-4 border-b border-border">
                {col.icon}
                <h3 className="text-sm font-semibold text-foreground">{col.label}</h3>
                <span className="ml-auto text-xs font-medium text-muted-foreground bg-secondary rounded-full px-2 py-0.5">
                  {items.length}
                </span>
              </div>
              <Droppable droppableId={col.key}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 p-3 overflow-y-auto transition-colors duration-200 ${
                      snapshot.isDraggingOver ? "bg-primary/5" : ""
                    }`}
                  >
                    <div className="flex flex-col gap-3">
                      {items.map((candidate, index) => (
                        <Draggable key={candidate.id} draggableId={candidate.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <CandidateCard
                                candidate={candidate}
                                onClick={onCardClick}
                                isDragging={snapshot.isDragging}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {items.length === 0 && (
                        <p className="text-xs text-muted-foreground text-center py-8">Nenhum candidato</p>
                      )}
                    </div>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
