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
}

export const candidates: Candidate[] = [];
