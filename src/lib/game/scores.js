const KEY = 'bunny_leaderboard';

export function getScores() {
  return JSON.parse(localStorage.getItem(KEY) || '[]');
}

export function addScore(entry) {
  const list = getScores();
  list.push(entry);
  list.sort((a, b) => b.score - a.score);
  const top = list.slice(0, 10);
  localStorage.setItem(KEY, JSON.stringify(top));
  const i = top.findIndex((e) => e.id === entry.id);
  return i >= 0 ? i + 1 : 11;
}