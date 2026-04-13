import { formatTime } from '@/lib/formatTime';
import { motion } from 'framer-motion';
import type { Player, GameState } from '@/hooks/useChessClock';

interface TimerDisplayProps {
  time: number;
  player: Player;
  isActive: boolean;
  gameState: GameState;
  moves: number;
  onPress: () => void;
  flipped?: boolean;
}

export function TimerDisplay({ time, player, isActive, gameState, moves, onPress, flipped }: TimerDisplayProps) {
  const isRunning = gameState === 'running';
  const isFinished = gameState === 'finished';
  const hasLost = isFinished && time <= 0;
  const isLow = time < 30000 && time > 0;

  const bgClass = isActive && isRunning
    ? 'bg-foreground text-background'
    : hasLost
      ? 'bg-foreground/10 text-foreground/40'
      : 'bg-background text-foreground';

  const canPress = (gameState === 'idle' && player === 'white') ||
    (isRunning && isActive);

  return (
    <motion.button
      onClick={canPress ? onPress : undefined}
      className={`relative flex flex-1 flex-col items-center justify-center w-full select-none transition-colors duration-200 ${bgClass} ${canPress ? 'cursor-pointer active:opacity-80' : 'cursor-default'} ${flipped ? 'rotate-180' : ''}`}
      whileTap={canPress ? { scale: 0.98 } : {}}
      disabled={!canPress}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-3 opacity-60">
          <span className="text-3xl">{player === 'white' ? '♔' : '♚'}</span>
          <span className="text-sm font-medium uppercase tracking-[0.2em]">
            {player === 'white' ? 'White' : 'Black'}
          </span>
        </div>

        <motion.div
          className={`font-mono text-7xl sm:text-8xl md:text-9xl font-bold tracking-tight tabular-nums ${isLow && isActive && isRunning ? 'animate-pulse' : ''}`}
          key={formatTime(time)}
        >
          {formatTime(time)}
        </motion.div>

        {moves > 0 && (
          <div className="text-sm opacity-50 font-mono">
            {moves} move{moves !== 1 ? 's' : ''}
          </div>
        )}

        {hasLost && (
          <div className="text-lg font-semibold uppercase tracking-widest opacity-60 mt-2">
            Time's Up
          </div>
        )}

        {gameState === 'idle' && player === 'white' && (
          <div className="text-sm opacity-40 mt-4 uppercase tracking-widest">
            Tap to start
          </div>
        )}
      </div>
    </motion.button>
  );
}
