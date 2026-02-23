export interface JobHistory {
  company: string;
  role: string;
  period: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  jobId: string;
  status: "new" | "screened" | "interview" | "rejected";
  aiScore: number;
  aiJustification: string;
  skills: string[];
  qualifications: string[];
  jobHistory: JobHistory[];
  resumoIa: string;
  pontosFortes: string[];
  pontosFracos: string[];
  textoExtraido: string;
  urlPdf: string;
}

export interface Candidate {
  id: string;
  name: string;
  // ... outras propriedades ...
  perguntas_entrevista?: string; // <-- ADICIONE ESTA LINHA
}
