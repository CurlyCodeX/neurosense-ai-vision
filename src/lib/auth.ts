import { useEffect, useState } from "react";

export type Role = "doctor" | "patient";
export interface AuthUser { id: string; name: string; role: Role; email?: string }

const KEY = "neurosense.auth";

export function getAuth(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try { const v = localStorage.getItem(KEY); return v ? (JSON.parse(v) as AuthUser) : null; } catch { return null; }
}
export function setAuth(u: AuthUser | null) {
  if (typeof window === "undefined") return;
  if (u) localStorage.setItem(KEY, JSON.stringify(u));
  else localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("neurosense-auth"));
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  useEffect(() => {
    setUser(getAuth());
    const h = () => setUser(getAuth());
    window.addEventListener("neurosense-auth", h);
    return () => window.removeEventListener("neurosense-auth", h);
  }, []);
  return { user, setUser: (u: AuthUser | null) => { setAuth(u); setUser(u); } };
}

const THEME_KEY = "neurosense.theme";
export function initTheme() {
  if (typeof window === "undefined") return;
  const t = localStorage.getItem(THEME_KEY);
  if (t === "dark") document.documentElement.classList.add("dark");
}
export function toggleDark(on: boolean) {
  document.documentElement.classList.toggle("dark", on);
  localStorage.setItem(THEME_KEY, on ? "dark" : "light");
}
export function isDark() {
  if (typeof window === "undefined") return false;
  return document.documentElement.classList.contains("dark");
}