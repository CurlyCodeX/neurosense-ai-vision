import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Brand } from "./brand";
import { useAuth, toggleDark, isDark } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Bell, LogOut, Moon, Sun, LayoutDashboard, Upload, FileText,
  History as HistoryIcon, Settings as SettingsIcon, Users, BarChart3, Stethoscope,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Chatbot } from "./chatbot";

const patientNav = [
  { to: "/patient", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/patient/upload", label: "Upload EEG", icon: Upload },
  { to: "/patient/reports", label: "Reports", icon: FileText },
  { to: "/patient/history", label: "History", icon: HistoryIcon },
  { to: "/patient/settings", label: "Settings", icon: SettingsIcon },
];
const doctorNav = [
  { to: "/doctor", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/doctor/patients", label: "Patients", icon: Users },
  { to: "/doctor/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/doctor/settings", label: "Settings", icon: SettingsIcon },
];

export function DashboardShell({ role, children }: { role: "patient" | "doctor"; children: ReactNode }) {
  const { user, setUser } = useAuth();
  const nav = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const items = role === "patient" ? patientNav : doctorNav;
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(isDark()), []);

  const active = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  return (
    <div className="min-h-screen flex w-full bg-muted/40">
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
        <div className="h-16 flex items-center px-6 border-b border-sidebar-border"><Brand /></div>
        <nav className="flex-1 p-4 space-y-1">
          {items.map((item) => {
            const isActive = active(item.to, item.exact);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-[var(--shadow-elegant)]"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <div className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 p-4 border border-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <Stethoscope className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-foreground">24/7 AI Support</span>
            </div>
            <p className="text-xs text-muted-foreground">Ask NeuroSense anything about your EEG results.</p>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur-lg sticky top-0 z-30 flex items-center gap-4 px-6">
          <div className="lg:hidden"><Brand compact /></div>
          <div className="flex-1" />
          <Button variant="ghost" size="icon" onClick={() => { const n = !dark; toggleDark(n); setDark(n); }}>
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-muted transition">
                <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary text-primary-foreground text-xs">{(user?.name || "U").split(" ").map(s=>s[0]).slice(0,2).join("")}</AvatarFallback></Avatar>
                <div className="hidden sm:flex flex-col items-start leading-tight">
                  <span className="text-xs font-medium text-foreground">{user?.name || "User"}</span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{role}</span>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild><Link to={`/${role}/settings`}>Settings</Link></DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setUser(null); nav({ to: "/" }); }}>
                <LogOut className="h-4 w-4 mr-2" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
      <Chatbot />
    </div>
  );
}