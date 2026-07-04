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

export const Route = createFileRoute("/patient/settings")({
  head: () => ({ meta: [{ title: "Settings — NeuroSense" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [dark, setDark] = useState(false);
  const [notif, setNotif] = useState(true);
  useEffect(() => { setDark(isDark()); setName(user?.name ?? ""); setEmail(user?.email ?? ""); }, [user]);

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your profile and preferences.</p>
      </div>

      <Card className="p-6 space-y-5">
        <h2 className="text-base font-semibold">Profile</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Full name</Label><Input value={name} onChange={(e)=>setName(e.target.value)} /></div>
          <div className="space-y-2"><Label>Email</Label><Input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} /></div>
        </div>
        <Button onClick={() => { if (user) setUser({ ...user, name, email }); toast.success("Profile updated"); }}>Save changes</Button>
      </Card>

      <Card className="p-6 space-y-5">
        <h2 className="text-base font-semibold">Change password</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Current password</Label><Input type="password" /></div>
          <div className="space-y-2"><Label>New password</Label><Input type="password" /></div>
        </div>
        <Button variant="outline" onClick={() => toast.success("Password updated")}>Update password</Button>
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="text-base font-semibold">Preferences</h2>
        <div className="flex items-center justify-between">
          <div><div className="text-sm font-medium">Dark mode</div><div className="text-xs text-muted-foreground">Reduces glare during night shifts.</div></div>
          <Switch checked={dark} onCheckedChange={(v) => { toggleDark(v); setDark(v); }} />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div><div className="text-sm font-medium">Notifications</div><div className="text-xs text-muted-foreground">Email me when a new prediction is ready.</div></div>
          <Switch checked={notif} onCheckedChange={setNotif} />
        </div>
      </Card>
    </div>
  );
}