import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { candidates } from "@/data/candidates";
import { jobs } from "@/data/jobs";
import { Briefcase, Users, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { RecentActivity } from "./RecentActivity";

const slaData = [
  { month: "Set", contratações: 3 },
  { month: "Out", contratações: 5 },
  { month: "Nov", contratações: 4 },
  { month: "Dez", contratações: 7 },
  { month: "Jan", contratações: 6 },
  { month: "Fev", contratações: 8 },
];

export function DashboardView() {
  const barData = useMemo(() => {
    return jobs.map((job) => ({
      name: job.title.length > 18 ? job.title.slice(0, 18) + "…" : job.title,
      candidatos: candidates.filter((c) => c.jobId === job.id).length,
    }));
  }, []);

  const totalOpen = jobs.filter((j) => j.status === "open").length;
  const screened = candidates.filter((c) => c.status !== "new").length;
  const avgScore = Math.round(
    candidates.reduce((a, c) => a + c.aiScore, 0) / candidates.length
  );

  const kpis = [
    { label: "Vagas Abertas", value: totalOpen, icon: Briefcase, color: "text-primary" },
    { label: "Triados pela IA", value: screened, icon: Users, color: "text-[hsl(var(--score-high))]" },
    { label: "Média Score IA", value: `${avgScore}%`, icon: TrendingUp, color: "text-[hsl(var(--score-medium))]" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Dashboard Global</h2>
        <p className="text-sm text-muted-foreground">Visão geral do recrutamento</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="bg-card/60 border-border backdrop-blur-sm">
            <CardContent className="flex items-center gap-4 p-4">
              <div className={`w-10 h-10 rounded-lg bg-secondary flex items-center justify-center ${kpi.color}`}>
                <kpi.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Bar chart */}
        <Card className="bg-card/60 border-border backdrop-blur-sm">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-foreground mb-4">Candidatos por Vaga</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(240 5% 55%)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(240 5% 55%)" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(240 6% 10%)", border: "1px solid hsl(240 4% 16%)", borderRadius: 8, fontSize: 12, color: "hsl(0 0% 95%)" }}
                />
                <Bar dataKey="candidatos" fill="hsl(239 84% 67%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Line chart */}
        <Card className="bg-card/60 border-border backdrop-blur-sm">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-foreground mb-4">Evolução de Contratações (SLA)</h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={slaData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 4% 16%)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(240 5% 55%)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(240 5% 55%)" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(240 6% 10%)", border: "1px solid hsl(240 4% 16%)", borderRadius: 8, fontSize: 12, color: "hsl(0 0% 95%)" }}
                />
                <Line type="monotone" dataKey="contratações" stroke="hsl(160 84% 39%)" strokeWidth={2} dot={{ fill: "hsl(160 84% 39%)", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
}
