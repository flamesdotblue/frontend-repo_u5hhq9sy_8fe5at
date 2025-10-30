import React, { useState } from 'react';
import { Sun, Moon, Users, PlusCircle } from 'lucide-react';

function classNames(...arr) {
  return arr.filter(Boolean).join(' ');
}

export default function ThemeToggleHeader({ theme, onToggleTheme, players, activePlayer, onAddPlayer, onSelectPlayer }) {
  const [name, setName] = useState('');

  const isVibrant = theme === 'vibrant';

  return (
    <header
      className={classNames(
        'w-full rounded-xl border px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center gap-4 justify-between shadow',
        isVibrant
          ? 'bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 border-emerald-800 text-emerald-50'
          : 'bg-emerald-50 border-emerald-200 text-emerald-900'
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={classNames(
            'h-10 w-10 rounded-lg flex items-center justify-center font-bold',
            isVibrant ? 'bg-emerald-800 text-emerald-50' : 'bg-emerald-100 text-emerald-800'
          )}
        >
          SA
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Sudoku Arena</h1>
          <p className={classNames('text-xs', isVibrant ? 'text-emerald-300/80' : 'text-emerald-700/70')}>Compete, improve, and keep your streak alive</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onToggleTheme}
          className={classNames(
            'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition shadow-sm',
            isVibrant
              ? 'bg-emerald-800/70 hover:bg-emerald-700 border border-emerald-700 text-emerald-50'
              : 'bg-white hover:bg-emerald-100 border border-emerald-200 text-emerald-900'
          )}
          aria-label="Toggle theme"
        >
          {isVibrant ? <Sun size={16} /> : <Moon size={16} />}
          <span>{isVibrant ? 'Mint' : 'Emerald'}</span>
        </button>

        <div className="flex items-center gap-2">
          <div className={classNames('hidden sm:flex items-center text-sm', isVibrant ? 'text-emerald-200' : 'text-emerald-700')}>
            <Users size={16} className="mr-1" /> Players
          </div>
          <select
            className={classNames(
              'rounded-lg px-3 py-2 text-sm outline-none focus:ring-2',
              isVibrant
                ? 'bg-emerald-900 border border-emerald-700 text-emerald-50 focus:ring-emerald-600'
                : 'bg-white border border-emerald-300 text-emerald-900 focus:ring-emerald-400'
            )}
            value={activePlayer ?? ''}
            onChange={(e) => onSelectPlayer(e.target.value)}
          >
            <option value="" disabled>
              Select player
            </option>
            {players.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const n = name.trim();
              if (!n) return;
              onAddPlayer(n);
              setName('');
            }}
            className="flex items-center gap-2"
          >
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Add name"
              className={classNames(
                'rounded-lg px-3 py-2 text-sm outline-none focus:ring-2',
                isVibrant
                  ? 'bg-emerald-900 border border-emerald-700 text-emerald-50 placeholder:text-emerald-400 focus:ring-emerald-600'
                  : 'bg-white border border-emerald-300 text-emerald-900 placeholder:text-emerald-500 focus:ring-emerald-400'
              )}
            />
            <button
              type="submit"
              className={classNames(
                'inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm transition',
                isVibrant
                  ? 'bg-emerald-700 hover:bg-emerald-600 text-emerald-50'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              )}
              aria-label="Add player"
            >
              <PlusCircle size={16} />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
