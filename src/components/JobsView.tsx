import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jobs } from "@/data/jobs";
import { candidates } from "@/data/candidates";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Sparkles, MapPin, Plus } from "lucide-react";
import { NewJobModal } from "@/components/NewJobModal";

export function JobsView() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

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

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {jobs.map((job) => {
          const jobCandidates = candidates.filter((c) => c.jobId === job.id);
          const newCount = jobCandidates.filter((c) => c.status === "new").length;

          return (
            <Card
              key={job.id}
              className="bg-card/60 border-border backdrop-blur-sm hover:border-primary/30 transition-colors group"
            >
              <CardContent className="p-5 flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">{job.department}</p>
                  </div>
                  <Badge className="bg-[hsl(var(--score-high))]/15 text-[hsl(var(--score-high))] border-0 text-[10px]">
                    Aberta
                  </Badge>
                </div>

                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {job.location}
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    {jobCandidates.length} Candidatos
                  </span>
                  {newCount > 0 && (
                    <span className="flex items-center gap-1 text-primary">
                      <Sparkles className="h-3.5 w-3.5" />
                      {newCount} Novos
                    </span>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-between text-xs text-muted-foreground hover:text-primary mt-auto"
                  onClick={() => navigate(`/jobs/${job.id}`)}
                >
                  Ver Pipeline
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <NewJobModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
