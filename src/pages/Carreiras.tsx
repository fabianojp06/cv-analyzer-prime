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

// Tipagem exata em Português
interface Vaga {
  id?: string;
  titulo: string;
  descricao?: string;
  requisitos?: string;
  status: string;
  localizacao?: string;
  departamento?: string;
}

// Tipagem da resposta da IA
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

  // Função Invencível para extrair a resposta da OpenAI dentro do pacote do n8n
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

      if (!response.ok) throw new Error("Falha na análise. Status: " + response.status);
      
      const rawText = await response.text();
      console.log("RESPOSTA BRUTA DO N8N:", rawText); 

      let finalResult = null;

      // CAÇA-TESOURO: Varre qualquer estrutura que o n8n tenha inventado de mandar
      const extractResult = (inputRawText: string) => {
        let jsonObj;
        try { 
          jsonObj = JSON.parse(inputRawText); 
        } catch(e) { 
          return null; 
        }

        if (jsonObj && jsonObj.score !== undefined) return jsonObj;

        let result = null;

        // Função recursiva para entrar em todas as caixas (arrays/objetos)
        const traverse = (obj: any) => {
          if (!obj || typeof obj !== 'object') return;
          if (result) return; 

          for (const key in obj) {
            const val = obj[key];
            if (typeof val === 'string' && val.includes('"score"') && val.includes('"pontos_fortes"')) {
              try {
                // Remove as crases do markdown (```json ... ```) se a IA as enviou
                const limpo = val.replace(/```json/g, '').replace(/```/g, '').trim();
                const parsedIA = JSON.parse(limpo);
                if (parsedIA && parsedIA.score !== undefined) {
                  result = parsedIA;
                  return;
                }
              } catch(e) {}
            } else if (typeof val === 'object') {
              traverse(val);
            }
          }
        };

        traverse(jsonObj);
        return result;
      };

      finalResult = extractResult(rawText);

      if (!finalResult) {
        throw new Error("O objeto com score e pontos_fortes não foi encontrado.");
      }
      
      // Injeta os dados limpos na tela
      setAnaliseResult({
        score: Number(finalResult.score) || 0,
        pontos_fortes: finalResult.pontos_fortes || "Análise de pontos fortes não retornada.",
        o_que_falta: finalResult.o_que_falta || finalResult.pontos_fracos || "Análise de lacunas não retornada."
      });

    } catch (error) {
      console.error(error);
      toast({
        title: "Erro na Análise",
        description: "A IA não conseguiu estruturar a análise do seu currículo. Tente novamente.",
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

              <DialogFooter className="w-full mt-6">
                <Button className="w-full" onClick={handleAnaliseSubmit} disabled={!analiseFile}>
                  Gerar Análise com IA
                </Button>
              </DialogFooter>
            </>
          )}

          {isAnalyzing && (
            <div className="py-12 flex flex-col items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mb-6"></div>
              <h3 className="text-lg font-semibold">A Inteligência Artificial está lendo o seu currículo...</h3>
              <p className="text-sm text-muted-foreground mt-2 text-center">
                Mapeando competências, cruzando requisitos e calculando a aderência.
              </p>
            </div>
          )}

          {analiseResult && (
            <div className="w-full flex flex-col items-center pt-4">
              <div className="relative w-24 h-24 mb-6 flex items-center justify-center rounded-full border-4" 
                   style={{ borderColor: analiseResult.score >= 70 ? '#22c55e' : analiseResult.score >= 40 ? '#eab308' : '#ef4444' }}>
                <span className="text-2xl font-bold">{analiseResult.score}%</span>
              </div>

              <h3 className="text-lg font-semibold mb-4">Resultado da Análise</h3>

              <div className="w-full text-left space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <h4 className="font-semibold flex items-center gap-2 text-green-400 mb-2">
                    <Star className="w-4 h-4" /> Pontos Fortes
                  </h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{analiseResult.pontos_fortes}</p>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <h4 className="font-semibold flex items-center gap-2 text-yellow-400 mb-2">
                    <AlertTriangle className="w-4 h-4" /> O que Falta
                  </h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{analiseResult.o_que_falta}</p>
                </div>
              </div>

              <DialogFooter className="w-full mt-6">
                <Button className="w-full" variant="outline" onClick={resetAnaliseModal}>
                  Fechar
                </Button>
              </DialogFooter>
            </div>
          )}

        </DialogContent>
      </Dialog>

      {/* MODAL DE CANDIDATURA */}
      <Dialog open={!!selectedVagaId} onOpenChange={(open) => !open && setSelectedVagaId(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Enviar Candidatura</DialogTitle>
            <DialogDescription>
              Preencha o formulário abaixo para se candidatar a esta vaga.
            </DialogDescription>
          </DialogHeader>
          <ResumeUploadForm
            vagaId={selectedVagaId || ""}
            onSuccess={() => setSelectedVagaId(null)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}