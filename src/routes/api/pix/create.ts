import { createFileRoute } from "@tanstack/react-router";
import { createPixCharge, isEfiConfigured } from "@/lib/efi-pay.server";

function isSupabaseConfigured(): boolean {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export const Route = createFileRoute("/api/pix/create")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const { userId, planType, amount } = body;

          if (!userId || !planType || !amount) {
            return new Response(JSON.stringify({ error: "Missing required fields." }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          let profileName = "Cliente Nexia";
          let profileCpf = "";

          // Try to load Supabase admin for profile lookup
          if (isSupabaseConfigured()) {
            try {
              const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

              const { data: profile, error: profileErr } = await supabaseAdmin
                .from("profiles")
                .select("display_name, cpf")
                .eq("id", userId)
                .single();

              if (!profileErr && profile) {
                profileName = profile.display_name || "Cliente Nexia";
                profileCpf = profile.cpf || "";
              }
            } catch (dbErr) {
              console.warn("Erro ao buscar perfil:", (dbErr as Error).message);
            }
          } else {
            console.warn("Supabase admin não configurado — usando dados de simulação.");
          }

          // 1. Call EFI Pay (or generate mock if not configured)
          const pix = await createPixCharge({
            amount,
            cpf: profileCpf,
            name: profileName,
          });

          // 2. Try to save transaction to database
          if (isSupabaseConfigured()) {
            try {
              const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
              await supabaseAdmin
                .from("pix_transactions")
                .insert({
                  user_id: userId,
                  txid: pix.txid,
                  amount: amount,
                  plan_type: planType,
                  status: "ATIVA",
                  pix_copia_e_cola: pix.pixCopiaECola,
                  qrcode_base64: pix.qrcodeBase64,
                });
            } catch (saveErr) {
              console.warn("Não foi possível salvar transação:", (saveErr as Error).message);
            }
          }

          return new Response(JSON.stringify({
            txid: pix.txid,
            pixCopiaECola: pix.pixCopiaECola,
            qrcodeBase64: pix.qrcodeBase64,
          }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });

        } catch (err) {
          console.error("Erro no handler /api/pix/create:", err);
          return new Response(JSON.stringify({ 
            error: err instanceof Error ? err.message : "Internal Server Error" 
          }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
