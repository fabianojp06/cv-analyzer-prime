export interface Candidate {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  status: string;
  aiScore: number;
  aiJustification: string;
  resumoIa?: string;
  pontosFortes: string[];
  pontosFracos: string[];
  textoExtraido?: string;
  urlPdf?: string;
  perguntas_entrevista?: string; // <-- A nossa nova gaveta aqui!
}

// Esta é a linha que havia sido apagada sem querer e que faz o Dashboard funcionar:
export const candidates: Candidate[] = [];
