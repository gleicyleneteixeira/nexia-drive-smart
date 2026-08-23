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

// Depois que a pessoa clica "Lembrar mais tarde", o popup só reaparece após este intervalo
const DISMISS_COOLDOWN_MS = 3 * 24 * 60 * 60 * 1000;
const REMIND_LATER_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24h

const REMIND_LATER_KEY = "nexia_whatsapp_reminder_time";

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

type WhatsappInviteStatus = "pending" | "joined" | "dismissed" | "later";

// Status persistido no banco (whatsapp_invite_status):
//  - 'pending'   -> ainda não respondeu, o modal pode ser exibido
//  - 'joined'    -> entrou no grupo, nunca mais exibir
//  - 'dismissed' -> recusou permanentemente, nunca mais exibir
//  - 'later'     -> adiou; só reaparece após o cooldown (whatsapp_invite_later_at)
function getWhatsappShouldShow(
  status: string | null,
  laterAt: string | null,
  legacyGroupStatus: string | null,
): boolean {
  if (legacyGroupStatus === "joined") return false;
  if (status === "joined" || status === "dismissed") return false;

  // Cooldown legado (localStorage) de quem clicou "Agora não" na versão antiga
  const legacyAt = getDismissedAt("whatsapp");
  if (legacyAt && Date.now() - legacyAt < DISMISS_COOLDOWN_MS) return false;

  if (status === "later") {
    const at = laterAt ? new Date(laterAt).getTime() : 0;
    return at > 0 ? Date.now() - at >= DISMISS_COOLDOWN_MS : false;
  }

  return true;
}

export function GroupPopups({
  userId,
  whatsappInviteStatus,
  laterAt,
  groupStatus,
  onDone,
  onVisibleChange,
}: {
  userId: string;
  whatsappInviteStatus: string | null;
  laterAt: string | null;
  groupStatus: string | null;
  onDone?: () => void;
  onVisibleChange?: (visible: boolean) => void;
}) {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [dismissed, setDismissed] = useState<Partial<Record<GroupKey, boolean>>>(() => {
    const now = Date.now();
    const at = getDismissedAt("tiktok");
    const out: Partial<Record<GroupKey, boolean>> = {};
    if (at && now - at < DISMISS_COOLDOWN_MS) out.tiktok = true;
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
    if (key === "whatsapp") {
      // Check 24h "Lembrar mais tarde" cooldown from localStorage
      const remindAt = localStorage.getItem(REMIND_LATER_KEY);
      if (remindAt && Date.now() < Number(remindAt)) return false;
      return getWhatsappShouldShow(whatsappInviteStatus, laterAt, groupStatus);
    }
    if (tiktokJoined) return false;
    return true;
  });

  useEffect(() => {
    onVisibleChange?.(!!pendingGroup);
  }, [pendingGroup, onVisibleChange]);

  if (!pendingGroup) return null;

  const activeGroup: GroupKey = pendingGroup;
  const cfg = GROUP_CONFIG[activeGroup];
  const link = settings[cfg.linkKey];

  async function setWhatsappInviteStatus(status: WhatsappInviteStatus) {
    const patch: {
      whatsapp_invite_status: WhatsappInviteStatus;
      whatsapp_invite_later_at?: string;
    } = { whatsapp_invite_status: status };
    if (status === "later") {
      patch.whatsapp_invite_later_at = new Date().toISOString();
    }
    localStorage.removeItem("nexia:group_dismissed_at:whatsapp");
    await supabase.from("profiles").update(patch).eq("id", userId);
  }

  function handleJoinClick() {
    if (activeGroup === "whatsapp") {
      setWhatsappInviteStatus("joined");
      setDismissed((d) => ({ ...d, whatsapp: true }));
    } else {
      localStorage.setItem("nexia:tiktok_group_joined", "true");
      setTiktokJoined(true);
    }
    onDone?.();
  }

  async function markJoined() {
    if (activeGroup === "whatsapp") {
      await setWhatsappInviteStatus("joined");
      setDismissed((d) => ({ ...d, whatsapp: true }));
    } else {
      localStorage.setItem("nexia:tiktok_group_joined", "true");
      setTiktokJoined(true);
    }
    onDone?.();
  }

  async function remindLater() {
    if (activeGroup === "whatsapp") {
      await setWhatsappInviteStatus("later");
      localStorage.setItem(REMIND_LATER_KEY, String(Date.now() + REMIND_LATER_COOLDOWN_MS));
      setDismissed((d) => ({ ...d, whatsapp: true }));
    } else {
      setDismissedAt(activeGroup);
      setDismissed((d) => ({ ...d, [activeGroup]: true }));
    }
    onDone?.();
  }

  async function refusePermanently() {
    if (activeGroup === "whatsapp") {
      await setWhatsappInviteStatus("dismissed");
      setDismissed((d) => ({ ...d, whatsapp: true }));
    } else {
      setDismissedAt(activeGroup);
      setDismissed((d) => ({ ...d, [activeGroup]: true }));
    }
    onDone?.();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-card rounded-2xl p-6 max-w-md w-full shadow-xl border relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={remindLater}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
        >
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
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleJoinClick}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-bold text-primary-foreground shadow hover:bg-primary/90 transition"
            >
              {activeGroup === "whatsapp" ? (
                <>
                  <ExternalLink className="h-4 w-4" /> Entrar no Grupo
                </>
              ) : (
                <>
                  <PartyPopper className="h-4 w-4" /> Quero participar
                </>
              )}
            </a>
            <Button variant="outline" className="w-full" onClick={markJoined}>
              Já sou membro
            </Button>
            {activeGroup === "whatsapp" ? (
              <>
                <button
                  onClick={remindLater}
                  className="w-full text-xs text-muted-foreground hover:text-foreground py-2"
                >
                  Lembrar mais tarde
                </button>
                <button
                  onClick={refusePermanently}
                  className="w-full text-xs text-destructive/80 hover:text-destructive py-2"
                >
                  Não quero participar
                </button>
              </>
            ) : (
              <button
                onClick={remindLater}
                className="w-full text-xs text-muted-foreground hover:text-foreground py-2"
              >
                Agora não
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
