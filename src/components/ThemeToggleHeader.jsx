import React, { useState } from 'react';
import { Sun, Moon, Users, UserPlus } from 'lucide-react';

export default function ThemeToggleHeader({ theme, onToggleTheme, players, activePlayerId, onAddPlayer, onSelectPlayer }) {
  const [name, setName] = useState('');

  const handleAdd = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onAddPlayer(trimmed);
    setName('');
  };

  return (
    <header className="w-full">
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-600 text-white shadow">
            <Users size={20} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-emerald-900 dark:text-emerald-100">Sudoku Arena</h1>
            <p className="text-sm text-emerald-700/70 dark:text-emerald-200/60">Compete, level up, and keep your streak alive</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/70 dark:bg-emerald-900/60 backdrop-blur rounded-lg px-2 py-1 shadow border border-emerald-100 dark:border-emerald-800">
            <input
              className="bg-transparent focus:outline-none px-2 py-1 text-sm text-emerald-900 dark:text-emerald-100 placeholder-emerald-400"
              placeholder="Add player"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
            <button
              onClick={handleAdd}
              className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition"
            >
              <UserPlus size={14} /> Add
            </button>
          </div>

          <select
            value={activePlayerId || ''}
            onChange={(e) => onSelectPlayer(e.target.value)}
            className="text-sm bg-white/70 dark:bg-emerald-900/60 backdrop-blur px-3 py-2 rounded-md border border-emerald-100 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100"
          >
            <option value="">Select player</option>
            {players.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <button
            onClick={onToggleTheme}
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition shadow"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}
