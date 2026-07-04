import { Link } from "@tanstack/react-router";
import { Brand } from "./brand";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { to: "/#features", label: "Features" },
  { to: "/#about", label: "About" },
  { to: "/#team", label: "Team" },
  { to: "/#contact", label: "Contact" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <Brand />
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          {links.map((l) => (
            <a key={l.to} href={l.to} className="hover:text-foreground transition">{l.label}</a>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" asChild><Link to="/login">Sign in</Link></Button>
          <Button asChild><Link to="/register">Get started</Link></Button>
        </div>
        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border/60 bg-background px-6 py-4 flex flex-col gap-3">
          {links.map((l) => (
            <a key={l.to} href={l.to} onClick={() => setOpen(false)} className="text-sm text-muted-foreground">{l.label}</a>
          ))}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" asChild className="flex-1"><Link to="/login">Sign in</Link></Button>
            <Button asChild className="flex-1"><Link to="/register">Get started</Link></Button>
          </div>
        </div>
      )}
    </header>
  );
}