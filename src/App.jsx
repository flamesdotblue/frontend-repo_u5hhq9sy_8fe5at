import { useEffect, useMemo, useState } from 'react'
import ThemeToggleHeader from './components/ThemeToggleHeader'
import LevelSelector from './components/LevelSelector'
import SudokuBoard from './components/SudokuBoard'
import SidebarStats from './components/SidebarStats'

function loadPlayers() {
  const raw = localStorage.getItem('sudoku_players')
  if (raw) {
    try { return JSON.parse(raw) } catch {}
  }
  const def = [{ name: 'Player 1', stats: { easy:{games:0,bestTime:null}, medium:{games:0,bestTime:null}, hard:{games:0,bestTime:null} }, daysPlayed: [], totalGames: 0 }]
  localStorage.setItem('sudoku_players', JSON.stringify(def))
  localStorage.setItem('sudoku_active', 'Player 1')
  return def
}

function savePlayers(players) {
  localStorage.setItem('sudoku_players', JSON.stringify(players))
}

export default function App() {
  const [theme, setTheme] = useState('vibrant') // 'vibrant' (dark green) | 'subtle' (light mint)
  const [players, setPlayers] = useState(() => loadPlayers())
  const [activePlayer, setActivePlayer] = useState(() => localStorage.getItem('sudoku_active') || (players[0]?.name ?? ''))
  const [difficulty, setDifficulty] = useState('easy')
  const [level, setLevel] = useState(1)

  useEffect(() => {
    localStorage.setItem('sudoku_active', activePlayer)
  }, [activePlayer])

  useEffect(() => {
    savePlayers(players)
  }, [players])

  const addPlayer = (name) => {
    setPlayers((prev) => {
      if (prev.some(p => p.name.toLowerCase() === name.toLowerCase())) return prev
      return [...prev, { name, stats: { easy:{games:0,bestTime:null}, medium:{games:0,bestTime:null}, hard:{games:0,bestTime:null} }, daysPlayed: [], totalGames: 0 }]
    })
    setActivePlayer(name)
  }

  const onComplete = (elapsedSeconds) => {
    setPlayers((prev) => prev.map(p => {
      if (p.name !== activePlayer) return p
      const s = { ...p.stats }
      const cur = { ...(s[difficulty] || { games: 0, bestTime: null }) }
      cur.games = (cur.games || 0) + 1
      if (cur.bestTime == null || elapsedSeconds < cur.bestTime) cur.bestTime = elapsedSeconds
      s[difficulty] = cur
      const today = new Date().toISOString().slice(0,10)
      const daysSet = new Set(p.daysPlayed || [])
      daysSet.add(today)
      return { ...p, stats: s, daysPlayed: Array.from(daysSet).sort(), totalGames: (p.totalGames || 0) + 1 }
    }))
    setLevel((l) => l + 1)
  }

  const bgClass = useMemo(() => theme === 'vibrant'
    ? 'bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950'
    : 'bg-emerald-50'
  , [theme])

  return (
    <div className={`min-h-screen ${bgClass}`}>
      <ThemeToggleHeader
        theme={theme}
        setTheme={setTheme}
        players={players}
        activePlayer={activePlayer}
        setActivePlayer={setActivePlayer}
        addPlayer={addPlayer}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <LevelSelector
            theme={theme}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            level={level}
            setLevel={setLevel}
          />
          <SudokuBoard
            theme={theme}
            difficulty={difficulty}
            level={level}
            onComplete={onComplete}
          />
        </div>
        <div className="lg:col-span-1">
          <SidebarStats
            theme={theme}
            difficulty={difficulty}
            players={players}
            activePlayer={activePlayer}
          />
        </div>
      </main>

      <footer className={`mt-6 pb-8 text-center text-sm ${theme==='vibrant' ? 'text-emerald-200' : 'text-emerald-700'}`}>
        Dark Green and Light Mint modes. Challenge friends locally and climb the leaderboard!
      </footer>
    </div>
  )
}
