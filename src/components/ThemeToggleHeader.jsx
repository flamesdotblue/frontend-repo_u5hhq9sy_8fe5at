import { useState } from 'react'
import { Sun, Moon, Users, Trophy } from 'lucide-react'

export default function ThemeToggleHeader({ theme, setTheme, players, activePlayer, setActivePlayer, addPlayer }) {
  const [newPlayer, setNewPlayer] = useState('')

  const handleAdd = () => {
    const name = newPlayer.trim()
    if (!name) return
    addPlayer(name)
    setNewPlayer('')
  }

  const isDark = theme === 'vibrant'

  return (
    <header className={`w-full px-4 sm:px-6 py-4 flex items-center justify-between ${isDark ? 'bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-600 text-emerald-50' : 'bg-white/90 backdrop-blur border-b border-emerald-100 text-emerald-900'}`}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg grid place-items-center font-bold ${isDark ? 'bg-emerald-900/40 text-emerald-100' : 'bg-emerald-100 text-emerald-700'}`}>S9</div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Sudoku Arena</h1>
          <p className={`text-xs ${isDark ? 'text-emerald-50/80' : 'text-emerald-600'}`}>Compete. Climb. Conquer.</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-2">
          <Trophy className={isDark ? 'text-yellow-200' : 'text-yellow-600'} size={18} />
          <Users className={isDark ? 'text-emerald-50' : 'text-emerald-800'} size={18} />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={activePlayer}
            onChange={(e) => setActivePlayer(e.target.value)}
            className={`px-3 py-2 rounded-md text-sm outline-none transition ring-1 ring-transparent focus:ring-2 ${isDark ? 'bg-emerald-900/40 text-emerald-50 placeholder-emerald-200/70 focus:ring-emerald-300' : 'bg-emerald-50 text-emerald-900 focus:ring-emerald-300'}`}
          >
            {players.map((p) => (
              <option key={p.name} value={p.name} className="text-emerald-900">{p.name}</option>
            ))}
          </select>
          <input
            value={newPlayer}
            onChange={(e) => setNewPlayer(e.target.value)}
            placeholder="Add friend"
            className={`px-3 py-2 rounded-md text-sm outline-none transition ring-1 ring-transparent focus:ring-2 ${isDark ? 'bg-emerald-900/40 placeholder-emerald-200/70 text-emerald-50 focus:ring-emerald-300' : 'bg-emerald-50 text-emerald-900 focus:ring-emerald-300'}`}
          />
          <button onClick={handleAdd} className={`px-3 py-2 rounded-md text-sm font-semibold transition ${isDark ? 'bg-emerald-500/30 hover:bg-emerald-500/40 text-emerald-50' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}>Add</button>
        </div>
        <button
          aria-label="Toggle theme"
          onClick={() => setTheme(isDark ? 'subtle' : 'vibrant')}
          className={`ml-2 p-2 rounded-md transition ring-1 ring-transparent focus:ring-2 ${isDark ? 'bg-emerald-900/40 hover:bg-emerald-900/50 focus:ring-emerald-300' : 'bg-emerald-50 hover:bg-emerald-100 focus:ring-emerald-300'}`}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  )
}
