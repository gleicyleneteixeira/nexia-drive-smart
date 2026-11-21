import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export interface UserPointsRankingEntry {
  userId: string;
  displayName: string;
  points: number;
  isCurrentUser: boolean;
}

export const fetchUserPointsRanking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("get_user_points_ranking");
    if (error) throw new Error(`Não foi possível carregar o ranking: ${error.message}`);

    return (data ?? []).map((entry) => ({
      userId: entry.user_id,
      displayName: entry.display_name,
      points: Number(entry.total_points),
      isCurrentUser: entry.user_id === context.userId,
    }));
  });
