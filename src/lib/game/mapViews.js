const KEY = 'bunny_map_views';
const FREE_PER_DAY = 2;
const today = () => new Date().toISOString().slice(0, 10);

export function getFreeViews() {
  try {
    const raw = localStorage.getItem(KEY);
    const d = raw ? JSON.parse(raw) : {};
    return d.date === today() ? Math.max(0, FREE_PER_DAY - (d.used || 0)) : FREE_PER_DAY;
  } catch {
    return FREE_PER_DAY;
  }
}

export function consumeFreeView() {
  try {
    const left = getFreeViews();
    localStorage.setItem(KEY, JSON.stringify({ date: today(), used: FREE_PER_DAY - left + 1 }));
    return left - 1;
  } catch {
    return 0;
  }
}