import { useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { candidates as initialCandidates, Candidate } from "@/data/candidates";
import { jobs } from "@/data/jobs";
import { KanbanBoard } from "./KanbanBoard";
import { CandidateModal } from "./CandidateModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search } from "lucide-react";

export function PipelineView() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const job = jobs.find((j) => j.id === jobId);

  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [search, setSearch] = useState("");

  const handleStatusChange = useCallback((candidateId: string, newStatus: Candidate["status"]) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, status: newStatus } : c))
    );
  }, []);

  const filtered = useMemo(() => {
    let list = candidates.filter((c) => c.jobId === jobId);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) => c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q)
      );
    }
    return list;
  }, [candidates, jobId, search]);

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-muted-foreground">Vaga não encontrada</p>
        <Button variant="ghost" onClick={() => navigate("/jobs")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Vagas
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-3 sm:gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/jobs")}
          className="text-muted-foreground hover:text-foreground flex-shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="min-w-0">
          <h2 className="text-base sm:text-xl font-bold text-foreground truncate">Pipeline: {job.title}</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">{job.department} · {job.location}</p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar candidatos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-secondary/60 border-border h-9 text-sm"
        />
      </div>

      <KanbanBoard candidates={filtered} onCardClick={setSelectedCandidate} onStatusChange={handleStatusChange} />

      <CandidateModal
        candidate={selectedCandidate}
        open={!!selectedCandidate}
        onOpenChange={(open) => !open && setSelectedCandidate(null)}
      />
    </div>
  );
}
