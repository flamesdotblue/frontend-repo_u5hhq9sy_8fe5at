import { useEffect, useMemo, useState } from 'react';
import Spline from '@splinetool/react-spline';
import ThemeToggleHeader from './components/ThemeToggleHeader';
import LevelSelector from './components/LevelSelector';
import SudokuBoard from './components/SudokuBoard';
import SidebarStats from './components/SidebarStats';

const STORAGE_KEY_PLAYERS = 'sudoku_players';
const STORAGE_KEY_ACTIVE = 'sudoku_active';

const PUZZLES = {
  easy: [
    { p: '530070000600195000098000060800060003400803001700020006060000280000419005000080079', s: '534678912672195348198342567859761423426853791713924856961537284287419635345286179' },
    { p: '006100090000060001002005080090000700100000003007000050030600800800040000020001600', s: '786134592359862471412975386593418762148256973267397154931626845875643219624581637' },
  ],
  medium: [
    { p: '000260701680070090190004500820100040004602900050003028009300074040050036703018000', s: '435269781682571493197834562826195347374682915951743628519326874248957136763418259' },
    { p: '200080300060070084030500209000105408000000000402706000301007040720040060004010003', s: '245981376169273584837564219973125468618439725452796831391657842726348965584812693' },
  ],
  hard: [
    { p: '000000907000420180000705026100904000050000040000507009920108000034059000507000000', s: '512673947793424185486715326176934852259861743348527619925148673834259461567396218' },
    { p: '030000000000107000706000903000608000000000000000309000501000709000706000000000030', s: '139864257842197365756253983293678541415932876678349512581423796324716198967581234' },
  ],
};

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export default function App() {
  const [players, setPlayers] = useState([]);
  const [activePlayerId, setActivePlayerId] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [levelIndex, setLevelIndex] = useState(0);

  useEffect(() => {
    const savedPlayers = JSON.parse(localStorage.getItem(STORAGE_KEY_PLAYERS) || '[]');
    const savedActive = localStorage.getItem(STORAGE_KEY_ACTIVE) || '';
    setPlayers(savedPlayers);
    setActivePlayerId(savedActive);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PLAYERS, JSON.stringify(players));
  }, [players]);

  const totalLevels = PUZZLES[difficulty].length;
  useEffect(() => {
    if (levelIndex >= totalLevels) setLevelIndex(0);
  }, [difficulty, totalLevels, levelIndex]);

  const current = PUZZLES[difficulty][levelIndex];

  const activePlayer = useMemo(
    () => players.find((p) => p.id === activePlayerId) || null,
    [players, activePlayerId]
  );

  const handleComplete = (seconds) => {
    if (!activePlayer) return;
    const updated = players.map((p) => {
      if (p.id !== activePlayer.id) return p;
      const d = { ...p };
      d.stats[difficulty].games += 1;
      d.totalGames = (d.totalGames || 0) + 1;
      const best = d.stats[difficulty].bestTime;
      d.stats[difficulty].bestTime = best == null ? seconds : Math.min(best, seconds);
      const day = todayKey();
      const set = new Set(d.daysPlayed || []);
      set.add(day);
      d.daysPlayed = Array.from(set).sort();
      return d;
    });
    setPlayers(updated);
    setLevelIndex((i) => Math.min(totalLevels - 1, i + 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950 dark:to-emerald-900">
      <ThemeToggleHeader
        players={players}
        setPlayers={setPlayers}
        activePlayerId={activePlayerId}
        setActivePlayerId={setActivePlayerId}
      />

      <section className="relative">
        <div className="h-[320px] sm:h-[380px] md:h-[440px] w-full">
          <Spline scene="https://prod.spline.design/8lq8mJSqjK7v6H0x/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/60 via-white/20 to-white/80 dark:from-emerald-950/70 dark:via-emerald-950/20 dark:to-emerald-950/80" />
        <div className="absolute inset-0">
          <div className="max-w-6xl mx-auto h-full px-4 flex items-center">
            <div className="bg-white/70 dark:bg-emerald-950/70 backdrop-blur rounded-xl border border-emerald-200/60 dark:border-emerald-800/60 p-4 sm:p-6">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-emerald-900 dark:text-emerald-100">Sudoku Arena</h2>
              <p className="mt-1 text-sm sm:text-base text-emerald-800/80 dark:text-emerald-200/80">Climb levels and compete with friends.</p>
              <p className="text-sm sm:text-base text-emerald-800/80 dark:text-emerald-200/80">Level up and keep your streak alive.</p>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-4">
          <LevelSelector
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            levelIndex={levelIndex}
            setLevelIndex={setLevelIndex}
            totalLevels={totalLevels}
          />
          <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-emerald-900 p-4">
            <SudokuBoard puzzle={current.p} solution={current.s} onComplete={handleComplete} />
          </div>
        </div>
        <SidebarStats players={players} />
      </main>

      <footer className="py-8 text-center text-xs text-emerald-700/70 dark:text-emerald-300/70">Made for puzzle lovers • Keep the streak going 🔥</footer>
    </div>
  );
}
