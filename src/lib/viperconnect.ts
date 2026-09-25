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

// ─────────────────────────────────────────────────────────────────────────────
// MENSAGENS AUTOMÁTICAS (templates configuráveis no painel admin)
// Cada template: liga/desliga + texto (com {nome}) + mídia opcional.
// Chaves em system_settings: wa_<tipo>_enabled | wa_<tipo>_message | wa_<tipo>_media_url
// ─────────────────────────────────────────────────────────────────────────────
export type WaTemplateKey = "reset" | "reminder" | "billing" | "abandoned";

export interface WaTemplate {
  enabled: boolean;
  message: string;
  media_url: string;
}

export const WA_TEMPLATE_META: Record<WaTemplateKey, { title: string; description: string }> = {
  reset: {
    title: "Reset de senha",
    description: "Enviada logo após o aluno trocar a senha (confirmação).",
  },
  reminder: {
    title: "Lembrete de estudo",
    description: "Alunos com meta do cronograma pendente no dia.",
  },
  billing: {
    title: "Cobrança e acesso",
    description: "Acesso pendente de pagamento ou expirado.",
  },
  abandoned: {
    title: "Cadastro sem pagamento",
    description: "Cadastrou mas não pagou dentro do prazo (só contas recentes).",
  },
};

const WA_DEFAULTS: Record<WaTemplateKey, { message: string }> = {
  reset: {
    message: "Olá {nome}! 🔐 Sua senha do Nexia Drive foi alterada com sucesso. Se não foi você, fale com o suporte agora mesmo.",
  },
  reminder: {
    message: "Olá {nome}! 📚 Sua meta de leitura de hoje no Nexia Drive está te esperando. Bora manter o ritmo? 💪",
  },
  billing: {
    message: "Olá {nome}! ⚠️ Seu acesso ao Nexia Drive está pendente de pagamento ou expirado. Regularize para continuar estudando. Qualquer dúvida, chama aqui! 💳",
  },
  abandoned: {
    message: "Olá {nome}! 👋 Vimos que você criou sua conta no Nexia Drive mas ainda não concluiu o pagamento. Sua vaga continua reservada! Precisa de ajuda? Chama aqui. 🚀",
  },
};

export const WA_TEMPLATE_KEYS = [
  "wa_reset_enabled",
  "wa_reset_message",
  "wa_reset_media_url",
  "wa_reminder_enabled",
  "wa_reminder_message",
  "wa_reminder_media_url",
  "wa_billing_enabled",
  "wa_billing_message",
  "wa_billing_media_url",
  "wa_abandoned_enabled",
  "wa_abandoned_message",
  "wa_abandoned_media_url",
  "wa_abandoned_hours",
] as const;

export interface WaTemplates {
  templates: Record<WaTemplateKey, WaTemplate>;
  /** Horas após o cadastro para cobrar quem não pagou (padrão 48 = 2 dias). */
  abandoned_hours: number;
}

export async function getWaTemplates(): Promise<WaTemplates> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("system_settings")
    .select("key, value")
    .in("key", WA_TEMPLATE_KEYS as unknown as string[]);
  const map = Object.fromEntries((data ?? []).map((r) => [r.key, r.value ?? ""]));
  const build = (k: WaTemplateKey): WaTemplate => ({
    enabled: map[`wa_${k}_enabled`] === "true",
    message: map[`wa_${k}_message`] || WA_DEFAULTS[k].message,
    media_url: map[`wa_${k}_media_url`] ?? "",
  });
  const hours = parseInt(map.wa_abandoned_hours ?? "", 10);
  return {
    templates: { reset: build("reset"), reminder: build("reminder"), billing: build("billing"), abandoned: build("abandoned") },
    abandoned_hours: Number.isFinite(hours) && hours > 0 ? hours : 48,
  };
}

/**
 * Envia um template para um número. Retorna {sent:false} (sem erro) quando o
 * template está desligado — o chamador decide se isso é esperado.
 */
export async function sendWaTemplate(
  to: string,
  name: string,
  key: WaTemplateKey,
  opts?: { force?: boolean }
): Promise<DispatchResult & { sent: boolean }> {
  const { templates } = await getWaTemplates();
  const t = templates[key];
  if (!t.enabled && !opts?.force) {
    return { ok: true, sent: false, error: "Template desativado no painel." };
  }
  const body = (t.message || WA_DEFAULTS[key].message).replace(/\{nome\}/gi, name || "aluno(a)");
  const res = await sendWhatsAppMessage({ to, body, imageUrl: t.media_url || undefined });
  return { ...res, sent: res.ok };
}
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
