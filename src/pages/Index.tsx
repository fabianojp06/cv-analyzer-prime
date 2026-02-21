import { useState, useMemo } from "react";
import { candidates as initialCandidates, Candidate } from "@/data/candidates";
import { KanbanBoard } from "@/components/KanbanBoard";
import { CandidateModal } from "@/components/CandidateModal";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Search, Users, BrainCircuit, TrendingUp } from "lucide-react";

const Index = () => {
  const [search, setSearch] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return initialCandidates;
    const q = search.toLowerCase();
    return initialCandidates.filter(
      (c) => c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q)
    );
  }, [search]);

  const analysisComplete = initialCandidates.filter((c) => c.status !== "new").length;
  const avgScore = Math.round(initialCandidates.reduce((a, c) => a + c.aiScore, 0) / initialCandidates.length);

  const kpis = [
    { label: "Total Candidatos", value: initialCandidates.length, icon: Users, color: "text-primary" },
    { label: "Análises Concluídas", value: analysisComplete, icon: BrainCircuit, color: "text-score-high" },
    { label: "Média de Score", value: `${avgScore}%`, icon: TrendingUp, color: "text-score-medium" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="mx-auto max-w-[1440px] px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Sparkles className="h-4.5 w-4.5 text-primary" />
            </div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">
              Smart ATS <span className="text-primary">— AI Copilot</span>
            </h1>
          </div>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar candidatos por nome ou vaga..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-secondary/60 border-border h-9 text-sm"
            />
          </div>
          <Avatar className="h-9 w-9 border-2 border-primary/30">
            <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">RC</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-6 py-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {kpis.map((kpi) => (
            <Card key={kpi.label} className="bg-card/60 border-border backdrop-blur-sm">
              <CardContent className="flex items-center gap-4 p-4">
                <div className={`w-10 h-10 rounded-lg bg-secondary flex items-center justify-center ${kpi.color}`}>
                  <kpi.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                  <p className="text-xs text-muted-foreground">{kpi.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Kanban */}
        <KanbanBoard candidates={filtered} onCardClick={setSelectedCandidate} />
      </main>

      {/* Modal */}
      <CandidateModal
        candidate={selectedCandidate}
        open={!!selectedCandidate}
        onOpenChange={(open) => !open && setSelectedCandidate(null)}
      />
    </div>
  );
};

export default Index;
