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

      const response = await fetch("http://localhost:5678/webhook/analise-previa-cv", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Falha na API");
      
      const rawText = await response.text();
      console.log("TEXTO BRUTO RECEBIDO:", rawText);

      let finalScore = 0;
      let finalFortes = "";
      let finalFalta = "";

      // TENTATIVA 1: Procurar nos objetos do JSON
      try {
        const data = JSON.parse(rawText);
        const findData = (obj: any): any => {
          if (typeof obj === 'string') {
            try {
              const clean = obj.replace(/```json/g, '').replace(/```/g, '').trim();
              const parsed = JSON.parse(clean);
              if (parsed && typeof parsed.score !== 'undefined') return parsed;
            } catch(e) {}
          } else if (obj && typeof obj === 'object') {
            if (typeof obj.score !== 'undefined') return obj;
            for (const key in obj) {
              const found = findData(obj[key]);
              if (found) return found;
            }
          }
          return null;
        };
        
        const extracted = findData(data);
        if (extracted) {
          finalScore = Number(extracted.score);
          finalFortes = extracted.pontos_fortes || "";
          finalFalta = extracted.o_que_falta || extracted.pontos_fracos || "";
        }
      } catch (e) {
        console.log("Falha no parser JSON, usando extrator bruto.");
      }

      // TENTATIVA 2 (EXTRATOR BRUTO): Se falhou ou a IA mandou mal formatado, arranca por Regex
      if (finalScore === 0) {
        const sMatch = rawText.match(/["']?score["']?\s*:\s*(\d+)/i);
        if (sMatch) finalScore = parseInt(sMatch[1], 10);

        const ptMatch = rawText.match(/["']?pontos_fortes["']?\s*:\s*["']([\s\S]*?)["']\s*(?:,|})/i);
        if (ptMatch) finalFortes = ptMatch[1].replace(/\\n/g, ' ').replace(/\\"/g, '"');

        const ftMatch = rawText.match(/["']?(?:o_que_falta|pontos_fracos)["']?\s*:\s*["']([\s\S]*?)["']\s*(?:,|})/i);
        if (ftMatch) finalFalta = ftMatch[1].replace(/\\n/g, ' ').replace(/\\"/g, '"');
      }

      // Se mesmo com força bruta não achar os textos, mostra aviso amigável
      if (!finalFortes) finalFortes = "O seu currículo tem elementos interessantes, mas a IA não detalhou os pontos fortes.";
      if (!finalFalta) finalFalta = "A análise foi concluída, mas as lacunas não foram listadas.";

      setAnaliseResult({
        score: finalScore || 0,
        pontos_fortes: finalFortes,
        o_que_falta: finalFalta
      });

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
          Nenhuma vaga encontrada para "{busca}". Tente outros termos.
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
                  {vaga.descricao
                    ? vaga.descricao
                    : "Clique em 'Ver Detalhes' para saber mais sobre esta oportunidade."}
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
            <div className="text-sm text-white whitespace-pre-wrap leading-relaxed">
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
                <DialogTitle className="text-center text-xl">Test Drive de Currículo</DialogTitle>
                <DialogDescription className="text-center">
                  Descubra suas chances antes de enviar. A nossa IA vai comparar o seu perfil com a vaga de <b>{vagaDetalhes?.titulo}</b>.
                </DialogDescription>
              </DialogHeader>
              
              <div className="w-full mt-6 flex flex-col items-center justify-center border-2 border-dashed border-primary/30 rounded-lg p-8 bg-muted/20">
                <UploadCloud className="h-10 w-10 text-primary mb-4" />
                <label className="cursor-pointer">
                  <span className="bg-primary/10 text-primary px-4 py-2 rounded-md hover:bg-primary/20 transition-colors font-medium">
                    {analise