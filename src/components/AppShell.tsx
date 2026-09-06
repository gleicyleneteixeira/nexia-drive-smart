import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { RequireAuth } from "./RequireAuth";
import { RatingPrompt, triggerRatingPrompt } from "./RatingPrompt";
import { 
  Flame, Home, Sparkles, Zap, Trophy, TrafficCone, Brain, Library, 
  LogIn, LogOut, UserCircle, Shield, Star, Car, Calendar,
  BookOpen, GraduationCap, Target, Settings, ChevronLeft, ChevronRight,
  Palette, Upload, Video, BarChart3, Users, ShoppingBag, MessageCircle
} from "lucide-react";
import { CronogramaModal } from "./CronogramaModal";
import { DailyCheckinBanner } from "./DailyCheckinBanner";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { themes } from "@/lib/themes";
import { supabase } from "@/integrations/supabase/client";
import { isProfileExpired } from "@/lib/subscription";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NavItem = { 
  to: string; 
  label: string; 
  icon: any; 
  module?: "teorico" | "psicotecnico" | "direcao";
  adminSection?: string;
};

const NAV_ITEMS: NavItem[] = [
  { to: "/app", label: "Inicio", icon: Home },
  { to: "/app", label: "Psicotecnico", icon: Brain, module: "psicotecnico" },
  { to: "/app", label: "Teorico", icon: BookOpen, module: "teorico" },
  { to: "/app", label: "Pratico", icon: Car, module: "direcao" },
  { to: "/biblioteca", label: "Biblioteca", icon: Library },
  { to: "/simulado", label: "Simulado", icon: Target },
  { to: "/conquistas", label: "Conquistas", icon: Trophy },
];

const ADMIN_ITEMS: NavItem[] = [
  { to: "/admin", label: "Vendas", icon: ShoppingBag, adminSection: "sales" },
  { to: "/admin", label: "Usuarios", icon: Users, adminSection: "users" },
  { to: "/admin", label: "Biblioteca Admin", icon: Upload, adminSection: "library" },
  { to: "/admin", label: "Videos", icon: Video, adminSection: "videos" },
  { to: "/admin", label: "Avaliacoes", icon: Star, adminSection: "ratings" },
  { to: "/admin", label: "Configuracoes", icon: Settings, adminSection: "settings" },
];

const SUPER_ADMIN_ITEMS: NavItem[] = [
  { to: "/admin", label: "DETRAN", icon: BarChart3, adminSection: "detran" },
  { to: "/admin", label: "Teste MIG (Preview Admin)", icon: Brain, adminSection: "mig" },
  { to: "/admin", label: "Simulado Divulgacao", icon: Video, adminSection: "espelho" },
];

const STORAGE_SIDEBAR_KEY = '@nexia_sidebar_collapsed';

export function AppShell() {
  const { pathname } = useLocation();
  const { user, profile, isAdmin, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isPublicPage = pathname === "/" || pathname === "/cadastro" || pathname === "/auth" || pathname === "/reset-password" || pathname === "/simulado-demo";
  const isActive = (profile?.status === "ativo" && !isProfileExpired(profile)) || isAdmin;
  const isPending = (profile?.status === "pendente_pagamento" || isProfileExpired(profile)) && !isAdmin;
  const activeAuth = pathname === "/cadastro" || pathname === "/auth";

  const [activeModule, setActiveModule] = useState<"hub" | "teorico" | "psicotecnico" | "direcao">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("nexia:active_module") as "teorico" | "psicotecnico" | "direcao") || "hub";
    }
    return "hub";
  });

  const [cronogramaOpen, setCronogramaOpen] = useState(false);
  const [supportLink, setSupportLink] = useState<string | null>(null);
  const [showSupportButton, setShowSupportButton] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_SIDEBAR_KEY);
      return stored === "true";
    }
    return false;
  });
  const [activeAdminSection, setActiveAdminSection] = useState<string | null>(null);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("nexia:admin_menu_open");
      return stored !== "false"; // Default to open
    }
    return true;
  });

  useEffect(() => {
    supabase
      .from("app_settings")
      .select("key, value")
      .then(({ data }) => {
        if (data) {
          const map = Object.fromEntries(data.map((r) => [r.key, r.value]));
          setSupportLink(map.whatsapp_support_link ?? "https://wa.link/6sc2qc");
          setShowSupportButton(map.show_whatsapp_button !== "false");
        }
      });
  }, []);

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

  const handleToggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem(STORAGE_SIDEBAR_KEY, String(newState));
  };

  const handleToggleAdminMenu = () => {
    const newState = !isAdminMenuOpen;
    setIsAdminMenuOpen(newState);
    localStorage.setItem("nexia:admin_menu_open", String(newState));
  };

  const isHub = activeModule === "hub";
  const navItems = activeModule === "teorico" ? NAV_ITEMS : NAV_ITEMS;

  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col">
      {/* Sidebar - Videoooo Style */}
      {!isPublicPage && isActive && (
        <aside 
          className={`fixed left-0 top-0 h-screen z-50 bg-card border-r border-border/50 flex flex-col py-4 gap-2 transition-all duration-300 ${
            sidebarCollapsed ? 'w-[72px] items-center' : 'w-[200px] px-3'
          }`}
        >
          {/* Logo */}
          <Link
            to={isActive ? "/app" : "/"}
            onClick={() => {
              if (isActive) {
                localStorage.removeItem("nexia:active_module");
                window.dispatchEvent(new Event("nexia:active_module:change"));
              }
            }}
            className={`rounded-xl gradient-primary flex items-center justify-center text-primary-foreground font-black shadow-glow mb-4 ${
              sidebarCollapsed ? 'w-12 h-12 text-lg' : 'w-12 h-12 text-lg'
            }`}
          >
            N
          </Link>

          {/* Navigation Items */}
          <nav className={`flex flex-col gap-1 flex-1 ${sidebarCollapsed ? 'items-center' : 'items-stretch'} overflow-y-auto`}>
            {/* App Navigation Items */}
            {navItems.map((item) => {
              const active = item.module 
                ? activeModule === item.module && !activeAdminSection
                : pathname === item.to && activeModule === "hub" && !activeAdminSection;
              const Icon = item.icon;
              
              const handleNavClick = () => {
                setActiveAdminSection(null);
                if (item.module) {
                  handleToggleModule(item.module);
                } else if (item.label === "Inicio") {
                  localStorage.removeItem("nexia:active_module");
                  window.dispatchEvent(new Event("nexia:active_module:change"));
                  window.location.href = "/app";
                }
              };
              
              if (item.label === "Inicio") {
                return (
                  <button
                    key={item.label}
                    onClick={handleNavClick}
                    className={`relative flex items-center gap-3 rounded-xl transition-all text-left ${
                      sidebarCollapsed ? 'w-12 h-12 justify-center' : 'h-12 px-3'
                    } ${
                      active
                        ? 'bg-primary/15 text-primary border border-primary/30'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    }`}
                    title={item.label}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {!sidebarCollapsed && (
                      <span className="text-sm font-medium truncate">{item.label}</span>
                    )}
                  </button>
                );
              }
              
              return (
                <button
                  key={item.label}
                  onClick={handleNavClick}
                  className={`relative flex items-center gap-3 rounded-xl transition-all text-left ${
                    sidebarCollapsed ? 'w-12 h-12 justify-center' : 'h-12 px-3'
                  } ${
                    active
                      ? 'bg-primary/15 text-primary border border-primary/30'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
                  title={item.label}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!sidebarCollapsed && (
                    <span className="text-sm font-medium truncate">{item.label}</span>
                  )}
                </button>
              );
            })}

            {/* Admin Navigation Items - Expandable accordion */}
            {isAdmin && !sidebarCollapsed && (
              <div className="mt-auto pt-4 border-t border-border/30">
                {/* Toggle button */}
                <button
                  onClick={handleToggleAdminMenu}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Admin
                  </span>
                  <ChevronRight 
                    className={`h-4 w-4 transition-transform duration-200 ${isAdminMenuOpen ? 'rotate-90' : ''}`} 
                  />
                </button>

                {/* Admin Items - Visible when expanded */}
                {isAdminMenuOpen && (
                  <div className="mt-1 space-y-1 pl-2 border-l border-border/30 ml-4">
                    {ADMIN_ITEMS.map((item) => {
                      const active = pathname === "/admin" && activeAdminSection === item.adminSection;
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.label}
                          onClick={() => {
                            setActiveAdminSection(item.adminSection ?? null);
                            window.location.href = `/admin?tab=${item.adminSection}`;
                          }}
                          className={`w-full flex items-center gap-3 rounded-xl transition-all text-left h-10 px-3 text-sm ${
                            active
                              ? 'bg-primary/15 text-primary border border-primary/30'
                              : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                          }`}
                          title={item.label}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    })}

                    {/* Super Admin Sub-section */}
                    <div className="pt-2 pb-1 px-3">
                      <p className="text-[10px] font-bold text-primary/70 uppercase tracking-wider">Super Admin</p>
                    </div>
                    
                    {SUPER_ADMIN_ITEMS.map((item) => {
                      const active = pathname === "/admin" && activeAdminSection === item.adminSection;
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.label}
                          onClick={() => {
                            setActiveAdminSection(item.adminSection ?? null);
                            window.location.href = `/admin?tab=${item.adminSection}`;
                          }}
                          className={`w-full flex items-center gap-3 rounded-xl transition-all text-left h-10 px-3 text-sm ${
                            active
                              ? 'bg-primary/15 text-primary border border-primary/30'
                              : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                          }`}
                          title={item.label}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Bottom Actions */}
          <div className="flex flex-col items-center gap-2 mt-auto">
            <button
              onClick={toggleTheme}
              className="w-12 h-12 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
              title={theme === 'rosa' ? "Mudar para tema Azul" : "Mudar para tema Rosa"}
            >
              <span className="text-xl" role="img" aria-label="Tema">{themes[theme].icon}</span>
            </button>
            <button
              onClick={handleToggleSidebar}
              className="w-12 h-12 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
              title={sidebarCollapsed ? "Expandir sidebar" : "Recolher sidebar"}
            >
              {sidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>
          </div>
        </aside>
      )}

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${!isPublicPage && isActive ? (sidebarCollapsed ? 'pl-[72px]' : 'pl-[200px]') : ''}`}>
        {/* Header - Videoooo Style */}
        {!isPublicPage && isActive && (
          <header className="sticky top-0 z-40 h-16 bg-card/90 backdrop-blur-xl border-b border-border/50 flex items-center justify-between px-6">
            {/* Left: Page Title */}
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold text-foreground">
                {pathname === "/app" && (
                  activeModule === "psicotecnico" ? "Psicotecnico" :
                  activeModule === "teorico" ? "Teorico" :
                  activeModule === "direcao" ? "Pratico" :
                  "Inicio"
                )}
                {pathname === "/psicotecnico" && "Psicotecnico"}
                {pathname === "/biblioteca" && "Biblioteca"}
                {pathname === "/simulado" && "Simulado"}
                {pathname === "/conquistas" && "Conquistas"}
              </h1>
            </div>

            {/* Center: Tagline */}
            {isActive && isHub && (
              <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
                <span>Treine no seu ritmo e</span>
                <span className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/30 text-primary font-bold">chegue pronto</span>
                <span>para a prova</span>
              </div>
            )}

            {/* Right: User Menu */}
            <div className="flex items-center gap-3">
              {isActive && !isHub && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/50 border border-border/20">
                  <Flame className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-semibold">Estudo em dia</span>
                </div>
              )}

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-background/50 border border-border/20 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                      <UserCircle className="h-4 w-4" />
                      <span className="max-w-[120px] truncate hidden sm:inline">{user.email}</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-card border-border">
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
                        {activeModule === "teorico" && (
                          <DropdownMenuItem
                            onClick={() => setCronogramaOpen(true)}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>Meu Cronograma</span>
                          </DropdownMenuItem>
                        )}
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={toggleTheme}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Palette className="h-4 w-4" />
                      Tema {theme === 'rosa' ? 'Azul' : 'Rosa'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={signOut} className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive">
                      <LogOut className="h-4 w-4" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null}
            </div>
          </header>
        )}

        {/* Expiration warning banner */}
        {!isAdmin && profile && !profile.is_migrated && profile.expires_at && (() => {
          const diffTime = new Date(profile.expires_at).getTime() - new Date().getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays > 0 && diffDays <= 5) {
            return (
              <div className="bg-amber-500/15 border-b border-amber-500/30 text-amber-400 text-xs py-2.5 px-4 text-center font-medium flex items-center justify-center gap-1.5">
                <span>Atencao: Seu periodo de acesso expira em <strong>{diffDays} {diffDays === 1 ? "dia" : "dias"}</strong>!</span>
                <Link to="/checkout" className="underline font-bold text-foreground hover:text-primary ml-2">Renove agora</Link>
              </div>
            );
          }
          return null;
        })()}

        <RatingPrompt />
        {activeModule === "teorico" && <DailyCheckinBanner />}
        {activeModule === "teorico" && (
          <CronogramaModal open={cronogramaOpen} onOpenChange={setCronogramaOpen} />
        )}

        {/* Floating WhatsApp button */}
        {showSupportButton && supportLink && (
          <a
            href={supportLink}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-40 flex items-center justify-center h-14 w-14 rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#22c35e] hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
            title="Fale conosco no WhatsApp"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
            </svg>
          </a>
        )}

        {/* Main Content */}
        <main className="flex-1 pb-20 sm:pb-0">
          {isPublicPage ? (
            <Outlet />
          ) : (
            <RequireAuth>
              <Outlet />
            </RequireAuth>
          )}
        </main>
      </div>
    </div>
  );
}
