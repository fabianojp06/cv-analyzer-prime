import { Candidate } from "@/data/candidates";
import { RingProgress, getScoreColor } from "./RingProgress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Sparkles, Mail, Phone, Briefcase, Download, CheckCircle, XCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface CandidateModalProps {
  candidate: Candidate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function CandidateContent({ candidate }: { candidate: Candidate }) {
  const initials = candidate.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <>
      {/* Header */}
      <div className="p-4 sm:p-6 pb-4 border-b border-border">
        <div className="flex items-start sm:items-center gap-3 sm:gap-4">
          <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-primary/20 text-primary flex items-center justify-center text-base sm:text-lg font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-xl font-bold text-foreground truncate">{candidate.name}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 truncate">{candidate.role}</p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1 truncate"><Mail className="h-3 w-3 flex-shrink-0" />{candidate.email}</span>
              <span className="flex items-center gap-1"><Phone className="h-3 w-3 flex-shrink-0" />{candidate.phone}</span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <RingProgress value={candidate.aiScore} size={52} strokeWidth={4} />
            <span className={`text-[10px] font-semibold ${getScoreColor(candidate.aiScore)}`}>AI Score</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="insights" className="flex-1 flex flex-col min-h-0">
        <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent px-4 sm:px-6 h-auto py-0">
          <TabsTrigger value="insights" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 text-xs sm:text-sm">
            <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" /> AI Insights
          </TabsTrigger>
          <TabsTrigger value="resume" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 text-xs sm:text-sm">
            <Briefcase className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" /> Currículo
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto">
          <TabsContent value="insights" className="p-4 sm:p-6 mt-0">
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 sm:p-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary via-primary/60 to-transparent" />
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Análise da Inteligência Artificial</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed break-words">{candidate.aiJustification}</p>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="bg-secondary text-foreground border-0">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="resume" className="p-4 sm:p-6 mt-0 space-y-6">
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Qualificações</h4>
              <ul className="space-y-1.5">
                {candidate.qualifications.map((q, i) => (
                  <li key={i} className="text-sm text-foreground flex items-start gap-2 break-words">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    {q}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Histórico Profissional</h4>
              <div className="relative pl-4 border-l-2 border-border space-y-4">
                {candidate.jobHistory.map((job, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[calc(1rem+5px)] top-1.5 w-2.5 h-2.5 rounded-full bg-primary border-2 border-background" />
                    <p className="text-sm font-semibold text-foreground break-words">{job.role}</p>
                    <p className="text-xs text-muted-foreground break-words">{job.company} · {job.period}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {/* Footer */}
      <div className="p-3 sm:p-4 border-t border-border bg-card/80">
        <div className="flex flex-wrap gap-2 sm:justify-end">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs flex-1 sm:flex-initial">
            <Download className="h-3.5 w-3.5" /> Baixar PDF
          </Button>
          <Button variant="destructive" size="sm" className="gap-1.5 text-xs flex-1 sm:flex-initial bg-score-low hover:bg-score-low/90">
            <XCircle className="h-3.5 w-3.5" /> Rejeitar
          </Button>
          <Button size="sm" className="gap-1.5 text-xs flex-1 sm:flex-initial bg-primary hover:bg-primary/90">
            <CheckCircle className="h-3.5 w-3.5" /> Aprovar
          </Button>
        </div>
      </div>
    </>
  );
}

export function CandidateModal({ candidate, open, onOpenChange }: CandidateModalProps) {
  const isMobile = useIsMobile();

  if (!candidate) return null;

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh] flex flex-col bg-card border-border">
          <DrawerHeader className="sr-only">
            <DrawerTitle>{candidate.name}</DrawerTitle>
            <DrawerDescription>{candidate.role}</DrawerDescription>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto flex flex-col min-h-0">
            <CandidateContent candidate={candidate} />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card border-border p-0 gap-0 overflow-hidden max-h-[85vh] flex flex-col">
        <DialogHeader className="sr-only">
          <DialogTitle>{candidate.name}</DialogTitle>
          <DialogDescription>{candidate.role}</DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto flex flex-col min-h-0">
          <CandidateContent candidate={candidate} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
