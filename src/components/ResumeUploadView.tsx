import { Upload } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResumeUploadForm } from "@/components/ResumeUploadForm";

export function ResumeUploadView() {
  return (
    <div className="flex items-start justify-center pt-8 md:pt-16 px-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Enviar Currículo
          </CardTitle>
          <CardDescription>
            Selecione um arquivo PDF para análise automática.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResumeUploadForm />
        </CardContent>
      </Card>
    </div>
  );
}
