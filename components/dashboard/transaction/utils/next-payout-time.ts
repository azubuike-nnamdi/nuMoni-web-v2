/**
 * Calculates the next automation payout time
 * Payouts happen daily at 11:00 PM
 * @returns Formatted string like "10th December 2025 : 11:00 PM"
 */
export function getNextPayoutTime(): string {
  const now = new Date();
  const currentHour = now.getHours();

  // Determine next payout date
  // If it's passed 11 PM (23:00), the next payout window is tomorrow
  const nextPayoutDate = new Date(now);
  if (currentHour >= 23) {
    nextPayoutDate.setDate(now.getDate() + 1);
  }

  // Format the date
  const day = nextPayoutDate.getDate();
  const month = nextPayoutDate.toLocaleDateString('en-US', { month: 'long' });
  const year = nextPayoutDate.getFullYear();

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

  return `${day}${getOrdinalSuffix(day)} ${month} ${year} : 11:00 PM`;
}

