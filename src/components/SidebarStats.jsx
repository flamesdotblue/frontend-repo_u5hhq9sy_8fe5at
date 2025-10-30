import React, { useMemo } from 'react';
import { Trophy, Medal, Flame } from 'lucide-react';

function formatSecs(secs) {
  if (secs == null) return '—';
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function calcStreak(daysPlayed) {
  // daysPlayed: array of YYYY-MM-DD strings
  const set = new Set(daysPlayed);
  let streak = 0;
  const today = new Date();
  for (let i = 0; ; i++) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if (set.has(key)) streak++;
    else break;
  }
  return streak;
}

export default function SidebarStats({ players, difficulty }) {
  const leaderboard = useMemo(() => {
    return [...players]
      .map((p) => ({
        id: p.id,
        name: p.name,
        bestTime: p.stats?.[difficulty]?.bestTime ?? null,
        games: p.stats?.[difficulty]?.games ?? 0,
        streak: calcStreak(p.daysPlayed || []),
        totalGames: p.totalGames || 0,
      }))
      .sort((a, b) => {
        const aTime = a.bestTime ?? Infinity;
        const bTime = b.bestTime ?? Infinity;
        if (aTime !== bTime) return aTime - bTime;
        return b.games - a.games;
      });
  }, [players, difficulty]);

  return (
    <aside className="space-y-3">
      <div className="bg-white/70 dark:bg-emerald-900/60 border border-emerald-100 dark:border-emerald-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2 text-emerald-900 dark:text-emerald-100">
          <Trophy size={18} />
          <h3 className="font-semibold">Leaderboard ({difficulty})</h3>
        </div>
        <div className="space-y-2">
          {leaderboard.length === 0 && (
            <div className="text-sm text-emerald-700/70 dark:text-emerald-200/70">No players yet. Add one to get started.</div>
          )}
          {leaderboard.map((p, idx) => (
            <div key={p.id} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100">{idx + 1}</span>
                <span className="font-medium text-emerald-900 dark:text-emerald-100">{p.name}</span>
              </div>
              <div className="flex items-center gap-3 text-emerald-800 dark:text-emerald-200">
                <span>Best: {formatSecs(p.bestTime)}</span>
                <span>Games: {p.games}</span>
                <span className="inline-flex items-center gap-1"><Flame size={14} /> {p.streak}d</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/70 dark:bg-emerald-900/60 border border-emerald-100 dark:border-emerald-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2 text-emerald-900 dark:text-emerald-100">
          <Medal size={18} />
          <h3 className="font-semibold">Badges</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {players.map((p) => {
            const streak = calcStreak(p.daysPlayed || []);
            const badges = [];
            if (p.totalGames >= 1) badges.push({ label: 'Rookie', tone: 'emerald' });
            if (p.totalGames >= 10) badges.push({ label: 'Enthusiast', tone: 'emerald' });
            if (p.totalGames >= 25) badges.push({ label: 'Veteran', tone: 'emerald' });
            if (streak >= 3) badges.push({ label: '3-Day Streak', tone: 'mint' });
            if (streak >= 7) badges.push({ label: '7-Day Streak', tone: 'mint' });
            return (
              <div key={p.id} className="min-w-[200px] bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-md px-3 py-2">
                <div className="text-xs font-semibold mb-1 text-emerald-900 dark:text-emerald-100">{p.name}</div>
                <div className="flex flex-wrap gap-1">
                  {badges.length === 0 && (
                    <span className="text-xs text-emerald-700/70 dark:text-emerald-200/70">No badges yet</span>
                  )}
                  {badges.map((b, i) => (
                    <span key={i} className="text-[11px] px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100">{b.label}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
