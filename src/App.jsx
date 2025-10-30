import React, { useEffect, useMemo, useState } from 'react';
import Spline from '@splinetool/react-spline';
import ThemeToggleHeader from './components/ThemeToggleHeader';
import LevelSelector from './components/LevelSelector';
import SudokuBoard from './components/SudokuBoard';
import SidebarStats from './components/SidebarStats';

const STORAGE_KEYS = {
  players: 'sudoku_players',
  active: 'sudoku_active',
};

const PUZZLES = {
  easy: [
    {
      p: '530070000600195000098000060800060003400803001700020006060000280000419005000080079',
      s: '534678912672195348198342567859761423426853791713924856961537284287419635345286179',
    },
    {
      p: '003020600900305001001806400008102900700000008006708200002609500800203009005010300',
      s: '483921657967345821251876493548132976729564138136798245372689514814253769695417382',
    },
    {
      p: '200080300060070084030500209000105408000000000402706000301007040720040060004010003',
      s: '245986371169273584837541269976125438318694752452736918591367842723849165684912753',
    },
    {
      p: '000000907000420180000705026100904000050000040000507009920108000034059000507000000',
      s: '512368947673429185498715326126934578759281643384567219965173854234859761817642593',
    },
    {
      p: '000900002050123400030000000004000000000567000000000800000000030001735060500009000',
      s: '146978352857123496239456718784391625913567284625842871472618539391735862568239147',
    },
  ],
  medium: [
    {
      p: '003020600900305001001806400008102900700000008006708200002609500800203009005010300',
      s: '483921657967345821251876493548132976729564138136798245372689514814253769695417382',
    },
    {
      p: '530070000600195000098000060800060003400803001700020006060000280000419005000080079',
      s: '534678912672195348198342567859761423426853791713924856961537284287419635345286179',
    },
    {
      p: '000000907000420180000705026100904000050000040000507009920108000034059000507000000',
      s: '512368947673429185498715326126934578759281643384567219965173854234859761817642593',
    },
    {
      p: '200080300060070084030500209000105408000000000402706000301007040720040060004010003',
      s: '245986371169273584837541269976125438318694752452736918591367842723849165684912753',
    },
    {
      p: '000900002050123400030000000004000000000567000000000800000000030001735060500009000',
      s: '146978352857123496239456718784391625913567284625842871472618539391735862568239147',
    },
  ],
  hard: [
    {
      p: '000000907000420180000705026100904000050000040000507009920108000034059000507000000',
      s: '512368947673429185498715326126934578759281643384567219965173854234859761817642593',
    },
    {
      p: '200080300060070084030500209000105408000000000402706000301007040720040060004010003',
      s: '245986371169273584837541269976125438318694752452736918591367842723849165684912753',
    },
    {
      p: '003020600900305001001806400008102900700000008006708200002609500800203009005010300',
      s: '483921657967345821251876493548132976729564138136798245372689514814253769695417382',
    },
    {
      p: '000900002050123400030000000004000000000567000000000800000000030001735060500009000',
      s: '146978352857123496239456718784391625913567284625842871472618539391735862568239147',
    },
    {
      p: '530070000600195000098000060800060003400803001700020006060000280000419005000080079',
      s: '534678912672195348198342567859761423426853791713924856961537284287419635345286179',
    },
  ],
};

function newPlayer(name) {
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

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export default function App() {
  const [theme, setTheme] = useState(() => (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  const [players, setPlayers] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.players);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [activePlayerId, setActivePlayerId] = useState(() => localStorage.getItem(STORAGE_KEYS.active) || '');
  const [difficulty, setDifficulty] = useState('easy');
  const [levelIndex, setLevelIndex] = useState(0);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.players, JSON.stringify(players));
  }, [players]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.active, activePlayerId || '');
  }, [activePlayerId]);

  const activePlayer = useMemo(() => players.find((p) => p.id === activePlayerId) || null, [players, activePlayerId]);
  const levels = PUZZLES[difficulty];
  const level = levels[levelIndex % levels.length];

  const addPlayer = (name) => {
    const p = newPlayer(name);
    setPlayers((prev) => [p, ...prev]);
    setActivePlayerId(p.id);
  };
  const selectPlayer = (id) => setActivePlayerId(id);

  const onComplete = (elapsedSecs) => {
    if (!activePlayer) return;
    setPlayers((prev) => prev.map((p) => {
      if (p.id !== activePlayer.id) return p;
      const d = { ...p };
      d.totalGames = (d.totalGames || 0) + 1;
      const dk = todayKey();
      if (!d.daysPlayed) d.daysPlayed = [];
      if (!d.daysPlayed.includes(dk)) d.daysPlayed.push(dk);
      const stat = d.stats[difficulty];
      stat.games += 1;
      if (stat.bestTime == null || elapsedSecs < stat.bestTime) stat.bestTime = elapsedSecs;
      return d;
    }));
    // advance level
    setLevelIndex((i) => (i + 1) % levels.length);
  };

  const onPrevLevel = () => setLevelIndex((i) => (i - 1 + levels.length) % levels.length);
  const onNextLevel = () => setLevelIndex((i) => (i + 1) % levels.length);

  useEffect(() => {
    setLevelIndex(0);
  }, [difficulty]);

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 transition-colors">
        {/* Hero with Spline cover */}
        <div className="relative w-full h-[300px] sm:h-[380px]">
          <Spline scene="https://prod.spline.design/zhZFnwyOYLgqlLWk/scene.splinecode" style={{ width: '100%', height: '100%' }} />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-emerald-50/30 via-emerald-50/0 to-emerald-50/70 dark:from-emerald-950/50 dark:via-emerald-950/30 dark:to-emerald-950/70" />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-emerald-900 dark:text-emerald-50">Sudoku Arena</h2>
              <p className="mt-2 text-emerald-800/80 dark:text-emerald-200/70">A minimalist grid battleground. Race the clock. Climb the board.</p>
            </div>
          </div>
        </div>

        <ThemeToggleHeader
          theme={theme}
          onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
          players={players}
          activePlayerId={activePlayerId}
          onAddPlayer={addPlayer}
          onSelectPlayer={selectPlayer}
        />

        <main className="mx-auto max-w-7xl px-4 pb-16 -mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <LevelSelector
                difficulty={difficulty}
                onDifficultyChange={setDifficulty}
                levelIndex={levelIndex}
                totalLevels={levels.length}
                onPrev={onPrevLevel}
                onNext={onNextLevel}
              />
              <div className="bg-white/70 dark:bg-emerald-900/60 border border-emerald-100 dark:border-emerald-800 rounded-xl p-4 backdrop-blur">
                <SudokuBoard
                  puzzle={level.p}
                  solution={level.s}
                  onComplete={onComplete}
                />
              </div>
            </div>
            <div>
              <SidebarStats players={players} difficulty={difficulty} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
