// Serviço centralizado de Webhook global de eventos do sistema.
// Dispara uma requisição POST (fire & forget) para a URL configurada em
// system_settings sempre que eventos relevantes acontecerem na plataforma.
//
// Em contexto de servidor (ex: webhook da EfiPay) usa o service_role para
// contornar o RLS; no cliente (cadastro, reset de senha) usa o client comum,
// que consegue ler apenas as duas chaves do webhook (policy "Public read webhook settings").

export type SystemEventType =
  | "USER_CREATED"
  | "PASSWORD_RESET_REQUESTED"
  | "PAYMENT_APPROVED"
  | "PAYMENT_FAILED"
  | "PAYMENT_REFUSED"
  | "TEST_COMPLETED";

interface WebhookUser {
  id?: string;
  email?: string;
  name?: string;
  phone?: string;
  cpf?: string;
}

interface WebhookPayload {
  event: SystemEventType;
  timestamp: string;
  user: WebhookUser;
  data?: Record<string, unknown>;
}

async function loadWebhookConfig(): Promise<{ url?: string; enabled: boolean }> {
  const keys = ["global_webhook_url", "global_webhook_enabled"] as const;

  if (typeof window === "undefined") {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("system_settings")
      .select("key, value")
      .in("key", keys as unknown as string[]);
    const map = Object.fromEntries((data ?? []).map((r) => [r.key, r.value ?? ""]));
    return {
      url: map.global_webhook_url || undefined,
      enabled: map.global_webhook_enabled === "true",
    };
  }

  const { supabase } = await import("@/integrations/supabase/client");
  const { data } = await supabase
    .from("system_settings")
    .select("key, value")
    .in("key", keys as unknown as string[]);
  const map = Object.fromEntries((data ?? []).map((r) => [r.key, r.value ?? ""]));
  return {
    url: map.global_webhook_url || undefined,
    enabled: map.global_webhook_enabled === "true",
  };
}

export async function triggerWebhook(
  event: SystemEventType,
  userData: WebhookUser,
  extraData?: Record<string, unknown>,
) {
  try {
    const { url, enabled } = await loadWebhookConfig();

    if (!enabled || !url) return;

    const payload: WebhookPayload = {
      event,
      timestamp: new Date().toISOString(),
      user: userData,
      data: extraData || {},
    };

    // Fire & forget: não bloqueia a interface nem o fluxo do servidor.
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).catch((err) => console.error("Erro ao disparar Webhook:", err));
  } catch (error) {
    console.error("Falha ao processar triggerWebhook:", error);
  }
}
