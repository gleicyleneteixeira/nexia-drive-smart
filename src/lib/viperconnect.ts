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

/** Primeiro nome com capitalização normal (o cadastro guarda em MAIÚSCULAS). */
function primeiroNome(display: string | null | undefined): string {
  const first = (display || "").trim().split(/\s+/)[0] || "";
  if (!first) return "aluno(a)";
  const low = first.toLowerCase();
  return low.charAt(0).toUpperCase() + low.slice(1);
}

// Envio genérico no contrato OFICIAL ViperConnect (formato WhatsApp Cloud API):
//   POST {api_url}/v15.0/{SESSAO}/messages
//   Header: Authorization: Bearer <UNOAPI_AUTH_TOKEN>
//   Body: { messaging_product, to, type, text/image }
// Fonte: guia oficial de mensagens + solução de problemas do ViperConnect.
export interface SendWhatsAppArgs {
  /** WhatsApp do destinatário (qualquer formato — normalizado p/ dígitos c/ DDI). */
  to: string;
  /** Texto da mensagem (ou legenda, se houver imagem). */
  body: string;
  /** URL pública de imagem (opcional — envia como imagem com legenda). */
  imageUrl?: string;
  /** Sessão remetente (número conectado). Padrão: a salva nas configurações. */
  session?: string;
}

export async function sendWhatsAppMessage({ to, body, imageUrl, session }: SendWhatsAppArgs): Promise<DispatchResult> {
  const s = await getViperConnectSettings();

  if (!s.api_url || !s.token) {
    return { ok: false, error: "ViperConnect não configurado (URL ou token ausente). Ajuste em Admin → Configurações → WhatsApp." };
  }
  // {SESSAO} = número do WhatsApp conectado (só dígitos, com DDI 55).
  const sessionDigits = normalizePhone(session ?? s.instance_id);
  if (sessionDigits.length < 10) {
    return { ok: false, error: "Sessão do WhatsApp não configurada (número da sessão)." };
  }
  const dest = normalizePhone(to);
  if (dest.length < 10) return { ok: false, error: "Número de destino inválido." };

  const endpoint = `${s.api_url.replace(/\/$/, "")}/v15.0/${sessionDigits}/messages`;
  // Guia oficial (solução de problemas): 401 se resolve com "Bearer TOKEN".
  const auth = s.token.trim().toLowerCase().startsWith("bearer ")
    ? s.token.trim()
    : `Bearer ${s.token.trim()}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: auth,
  };
  const payload: Record<string, unknown> = imageUrl
    ? { messaging_product: "whatsapp", to: dest, type: "image", image: { link: imageUrl, caption: body } }
    : { messaging_product: "whatsapp", to: dest, type: "text", text: { body } };

  try {
    // Timeout: sem ele, uma API lenta trava a chamada e o painel nunca responde
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 25000);
    let res: Response;
    try {
      res = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timer);
    }
    const text = await res.text().catch(() => "");
    if (!res.ok) {
      console.error("Erro ViperConnect:", res.status, text);
      return { ok: false, status: res.status, error: `Falha ${res.status}: ${text.slice(0, 200)}` };
    }
    return { ok: true, status: res.status };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro de rede";
    console.error("Erro ao chamar ViperConnect:", msg);
    if (err instanceof Error && err.name === "AbortError") {
      return { ok: false, error: "Tempo esgotado na API (25s). Tente de novo." };
    }
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
  /** Segundos entre cada parte (mensagem fragmentada). Padrão 3. */
  delay_sec: number;
}

export const WA_TEMPLATE_META: Record<WaTemplateKey, { title: string; description: string }> = {
  reset: {
    title: "Reset de senha",
    description: "Gera senha temporária e envia no WhatsApp (use {senha} no texto).",
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

export const WA_DEFAULT_MESSAGES: Record<WaTemplateKey, string> = {
  reset: "Olá {nome}! 🔑 Sua senha temporária do Nexia Drive é: *{senha}* Entre com ela e crie uma nova senha em seguida.",
  reminder: "Olá {nome}! 📚 Sua meta de leitura de hoje no Nexia Drive está te esperando. Bora manter o ritmo? 💪",
  billing: "Olá {nome}! ⚠️ Seu acesso ao Nexia Drive está pendente de pagamento ou expirado. Regularize para continuar estudando. Qualquer dúvida, chama aqui! 💳",
  abandoned: "Olá {nome}! 👋 Vimos que você criou sua conta no Nexia Drive mas ainda não concluiu o pagamento. Sua vaga continua reservada! Precisa de ajuda? Chama aqui. 🚀",
};

const WA_DEFAULTS: Record<WaTemplateKey, { message: string }> = {
  reset: { message: WA_DEFAULT_MESSAGES.reset },
  reminder: { message: WA_DEFAULT_MESSAGES.reminder },
  billing: { message: WA_DEFAULT_MESSAGES.billing },
  abandoned: { message: WA_DEFAULT_MESSAGES.abandoned },
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
  "wa_reset_delay_sec",
  "wa_reminder_delay_sec",
  "wa_billing_delay_sec",
  "wa_abandoned_delay_sec",
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
  const build = (k: WaTemplateKey): WaTemplate => {
    const delay = parseInt(map[`wa_${k}_delay_sec`] ?? "", 10);
    return {
      enabled: map[`wa_${k}_enabled`] === "true",
      message: map[`wa_${k}_message`] || WA_DEFAULTS[k].message,
      media_url: map[`wa_${k}_media_url`] ?? "",
      delay_sec: Number.isFinite(delay) && delay >= 0 ? delay : 3,
    };
  };
  const hours = parseInt(map.wa_abandoned_hours ?? "", 10);
  return {
    templates: { reset: build("reset"), reminder: build("reminder"), billing: build("billing"), abandoned: build("abandoned") },
    abandoned_hours: Number.isFinite(hours) && hours > 0 ? hours : 48,
  };
}

/** Saudação conforme o horário de Brasília (para o placeholder {saudacao}). */
export function saudacaoBrasilia(now: Date = new Date()): string {
  const hourStr = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "numeric",
    hour12: false,
  }).format(now);
  const h = parseInt(hourStr, 10);
  if (h >= 5 && h < 12) return "Bom dia";
  if (h >= 12 && h < 18) return "Boa tarde";
  return "Boa noite";
}

/** Quebra o texto em partes: cada parágrafo (linha em branco) = 1 mensagem. */
export function splitMessageParts(body: string): string[] {
  const parts = (body || "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
  return parts.length > 0 ? parts : [body];
}

/**
 * Formato salvo no banco: JSON com a lista de caixas (["msg1", "msg2"]).
 * Textos antigos (texto corrido) caem no legado: divisão por linha em branco.
 */
export function parseStoredMessage(stored: string): string[] {
  const s = (stored || "").trim();
  if (!s) return [stored];
  if (s.startsWith("[")) {
    try {
      const arr: unknown = JSON.parse(s);
      if (Array.isArray(arr) && arr.every((x) => typeof x === "string")) {
        const clean = (arr as string[]).map((p) => p.trim()).filter((p) => p.length > 0);
        if (clean.length > 0) return clean;
      }
    } catch {
      /* não é JSON — segue o legado */
    }
  }
  return splitMessageParts(s);
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Envia o texto em sequência (mensagens fragmentadas), com intervalo entre
 * cada parte. Resolve {nome}, {saudacao} e vars extras em todas as partes.
 */
export async function sendWhatsAppSequence({
  to,
  body,
  name,
  imageUrl,
  session,
  delaySec = 3,
  vars,
  parts,
}: {
  to: string;
  body: string;
  name: string;
  imageUrl?: string;
  session?: string;
  delaySec?: number;
  vars?: Record<string, string>;
  /** Lista explícita de mensagens (das caixinhas) — quando presente, NÃO divide por linha em branco. */
  parts?: string[];
}): Promise<DispatchResult & { sent: boolean; parts: number }> {
  const saudacao = saudacaoBrasilia();
  const resolve = (text: string) => {
    let out = text.replace(/\{nome\}/gi, primeiroNome(name)).replace(/\{saudacao\}/gi, saudacao);
    for (const [vk, vv] of Object.entries(vars ?? {})) {
      out = out.split(`{${vk}}`).join(vv);
    }
    return out;
  };
  const source = parts && parts.length ? parts : splitMessageParts(body);
  const resolved = source.map((p) => resolve(p).trim()).filter((p) => p.length > 0);
  if (resolved.length === 0) {
    return { ok: false, sent: false, parts: 0, error: "Mensagem vazia." };
  }
  const waitMs = Math.max(0, Math.min(60, delaySec)) * 1000;
  let sent = 0;
  let lastError: string | undefined;
  let lastStatus: number | undefined;
  for (let i = 0; i < resolved.length; i++) {
    if (i > 0 && waitMs > 0) await sleep(waitMs);
    // Imagem (se houver) vai na primeira parte, como legenda
    const res = await sendWhatsAppMessage({
      to,
      body: resolved[i],
      imageUrl: i === 0 ? imageUrl : undefined,
      session,
    });
    lastStatus = res.status;
    if (res.ok) {
      sent++;
    } else {
      lastError = res.error;
      console.error(`ViperConnect parte ${i + 1}/${resolved.length}:`, res.status, res.error);
    }
  }
  if (sent === 0) return { ok: false, sent: false, parts: resolved.length, status: lastStatus, error: lastError };
  return { ok: true, sent: true, parts: resolved.length, status: lastStatus };
}

/**
 * Envia um template para um número. Placeholders: {nome} (primeiro nome) +
 * vars extras (ex.: {senha} no reset). Retorna {sent:false} (sem erro) quando
 * o template está desligado — o chamador decide se isso é esperado.
 */
export async function sendWaTemplate(
  to: string,
  name: string,
  key: WaTemplateKey,
  opts?: { force?: boolean; vars?: Record<string, string>; session?: string }
): Promise<DispatchResult & { sent: boolean; parts: number }> {
  const { templates } = await getWaTemplates();
  const t = templates[key];
  if (!t.enabled && !opts?.force) {
    return { ok: true, sent: false, parts: 0, error: "Template desativado no painel." };
  }
  const res = await sendWhatsAppSequence({
    to,
    body: t.message || WA_DEFAULTS[key].message,
    name,
    imageUrl: t.media_url || undefined,
    session: opts?.session,
    delaySec: t.delay_sec,
    vars: opts?.vars,
    parts: parseStoredMessage(t.message || WA_DEFAULTS[key].message),
  });
  return res;
}
export async function dispatchViperConnectWelcome(
  phone: string,
  name: string
): Promise<DispatchResult> {
  const s = await getViperConnectSettings();

  if (s.welcome_enabled !== "true") {
    return { ok: false, error: "Envio de boas-vindas desativado nas configurações." };
  }

  // Mesmo motor dos templates: fragmenta por linha em branco e resolve
  // {nome} e {saudacao} em todas as partes.
  const res = await sendWhatsAppSequence({
    to: phone,
    body: s.welcome_message || "Olá {nome}!",
    name,
    imageUrl: s.welcome_media_url || undefined,
    delaySec: 3,
  });
  return res;
}
