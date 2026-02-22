import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const API_URL = "https://nonabortively-aciniform-jacoby.ngrok-free.dev/webhook/cadastrar-vaga";

interface NewJobModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function NewJobModal({ open, onOpenChange, onSuccess }: NewJobModalProps) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [requisitos, setRequisitos] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, descricao, requisitos }),
      });
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      toast.success("Vaga cadastrada com sucesso!");
      setTitulo("");
      setDescricao("");
      setRequisitos("");
      onOpenChange(false);
      onSuccess?.();
    } catch {
      toast.error("Erro ao cadastrar a vaga. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Cadastrar Nova Vaga</DialogTitle>
          <DialogDescription>
            Preencha os dados da nova posição
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título da Vaga</Label>
            <Input
              id="titulo"
              placeholder="Ex: Desenvolvedor Full Stack"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              placeholder="Descreva as responsabilidades da vaga..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requisitos">Requisitos</Label>
            <Textarea
              id="requisitos"
              placeholder="Liste as exigências para a vaga..."
              value={requisitos}
              onChange={(e) => setRequisitos(e.target.value)}
              rows={4}
              required
            />
          </div>

          <Button type="submit" className="w-full gap-2" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Salvar Vaga
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
