import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { X, MessageCircle, ExternalLink } from "lucide-react";

type Settings = {
  whatsapp_group_link: string;
  show_group_popup: string;
  show_whatsapp_button: string;
};

export function WhatsAppGroupPopup({ userId, groupStatus }: { userId: string; groupStatus: string | null }) {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    supabase.from("app_settings").select("key, value").then(({ data }) => {
      if (data) {
        setSettings(Object.fromEntries(data.map((r) => [r.key, r.value])) as Settings);
      }
    });
  }, []);

  if (!settings) return null;

  const showPopup = settings.show_group_popup === "true";
  const isMember = groupStatus === "joined";
  const link = settings.whatsapp_group_link;

  async function markJoined() {
    await supabase.from("profiles").update({ group_status: "joined" }).eq("id", userId);
    setDismissed(true);
  }

  async function openGroup() {
    window.open(link, "_blank");
    await markJoined();
  }

  if (showPopup && !isMember && !dismissed) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="bg-card rounded-2xl p-6 max-w-md w-full shadow-xl border relative animate-in fade-in zoom-in duration-200">
          <button onClick={() => setDismissed(true)} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center mx-auto">
              <MessageCircle className="h-6 w-6 text-success" />
            </div>
            <div className="text-center">
              <h2 className="font-display font-bold text-lg">Faça parte da nossa Comunidade de Alunos!</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Tire dúvidas, receba dicas exclusivas e acompanhe novidades do simulador Nexia Drive diretamente no grupo.
              </p>
            </div>
            <div className="space-y-2 pt-2">
              <Button className="w-full gap-2" onClick={openGroup}>
                <ExternalLink className="h-4 w-4" /> Entrar no Grupo
              </Button>
              <Button variant="outline" className="w-full" onClick={markJoined}>
                Já sou membro
              </Button>
              <button onClick={() => setDismissed(true)} className="w-full text-xs text-muted-foreground hover:text-foreground py-2">
                Agora não
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
