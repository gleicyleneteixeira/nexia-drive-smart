// Integração ViperConnect / Uno API para envio de mensagens de boas-vindas via WhatsApp.
// Tudo roda no servidor (service_role) para nunca expor o token ao cliente.

interface ViperConnectSettings {
  api_url: string;
  token: string;
  instance_id: string;
  welcome_enabled: string;
  welcome_message: string;
  welcome_media_url: string;
}

const VIPER_KEYS = [
  "viperconnect_api_url",
  "viperconnect_token",
  "viperconnect_instance_id",
  "viperconnect_welcome_enabled",
  "viperconnect_welcome_message",
  "viperconnect_welcome_media_url",
] as const;

export async function getViperConnectSettings(): Promise<ViperConnectSettings> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("system_settings")
    .select("key, value")
    .in("key", VIPER_KEYS as unknown as string[]);
  if (error) throw new Error(error.message);
  const map = Object.fromEntries((data ?? []).map((r) => [r.key, r.value ?? ""]));
  return {
    api_url: map.viperconnect_api_url ?? "",
    token: map.viperconnect_token ?? "",
    instance_id: map.viperconnect_instance_id ?? "",
    welcome_enabled: map.viperconnect_welcome_enabled ?? "false",
    welcome_message:
      map.viperconnect_welcome_message ??
      "Olá {nome}! Seja muito bem-vindo(a) ao Nexia Drive. Seu acesso já está liberado! 🚀",
    welcome_media_url: map.viperconnect_welcome_media_url ?? "",
  };
}

// Normaliza um número de telefone para o formato esperado pela API (dígitos, com DDI 55).
export function normalizePhone(raw: string): string {
  let digits = (raw || "").replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  if (digits.length === 10) digits = "55" + digits; // fixo sem DDI
  if (digits.length === 11 && !digits.startsWith("55")) digits = "55" + digits;
  return digits;
}

export interface DispatchResult {
  ok: boolean;
  status?: number;
  error?: string;
}

// Envia a mensagem de boas-vindas. O texto suporta o placeholder {nome}.
// ⚠️ O formato exato da chamada (endpoint, header de auth e body) deve ser
// confirmado com a documentação da ViperConnect / Uno API — ajuste os pontos
// marcados abaixo conforme o contrato real da sua instância.
export async function dispatchViperConnectWelcome(
  phone: string,
  name: string
): Promise<DispatchResult> {
  const s = await getViperConnectSettings();

  if (s.welcome_enabled !== "true") {
    return { ok: false, error: "Envio de boas-vindas desativado nas configurações." };
  }
  if (!s.api_url || !s.token) {
    return { ok: false, error: "ViperConnect não configurado (URL ou token ausente)." };
  }

  const to = normalizePhone(phone);
  if (!to) return { ok: false, error: "Número de telefone inválido." };

  const message = (s.welcome_message || "Olá {nome}!").replace(/\{nome\}/gi, name || "aluno(a)");

  // ───────────────────────────────────────────────────────────────────────────
  // CONFIRMAR COM A DOCUMENTAÇÃO DA VI PERCONNECT / UNO API:
  //  - URL completa do endpoint (abaixo é um palpite comum: /message/sendText)
  //  - header de autenticação (Bearer, apikey ou instância em query string)
  //  - campos do body (phone, instance, message, media)
  // ───────────────────────────────────────────────────────────────────────────
  const endpoint = `${s.api_url.replace(/\/$/, "")}/message/sendText`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${s.token}`,
  };
  const body: Record<string, unknown> = {
    instance: s.instance_id,
    phone: to,
    message,
  };
  if (s.welcome_media_url) {
    body.mediaUrl = s.welcome_media_url;
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    const text = await res.text().catch(() => "");
    if (!res.ok) {
      console.error("Erro ViperConnect:", res.status, text);
      return { ok: false, status: res.status, error: `Falha ${res.status}: ${text.slice(0, 200)}` };
    }
    return { ok: true, status: res.status };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro de rede";
    console.error("Erro ao chamar ViperConnect:", msg);
    return { ok: false, error: msg };
  }
}
