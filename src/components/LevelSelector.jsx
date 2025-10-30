import React from 'react';
import { Trophy } from 'lucide-react';

function classNames(...arr) {
  return arr.filter(Boolean).join(' ');
}

export default function LevelSelector({ theme, difficulty, level, onChangeDifficulty, onChangeLevel, maxLevel }) {
  const isVibrant = theme === 'vibrant';

  const diffBtn = (key, label) => (
    <button
      key={key}
      onClick={() => onChangeDifficulty(key)}
      className={classNames(
        'px-3 py-2 rounded-lg text-sm font-medium border transition',
        difficulty === key
          ? isVibrant
            ? 'bg-emerald-800 border-emerald-700 text-emerald-50'
            : 'bg-emerald-600 border-emerald-600 text-white'
          : isVibrant
          ? 'bg-emerald-950 border-emerald-800 text-emerald-200 hover:bg-emerald-900'
          : 'bg-white border-emerald-300 text-emerald-700 hover:bg-emerald-100'
      )}
    >
      {label}
    </button>
  );

  return (
    <div
      className={classNames(
        'w-full rounded-xl border p-4 sm:p-5 flex flex-col gap-4 shadow',
        isVibrant ? 'bg-emerald-950/70 border-emerald-800' : 'bg-emerald-50 border-emerald-200'
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy size={18} className={isVibrant ? 'text-emerald-300' : 'text-emerald-700'} />
          <h2 className="text-sm font-semibold">Choose difficulty</h2>
        </div>
        <div className={classNames('text-xs', isVibrant ? 'text-emerald-300/80' : 'text-emerald-700/70')}>
          Level {level + 1} / {maxLevel}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {diffBtn('easy', 'Easy')}
        {diffBtn('medium', 'Medium')}
        {diffBtn('hard', 'Hard')}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={1}
          max={maxLevel}
          value={level + 1}
          onChange={(e) => {
            const v = parseInt(e.target.value || '1', 10);
            const idx = Math.min(Math.max(v, 1), maxLevel) - 1;
            onChangeLevel(idx);
          }}
          className={classNames(
            'w-28 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2',
            isVibrant
              ? 'bg-emerald-900 border border-emerald-700 text-emerald-50 focus:ring-emerald-600'
              : 'bg-white border border-emerald-300 text-emerald-900 focus:ring-emerald-400'
          )}
        />
        <div className={classNames('text-xs', isVibrant ? 'text-emerald-300/80' : 'text-emerald-700/70')}>
          Jump to level
        </div>
      </div>
    </div>
  );
}
