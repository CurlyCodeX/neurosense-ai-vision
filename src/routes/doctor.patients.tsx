import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api, type Patient, type Prediction } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EegWave } from "@/components/eeg-wave";
import { generateReportPdf } from "@/lib/pdf";
import { Search, Download, FileText } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/doctor/patients")({
  head: () => ({ meta: [{ title: "Patients — NeuroSense" }] }),
  component: PatientsPage,
});

function PatientsPage() {
  const [q, setQ] = useState("");
  const { data = [] } = useQuery({ queryKey: ["patients"], queryFn: api.listPatients });
  const filtered = data.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()) || p.id.includes(q));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Patients</h1>
          <p className="text-sm text-muted-foreground mt-1">Search, review predictions, add clinical remarks.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name or ID" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Risk</TableHead>
              <TableHead>Predictions</TableHead>
              <TableHead>Last visit</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground font-mono">{p.id}</div>
                </TableCell>
                <TableCell>{p.age} · {p.gender}</TableCell>
                <TableCell>
                  <Badge variant={p.riskLevel === "High" ? "destructive" : p.riskLevel === "Moderate" ? "secondary" : "outline"}>{p.riskLevel}</Badge>
                </TableCell>
                <TableCell>{p.predictionsCount}</TableCell>
                <TableCell className="text-muted-foreground">{new Date(p.lastVisit).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <ReviewDialog patient={p} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function ReviewDialog({ patient }: { patient: Patient }) {
  const [open, setOpen] = useState(false);
  const { data = [] } = useQuery({ queryKey: ["pred", patient.id], queryFn: () => api.listPredictions(patient.id), enabled: open });
  const [remark, setRemark] = useState("");
  const [selected, setSelected] = useState<Prediction | null>(null);

  async function save(id: string) {
    if (!remark.trim()) return;
    await api.addRemark(id, remark);
    toast.success("Remark saved");
    setRemark("");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button variant="outline" size="sm">Review</Button></DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader><DialogTitle>{patient.name} · {patient.id}</DialogTitle></DialogHeader>
        <div className="grid sm:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Predictions</div>
            {data.map(p => (
              <button key={p.id} onClick={() => setSelected(p)} className={`w-full text-left rounded-lg border p-3 transition ${selected?.id === p.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm">{p.label}</div>
                  <Badge variant="secondary" className="text-[10px]">{(p.confidence*100).toFixed(0)}%</Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-1">{new Date(p.createdAt).toLocaleString()}</div>
              </button>
            ))}
            {data.length === 0 && <div className="text-sm text-muted-foreground">No predictions yet.</div>}
          </div>
          <div className="space-y-3">
            {selected ? (
              <>
                <EegWave data={selected.waveform} height={140} color={selected.label === "Seizure" ? "oklch(0.60 0.24 25)" : "oklch(0.55 0.20 250)"} />
                <div className="text-xs text-muted-foreground">Existing: {selected.remarks || "no remarks yet."}</div>
                <Textarea placeholder="Add clinical remark…" value={remark} onChange={(e) => setRemark(e.target.value)} rows={3} />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => save(selected.id)}>Save remark</Button>
                  <Button size="sm" variant="outline" onClick={() => generateReportPdf(selected, patient.name)}><Download className="h-4 w-4 mr-1" />PDF</Button>
                </div>
              </>
            ) : (
              <div className="grid place-items-center h-full text-sm text-muted-foreground"><div className="text-center"><FileText className="h-8 w-8 mx-auto opacity-40" /><div className="mt-2">Select a prediction</div></div></div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}