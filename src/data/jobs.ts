export interface Job {
  id: string;
  titulo: string;
  departamento: string;
  localizacao: string;
  status: string;
  descricao?: string; // <-- O novo campo adicionado para receber o texto completo da vaga
}
