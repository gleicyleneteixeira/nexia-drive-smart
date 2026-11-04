const PLAN_DAYS: Record<string, number> = {
  "1_month": 30,
  "3_months": 90,
  "6_months": 365,
  "1_year": 365,
};

export function getPlanDays(planType: string, amount?: number): number {
  let days = PLAN_DAYS[planType] ?? 365;
  if (planType === "1_month" && amount === 19.90) {
    days = 60;
  }
  if (amount === 29.9 || amount === 29.90) {
    days = 365;
  }
  return days;
}

export function getExpiryDate(planType: string, amount?: number): Date {
  const days = getPlanDays(planType, amount);
  const expires = new Date();
  expires.setDate(expires.getDate() + days);
  return expires;
}

export function getTrialExpiryDate(): Date {
  const expires = new Date();
  expires.setDate(expires.getDate() + 30);
  return expires;
}

export function isProfileExpired(profile: { status: string; expires_at: string | null; is_migrated?: boolean | null } | null): boolean {
  if (!profile) return true;
  if (profile.status !== "ativo") return true;
  if (!profile.expires_at) return false;
  return new Date(profile.expires_at) < new Date();
}
