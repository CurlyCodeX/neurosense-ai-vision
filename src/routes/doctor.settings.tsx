import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useAuth, toggleDark, isDark } from "@/lib/auth";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/doctor/settings")({
  head: () => ({ meta: [{ title: "Settings — NeuroSense" }] }),
  component: DoctorSettings,
});

function DoctorSettings() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [dark, setDark] = useState(false);
  const [alerts, setAlerts] = useState(true);
  useEffect(() => { setDark(isDark()); setName(user?.name ?? ""); setEmail(user?.email ?? ""); }, [user]);

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Clinician profile and preferences.</p>
      </div>
      <Card className="p-6 space-y-5">
        <h2 className="text-base font-semibold">Profile</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Name</Label><Input value={name} onChange={(e)=>setName(e.target.value)} /></div>
          <div className="space-y-2"><Label>Email</Label><Input value={email} onChange={(e)=>setEmail(e.target.value)} /></div>
        </div>
        <Button onClick={() => { if (user) setUser({ ...user, name, email }); toast.success("Saved"); }}>Save changes</Button>
      </Card>
      <Card className="p-6 space-y-5">
        <h2 className="text-base font-semibold">Security</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Current password</Label><Input type="password" /></div>
          <div className="space-y-2"><Label>New password</Label><Input type="password" /></div>
        </div>
        <Button variant="outline" onClick={() => toast.success("Password updated")}>Update password</Button>
      </Card>
      <Card className="p-6 space-y-4">
        <h2 className="text-base font-semibold">Preferences</h2>
        <div className="flex items-center justify-between">
          <div><div className="text-sm font-medium">Dark mode</div><div className="text-xs text-muted-foreground">Better for night shifts.</div></div>
          <Switch checked={dark} onCheckedChange={(v) => { toggleDark(v); setDark(v); }} />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div><div className="text-sm font-medium">Critical alerts</div><div className="text-xs text-muted-foreground">Notify me on high-confidence seizure detections.</div></div>
          <Switch checked={alerts} onCheckedChange={setAlerts} />
        </div>
      </Card>
    </div>
  );
}