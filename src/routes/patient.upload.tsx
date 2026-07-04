import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { api, type Prediction } from "@/lib/api";
import { EegWave } from "@/components/eeg-wave";
import { generateReportPdf } from "@/lib/pdf";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { Upload, Loader2, Download, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/patient/upload")({
  head: () => ({ meta: [{ title: "Upload EEG — NeuroSense" }] }),
  component: UploadPage,
});

function UploadPage() {
  const { user } = useAuth();
  const [pred, setPred] = useState<Prediction | null>(null);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  async function handle(f: File) {
    setFileName(f.name); setUploading(true); setPred(null);
    try { setPred(await api.uploadEeg(f)); toast.success("Analysis complete"); }
    catch { toast.error("Analysis failed"); }
    finally { setUploading(false); }
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Upload EEG</h1>
        <p className="text-sm text-muted-foreground mt-1">Analyse a new EEG recording using our clinical-grade AI model.</p>
      </div>

      <Card className="p-6">
        <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl h-64 cursor-pointer transition ${uploading ? "border-primary/40 bg-primary/5" : "border-border hover:border-primary/40"}`}>
          {uploading ? (
            <>
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <div className="mt-3 text-sm font-medium">Analysing {fileName}…</div>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-primary" />
              <div className="mt-3 text-sm font-medium">Click to select EEG file</div>
              <div className="text-xs text-muted-foreground mt-1">.edf · .csv · .npy · up to 100MB</div>
            </>
          )}
          <input type="file" className="hidden" accept=".edf,.csv,.npy,.txt" onChange={(e) => e.target.files?.[0] && handle(e.target.files[0])} disabled={uploading} />
        </label>
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-success" /> Encrypted transport · Files never leave your region.
        </div>
      </Card>

      {pred && (
        <Card className="p-6 space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Result</div>
              <div className={`text-3xl font-bold mt-1 ${pred.label === "Seizure" ? "text-destructive" : pred.label === "Pre-ictal" ? "text-warning" : "text-success"}`}>{pred.label}</div>
            </div>
            <Badge variant="secondary" className="font-mono">{pred.id}</Badge>
          </div>
          <div>
            <div className="flex items-center justify-between text-xs mb-1"><span className="text-muted-foreground">Model confidence</span><span className="font-semibold">{(pred.confidence*100).toFixed(1)}%</span></div>
            <Progress value={pred.confidence*100} />
          </div>
          <EegWave data={pred.waveform} color={pred.label === "Seizure" ? "oklch(0.60 0.24 25)" : "oklch(0.55 0.20 250)"} />
          <Button onClick={() => generateReportPdf(pred, user?.name || "Patient")}><Download className="h-4 w-4 mr-2" />Download PDF report</Button>
        </Card>
      )}
    </div>
  );
}