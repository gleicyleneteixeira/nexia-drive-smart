const PLAN_DAYS: Record<string, number> = {
  "1_month": 60, // Changed from 30 to 60 for the Buy 1 Get 1 Free promotion (60 days)
  "3_months": 90,
  "6_months": 180,
};

export function getExpiryDate(planType: string): Date {
  const days = PLAN_DAYS[planType] ?? 30;
  const expires = new Date();
  expires.setDate(expires.getDate() + days);
  return expires;
}

export function isProfileExpired(profile: { status: string; expires_at: string | null; is_migrated?: boolean | null } | null): boolean {
  if (!profile) return true;
  if (profile.is_migrated) return false;
  if (profile.status !== "ativo") return true;
  if (!profile.expires_at) return false;
  return new Date(profile.expires_at) < new Date();
}
