import crypto from "crypto";

export function verifyVapiSignature(
  _body: string,
  secret: string | null
): boolean {
  if (!secret) return false;
  const expected = process.env.VAPI_WEBHOOK_SECRET!;
  if (secret.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(secret), Buffer.from(expected));
}

export function generateSlots(
  startDate: Date,
  endDate: Date,
  busyRanges: { start: Date; end: Date }[],
  durationMin = 30
): string[] {
  const slots: string[] = [];
  const cur = new Date(startDate);
  cur.setMinutes(0, 0, 0);

  while (cur <= endDate) {
    const dayOfWeek = cur.getDay();
    const hour = cur.getHours();

    // Pazar kapalı (0), Cumartesi 10-14
    if (dayOfWeek === 0) { cur.setDate(cur.getDate() + 1); cur.setHours(9, 0, 0, 0); continue; }
    if (dayOfWeek === 6 && (hour < 10 || hour >= 14)) {
      if (hour >= 14) { cur.setDate(cur.getDate() + 2); cur.setHours(9, 0, 0, 0); }
      else cur.setHours(10, 0, 0, 0);
      continue;
    }
    if (dayOfWeek !== 6 && (hour < 9 || hour >= 19)) {
      if (hour >= 19) { cur.setDate(cur.getDate() + 1); cur.setHours(9, 0, 0, 0); }
      else cur.setHours(9, 0, 0, 0);
      continue;
    }

    const slotEnd = new Date(cur.getTime() + durationMin * 60000);
    const isBusy = busyRanges.some(
      (r) => cur < r.end && slotEnd > r.start
    );

    if (!isBusy) {
      slots.push(cur.toISOString());
    }

    cur.setMinutes(cur.getMinutes() + durationMin);
  }

  return slots;
}
