import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { getExpiryDate } from "@/lib/subscription";

export const Route = createFileRoute("/api/pix/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          // EFI Pay webhook verification handshake or payload
          let body: any = {};
          try {
            body = await request.json();
          } catch (e) {
            // If body is empty or not JSON, just return 200 for validation handshake
            return new Response(JSON.stringify({ ok: true, message: "Handshake received" }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          console.log("Recebido Webhook Pix da EFI Pay:", JSON.stringify(body));

          // EFI Pix webhook structure: body.pix contains an array of received payments
          const pixList = body.pix || [];
          
          for (const item of pixList) {
            const txid = item.txid;
            if (txid) {
              console.log(`Confirmando pagamento para txid: ${txid} via Webhook`);

              // 1. Find user_id from txid
              const { data: tx, error: txErr } = await supabaseAdmin
                .from("pix_transactions")
                .select("user_id, status, plan_type")
                .eq("txid", txid)
                .single();

              if (!txErr && tx) {
                // 2. Update transaction status
                await supabaseAdmin
                  .from("pix_transactions")
                  .update({ status: "CONCLUIDA", updated_at: new Date().toISOString() })
                  .eq("txid", txid);

                // 3. Update user status to active
                await supabaseAdmin
                  .from("profiles")
                  .update({
                    status: "ativo",
                    expires_at: getExpiryDate(tx.plan_type).toISOString(),
                    updated_at: new Date().toISOString(),
                  })
                  .eq("id", tx.user_id);
                  
                console.log(`Usuário ${tx.user_id} ativado com sucesso.`);
              } else {
                console.warn(`Transação com txid ${txid} não encontrada no banco.`);
              }
            }
          }

          // EFI expects status 200 response to acknowledge receipt
          return new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });

        } catch (err) {
          console.error("Erro no handler webhook /api/pix/webhook:", err);
          // Return 200 even on error so EFI doesn't block the webhook, or 500 to retry
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
