import { createFileRoute } from "@tanstack/react-router";
import { handlePixWebhook } from "@/lib/pix-webhook-handler";

export const Route = createFileRoute("/api/pix/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        return handlePixWebhook(request);
      },
    },
  },
});
