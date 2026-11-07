import { useState, useEffect, useCallback, useMemo, type CSSProperties } from "react";
import { Link, Outlet, useLocation, useNavigate, useRouterState } from "@tanstack/react-router";
import { RequireAuth } from "./RequireAuth";
import { RatingPrompt, triggerRatingPrompt } from "./RatingPrompt";
import {
  Flame, Star, Calendar, Upload, Video, BarChart3, Users, ShoppingBag,
  LogOut, Palette, RefreshCw, ListChecks, Settings, Brain,
} from "lucide-react";
import { CronogramaModal } from "./CronogramaModal";
import { DailyCheckinBanner } from "./DailyCheckinBanner";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { themes } from "@/lib/themes";
import { supabase } from "@/integrations/supabase/client";
import { loadQuestionOverrides } from "@/data/questions";
import { loadReviewFromServer } from "@/lib/review";
import { isProfileExpired } from "@/lib/subscription";
import { APP_VERSION } from "@/lib/app-version";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  GlassSidebar,
  GlassTabBar,
  GlassTopbar,
  GlassSheet,
  CommandPalette,
  navSections,
  tabBarItems,
  simuladosItem,
  contaSection,
  type NavItem,
} from "@/components/glass";

type NavItemLegacy = {
  to: string;
  label: string;
  icon: any;
  module?: "teorico" | "psicotecnico" | "direcao";
  soon?: boolean;
  adminSection?: string;
};

const ADMIN_ITEMS: NavItemLegacy[] = [
  { to: "/admin", label: "Vendas", icon: ShoppingBag, adminSection: "sales" },
  { to: "/admin", label: "Usuarios", icon: Users, adminSection: "users" },
  { to: "/admin", label: "Biblioteca Admin", icon: Upload, adminSection: "library" },
  { to: "/admin", label: "Videos", icon: Video, adminSection: "videos" },
  { to: "/admin", label: "Questões", icon: ListChecks, adminSection: "questoes" },
  { to: "/admin", label: "Avaliacoes", icon: Star, adminSection: "ratings" },
  { to: "/admin", label: "Configuracoes", icon: Settings, adminSection: "settings" },
];

const SUPER_ADMIN_ITEMS: NavItemLegacy[] = [
  { to: "/admin", label: "DETRAN", icon: BarChart3, adminSection: "detran" },
  { to: "/admin", label: "Teste MIG (Preview Admin)", icon: Brain, adminSection: "mig" },
  { to: "/admin", label: "Simulado Divulgacao", icon: Video, adminSection: "espelho" },
];

const STORAGE_SIDEBAR_KEY = "@nexia_sidebar_collapsed";

/** Espaço lateral que o conteúdo reserva para a sidebar flutuante. */
const sidebarSpace = (expanded: boolean) => `${(expanded ? 264 : 76) + 12}px`;

export function AppShell() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, profile, isAdmin, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isPublicPage =
    pathname === "/" ||
    pathname === "/cadastro" ||
    pathname === "/auth" ||
    pathname === "/reset-password" ||
    pathname === "/simulado-demo";
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

  // Paleta de comandos (Ctrl+K) e sheets mobile
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState<"estudar" | "mais" | null>(null);

  // Versão do app: SOMENTE manual (menu do perfil → "Atualizar a versão").
  // Nada automático: nenhuma faixa, nenhuma verificação sozinha.
  const fetchServerVersion = useCallback(async (): Promise<string | null> => {
    try {
      const { getServerAppVersion } = await import("@/lib/admin-operations.server");
      const { version } = await getServerAppVersion();
      return version ?? null;
    } catch {
      return null;
    }
  }, []);

  // "Atualizar a versão" no menu do perfil: força a verificação agora.
  // Se houver versão nova, recarrega; se não, confirma que está em dia.
  const handleManualUpdate = useCallback(async () => {
    const version = await fetchServerVersion();
    if (version && version !== APP_VERSION) {
      window.location.reload();
    } else if (version) {
      toast.success("Você já está na versão mais recente ✅");
    } else {
      toast.error("Não foi possível verificar agora. Tente de novo.");
    }
  }, [fetchServerVersion]);

  // Sidebar expandida/recolhida (preferência salva no navegador)
  const [sidebarExpanded, setSidebarExpanded] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_SIDEBAR_KEY);
      // padrão: expandida (menu agrupado legível); "true" = expandida
      return stored === null ? true : stored === "true";
    }
    return true;
  });

  const [activeAdminSection, setActiveAdminSection] = useState<string | null>(null);

  useEffect(() => {
    loadQuestionOverrides().catch(() => {});
  }, []);

  // Repetição espaçada: baixa o histórico de revisão do usuário (silencioso
  // se a tabela question_review não existir — aí segue só o local).
  useEffect(() => {
    loadReviewFromServer(user?.id).catch(() => {});
  }, [user?.id]);

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

  // Abre o modal do cronograma a partir de CTAs em outros componentes
  // (ex.: alerta de risco de prazo no banner diário).
  useEffect(() => {
    const handler = () => setCronogramaOpen(true);
    window.addEventListener("nexia:abrir-cronograma", handler);
    return () => window.removeEventListener("nexia:abrir-cronograma", handler);
  }, []);

  // Notificações WhatsApp automáticas (abandono de cadastro + cobrança).
  // Disparo único / 1x ao dia; elegibilidade final validada no servidor.
  useEffect(() => {
    if (!user || !profile || isAdmin || isPublicPage) return;
    (async () => {
      try {
        const { triggerWaNotification } = await import("@/lib/admin-operations.server");
        // 1. Cadastrou e não pagou (só contas recentes — 1x, nunca repete)
        const abKey = `wa_abandoned_${user.id}`;
        if (profile.status === "pendente_pagamento" && !localStorage.getItem(abKey)) {
          const r = await triggerWaNotification({ data: { template: "abandoned" } });
          if (r?.sent) localStorage.setItem(abKey, "1");
        }
        // 2. Cobrança/acesso (pendente antigo ou expirado) — 1x ao dia
        const day = new Date().toISOString().slice(0, 10);
        const billKey = `wa_billing_${user.id}_${day}`;
        if (
          (profile.status === "pendente_pagamento" || isProfileExpired(profile)) &&
          !localStorage.getItem(billKey)
        ) {
          const r = await triggerWaNotification({ data: { template: "billing" } });
          if (r?.sent) localStorage.setItem(billKey, "1");
        }
      } catch {
        /* silencioso: nunca bloqueia o app */
      }
    })();
  }, [user, profile, isAdmin, isPublicPage]);

  // Fecha sheets ao trocar de página
  useEffect(() => {
    setSheetOpen(null);
  }, [pathname]);

  const handleToggleModule = (mod: "teorico" | "psicotecnico" | "direcao") => {
    setActiveModule(mod);
    localStorage.setItem("nexia:active_module", mod);
    window.dispatchEvent(new Event("nexia:active_module:change"));
    setActiveAdminSection(null);
    if (typeof window !== "undefined" && window.location.pathname !== "/app") {
      navigate({ to: "/app" });
    }
  };

  const handleToggleSidebarExpand = () => {
    const newState = !sidebarExpanded;
    setSidebarExpanded(newState);
    localStorage.setItem(STORAGE_SIDEBAR_KEY, String(newState));
  };

  // ---------------------------------------------------------------------------
  // NAVEGAÇÃO — fonte única de ação (sidebar, tab bar, sheets e paleta passam
  // por aqui). Só navegação/estado de UI; nenhuma regra de negócio.
  // ---------------------------------------------------------------------------
  const goHome = useCallback(() => {
    setActiveAdminSection(null);
    localStorage.removeItem("nexia:active_module");
    window.dispatchEvent(new Event("nexia:active_module:change"));
    if (pathname !== "/app") navigate({ to: "/app" });
  }, [navigate, pathname]);

  const runAction = useCallback(
    (item: NavItem) => {
      if (item.soon) return;
      const a = item.action;
      switch (a.kind) {
        case "home":
          goHome();
          break;
        case "module":
          handleToggleModule(a.module);
          break;
        case "link": {
          setActiveAdminSection(a.search?.tab ?? null);
          // limpa o módulo ativo ao ir para outra rota do teórico? NÃO —
          // mantemos o módulo como está (mesmo comportamento anterior).
          navigate({ to: a.to, search: a.search as Record<string, string> });
          break;
        }
        case "external":
          if (a.href && a.href !== "#") window.open(a.href, "_blank", "noopener,noreferrer");
          break;
        case "theme":
          toggleTheme();
          break;
        case "signout":
          void signOut();
          break;
      }
    },
    [goHome, navigate, toggleTheme, signOut],
  );

  // Itens de admin viram NavItem (mesmos destinos de sempre)
  const adminNavItems: NavItem[] = useMemo(
    () =>
      [...ADMIN_ITEMS, ...SUPER_ADMIN_ITEMS]
        .filter((i) => i.adminSection)
        .map((i) => ({
          id: `admin-${i.adminSection}`,
          label: i.label,
          icon: i.icon,
          action: { kind: "link" as const, to: "/admin", search: { tab: i.adminSection! } },
          keywords: ["admin", "painel"],
        })),
    [],
  );

  // Seções completas: ESTUDAR + TREINAR + (Admin) + CONTA.
  // Estudar/Treinar seguem o módulo escolhido no Início (navSections).
  const sections = useMemo(() => {
    const base = navSections(activeModule);
    if (isAdmin) {
      base.push({ id: "admin", label: "Admin", items: adminNavItems });
    }
    base.push(contaSection(supportLink));
    return base;
  }, [isAdmin, supportLink, adminNavItems, activeModule]);

  // Item ativo (pílula de vidro destacada)
  const location = useRouterState({ select: (s) => s.location });
  const [searchStr, setSearchStr] = useState("");
  useEffect(() => {
    setSearchStr(typeof window !== "undefined" ? window.location.search : "");
  }, [location]);

  const activeId = useMemo(() => {
    if (pathname === "/app") {
      if (activeModule === "psicotecnico") return "psicotecnico";
      if (activeModule === "teorico") return "teorico";
      if (activeModule === "direcao") return "pratico";
      return "inicio";
    }
    if (pathname === "/admin" && activeAdminSection) return `admin-${activeAdminSection}`;
    // Joguinhos: destaca "Treinar agora"/"Simulados" só se o item contextual
    // apontar para cá (módulo psicotécnico); caso contrário, nada aceso.
    if (pathname === "/psicotecnico") return activeModule === "psicotecnico" ? "simulado" : null;
    if (pathname === "/simulado") {
      const cat = new URLSearchParams(searchStr).get("categoria");
      if (cat) {
        const eixo = sections
          .flatMap((s) => s.items)
          .find((i) => i.action.kind === "link" && i.action.search?.categoria === cat);
        if (eixo) return eixo.id;
      }
      return "simulado";
    }
    const flat = sections.flatMap((s) => s.items);
    const hit = flat.find((i) => i.action.kind === "link" && i.action.to === pathname);
    return hit?.id ?? null;
  }, [pathname, activeModule, activeAdminSection, searchStr, sections]);

  // Tab bar (mobile): mapeia a rota/módulo para a aba correta
  const activeTabId = useMemo(() => {
    if (pathname === "/app") return activeModule === "hub" ? "inicio" : "estudar";
    if (pathname === "/biblioteca") return "estudar";
    if (pathname === "/simulado") return "simulado";
    if (pathname === "/psicotecnico") return activeModule === "psicotecnico" ? "simulado" : null; // "Treino" no psicotécnico
    if (pathname === "/conquistas") return "conquistas";
    // demais rotas de treino caem no "Mais"
    const flat = sections.flatMap((s) => s.items);
    const hit = flat.find((i) => i.action.kind === "link" && i.action.to === pathname);
    if (hit && (hit.id === "simulado" || hit.id === "conquistas")) return hit.id;
    return null;
  }, [pathname, activeModule, sections]);

  const onTab = (item: NavItem) => {
    if (item.id === "estudar") {
      // Módulo escolhido no Início: "Estudar" cai no estudo dele.
      // Já no hub ou no próprio dashboard → folha para escolher/trocar categoria.
      if (activeModule !== "hub" && pathname !== "/app") {
        handleToggleModule(activeModule);
        return;
      }
      setSheetOpen((s) => (s === "estudar" ? null : "estudar"));
      return;
    }
    if (item.id === "mais") {
      setSheetOpen((s) => (s === "mais" ? null : "mais"));
      return;
    }
    runAction(item);
  };

  // Cabeçalho clicável das seções da sidebar (desktop): ESTUDAR leva ao
  // estudo do módulo escolhido; TREINAR leva aos simulados do teórico ou
  // aos joguinhos do psicotécnico. Demais seções seguem sendo texto.
  const handleSectionClick = (sectionId: string) => {
    if (sectionId === "estudar") {
      if (activeModule !== "hub") handleToggleModule(activeModule);
      else setPaletteOpen(true); // sem módulo: escolhe pela paleta (Ctrl+K)
      return;
    }
    if (sectionId === "treinar") runAction(simuladosItem(activeModule));
  };

  const sheetItems = useMemo(() => {
    if (sheetOpen === "estudar") return sections.find((s) => s.id === "estudar")?.items ?? [];
    if (sheetOpen === "mais") {
      const treinar = sections.find((s) => s.id === "treinar")?.items ?? [];
      const conta = contaSection(supportLink).items.filter((i) => i.id !== "tema");
      return [...treinar, ...conta];
    }
    return [];
  }, [sheetOpen, supportLink, sections]);

  // Título/contexto da topbar (mesma semântica de antes)
  const pageTitle =
    pathname === "/app"
      ? activeModule === "psicotecnico"
        ? "Psicotécnico"
        : activeModule === "teorico"
          ? "Parte Teórica"
          : activeModule === "direcao"
            ? "Direção Prática"
            : "Início"
      : pathname === "/biblioteca"
        ? "Biblioteca"
        : pathname === "/simulado"
          ? "Simulados"
          : pathname === "/conquistas"
            ? "Conquistas"
            : pathname === "/admin"
              ? "Admin"
              : pathname === "/placas"
                ? "Treino de Placas"
                : pathname === "/turbo"
                  ? "Revisão Turbo"
                  : pathname === "/mais-caem"
                    ? "Questões que mais caem"
                    : pathname === "/livro"
                      ? "Livro com narração"
                      : pathname === "/psicotecnico"
                        ? "Psicotécnico"
                        : "Nexia Drive";

  const pageEyebrow =
    pathname === "/app"
      ? "Área do aluno"
      : pathname === "/simulado" || pathname === "/psicotecnico"
        ? "Treinar"
        : pathname === "/biblioteca"
          ? "Estudar"
          : "Nexia Drive";

  const isHub = activeModule === "hub";
  const showChrome = !isPublicPage && !!user;

  return (
    <div className="min-h-screen font-sans text-foreground flex flex-col">
      {/* ---------------------------------------------------------------
          DESKTOP: sidebar de vidro flutuante (margem das bordas)
          --------------------------------------------------------------- */}
      {showChrome && (
        <GlassSidebar
          sections={sections}
          activeId={activeId}
          collapsed={!sidebarExpanded}
          onToggleCollapsed={handleToggleSidebarExpand}
          onNavigate={(_sectionId, itemId) => {
            const item = sections.flatMap((s) => s.items).find((i) => i.id === itemId);
            if (item) runAction(item);
          }}
          onSectionClick={handleSectionClick}
          sectionClickable={(id) => id === "estudar" || id === "treinar"}
          onOpenPalette={() => setPaletteOpen(true)}
          onToggleTheme={toggleTheme}
          themeIcon={themes[theme].icon}
          user={{
            name: profile?.display_name || user?.email?.split("@")[0] || "Aluno",
            email: user?.email || "",
          }}
          onSignOut={() => void signOut()}
          logoHref={isActive ? "/app" : "/"}
        />
      )}

      {/* ---------------------------------------------------------------
          Conteúdo: reserva o espaço da sidebar só no desktop
          --------------------------------------------------------------- */}
      <div
        className="flex-1 flex flex-col min-w-0 app-with-sidebar"
        style={
          showChrome
            ? ({ "--sidebar-space": sidebarSpace(sidebarExpanded) } as CSSProperties)
            : undefined
        }
      >
        {/* TOPBAR de vidro, fina e sticky */}
        {showChrome && (
          <GlassTopbar
            title={pageTitle}
            eyebrow={pageEyebrow}
            logoHref={isActive ? "/app" : "/"}
            onLogoClick={() => {
              if (isActive) {
                localStorage.removeItem("nexia:active_module");
                window.dispatchEvent(new Event("nexia:active_module:change"));
              }
            }}
            onOpenPalette={() => setPaletteOpen(true)}
            message={
              isHub ? (
                <>
                  <span>Treine no seu ritmo e</span>
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/30 text-primary font-bold">
                    chegue pronto
                  </span>
                  <span>para a prova</span>
                </>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Flame className="h-4 w-4 text-amber-500" />
                  Estudo em dia
                </span>
              )
            }
            right={
              user ? (
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="glass-pill flex items-center gap-2 h-10 px-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        aria-label="Menu da conta"
                      >
                        <span className="w-6 h-6 rounded-lg gradient-primary text-primary-foreground text-[11px] font-black flex items-center justify-center">
                          {(profile?.display_name || user.email || "?").charAt(0).toUpperCase()}
                        </span>
                        <span className="max-w-[110px] truncate hidden sm:inline">
                          {profile?.display_name || user.email}
                        </span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="glass-strong w-52 border border-white/15 p-1.5">
                      {isActive && (
                        <>
                          <DropdownMenuItem
                            onClick={() => triggerRatingPrompt("manual")}
                            className="flex items-center gap-2 cursor-pointer rounded-xl"
                          >
                            <Star className="h-4 w-4" />
                            Avaliar o app
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {activeModule === "teorico" && (
                            <DropdownMenuItem
                              onClick={() => setCronogramaOpen(true)}
                              className="flex items-center gap-2 cursor-pointer rounded-xl"
                            >
                              <Calendar className="h-4 w-4" />
                              <span>Meu Cronograma</span>
                            </DropdownMenuItem>
                          )}
                        </>
                      )}
                      <DropdownMenuItem
                        onClick={handleManualUpdate}
                        className="flex items-center gap-2 cursor-pointer rounded-xl"
                      >
                        <RefreshCw className="h-4 w-4" />
                        <span>Atualizar a versão</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={toggleTheme}
                        className="flex items-center gap-2 cursor-pointer rounded-xl"
                      >
                        <Palette className="h-4 w-4" />
                        Tema {theme === "rosa" ? "Azul" : "Rosa"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => void signOut()}
                        className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive rounded-xl"
                      >
                        <LogOut className="h-4 w-4" />
                        Sair
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : null
            }
          />
        )}

        {/* Expiration warning */}
        {!isAdmin && profile && !profile.is_migrated && profile.expires_at && (() => {
          const diffTime = new Date(profile.expires_at).getTime() - new Date().getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays > 0 && diffDays <= 5) {
            return (
              <div className="bg-amber-500/15 border-b border-amber-500/30 text-amber-400 text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-1.5">
                <span>Atenção: Seu período de acesso expira em <strong>{diffDays} {diffDays === 1 ? "dia" : "dias"}</strong>!</span>
                <Link to="/checkout" className="underline font-bold text-foreground hover:text-primary ml-2">Renove agora</Link>
              </div>
            );
          }
          return null;
        })()}

        <RatingPrompt />
        {activeModule === "teorico" && pathname === "/app" && <DailyCheckinBanner />}
        {activeModule === "teorico" && (
          <CronogramaModal open={cronogramaOpen} onOpenChange={setCronogramaOpen} />
        )}

        {/* Botão WhatsApp — discreto, em vidro, acima da tab bar no mobile */}
        {showSupportButton && supportLink && (
          <a
            href={supportLink}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed z-30 flex items-center justify-center rounded-2xl bg-[#25D366]/90 text-white backdrop-blur-md border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.35)] hover:bg-[#25D366] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer bottom-24 right-4 h-12 w-12 lg:bottom-6 lg:right-6"
            title="Fale conosco no WhatsApp"
            aria-label="Fale conosco no WhatsApp"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
            </svg>
          </a>
        )}

        {/* Main Content — o simulado gerencia o próprio espaço (altura fixa),
            as demais páginas reservam a área da tab bar no mobile */}
        <main
          className={`flex-1 min-w-0 ${pathname === "/simulado" ? "pb-0" : "pb-32 lg:pb-10"}`}
        >
          {isPublicPage ? (
            <Outlet />
          ) : (
            <RequireAuth>
              <Outlet />
            </RequireAuth>
          )}
        </main>
      </div>

      {/* ---------------------------------------------------------------
          MOBILE: tab bar de vidro em pílula + sheets
          --------------------------------------------------------------- */}
      {showChrome && (
        <GlassTabBar items={tabBarItems(activeModule)} activeId={activeTabId} onTab={onTab} />
      )}

      <GlassSheet
        open={!!sheetOpen && showChrome}
        title={sheetOpen === "mais" ? "Mais opções" : "Estudar"}
        items={sheetItems}
        onClose={() => setSheetOpen(null)}
        onNavigate={(item) => runAction(item)}
      />

      {/* PALETA DE COMANDOS (Ctrl+K) */}
      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        sections={sections}
        onNavigate={(item) => runAction(item)}
      />
    </div>
  );
}
