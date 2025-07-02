import { formatDistanceToNow, format, isToday, isYesterday, isThisWeek, isThisYear } from 'date-fns';

/**
 * Format a timestamp to a beautiful relative time string
 * @param timestamp - Unix timestamp in seconds
 * @returns Formatted relative time string
 */
export function formatRelativeTime(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const now = new Date();

  // If it's within the last minute, show "just now"
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  if (diffInMinutes < 1) {
    return 'just now';
  }

  // If it's within the last hour, show minutes
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  // If it's today, show time
  if (isToday(date)) {
    return `today at ${format(date, 'h:mm a')}`;
  }

  // If it's yesterday, show "yesterday"
  if (isYesterday(date)) {
    return `yesterday at ${format(date, 'h:mm a')}`;
  }

  // If it's this week, show day name
  if (isThisWeek(date)) {
    return format(date, 'EEEE \'at\' h:mm a');
  }

  // If it's this year, show month and day
  if (isThisYear(date)) {
    return format(date, 'MMM d \'at\' h:mm a');
  }

  // Otherwise show full date
  return format(date, 'MMM d, yyyy \'at\' h:mm a');
}

/**
 * Format a timestamp to a short relative time string (for compact displays)
 * @param timestamp - Unix timestamp in seconds
 * @returns Short formatted relative time string
 */
export function formatRelativeTimeShort(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  
  try {
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    // Fallback to basic formatting if date-fns fails
    return format(date, 'MMM d, yyyy');
  }
}