import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, CheckCircle, Timer as TimerIcon } from 'lucide-react';

function useTimer(running) {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(null);

  useEffect(() => {
    let raf;
    if (running) {
      const start = performance.now() - elapsed;
      startRef.current = start;
      const tick = (t) => {
        setElapsed(t - startRef.current);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }
    return () => raf && cancelAnimationFrame(raf);
  }, [running]);

  const reset = () => setElapsed(0);

  return { elapsed, reset };
}

function formatTime(ms) {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60).toString().padStart(2, '0');
  const s = (total % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function createGrid(pStr, sStr) {
  const puzzle = pStr.split('').map((c) => parseInt(c, 10));
  const solution = sStr.split('').map((c) => parseInt(c, 10));
  const cells = Array.from({ length: 9 }, (_, r) =>
    Array.from({ length: 9 }, (_, c) => {
      const i = r * 9 + c;
      return {
        row: r,
        col: c,
        value: puzzle[i] || 0,
        fixed: puzzle[i] !== 0,
        solution: solution[i],
      };
    })
  );
  return cells;
}

function playBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'triangle';
    o.frequency.setValueAtTime(880, ctx.currentTime);
    g.gain.setValueAtTime(0.001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.4, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.4);
  } catch {}
}

function ConfettiBurst() {
  const containerRef = useRef(null);
  useEffect(() => {
    const container = containerRef.current;
    const count = 120;
    const colors = ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#059669'];
    const pieces = [];
    for (let i = 0; i < count; i++) {
      const piece = document.createElement('div');
      piece.style.position = 'absolute';
      piece.style.left = Math.random() * 100 + '%';
      piece.style.top = '-10px';
      piece.style.width = '6px';
      piece.style.height = '10px';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.opacity = '0.9';
      piece.style.transform = `rotate(${Math.random() * 360}deg)`;
      piece.style.borderRadius = '1px';
      piece.style.pointerEvents = 'none';
      container.appendChild(piece);
      const duration = 1200 + Math.random() * 800;
      const translateX = (Math.random() - 0.5) * 200;
      const keyframes = [
        { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
        { transform: `translate(${translateX}px, ${window.innerHeight * 0.6}px) rotate(${360 * (Math.random() + 0.5)}deg)`, opacity: 0.9 },
      ];
      const anim = piece.animate(keyframes, { duration, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' });
      pieces.push({ el: piece, anim });
      anim.onfinish = () => piece.remove();
    }
    return () => {
      pieces.forEach((p) => p.el.remove());
    };
  }, []);
  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 overflow-hidden"></div>
  );
}

export default function SudokuBoard({ puzzle, solution, onComplete }) {
  const [running, setRunning] = useState(false);
  const [grid, setGrid] = useState(() => createGrid(puzzle, solution));
  const [selected, setSelected] = useState({ r: 0, c: 0 });
  const [won, setWon] = useState(false);
  const { elapsed, reset } = useTimer(running);

  useEffect(() => {
    setGrid(createGrid(puzzle, solution));
    setSelected({ r: 0, c: 0 });
    setWon(false);
    setRunning(false);
    reset();
  }, [puzzle, solution]);

  useEffect(() => {
    const handler = (e) => {
      if (won) return;
      const key = e.key;
      if (key >= '1' && key <= '9') {
        inputValue(parseInt(key, 10));
      } else if (key === 'Backspace' || key === 'Delete' || key === '0') {
        inputValue(0);
      } else if (key === 'ArrowUp') setSelected((s) => ({ r: (s.r + 8) % 9, c: s.c }));
      else if (key === 'ArrowDown') setSelected((s) => ({ r: (s.r + 1) % 9, c: s.c }));
      else if (key === 'ArrowLeft') setSelected((s) => ({ r: s.r, c: (s.c + 8) % 9 }));
      else if (key === 'ArrowRight') setSelected((s) => ({ r: s.r, c: (s.c + 1) % 9 }));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selected, won]);

  const inputValue = (val) => {
    setGrid((g) => {
      const copy = g.map((row) => row.map((cell) => ({ ...cell })));
      const cell = copy[selected.r][selected.c];
      if (cell.fixed) return g;
      cell.value = val;
      return copy;
    });
  };

  useEffect(() => {
    const allFilled = grid.every((row) => row.every((cell) => cell.value !== 0));
    if (!allFilled || won) return;
    const correct = grid.every((row) => row.every((cell) => cell.value === cell.solution));
    if (correct) {
      setWon(true);
      setRunning(false);
      playBeep();
      onComplete && onComplete(Math.floor(elapsed / 1000));
    }
  }, [grid, won, elapsed, onComplete]);

  const highlightSets = useMemo(() => {
    const r = selected.r;
    const c = selected.c;
    const boxR = Math.floor(r / 3) * 3;
    const boxC = Math.floor(c / 3) * 3;
    const inBox = new Set();
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        inBox.add(`${boxR + i}-${boxC + j}`);
      }
    }
    return { row: r, col: c, inBox };
  }, [selected]);

  return (
    <div className="relative">
      {won && <ConfettiBurst />}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-100">
          <TimerIcon size={16} />
          <span className="font-mono text-lg">{formatTime(elapsed)}</span>
        </div>
        <div className="flex items-center gap-2">
          {!running ? (
            <button onClick={() => setRunning(true)} className="inline-flex items-center gap-1 px-3 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700"><Play size={16} /> Start</button>
          ) : (
            <button onClick={() => setRunning(false)} className="inline-flex items-center gap-1 px-3 py-2 rounded-md bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-800 dark:text-emerald-100 dark:hover:bg-emerald-700"><Pause size={16} /> Pause</button>
          )}
          <button onClick={() => { setGrid(createGrid(puzzle, solution)); setSelected({ r: 0, c: 0 }); setRunning(false); reset(); setWon(false); }}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-md bg-white/70 dark:bg-emerald-900/60 border border-emerald-100 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 hover:bg-emerald-50/80 dark:hover:bg-emerald-900">
            <RotateCcw size={16} /> Reset
          </button>
          <button onClick={() => { setGrid(createGrid(solution, solution)); setRunning(false); setWon(true); onComplete && onComplete(Math.floor(elapsed / 1000)); playBeep(); }}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 dark:bg-emerald-900/60 dark:text-emerald-100 dark:hover:bg-emerald-900 dark:border-emerald-800">
            <CheckCircle size={16} /> Auto-complete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-9 gap-0 select-none rounded-lg overflow-hidden shadow ring-1 ring-emerald-200 dark:ring-emerald-800">
        {grid.map((row, r) => (
          <React.Fragment key={r}>
            {row.map((cell, c) => {
              const isSel = selected.r === r && selected.c === c;
              const sameRow = selected.r === r;
              const sameCol = selected.c === c;
              const inBox = highlightSets.inBox.has(`${r}-${c}`);
              const borderClasses = `${(c + 1) % 3 === 0 && c !== 8 ? 'border-r-2 border-emerald-400/50 dark:border-emerald-700' : ''} ${(r + 1) % 3 === 0 && r !== 8 ? 'border-b-2 border-emerald-400/50 dark:border-emerald-700' : ''}`;
              return (
                <div
                  key={`${r}-${c}`}
                  onClick={() => setSelected({ r, c })}
                  className={`h-10 sm:h-12 flex items-center justify-center text-lg font-medium cursor-pointer transition-colors border border-emerald-100 dark:border-emerald-800 ${borderClasses} ${
                    isSel ? 'bg-emerald-200/70 dark:bg-emerald-700/50' : sameRow || sameCol || inBox ? 'bg-emerald-50/60 dark:bg-emerald-900/40' : 'bg-white dark:bg-emerald-900'
                  } ${cell.fixed ? 'text-emerald-900 dark:text-emerald-100' : 'text-emerald-600 dark:text-emerald-300'}`}
                >
                  {cell.value !== 0 ? cell.value : ''}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-10 gap-2">
        {[1,2,3,4,5,6,7,8,9].map((n) => (
          <button key={n} onClick={() => inputValue(n)} className="px-2 py-2 rounded-md bg-white/70 dark:bg-emerald-900/60 border border-emerald-100 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 hover:bg-emerald-50/80 dark:hover:bg-emerald-900">{n}</button>
        ))}
        <button onClick={() => inputValue(0)} className="px-2 py-2 rounded-md bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-800 dark:text-emerald-100 dark:hover:bg-emerald-700">Clear</button>
      </div>
    </div>
  );
}
