import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Candidate } from "@/data/candidates";
import { KanbanBoard } from "./KanbanBoard";
import { CandidateModal } from "./CandidateModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Search, Loader2, Users } from "lucide-react";

const API_BASE = "https://nonabortively-aciniform-jacoby.ngrok-free.dev/webhook";
const HEADERS = { "ngrok-skip-browser-warning": "true" };

interface Vaga {
  id?: string;
  titulo: string;
  descricao: string;
  requisitos: string;
  status: string;
}

export function PipelineView() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();

  const [vaga, setVaga] = useState<Vaga | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [search, setSearch] = useState("");
  const [loadingVaga, setLoadingVaga] = useState(true);
  const [loadingCandidates, setLoadingCandidates] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log("ID da Vaga Selecionada:", jobId);

  // Fetch vaga details
  useEffect(() => {
    if (!jobId) return;
    setLoadingVaga(true);
    setError(null);

    fetch(`${API_BASE}/listar-vagas`, { headers: HEADERS })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: Vaga[]) => {
        const found = (Array.isArray(data) ? data : []).find(
          (v) => String(v.id) === String(jobId) || encodeURIComponent(v.titulo) === jobId
        );
        setVaga(found ?? null);
      })
      .catch(() => setError("Erro ao carregar dados da vaga."))
      .finally(() => setLoadingVaga(false));
  }, [jobId]);

  // Fetch candidates for this vaga
  useEffect(() => {
    if (!jobId) return;
    setLoadingCandidates(true);

    fetch(`${API_BASE}/listar-candidatos?vaga_id=${encodeURIComponent(jobId)}`, { headers: HEADERS })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        // Map API response to Candidate interface
        const mapped: Candidate[] = list.map((c: any, i: number) => ({
          id: String(c.id ?? i),
          name: c.name ?? c.nome ?? "Sem nome",
          email: c.email ?? "",
          phone: c.phone ?? c.telefone ?? "",
          role: c.role ?? c.cargo ?? "",
          jobId: String(c.jobId ?? c.vaga_id ?? jobId),
          status: mapStatus(c.fase ?? c.status),
          aiScore: Number(c.score_aderencia ?? c.aiScore ?? c.score ?? c.nota ?? 0),
          aiJustification: c.aiJustification ?? c.justificativa ?? "",
          skills: Array.isArray(c.skills) ? c.skills : (c.habilidades ? c.habilidades.split(",").map((s: string) => s.trim()) : []),
          qualifications: Array.isArray(c.qualifications) ? c.qualifications : [],
          jobHistory: Array.isArray(c.jobHistory) ? c.jobHistory : [],
        }));
        setCandidates(mapped);
      })
      .catch(() => setCandidates([]))
      .finally(() => setLoadingCandidates(false));
  }, [jobId]);

  const handleStatusChange = useCallback((candidateId: string, newStatus: Candidate["status"]) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, status: newStatus } : c))
    );
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return candidates;
    const q = search.toLowerCase();
    return candidates.filter(
      (c) => c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q)
    );
  }, [candidates, search]);

  const isLoading = loadingVaga || loadingCandidates;

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-9 w-full max-w-md" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[400px] rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-muted-foreground">{error}</p>
        <Button variant="ghost" onClick={() => navigate("/jobs")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Vagas
        </Button>
      </div>
    );
  }

  // Not found
  if (!vaga) {
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
    <div className="space-y-4 sm:space-y-6 min-h-[calc(100vh-8rem)] w-full">
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
          <h2 className="text-base sm:text-xl font-bold text-foreground truncate">Pipeline: {vaga.titulo}</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">{vaga.status}</p>
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

/** Maps various status strings to the Candidate status type */
function mapStatus(status: string | undefined): Candidate["status"] {
  if (!status) return "new";
  const s = status.toLowerCase().trim();
  if (s === "screened" || s === "triagem" || s === "triagem concluída" || s === "triagem concluida" || s === "triado") return "screened";
  if (s === "interview" || s === "entrevista" || s === "entrevistar") return "interview";
  if (s === "rejected" || s === "rejeitado" || s === "descartado" || s === "descartados" || s === "recusado") return "rejected";
  return "new";
}
