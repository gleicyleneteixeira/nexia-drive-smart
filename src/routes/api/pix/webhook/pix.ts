import { createFileRoute } from "@tanstack/react-router";
import { handlePixWebhook } from "@/lib/pix-webhook-handler";

// A EFI envia callbacks para a URL cadastrada + "/pix". Sem o "?ignorar=" no
// cadastro, as notificações chegam em /api/pix/webhook/pix.
export const Route = createFileRoute("/api/pix/webhook/pix")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        return handlePixWebhook(request);
      },
    },
  },
});
