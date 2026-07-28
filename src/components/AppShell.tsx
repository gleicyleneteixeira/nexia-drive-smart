import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { RequireAuth } from "./RequireAuth";
import { RatingPrompt, triggerRatingPrompt } from "./RatingPrompt";
import { Flame, Home, Sparkles, Zap, Trophy, TrafficCone, Brain, Library, LogIn, LogOut, UserCircle, Shield, Star, Car } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { isProfileExpired } from "@/lib/subscription";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NAV_TEORICO = [
  { to: "/app", label: "Início", icon: Home },
] as const;

const NAV_PSICOTECNICO = [
  { to: "/app", label: "Início", icon: Home },
] as const;

export function AppShell() {
  const { pathname } = useLocation();
  const { user, profile, isAdmin, signOut } = useAuth();

  const isPublicPage = pathname === "/" || pathname === "/cadastro" || pathname === "/auth" || pathname === "/reset-password";
  const isActive = (profile?.status === "ativo" && !isProfileExpired(profile)) || isAdmin;
  const isPending = (profile?.status === "pendente_pagamento" || isProfileExpired(profile)) && !isAdmin;
  const activeAuth = pathname === "/cadastro" || pathname === "/auth" || pathname === "/admin";

  const [activeModule, setActiveModule] = useState<"hub" | "teorico" | "psicotecnico" | "direcao">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("nexia:active_module") as "teorico" | "psicotecnico" | "direcao") || "hub";
    }
    return "hub";
  });

  useEffect(() => {
    const handler = () => {
      const stored = localStorage.getItem("nexia:active_module") as "teorico" | "psicotecnico" | "direcao" | null;
      if (stored && stored !== activeModule) {
        setActiveModule(stored);
      } else if (!stored && activeModule !== "hub") {
        setActiveModule("hub");
      }
    };
    window.addEventListener("nexia:active_module:change", handler);
    return () => window.removeEventListener("nexia:active_module:change", handler);
  }, [activeModule]);

  const handleToggleModule = (mod: "teorico" | "psicotecnico" | "direcao") => {
    setActiveModule(mod);
    localStorage.setItem("nexia:active_module", mod);
    window.dispatchEvent(new Event("nexia:active_module:change"));
    if (typeof window !== "undefined" && window.location.pathname !== "/app") {
      window.location.href = "/app";
    }
  };

  const isHub = activeModule === "hub";
  const navItems = activeModule === "teorico" ? NAV_TEORICO : NAV_PSICOTECNICO;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 glass border-b border-border/40">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between gap-3">
          <Link to={isActive ? "/app" : "/"} className="shrink-0 flex items-center gap-2">
            <Logo />
          </Link>

          {/* Hub header: tagline */}
          {isActive && isHub && (
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
              <span>Prepare-se para sua aprovação em até</span>
              <span className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/30 text-primary font-bold">7 dias</span>
            </div>
          )}

          {/* Module header: switcher + nav items */}
          {isActive && !isHub && (
            <div className="hidden sm:flex items-center gap-4 min-w-0 flex-1 justify-center">
              {/* Module Switcher */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-background/50 border border-border/20 shrink-0">
                <button
                  onClick={() => handleToggleModule("psicotecnico")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeModule === "psicotecnico"
                      ? "bg-primary text-primary-foreground shadow-glow"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>🧠</span> Psicotécnico
                </button>
                <button
                  onClick={() => handleToggleModule("teorico")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeModule === "teorico"
                      ? "bg-primary text-primary-foreground shadow-glow"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>📘</span> Teórico
                </button>
                <button
                  onClick={() => handleToggleModule("direcao")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeModule === "direcao"
                      ? "bg-primary text-primary-foreground shadow-glow"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Car className="h-3.5 w-3.5" /> Prático
                </button>
              </div>

              {/* Separator line */}
              {!isHub && <div className="hidden lg:block h-5 w-px bg-border/40 shrink-0" />}

              {/* Navigation Items */}
              {!isHub && (
              <div className="hidden lg:flex items-center gap-0.5">
                {navItems.map((item) => {
                  const active = pathname === item.to;
                  const Icon = item.icon;
                  const isInicio = item.to === "/app";
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      search={(item.to as string) === "/biblioteca" ? { module_type: activeModule } : undefined}
                      onClick={isInicio ? () => {
                        localStorage.removeItem("nexia:active_module");
                        window.dispatchEvent(new Event("nexia:active_module:change"));
                      } : undefined}
                      className={`relative px-2 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                        active
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {item.label}
                      {active && (
                        <motion.div
                          layoutId="nav-pill"
                          className="absolute inset-0 -z-10 rounded-lg bg-primary/15 border border-primary/30"
                          transition={{ type: "spring", stiffness: 300, damping: 28 }}
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-3 shrink-0">
            {/* Small screen inline module toggle — only inside a module */}
            {isActive && !isHub && (
              <div className="sm:hidden flex items-center bg-background/50 border border-border/20 rounded-lg p-0.5">
                <button
                  onClick={() => {
                    if (activeModule === "psicotecnico") handleToggleModule("teorico");
                    else if (activeModule === "teorico") handleToggleModule("direcao");
                    else handleToggleModule("psicotecnico");
                  }}
                  className="px-2 py-1 text-xs font-bold text-primary flex items-center gap-1 cursor-pointer"
                >
                  {activeModule === "teorico" && "📘 Teórico"}
                  {activeModule === "psicotecnico" && "🧠 Psico"}
                  {activeModule === "direcao" && <><Car className="h-3 w-3" /> Prático</>}
                </button>
              </div>
            )}

            {isActive && !isHub && (
              <div 
                title="Dias seguidos de estudo (Ofensiva)"
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full glass whitespace-nowrap"
              >
                <Flame className="h-4 w-4 text-warning" />
                <span className="text-sm font-semibold">7</span>
                <span className="text-xs text-muted-foreground">dias seguidos</span>
              </div>
            )}

            {/* Auth menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className={`relative px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors text-muted-foreground hover:text-foreground cursor-pointer`}>
                    <UserCircle className="h-4 w-4" />
                    <span className="max-w-[120px] truncate">{user.email}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {isActive && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="flex items-center gap-2 cursor-pointer">
                          <Shield className="h-4 w-4" />
                          Admin
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => triggerRatingPrompt("manual")}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Star className="h-4 w-4" />
                        Avaliar o app
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={signOut} className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>
        </div>
      </header>

      {/* Expiration warning banner */}
      {profile && !profile.is_migrated && profile.expires_at && (() => {
        const diffTime = new Date(profile.expires_at).getTime() - new Date().getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > 0 && diffDays <= 5) {
          return (
            <div className="bg-amber-500/15 border-b border-amber-500/30 text-amber-400 text-xs py-2.5 px-4 text-center font-medium flex items-center justify-center gap-1.5">
              <span>⚠️</span>
              <span>Atenção: Seu período de teste/acesso expira em <strong>{diffDays} {diffDays === 1 ? "dia" : "dias"}</strong>!</span>
              <Link to="/checkout" className="underline font-bold text-foreground hover:text-primary-glow ml-2">Renove seu plano agora</Link>
            </div>
          );
        }
        return null;
      })()}

      <RatingPrompt />

      <main className="flex-1">
        {isPublicPage ? (
          <Outlet />
        ) : (
          <RequireAuth>
            <Outlet />
          </RequireAuth>
        )}
      </main>

      {/* Mobile nav - only visible inside a module */}
      {isActive && !isHub && (
        <nav className="lg:hidden sticky bottom-0 z-40 glass border-t border-border/40">
          <div className={`grid grid-cols-${navItems.length}`}>
            {navItems.map((item) => {
              const active = pathname === item.to;
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  search={(item.to as string) === "/biblioteca" ? { module_type: activeModule } : undefined}
                  className={`flex flex-col items-center gap-1 py-2.5 text-[10px] ${
                    active ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}

