export function formatTime(ms: number): string {
  if (ms <= 0) return '0:00.0';

  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const tenths = Math.floor((ms % 1000) / 100);

  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}:${mins.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  if (totalSeconds < 20) {
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${tenths}`;
  }

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
