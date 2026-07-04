import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { DashboardShell } from "@/components/dashboard-shell";
import { getAuth } from "@/lib/auth";

export const Route = createFileRoute("/patient")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const u = getAuth();
      if (!u) throw redirect({ to: "/login" });
    }
  },
  component: PatientLayout,
});

function PatientLayout() {
  return <DashboardShell role="patient"><Outlet /></DashboardShell>;
}