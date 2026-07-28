import { createFileRoute } from "@tanstack/react-router";
import { getPixChargeStatus, isEfiConfigured } from "@/lib/efi-pay.server";
import { getExpiryDate } from "@/lib/subscription";

function isSupabaseConfigured(): boolean {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export const Route = createFileRoute("/api/pix/status")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const txid = url.searchParams.get("txid");

          if (!txid) {
            return new Response(JSON.stringify({ error: "Missing txid parameter." }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          // For mock/simulated transactions, return paid immediately (only in sandbox)
          if (txid.startsWith("mock_") || txid.startsWith("sim_")) {
            const { isSandbox } = await import("@/lib/efi-pay.server");
            if (!isSandbox()) {
              return new Response(JSON.stringify({ status: "ATIVA", error: "Simulação não permitida em produção." }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
              });
            }
            return new Response(JSON.stringify({ status: "CONCLUIDA" }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          let currentStatus = "ATIVA";

          // Try DB lookup
          if (isSupabaseConfigured()) {
            try {
              const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

              const { data: tx, error: txErr } = await supabaseAdmin
                .from("pix_transactions")
                .select("status, user_id, plan_type")
                .eq("txid", txid)
                .single();

              if (!txErr && tx) {
                currentStatus = tx.status;

                if (currentStatus === "ATIVA" && isEfiConfigured()) {
                  try {
                    const efiStatus = await getPixChargeStatus(txid);
                    if (efiStatus === "CONCLUIDA" || efiStatus === "paid") {
                      currentStatus = "CONCLUIDA";
                      await supabaseAdmin
                        .from("pix_transactions")
                        .update({ status: "CONCLUIDA", updated_at: new Date().toISOString() })
                        .eq("txid", txid);
                      await supabaseAdmin
                        .from("profiles")
                        .update({
                          status: "ativo",
                          expires_at: getExpiryDate(tx.plan_type).toISOString(),
                          updated_at: new Date().toISOString(),
                        })
                        .eq("id", tx.user_id);
                    }
                  } catch (efiErr) {
                    console.error("Erro ao verificar status na EFI Pay:", efiErr);
                  }
                }
              }
            } catch (dbErr) {
              console.warn("Supabase admin não disponível:", (dbErr as Error).message);
            }
          }

          return new Response(JSON.stringify({ status: currentStatus }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });

        } catch (err) {
          console.error("Erro no handler /api/pix/status:", err);
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
