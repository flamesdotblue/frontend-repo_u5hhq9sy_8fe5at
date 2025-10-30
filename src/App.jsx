import React, { useEffect, useMemo, useState } from 'react';
import ThemeToggleHeader from './components/ThemeToggleHeader';
import LevelSelector from './components/LevelSelector';
import SudokuBoard from './components/SudokuBoard';
import SidebarStats from './components/SidebarStats';

function classNames(...arr) {
  return arr.filter(Boolean).join(' ');
}

const STORAGE_PLAYERS = 'sudoku_players';
const STORAGE_ACTIVE = 'sudoku_active';

// A tiny curated set of valid Sudoku puzzles and solutions per difficulty.
// Strings are 81 chars. 0 denotes empty.
const PUZZLES = {
  easy: [
    {
      p: '530070000600195000098000060800060003400803001700020006060000280000419005000080079',
      s: '534678912672195348198342567859761423426853791713924856961537284287419635345286179',
    },
    {
      p: '000260701680070090190004500820100040004602900050003028009300074040050036703018000',
      s: '435269781682571493197834562826195347374682915951743628519326874248957136763418259',
    },
  ],
  medium: [
    {
      p: '000000907000420180000705026100904000050000040000507009920108000034059000507000000',
      s: '512683947793426185486715326175934862259861743348572619926148573834259761567397418',
    },
  ],
  hard: [
    {
      p: '005300000800000020070010500400005300010070006003200080060500009004000030000009700',
      s: '145327698839654127672918543427865391918473256563291784286543919794186235351729476',
    },
  ],
};

function createPlayer(name) {
  return {
    id: crypto.randomUUID(),
    name,
    stats: {
      easy: { games: 0, bestTime: null },
      medium: { games: 0, bestTime: null },
      hard: { games: 0, bestTime: null },
    },
    daysPlayed: [],
    totalGames: 0,
  };
}

export default function App() {
  const [theme, setTheme] = useState('vibrant'); // 'vibrant' (emerald dark) | 'subtle' (mint light)
  const [players, setPlayers] = useState([]);
  const [activePlayer, setActivePlayer] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [level, setLevel] = useState(0);

  const isVibrant = theme === 'vibrant';

  // Load from localStorage
  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem(STORAGE_PLAYERS) || '[]');
      if (Array.isArray(p)) setPlayers(p);
      const a = JSON.parse(localStorage.getItem(STORAGE_ACTIVE) || '{}');
      if (a && a.activePlayer) setActivePlayer(a.activePlayer);
      if (a && a.difficulty) setDifficulty(a.difficulty);
      if (typeof a.level === 'number') setLevel(a.level);
    } catch {}
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_PLAYERS, JSON.stringify(players));
  }, [players]);
  useEffect(() => {
    localStorage.setItem(
      STORAGE_ACTIVE,
      JSON.stringify({ activePlayer, difficulty, level })
    );
  }, [activePlayer, difficulty, level]);

  const maxLevel = PUZZLES[difficulty].length;
  const { p: puzzleStr, s: solutionStr } = PUZZLES[difficulty][Math.min(level, maxLevel - 1)];

  function handleAddPlayer(name) {
    const np = createPlayer(name);
    const next = [...players, np];
    setPlayers(next);
    if (!activePlayer) setActivePlayer(np.id);
  }

  function handleSelectPlayer(id) {
    setActivePlayer(id);
  }

  function handleComplete(timeSec) {
    if (!activePlayer) return;
    setPlayers((prev) => {
      return prev.map((p) => {
        if (p.id !== activePlayer) return p;
        const today = new Date().toISOString().slice(0, 10);
        const days = new Set(p.daysPlayed || []);
        days.add(today);
        const area = p.stats[difficulty];
        const best = typeof area.bestTime === 'number' ? Math.min(area.bestTime, timeSec) : timeSec;
        return {
          ...p,
          stats: {
            ...p.stats,
            [difficulty]: { games: (area.games || 0) + 1, bestTime: best },
          },
          totalGames: (p.totalGames || 0) + 1,
          daysPlayed: Array.from(days),
        };
      });
    });

    // advance level
    const nextLevel = (level + 1) % maxLevel;
    setLevel(nextLevel);
  }

  const bgClass = isVibrant
    ? 'bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-emerald-50'
    : 'bg-emerald-50 text-emerald-900';

  return (
    <div className={classNames('min-h-screen', bgClass)}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6">
        <ThemeToggleHeader
          theme={theme}
          onToggleTheme={() => setTheme((t) => (t === 'vibrant' ? 'subtle' : 'vibrant'))}
          players={players}
          activePlayer={activePlayer}
          onAddPlayer={handleAddPlayer}
          onSelectPlayer={handleSelectPlayer}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <LevelSelector
              theme={theme}
              difficulty={difficulty}
              level={level}
              maxLevel={maxLevel}
              onChangeDifficulty={(d) => {
                setDifficulty(d);
                setLevel(0);
              }}
              onChangeLevel={setLevel}
            />
            <SudokuBoard
              theme={theme}
              puzzleStr={puzzleStr}
              solutionStr={solutionStr}
              onComplete={handleComplete}
            />
          </div>
          <SidebarStats theme={theme} players={players} activePlayer={activePlayer} />
        </div>

        <footer className={classNames('text-center text-xs', isVibrant ? 'text-emerald-300/70' : 'text-emerald-700/70')}>
          Emerald dark / Mint light • Sudoku Arena
        </footer>
      </div>
    </div>
  );
}
