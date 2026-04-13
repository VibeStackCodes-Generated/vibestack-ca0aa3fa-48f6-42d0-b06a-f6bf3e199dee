import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TIME_CONTROLS, type TimeControl } from '@/hooks/useChessClock';
import { Clock, Zap, Timer, Hourglass } from 'lucide-react';

interface TimeControlPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (tc: TimeControl) => void;
  currentLabel: string;
}

const categoryIcons: Record<string, React.ReactNode> = {
  Bullet: <Zap className="h-4 w-4" />,
  Blitz: <Timer className="h-4 w-4" />,
  Rapid: <Clock className="h-4 w-4" />,
  Classical: <Hourglass className="h-4 w-4" />,
};

export function TimeControlPicker({ open, onClose, onSelect, currentLabel }: TimeControlPickerProps) {
  const categories = ['Bullet', 'Blitz', 'Rapid', 'Classical'];

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl tracking-tight">Time Control</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {categories.map(cat => {
            const controls = TIME_CONTROLS.filter(tc => tc.name === cat);
            return (
              <div key={cat}>
                <div className="flex items-center gap-2 mb-3">
                  {categoryIcons[cat]}
                  <span className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                    {cat}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {controls.map(tc => (
                    <Button
                      key={tc.label}
                      variant={tc.label === currentLabel ? 'default' : 'outline'}
                      className="font-mono text-sm px-4 py-2 h-auto"
                      onClick={() => {
                        onSelect(tc);
                        onClose();
                      }}
                    >
                      {tc.label}
                      {tc.label === currentLabel && (
                        <Badge variant="secondary" className="ml-2 text-[10px] px-1.5">
                          Active
                        </Badge>
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
