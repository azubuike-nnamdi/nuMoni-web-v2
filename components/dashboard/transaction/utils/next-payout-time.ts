/**
 * Calculates the next automation payout time
 * Payouts happen twice daily: 12:00 PM and 7:00 PM
 * @returns Formatted string like "10th December 2025 : 7:00 PM"
 */
export function getNextPayoutTime(): string {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  // Create date objects for today's payout times
  const today12PM = new Date(now);
  today12PM.setHours(12, 0, 0, 0);

  const today7PM = new Date(now);
  today7PM.setHours(19, 0, 0, 0);

  // Determine next payout time
  let nextPayout: Date;

  if (currentHour < 12) {
    // Before 12 PM, next payout is today at 12 PM
    nextPayout = today12PM;
  } else if (currentHour < 19 || (currentHour === 19 && currentMinute === 0)) {
    // Between 12 PM and 7 PM (or exactly at 7 PM), next payout is today at 7 PM
    nextPayout = today7PM;
  } else {
    // After 7 PM, next payout is tomorrow at 12 PM
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(12, 0, 0, 0);
    nextPayout = tomorrow;
  }

  // Format the date
  const day = nextPayout.getDate();
  const month = nextPayout.toLocaleDateString('en-US', { month: 'long' });
  const year = nextPayout.getFullYear();

  // Format the time
  const hours = nextPayout.getHours();
  const minutes = nextPayout.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  const displayMinutes = minutes.toString().padStart(2, '0');

  // Get ordinal suffix for day (1st, 2nd, 3rd, 4th, etc.)
  const getOrdinalSuffix = (day: number): string => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  return `${day}${getOrdinalSuffix(day)} ${month} ${year} : ${displayHours}:${displayMinutes} ${ampm}`;
}

