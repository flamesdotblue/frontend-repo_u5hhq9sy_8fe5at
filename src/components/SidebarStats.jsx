function formatSecs(s) {
  if (s == null) return '—';
  const m = Math.floor(s / 60).toString().padStart(2, '0');
  const ss = (s % 60).toString().padStart(2, '0');
  return `${m}:${ss}`;
}

function calcStreak(daysPlayed) {
  if (!Array.isArray(daysPlayed) || daysPlayed.length === 0) return 0;
  const set = new Set(daysPlayed);
  let streak = 0;
  let d = new Date();
  while (true) {
    const key = d.toISOString().slice(0, 10);
    if (set.has(key)) {
      streak += 1;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export default function SidebarStats({ players }) {
  const leaderboard = [...players].sort((a, b) => {
    const aBest = Math.min(
      a.stats.easy.bestTime ?? Infinity,
      a.stats.medium.bestTime ?? Infinity,
      a.stats.hard.bestTime ?? Infinity
    );
    const bBest = Math.min(
      b.stats.easy.bestTime ?? Infinity,
      b.stats.medium.bestTime ?? Infinity,
      b.stats.hard.bestTime ?? Infinity
    );
  
    if (aBest === bBest) return (b.totalGames || 0) - (a.totalGames || 0);
    return aBest - bBest;
  });

  return (
    <aside className="w-full lg:w-80 flex-shrink-0">
      <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-emerald-900 p-4">
        <h3 className="text-sm font-semibold text-emerald-900 dark:text-emerald-100 mb-3">Leaderboard</h3>
        <div className="space-y-3">
          {leaderboard.map((p) => {
            const streak = calcStreak(p.daysPlayed);
            const best = Math.min(
              p.stats.easy.bestTime ?? Infinity,
              p.stats.medium.bestTime ?? Infinity,
              p.stats.hard.bestTime ?? Infinity
            );
            const badges = [];
            if ((p.totalGames ?? 0) >= 1) badges.push('Beginner');
            if ((p.totalGames ?? 0) >= 10) badges.push('Enthusiast');
            if ((p.totalGames ?? 0) >= 25) badges.push('Veteran');
            if (streak >= 3) badges.push('Hot Streak');
            if (streak >= 7) badges.push('Unstoppable');
            return (
              <div key={p.id} className="border border-emerald-200/60 dark:border-emerald-800/60 rounded-md p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">{p.name}</p>
                    <p className="text-xs text-emerald-700/70 dark:text-emerald-300/70">Best: {best === Infinity ? '—' : formatSecs(best)} • Games: {p.totalGames ?? 0}</p>
                  </div>
                  <div className="text-xs text-emerald-700 dark:text-emerald-200">🔥 {streak}d</div>
                </div>
                {badges.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {badges.map((b) => (
                      <span key={b} className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100 border border-emerald-300/60 dark:border-emerald-700/60">{b}</span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
