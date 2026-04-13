import { useState, useRef, useCallback, useEffect } from 'react';

export type Player = 'white' | 'black';
export type GameState = 'idle' | 'running' | 'paused' | 'finished';

export interface TimeControl {
  name: string;
  minutes: number;
  increment: number;
  label: string;
}

export const TIME_CONTROLS: TimeControl[] = [
  { name: 'Bullet', minutes: 1, increment: 0, label: '1+0' },
  { name: 'Bullet', minutes: 1, increment: 1, label: '1+1' },
  { name: 'Bullet', minutes: 2, increment: 1, label: '2+1' },
  { name: 'Blitz', minutes: 3, increment: 0, label: '3+0' },
  { name: 'Blitz', minutes: 3, increment: 2, label: '3+2' },
  { name: 'Blitz', minutes: 5, increment: 0, label: '5+0' },
  { name: 'Blitz', minutes: 5, increment: 3, label: '5+3' },
  { name: 'Rapid', minutes: 10, increment: 0, label: '10+0' },
  { name: 'Rapid', minutes: 10, increment: 5, label: '10+5' },
  { name: 'Rapid', minutes: 15, increment: 10, label: '15+10' },
  { name: 'Classical', minutes: 30, increment: 0, label: '30+0' },
  { name: 'Classical', minutes: 60, increment: 0, label: '60+0' },
];

export function useChessClock(initialMinutes: number = 5, increment: number = 0) {
  const [whiteTime, setWhiteTime] = useState(initialMinutes * 60 * 1000);
  const [blackTime, setBlackTime] = useState(initialMinutes * 60 * 1000);
  const [activePlayer, setActivePlayer] = useState<Player>('white');
  const [gameState, setGameState] = useState<GameState>('idle');
  const [whiteMoves, setWhiteMoves] = useState(0);
  const [blackMoves, setBlackMoves] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastTickRef = useRef<number>(0);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    lastTickRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const delta = now - lastTickRef.current;
      lastTickRef.current = now;

      if (activePlayer === 'white') {
        setWhiteTime(prev => {
          const next = prev - delta;
          if (next <= 0) {
            clearTimer();
            setGameState('finished');
            return 0;
          }
          return next;
        });
      } else {
        setBlackTime(prev => {
          const next = prev - delta;
          if (next <= 0) {
            clearTimer();
            setGameState('finished');
            return 0;
          }
          return next;
        });
      }
    }, 50);
  }, [activePlayer, clearTimer]);

  useEffect(() => {
    if (gameState === 'running') {
      startTimer();
    } else {
      clearTimer();
    }
    return clearTimer;
  }, [gameState, activePlayer, startTimer, clearTimer]);

  const switchPlayer = useCallback(() => {
    if (gameState === 'idle') {
      setGameState('running');
      setActivePlayer('black');
      setWhiteMoves(1);
      return;
    }
    if (gameState !== 'running') return;

    if (activePlayer === 'white') {
      setWhiteTime(prev => prev + increment * 1000);
      setWhiteMoves(prev => prev + 1);
      setActivePlayer('black');
    } else {
      setBlackTime(prev => prev + increment * 1000);
      setBlackMoves(prev => prev + 1);
      setActivePlayer('white');
    }
  }, [gameState, activePlayer, increment]);

  const pause = useCallback(() => {
    if (gameState === 'running') {
      setGameState('paused');
    }
  }, [gameState]);

  const resume = useCallback(() => {
    if (gameState === 'paused') {
      setGameState('running');
    }
  }, [gameState]);

  const reset = useCallback(() => {
    clearTimer();
    setWhiteTime(initialMinutes * 60 * 1000);
    setBlackTime(initialMinutes * 60 * 1000);
    setActivePlayer('white');
    setGameState('idle');
    setWhiteMoves(0);
    setBlackMoves(0);
  }, [initialMinutes, clearTimer]);

  return {
    whiteTime,
    blackTime,
    activePlayer,
    gameState,
    whiteMoves,
    blackMoves,
    switchPlayer,
    pause,
    resume,
    reset,
  };
}
