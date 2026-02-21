import { candidates } from "@/data/candidates";
import { jobs } from "@/data/jobs";
import { BrainCircuit } from "lucide-react";

const activities = candidates
  .filter((c) => c.status !== "new")
  .slice(0, 6)
  .map((c) => {
    const job = jobs.find((j) => j.id === c.jobId);
    return {
      id: c.id,
      text: `A IA avaliou ${c.name.split(" ")[0]} para a vaga ${job?.title ?? "N/A"} com Score ${c.aiScore}`,
      score: c.aiScore,
      time: c.aiScore > 80 ? "há 2h" : c.aiScore > 60 ? "há 5h" : "há 1d",
    };
  });

export function RecentActivity() {
  return (
    <div className="rounded-xl border border-border bg-card/60 backdrop-blur-sm">
      <div className="flex items-center gap-2 p-4 border-b border-border">
        <BrainCircuit className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Atividades Recentes da IA</h3>
      </div>
      <div className="divide-y divide-border">
        {activities.map((a) => (
          <div key={a.id} className="flex items-center justify-between px-4 py-3">
            <p className="text-sm text-muted-foreground">{a.text}</p>
            <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{a.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
