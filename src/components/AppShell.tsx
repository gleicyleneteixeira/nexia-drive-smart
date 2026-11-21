import { useState, useEffect, useCallback, useMemo, type CSSProperties } from "react";
import { Link, Outlet, useLocation, useNavigate, useRouterState } from "@tanstack/react-router";
import { RequireAuth } from "./RequireAuth";
import { RatingPrompt, triggerRatingPrompt } from "./RatingPrompt";
import {
  Flame,
  Star,
  Calendar,
  Upload,
  Video,
  BarChart3,
  Users,
  ShoppingBag,
  LogOut,
  RefreshCw,
  ListChecks,
  Settings,
  Brain,
  Moon,
  Sun,
  UserRound,
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
import { BRAZILIAN_STATES, isBrazilianUf } from "@/lib/brazilian-states";
import { cleanCpf, formatCpf, isValidCpf } from "@/lib/cpf";
import { cleanPhone, formatPhone } from "@/lib/phone";
import { APP_VERSION } from "@/lib/app-version";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  GlassSidebar,
  GlassTopbar,
  GlassSheet,
  GlassTabBar,
  CommandPalette,
  navSections,
  simuladosItem,
  tabBarItems,
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
const NOT_SET = "not_set";
const PROFILE_EMPLOYMENT_OPTIONS = [
  { value: "carteira_assinada", label: "CLT" },
  { value: "autonomo", label: "Autônomo(a)" },
  { value: "estudante", label: "Estudante" },
  { value: "trabalha_estuda", label: "Trabalha e Estuda" },
  { value: "desempregado", label: "Desempregado(a)" },
  { value: "outro", label: "Outros" },
  { value: "nao_trabalha", label: "Não trabalha (cadastro anterior)" },
] as const;

type ProfileDraft = {
  display_name: string;
  cpf: string;
  phone: string;
  employment_status: string;
  employment_other: string;
  uf: string;
};

/** Espaço lateral que o conteúdo reserva para a sidebar flutuante. */
const sidebarSpace = (expanded: boolean) => `${(expanded ? 264 : 76) + 12}px`;

function getEmploymentLabel(status: string | null, other: string | null) {
  if (!status || status === NOT_SET) return "Não informado";
  if (status === "outro" && other?.trim()) return `Outros: ${other.trim()}`;
  if (status === "clt") return "CLT";
  return PROFILE_EMPLOYMENT_OPTIONS.find((option) => option.value === status)?.label ?? status;
}

export function AppShell() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, profile, isAdmin, isMock, signOut, refreshProfile } = useAuth();
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
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [profileEditing, setProfileEditing] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileDraft, setProfileDraft] = useState<ProfileDraft>({
    display_name: "",
    cpf: "",
    phone: "",
    employment_status: NOT_SET,
    employment_other: "",
    uf: NOT_SET,
  });

  // Paleta de comandos (Ctrl+K) e menu lateral mobile
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Fecha o menu lateral ao trocar de página
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Só registra o módulo escolhido (estado + storage + evento). Sem navegar:
  // quem decide o destino é quem chamou (dashboard ou material de estudo).
  const definirModulo = (mod: "teorico" | "psicotecnico" | "direcao") => {
    setActiveModule(mod);
    localStorage.setItem("nexia:active_module", mod);
    window.dispatchEvent(new Event("nexia:active_module:change"));
    setActiveAdminSection(null);
  };

  const handleToggleModule = (mod: "teorico" | "psicotecnico" | "direcao") => {
    definirModulo(mod);
    if (typeof window !== "undefined" && window.location.pathname !== "/app") {
      navigate({ to: "/app" });
    }
  };

  // "Estudar" do menu: cai DIRETO no material de estudo da categoria escolhida
  // (galeria da biblioteca filtrada pelo módulo) — sem passar pelo dashboard.
  const irParaMaterial = (mod: "teorico" | "psicotecnico" | "direcao") => {
    definirModulo(mod);
    navigate({ to: "/biblioteca", search: { module_type: mod } });
  };

  const handleToggleSidebarExpand = () => {
    const newState = !sidebarExpanded;
    setSidebarExpanded(newState);
    localStorage.setItem(STORAGE_SIDEBAR_KEY, String(newState));
  };

  // ---------------------------------------------------------------------------
  // NAVEGAÇÃO — fonte única de ação (sidebar, menu mobile e paleta passam
  // por aqui). Só navegação/estado de UI; nenhuma regra de negócio.
  // ---------------------------------------------------------------------------
  const goHome = useCallback(() => {
    setActiveAdminSection(null);
    setActiveModule("hub");
    localStorage.removeItem("nexia:active_module");
    window.dispatchEvent(new Event("nexia:active_module:change"));
    if (pathname !== "/app") navigate({ to: "/app" });
  }, [navigate, pathname]);

  const openProfile = useCallback(() => {
    setProfileDraft({
      display_name: profile?.display_name ?? "",
      cpf: profile?.cpf ?? "",
      phone: profile?.phone ?? "",
      employment_status: profile?.employment_status ?? NOT_SET,
      employment_other: profile?.employment_other ?? "",
      uf: profile?.uf ?? NOT_SET,
    });
    setProfileEditing(false);
    setProfileDialogOpen(true);
  }, [profile]);

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
        case "subscription":
          setSubscriptionDialogOpen(true);
          break;
        case "profile":
          openProfile();
          break;
        case "schedule":
          setCronogramaOpen(true);
          break;
        case "signout":
          void signOut();
          break;
      }
    },
    [goHome, navigate, toggleTheme, signOut, openProfile, handleToggleModule],
  );

  const handleSaveProfile = async () => {
    const cpf = cleanCpf(profileDraft.cpf);
    const phone = cleanPhone(profileDraft.phone);
    const employmentStatus =
      profileDraft.employment_status === NOT_SET
        ? null
        : profileDraft.employment_status === "clt"
          ? "carteira_assinada"
          : profileDraft.employment_status;
    const uf = profileDraft.uf === NOT_SET ? null : profileDraft.uf;

    if (!profileDraft.display_name.trim()) {
      toast.error("Preencha seu nome completo.");
      return;
    }
    if (!isValidCpf(cpf)) {
      toast.error("CPF inválido. Verifique os números digitados.");
      return;
    }
    if (phone.length !== 10 && phone.length !== 11) {
      toast.error("Informe um telefone com DDD.");
      return;
    }
    if (!employmentStatus) {
      toast.error("Selecione sua situação profissional.");
      return;
    }
    if (
      profileDraft.employment_status === "outro" &&
      !profileDraft.employment_other.trim()
    ) {
      toast.error("Descreva sua situação profissional.");
      return;
    }
    if (uf && !isBrazilianUf(uf)) {
      toast.error("Selecione um estado válido.");
      return;
    }

    const updates = {
      display_name: profileDraft.display_name.trim().toUpperCase(),
      cpf,
      phone,
      employment_status: employmentStatus,
      employment_other:
        profileDraft.employment_status === "outro"
          ? profileDraft.employment_other.trim()
          : null,
      uf,
    };

    setProfileSaving(true);
    try {
      if (isMock) {
        if (!profile) {
          toast.error("Não foi possível carregar seu perfil.");
          return;
        }
        localStorage.setItem(
          "nexia:mock_profile",
          JSON.stringify({ ...profile, ...updates }),
        );
      } else {
        if (!user) {
          toast.error("Faça login novamente para atualizar seu perfil.");
          return;
        }
        const { error } = await supabase
          .from("profiles")
          .update(updates)
          .eq("id", user.id);
        if (error) {
          console.error("Erro ao atualizar perfil:", error);
          toast.error(
            error.code === "23505"
              ? "Este CPF já está cadastrado em outra conta."
              : "Não foi possível salvar seu perfil. Tente novamente.",
          );
          return;
        }
      }

      await refreshProfile();
      setProfileEditing(false);
      toast.success("Perfil atualizado.");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error("Não foi possível salvar seu perfil. Tente novamente.");
    } finally {
      setProfileSaving(false);
    }
  };

  const cancelProfileEditing = () => {
    setProfileDraft({
      display_name: profile?.display_name ?? "",
      cpf: profile?.cpf ?? "",
      phone: profile?.phone ?? "",
      employment_status: profile?.employment_status ?? NOT_SET,
      employment_other: profile?.employment_other ?? "",
      uf: profile?.uf ?? NOT_SET,
    });
    setProfileEditing(false);
  };

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

  // Query string atual, vinda do roteador (reage a navigate/replace sem reload).
  const searchStr = useRouterState({ select: (s) => s.location.searchStr });

  // Modo da página de placas (?ver=catalogo|simulado|adaptativo) — define qual
  // dos dois itens do menu fica aceso e o título/contexto da topbar.
  const verPlacas = useMemo(
    () => new URLSearchParams(searchStr).get("ver"),
    [searchStr],
  );
  const placasEmTreino = verPlacas === "simulado" || verPlacas === "adaptativo";
  const navContext =
    pathname === "/simulado" ||
    pathname === "/psicotecnico" ||
    pathname === "/conquistas" ||
    pathname === "/turbo" ||
    pathname === "/mais-caem" ||
    (pathname === "/placas" && placasEmTreino)
      ? "simulado"
      : pathname === "/biblioteca" ||
          pathname.startsWith("/biblioteca/") ||
          pathname === "/livro" ||
          pathname === "/placas" ||
          pathname === "/infracoes"
        ? "materiais"
        : undefined;

  // Seções completas: ESTUDAR + TREINAR + (Admin) + CONTA.
  // Estudar/Treinar seguem o módulo escolhido no Início (navSections).
  const sections = useMemo(() => {
    const base = navSections(activeModule).filter((section) => {
      if (navContext === "simulado") return section.id !== "estudar";
      if (navContext === "materiais") return section.id !== "treinar";
      return true;
    });
    if (isAdmin) {
      base.push({ id: "admin", label: "Admin", items: adminNavItems });
    }
    base.push(contaSection(supportLink));
    return base;
  }, [isAdmin, supportLink, adminNavItems, activeModule, navContext]);

  // Item ativo (pílula de vidro destacada)
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
    // Placas: dois itens do menu apontam para /placas — o query param decide
    // qual fica aceso (catálogo = aulas; quiz = simulados).
    if (pathname === "/placas") return verPlacas === "catalogo" || !verPlacas ? "placas-catalogo" : "placas-quiz";
    const flat = sections.flatMap((s) => s.items);
    const hit = flat.find((i) => i.action.kind === "link" && i.action.to === pathname);
    return hit?.id ?? null;
  }, [pathname, activeModule, activeAdminSection, searchStr, sections, verPlacas]);

  // Cabeçalho clicável das seções da sidebar (desktop): AULAS E MATERIAIS
  // leva às galerias do módulo escolhido; SIMULADOS leva ao simulado do
  // teórico ou aos joguinhos do psicotécnico. Demais seções seguem texto.
  const handleSectionClick = (sectionId: string) => {
    if (sectionId === "estudar") {
      if (activeModule !== "hub") irParaMaterial(activeModule);
      else navigate({ to: "/biblioteca" });
      return;
    }
    if (sectionId === "treinar") runAction(simuladosItem(activeModule));
  };

  const mobileMenuGroups = useMemo(
    () => sections.map((section) => ({ label: section.label, items: section.items })),
    [sections],
  );
  const tabBarActiveId = (() => {
    if (cronogramaOpen && activeModule === "teorico") return "cronograma";
    if (pathname === "/placas") return "placas-catalogo";
    if (pathname === "/psicotecnico") return "psicotecnico";
    if (navContext === "simulado") {
      return activeModule === "psicotecnico" ? "psicotecnico" : "simulado";
    }
    if (navContext === "materiais") return "aulas";
    if (pathname === "/app" && activeModule === "teorico") return "simulado";
    if (pathname === "/app" && activeModule === "direcao") return "inicio";
    return activeId;
  })();

  // Título/contexto da topbar (mesma semântica de antes)
  const pageTitle =
    pathname === "/app"
      ? activeModule === "psicotecnico"
        ? "Psicotécnico"
        : activeModule === "teorico"
          ? "Aulas da teoria"
          : activeModule === "direcao"
            ? "Direção Prática"
            : "Início"
      : pathname === "/biblioteca"
        ? "Galerias e biblioteca"
        : pathname === "/infracoes"
          ? "Infrações do CTB"
          : pathname === "/simulado"
            ? "Simulados"
            : pathname === "/conquistas"
              ? "Conquistas"
              : pathname === "/admin"
                ? "Admin"
                : pathname === "/placas"
                  ? placasEmTreino
                    ? "Treino de placas"
                    : "Guia de placas"
                  : pathname === "/turbo"
                    ? "Revisão Turbo"
                    : pathname === "/mais-caem"
                      ? "Questões que mais caem"
                      : pathname === "/livro"
                        ? "Resumos narrados"
                        : pathname === "/psicotecnico"
                          ? "Psicotécnico"
                          : "Nexia Drive";

  const pageEyebrow =
    pathname === "/app"
      ? "Área do aluno"
      : pathname === "/biblioteca" || pathname === "/livro"
        ? "Aulas e materiais"
        : pathname === "/infracoes"
          ? "Aulas e materiais"
          : pathname === "/placas"
            ? placasEmTreino
              ? "Simulados"
              : "Aulas e materiais"
            : pathname === "/simulado" ||
                pathname === "/psicotecnico" ||
                pathname === "/conquistas" ||
                pathname === "/turbo" ||
                pathname === "/mais-caem"
              ? "Simulados"
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
            onOpenMenu={() => setMobileMenuOpen(true)}
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
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="glass-pill flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
                  title={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>
                {user && (
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
                      <DropdownMenuItem
                        onClick={openProfile}
                        className="flex items-center gap-2 cursor-pointer rounded-xl"
                      >
                        <UserRound className="h-4 w-4" />
                        <span>Meu perfil</span>
                      </DropdownMenuItem>
                      {isActive && (
                        <>
                          {activeModule === "teorico" && (
                            <DropdownMenuItem
                              onClick={() => setCronogramaOpen(true)}
                              className="flex items-center gap-2 cursor-pointer rounded-xl"
                            >
                              <Calendar className="h-4 w-4" />
                              <span>Meu Cronograma</span>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => triggerRatingPrompt("manual")}
                            className="flex items-center gap-2 cursor-pointer rounded-xl"
                          >
                            <Star className="h-4 w-4" />
                            Avaliar o app
                          </DropdownMenuItem>
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
                        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        {theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
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
                )}
              </div>
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
        {pathname === "/app" && activeModule === "teorico" && <DailyCheckinBanner />}
        {activeModule === "teorico" && (
          <CronogramaModal open={cronogramaOpen} onOpenChange={setCronogramaOpen} />
        )}

        {/* Botão WhatsApp — discreto, em vidro, fora da tela do simulado */}
        {showSupportButton && supportLink && pathname !== "/simulado" && (
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

        {/* Main Content — o simulado gerencia o próprio espaço (altura fixa). */}
        <main
          className={`flex-1 min-w-0 pb-28 ${pathname === "/simulado" ? "lg:pb-0" : "lg:pb-10"}`}
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

      <GlassSheet
        open={mobileMenuOpen && showChrome}
        title="Menu principal"
        groups={mobileMenuGroups}
        placement="left"
        activeId={activeId}
        onClose={() => setMobileMenuOpen(false)}
        onNavigate={(item) => {
          setMobileMenuOpen(false);
          runAction(item);
        }}
      />

      <Dialog open={subscriptionDialogOpen} onOpenChange={setSubscriptionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Minha assinatura</DialogTitle>
            <DialogDescription>
              Consulte o status e a validade do seu acesso ao Nexia Drive.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">Status</span>
              <span className={`text-sm font-semibold ${
                profile?.status === "ativo" && !isProfileExpired(profile)
                  ? "text-success"
                  : "text-warning"
              }`}>
                {!profile
                  ? "Indisponível"
                  : profile.status === "ativo" && !isProfileExpired(profile)
                    ? "Ativa"
                    : profile.status === "ativo"
                      ? "Expirada"
                      : "Pendente"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">Validade</span>
              <span className="text-right text-sm font-medium">
                {profile?.expires_at
                  ? new Date(profile.expires_at).toLocaleDateString("pt-BR")
                  : profile?.status === "ativo"
                    ? "Sem data limite"
                    : "Não definida"}
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={profileDialogOpen}
        onOpenChange={(open) => {
          setProfileDialogOpen(open);
          if (!open) setProfileEditing(false);
        }}
      >
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Meu perfil</DialogTitle>
            <DialogDescription>
              Confira seus dados de cadastro. O e-mail é somente para consulta.
            </DialogDescription>
          </DialogHeader>
          {profile ? (
            profileEditing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="profile-name">Nome completo</Label>
                  <Input
                    id="profile-name"
                    value={profileDraft.display_name}
                    onChange={(event) =>
                      setProfileDraft({
                        ...profileDraft,
                        display_name: event.target.value,
                      })
                    }
                    autoComplete="name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-email">E-mail</Label>
                  <Input
                    id="profile-email"
                    value={profile.email ?? user?.email ?? ""}
                    readOnly
                    aria-readonly="true"
                  />
                  <p className="text-xs text-muted-foreground">
                    O e-mail não pode ser alterado por aqui.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-cpf">CPF</Label>
                  <Input
                    id="profile-cpf"
                    value={formatCpf(profileDraft.cpf)}
                    onChange={(event) =>
                      setProfileDraft({
                        ...profileDraft,
                        cpf: cleanCpf(event.target.value),
                      })
                    }
                    inputMode="numeric"
                    maxLength={14}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-phone">Telefone / WhatsApp</Label>
                  <Input
                    id="profile-phone"
                    value={formatPhone(profileDraft.phone)}
                    onChange={(event) =>
                      setProfileDraft({
                        ...profileDraft,
                        phone: cleanPhone(event.target.value),
                      })
                    }
                    inputMode="tel"
                    autoComplete="tel"
                    maxLength={15}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-employment">Situação profissional</Label>
                  <Select
                    value={profileDraft.employment_status}
                    onValueChange={(value) =>
                      setProfileDraft({
                        ...profileDraft,
                        employment_status: value,
                      })
                    }
                  >
                    <SelectTrigger id="profile-employment" className="w-full">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NOT_SET}>Não informado</SelectItem>
                      {profileDraft.employment_status === "clt" && (
                        <SelectItem value="clt">CLT (cadastro anterior)</SelectItem>
                      )}
                      {PROFILE_EMPLOYMENT_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {profileDraft.employment_status === "outro" && (
                  <div className="space-y-2">
                    <Label htmlFor="profile-employment-other">Descreva sua situação</Label>
                    <Input
                      id="profile-employment-other"
                      value={profileDraft.employment_other}
                      onChange={(event) =>
                        setProfileDraft({
                          ...profileDraft,
                          employment_other: event.target.value,
                        })
                      }
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="profile-uf">Estado onde pretende fazer a prova</Label>
                  <Select
                    value={profileDraft.uf}
                    onValueChange={(value) =>
                      setProfileDraft({ ...profileDraft, uf: value })
                    }
                  >
                    <SelectTrigger id="profile-uf" className="w-full">
                      <SelectValue placeholder="Selecione seu estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NOT_SET}>Não informar agora</SelectItem>
                      {BRAZILIAN_STATES.map((state) => (
                        <SelectItem key={state.uf} value={state.uf}>
                          {state.uf} — {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ["Nome completo", profile.display_name || "Não informado"],
                  ["E-mail", profile.email ?? user?.email ?? "Não informado"],
                  ["CPF", profile.cpf ? formatCpf(profile.cpf) : "Não informado"],
                  ["Telefone / WhatsApp", profile.phone ? formatPhone(profile.phone) : "Não informado"],
                  [
                    "Situação profissional",
                    getEmploymentLabel(profile.employment_status, profile.employment_other),
                  ],
                  [
                    "Estado da prova",
                    profile.uf
                      ? `${profile.uf} — ${BRAZILIAN_STATES.find((state) => state.uf === profile.uf)?.name ?? ""}`.trim()
                      : "Não informado",
                  ],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-border/30 bg-background/30 p-3">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="mt-1 break-words text-sm font-medium">{value}</p>
                  </div>
                ))}
              </div>
            )
          ) : (
            <p className="text-sm text-muted-foreground">
              Não foi possível carregar seus dados de perfil.
            </p>
          )}
          <DialogFooter>
            {profileEditing ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={cancelProfileEditing}
                  disabled={profileSaving}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={profileSaving}
                >
                  {profileSaving ? "Salvando..." : "Salvar alterações"}
                </Button>
              </>
            ) : (
              <Button
                type="button"
                onClick={() => setProfileEditing(true)}
                disabled={!profile}
              >
                Editar dados
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showChrome && (
        <GlassTabBar
          items={tabBarItems(activeModule)}
          activeId={tabBarActiveId}
          onTab={runAction}
        />
      )}

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
