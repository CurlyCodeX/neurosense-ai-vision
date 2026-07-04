import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Brand } from "@/components/brand";
import { api } from "@/lib/api";
import { setAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account — NeuroSense AI" }, { name: "description", content: "Create your NeuroSense account." }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const nav = useNavigate();
  const [role, setRole] = useState<"patient" | "doctor">("patient");
  const [name, setName] = useState(""); const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || password.length < 6) return toast.error("Fill all fields (password ≥ 6 chars)");
    setBusy(true);
    try {
      await api.register({ name, email, password, role });
      setAuth({ id: `${role[0]}-new`, name, role, email });
      toast.success("Account created");
      nav({ to: role === "doctor" ? "/doctor" : "/patient" });
    } catch { toast.error("Registration failed"); }
    finally { setBusy(false); }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-muted/40 border-r border-border">
        <Brand />
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Join hundreds of neurology teams.</h2>
          <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
            <li>· Instant EEG uploads and predictions</li>
            <li>· Downloadable clinical reports</li>
            <li>· Explainable AI, in plain language</li>
            <li>· HIPAA-aligned infrastructure</li>
          </ul>
        </div>
        <div className="text-xs text-muted-foreground">Already a user? <Link to="/login" className="text-primary">Sign in</Link></div>
      </div>
      <div className="flex items-center justify-center p-6 sm:p-12">
        <Card className="w-full max-w-md p-8">
          <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Free during clinical pilot.</p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="space-y-2"><Label>I am a</Label>
              <RadioGroup value={role} onValueChange={(v) => setRole(v as "patient" | "doctor")} className="grid grid-cols-2 gap-2">
                {(["patient", "doctor"] as const).map((r) => (
                  <label key={r} className={`flex items-center gap-2 border rounded-lg px-3 py-2.5 cursor-pointer transition ${role === r ? "border-primary bg-primary/5" : "border-border"}`}>
                    <RadioGroupItem value={r} /> <span className="text-sm capitalize">{r}</span>
                  </label>
                ))}
              </RadioGroup>
            </div>
            <div className="space-y-2"><Label htmlFor="n">Full name</Label>
              <Input id="n" value={name} onChange={(e)=>setName(e.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="e">Email</Label>
              <Input id="e" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="p">Password</Label>
              <Input id="p" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} /></div>
            <Button type="submit" className="w-full" disabled={busy}>{busy ? "Creating…" : "Create account"}</Button>
            <div className="text-center text-sm text-muted-foreground">Already have an account? <Link to="/login" className="text-primary font-medium">Sign in</Link></div>
          </form>
        </Card>
      </div>
    </div>
  );
}