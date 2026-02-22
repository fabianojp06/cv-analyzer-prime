import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Send } from "lucide-react";
import { ResumeUploadForm } from "@/components/ResumeUploadForm";

interface Vaga {
  id: string;
  titulo: string;
  descricao: string;
}

const API_URL = "http://localhost:5678/webhook-test/listar-vagas";

interface JobsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JobsModal({ open, onOpenChange }: JobsModalProps) {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedVaga, setSelectedVaga] = useState<Vaga | null>(null);

  useEffect(() => {
    if (!open) {
      setSelectedVaga(null);
      return;
    }
    setLoading(true);
    setError("");
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`Erro ${res.status}`);
        return res.json();
      })
      .then((data: Vaga[]) => setVagas(data))
      .catch(() => setError("Não foi possível carregar as vagas."))
      .finally(() => setLoading(false));
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {selectedVaga ? selectedVaga.titulo : "Vagas Abertas"}
          </DialogTitle>
          <DialogDescription>
            {selectedVaga
              ? "Envie seu currículo para esta vaga"
              : "Selecione uma vaga para enviar seu currículo"}
          </DialogDescription>
        </DialogHeader>

        {selectedVaga ? (
          <div className="space-y-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedVaga(null)}
              className="gap-1 text-xs text-muted-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Voltar às vagas
            </Button>
            <ResumeUploadForm vagaId={selectedVaga.id} />
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : error ? (
          <p className="text-sm text-destructive text-center py-8">{error}</p>
        ) : vagas.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Nenhuma vaga disponível no momento.
          </p>
        ) : (
          <div className="space-y-3">
            {vagas.map((vaga) => (
              <div
                key={vaga.id}
                className="rounded-lg border border-border p-4 space-y-2"
              >
                <h4 className="font-semibold text-foreground text-sm">
                  {vaga.titulo}
                </h4>
                <p className="text-xs text-muted-foreground">{vaga.descricao}</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 text-xs"
                  onClick={() => setSelectedVaga(vaga)}
                >
                  <Send className="h-3.5 w-3.5" />
                  Enviar Currículo para esta vaga
                </Button>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
