export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  status: "open" | "closed" | "paused";
  createdAt: string;
}

export const jobs: Job[] = [];
