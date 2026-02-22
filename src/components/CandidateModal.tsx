import { Candidate } from "@/data/candidates";
import { RingProgress, getScoreColor } from "./RingProgress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { Sparkles, Mail, Phone, Briefcase, Download, CheckCircle, XCircle, ThumbsUp, ThumbsDown, FileText } from "lucide-react";
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
          <TabsContent value="insights" className="p-4 sm:p-6 mt-0 space-y-4">
            {/* AI Analysis */}
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 sm:p-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary via-primary/60 to-transparent" />
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-foreground mb-2">Análise da Inteligência Artificial</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed break-words whitespace-pre-wrap">
                    {candidate.resumoIa || candidate.aiJustification || "Sem análise disponível."}
                  </p>
                </div>
              </div>
            </div>

            {/* Pontos Fortes */}
            {candidate.pontosFortes.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ThumbsUp className="h-3.5 w-3.5 text-score-high" /> Pontos Fortes
                </h4>
                <div className="flex flex-wrap gap-2">
                  {candidate.pontosFortes.map((item, i) => (
                    <Badge key={i} variant="secondary" className="bg-score-high/10 text-score-high border-score-high/20">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Pontos Fracos */}
            {candidate.pontosFracos.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ThumbsDown className="h-3.5 w-3.5 text-score-low" /> Pontos Fracos
                </h4>
                <div className="flex flex-wrap gap-2">
                  {candidate.pontosFracos.map((item, i) => (
                    <Badge key={i} variant="secondary" className="bg-score-low/10 text-score-low border-score-low/20">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="resume" className="p-4 sm:p-6 mt-0">
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" /> Texto Extraído do CV
              </h4>
              <div className="rounded-lg border border-border bg-secondary/30 p-4 max-h-[50vh] overflow-y-auto">
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">
                  {candidate.textoExtraido || "Nenhum texto extraído disponível."}
                </p>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {/* Footer */}
      <div className="p-3 sm:p-4 border-t border-border bg-card/80">
        <div className="flex flex-wrap gap-2 sm:justify-end">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs flex-1 sm:flex-initial"
            onClick={() => {
              if (candidate.urlPdf) {
                window.open(
                  `https://rwmzthlfotknbewrxkbs.supabase.co/storage/v1/object/public/${candidate.urlPdf}`,
                  "_blank"
                );
              }
            }}
            disabled={!candidate.urlPdf}
          >
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
