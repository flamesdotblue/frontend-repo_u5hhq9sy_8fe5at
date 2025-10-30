import { useEffect, useState } from 'react';
import { Moon, Sun, UserPlus } from 'lucide-react';

const STORAGE_KEY_PLAYERS = 'sudoku_players';
const STORAGE_KEY_ACTIVE = 'sudoku_active';
const THEME_KEY = 'theme';

export default function ThemeToggleHeader({ players, setPlayers, activePlayerId, setActivePlayerId }) {
  const [theme, setTheme] = useState('dark');
  const [name, setName] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY) || 'dark';
    setTheme(saved);
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const addPlayer = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const newPlayer = {
      id: crypto.randomUUID(),
      name: trimmed,
      stats: {
        easy: { games: 0, bestTime: null },
        medium: { games: 0, bestTime: null },
        hard: { games: 0, bestTime: null },
      },
      daysPlayed: [],
      totalGames: 0,
    };
    const updated = [...players, newPlayer];
    setPlayers(updated);
    setActivePlayerId(newPlayer.id);
    setName('');
    localStorage.setItem(STORAGE_KEY_PLAYERS, JSON.stringify(updated));
    localStorage.setItem(STORAGE_KEY_ACTIVE, newPlayer.id);
  };

  return (
    <header className="w-full sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-white/40 dark:supports-[backdrop-filter]:bg-emerald-950/40 bg-white/70 dark:bg-emerald-950/70 border-b border-emerald-100/50 dark:border-emerald-800/50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-md bg-emerald-500/20 border border-emerald-500/50" />
          <div className="leading-tight">
            <h1 className="text-lg font-semibold text-emerald-800 dark:text-emerald-100">Sudoku Arena</h1>
            <p className="text-xs text-emerald-700/70 dark:text-emerald-200/70">Levels. Compete. Level up. Keep your streak alive.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="inline-flex items-center gap-2 rounded-md border border-emerald-200 dark:border-emerald-800 px-3 py-2 text-sm text-emerald-900 dark:text-emerald-100 bg-white dark:bg-emerald-900 hover:bg-emerald-50 dark:hover:bg-emerald-800 transition"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            <span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>
          <div className="flex items-center gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Add player"
              className="h-9 w-36 sm:w-48 rounded-md border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-emerald-900 px-3 text-sm text-emerald-900 dark:text-emerald-100 placeholder-emerald-400/70 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
            <button onClick={addPlayer} className="inline-flex items-center gap-2 h-9 px-3 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition">
              <UserPlus size={16} />
              <span className="hidden sm:inline">Add</span>
            </button>
          </div>
          <select
            value={activePlayerId || ''}
            onChange={(e) => {
              setActivePlayerId(e.target.value);
              localStorage.setItem(STORAGE_KEY_ACTIVE, e.target.value);
            }}
            className="h-9 rounded-md border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-emerald-900 px-3 text-sm text-emerald-900 dark:text-emerald-100"
          >
            <option value="" disabled>Select player</option>
            {players.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}
