// Date Helpers

function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function getTodayStr(): string {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.toISOString().split('T')[0];
}

function getStartOfWeek(date: Date = new Date()): Date {
  const d = new Date(date);
  const dayOfWeek = d.getDay(); // 0=Sun, ...
  d.setDate(d.getDate() - dayOfWeek);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getWeekDates(weekStart: string): Date[] {
  const dates: Date[] = [];
  const start = new Date(weekStart);
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    dates.push(d);
  }
  return dates;
}

function formatDayHeader(dateObj: Date): string {
  const dow = dateObj.toLocaleString('en-US', { weekday: 'short' });
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  return `${dow} ${month}/${day}`;
}

function formatWeekStart(dateObj: Date): string {
  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export { parseLocalDate, getTodayStr, getStartOfWeek, getWeekDates, formatDayHeader, formatWeekStart };