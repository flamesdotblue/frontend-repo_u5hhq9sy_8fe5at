import { useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play, RotateCw, Zap } from 'lucide-react';

function useTimer(running) {
  const [elapsed, setElapsed] = useState(0);
  const last = useRef(null);
  useEffect(() => {
    let raf;
    function tick(ts) {
      if (running) {
        if (last.current == null) last.current = ts;
        const dt = ts - last.current;
        last.current = ts;
        setElapsed((e) => e + dt);
      } else {
        last.current = null;
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running]);
  return [elapsed, setElapsed];
}

function formatTime(ms) {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60).toString().padStart(2, '0');
  const s = (total % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function SudokuBoard({ puzzle, solution, onComplete }) {
  const initial = useMemo(() => puzzle.split('').map((c) => Number(c)), [puzzle]);
  const sol = useMemo(() => solution.split('').map((c) => Number(c)), [solution]);
  const [values, setValues] = useState(initial);
  const [selected, setSelected] = useState(null);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useTimer(running);

  useEffect(() => {
    setValues(initial);
    setSelected(null);
    setElapsed(0);
    setRunning(false);
  }, [initial, setElapsed]);

  const fixed = useMemo(() => initial.map((n) => n !== 0), [initial]);

  useEffect(() => {
    if (values.every((v, i) => v === sol[i] && v !== 0)) {
      setRunning(false);
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(880, ctx.currentTime);
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.4, ctx.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
      o.connect(g).connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + 0.3);
      onComplete(Math.floor(elapsed / 1000));
    }
  }, [values, sol, elapsed, onComplete]);

  const onKeyDown = (e) => {
    if (selected == null) return;
    const idx = selected;
    const row = Math.floor(idx / 9);
    const col = idx % 9;
    if (e.key === 'ArrowUp') setSelected((i) => (i - 9 + 81) % 81);
    if (e.key === 'ArrowDown') setSelected((i) => (i + 9) % 81);
    if (e.key === 'ArrowLeft') setSelected((i) => (i + 80) % 81);
    if (e.key === 'ArrowRight') setSelected((i) => (i + 1) % 81);
    if (/^[1-9]$/.test(e.key)) {
      if (!fixed[idx]) {
        const nv = [...values];
        nv[idx] = Number(e.key);
        setValues(nv);
      }
    }
    if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
      if (!fixed[idx]) {
        const nv = [...values];
        nv[idx] = 0;
        setValues(nv);
      }
    }
    if (e.key.toLowerCase() === ' ') {
      setRunning((r) => !r);
      e.preventDefault();
    }
  };

  const autoFill = () => {
    setValues(sol);
  };

  const reset = () => {
    setValues(initial);
    setElapsed(0);
    setRunning(false);
    setSelected(null);
  };

  return (
    <div className="w-full" onKeyDown={onKeyDown} tabIndex={0}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-emerald-700 dark:text-emerald-200">Time: <span className="font-mono">{formatTime(elapsed)}</span></div>
        <div className="flex items-center gap-2">
          <button onClick={() => setRunning((r) => !r)} className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 hover:bg-emerald-50 dark:hover:bg-emerald-800">
            {running ? <Pause size={16} /> : <Play size={16} />} {running ? 'Pause' : 'Start'}
          </button>
          <button onClick={reset} className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 hover:bg-emerald-50 dark:hover:bg-emerald-800">
            <RotateCw size={16} /> Reset
          </button>
          <button onClick={autoFill} className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700">
            <Zap size={16} /> Auto-complete
          </button>
        </div>
      </div>
      <div className="aspect-square max-w-xl mx-auto border-2 border-emerald-300 dark:border-emerald-700 rounded-md overflow-hidden select-none">
        <div className="grid grid-cols-9">
          {values.map((v, i) => {
            const r = Math.floor(i / 9);
            const c = i % 9;
            const thickBottom = (r + 1) % 3 === 0 && r !== 8;
            const thickRight = (c + 1) % 3 === 0 && c !== 8;
            const isSel = selected === i;
            const inRow = selected != null && Math.floor(selected / 9) === r;
            const inCol = selected != null && selected % 9 === c;
            const sameNum = selected != null && values[selected] !== 0 && values[selected] === v;
            return (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`relative h-10 sm:h-12 md:h-14 lg:h-16 flex items-center justify-center border border-emerald-200/70 dark:border-emerald-800/70 ${
                  thickRight ? 'border-r-2 border-r-emerald-400 dark:border-r-emerald-700' : ''
                } ${thickBottom ? 'border-b-2 border-b-emerald-400 dark:border-b-emerald-700' : ''} ${
                  isSel ? 'bg-emerald-200/50 dark:bg-emerald-800/50' : inRow || inCol ? 'bg-emerald-100/40 dark:bg-emerald-900/40' : ''
                }`}
              >
                <span className={`text-base sm:text-lg md:text-xl ${fixed[i] ? 'font-semibold text-emerald-900 dark:text-emerald-100' : 'text-emerald-700 dark:text-emerald-200'}`}>
                  {v !== 0 ? v : ''}
                </span>
                {sameNum && !fixed[i] && v !== 0 && (
                  <span className="absolute inset-0 ring-2 ring-emerald-500 pointer-events-none rounded-sm" />
                )}
              </button>
            );
          })}
        </div>
      </div>
      <p className="mt-2 text-center text-xs text-emerald-700/70 dark:text-emerald-300/70">Tip: Use arrow keys, numbers, Backspace. Space to pause/resume.</p>
    </div>
  );
}
