export default function LevelSelector({ theme, difficulty, setDifficulty, level, setLevel }) {
  const difficulties = [
    { key: 'easy', label: 'Easy' },
    { key: 'medium', label: 'Medium' },
    { key: 'hard', label: 'Hard' },
  ]

  const isDark = theme === 'vibrant'

  return (
    <div className={`w-full rounded-lg p-4 shadow-sm ${isDark ? 'bg-emerald-900/40 text-emerald-50 border border-emerald-800' : 'bg-white border border-emerald-100 text-emerald-900'}`}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {difficulties.map(d => (
            <button
              key={d.key}
              onClick={() => setDifficulty(d.key)}
              className={`px-3 py-2 rounded-md text-sm font-semibold transition ${difficulty===d.key ? (isDark ? 'bg-emerald-500/30 text-emerald-50 ring-1 ring-emerald-300' : 'bg-emerald-600 text-white') : (isDark ? 'bg-emerald-900/40 text-emerald-200 hover:bg-emerald-900/60' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100')}`}
            >
              {d.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm ${isDark ? 'text-emerald-200' : 'text-emerald-700'}`}>Level</span>
          <input
            type="number"
            min={1}
            value={level}
            onChange={(e) => setLevel(Math.max(1, parseInt(e.target.value || '1')))}
            className={`w-20 px-3 py-2 rounded-md text-sm outline-none transition ring-1 ring-transparent focus:ring-2 ${isDark ? 'bg-emerald-900/40 text-emerald-50 focus:ring-emerald-300' : 'bg-emerald-50 text-emerald-900 focus:ring-emerald-300'}`}
          />
          <button
            onClick={() => setLevel(level + 1)}
            className={`px-3 py-2 rounded-md text-sm font-semibold transition ${isDark ? 'bg-emerald-500/30 hover:bg-emerald-500/40 text-emerald-50' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
          >Next</button>
        </div>
      </div>
      <p className={`mt-3 text-sm ${isDark ? 'text-emerald-200/80' : 'text-emerald-700'}`}>
        Keep advancing level-by-level within each difficulty. Puzzles get trickier as you go!
      </p>
    </div>
  )
}
