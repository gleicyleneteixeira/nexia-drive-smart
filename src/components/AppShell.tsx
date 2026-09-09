import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { RequireAuth } from "./RequireAuth";
import { RatingPrompt, triggerRatingPrompt } from "./RatingPrompt";
import { 
  Flame, Home, Brain, Library, Trophy, Target, Settings, 
  ChevronLeft, ChevronRight, Shield, Star, Car, Calendar,
  BookOpen, Upload, Video, BarChart3, Users, ShoppingBag, 
  LogOut, UserCircle, Palette, Menu
} from "lucide-react";
import { CronogramaModal } from "./CronogramaModal";
import { DailyCheckinBanner } from "./DailyCheckinBanner";
import { motion, AnimatePresence } from "framer-motion";
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
  const navigate = useNavigate();
  const { user, profile, isAdmin, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isPublicPage = pathname === "/" || pathname === "/cadastro" || pathname === "/auth" || pathname === "/reset-password" || pathname === "/simulado-demo";
  const isActive = (profile?.status === "ativo" && !isProfileExpired(profile)) || isAdmin;

  const [activeModule, setActiveModule] = useState<"hub" | "teorico" | "psicotecnico" | "direcao">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("nexia:active_module") as "teorico" | "psicotecnico" | "direcao") || "hub";
    }
    return "hub";
  });

  const [cronogramaOpen, setCronogramaOpen] = useState(false);
  const [supportLink, setSupportLink] = useState<string | null>(null);
  const [showSupportButton, setShowSupportButton] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  // Sidebar expanded inside the drawer (icon+label vs icon-only)
  const [sidebarExpanded, setSidebarExpanded] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_SIDEBAR_KEY);
      return stored === null ? false : stored === "true";
    }
    return false;
  });

  const [activeAdminSection, setActiveAdminSection] = useState<string | null>(null);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("nexia:admin_menu_open");
      return stored !== "false";
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

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Auto-close sidebar after 15 seconds of inactivity
  useEffect(() => {
    if (!menuOpen) return;
    const timer = setTimeout(() => {
      setMenuOpen(false);
    }, 15000);
    return () => clearTimeout(timer);
  }, [menuOpen]);

  const handleToggleModule = (mod: "teorico" | "psicotecnico" | "direcao") => {
    setActiveModule(mod);
    localStorage.setItem("nexia:active_module", mod);
    window.dispatchEvent(new Event("nexia:active_module:change"));
    setMenuOpen(false);
    if (typeof window !== "undefined" && window.location.pathname !== "/app") {
      navigate({ to: "/app" });
    }
  };

  const handleToggleSidebarExpand = () => {
    const newState = !sidebarExpanded;
    setSidebarExpanded(newState);
    localStorage.setItem(STORAGE_SIDEBAR_KEY, String(newState));
  };

  const handleToggleAdminMenu = () => {
    const newState = !isAdminMenuOpen;
    setIsAdminMenuOpen(newState);
    localStorage.setItem("nexia:admin_menu_open", String(newState));
  };

  const isHub = activeModule === "hub";
  const expanded = sidebarExpanded;
  const drawerWidth = expanded ? 220 : 72;

  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col">
      {/* Floating Menu Button */}
      {!isPublicPage && isActive && (
        <button
          onClick={() => setMenuOpen(true)}
          className="fixed bottom-5 left-5 z-30 flex items-center justify-center h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 border-2 border-white/30 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer ring-2 ring-primary/20"
          title="Abrir menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}

      {/* Sidebar Drawer (overlay) */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: -drawerWidth }}
              animate={{ x: 0 }}
              exit={{ x: -drawerWidth }}
              transition={{ type: "tween", duration: 0.15, ease: "easeOut" }}
              className="fixed left-0 top-0 bottom-0 z-50 bg-card border-r border-border/50 flex flex-col py-3"
              style={{ width: drawerWidth }}
            >
              {/* Header row: Logo only */}
              <div className={`flex items-center gap-2 mb-3 px-3 ${expanded ? '' : 'justify-center'}`}>
                <Link
                  to={isActive ? "/app" : "/"}
                  onClick={() => {
                    setMenuOpen(false);
                    if (isActive) {
                      localStorage.removeItem("nexia:active_module");
                      window.dispatchEvent(new Event("nexia:active_module:change"));
                    }
                  }}
                  className="rounded-xl gradient-primary w-10 h-10 flex items-center justify-center text-primary-foreground font-black shadow-glow text-base shrink-0"
                >
                  N
                </Link>
                {expanded && (
                  <span className="text-sm font-bold text-foreground truncate flex-1">Menu</span>
                )}
              </div>

              {/* Nav Items */}
              <nav className={`flex flex-col gap-0.5 flex-1 ${expanded ? 'px-3 items-stretch' : 'items-center px-2'} overflow-y-auto no-scrollbar`}>
                {NAV_ITEMS.map((item) => {
                  const active = item.module 
                    ? activeModule === item.module && !activeAdminSection
                    : pathname === item.to && activeModule === "hub" && !activeAdminSection;
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.label}
                      onClick={() => {
                        setActiveAdminSection(null);
                        setMenuOpen(false);
                        if (item.module) {
                          handleToggleModule(item.module);
                        } else if (item.label === "Inicio") {
                          localStorage.removeItem("nexia:active_module");
                          window.dispatchEvent(new Event("nexia:active_module:change"));
                          navigate({ to: "/app" });
                        } else {
                          navigate({ to: item.to });
                        }
                      }}
                      className={`relative flex items-center gap-3 rounded-xl transition-all text-left ${
                        expanded ? 'h-10 px-3' : 'w-10 h-10 justify-center mx-auto'
                      } ${
                        active
                          ? 'bg-primary/15 text-primary border border-primary/30'
                          : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                      }`}
                      title={expanded ? undefined : item.label}
                    >
                      <Icon className="h-[18px] w-[18px] shrink-0" />
                      {expanded && (
                        <span className="text-[13px] font-medium truncate">{item.label}</span>
                      )}
                    </button>
                  );
                })}

                {/* Admin Section - only when expanded */}
                {isAdmin && expanded && (
                  <div className="mt-auto pt-3 border-t border-border/30">
                    <button
                      onClick={handleToggleAdminMenu}
                      className="w-full flex items-center justify-between h-10 px-3 rounded-xl text-[13px] font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
                    >
                      <span className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Admin
                      </span>
                      <ChevronRight className={`h-3.5 w-3.5 transition-transform duration-200 ${isAdminMenuOpen ? 'rotate-90' : ''}`} />
                    </button>

                    {isAdminMenuOpen && (
                      <div className="mt-1 space-y-0.5 pl-2 border-l border-border/30 ml-4">
                        {ADMIN_ITEMS.map((item) => {
                          const active = pathname === "/admin" && activeAdminSection === item.adminSection;
                          const Icon = item.icon;
                          return (
                            <button
                              key={item.label}
                              onClick={() => {
                                setActiveAdminSection(item.adminSection ?? null);
                                setMenuOpen(false);
                                navigate({ to: "/admin", search: { tab: item.adminSection } });
                              }}
                              className={`w-full flex items-center gap-2.5 rounded-lg transition-all text-left h-9 px-3 text-[13px] ${
                                active
                                  ? 'bg-primary/15 text-primary border border-primary/30'
                                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                              }`}
                            >
                              <Icon className="h-3.5 w-3.5 shrink-0" />
                              <span className="truncate">{item.label}</span>
                            </button>
                          );
                        })}
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
                                setMenuOpen(false);
                                navigate({ to: "/admin", search: { tab: item.adminSection } });
                              }}
                              className={`w-full flex items-center gap-2.5 rounded-lg transition-all text-left h-9 px-3 text-[13px] ${
                                active
                                  ? 'bg-primary/15 text-primary border border-primary/30'
                                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                              }`}
                            >
                              <Icon className="h-3.5 w-3.5 shrink-0" />
                              <span className="truncate">{item.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Admin icon when collapsed */}
                {isAdmin && !expanded && (
                  <div className="mt-auto pt-2 border-t border-border/30 flex flex-col items-center gap-1">
                    <button
                      onClick={handleToggleAdminMenu}
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
                      title="Admin"
                    >
                      <Shield className="h-[18px] w-[18px]" />
                    </button>
                    {isAdminMenuOpen && (
                      <>
                        {ADMIN_ITEMS.map((item) => {
                          const Icon = item.icon;
                          return (
                            <button
                              key={item.label}
                              onClick={() => {
                                setActiveAdminSection(item.adminSection ?? null);
                                setMenuOpen(false);
                                navigate({ to: "/admin", search: { tab: item.adminSection } });
                              }}
                              className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
                              title={item.label}
                            >
                              <Icon className="h-[18px] w-[18px]" />
                            </button>
                          );
                        })}
                        {SUPER_ADMIN_ITEMS.map((item) => {
                          const Icon = item.icon;
                          return (
                            <button
                              key={item.label}
                              onClick={() => {
                                setActiveAdminSection(item.adminSection ?? null);
                                setMenuOpen(false);
                                navigate({ to: "/admin", search: { tab: item.adminSection } });
                              }}
                              className="w-10 h-10 rounded-xl flex items-center justify-center text-primary/70 hover:bg-accent hover:text-foreground transition-all"
                              title={item.label}
                            >
                              <Icon className="h-[18px] w-[18px]" />
                            </button>
                          );
                        })}
                      </>
                    )}
                  </div>
                )}
              </nav>

              {/* Bottom: Theme + Expand/Collapse */}
              <div className={`flex flex-col items-center gap-1 mt-auto pt-2 border-t border-border/30 ${expanded ? 'px-3' : ''}`}>
                <button
                  onClick={toggleTheme}
                  className={`${expanded ? 'w-full h-10 px-3 justify-start' : 'w-10 h-10 justify-center'} rounded-xl flex items-center gap-3 text-muted-foreground hover:bg-accent hover:text-foreground transition-all`}
                  title={theme === 'rosa' ? "Mudar para tema Azul" : "Mudar para tema Rosa"}
                >
                  <span className="text-lg shrink-0">{themes[theme].icon}</span>
                  {expanded && <span className="text-[13px] font-medium">Tema</span>}
                </button>
                <button
                  onClick={handleToggleSidebarExpand}
                  className={`${expanded ? 'w-full h-10 px-3 justify-start' : 'w-10 h-10 justify-center'} rounded-xl flex items-center gap-3 text-muted-foreground hover:bg-accent hover:text-foreground transition-all`}
                  title={expanded ? "Recolher menu" : "Expandir menu"}
                >
                  {expanded ? <ChevronLeft className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />}
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        {!isPublicPage && isActive && (
          <header className="sticky top-0 z-30 h-14 bg-card/90 backdrop-blur-xl border-b border-border/50 flex items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <h1 className="text-base font-semibold text-foreground">
                {pathname === "/app" && (
                  activeModule === "psicotecnico" ? "Psicotecnico" :
                  activeModule === "teorico" ? "Teorico" :
                  activeModule === "direcao" ? "Pratico" :
                  "Inicio"
                )}
                {pathname === "/biblioteca" && "Biblioteca"}
                {pathname === "/simulado" && "Simulado"}
                {pathname === "/conquistas" && "Conquistas"}
                {pathname === "/admin" && "Admin"}
              </h1>
            </div>

            {isActive && isHub && (
              <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
                <span>Treine no seu ritmo e</span>
                <span className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/30 text-primary font-bold">chegue pronto</span>
                <span>para a prova</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              {isActive && !isHub && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/50 border border-border/20">
                  <Flame className="h-4 w-4 text-amber-500" />
                  <span className="text-xs font-semibold">Estudo em dia</span>
                </div>
              )}

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-background/50 border border-border/20 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                      <UserCircle className="h-4 w-4" />
                      <span className="max-w-[100px] truncate hidden sm:inline">{user.email}</span>
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

        {/* Expiration warning */}
        {!isAdmin && profile && !profile.is_migrated && profile.expires_at && (() => {
          const diffTime = new Date(profile.expires_at).getTime() - new Date().getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays > 0 && diffDays <= 5) {
            return (
              <div className="bg-amber-500/15 border-b border-amber-500/30 text-amber-400 text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-1.5">
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
            className="fixed bottom-5 right-5 z-30 flex items-center justify-center h-12 w-12 rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#22c35e] hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
            title="Fale conosco no WhatsApp"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
            </svg>
          </a>
        )}

        {/* Main Content */}
        <main className="flex-1 pb-20 sm:pb-0 overflow-x-hidden">
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
