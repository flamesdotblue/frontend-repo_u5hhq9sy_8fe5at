import { useEffect, useMemo, useRef, useState } from 'react'
import { Play, Pause, RotateCcw, Check, Timer } from 'lucide-react'

// A small curated set of puzzles per difficulty (81-char strings, 0 = empty)
// Each has a corresponding solution.
const PUZZLES = {
  easy: [
    {
      p: '530070000600195000098000060800060003400803001700020006060000280000419005000080079',
      s: '534678912672195348198342567859761423426853791713924856961537284287419635345286179',
    },
    {
      p: '200080300060070084030500209000105408000000000402706000301007040720040060004010003',
      s: '245986371169273584837514269976125438318469752452736891691857342723348165584912673',
    },
    {
      p: '000260701680070090190004500820100040004602900050003028009300074040050036703018000',
      s: '435269781682571493197834562826195347374682915951743628519326874248957136763418259',
    },
  ],
  medium: [
    {
      p: '000000907000420180000705026100904000050000040000507009920108000034059000507000000',
      s: '843261957795423186261785326176934825352816749489527619928178564634259871517642938',
    },
    {
      p: '030050040008010500460000012070502080000603000040109070250000098001020600090050030',
      s: '139257846728416593465938712973542681812673954546189273257361498381724659694895327',
    },
    {
      p: '300200000000107000706030500070009080900020004010800050009040301000702000000008006',
      s: '381254697549167832726938515473619285958423164612875953297546381834792156165381746',
    },
  ],
  hard: [
    {
      p: '000000000000000003900800000008000060070020090020000700000001009500000000000000000',
      s: '752649138481375263936812574198437625674521391325986741847153926519268437263794852',
    },
    {
      p: '000000080002006000300200004040030200600102007009040030200001005000900400090000000',
      s: '961574382842316759375289164748635291653192847129748536294861575516927438897453612',
    },
    {
      p: '000900002050000004000001590002000000700030001000000700079400000500000060100006000',
      s: '417953682953862174268741593392617845745238961681594327879425316534179268126386459',
    },
  ],
}

function strToGrid(str) {
  const arr = str.split('').map((c) => parseInt(c, 10))
  const grid = []
  for (let r = 0; r < 9; r++) grid.push(arr.slice(r * 9, r * 9 + 9))
  return grid
}

function formatTime(sec) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export default function SudokuBoard({ theme, difficulty, level, onComplete }) {
  const { puzzle, solution } = useMemo(() => {
    const list = PUZZLES[difficulty]
    const idx = (level - 1) % list.length
    const item = list[idx]
    return { puzzle: strToGrid(item.p), solution: strToGrid(item.s) }
  }, [difficulty, level])

  const [grid, setGrid] = useState(puzzle)
  const [fixed, setFixed] = useState(() => puzzle.map(row => row.map((v) => v !== 0)))
  const [running, setRunning] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const startedRef = useRef(false)
  const completeRef = useRef(false)

  const isDark = theme === 'vibrant'

  useEffect(() => {
    setGrid(puzzle)
    setFixed(puzzle.map(row => row.map((v) => v !== 0)))
    setSeconds(0)
    setRunning(false)
    startedRef.current = false
    completeRef.current = false
  }, [puzzle])

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [running])

  const handleInput = (r, c, val) => {
    if (fixed[r][c] || completeRef.current) return
    const num = parseInt(val || '0', 10)
    if (Number.isNaN(num) || num < 0 || num > 9) return
    if (!startedRef.current && num > 0) {
      setRunning(true)
      startedRef.current = true
    }
    setGrid((g) => {
      const copy = g.map((row) => row.slice())
      copy[r][c] = num
      const solved = copy.every((row, ri) => row.every((v, ci) => v === solution[ri][ci]))
      if (solved) {
        completeRef.current = true
        setRunning(false)
        onComplete && onComplete(seconds)
      }
      return copy
    })
  }

  const reset = () => {
    setGrid(puzzle)
    setSeconds(0)
    setRunning(false)
    startedRef.current = false
    completeRef.current = false
  }

  const checkProgress = () => {
    const correct = grid.reduce((acc, row, ri) => acc + row.reduce((a, v, ci) => a + (v !== 0 && v === solution[ri][ci] ? 1 : 0), 0), 0)
    const filled = grid.reduce((acc, row) => acc + row.filter((v) => v !== 0).length, 0)
    return { correct, filled }
  }

  const { correct, filled } = checkProgress()

  return (
    <div className={`w-full rounded-lg p-4 shadow-sm ${isDark ? 'bg-emerald-900/40 text-emerald-50 border border-emerald-800' : 'bg-white border border-emerald-100 text-emerald-900'}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Timer size={18} className={isDark ? 'text-emerald-100' : 'text-emerald-800'} />
          <span className="font-mono text-lg">{formatTime(seconds)}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setRunning(true)} className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-semibold transition ${isDark ? 'bg-emerald-500/30 hover:bg-emerald-500/40 text-emerald-50' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}>
            <Play size={16} /> Start
          </button>
          <button onClick={() => setRunning((r) => !r)} className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-semibold transition ${isDark ? 'bg-lime-500/30 hover:bg-lime-500/40 text-emerald-50' : 'bg-lime-600 hover:bg-lime-700 text-white'}`}>
            <Pause size={16} /> Pause
          </button>
          <button onClick={reset} className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-semibold transition ${isDark ? 'bg-teal-500/30 hover:bg-teal-500/40 text-emerald-50' : 'bg-teal-600 hover:bg-teal-700 text-white'}`}>
            <RotateCcw size={16} /> Reset
          </button>
          <div className={`flex items-center gap-2 ml-2 text-sm ${isDark ? 'text-emerald-200' : 'text-emerald-700'}`}>
            <Check size={16} /> {correct}/81 correct • {filled}/81 filled
          </div>
        </div>
      </div>

      <div className="aspect-square max-w-xl mx-auto">
        <div className={`grid grid-cols-9 grid-rows-9 gap-[2px] rounded-md overflow-hidden ${isDark ? 'bg-emerald-800' : 'bg-emerald-200'}`}>
          {grid.map((row, r) => (
            row.map((cell, c) => {
              const isFixed = fixed[r][c]
              const isRegionBorder = (c % 3 === 2 && c !== 8) || (r % 3 === 2 && r !== 8)
              const correctValue = cell !== 0 && cell === solution[r][c]
              return (
                <div
                  key={`${r}-${c}`}
                  className={`${isDark ? 'bg-emerald-900' : 'bg-white'} ${isRegionBorder ? (isDark ? 'shadow-[inset_0_-2px_0_0_rgba(6,95,70,0.6),inset_-2px_0_0_0_rgba(6,95,70,0.6)]' : 'shadow-[inset_0_-2px_0_0_rgba(5,150,105,0.4),inset_-2px_0_0_0_rgba(5,150,105,0.4)]') : ''}`}
                >
                  <input
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={cell === 0 ? '' : String(cell)}
                    onChange={(e) => handleInput(r, c, e.target.value.replace(/[^1-9]/g, ''))}
                    className={`w-full h-full text-center text-lg sm:text-xl md:text-2xl font-semibold outline-none border-none p-0 transition
                      ${isFixed ? (isDark ? 'bg-emerald-950 text-emerald-200' : 'bg-emerald-50 text-emerald-800') : (isDark ? 'bg-emerald-900 text-emerald-100 placeholder-emerald-200' : 'bg-white text-emerald-900')}
                      focus:ring-2 ring-inset ring-emerald-400/60
                      ${!isFixed && correctValue ? (isDark ? 'bg-emerald-800/60' : 'bg-emerald-50') : ''}`}
                  />
                </div>
              )
            })
          ))}
        </div>
      </div>

      {completeRef.current && (
        <div className={`mt-4 text-center font-semibold ${isDark ? 'text-emerald-200' : 'text-emerald-700'}`}>
          Puzzle solved! Time: {formatTime(seconds)}
        </div>
      )}
    </div>
  )
}
