import { useState, useCallback, useEffect } from 'react';
import { useChessClock, TIME_CONTROLS, type TimeControl } from '@/hooks/useChessClock';
import { TimerDisplay } from '@/components/TimerDisplay';
import { ControlBar } from '@/components/ControlBar';
import { TimeControlPicker } from '@/components/TimeControlPicker';
import { toast } from 'sonner';

export default function Index() {
  const [timeControl, setTimeControl] = useState<TimeControl>(TIME_CONTROLS[5]);
  const [showPicker, setShowPicker] = useState(false);

  const clock = useChessClock(timeControl.minutes, timeControl.increment);

  const handleSelectTimeControl = useCallback((tc: TimeControl) => {
    setTimeControl(tc);
  }, []);

  useEffect(() => {
    clock.reset();
  }, [timeControl]);

  useEffect(() => {
    if (clock.gameState === 'finished') {
      const winner = clock.whiteTime <= 0 ? 'Black' : 'White';
      toast(`${winner} wins on time!`, {
        description: `${clock.whiteMoves + clock.blackMoves} total moves played`,
      });
    }
  }, [clock.gameState]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        clock.switchPlayer();
      } else if (e.code === 'KeyP') {
        if (clock.gameState === 'running') clock.pause();
        else if (clock.gameState === 'paused') clock.resume();
      } else if (e.code === 'KeyR') {
        clock.reset();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [clock]);

  return (
    <div className="h-dvh flex flex-col overflow-hidden bg-background">
      {/* Black player (top, flipped) */}
      <TimerDisplay
        time={clock.blackTime}
        player="black"
        isActive={clock.activePlayer === 'black'}
        gameState={clock.gameState}
        moves={clock.blackMoves}
        onPress={clock.switchPlayer}
        flipped
      />

      {/* Control bar */}
      <ControlBar
        gameState={clock.gameState}
        onPause={clock.pause}
        onResume={clock.resume}
        onReset={clock.reset}
        onSettings={() => setShowPicker(true)}
      />

      {/* White player (bottom) */}
      <TimerDisplay
        time={clock.whiteTime}
        player="white"
        isActive={clock.activePlayer === 'white'}
        gameState={clock.gameState}
        moves={clock.whiteMoves}
        onPress={clock.switchPlayer}
      />

      {/* Time control picker */}
      <TimeControlPicker
        open={showPicker}
        onClose={() => setShowPicker(false)}
        onSelect={handleSelectTimeControl}
        currentLabel={timeControl.label}
      />

      {/* Current time control indicator */}
      <div className="absolute top-1/2 left-4 -translate-y-1/2 z-20">
        <div className="bg-background border border-border rounded-full px-3 py-1 text-xs font-mono text-muted-foreground shadow-sm">
          {timeControl.name} {timeControl.label}
        </div>
      </div>
    </div>
  );
}
