import { useState, useEffect, useMemo } from "react";
import { Sparkles, Search, MapPin, Briefcase, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ResumeUploadForm } from "@/components/ResumeUploadForm";

const API_URL = "https://nonabortively-aciniform-jacoby.ngrok-free.dev/webhook/listar-vagas";

interface Vaga {
  id?: string;
  titulo: string;
  descricao: string;
  requisitos: string;
  status: string;
  localizacao?: string;
}

export default function Carreiras() {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedVagaId, setSelectedVagaId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    (async () => {
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
    })();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return vagas;
    const q = search.toLowerCase();
    return vagas.filter(
      (v) =>
        v.titulo?.toLowerCase().includes(q) ||
        v.localizacao?.toLowerCase().includes(q) ||
        v.descricao?.toLowerCase().includes(q)
    );
  }, [vagas, search]);

  const handleCandidatar = (vaga: Vaga) => {
    setSelectedVagaId(vaga.id || vaga.titulo);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/60 backdrop-blur-lg sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <span className="text-base font-bold text-foreground tracking-tight">
              AI <span className="text-primary">ATS</span>
            </span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {vagas.length} vaga{vagas.length !== 1 ? "s" : ""} aberta{vagas.length !== 1 ? "s" : ""}
          </Badge>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 relative">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
            Encontre sua próxima
            <br />
            <span className="text-primary">oportunidade.</span>
          </h1>
          <p className="mt-4 text-muted-foreground max-w-lg text-sm sm:text-base">
            Explore nossas vagas abertas e candidate-se em poucos cliques. Nosso sistema de IA analisa seu perfil para encontrar a melhor combinação.
          </p>

          {/* Search */}
          <div className="mt-8 relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por cargo ou localização…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-secondary/60 border-border h-11"
            />
          </div>
        </div>
      </section>

      {/* Job Cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-20 text-sm">
            {search ? "Nenhuma vaga encontrada para sua busca." : "Nenhuma vaga disponível no momento."}
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((vaga, i) => (
              <div
                key={vaga.id || i}
                className="group rounded-xl border border-border bg-card/60 backdrop-blur-sm p-5 flex flex-col gap-3 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-foreground text-sm leading-snug">{vaga.titulo}</h3>
                  <Badge className="bg-[hsl(var(--score-high))]/15 text-[hsl(var(--score-high))] border-0 text-[10px] shrink-0">
                    Aberta
                  </Badge>
                </div>

                {vaga.localizacao && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {vaga.localizacao}
                  </div>
                )}

                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                  {vaga.descricao}
                </p>

                <div className="mt-auto pt-2">
                  <Button
                    size="sm"
                    className="w-full gap-1.5 text-xs"
                    onClick={() => handleCandidatar(vaga)}
                  >
                    <Briefcase className="h-3.5 w-3.5" />
                    Candidatar-se
                    <ArrowRight className="h-3 w-3 ml-auto opacity-60 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Upload Modal */}
      <Dialog open={modalOpen} onOpenChange={(open) => { setModalOpen(open); if (!open) setSelectedVagaId(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enviar Currículo</DialogTitle>
            <DialogDescription>Selecione seu PDF para análise automática pela IA.</DialogDescription>
          </DialogHeader>
          <ResumeUploadForm vagaId={selectedVagaId ?? undefined} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
