import { Trophy, Medal, Flame } from 'lucide-react'

function formatTime(sec) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

function computeStreak(days) {
  // days: array of 'YYYY-MM-DD' sorted? we'll compute fresh
  const set = new Set(days)
  let streak = 0
  const today = new Date()
  for (let i = 0; ; i++) {
    const d = new Date()
    d.setDate(today.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    if (set.has(key)) streak++
    else break
  }
  return streak
}

export default function SidebarStats({ theme, difficulty, players, activePlayer }) {
  const sorted = [...players]
    .map(p => ({
      name: p.name,
      best: p.stats?.[difficulty]?.bestTime ?? null,
      games: p.stats?.[difficulty]?.games ?? 0,
      days: p.daysPlayed || [],
      totalGames: p.totalGames || 0,
    }))
    .sort((a, b) => {
      if (a.best == null && b.best == null) return 0
      if (a.best == null) return 1
      if (b.best == null) return -1
      return a.best - b.best
    })

  const me = players.find(p => p.name === activePlayer)
  const streak = computeStreak(me?.daysPlayed || [])

  const badges = []
  const completed = me?.totalGames || 0
  for (let m = 50; m <= completed; m += 50) badges.push(`${m} games`)
  const dayBadges = Math.floor((me?.daysPlayed?.length || 0) / 50)
  for (let i = 1; i <= dayBadges; i++) badges.push(`${i * 50} days`)

  const myRank = sorted.findIndex(s => s.name === activePlayer) + 1

  return (
    <aside className={`w-full rounded-lg p-4 ${theme==='vibrant' ? 'bg-white/10 text-white' : 'bg-white border border-gray-200 text-gray-800'}`}>
      <div className="flex items-center gap-2 mb-3">
        <Trophy className={theme==='vibrant' ? 'text-yellow-200' : 'text-yellow-500'} size={18} />
        <h3 className="font-semibold">Leaderboard ({difficulty})</h3>
      </div>
      <div className="space-y-2 mb-4 max-h-48 overflow-auto pr-1">
        {sorted.map((p, idx) => (
          <div key={p.name} className={`flex items-center justify-between text-sm rounded-md px-2 py-2 ${p.name===activePlayer ? (theme==='vibrant' ? 'bg-white/20' : 'bg-gray-100') : ''}`}>
            <div className="flex items-center gap-2">
              <span className={`w-6 text-center font-semibold ${idx<3 ? 'text-yellow-500' : ''}`}>{idx+1}</span>
              <span>{p.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className={p.best==null ? 'text-gray-400' : ''}>{p.best==null ? '—' : formatTime(p.best)}</span>
              <span className="text-xs text-gray-400">{p.games} games</span>
            </div>
          </div>
        ))}
        {sorted.length === 0 && (
          <div className="text-sm text-gray-400">No players yet. Add friends above.</div>
        )}
      </div>

      <div className="flex items-center gap-2 mb-2">
        <Flame className={theme==='vibrant' ? 'text-orange-200' : 'text-orange-600'} size={18} />
        <h3 className="font-semibold">Your streak</h3>
      </div>
      <div className={`mb-4 text-sm ${theme==='vibrant' ? 'text-white/80' : 'text-gray-600'}`}>
        {streak} day streak • {me?.totalGames || 0} total games
      </div>

      <div className="flex items-center gap-2 mb-2">
        <Medal className={theme==='vibrant' ? 'text-emerald-200' : 'text-emerald-600'} size={18} />
        <h3 className="font-semibold">Badges</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {badges.length === 0 && <span className={`text-sm ${theme==='vibrant' ? 'text-white/70' : 'text-gray-500'}`}>Keep playing to earn badges at 50, 100, 150 games or days!</span>}
        {badges.map((b) => (
          <span key={b} className={`text-xs px-2 py-1 rounded-full ${theme==='vibrant' ? 'bg-emerald-500/30 text-white' : 'bg-emerald-100 text-emerald-700'}`}>{b}</span>
        ))}
      </div>

      <div className={`mt-4 text-xs ${theme==='vibrant' ? 'text-white/60' : 'text-gray-500'}`}>
        Tip: Invite friends by adding their names and let them take turns on your device. Rankings update automatically.
      </div>
    </aside>
  )
}
