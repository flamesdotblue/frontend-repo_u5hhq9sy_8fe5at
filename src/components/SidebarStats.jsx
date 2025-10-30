import React, { useMemo } from 'react';
import { Medal, Flame } from 'lucide-react';

function classNames(...arr) {
  return arr.filter(Boolean).join(' ');
}

function formatTime(sec) {
  if (!sec && sec !== 0) return '—';
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function computeStreak(daysPlayed) {
  if (!Array.isArray(daysPlayed) || daysPlayed.length === 0) return 0;
  const set = new Set(daysPlayed);
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 3650; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if (set.has(key)) streak++;
    else break;
  }
  return streak;
}

export default function SidebarStats({ theme, players, activePlayer }) {
  const isVibrant = theme === 'vibrant';

  const leaderboard = useMemo(() => {
    const entries = players.map((p) => {
      const bests = [p.stats.easy.bestTime, p.stats.medium.bestTime, p.stats.hard.bestTime].filter((x) => typeof x === 'number');
      const best = bests.length ? Math.min(...bests) : null;
      return { id: p.id, name: p.name, best, games: p.totalGames || 0, days: p.daysPlayed?.length || 0 };
    });
    return entries.sort((a, b) => {
      if (a.best == null && b.best == null) return b.games - a.games;
      if (a.best == null) return 1;
      if (b.best == null) return -1;
      if (a.best !== b.best) return a.best - b.best;
      return b.games - a.games;
    });
  }, [players]);

  const active = players.find((p) => p.id === activePlayer);
  const streak = active ? computeStreak(active.daysPlayed || []) : 0;

  const badges = useMemo(() => {
    const b = [];
    const games = active?.totalGames || 0;
    const days = active?.daysPlayed?.length || 0;
    if (games >= 10) b.push('10 Games');
    if (games >= 25) b.push('25 Games');
    if (games >= 50) b.push('50 Games');
    if (days >= 3) b.push('3 Days');
    if (days >= 7) b.push('7 Days');
    if (days >= 30) b.push('30 Days');
    return b;
  }, [active]);

  return (
    <aside className={classNames('rounded-xl border p-4 sm:p-5 shadow flex flex-col gap-4', isVibrant ? 'bg-emerald-950/70 border-emerald-800' : 'bg-emerald-50 border-emerald-200')}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Medal size={18} className={isVibrant ? 'text-emerald-300' : 'text-emerald-700'} />
          <h3 className="text-sm font-semibold">Leaderboard</h3>
        </div>
        <div className="text-xs whitespace-nowrap">
          <span className={isVibrant ? 'text-emerald-300/80' : 'text-emerald-700/70'}>Players: {players.length}</span>
        </div>
      </div>
      <ul className="flex flex-col gap-2">
        {leaderboard.length === 0 && (
          <li className={classNames('text-sm', isVibrant ? 'text-emerald-300/80' : 'text-emerald-700/80')}>No players yet</li>
        )}
        {leaderboard.map((e, idx) => (
          <li
            key={e.id}
            className={classNames(
              'flex items-center justify-between rounded-lg px-3 py-2 border',
              isVibrant ? 'border-emerald-800 bg-emerald-900/40' : 'border-emerald-200 bg-white'
            )}
          >
            <div className="flex items-center gap-2">
              <div
                className={classNames(
                  'h-6 w-6 rounded-md flex items-center justify-center text-xs font-bold',
                  isVibrant ? 'bg-emerald-800 text-emerald-100' : 'bg-emerald-100 text-emerald-800'
                )}
              >
                {idx + 1}
              </div>
              <div className={classNames('text-sm', isVibrant ? 'text-emerald-100' : 'text-emerald-900')}>{e.name}</div>
            </div>
            <div className={classNames('text-xs', isVibrant ? 'text-emerald-300' : 'text-emerald-700')}>
              Best: {formatTime(e.best)} • Games: {e.games}
            </div>
          </li>
        ))}
      </ul>

      <div className="border-t pt-3 mt-2 border-emerald-800/40" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame size={18} className={isVibrant ? 'text-emerald-300' : 'text-emerald-700'} />
          <h3 className="text-sm font-semibold">Streak</h3>
        </div>
        <div className={classNames('text-sm font-medium', isVibrant ? 'text-emerald-100' : 'text-emerald-900')}>{streak} day{streak === 1 ? '' : 's'}</div>
      </div>

      <div>
        <h4 className={classNames('text-xs mb-2', isVibrant ? 'text-emerald-300/80' : 'text-emerald-700/70')}>Badges</h4>
        {badges.length === 0 ? (
          <div className={classNames('text-xs', isVibrant ? 'text-emerald-300/80' : 'text-emerald-700/80')}>Play to earn badges</div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {badges.map((b) => (
              <span
                key={b}
                className={classNames(
                  'text-xs px-2 py-1 rounded-full border',
                  isVibrant ? 'bg-emerald-900/50 border-emerald-700 text-emerald-200' : 'bg-white border-emerald-300 text-emerald-700'
                )}
              >
                {b}
              </span>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
