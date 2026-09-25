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

// Envio genérico no contrato OFICIAL ViperConnect (formato WhatsApp Cloud API):
//   POST {api_url}/v15.0/{SESSAO}/messages
//   Header: Authorization: <UNOAPI_AUTH_TOKEN> (token puro, sem "Bearer")
//   Body: { messaging_product, to, type, text/image }
// Fonte: README + guia de desenvolvimento oficiais do ViperConnect.
export interface SendWhatsAppArgs {
  /** WhatsApp do destinatário (qualquer formato — normalizado p/ dígitos c/ DDI). */
  to: string;
  /** Texto da mensagem (ou legenda, se houver imagem). */
  body: string;
  /** URL pública de imagem (opcional — envia como imagem com legenda). */
  imageUrl?: string;
}

export async function sendWhatsAppMessage({ to, body, imageUrl }: SendWhatsAppArgs): Promise<DispatchResult> {
  const s = await getViperConnectSettings();

  if (!s.api_url || !s.token) {
    return { ok: false, error: "ViperConnect não configurado (URL ou token ausente). Ajuste em Admin → Configurações → WhatsApp." };
  }
  // {SESSAO} = número do WhatsApp conectado (só dígitos, com DDI 55).
  const session = normalizePhone(s.instance_id);
  if (session.length < 10) {
    return { ok: false, error: "Sessão do WhatsApp não configurada (número da sessão)." };
  }
  const dest = normalizePhone(to);
  if (dest.length < 10) return { ok: false, error: "Número de destino inválido." };

  const endpoint = `${s.api_url.replace(/\/$/, "")}/v15.0/${session}/messages`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: s.token,
  };
  const payload: Record<string, unknown> = imageUrl
    ? { messaging_product: "whatsapp", to: dest, type: "image", image: { link: imageUrl, caption: body } }
    : { messaging_product: "whatsapp", to: dest, type: "text", text: { body } };

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
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

// Envia a mensagem de boas-vindas. O texto suporta o placeholder {nome}.
export async function dispatchViperConnectWelcome(
  phone: string,
  name: string
): Promise<DispatchResult> {
  const s = await getViperConnectSettings();

  if (s.welcome_enabled !== "true") {
    return { ok: false, error: "Envio de boas-vindas desativado nas configurações." };
  }

  const message = (s.welcome_message || "Olá {nome}!").replace(/\{nome\}/gi, name || "aluno(a)");
  return sendWhatsAppMessage({
    to: phone,
    body: message,
    imageUrl: s.welcome_media_url || undefined,
  });
}
