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
  status: "new" | "screened" | "interview" | "rejected" | string;
  aiScore: number;
  aiJustification: string;
  skills: string[];
  qualifications: string[];
  jobHistory: JobHistory[];
  resumoIa?: string;
  pontosFortes: string[];
  pontosFracos: string[];
  textoExtraido?: string;
  urlPdf?: string;
  perguntas_entrevista?: string; // <-- A nossa nova gaveta para a IA
}

export const candidates: Candidate[] = [];
