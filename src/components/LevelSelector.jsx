import React from 'react';

const difficulties = [
  { key: 'easy', label: 'Easy' },
  { key: 'medium', label: 'Medium' },
  { key: 'hard', label: 'Hard' },
];

export default function LevelSelector({ difficulty, onDifficultyChange, levelIndex, totalLevels, onPrev, onNext }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        {difficulties.map((d) => (
          <button
            key={d.key}
            onClick={() => onDifficultyChange(d.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition border ${
              difficulty === d.key
                ? 'bg-emerald-600 text-white border-emerald-700'
                : 'bg-white/70 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-100 border-emerald-100 dark:border-emerald-800 hover:bg-emerald-50/80 dark:hover:bg-emerald-900'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between bg-white/70 dark:bg-emerald-900/60 border border-emerald-100 dark:border-emerald-800 rounded-md p-3">
        <div className="text-sm text-emerald-800 dark:text-emerald-200">
          Level {levelIndex + 1} of {totalLevels}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onPrev} className="px-3 py-1 rounded-md text-sm bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-800 dark:text-emerald-100 dark:hover:bg-emerald-700">Prev</button>
          <button onClick={onNext} className="px-3 py-1 rounded-md text-sm bg-emerald-600 text-white hover:bg-emerald-700">Next</button>
        </div>
      </div>
    </div>
  );
}
