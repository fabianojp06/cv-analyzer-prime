import { useState } from "react";
import { Search, Loader2, Sparkles, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const API_URL = "https://shortly-peaceful-baboon.ngrok-free.app/webhook/buscar-talentos";

interface TalentResult {
  nome: string;
  resumo_ia: string;
  contato: string;
  similaridade: number;
}

export function TalentSearchView() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TalentResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ texto_busca: query }),
      });
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro na busca:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const getMatchColor = (pct: number) =>
    pct > 70 ? "text-[hsl(var(--score-high))]" : pct > 40 ? "text-[hsl(var(--score-medium))]" : "text-muted-foreground";

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          Busca de Talentos
        </h2>
        <p className="text-sm text-muted-foreground">
          Use linguagem natural para encontrar candidatos no banco de currículos.
        </p>
      </div>

      {/* Search bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Descreva o candidato ideal (ex: Especialista em metodologias ágeis e BPMN com experiência no setor público)"
            className="w-full h-14 pl-12 pr-4 rounded-xl border border-input bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <Button
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          className="h-14 px-6 rounded-xl text-sm font-semibold gap-2 shrink-0"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Buscar com IA
        </Button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Analisando o banco de talentos...</p>
        </div>
      )}

      {/* Results */}
      {!loading && searched && results.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-sm">Nenhum candidato encontrado para essa busca.</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {results.length} resultado{results.length !== 1 ? "s" : ""} encontrado{results.length !== 1 ? "s" : ""}
          </p>
          <div className="grid gap-4">
            {results.map((r, i) => {
              const pct = Math.round(r.similaridade * 100);
              return (
                <Card key={i} className="border-[hsl(var(--glass-border))] bg-[hsl(var(--glass))] backdrop-blur-md">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h3 className="font-semibold text-foreground text-base">{r.nome}</h3>
                      <Badge
                        variant="outline"
                        className={`text-xs font-bold border-0 ${getMatchColor(pct)} bg-transparent`}
                      >
                        {pct}% Match Semântico
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{r.resumo_ia}</p>
                    {r.contato && (
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground pt-1">
                        {r.contato.includes("@") ? (
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {r.contato}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" /> {r.contato}
                          </span>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
