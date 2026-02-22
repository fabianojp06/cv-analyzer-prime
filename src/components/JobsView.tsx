import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Loader2, Eye } from "lucide-react";
import { NewJobModal } from "@/components/NewJobModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const API_URL = "https://nonabortively-aciniform-jacoby.ngrok-free.dev/webhook/listar-vagas";

interface Vaga {
  id?: string;
  titulo: string;
  descricao: string;
  requisitos: string;
  status: string;
}

export function JobsView() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVagas = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        headers: { "ngrok-skip-browser-warning": "true" },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setVagas(Array.isArray(data) ? data : []);
    } catch {
      setVagas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVagas();
  }, [fetchVagas]);

  const handleJobCreated = () => {
    fetchVagas();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Vagas Ativas</h2>
          <p className="text-sm text-muted-foreground">Gerencie suas posições abertas</p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="gap-1.5">
          <Plus className="h-4 w-4" />
          Cadastrar Nova Vaga
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : vagas.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground text-sm">
          Nenhuma vaga cadastrada ainda.
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card/60 backdrop-blur-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título da Vaga</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vagas.map((vaga, i) => (
                <TableRow key={vaga.id || i}>
                  <TableCell className="font-medium text-foreground">
                    {vaga.titulo}
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-[hsl(var(--score-high))]/15 text-[hsl(var(--score-high))] border-0 text-[10px]">
                      {vaga.status === "aberta" ? "Aberta" : vaga.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm max-w-xs truncate">
                    {vaga.descricao?.slice(0, 100)}{vaga.descricao?.length > 100 ? "…" : ""}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1.5 text-xs text-primary hover:text-primary"
                      onClick={() => navigate(`/jobs/${vaga.id || encodeURIComponent(vaga.titulo)}`)}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Ver Pipeline
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <NewJobModal open={modalOpen} onOpenChange={setModalOpen} onSuccess={handleJobCreated} />
    </div>
  );
}
