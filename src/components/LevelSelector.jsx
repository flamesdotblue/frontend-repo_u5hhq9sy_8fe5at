import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function LevelSelector({ difficulty, setDifficulty, levelIndex, setLevelIndex, totalLevels }) {
  const diffs = ['easy', 'medium', 'hard'];

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-3">
      <div className="flex items-center justify-center lg:justify-start gap-2">
        {diffs.map((d) => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            className={`px-4 py-2 rounded-md text-sm font-medium border transition ${
              difficulty === d
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-800'
            }`}
          >
            {d.charAt(0).toUpperCase() + d.slice(1)}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-center gap-2 text-emerald-800 dark:text-emerald-100">
        <span className="text-sm">Level {levelIndex + 1} of {totalLevels}</span>
      </div>
      <div className="flex items-center justify-center lg:justify-end gap-2">
        <button
          onClick={() => setLevelIndex((i) => Math.max(0, i - 1))}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 hover:bg-emerald-50 dark:hover:bg-emerald-800"
        >
          <ChevronLeft size={16} /> Prev
        </button>
        <button
          onClick={() => setLevelIndex((i) => Math.min(totalLevels - 1, i + 1))}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 hover:bg-emerald-50 dark:hover:bg-emerald-800"
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
