import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Brand } from "@/components/brand";
import { api } from "@/lib/api";
import { setAuth } from "@/lib/auth";
import { toast } from "sonner";
import { Stethoscope, User } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — NeuroSense AI" }, { name: "description", content: "Sign in to NeuroSense AI." }] }),
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const [role, setRole] = useState<"patient" | "doctor">("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return toast.error("Enter your credentials");
    setBusy(true);
    try {
      const { user } = await api.login(email, password, role);
      setAuth({ id: user.id, name: user.name, role: user.role, email });
      toast.success(`Welcome back, ${user.name.split(" ")[0]}`);
      nav({ to: role === "doctor" ? "/doctor" : "/patient" });
    } catch { toast.error("Login failed"); }
    finally { setBusy(false); }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-[image:var(--gradient-primary)] text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 30% 30%, white, transparent 40%)" }} />
        <div className="relative"><Brand /></div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative">
          <div className="text-3xl font-semibold leading-tight max-w-md">"NeuroSense cut our EEG review time by 70% while catching seizures our residents missed."</div>
          <div className="mt-4 text-sm opacity-80">— Dr. Anya Rao, Chief of Neurology</div>
        </motion.div>
        <div className="relative text-xs opacity-70">© 2026 NeuroSense AI · HIPAA-ready</div>
      </div>
      <div className="flex items-center justify-center p-6 sm:p-12">
        <Card className="w-full max-w-md p-8 shadow-[var(--shadow-card)]">
          <div className="lg:hidden mb-6"><Brand /></div>
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to your NeuroSense dashboard.</p>
          <Tabs value={role} onValueChange={(v) => setRole(v as "patient" | "doctor")} className="mt-6">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="patient"><User className="h-4 w-4 mr-2" />Patient</TabsTrigger>
              <TabsTrigger value="doctor"><Stethoscope className="h-4 w-4 mr-2" />Doctor</TabsTrigger>
            </TabsList>
            <TabsContent value={role}>
              <form onSubmit={submit} className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={role === "doctor" ? "doctor@hospital.org" : "patient@email.com"} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pw">Password</Label>
                  <Input id="pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
                </div>
                <Button type="submit" className="w-full" disabled={busy}>{busy ? "Signing in…" : `Sign in as ${role}`}</Button>
                <div className="text-center text-sm text-muted-foreground">New here? <Link to="/register" className="text-primary font-medium">Create account</Link></div>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}