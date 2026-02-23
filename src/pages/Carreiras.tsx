import { useState, useEffect } from "react";
import { ResumeUploadForm } from "@/components/ResumeUploadForm";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building, Search, UploadCloud, Star, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Vaga {
  id?: string;
  titulo: string;
  descricao?: string;
  requisitos?: string;
  status: string;
  localizacao?: string;
  departamento?: string;
}

interface AnaliseResult {
  score: number;
  pontos_fortes: string;
  o_que_falta: string;
}

// Deep search helper: recursively finds score/pontos_fortes/o_que_falta in any nested structure
function extractAnaliseFromResponse(raw: any, depth = 0): AnaliseResult | null {
  if (depth > 10) return null; // prevent infinite recursion

  // If it's a string, try parsing it (handles markdown-wrapped JSON, escaped JSON, etc.)
  if (typeof raw === "string") {
    const cleaned = raw
      .replace(/```json\s*/gi, "")
      .replace(/```/g, "")
      .trim();
    
    // Try JSON.parse
    try {
      const parsed = JSON.parse(cleaned);
      return extractAnaliseFromResponse(parsed, depth + 1);
    } catch {
      // Not valid JSON — try regex extraction from the raw string
      const scoreMatch = cleaned.match(/["']?score["']?\s*:\s*(\d+)/i);
      const fortesMatch = cleaned.match(/["']?pontos_fortes["']?\s*:\s*["']([\s\S]*?)["']\s*(?:,|\})/i);
      const faltaMatch = cleaned.match(/["']?(?:o_que_falta|pontos_fracos)["']?\s*:\s*["']([\s\S]*?)["']\s*(?:,|\})/i);
      if (scoreMatch) {
        return {
          score: parseInt(scoreMatch[1], 10),
          pontos_fortes: (fortesMatch?.[1] || "").replace(/\\n/g, "\n").replace(/\\"/g, '"'),
          o_que_falta: (faltaMatch?.[1] || "").replace(/\\n/g, "\n").replace(/\\"/g, '"'),
        };
      }
      return null;
    }
  }

  // If it's an array, search each element
  if (Array.isArray(raw)) {
    for (const item of raw) {
      const found = extractAnaliseFromResponse(item, depth + 1);
      if (found) return found;
    }
    return null;
  }

  // If it's an object
  if (raw && typeof raw === "object") {
    // Direct match: object has "score" property
    if (typeof raw.score !== "undefined") {
      return {
        score: Number(raw.score),
        pontos_fortes: String(raw.pontos_fortes || ""),
        o_que_falta: String(raw.o_que_falta || raw.pontos_fracos || ""),
      };
    }

    // Search ALL keys (not just common ones) to handle any n8n structure
    for (const key in raw) {
      if (raw[key] != null) {
        const found = extractAnaliseFromResponse(raw[key], depth + 1);
        if (found) return found;
      }
    }
  }

  return null;
}

export default function Carreiras() {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");

  const [vagaDetalhes, setVagaDetalhes] = useState<Vaga | null>(null);
  const [selectedVagaId, setSelectedVagaId] = useState<string | null>(null);

  const [isAnaliseOpen, setIsAnaliseOpen] = useState(false);
  const [analiseFile, setAnaliseFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analiseResult, setAnaliseResult] = useState<AnaliseResult | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    const fetchVagas = async () => {
      try {
        const response = await fetch("https://nonabortively-aciniform-jacoby.ngrok-free.dev/webhook/listar-vagas", {
          headers: { "ngrok-skip-browser-warning": "true" },
        });
        if (!response.ok) throw new Error("Erro ao buscar vagas");
        const data = await response.json();
        setVagas(data);
      } catch (error) {
        console.error("Erro:", error);
        toast({
          title: "Erro de conexão",
          description: "Não foi possível carregar as vagas no momento.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVagas();
  }, [toast]);

  const vagasFiltradas = vagas.filter((vaga) => {
    const termo = busca.toLowerCase();
    return (
      vaga.titulo?.toLowerCase().includes(termo) ||
      vaga.descricao?.toLowerCase().includes(termo) ||
      vaga.requisitos?.toLowerCase().includes(termo) ||
      vaga.departamento?.toLowerCase().includes(termo)
    );
  });

  const handleAnaliseSubmit = async () => {
    if (!analiseFile || !vagaDetalhes) {
      toast({ title: "Atenção", description: "Selecione um currículo em PDF.", variant: "destructive" });
      return;
    }

    setIsAnalyzing(true);
    setAnaliseResult(null);

    try {
      const formData = new FormData();
      formData.append("file", analiseFile);
      formData.append("descricao_vaga", vagaDetalhes.descricao || "");

      const response = await fetch("https://nonabortively-aciniform-jacoby.ngrok-free.dev/webhook/analise-previa-cv", {
        method: "POST",
        headers: { "ngrok-skip-browser-warning": "true" },
        body: formData,
      });

      if (!response.ok) throw new Error("Falha na API");
      
      const rawText = await response.text();
      console.log("=== ANALISE IA DEBUG ===");
      console.log("STATUS:", response.status);
      console.log("CONTENT-TYPE:", response.headers.get("content-type"));
      console.log("RAW TEXT (first 500 chars):", rawText.substring(0, 500));
      console.log("RAW TEXT FULL:", rawText);

      // Try to parse the raw response
      let parsed: any;
      try {
        parsed = JSON.parse(rawText);
        console.log("JSON PARSE OK - keys:", Object.keys(parsed));
      } catch (e) {
        console.log("JSON PARSE FALHOU:", e);
        parsed = rawText;
      }

      const extracted = extractAnaliseFromResponse(parsed);
      console.log("EXTRACTED RESULT:", JSON.stringify(extracted));

      if (extracted && extracted.score > 0) {
        setAnaliseResult({
          score: extracted.score,
          pontos_fortes: extracted.pontos_fortes || "Pontos fortes não detalhados pela IA.",
          o_que_falta: extracted.o_que_falta || "Lacunas não detalhadas pela IA.",
        });
      } else {
        // Show raw text in fallback for debugging
        const preview = rawText.substring(0, 200);
        setAnaliseResult({
          score: extracted?.score || 0,
          pontos_fortes: `[DEBUG] Parser não encontrou os dados. Resposta recebida: ${preview}`,
          o_que_falta: "Verifique o console do navegador (F12) para ver os logs completos da resposta.",
        });
      }

    } catch (error) {
      console.error(error);
      toast({
        title: "Erro na Análise",
        description: "Não foi possível comunicar com a API de Inteligência Artificial.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnaliseModal = () => {
    setIsAnaliseOpen(false);
    setAnaliseFile(null);
    setAnaliseResult(null);
    setIsAnalyzing(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "hsl(160, 84%, 39%)";
    if (score >= 40) return "hsl(38, 92%, 50%)";
    return "hsl(347, 77%, 50%)";
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Vagas em Aberto</h1>
        <p className="text-muted-foreground text-lg mb-8">Faça parte do nosso time e ajude a transformar o futuro.</p>

        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por cargo, tecnologia ou palavra-chave..."
            className="pl-12 h-14 text-base rounded-full border-primary/20 bg-background/50 backdrop-blur-sm focus-visible:ring-primary shadow-sm"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : vagas.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">Nenhuma vaga aberta no momento. Volte em breve!</div>
      ) : vagasFiltradas.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          Nenhuma vaga encontrada para &quot;{busca}&quot;. Tente outros termos.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vagasFiltradas.map((vaga) => (
            <Card key={vaga.id} className="flex flex-col h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary">{vaga.departamento || "Geral"}</Badge>
                  {vaga.status === "aberta" && <Badge className="bg-green-600 hover:bg-green-700">Ativa</Badge>}
                </div>
                <CardTitle className="text-xl">{vaga.titulo}</CardTitle>
                <CardDescription className="flex items-center gap-1 mt-2">
                  <MapPin className="h-4 w-4" /> {vaga.localizacao || "Remoto"}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {vaga.descricao || "Clique em 'Ver Detalhes' para saber mais sobre esta oportunidade."}
                </p>
              </CardContent>

              <CardFooter>
                <Button className="w-full" onClick={() => setVagaDetalhes(vaga)}>
                  Ver Detalhes
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* MODAL DE DETALHES DA VAGA */}
      <Dialog open={!!vagaDetalhes} onOpenChange={(open) => !open && setVagaDetalhes(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl">{vagaDetalhes?.titulo}</DialogTitle>
            <DialogDescription className="flex gap-4 text-md mt-3 items-center">
              <Badge variant="secondary" className="flex items-center gap-1 text-sm px-3 py-1">
                <Building className="w-4 h-4" /> {vagaDetalhes?.departamento || "Geral"}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1 text-sm px-3 py-1">
                <MapPin className="w-4 h-4" /> {vagaDetalhes?.localizacao || "Remoto"}
              </Badge>
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex-1 overflow-y-auto pr-2">
            <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
              {vagaDetalhes?.descricao || "Descrição detalhada não informada para esta vaga."}
            </div>
          </div>

          <DialogFooter className="mt-6 sm:justify-end gap-2 border-t pt-4">
            <Button 
              variant="secondary" 
              className="mr-auto bg-primary/10 text-primary hover:bg-primary/20"
              onClick={() => setIsAnaliseOpen(true)}
            >
              ✨ Analisar Aderência com IA
            </Button>
            
            <Button variant="outline" onClick={() => setVagaDetalhes(null)}>
              Voltar
            </Button>
            <Button
              onClick={() => {
                setSelectedVagaId(vagaDetalhes?.id || null);
                setVagaDetalhes(null);
              }}
            >
              Quero me candidatar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL DE ANÁLISE PRÉVIA COM IA */}
      <Dialog open={isAnaliseOpen} onOpenChange={(open) => !open && resetAnaliseModal()}>
        <DialogContent className="sm:max-w-md text-center flex flex-col items-center">
          
          {!isAnalyzing && !analiseResult && (
            <>
              <DialogHeader className="w-full">
                <DialogTitle className="text-center text-xl">Análise Prévia do Currículo</DialogTitle>
                <DialogDescription className="text-center">
                  Envie seu CV para descobrir sua compatibilidade com a vaga antes de se candidatar.
                </DialogDescription>
              </DialogHeader>
              
              <div className="w-full mt-6 flex flex-col items-center justify-center border-2 border-dashed border-primary/30 rounded-lg p-8 bg-muted/20">
                <UploadCloud className="h-10 w-10 text-primary mb-4" />
                <label className="cursor-pointer">
                  <span className="bg-primary/10 text-primary px-4 py-2 rounded-md hover:bg-primary/20 transition-colors font-medium">
                    {analiseFile ? analiseFile.name : "Selecionar PDF do Currículo"}
                  </span>
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => setAnaliseFile(e.target.files?.[0] || null)}
                  />
                </label>
              </div>

              <Button
                className="w-full mt-4"
                onClick={handleAnaliseSubmit}
                disabled={!analiseFile}
              >
                Analisar com IA
              </Button>
            </>
          )}

          {isAnalyzing && (
            <div className="py-12 flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-muted-foreground">A IA está analisando seu currículo...</p>
            </div>
          )}

          {analiseResult && (
            <div className="w-full space-y-6 py-4">
              {/* Score Ring */}
              <div className="flex justify-center">
                <div
                  className="w-24 h-24 rounded-full border-4 flex items-center justify-center"
                  style={{ borderColor: getScoreColor(analiseResult.score) }}
                >
                  <span
                    className="text-2xl font-bold"
                    style={{ color: getScoreColor(analiseResult.score) }}
                  >
                    {analiseResult.score}%
                  </span>
                </div>
              </div>

              {/* Pontos Fortes */}
              <div className="text-left">
                <h4 className="font-semibold flex items-center gap-2 mb-2">
                  <Star className="h-4 w-4 text-yellow-500" /> Pontos Fortes
                </h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {analiseResult.pontos_fortes}
                </p>
              </div>

              {/* O que Falta */}
              <div className="text-left">
                <h4 className="font-semibold flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" /> O que Falta
                </h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {analiseResult.o_que_falta}
                </p>
              </div>

              <Button className="w-full" onClick={resetAnaliseModal}>
                Fechar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* MODAL DE CANDIDATURA */}
      <Dialog open={!!selectedVagaId} onOpenChange={(open) => !open && setSelectedVagaId(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Enviar Candidatura</DialogTitle>
            <DialogDescription>
              Envie seu currículo em PDF para se candidatar a esta vaga.
            </DialogDescription>
          </DialogHeader>
          <ResumeUploadForm
            vagaId={selectedVagaId || undefined}
            onSuccess={() => {
              setSelectedVagaId(null);
              toast({ title: "Sucesso!", description: "Sua candidatura foi enviada com sucesso." });
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
