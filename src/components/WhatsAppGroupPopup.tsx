import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { X, MessageCircle, ExternalLink, Users, Gift, PartyPopper } from "lucide-react";

type GroupKey = "whatsapp" | "tiktok";

type GroupConfig = {
  linkKey: string;
  showKey: string;
  title: string;
  description: string;
  badge: string;
};

const GROUP_KEYS: GroupKey[] = ["whatsapp", "tiktok"];

// Depois que a pessoa clica "Agora não", o popup só reaparece após este intervalo
const DISMISS_COOLDOWN_MS = 3 * 24 * 60 * 60 * 1000;

function getDismissedAt(key: GroupKey): number | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(`nexia:group_dismissed_at:${key}`);
  const n = raw ? Number(raw) : 0;
  return n > 0 ? n : null;
}

function setDismissedAt(key: GroupKey) {
  if (typeof window === "undefined") return;
  localStorage.setItem(`nexia:group_dismissed_at:${key}`, String(Date.now()));
}

const GROUP_CONFIG: Record<GroupKey, GroupConfig> = {
  whatsapp: {
    linkKey: "whatsapp_group_link",
    showKey: "show_group_popup",
    title: "Você foi convidado! Você está convidado a participar do nosso grupo exclusivo de primeiros condutores!",
    description:
      "Um grupo para você trocar experiências, tirar dúvidas e conversar com outras pessoas que estão passando pelo mesmo que você: a primeira habilitação. Não é um grupo grande — os alunos vão entrando e saindo conforme passam na prova — mas todo mundo que comprou o simulador pode participar. Vem com a gente!",
    badge: "Grupo exclusivo de primeiros condutores",
  },
  tiktok: {
    linkKey: "tiktok_group_link",
    showKey: "show_tiktok_popup",
    title: "Participe do nosso Grupo de Conversa!",
    description:
      "Converse com outros alunos, troque experiências e fique por dentro das novidades e dicas do Nexia Drive.",
    badge: "Grupo de Conversa",
  },
};

export function GroupPopups({ userId, groupStatus, onDone, onVisibleChange }: {
  userId: string;
  groupStatus: string | null;
  onDone?: () => void;
  onVisibleChange?: (visible: boolean) => void;
}) {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [dismissed, setDismissed] = useState<Partial<Record<GroupKey, boolean>>>(() => {
    const now = Date.now();
    const out: Partial<Record<GroupKey, boolean>> = {};
    for (const key of GROUP_KEYS) {
      const at = getDismissedAt(key);
      if (at && now - at < DISMISS_COOLDOWN_MS) out[key] = true;
    }
    return out;
  });
  const [tiktokJoined, setTiktokJoined] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("nexia:tiktok_group_joined") === "true";
    }
    return false;
  });

  useEffect(() => {
    supabase.from("app_settings").select("key, value").then(({ data }) => {
      if (data) {
        setSettings(Object.fromEntries(data.map((r) => [r.key, r.value])));
      }
    });
  }, []);

  const pendingGroup = GROUP_KEYS.find((key) => {
    if (dismissed[key]) return false;
    const cfg = GROUP_CONFIG[key];
    if (settings[cfg.showKey] === "false") return false;
    if (!settings[cfg.linkKey]) return false;
    if (key === "whatsapp" && groupStatus === "joined") return false;
    if (key === "tiktok" && tiktokJoined) return false;
    return true;
  });

  useEffect(() => {
    onVisibleChange?.(!!pendingGroup);
  }, [pendingGroup, onVisibleChange]);

  if (!pendingGroup) return null;

  const activeGroup: GroupKey = pendingGroup;
  const cfg = GROUP_CONFIG[activeGroup];
  const link = settings[cfg.linkKey];

  async function markJoined() {
    if (activeGroup === "whatsapp") {
      await supabase.from("profiles").update({ group_status: "joined" }).eq("id", userId);
      setDismissed((d) => ({ ...d, whatsapp: true }));
    } else {
      localStorage.setItem("nexia:tiktok_group_joined", "true");
      setTiktokJoined(true);
    }
    onDone?.();
  }

  async function openGroup() {
    window.open(link, "_blank");
    await markJoined();
  }

  function dismiss() {
    setDismissedAt(activeGroup);
    setDismissed((d) => ({ ...d, [activeGroup]: true }));
    onDone?.();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-card rounded-2xl p-6 max-w-md w-full shadow-xl border relative animate-in fade-in zoom-in duration-200">
        <button onClick={dismiss} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground">
          <X className="h-5 w-5" />
        </button>
        <div className="space-y-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-success to-emerald-600 flex items-center justify-center mx-auto shadow-lg">
            {activeGroup === "whatsapp" ? (
              <Gift className="h-7 w-7 text-white" />
            ) : (
              <Users className="h-7 w-7 text-white" />
            )}
          </div>
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/30 text-[10px] font-bold text-primary mb-2">
              {cfg.badge}
            </span>
            <h2 className="font-display font-bold text-lg">{cfg.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">{cfg.description}</p>
          </div>
          <div className="space-y-2 pt-2">
            <Button className="w-full gap-2" onClick={openGroup}>
              <PartyPopper className="h-4 w-4" /> Quero participar
            </Button>
            <Button variant="outline" className="w-full" onClick={markJoined}>
              Já sou membro
            </Button>
            <button
              onClick={dismiss}
              className="w-full text-xs text-muted-foreground hover:text-foreground py-2"
            >
              Agora não
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
