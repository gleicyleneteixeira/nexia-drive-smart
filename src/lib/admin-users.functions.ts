import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const adminResetUserPassword = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z.object({
      userId: z.string().uuid(),
      newPassword: z.string().min(6).max(72),
    }).parse(data)
  )
  .handler(async ({ data, context }) => {
    // Verify caller is admin
    const { data: isAdmin, error: roleErr } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (roleErr) throw new Error("Falha ao verificar permissões.");
    if (!isAdmin) throw new Error("Acesso negado.");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.auth.admin.updateUserById(data.userId, {
      password: data.newPassword,
    });
    if (error) throw new Error(error.message);

    // Unblock user and mark as needing password reset on next login
    await supabaseAdmin
      .from("profiles")
      .update({
        failed_attempts: 0,
        access_status: "active",
        needs_new_password: true,
      })
      .eq("id", data.userId);

    return { ok: true };
  });

export type SalesReportProfile = {
  id: string;
  display_name: string | null;
  email: string | null;
  phone: string | null;
};

export type SalesReportRow = {
  id: string;
  user_id: string;
  amount: number | null;
  plan_type: string | null;
  status: string;
  created_at: string;
};

export const getSalesReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin, error: roleErr } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (roleErr) throw new Error("Falha ao verificar permissões.");
    if (!isAdmin) throw new Error("Acesso negado.");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: tx, error } = await supabaseAdmin
      .from("pix_transactions")
      .select("id, user_id, amount, plan_type, status, created_at")
      .eq("status", "CONCLUIDA")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);

    const sales = (tx ?? []) as SalesReportRow[];
    if (sales.length === 0) {
      return { sales: [], profiles: [] as SalesReportProfile[] };
    }

    const ids = Array.from(new Set(sales.map((s) => s.user_id)));
    const { data: profs } = await supabaseAdmin
      .from("profiles")
      .select("id, display_name, email, phone")
      .in("id", ids);

    return {
      sales,
      profiles: (profs ?? []) as SalesReportProfile[],
    };
  });