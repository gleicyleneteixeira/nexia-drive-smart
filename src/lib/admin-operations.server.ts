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
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.userId);

    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const activateUser = createServerFn({ method: "POST" })
  .inputValidator((d: { userId: string }) => d)
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

    const { error } = await supabaseAdmin
      .from("profiles")
      .update({
        status: "ativo",
        expires_at: getExpiryDate(planType, amount).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.userId);

    if (error) throw new Error(error.message);
    return { ok: true, planType };
  });

export const checkLoginBlockSecure = createServerFn({ method: "POST" })
  .inputValidator((d: { input: string }) => d)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const inputClean = data.input.trim().toLowerCase();
    const cpfDigits = inputClean.replace(/\D/g, "");

    let query = supabaseAdmin.from("profiles").select("id, access_status, failed_attempts");

    if (cpfDigits && cpfDigits.length >= 11) {
      query = query.or(`email.eq.${inputClean},cpf.eq.${cpfDigits}`);
    } else {
      query = query.eq("email", inputClean);
    }

    const { data: profile } = await query.maybeSingle();
    if (!profile) return { blocked: false };

    const isBlocked = profile.access_status === "blocked" || (profile.failed_attempts ?? 0) >= 3;
    return { blocked: isBlocked };
  });

export const recordFailedLoginAttempt = createServerFn({ method: "POST" })
  .inputValidator((d: { input: string }) => d)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const inputClean = data.input.trim().toLowerCase();
    const cpfDigits = inputClean.replace(/\D/g, "");

    let query = supabaseAdmin.from("profiles").select("id, failed_attempts");

    if (cpfDigits && cpfDigits.length >= 11) {
      query = query.or(`email.eq.${inputClean},cpf.eq.${cpfDigits}`);
    } else {
      query = query.eq("email", inputClean);
    }

    const { data: profile } = await query.maybeSingle();
    if (!profile) return { success: false };

    const currentAttempts = profile.failed_attempts ?? 0;
    const newAttempts = currentAttempts + 1;
    const isBlockedNow = newAttempts >= 3;

    await supabaseAdmin
      .from("profiles")
      .update({
        failed_attempts: newAttempts,
        access_status: isBlockedNow ? "blocked" : "active"
      })
      .eq("id", profile.id);

    return { success: true, attempts: newAttempts, blocked: isBlockedNow };
  });

export const resetFailedLoginAttempts = createServerFn({ method: "POST" })
  .inputValidator((d: { userId: string }) => d)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin
      .from("profiles")
      .update({
        failed_attempts: 0,
        access_status: "active"
      })
      .eq("id", data.userId);

    return { success: true };
  });

