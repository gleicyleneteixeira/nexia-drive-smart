import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { X, MessageCircle, ExternalLink, Users } from "lucide-react";

type GroupKey = "whatsapp" | "tiktok";

type GroupConfig = {
  linkKey: string;
  showKey: string;
  title: string;
  description: string;
  badge: string;
};

const GROUP_KEYS: GroupKey[] = ["whatsapp", "tiktok"];

const GROUP_CONFIG: Record<GroupKey, GroupConfig> = {
  whatsapp: {
    linkKey: "whatsapp_group_link",
    showKey: "show_group_popup",
    title: "Faça parte da nossa Comunidade de Alunos!",
    description:
      "Tire dúvidas, receba dicas exclusivas e acompanhe novidades do simulador Nexia Drive diretamente no grupo.",
    badge: "Comunidade no WhatsApp",
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

export function GroupPopups({ userId, groupStatus }: { userId: string; groupStatus: string | null }) {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [dismissed, setDismissed] = useState<Partial<Record<GroupKey, boolean>>>({});
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

  if (!pendingGroup) return null;

  const cfg = GROUP_CONFIG[pendingGroup];
  const link = settings[cfg.linkKey];

  async function markJoined() {
    if (pendingGroup === "whatsapp") {
      await supabase.from("profiles").update({ group_status: "joined" }).eq("id", userId);
      setDismissed((d) => ({ ...d, whatsapp: true }));
    } else {
      localStorage.setItem("nexia:tiktok_group_joined", "true");
      setTiktokJoined(true);
    }
  }

  async function openGroup() {
    window.open(link, "_blank");
    await markJoined();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-card rounded-2xl p-6 max-w-md w-full shadow-xl border relative animate-in fade-in zoom-in duration-200">
        <button onClick={() => setDismissed((d) => ({ ...d, [pendingGroup]: true }))} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground">
          <X className="h-5 w-5" />
        </button>
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center mx-auto">
            {pendingGroup === "whatsapp" ? (
              <MessageCircle className="h-6 w-6 text-success" />
            ) : (
              <Users className="h-6 w-6 text-success" />
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
              <ExternalLink className="h-4 w-4" /> Entrar no Grupo
            </Button>
            <Button variant="outline" className="w-full" onClick={markJoined}>
              Já sou membro
            </Button>
            <button
              onClick={() => setDismissed((d) => ({ ...d, [pendingGroup]: true }))}
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
