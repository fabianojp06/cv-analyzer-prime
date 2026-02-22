import { useState, useRef } from "react";
import { Upload, CheckCircle, AlertCircle, Loader2, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const WEBHOOK_URL = "http://localhost:5678/webhook/analisar-cv";
const MAX_SIZE = 20 * 1024 * 1024;

interface ResumeUploadFormProps {
  vagaId?: string;
}

export function ResumeUploadForm({ vagaId }: ResumeUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setStatus("idle");
    if (selected && selected.type !== "application/pdf") {
      setStatus("error");
      setErrorMessage("Apenas arquivos PDF são aceitos.");
      setFile(null);
      return;
    }
    if (selected && selected.size > MAX_SIZE) {
      setStatus("error");
      setErrorMessage("O arquivo excede o tamanho máximo de 20 MB.");
      setFile(null);
      return;
    }
    setFile(selected);
  };

  const clearFile = () => {
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);
    setStatus("idle");

    try {
      const formData = new FormData();
      formData.append("data", file);
      if (vagaId) {
        formData.append("vaga_id", vagaId);
      }

      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setStatus("success");
        clearFile();
      } else {
        setStatus("error");
        setErrorMessage(`Erro no envio (${response.status}). Tente novamente.`);
      }
    } catch {
      setStatus("error");
      setErrorMessage("Não foi possível conectar ao servidor. Verifique sua conexão.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <label
        htmlFor={`cv-file-${vagaId ?? "default"}`}
        className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/30 p-8 cursor-pointer hover:border-primary/50 transition-colors"
      >
        {file ? (
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <FileText className="h-5 w-5 text-primary" />
            <span className="break-all">{file.name}</span>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); clearFile(); }}
              className="ml-1 rounded-full p-0.5 hover:bg-muted"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        ) : (
          <>
            <Upload className="h-8 w-8 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Clique para selecionar um PDF
            </span>
          </>
        )}
        <input
          ref={inputRef}
          id={`cv-file-${vagaId ?? "default"}`}
          type="file"
          accept=".pdf,application/pdf"
          className="sr-only"
          onChange={handleFileChange}
        />
      </label>

      <Button type="submit" className="w-full" disabled={!file || isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Enviando…
          </>
        ) : (
          "Enviar"
        )}
      </Button>

      {status === "success" && (
        <Alert className="border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400">
          <CheckCircle className="h-4 w-4 !text-green-600 dark:!text-green-400" />
          <AlertTitle>Sucesso</AlertTitle>
          <AlertDescription>Currículo enviado com sucesso!</AlertDescription>
        </Alert>
      )}

      {status === "error" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </form>
  );
}
