export default function LevelSelector({ theme, difficulty, setDifficulty, level, setLevel }) {
  const difficulties = [
    { key: 'easy', label: 'Easy' },
    { key: 'medium', label: 'Medium' },
    { key: 'hard', label: 'Hard' },
  ]

  return (
    <div className={`w-full rounded-lg p-4 ${theme==='vibrant' ? 'bg-white/10 text-white' : 'bg-white border border-gray-200 text-gray-800'}`}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {difficulties.map(d => (
            <button
              key={d.key}
              onClick={() => setDifficulty(d.key)}
              className={`px-3 py-2 rounded-md text-sm font-semibold transition ${difficulty===d.key ? (theme==='vibrant' ? 'bg-white/30 text-white' : 'bg-gray-900 text-white') : (theme==='vibrant' ? 'bg-white/10 text-white/80 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200')}`}
            >
              {d.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm ${theme==='vibrant' ? 'text-white/80' : 'text-gray-500'}`}>Level</span>
          <input
            type="number"
            min={1}
            value={level}
            onChange={(e) => setLevel(Math.max(1, parseInt(e.target.value || '1')))}
            className={`w-20 px-3 py-2 rounded-md text-sm outline-none ${theme==='vibrant' ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-800'}`}
          />
          <button
            onClick={() => setLevel(level + 1)}
            className={`px-3 py-2 rounded-md text-sm font-semibold ${theme==='vibrant' ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-gray-800 hover:bg-black text-white'}`}
          >Next</button>
        </div>
      </div>
      <p className={`mt-3 text-sm ${theme==='vibrant' ? 'text-white/80' : 'text-gray-600'}`}>
        Keep advancing level-by-level within each difficulty. Puzzles get trickier as you go!
      </p>
    </div>
  )
}
