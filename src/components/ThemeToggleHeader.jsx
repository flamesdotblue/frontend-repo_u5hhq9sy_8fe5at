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

  return (
    <header className={`w-full px-4 sm:px-6 py-4 flex items-center justify-between ${theme === 'vibrant' ? 'bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 text-white' : 'bg-white/80 backdrop-blur border-b border-gray-200 text-gray-800'}`}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg grid place-items-center font-bold ${theme==='vibrant' ? 'bg-white/20' : 'bg-gray-100 text-gray-700'}`}>S9</div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Sudoku Arena</h1>
          <p className={`text-xs ${theme==='vibrant' ? 'text-white/80' : 'text-gray-500'}`}>Compete. Climb. Conquer.</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-2">
          <Trophy className={theme==='vibrant' ? 'text-yellow-200' : 'text-yellow-500'} size={18} />
          <Users className={theme==='vibrant' ? 'text-white' : 'text-gray-700'} size={18} />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={activePlayer}
            onChange={(e) => setActivePlayer(e.target.value)}
            className={`px-3 py-2 rounded-md text-sm outline-none ${theme==='vibrant' ? 'bg-white/20 text-white placeholder-white/70' : 'bg-gray-100 text-gray-800'}`}
          >
            {players.map((p) => (
              <option key={p.name} value={p.name} className="text-gray-800">{p.name}</option>
            ))}
          </select>
          <input
            value={newPlayer}
            onChange={(e) => setNewPlayer(e.target.value)}
            placeholder="Add friend"
            className={`px-3 py-2 rounded-md text-sm outline-none ${theme==='vibrant' ? 'bg-white/20 placeholder-white/70 text-white' : 'bg-gray-100 text-gray-800'}`}
          />
          <button onClick={handleAdd} className={`px-3 py-2 rounded-md text-sm font-semibold ${theme==='vibrant' ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-gray-800 hover:bg-black text-white'}`}>Add</button>
        </div>
        <button
          aria-label="Toggle theme"
          onClick={() => setTheme(theme === 'vibrant' ? 'subtle' : 'vibrant')}
          className={`ml-2 p-2 rounded-md ${theme==='vibrant' ? 'bg-white/20 hover:bg-white/30' : 'bg-gray-100 hover:bg-gray-200'}`}
        >
          {theme === 'vibrant' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>
    </header>
  )
}
