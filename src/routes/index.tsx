import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { SiteNav } from "@/components/site-nav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brand } from "@/components/brand";
import {
  Brain, Activity, Shield, Zap, FileCheck2, MessageSquare,
  Stethoscope, ChevronRight, CheckCircle2, Mail, MapPin, Phone,
} from "lucide-react";
import heroImg from "@/assets/hero-brain.jpg";

export const Route = createFileRoute("/")({ component: Landing });

const features = [
  { icon: Brain, title: "Deep Learning EEG Analysis", desc: "Multi-channel CNN-LSTM model trained on 40k+ annotated EEG recordings for seizure and pre-ictal detection." },
  { icon: Zap, title: "Sub-second Predictions", desc: "Real-time inference on 30-second EEG windows with GPU-accelerated FastAPI backend." },
  { icon: Shield, title: "Hospital-grade Privacy", desc: "HIPAA-aligned pipeline, encrypted storage, and full audit trails on every prediction." },
  { icon: FileCheck2, title: "Explainable Reports", desc: "Downloadable PDF reports with confidence scores, waveform excerpts, and clinician remarks." },
  { icon: MessageSquare, title: "AI Clinical Assistant", desc: "Conversational assistant that explains results in plain language for patients and staff." },
  { icon: Stethoscope, title: "Clinician Workflow", desc: "Doctor dashboard with patient search, prediction review, analytics, and remark tools." },
];

const team = [
  { name: "Dr. Anya Rao", role: "Chief Neurologist", initials: "AR" },
  { name: "Kenji Watanabe", role: "ML Research Lead", initials: "KW" },
  { name: "Priya Menon", role: "Head of Product", initials: "PM" },
  { name: "Dr. Marcus Bauer", role: "Clinical Advisor", initials: "MB" },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[image:var(--gradient-hero)]" />
        <div className="absolute inset-0 opacity-40 pointer-events-none"
          style={{ backgroundImage: `radial-gradient(circle at 20% 20%, oklch(0.72 0.16 240 / 0.25), transparent 40%), radial-gradient(circle at 80% 60%, oklch(0.55 0.20 250 / 0.18), transparent 45%)` }} />
        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:py-32 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              FDA-track clinical AI · Live model v3.2
            </div>
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.05]">
              Epilepsy detection,<br />
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                second-perfect precision.
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
              NeuroSense analyses EEG signals in real time, flags seizure activity with clinical-grade confidence, and delivers explainable reports to your care team.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild><Link to="/register">Start free trial <ChevronRight className="ml-1 h-4 w-4" /></Link></Button>
              <Button size="lg" variant="outline" asChild><Link to="/login">Sign in to dashboard</Link></Button>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
              {[
                { k: "97.4%", v: "Sensitivity" },
                { k: "40k+", v: "EEGs trained" },
                { k: "<800ms", v: "Inference" },
              ].map((s) => (
                <div key={s.v}>
                  <div className="text-2xl font-bold text-foreground">{s.k}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">{s.v}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="relative">
            <div className="absolute -inset-4 bg-[image:var(--gradient-primary)] blur-3xl opacity-20 rounded-3xl" />
            <div className="relative rounded-3xl overflow-hidden border border-border shadow-[var(--shadow-elegant)] bg-card">
              <img src={heroImg} alt="NeuroSense EEG analysis visualization" className="w-full h-auto" loading="eager" />
              <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-background/95 backdrop-blur p-4 border border-border">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-success/15 grid place-items-center">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-foreground">Prediction: Normal</div>
                    <div className="text-xs text-muted-foreground">Confidence 94.2% · reviewed by Dr. Rao</div>
                  </div>
                  <Activity className="h-5 w-5 text-primary animate-pulse" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 border-t border-border">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Platform</div>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Everything a modern neurology unit needs.</h2>
            <p className="mt-4 text-muted-foreground">From ingestion to report delivery, NeuroSense fits into your clinical workflow.</p>
          </div>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <Card className="p-6 h-full border-border hover:border-primary/30 hover:shadow-[var(--shadow-card)] transition-all group">
                  <div className="h-11 w-11 rounded-xl bg-primary/10 grid place-items-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-base font-semibold text-foreground">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24 bg-muted/40 border-y border-border">
        <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-12">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">About us</div>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Built by clinicians and ML researchers.</h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              NeuroSense was founded to close the gap between long EEG recordings and timely clinical decisions. Our model was validated across three teaching hospitals on prospective data, and we work directly with epileptologists to keep the platform grounded in real practice.
            </p>
            <ul className="mt-6 space-y-3">
              {["Peer-reviewed CNN-LSTM architecture", "Continuously updated with clinician feedback", "Deployed on-prem or in secure cloud"].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-success mt-0.5 shrink-0" />
                  <span className="text-sm text-foreground">{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[["12+", "Partner hospitals"], ["1.2M", "EEG segments analysed"], ["3", "Peer-reviewed papers"], ["24/7", "Clinical support"]].map(([k, v]) => (
              <Card key={v} className="p-6">
                <div className="text-3xl font-bold text-primary">{k}</div>
                <div className="mt-1 text-sm text-muted-foreground">{v}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Team</div>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Clinical leadership.</h2>
          </div>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {team.map((m) => (
              <Card key={m.name} className="p-6 text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-[image:var(--gradient-primary)] grid place-items-center text-primary-foreground text-lg font-semibold">
                  {m.initials}
                </div>
                <div className="mt-4 text-sm font-semibold text-foreground">{m.name}</div>
                <div className="text-xs text-muted-foreground">{m.role}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 bg-muted/40 border-t border-border">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Contact</div>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Get in touch with our team.</h2>
            <p className="mt-4 text-muted-foreground">For clinical partnerships, deployment questions, or demos.</p>
          </div>
          <div className="mt-12 grid sm:grid-cols-3 gap-4">
            {[
              { icon: Mail, label: "Email", value: "clinical@neurosense.ai" },
              { icon: Phone, label: "Phone", value: "+1 (415) 555-0110" },
              { icon: MapPin, label: "HQ", value: "San Francisco, CA" },
            ].map((c) => (
              <Card key={c.label} className="p-6 text-center">
                <c.icon className="mx-auto h-5 w-5 text-primary" />
                <div className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">{c.label}</div>
                <div className="mt-1 text-sm font-medium text-foreground">{c.value}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-10">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Brand />
          <div className="text-xs text-muted-foreground">© 2026 NeuroSense AI · For research and clinical decision support.</div>
        </div>
      </footer>
    </div>
  );
}
