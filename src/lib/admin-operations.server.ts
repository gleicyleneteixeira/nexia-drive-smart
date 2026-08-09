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
    const { getExpiryDate } = await import("@/lib/subscription");

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
      .select("txid, plan_type, amount, status")
      .eq("user_id", data.userId)
      .order("created_at", { ascending: false })
      .limit(10);

    if (!txList || txList.length === 0) {
      return { ok: true, activated: false, reason: "no-transaction" };
    }

    // Varre todas as cobranças e ativa na primeira que estiver paga. Isso cobre
    // o caso de o usuário gerar mais de um QR Code (ex.: expirou o primeiro) e
    // ter pago a cobrança anterior à mais recente.
    let activatedTx: { txid: string; plan_type?: string | null; amount?: number | null } | null = null;
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
      if (finalStatus === "CONCLUIDA") {
        activatedTx = tx;
        break;
      }
    }

    if (!activatedTx) {
      return { ok: true, activated: false, reason: "not-paid" };
    }

    const expiresAt = getExpiryDate(activatedTx.plan_type ?? "1_month", activatedTx.amount).toISOString();
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
        expires_at: expiresAt,
        access_reason: "pago",
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.userId);
    if (error) throw new Error(error.message);

    return { ok: true, activated: true, expiresAt };
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

