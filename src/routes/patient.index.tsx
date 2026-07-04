import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api, type Prediction } from "@/lib/api";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { EegWave } from "@/components/eeg-wave";
import { generateReportPdf } from "@/lib/pdf";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { Upload, Download, AlertTriangle, FileText, Activity, ChevronRight, Loader2, Phone } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/patient/")({
  head: () => ({ meta: [{ title: "Dashboard — NeuroSense" }, { name: "description", content: "Your EEG dashboard." }] }),
  component: PatientDashboard,
});

function PatientDashboard() {
  const { user } = useAuth();
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [uploading, setUploading] = useState(false);
  const previous = useQuery({ queryKey: ["predictions", user?.id], queryFn: () => api.listPredictions("p-001") });

  async function onFile(f: File) {
    setUploading(true); setPrediction(null);
    try {
      const res = await api.uploadEeg(f);
      setPrediction(res);
      toast.success(`Analysis complete — ${res.label}`);
    } catch { toast.error("Analysis failed. Try again."); }
    finally { setUploading(false); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Hello, {(user?.name || "Patient").split(" ")[0]}</h1>
          <p className="text-sm text-muted-foreground mt-1">Upload your latest EEG or review your history.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild><Link to="/patient/history"><FileText className="h-4 w-4 mr-2" />History</Link></Button>
          <Button asChild><Link to="/patient/upload"><Upload className="h-4 w-4 mr-2" />New EEG</Link></Button>
        </div>
      </div>

      {/* Emergency alert */}
      <Card className="p-5 bg-destructive/5 border-destructive/20 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="h-11 w-11 rounded-xl bg-destructive/15 text-destructive grid place-items-center shrink-0">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-foreground">Emergency guidance</div>
          <div className="text-xs text-muted-foreground mt-0.5">If a seizure lasts more than 5 minutes, or if breathing is difficult, call emergency services immediately.</div>
        </div>
        <Button variant="destructive" size="sm"><Phone className="h-4 w-4 mr-2" />Call 911</Button>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upload */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold">Upload EEG recording</h2>
              <p className="text-xs text-muted-foreground mt-1">Supports .edf, .csv, .npy files up to 100MB</p>
            </div>
            <Badge variant="secondary" className="font-mono text-[10px]">Model v3.2</Badge>
          </div>
          <label className={`mt-5 flex flex-col items-center justify-center border-2 border-dashed rounded-xl h-56 cursor-pointer transition ${uploading ? "border-primary/40 bg-primary/5" : "border-border hover:border-primary/40 hover:bg-primary/5"}`}>
            {uploading ? (
              <>
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <div className="mt-3 text-sm font-medium">Analysing EEG signals…</div>
                <div className="text-xs text-muted-foreground mt-1">Running CNN-LSTM inference</div>
              </>
            ) : (
              <>
                <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary grid place-items-center"><Upload className="h-5 w-5" /></div>
                <div className="mt-3 text-sm font-medium">Drop your EEG file here or click to browse</div>
                <div className="text-xs text-muted-foreground mt-1">FastAPI backend · encrypted upload</div>
              </>
            )}
            <input type="file" className="hidden" accept=".edf,.csv,.npy,.txt" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} disabled={uploading} />
          </label>
        </Card>

        {/* Prediction card */}
        <Card className="p-6 flex flex-col">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Latest prediction</div>
          {prediction ? (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-3 flex-1 flex flex-col">
              <div className={`text-3xl font-bold ${prediction.label === "Seizure" ? "text-destructive" : prediction.label === "Pre-ictal" ? "text-warning" : "text-success"}`}>
                {prediction.label}
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">Confidence</span>
                  <span className="font-semibold">{(prediction.confidence * 100).toFixed(1)}%</span>
                </div>
                <Progress value={prediction.confidence * 100} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-muted p-2"><div className="text-muted-foreground">Channels</div><div className="font-semibold">{prediction.channels}</div></div>
                <div className="rounded-lg bg-muted p-2"><div className="text-muted-foreground">Duration</div><div className="font-semibold">{prediction.durationSec}s</div></div>
              </div>
              <Button className="mt-4" variant="outline" size="sm" onClick={() => generateReportPdf(prediction, user?.name || "Patient")}>
                <Download className="h-4 w-4 mr-2" />Download PDF
              </Button>
            </motion.div>
          ) : (
            <div className="mt-3 flex-1 grid place-items-center text-center text-muted-foreground text-sm">
              <div>
                <Activity className="h-8 w-8 mx-auto opacity-40" />
                <div className="mt-2">Upload an EEG to see prediction</div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Waveform */}
      {prediction && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold">EEG Waveform</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Aggregate across {prediction.channels} channels</p>
            </div>
            <Badge variant={prediction.label === "Seizure" ? "destructive" : "secondary"}>{prediction.label}</Badge>
          </div>
          <EegWave data={prediction.waveform} color={prediction.label === "Seizure" ? "oklch(0.60 0.24 25)" : "oklch(0.55 0.20 250)"} />
        </Card>
      )}

      {/* Previous reports */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold">Previous reports</h2>
          <Button variant="ghost" size="sm" asChild><Link to="/patient/reports">View all <ChevronRight className="h-4 w-4 ml-1" /></Link></Button>
        </div>
        <div className="divide-y divide-border">
          {(previous.data || []).slice(0, 4).map((p) => (
            <div key={p.id} className="py-3 flex items-center gap-4">
              <div className={`h-9 w-9 rounded-lg grid place-items-center ${p.label === "Seizure" ? "bg-destructive/10 text-destructive" : p.label === "Pre-ictal" ? "bg-warning/15 text-warning" : "bg-success/10 text-success"}`}>
                <Activity className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{p.label}</div>
                <div className="text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleString()}</div>
              </div>
              <div className="text-xs text-muted-foreground hidden sm:block">Confidence <span className="font-semibold text-foreground">{(p.confidence*100).toFixed(0)}%</span></div>
              <Button size="sm" variant="ghost" onClick={() => generateReportPdf(p, user?.name || "Patient")}><Download className="h-4 w-4" /></Button>
            </div>
          ))}
          {previous.isLoading && <div className="py-8 text-center text-sm text-muted-foreground">Loading…</div>}
        </div>
      </Card>
    </div>
  );
}