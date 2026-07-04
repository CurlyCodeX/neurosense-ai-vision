import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, AlertTriangle, Activity, TrendingUp, ChevronRight } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/doctor/")({
  head: () => ({ meta: [{ title: "Doctor Overview — NeuroSense" }] }),
  component: DoctorOverview,
});

const trend = [
  { d: "Mon", v: 12 }, { d: "Tue", v: 18 }, { d: "Wed", v: 15 },
  { d: "Thu", v: 22 }, { d: "Fri", v: 28 }, { d: "Sat", v: 20 }, { d: "Sun", v: 25 },
];

function DoctorOverview() {
  const { user } = useAuth();
  const patients = useQuery({ queryKey: ["patients"], queryFn: api.listPatients });
  const preds = useQuery({ queryKey: ["all-preds"], queryFn: () => api.listPredictions() });

  const pendingReview = (preds.data || []).filter(p => !p.doctorReviewed);
  const seizureCount = (preds.data || []).filter(p => p.label === "Seizure").length;
  const distribution = [
    { name: "Normal", value: (preds.data || []).filter(p => p.label === "Normal").length, color: "oklch(0.68 0.16 155)" },
    { name: "Pre-ictal", value: (preds.data || []).filter(p => p.label === "Pre-ictal").length, color: "oklch(0.78 0.15 75)" },
    { name: "Seizure", value: seizureCount, color: "oklch(0.60 0.24 25)" },
  ];

  const stats = [
    { label: "Active patients", value: patients.data?.length ?? 0, icon: Users, tint: "bg-primary/10 text-primary" },
    { label: "Predictions today", value: preds.data?.length ?? 0, icon: Activity, tint: "bg-success/10 text-success" },
    { label: "Pending review", value: pendingReview.length, icon: AlertTriangle, tint: "bg-warning/15 text-warning" },
    { label: "Seizure flags", value: seizureCount, icon: TrendingUp, tint: "bg-destructive/10 text-destructive" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Welcome, {user?.name || "Doctor"}</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of your clinical caseload.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
                <div className="mt-2 text-3xl font-bold">{s.value}</div>
              </div>
              <div className={`h-9 w-9 rounded-lg grid place-items-center ${s.tint}`}><s.icon className="h-4 w-4" /></div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <div><h2 className="text-base font-semibold">Weekly predictions</h2><p className="text-xs text-muted-foreground">Rolling 7-day activity</p></div>
            <Badge variant="secondary">+18% vs last week</Badge>
          </div>
          <div className="h-56">
            <ResponsiveContainer>
              <LineChart data={trend}>
                <defs>
                  <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.55 0.20 250)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="oklch(0.55 0.20 250)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="d" stroke="var(--muted-foreground)" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="v" stroke="oklch(0.55 0.20 250)" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="text-base font-semibold">Class distribution</h2>
          <div className="h-40 mt-2">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={distribution} innerRadius={40} outerRadius={60} paddingAngle={3} dataKey="value">
                  {distribution.map((d) => <Cell key={d.name} fill={d.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {distribution.map(d => (
              <div key={d.name} className="flex items-center gap-2 text-xs">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
                <span className="flex-1">{d.name}</span>
                <span className="font-semibold">{d.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold">Predictions awaiting review</h2>
          <Button variant="ghost" size="sm" asChild><Link to="/doctor/patients">All patients <ChevronRight className="h-4 w-4 ml-1" /></Link></Button>
        </div>
        <div className="divide-y divide-border">
          {pendingReview.map(p => (
            <div key={p.id} className="py-3 flex items-center gap-4">
              <div className={`h-9 w-9 rounded-lg grid place-items-center ${p.label === "Seizure" ? "bg-destructive/10 text-destructive" : "bg-warning/15 text-warning"}`}>
                <Activity className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{p.patientName} · {p.label}</div>
                <div className="text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleString()} · confidence {(p.confidence*100).toFixed(0)}%</div>
              </div>
              <Button variant="outline" size="sm" asChild><Link to="/doctor/patients">Review</Link></Button>
            </div>
          ))}
          {pendingReview.length === 0 && <div className="py-8 text-sm text-muted-foreground text-center">All caught up.</div>}
        </div>
      </Card>
    </div>
  );
}