import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, LineChart, Line, AreaChart, Area, CartesianGrid, Legend } from "recharts";

export const Route = createFileRoute("/doctor/analytics")({
  head: () => ({ meta: [{ title: "Analytics — NeuroSense" }] }),
  component: Analytics,
});

const monthly = [
  { m: "Jan", predictions: 120, seizures: 22 }, { m: "Feb", predictions: 145, seizures: 30 },
  { m: "Mar", predictions: 168, seizures: 28 }, { m: "Apr", predictions: 190, seizures: 35 },
  { m: "May", predictions: 210, seizures: 40 }, { m: "Jun", predictions: 245, seizures: 46 },
  { m: "Jul", predictions: 268, seizures: 52 },
];
const ageBuckets = [
  { g: "0-18", v: 24 }, { g: "19-35", v: 62 }, { g: "36-55", v: 48 }, { g: "56-75", v: 30 }, { g: "75+", v: 12 },
];
const accuracy = [
  { d: "W1", v: 94.2 }, { d: "W2", v: 95.1 }, { d: "W3", v: 94.8 },
  { d: "W4", v: 96.0 }, { d: "W5", v: 96.7 }, { d: "W6", v: 97.4 },
];

function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Population-level insights across your caseload.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-base font-semibold">Monthly volume</h2>
          <p className="text-xs text-muted-foreground">Predictions vs. seizure flags</p>
          <div className="h-64 mt-4">
            <ResponsiveContainer>
              <AreaChart data={monthly}>
                <defs>
                  <linearGradient id="a1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.55 0.20 250)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="oklch(0.55 0.20 250)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="a2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.60 0.24 25)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="oklch(0.60 0.24 25)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey="m" stroke="var(--muted-foreground)" tick={{ fontSize: 11 }} />
                <YAxis stroke="var(--muted-foreground)" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="predictions" stroke="oklch(0.55 0.20 250)" fill="url(#a1)" strokeWidth={2} />
                <Area type="monotone" dataKey="seizures" stroke="oklch(0.60 0.24 25)" fill="url(#a2)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-base font-semibold">Model accuracy</h2>
          <p className="text-xs text-muted-foreground">Validated on holdout set (weekly)</p>
          <div className="h-64 mt-4">
            <ResponsiveContainer>
              <LineChart data={accuracy}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey="d" stroke="var(--muted-foreground)" tick={{ fontSize: 11 }} />
                <YAxis domain={[92, 100]} stroke="var(--muted-foreground)" tick={{ fontSize: 11 }} unit="%" />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="v" stroke="oklch(0.68 0.16 155)" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <h2 className="text-base font-semibold">Patients by age group</h2>
          <div className="h-64 mt-4">
            <ResponsiveContainer>
              <BarChart data={ageBuckets}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey="g" stroke="var(--muted-foreground)" tick={{ fontSize: 11 }} />
                <YAxis stroke="var(--muted-foreground)" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="v" fill="oklch(0.55 0.20 250)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}