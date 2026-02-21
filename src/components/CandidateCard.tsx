import { Candidate } from "@/data/candidates";
import { RingProgress } from "./RingProgress";
import { Badge } from "@/components/ui/badge";

interface CandidateCardProps {
  candidate: Candidate;
  onClick: (candidate: Candidate) => void;
}

export function CandidateCard({ candidate, onClick }: CandidateCardProps) {
  const initials = candidate.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <button
      onClick={() => onClick(candidate)}
      className="w-full text-left rounded-xl border border-[hsl(var(--glass-border))] bg-[hsl(var(--glass))] backdrop-blur-md p-4 hover:bg-secondary/60 transition-all duration-200 group cursor-pointer"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-semibold">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
              {candidate.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">{candidate.role}</p>
          </div>
        </div>
        <RingProgress value={candidate.aiScore} size={42} strokeWidth={3.5} />
      </div>
      <div className="flex flex-wrap gap-1.5 mt-3">
        {candidate.skills.slice(0, 3).map((skill) => (
          <Badge
            key={skill}
            variant="secondary"
            className="text-[10px] px-2 py-0.5 bg-secondary/80 text-muted-foreground border-0"
          >
            {skill}
          </Badge>
        ))}
      </div>
    </button>
  );
}
