import { Button } from '@/components/ui/button';
import { Pause, Play, RotateCcw, Settings } from 'lucide-react';
import type { GameState } from '@/hooks/useChessClock';

interface ControlBarProps {
  gameState: GameState;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onSettings: () => void;
}

export function ControlBar({ gameState, onPause, onResume, onReset, onSettings }: ControlBarProps) {
  return (
    <div className="flex items-center justify-center gap-3 py-3 px-4 bg-background border-y border-border z-10">
      {gameState === 'running' && (
        <Button
          variant="outline"
          size="icon"
          onClick={onPause}
          className="h-11 w-11 rounded-full border-2"
        >
          <Pause className="h-5 w-5" />
        </Button>
      )}

      {gameState === 'paused' && (
        <Button
          variant="outline"
          size="icon"
          onClick={onResume}
          className="h-11 w-11 rounded-full border-2"
        >
          <Play className="h-5 w-5" />
        </Button>
      )}

      {(gameState === 'running' || gameState === 'paused' || gameState === 'finished') && (
        <Button
          variant="outline"
          size="icon"
          onClick={onReset}
          className="h-11 w-11 rounded-full border-2"
        >
          <RotateCcw className="h-5 w-5" />
        </Button>
      )}

      <Button
        variant="outline"
        size="icon"
        onClick={onSettings}
        className="h-11 w-11 rounded-full border-2"
        disabled={gameState === 'running'}
      >
        <Settings className="h-5 w-5" />
      </Button>
    </div>
  );
}
