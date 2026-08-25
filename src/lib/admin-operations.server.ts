import { createServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";

function getAdminAuthHeader(): string | null {
  try {
    const raw = globalThis?.document?.cookie ?? "";
    const m = raw.match(/\b_access_token=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : null;
  } catch {
    return null;
  }
}

export const deleteUser = createServerFn({ method: "POST" })
  .inputValidator((d: { userId: string }) => d)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const sendPasswordReset = createServerFn({ method: "POST" })
  .inputValidator((d: { email: string }) => d)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.auth.admin.generateLink({
      type: "recovery",
      email: data.email,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const checkIfEmailExists = createServerFn({ method: "POST" })
  .inputValidator((d: { email: string }) => d)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .select("id, email")
      .eq("email", data.email.trim().toLowerCase())
      .maybeSingle();

    if (error) {
      console.error("Error in checkIfEmailExists server function:", error);
      return { exists: false };
    }
    return { exists: !!profile };
  });

export const checkLegacyAccessSecure = createServerFn({ method: "POST" })
  .inputValidator((d: { input: string }) => d)
  .handler(async ({ data }): Promise<{
    found: boolean;
    isMigratedUser: boolean;
    needsFirstAccess: boolean;
    needsNewPassword: boolean;
    userEmail: string;
  }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const inputClean = data.input.trim().toLowerCase();
    const cpfDigits = inputClean.replace(/\D/g, "");

    let query = supabaseAdmin.from("profiles").select("*");

    if (cpfDigits && cpfDigits.length >= 11) {
      query = query.or(`email.eq.${inputClean},cpf.eq.${cpfDigits}`);
    } else {
      query = query.eq("email", inputClean);
    }

    const { data: profile, error } = await query.maybeSingle();

    if (error || !profile) {
      return { found: false, isMigratedUser: false, needsFirstAccess: false, needsNewPassword: false, userEmail: "" };
    }

    const isMigratedUser = "is_migrated" in profile ? !!(profile as any).is_migrated : true;

    const needsFirstAccess = "is_first_access" in profile
      ? !!(profile as any).is_first_access
      : true;

    const needsNewPassword = "needs_new_password" in profile
      ? !!(profile as any).needs_new_password
      : true;

    return {
      found: true,
      isMigratedUser,
      needsFirstAccess,
      needsNewPassword,
      userEmail: profile.email || "",
    };
  });

export const registerLegacyUser = createServerFn({ method: "POST" })
  .inputValidator((d: { email: string; password: string }) => d)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const emailClean = data.email.trim().toLowerCase();

    // 1. Get profile
    const { data: profile, error: profErr } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("email", emailClean)
      .maybeSingle();

    if (profErr || !profile) {
      return { success: false, error: "Cadastro não encontrado." };
    }

    // 2. Check if user already exists in auth.users
    const resCheck = await supabaseAdmin.auth.admin.getUserById(profile.id);
    
    if (resCheck.data?.user) {
      // User already exists, update their password
      const { error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(profile.id, {
        password: data.password,
      });
      if (updateErr) {
        console.error("Error updating user password:", updateErr);
        return { success: false, error: updateErr.message };
      }
    } else {
      // Create user in auth.users with the exact same ID
      const { error: createError } = await supabaseAdmin.auth.admin.createUser({
        id: profile.id,
        email: emailClean,
        password: data.password,
        email_confirm: true,
        user_metadata: {
          display_name: profile.display_name,
          cpf: profile.cpf,
          phone: profile.phone,
          status: profile.status,
        }
      });

      if (createError) {
        console.error("Error creating auth user:", createError);
        return { success: false, error: createError.message };
      }
    }

    // 3. Update profiles table status
    const { error: updateProfileErr } = await supabaseAdmin
      .from("profiles")
      .update({
        is_first_access: false,
        needs_new_password: false,
        access_status: "active",
        status: "ativo"
      })
      .eq("id", profile.id);

    if (updateProfileErr) {
      console.error("Error updating profile status:", updateProfileErr);
      return { success: false, error: "Erro ao atualizar perfil do usuário." };
    }

    return { success: true };
  });

export const autoConfirmEmail = createServerFn({ method: "POST" })
  .inputValidator((d: { userId: string }) => d)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.auth.admin.updateUserById(data.userId, {
      email_confirm: true,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const checkCpfExists = createServerFn({ method: "POST" })
  .inputValidator((d: { cpf: string }) => d)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const cpfDigits = data.cpf.replace(/\D/g, "");
    const { data: row, error } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("cpf", cpfDigits)
      .maybeSingle();
    if (error) {
      console.error("Error in checkCpfExists:", error);
      return { exists: false };
    }
    return { exists: !!row };
  });

type CreateUserInput = {
  email: string;
  password: string;
  display_name: string;
  cpf: string;
  phone: string | null;
  employment_status: string;
  employment_other: string | null;
};

export const createUserWithoutConfirmation = createServerFn({ method: "POST" })
  .inputValidator((d: CreateUserInput) => d)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const emailClean = data.email.trim().toLowerCase();

    // Creates the user already confirmed. This does NOT send a confirmation
    // email — the account is usable immediately. The DB trigger
    // (handle_new_user) creates the profiles row.
    const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: emailClean,
      password: data.password,
      email_confirm: true,
      user_metadata: {
        display_name: data.display_name,
        cpf: data.cpf,
        phone: data.phone,
        employment_status: data.employment_status,
        employment_other: data.employment_other,
        status: "pendente_pagamento",
      },
    });

    if (createError && /already been registered|already registered/i.test(createError.message)) {
      return { success: false, alreadyRegistered: true, error: null };
    }
    if (createError) {
      console.error("Error creating user without confirmation:", createError);
      return { success: false, error: createError.message };
    }

    const userId = created.user?.id;
    if (userId) {
      const { error: upsertErr } = await supabaseAdmin
        .from("profiles")
        .update({
          cpf: data.cpf,
          phone: data.phone,
          employment_status: data.employment_status,
          employment_other: data.employment_other,
          display_name: data.display_name,
          email: emailClean,
          status: "pendente_pagamento",
          needs_new_password: false,
          is_first_access: false,
        })
        .eq("id", userId);
      if (upsertErr) console.error("Error updating profile after create:", upsertErr);
    }

    return { success: true, userId, email: emailClean };
  });

export const lookupCpfForReset = createServerFn({ method: "POST" })
  .inputValidator((d: { cpf: string }) => d)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const cpfDigits = data.cpf.replace(/\D/g, "");

    const { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .select("id, email, phone")
      .eq("cpf", cpfDigits)
      .maybeSingle();

    if (error || !profile) {
      return { found: false as const };
    }

    const email = profile.email || "";
    const phone = profile.phone || "";
    const last4Phone = phone.replace(/\D/g, "").slice(-4);

    return {
      found: true as const,
      email,
      last4Phone,
    };
  });

export const lookupPhoneForReset = createServerFn({ method: "POST" })
  .inputValidator((d: { phone: string }) => d)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const phoneDigits = data.phone.replace(/\D/g, "");

    if (phoneDigits.length < 4) {
      return { found: false as const };
    }

    const { data: profiles, error } = await supabaseAdmin
      .from("profiles")
      .select("id, email, phone")
      .like("phone", `%${phoneDigits}`)
      .limit(10);

    if (error || !profiles || profiles.length === 0) {
      return { found: false as const };
    }

    if (profiles.length > 1) {
      return { found: false as const, multiple: true as const };
    }

    const profile = profiles[0];
    const phoneStr = profile.phone || "";
    const last4 = phoneStr.replace(/\D/g, "").slice(-4);

    return {
      found: true as const,
      last4,
      email: profile.email || "",
    };
  });

export const sendMigrationResetEmail = createServerFn({ method: "POST" })
  .inputValidator((d: { email: string; origin: string }) => d)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { sendEmail } = await import("./mail.server");

    const emailClean = data.email.trim().toLowerCase();

    // 1. Proactively check if the user exists in auth.users by trying to generate link
    let linkData: any = null;
    let linkError: any = null;
    try {
      const res = await supabaseAdmin.auth.admin.generateLink({
        type: "recovery",
        email: emailClean,
        options: {
          redirectTo: `${data.origin}/reset-password`,
        }
      });
      linkData = res.data;
      linkError = res.error;
    } catch (err) {
      linkError = err;
    }

    // 2. If user is not found in auth.users, let's create them using their profile ID
    if (linkError && (linkError.message?.toLowerCase().includes("not found") || linkError.status === 404 || linkError.code === "user_not_found")) {
      console.log(`[Migration] User ${emailClean} not found in auth.users. Proactively migrating from profiles...`);
      
      // Get profile
      const { data: profile, error: profileErr } = await supabaseAdmin
        .from("profiles")
        .select("*")
        .eq("email", emailClean)
        .maybeSingle();

      if (profileErr || !profile) {
        throw new Error(profileErr ? profileErr.message : "Cadastro não encontrado.");
      }

      // Create auth user with the same profile ID to prevent duplicate profile issues
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        id: profile.id,
        email: emailClean,
        password: Math.random().toString(36).slice(-10) + "Aa1!",
        email_confirm: true,
        user_metadata: {
          display_name: profile.display_name,
          cpf: profile.cpf,
          phone: profile.phone,
          status: profile.status,
        }
      });

      if (createError) {
        console.error(`[Migration] Error creating auth user for ${emailClean}:`, createError);
        throw new Error(`Erro ao criar conta de acesso: ${createError.message}`);
      }

      console.log(`[Migration] Successfully created auth user for ${emailClean} with ID ${profile.id}. Retrying recovery link...`);

      // Retry generating recovery link
      const retryResult = await supabaseAdmin.auth.admin.generateLink({
        type: "recovery",
        email: emailClean,
        options: {
          redirectTo: `${data.origin}/reset-password`,
        }
      });

      if (retryResult.error) {
        console.error(`[Migration] Retry generating recovery link failed:`, retryResult.error);
        throw new Error(retryResult.error.message);
      }

      linkData = retryResult.data;
    } else if (linkError) {
      console.error("Error generating recovery link:", linkError);
      throw new Error(linkError.message);
    }

    const resetLink = linkData.properties.action_link;

    // Send email using SMTP configurations
    await sendEmail({
      to: data.email,
      subject: "Atualização de Acesso — Nexia DETRAN",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <h2 style="color: #2563eb; margin-bottom: 20px;">Atualização de Acesso - Nexia DETRAN</h2>
          <p>Olá,</p>
          <p>Atualizamos nossa plataforma para oferecer um sistema mais rápido, seguro e moderno.</p>
          <p>Como importamos sua conta de nossa base de dados anterior, por motivos de segurança você precisa definir uma nova senha para o seu primeiro acesso nesta nova versão.</p>
          <p>Clique no botão abaixo para criar sua senha de acesso:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #2563eb; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);">Definir Nova Senha</a>
          </div>
          <p style="font-size: 12px; color: #64748b;">Se o botão não funcionar, copie e cole o seguinte link no seu navegador:</p>
          <p style="font-size: 12px; color: #3b82f6; word-break: break-all;">${resetLink}</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 25px 0;" />
          <p style="font-size: 11px; color: #94a3b8; text-align: center;">Esta mensagem foi enviada automaticamente pelo sistema da Nexia DETRAN.</p>
        </div>
      `,
    });

    return { success: true };
  });

export const deactivateUser = createServerFn({ method: "POST" })
  .inputValidator((d: { userId: string }) => d)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error } = await supabaseAdmin
      .from("profiles")
      .update({
        status: "pendente_pagamento",
        expires_at: null,
        access_reason: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.userId);

    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const activateUser = createServerFn({ method: "POST" })
  .inputValidator((d: { userId: string; reason?: string; expiresAt?: string | null }) => d)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { getExpiryDate } = await import("@/lib/subscription");

    let planType = "6_months";

    let amount = 0;

    const { data: tx } = await supabaseAdmin
      .from("pix_transactions")
      .select("plan_type, amount")
      .eq("user_id", data.userId)
      .eq("status", "CONCLUIDA")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (tx?.plan_type) {
      planType = tx.plan_type;
      amount = tx.amount;
    }

    const expiresAt = data.expiresAt
      ? new Date(data.expiresAt).toISOString()
      : getExpiryDate(planType, amount).toISOString();

    const { error } = await supabaseAdmin
      .from("profiles")
      .update({
        status: "ativo",
        expires_at: expiresAt,
        access_reason: data.reason ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.userId);

    if (error) throw new Error(error.message);
    return { ok: true, planType, expiresAt };
  });

export const receivePixConfirmation = createServerFn({ method: "POST" })
  .inputValidator((d: { userId: string }) => d)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { getPlanDays } = await import("@/lib/subscription");

    const { data: profile, error: profErr } = await supabaseAdmin
      .from("profiles")
      .select("status, expires_at")
      .eq("id", data.userId)
      .maybeSingle();
    if (profErr) throw new Error(profErr.message);
    if (!profile) return { ok: true, activated: false, reason: "no-profile" };

    // Já ativo e não expirado: nada a fazer.
    if (profile.status === "ativo" && profile.expires_at && new Date(profile.expires_at) > new Date()) {
      return { ok: true, activated: false, reason: "already-active" };
    }

    const { data: txList } = await supabaseAdmin
      .from("pix_transactions")
      .select("txid, plan_type, amount, status, created_at")
      .eq("user_id", data.userId)
      .order("created_at", { ascending: false })
      .limit(10);

    if (!txList || txList.length === 0) {
      return { ok: true, activated: false, reason: "no-transaction" };
    }

    // Varre todas as cobranças e ativa na primeira que estiver paga. Isso cobre
    // o caso de o usuário gerar mais de um QR Code (ex.: expirou o primeiro) e
    // ter pago a cobrança anterior à mais recente.
    //
    // IMPORTANTE: o prazo começa na DATA DA TRANSAÇÃO (created_at), não em
    // "agora". Assim, uma cobrança antiga já vencida (ex.: plano pago há 60
    // dias, depois gerou outra cobrança sem pagar) NÃO reativa o acesso de
    // graça. Somente cobranças pagas cuja vigência ainda esteja válida contam.
    let activatedTx: { txid: string; plan_type?: string | null; amount?: number | null; created_at?: string | null } | null = null;
    let activatesAt: string | null = null;
    const now = Date.now();
    for (const tx of txList) {
      let finalStatus = tx.status;
      if (finalStatus !== "CONCLUIDA") {
        try {
          const { getPixChargeStatus } = await import("@/lib/efi-pay.server");
          const remote = await getPixChargeStatus(tx.txid);
          if (remote === "CONCLUIDA" || remote === "paid") {
            finalStatus = "CONCLUIDA";
          }
        } catch (efiErr) {
          console.warn("Falha ao consultar status EFI na reconciliação:", (efiErr as Error).message);
        }
      }
      if (finalStatus !== "CONCLUIDA") {
        continue;
      }

      const days = getPlanDays(tx.plan_type ?? "1_month", tx.amount ?? undefined);
      const base = tx.created_at ? new Date(tx.created_at) : new Date();
      const candidateExpiry = new Date(base);
      candidateExpiry.setDate(candidateExpiry.getDate() + days);
      if (candidateExpiry.getTime() <= now) {
        // Pagamento antigo já venceu — não conta para liberação.
        continue;
      }

      activatedTx = tx;
      activatesAt = candidateExpiry.toISOString();
      break;
    }

    if (!activatedTx) {
      return { ok: true, activated: false, reason: "not-paid" };
    }

    const { error: txErr } = await supabaseAdmin
      .from("pix_transactions")
      .update({ status: "CONCLUIDA", updated_at: new Date().toISOString() })
      .eq("user_id", data.userId)
      .eq("txid", activatedTx.txid);
    if (txErr) console.warn("Erro ao marcar transação como CONCLUIDA:", txErr.message);

    const { error } = await supabaseAdmin
      .from("profiles")
      .update({
        status: "ativo",
        expires_at: activatesAt,
        access_reason: "pago",
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.userId);
    if (error) throw new Error(error.message);

    return { ok: true, activated: true, expiresAt: activatesAt };
  });

export const registerPixPayment = createServerFn({ method: "POST" })
  .inputValidator((d: { userId: string; amount?: number; planType?: string; expiresAt?: string | null }) => d)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { getExpiryDate } = await import("@/lib/subscription");

    const planType = data.planType && ["1_month", "3_months", "6_months"].includes(data.planType) ? data.planType : "1_month";
    const amount = typeof data.amount === "number" && data.amount > 0 ? data.amount : 19.9;

    const expiresAt = data.expiresAt
      ? new Date(data.expiresAt).toISOString()
      : getExpiryDate(planType, amount).toISOString();

    const txid = `manual-${crypto.randomUUID()}`;

    const { error: txErr } = await supabaseAdmin
      .from("pix_transactions")
      .insert({
        user_id: data.userId,
        txid,
        amount,
        plan_type: planType,
        status: "CONCLUIDA",
        pix_copia_e_cola: "baixa-manual",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    if (txErr) throw new Error("Erro ao registrar pagamento: " + txErr.message);

    const { error: profErr } = await supabaseAdmin
      .from("profiles")
      .update({
        status: "ativo",
        expires_at: expiresAt,
        access_reason: "pago",
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.userId);

    if (profErr) throw new Error("Erro ao ativar usuário: " + profErr.message);

    return { ok: true, txid, expiresAt };
  });

export const checkLoginBlockSecure = createServerFn({ method: "POST" })
  .inputValidator((d: { input: string }) => d)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const inputClean = data.input.trim().toLowerCase();
    const cpfDigits = inputClean.replace(/\D/g, "");

    let query = supabaseAdmin.from("profiles").select("id, access_status");

    if (cpfDigits && cpfDigits.length >= 11) {
      query = query.or(`email.eq.${inputClean},cpf.eq.${cpfDigits}`);
    } else {
      query = query.eq("email", inputClean);
    }

    const { data: profile } = await query.maybeSingle();
    if (!profile) return { blocked: false };

    const isBlocked = profile.access_status === "blocked";
    return { blocked: isBlocked };
  });

export const recordFailedLoginAttempt = createServerFn({ method: "POST" })
  .inputValidator((d: { input: string }) => d)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const inputClean = data.input.trim().toLowerCase();
    const cpfDigits = inputClean.replace(/\D/g, "");

    let query = supabaseAdmin.from("profiles").select("id");

    if (cpfDigits && cpfDigits.length >= 11) {
      query = query.or(`email.eq.${inputClean},cpf.eq.${cpfDigits}`);
    } else {
      query = query.eq("email", inputClean);
    }

    const { data: profile } = await query.maybeSingle();
    if (!profile) return { success: false, attempts: 0, blocked: false };

    const newAttempts = 1;
    const isBlockedNow = false;

    await supabaseAdmin
      .from("profiles")
      .update({
        access_status: "active"
      })
      .eq("id", profile.id);

    return { success: true, attempts: newAttempts, blocked: isBlockedNow };
  });

export const releaseUserAccess = createServerFn({ method: "POST" })
  .inputValidator((d: { userId: string; reason?: string; expiresAt?: string | null }) => d)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { getExpiryDate } = await import("@/lib/subscription");

    let expiresAt: string | null = null;

    if (data.expiresAt) {
      expiresAt = new Date(data.expiresAt).toISOString();
    } else {
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("status, expires_at")
        .eq("id", data.userId)
        .maybeSingle();

      if (profile?.status !== "ativo") {
        expiresAt = getExpiryDate("6_months").toISOString();
      } else if (profile.expires_at) {
        expiresAt = profile.expires_at;
      }
    }

    const { error } = await supabaseAdmin
      .from("profiles")
      .update({
        access_status: "active",
        status: "ativo",
        expires_at: expiresAt,
        access_reason: data.reason ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.userId);

    if (error) throw new Error(error.message);

    return { success: true };
  });

export const resetFailedLoginAttempts = createServerFn({ method: "POST" })
  .inputValidator((d: { userId: string }) => d)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin
      .from("profiles")
      .update({
        access_status: "active"
      })
      .eq("id", data.userId);

    return { success: true };
  });

export const bulkReleaseUserAccess = createServerFn({ method: "POST" })
  .inputValidator((data: { userIds: string[]; reason?: string; expiresAt?: string | null }) => data)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { getExpiryDate } = await import("@/lib/subscription");
    if (!data.userIds.length) throw new Error("Nenhum usuário selecionado.");

    const expiresAt = data.expiresAt
      ? new Date(data.expiresAt).toISOString()
      : getExpiryDate("6_months").toISOString();

    const { error } = await supabaseAdmin
      .from("profiles")
      .update({
        access_status: "active",
        status: "ativo",
        expires_at: expiresAt,
        access_reason: data.reason ?? null,
        updated_at: new Date().toISOString(),
      })
      .in("id", data.userIds);

    if (error) throw new Error(error.message);
    return { ok: true, updated: data.userIds.length };
  });

export const bulkSetExpiry = createServerFn({ method: "POST" })
  .inputValidator((data: { userIds: string[]; expiresAt: string | null }) => data)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (!data.userIds.length) throw new Error("Nenhum usuário selecionado.");

    const { error } = await supabaseAdmin
      .from("profiles")
      .update({
        expires_at: data.expiresAt,
        status: "ativo",
        updated_at: new Date().toISOString(),
      })
      .in("id", data.userIds);

    if (error) throw new Error(error.message);
    return { ok: true, updated: data.userIds.length };
  });

export const bulkExpireUsers = createServerFn({ method: "POST" })
  .inputValidator((data: { userIds: string[] }) => data)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (!data.userIds.length) throw new Error("Nenhum usuário selecionado.");

    const { error } = await supabaseAdmin
      .from("profiles")
      .update({
        status: "pendente_pagamento",
        expires_at: null,
        access_reason: null,
        updated_at: new Date().toISOString(),
      })
      .in("id", data.userIds);

    if (error) throw new Error(error.message);
    return { ok: true, updated: data.userIds.length };
  });

export const bulkBlockUsers = createServerFn({ method: "POST" })
  .inputValidator((data: { userIds: string[] }) => data)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (!data.userIds.length) throw new Error("Nenhum usuário selecionado.");

    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ access_status: "blocked", updated_at: new Date().toISOString() })
      .in("id", data.userIds);

    if (error) throw new Error(error.message);
    return { ok: true, updated: data.userIds.length };
  });

export const bulkUnblockUsers = createServerFn({ method: "POST" })
  .inputValidator((data: { userIds: string[] }) => data)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (!data.userIds.length) throw new Error("Nenhum usuário selecionado.");

    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ access_status: "active", updated_at: new Date().toISOString() })
      .in("id", data.userIds);

    if (error) throw new Error(error.message);
    return { ok: true, updated: data.userIds.length };
  });

export const bulkDeleteUsers = createServerFn({ method: "POST" })
  .inputValidator((data: { userIds: string[] }) => data)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (!data.userIds.length) throw new Error("Nenhum usuário selecionado.");

    let deleted = 0;
    let lastError: string | null = null;
    for (const id of data.userIds) {
      const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
      if (error) {
        lastError = error.message;
      } else {
        deleted++;
      }
    }
    if (lastError) throw new Error("Alguns usuários falharam: " + lastError);
    return { ok: true, deleted };
  });

export const requestPasswordResetSecure = createServerFn({ method: "POST" })
  .inputValidator((d: { input: string }) => d)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { sendEmail } = await import("@/lib/mail.server");

    const inputClean = data.input.trim().toLowerCase();
    const cpfDigits = inputClean.replace(/\D/g, "");

    let query = supabaseAdmin.from("profiles").select("id, email, display_name");

    if (cpfDigits && cpfDigits.length >= 11) {
      query = query.or(`email.eq.${inputClean},cpf.eq.${cpfDigits}`);
    } else {
      query = query.eq("email", inputClean);
    }

    const { data: profile, error } = await query.maybeSingle();
    if (error || !profile) {
      throw new Error("Não encontramos nenhuma conta com o e-mail ou CPF informado.");
    }

    const email = profile.email;
    if (!email) {
      throw new Error("Esta conta não possui um e-mail cadastrado. Entre em contato com o suporte.");
    }

    // Generate random temporary password
    const chars = "ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789";
    let tempPassword = "nexia-";
    for (let i = 0; i < 6; i++) {
      tempPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Update Auth password
    const { error: authErr } = await supabaseAdmin.auth.admin.updateUserById(profile.id, {
      password: tempPassword,
    });
    if (authErr) throw new Error("Erro ao atualizar credenciais: " + authErr.message);

    // Update profile: set needs_new_password: true
    await supabaseAdmin
      .from("profiles")
      .update({
        access_status: "active",
        needs_new_password: true,
      })
      .eq("id", profile.id);

    // Send email with nodemailer
    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
        <h2 style="color: #2563eb; margin-top: 0;">Recuperação de Senha — Nexia Drive</h2>
        <p>Olá, <strong>${profile.display_name || "Estudante"}</strong>!</p>
        <p>Recebemos uma solicitação de redefinição de senha para sua conta.</p>
        <p>Geramos uma senha temporária segura para você acessar a plataforma:</p>
        <div style="background: #f1f5f9; padding: 12px; font-size: 18px; font-family: monospace; font-weight: bold; letter-spacing: 1px; text-align: center; border-radius: 6px; margin: 18px 0; border: 1px dashed #cbd5e1; color: #0f172a;">
          ${tempPassword}
        </div>
        <p style="color: #64748b; font-size: 12px;">💡 Por segurança, você deverá cadastrar uma nova senha de sua escolha assim que fizer login.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 11px; color: #94a3b8; margin-bottom: 0;">Se você não solicitou essa alteração, altere sua senha imediatamente.</p>
      </div>
    `;

    await sendEmail({
      to: email,
      subject: "Sua senha temporária — Nexia Drive",
      html: htmlContent,
    });

    return { success: true };
  });

function pagesPerReadingBlock(v: string | undefined): number {
  switch (v) {
    case "raramente":
    case "lento":
      return 1.5;
    case "as_vezes":
    case "normal":
      return 3;
    case "frequentemente":
    case "rapido":
      return 4.5;
    default:
      return 3;
  }
}

export const gerarCronograma = createServerFn({ method: "POST" })
  .inputValidator((d: { userId: string }) => d)
  .handler(async ({ data }) => {
    const { supabase, supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Verify user exists
    const { data: userProfile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.userId)
      .maybeSingle();

    if (profileError || !userProfile) {
      throw new Error("Usuário não encontrado");
    }

    // Buscar configuração de estudo do usuário
    const { data: config, error: configError } = await supabase
      .from("estudo_config")
      .select("*")
      .eq("user_id", data.userId)
      .maybeSingle();

    if (configError) {
      throw new Error("Erro ao buscar configuração de estudo: " + configError.message);
    }

    // Se não existir configuração, criar default
    let studyConfig = config;
    if (!studyConfig) {
      const today = new Date();
      const provaDate = new Date(today.getFullYear(), 5, 15); // Example: June 15 exam date
      const daysUntilProva = Math.max(1, Math.ceil((provaDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

      const defaultTempoDiario = 60; // 1 hour default
      const defaultRitmo = "normal" as const;

      // Calculate reading speed based on habit/ritmo
      const pagesPer15min = pagesPerReadingBlock(defaultRitmo);

      // Total pages = 91 (base book)
      const totalPaginas = 91;
      
      // Check intensive mode condition: total_paginas / dias_ate_prova > 30
      const pagesPerDayNeeded = totalPaginas / daysUntilProva;
      const modoIntensivo = pagesPerDayNeeded > 30;

      // Calculate daily schedule based on mode
      const diasSemana: string[] = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

      // Generate cronograma_dias
      const cronogramaDatas: any[] = [];
      let paginaAtual = 1;
      let diaAtual = 1;

      for (let d = 0; d < daysUntilProva; d++) {
        const data = new Date();
        data.setDate(today.getDate() + d);
        const dataFormatada = data.toISOString().split('T')[0];

        let paginasHoje = 0;
        let simuladosMeta = 1;
        let tempoLeitura = defaultTempoDiario;
        let tempoSimulado = 30;

        if (modoIntensivo && d < daysUntilProva * 0.6) {
          // First 60% in intensive mode: focus on essentials + 80% time to simulados
          tempoSimulado = 40; // more time for simulados
          tempoLeitura = defaultTempoDiario - tempoSimulado;
          // Essential reading only: Placas, Sinalização, Infrações (~20 pages total)
          const paginasEssenciais = 20;
          paginasHoje = Math.min(paginasEssenciais / diasSemana.length, 3); // limit per day
          simuladosMeta = 2; // 2 simulados in intensive mode
        } else {
          // Normal mode
          const pagesRemaining = totalPaginas - paginaAtual;
          const daysRemaining = daysUntilProva - d;
          const pagesNeededPerDay = pagesRemaining / daysRemaining;

          if (pagesNeededPerDay > 30) {
            // Switch to intensive mid-way
            // modoIntensivo already set above
          }

          // Calculate reading based on habit/ritmo
          const ritmoAtual = studyConfig?.reading_habit || "normal";
          const pagesPerBlock = pagesPerReadingBlock(ritmoAtual);

          // Blocks of 15min in tempoLeitura minutes
          const blocks = Math.floor(tempoLeitura / 15);
          paginasHoje = Math.max(1, Math.min(blocks * pagesPerBlock, pagesNeededPerDay));
          simuladosMeta = 1;
        }

        // Ensure at least 30 min for simulado
        if (tempoLeitura < 30) {
          tempoSimulado = tempoLeitura;
          tempoLeitura = 0;
        } else {
          tempoSimulado = 30;
          tempoLeitura -= 30;
        }

        // Cap pages at remaining
        paginasHoje = Math.min(paginasHoje, Math.max(1, Math.ceil((totalPaginas - paginaAtual) / Math.max(1, daysUntilProva - d))));

        paginaAtual += paginasHoje >= 1 ? paginasHoje : 1;

        cronogramaDatas.push({
          user_id: data.userId,
          dia_numero: diaAtual,
          data_agendada: dataFormatada,
          paginas_leitura: `Pág ${paginaAtual - paginasHoje + 1} a ${paginaAtual}`,
          qtd_simulados_meta: simuladosMeta,
          concluido: false
        });

        diaAtual++;
      }

      // Save configuration
      const { error: insertError } = await supabase
        .from("estudo_config")
        .insert({
          user_id: data.userId,
          exam_date: provaDate,
          no_exam_date: false,
          days_of_week: diasSemana,
          daily_time: defaultTempoDiario,
          reading_habit: defaultRitmo,
          is_intensive_mode: modoIntensivo,
          updated_at: new Date().toISOString()
        });

      if (insertError) {
        throw new Error("Erro ao salvar configuração: " + insertError.message);
      }

      studyConfig = await supabase
        .from("estudo_config")
        .select("*")
        .eq("user_id", data.userId)
        .maybeSingle();
    }

    // Now generate or update the cronograma_dias for this user
    // First, check existing cronograma
    const { data: existingCronograma, error: cronError } = await supabase
      .from("cronograma_dias")
      .select("*")
      .eq("user_id", data.userId);

    if (cronError) {
      throw new Error("Erro ao buscar cronograma existente: " + cronError.message);
    }

    // If already has cronograma, don't overwrite
    if (existingCronograma && existingCronograma.length > 0) {
      return { 
        success: true, 
        message: "Cronograma já existe",
        is_intensive_mode: studyConfig?.is_intensive_mode || false,
        config: studyConfig
      };
    }

    // Insert generated cronograma
    if (studyConfig && studyConfig.id) {
      // Delete existing to regenerate
      await supabase
        .from("cronograma_dias")
        .delete()
        .eq("user_id", data.userId);

      // Re-generate using study config values
      const tempoDiario = studyConfig.daily_time || 60;
      const ritmo = studyConfig.reading_habit || "normal";
      const modoIntensivo = studyConfig.is_intensive_mode || false;
      const dataProva = studyConfig.exam_date ? new Date(studyConfig.exam_date) : new Date();
      const daysUntilProva = Math.max(1, Math.ceil((dataProva.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));

      const totalPaginas = 91;
      const diasSemana = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

      const cronogramaDatas: any[] = [];
      let paginaAtual = 1;
      let diaAtual = 1;

      for (let d = 0; d < daysUntilProva; d++) {
        const data = new Date();
        data.setDate(new Date().getDate() + d);
        const dataFormatada = data.toISOString().split('T')[0];

        let paginasHoje = 0;
        let simuladosMeta = 1;
        let tempoLeitura = tempoDiario;
        let tempoSimulado = 30;

        if (modoIntensivo) {
          // Intensive mode: 80% time for simulados, essential reading only
          tempoSimulado = Math.max(30, tempoDiario * 0.8);
          tempoLeitura = tempoDiario - tempoSimulado;
          // Essential: Placas, Sinalização, Infrações ~20 pages total, distributed
          const paginasEssenciais = 20;
          const remainingPages = totalPaginas - paginaAtual;
          paginasHoje = Math.min(Math.ceil(remainingPages / daysUntilProva), 3);
          simuladosMeta = 2;
        } else {
          // Normal mode
          const pagesPerBlock = pagesPerReadingBlock(ritmo);

          const blocks = Math.floor(tempoLeitura / 15);
          paginasHoje = blocks * pagesPerBlock;
          if (paginasHoje > totalPaginas - paginaAtual) {
            paginasHoje = totalPaginas - paginaAtual;
          }
          if (paginasHoje < 1) paginasHoje = 1;
        }

        // Ensure minimum 30min for simulado
        if (tempoLeitura < 30) {
          tempoSimulado = tempoLeitura;
          tempoLeitura = 0;
          paginasHoje = 0;
        } else {
          tempoSimulado = 30;
          tempoLeitura -= 30;
        }

        // Cap at remaining pages
        const remainingPages = totalPaginas - paginaAtual;
        paginasHoje = Math.min(paginasHoje, Math.max(1, remainingPages));

        paginaAtual += paginasHoje;

        cronogramaDatas.push({
          user_id: data.userId,
          dia_numero: diaAtual,
          data_agendada: dataFormatada,
          paginas_leitura: `Pág ${paginaAtual - paginasHoje} a ${paginaAtual}`,
          qtd_simulados_meta: simuladosMeta,
          concluido: false
        });

        diaAtual++;
      }

      // Insert all days
      const { error: insertError } = await supabase
        .from("cronograma_dias")
        .insert(cronogramaDatas);

      if (insertError) {
        throw new Error("Erro ao gerar cronograma: " + insertError.message);
      }
    }

    return { 
      success: true, 
      message: "Cronograma gerado com sucesso",
      is_intensive_mode: studyConfig?.is_intensive_mode || false,
      config: studyConfig
    };
  });

export const calcularRankingDiario = createServerFn({ method: "POST" })
  .inputValidator((d: { userId: string; data: string }) => d)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    
    const targetDate = new Date(data.targetDate).toISOString().split('T')[0];
    
    // Get all simulados completed by users on that date
    // We need to query the simulados table or historical data
    // For now, calculate based on historico_ranking and existing data
    
    // Get ranking for the specific date
    const { data: ranking, error: rankingError } = await supabaseAdmin
      .from("historico_ranking")
      .select("*")
      .eq("data", targetDate)
      .order("pontuacao_dia", { ascending: false });

    if (rankingError) {
      throw new Error("Erro ao calcular ranking: " + rankingError.message);
    }

    // If no ranking exists for this date, calculate from simulados
    if (!ranking || ranking.length === 0) {
      // Calculate from simulados data - we need to get simulados completed today
      // This is a simplified version - real implementation would query question attempts
      const { data: todayRanking, error: calcError } = await supabaseAdmin
        .from("historico_ranking")
        .select("*")
        .gt("data", "2020-01-01") // fallback
        .limit(10);

      if (calcError) {
        throw new Error("Erro ao calcular ranking: " + calcError.message);
      }
      return { ranking: todayRanking || [], calculated: false };
    }

    return { ranking, calculated: true };
  });

// Helper function to check if user has cronograma
async function userHasCronograma(userId: string, supabase: any): Promise<boolean> {
  const { data: cronograma, error } = await supabase
    .from("cronograma_dias")
    .select("id", { count: exact, head: true })
    .eq("user_id", userId);
  
  if (error) return false;
  return (cronograma || 0) > 0;
}

export const gerarTextoRankingWhatsApp = createServerFn({ method: "POST" })
  .inputValidator((d: { data: string }) => d)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    
    const targetDate = data.data ? new Date(data.data).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    
    // Get top 3 users by score for that date
    const { data: ranking, error: rankingError } = await supabaseAdmin
      .from("historico_ranking")
      .select("user_id, pontuacao_dia, simulados_aprovados_hoje, simulados_gabaritados_hoje")
      .eq("data", targetDate)
      .order("pontuacao_dia", { ascending: false })
      .limit(3);

    if (rankingError) {
      throw new Error("Erro ao gerar ranking: " + rankingError.message);
    }

    if (!ranking || ranking.length === 0) {
      return { texto: "Nenhum dado de ranking disponível para este dia.", copia: false };
    }

    // Get user profiles for display names
    const userIds = ranking.map(r => r.user_id);
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from("profiles")
      .select("id, display_name")
      .in("id", userIds);

    if (profilesError) {
      throw new Error("Erro ao buscar perfis: " + profilesError.message);
    }

    const profileMap = new Map();
    profiles?.forEach(p => profileMap.set(p.id, p.display_name));

    // Generate formatted text
    let texto = "🏆 *Ranking do Dia* 🏆\n\n";
    
    ranking.forEach((item, index) => {
      const name = profileMap.get(item.user_id) || "Usuário";
      const score = item.pontuacao_dia || 0;
      const aprovados = item.simulados_aprovados_hoje || 0;
      const gabaritados = item.simulados_gabaritados_hoje || 0;
      
      let emoji = "🥉";
      if (index === 0) emoji = "🥇";
      else if (index === 1) emoji = "🥈";
      
      texto += `${emoji} *${index + 1}. ${name}*\n`;
      texto += `   Pontuação: *${score} pts*\n`;
      texto += `   Aprovados (>=80%): *${aprovados}*\n`;
      texto += `   Gabaritados (100%): *${gabaritados}*\n\n`;
    });

    texto += "---\n";
    texto += "📊 Dados gerados automaticamente pelo Nexia Drive";
    texto += "\n#Detran #Estudos #Cronograma";

    return { texto, copia: true };
  });

export const verificarSelos = createServerFn({ method: "POST" })
  .inputValidator((d: { userId: string; data: string }) => d)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    
    const targetDate = data.data ? new Date(data.data).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    const userId = data.userId;
    
    // Get today's simulados for this user
    const { data: rankingToday, error: rankingError } = await supabaseAdmin
      .from("historico_ranking")
      .select("*, simulados_aprovados_hoje, simulados_gabaritados_hoje")
      .eq("user_id", userId)
      .eq("data", targetDate)
      .maybeSingle();

    if (rankingError) {
      throw new Error("Erro ao verificar selos: " + rankingError.message);
    }

    let novosSelos: string[] = [];

    // Check for Selo Prata: 3 simulados with >= 80% no same day
    // Need to check simulados table for this user's performance today
    // Simplified: check if simulados_aprovados_hoje >= 3 with high scores
    
    if (rankingToday) {
      const acertos = rankingToday.simulados_gabaritados_hoje || 0;
      const aprovados = rankingToday.simulados_aprovados_hoje || 0;
      
      // Selo Ouro: GABARITAR 100% 3 simulados no mesmo dia
      // We need actual simulated data - this is a placeholder logic
      // In real implementation, query simulados attempts for user on this date
      
      // Selo Prata: 3 simulados with >= 80% no same day
      if (aprovados >= 3) {
        // Check if user already has this selo
        const { data: existingSelos } = await supabaseAdmin
          .from("profiles")
          .select("selos")
          .eq("id", userId)
          .maybeSingle();
        
        const selos = existingSelos?.selos || [];
        if (!selos.includes("Prata") && !novosSelos.includes("Prata")) {
          novosSelos.push("Prata");
          // Update profile with new selo
          await supabaseAdmin
            .from("profiles")
            .update({ selos: [...selos, "Prata"] })
            .eq("id", userId);
        }
      }
      
      // Selo Ouro: 100% (gabaritar) 3 simulados no same day
      // This requires checking actual simulado results - placeholder
      if (acertos >= 30 * 3) { // 30 questions each, 3 simulados = 90 total correct = 100%
        // Actually need to check 3 separate simulados with 100% each
        // Placeholder: if user has 300+ correct answers total today across simulados
        const { data: existingSelos } = await supabaseAdmin
          .from("profiles")
          .select("selos")
          .eq("id", userId)
          .maybeSingle();
        
        const selos = existingSelos?.selos || [];
        if (!selos.includes("Ouro") && !novosSelos.includes("Ouro")) {
          novosSelos.push("Ouro");
          await supabaseAdmin
            .from("profiles")
            .update({ selos: [...selos, "Ouro"] })
            .eq("id", userId);
        }
      }
    }

    return { 
      novosSelos, 
      rankingToday, 
      message: "Selos verificados com sucesso" 
    };
  });

