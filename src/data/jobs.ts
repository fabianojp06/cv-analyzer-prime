export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  status: "open" | "closed" | "paused";
  createdAt: string;
}

export const jobs: Job[] = [
  {
    id: "job-1",
    title: "Desenvolvedor Frontend Senior",
    department: "Engenharia",
    location: "Remoto",
    status: "open",
    createdAt: "2025-12-01",
  },
  {
    id: "job-2",
    title: "Backend Engineer Pleno",
    department: "Engenharia",
    location: "São Paulo, SP",
    status: "open",
    createdAt: "2025-12-10",
  },
  {
    id: "job-3",
    title: "UX Designer Senior",
    department: "Design",
    location: "Remoto",
    status: "open",
    createdAt: "2026-01-05",
  },
  {
    id: "job-4",
    title: "Data Scientist Pleno",
    department: "Dados & IA",
    location: "Campinas, SP",
    status: "open",
    createdAt: "2026-01-15",
  },
  {
    id: "job-5",
    title: "Product Manager Senior",
    department: "Produto",
    location: "São Paulo, SP",
    status: "open",
    createdAt: "2026-01-20",
  },
  {
    id: "job-6",
    title: "DevOps Engineer",
    department: "Infraestrutura",
    location: "Remoto",
    status: "open",
    createdAt: "2026-02-01",
  },
];
