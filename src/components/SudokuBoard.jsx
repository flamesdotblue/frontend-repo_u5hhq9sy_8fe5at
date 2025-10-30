import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Timer, Play, Pause, RotateCcw, Check } from 'lucide-react';

function classNames(...arr) {
  return arr.filter(Boolean).join(' ');
}

function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function SudokuBoard({ theme, puzzleStr, solutionStr, onComplete }) {
  const isVibrant = theme === 'vibrant';
  const original = useMemo(() => puzzleStr.split('').map((c) => parseInt(c, 10) || 0), [puzzleStr]);
  const solution = useMemo(() => solutionStr.split('').map((c) => parseInt(c, 10) || 0), [solutionStr]);
  const [grid, setGrid] = useState(original);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    setGrid(original);
    setSeconds(0);
    setRunning(false);
    setStatus('');
  }, [puzzleStr, solutionStr, original]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  useEffect(() => {
    // Auto check completion
    if (grid.every((v, i) => v === solution[i])) {
      setRunning(false);
      if (seconds > 0) onComplete(seconds);
      setStatus('Completed!');
    }
  }, [grid, solution, seconds, onComplete]);

  function setCell(i, val) {
    if (original[i] !== 0) return; // fixed cell
    const v = Math.max(0, Math.min(9, val));
    setGrid((g) => {
      const n = [...g];
      n[i] = v;
      return n;
    });
  }

  function resetBoard() {
    setGrid(original);
    setSeconds(0);
    setRunning(false);
    setStatus('');
  }

  return (
    <div className={classNames('rounded-xl border p-4 sm:p-5 shadow flex flex-col gap-4', isVibrant ? 'bg-emerald-950/70 border-emerald-800' : 'bg-emerald-50 border-emerald-200')}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <Timer size={18} className={isVibrant ? 'text-emerald-300' : 'text-emerald-700'} />
          <span className={isVibrant ? 'text-emerald-100' : 'text-emerald-900'}>{formatTime(seconds)}</span>
          {status && <span className={classNames('ml-2 text-xs', isVibrant ? 'text-emerald-300' : 'text-emerald-700')}>{status}</span>}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRunning(true)}
            className={classNames(
              'inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm transition',
              isVibrant ? 'bg-emerald-700 hover:bg-emerald-600 text-emerald-50' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            )}
          >
            <Play size={16} /> Start
          </button>
          <button
            onClick={() => setRunning(false)}
            className={classNames(
              'inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm transition',
              isVibrant ? 'bg-emerald-800 hover:bg-emerald-700 text-emerald-50' : 'bg-emerald-700 hover:bg-emerald-600 text-white'
            )}
          >
            <Pause size={16} /> Pause
          </button>
          <button
            onClick={resetBoard}
            className={classNames(
              'inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm transition',
              isVibrant ? 'bg-emerald-900 hover:bg-emerald-800 border border-emerald-700 text-emerald-100' : 'bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-900'
            )}
          >
            <RotateCcw size={16} /> Reset
          </button>
          <button
            onClick={() => setGrid(solution)}
            className={classNames(
              'inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm transition',
              isVibrant ? 'bg-emerald-900 hover:bg-emerald-800 border border-emerald-700 text-emerald-100' : 'bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-900'
            )}
          >
            <Check size={16} /> Auto-fill
          </button>
        </div>
      </div>

      <div className={classNames('aspect-square w-full max-w-[520px] mx-auto grid grid-cols-9 grid-rows-9 rounded-lg overflow-hidden', isVibrant ? 'bg-emerald-900' : 'bg-white border border-emerald-200')}> 
        {grid.map((val, idx) => {
          const r = Math.floor(idx / 9);
          const c = idx % 9;
          const thickRight = (c + 1) % 3 === 0 && c !== 8;
          const thickBottom = (r + 1) % 3 === 0 && r !== 8;
          const fixed = original[idx] !== 0;

          return (
            <div
              key={idx}
              className={classNames(
                'relative flex items-center justify-center border border-emerald-700/40',
                isVibrant ? 'bg-emerald-950/40 text-emerald-100' : 'bg-emerald-50 text-emerald-900',
                thickRight && (isVibrant ? 'border-r-2 border-r-emerald-600' : 'border-r-2 border-r-emerald-400'),
                thickBottom && (isVibrant ? 'border-b-2 border-b-emerald-600' : 'border-b-2 border-b-emerald-400')
              )}
            >
              {fixed ? (
                <span className={classNames('font-semibold select-none', isVibrant ? 'text-emerald-300' : 'text-emerald-700')}>
                  {val || ''}
                </span>
              ) : (
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={val === 0 ? '' : String(val)}
                  onChange={(e) => {
                    const ch = e.target.value.replace(/[^1-9]/g, '');
                    setCell(idx, ch ? parseInt(ch, 10) : 0);
                  }}
                  className={classNames(
                    'w-full h-full text-center outline-none font-medium',
                    isVibrant
                      ? 'bg-transparent text-emerald-100 focus:bg-emerald-900/60'
                      : 'bg-transparent text-emerald-900 focus:bg-emerald-100'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
