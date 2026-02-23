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

      if (!response.ok) throw new Error("Falha na análise. Status: " + response.status);
      
      const rawText = await response.text();
      let extractedData = null;

      try {
        const parsedObj = JSON.parse(rawText);

        // A MÁGICA: Varre TUDO (recursivamente) até encontrar uma string que seja um JSON válido contendo o 'score'
        const findScoreObj = (obj: any): any => {
          if (typeof obj === "string") {
            try {
              const limpo = obj.replace(/```json/g, "").replace(/```/g, "").trim();
              const parsedStr = JSON.parse(limpo);
              if (parsedStr && typeof parsedStr.score !== "undefined") {
                return parsedStr; // Achou o tesouro!
              }
            } catch (e) {
              // Não é o JSON que queremos, continua procurando
            }
          } else if (obj && typeof obj === "object") {
            // Se já estiver na raiz do objeto
            if (typeof obj.score !== "undefined" && typeof obj.pontos_fortes !== "undefined") {
              return obj;
            }
            // Entra em cada "gaveta" do objeto para procurar
            for (const key in obj) {
              const res = findScoreObj(obj[key]);
              if (res) return res;
            }
          }
          return null;
        };

        extractedData = findScoreObj(parsedObj);

      } catch (parseError) {
        console.error("Erro ao ler resposta HTTP:", parseError);
      }

      // Se a busca falhar, aplica o fallback
      if (!extractedData || extractedData.score === undefined) {
        extractedData = {
          score: 0,
          pontos_fortes: "A IA analisou seu perfil, mas não conseguiu formatar os pontos fortes corretamente.",
          o_que_falta: "O currículo foi lido, mas a resposta da inteligência artificial falhou na estruturação."
        };
      }

      setAnaliseResult({
        score: Number(extractedData.score) || 0,
        pontos_fortes: extractedData.pontos_fortes || "Sem dados de pontos fortes.",
        o_que_falta: extractedData.o_que_falta || extractedData.pontos_fracos || "Sem dados de lacunas."
      });

    } catch (error) {
      console.error(error);
      toast({
        title: "Erro na Análise",
        description: "Não foi possível conectar com o motor de Inteligência Artificial.",
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

          <div className="overflow-y-auto flex-grow pr-2 space-y-6 py-4">
            {vagaDetalhes?.descricao && (
              <div>
                <h3 className="font-semibold text-lg mb-2">Descrição</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{vagaDetalhes.descricao}</p>
              </div>
            )}
            {vagaDetalhes?.requisitos && (
              <div>
                <h3 className="font-semibold text-lg mb-2">Requisitos</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{vagaDetalhes.requisitos}</p>
              </div>
            )}
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2 pt-4 border-t">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => {
                setIsAnaliseOpen(true);
              }}
            >
              <Star className="w-4 h-4 mr-2" /> Análise Prévia do CV
            </Button>
            <Button
              className="w-full sm:w-auto"
              onClick={() => {
                setSelectedVagaId(vagaDetalhes?.id || null);
                setVagaDetalhes(null);
              }}
            >
              <UploadCloud className="w-4 h-4 mr-2" /> Enviar Candidatura
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL DE ANÁLISE PRÉVIA */}
      <Dialog open={isAnaliseOpen} onOpenChange={(open) => !open && resetAnaliseModal()}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Análise Prévia do Currículo</DialogTitle>
            <DialogDescription>
              Envie seu CV para descobrir sua compatibilidade com a vaga antes de se candidatar.
            </DialogDescription>
          </DialogHeader>

          {!analiseResult ? (
            <div className="space-y-4 py-4">
              <Input
                type="file"
                accept=".pdf"
                onChange={(e) => setAnaliseFile(e.target.files?.[0] || null)}
              />
              <Button onClick={handleAnaliseSubmit} disabled={isAnalyzing || !analiseFile} className="w-full">
                {isAnalyzing ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Analisando com IA...
                  </div>
                ) : (
                  "Analisar Compatibilidade"
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-center">
                <div
                  className="w-20 h-20 rounded-full border-4 flex items-center justify-center text-2xl font-bold"
                  style={{
                    borderColor: analiseResult.score >= 70 ? '#22c55e' : analiseResult.score >= 40 ? '#eab308' : '#ef4444',
                    color: analiseResult.score >= 70 ? '#22c55e' : analiseResult.score >= 40 ? '#eab308' : '#ef4444',
                  }}
                >
                  {analiseResult.score}%
                </div>
              </div>

              <div>
                <h4 className="font-semibold flex items-center gap-1 mb-1">
                  <Star className="w-4 h-4 text-yellow-500" /> Pontos Fortes
                </h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{analiseResult.pontos_fortes}</p>
              </div>

              <div>
                <h4 className="font-semibold flex items-center gap-1 mb-1">
                  <AlertTriangle className="w-4 h-4 text-orange-500" /> O que Falta
                </h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{analiseResult.o_que_falta}</p>
              </div>

              <Button variant="outline" onClick={resetAnaliseModal} className="w-full">
                Fechar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* MODAL DE CANDIDATURA */}
      <Dialog open={!!selectedVagaId} onOpenChange={(open) => !open && setSelectedVagaId(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Enviar Candidatura</DialogTitle>
            <DialogDescription>Anexe seu currículo em PDF para se candidatar a esta vaga.</DialogDescription>
          </DialogHeader>
          <ResumeUploadForm
            vagaId={selectedVagaId || undefined}
            onSuccess={() => {
              setSelectedVagaId(null);
              toast({ title: "Sucesso!", description: "Candidatura enviada com sucesso." });
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}