import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/patient/history")({
  head: () => ({ meta: [{ title: "History — NeuroSense" }] }),
  component: HistoryPage,
});

function HistoryPage() {
  const { data = [] } = useQuery({ queryKey: ["history"], queryFn: () => api.listPredictions("p-001") });
  const sorted = [...data].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Prediction History</h1>
        <p className="text-sm text-muted-foreground mt-1">Timeline of every EEG analysis you've submitted.</p>
      </div>
      <div className="relative">
        <div className="absolute left-4 top-2 bottom-2 w-px bg-border" />
        <div className="space-y-4">
          {sorted.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="relative pl-12">
              <div className={`absolute left-2 top-4 h-4 w-4 rounded-full border-2 border-background ${p.label === "Seizure" ? "bg-destructive" : p.label === "Pre-ictal" ? "bg-warning" : "bg-success"}`} />
              <Card className="p-5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-semibold">{p.label}</div>
                      <div className="text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-xs text-muted-foreground">Confidence <span className="font-semibold text-foreground">{(p.confidence*100).toFixed(0)}%</span></div>
                    {p.doctorReviewed ? <Badge variant="secondary">Reviewed</Badge> : <Badge variant="outline">Pending review</Badge>}
                  </div>
                </div>
                {p.remarks && <p className="mt-3 text-sm text-muted-foreground italic">"{p.remarks}"</p>}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}