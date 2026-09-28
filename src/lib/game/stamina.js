// Stamina as Energy & Entry Fee Rules
export const MAX_STAMINA = 100;
export const REGEN_INTERVAL_MS = 120000; // 2 minutes per +1 stamina

export function getLevelEntryFee(lvl) {
  if (lvl <= 3) return 0;
  if (lvl <= 12) return 20;
  if (lvl <= 20) return 24;
  if (lvl <= 30) return 30;
  return 36; // 31~50
}

export function getLevelClearRefund(lvl) {
  if (lvl <= 3) return 0;
  if (lvl <= 12) return 10;
  if (lvl <= 20) return 12;
  if (lvl <= 30) return 15;
  return 18; // 31~50
}

export function initGlobalStamina() {
  try {
    const saved = localStorage.getItem('rabbit_global_stamina');
    const current = saved !== null ? parseInt(saved, 10) : MAX_STAMINA;
    const lastRegenSaved = localStorage.getItem('rabbit_last_stamina_regen');
    const lastRegen = lastRegenSaved ? parseInt(lastRegenSaved, 10) : Date.now();

    if (current >= MAX_STAMINA) {
      localStorage.setItem('rabbit_global_stamina', String(MAX_STAMINA));
      localStorage.setItem('rabbit_last_stamina_regen', String(Date.now()));
      return { stamina: MAX_STAMINA, lastRegen: Date.now(), nextSec: 120 };
    }

    const now = Date.now();
    const elapsed = Math.max(0, now - lastRegen);
    const gained = Math.floor(elapsed / REGEN_INTERVAL_MS);
    const remainder = elapsed % REGEN_INTERVAL_MS;
    const newStamina = Math.min(MAX_STAMINA, current + gained);
    const newLastRegen = newStamina >= MAX_STAMINA ? now : (now - remainder);

    localStorage.setItem('rabbit_global_stamina', String(newStamina));
    localStorage.setItem('rabbit_last_stamina_regen', String(newLastRegen));
    const nextSec = Math.max(1, Math.ceil((REGEN_INTERVAL_MS - remainder) / 1000));

    return { stamina: newStamina, lastRegen: newLastRegen, nextSec };
  } catch {
    return { stamina: MAX_STAMINA, lastRegen: Date.now(), nextSec: 120 };
  }
}
