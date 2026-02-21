import { Candidate } from "@/data/candidates";
import { CandidateCard } from "./CandidateCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, CheckCircle2, CalendarCheck, XCircle } from "lucide-react";

const columns: { key: Candidate["status"]; label: string; icon: React.ReactNode }[] = [
  { key: "new", label: "Novos (IA Analisando)", icon: <Loader2 className="h-4 w-4 animate-spin text-primary" /> },
  { key: "screened", label: "Triagem Concluída", icon: <CheckCircle2 className="h-4 w-4 text-score-high" /> },
  { key: "interview", label: "Entrevistar", icon: <CalendarCheck className="h-4 w-4 text-score-medium" /> },
  { key: "rejected", label: "Descartados", icon: <XCircle className="h-4 w-4 text-score-low" /> },
];

interface KanbanBoardProps {
  candidates: Candidate[];
  onCardClick: (candidate: Candidate) => void;
}

export function KanbanBoard({ candidates, onCardClick }: KanbanBoardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {columns.map((col) => {
        const items = candidates.filter((c) => c.status === col.key);
        return (
          <div key={col.key} className="flex flex-col rounded-xl border border-border bg-card/50 min-h-[400px]">
            <div className="flex items-center gap-2 p-4 border-b border-border">
              {col.icon}
              <h3 className="text-sm font-semibold text-foreground">{col.label}</h3>
              <span className="ml-auto text-xs font-medium text-muted-foreground bg-secondary rounded-full px-2 py-0.5">
                {items.length}
              </span>
            </div>
            <ScrollArea className="flex-1 p-3">
              <div className="flex flex-col gap-3">
                {items.map((candidate) => (
                  <CandidateCard key={candidate.id} candidate={candidate} onClick={onCardClick} />
                ))}
                {items.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-8">Nenhum candidato</p>
                )}
              </div>
            </ScrollArea>
          </div>
        );
      })}
    </div>
  );
}
