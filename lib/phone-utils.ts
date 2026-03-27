type FormatType = 'compact' | 'compact-int' | 'compact-leading' | 'default' | 'int' | 'plus-234';

function isValidMsisdn(string: string): boolean {
  // Basic validation - check if string contains only digits and is reasonable length
  const digitOnly = /^\d+$/.test(string);
  const reasonableLength = string.length >= 10 && string.length <= 15;

  return digitOnly && reasonableLength;
}

function formatCompact(string: string): string | null {
  // Remove leading zeros and country codes, keep only the local number
  let cleaned = string.replace(/^0+/, '');
  cleaned = cleaned.replace(/^234/, '');
  return cleaned;
}

function formatCompactInt(string: string): string | null {
  // Format as international without + sign
  if (string.startsWith('0')) {
    return `234${string.substring(1)}`;
  }
  if (string.startsWith('234')) {
    return string;
  }
  return `234${string}`;
}

function formatCompactLeading(string: string): string | null {
  // Format with leading zero
  if (string.startsWith('0')) {
    return string;
  }
  if (string.startsWith('234')) {
    return `0${string.substring(3)}`;
  }
  return `0${string}`;
}

function formatDefault(string: string): string | null {
  // Format as +234-xxx-xxx-xxxx
  let cleaned = string;

  if (cleaned.startsWith('0')) {
    cleaned = `234${cleaned.substring(1)}`;
  }

  if (!cleaned.startsWith('234')) {
    cleaned = `234${cleaned}`;
  }

  // Format as +234-xxx-xxx-xxxx
  if (cleaned.length >= 13) {
    return `+${cleaned.substring(0, 3)}-${cleaned.substring(3, 6)}-${cleaned.substring(6, 9)}-${cleaned.substring(9, 13)}`;
  }

  return `+${cleaned}`;
}

function formatInternational(string: string): string | null {
  // Format as +234xxxxxxxxxx
  let cleaned = string;

  if (cleaned.startsWith('0')) {
    cleaned = `234${cleaned.substring(1)}`;
  }

  if (!cleaned.startsWith('234')) {
    cleaned = `234${cleaned}`;
  }

  return `+${cleaned}`;
}

function formatWithPlus234(string: string): string | null {
  // Format as +234xxxxxxxxxx (explicit function for +234 formatting)
  let cleaned = string;

  if (cleaned.startsWith('0')) {
    cleaned = `234${cleaned.substring(1)}`;
  }

  if (!cleaned.startsWith('234')) {
    cleaned = `234${cleaned}`;
  }

  return `+${cleaned}`;
}


function formatMsisdn(string: string, format: FormatType = 'default'): string | null {
  // Handle null/undefined input
  if (!string) {
    return null;
  }

  // Remove all spaces from the input string
  const sanitizedString = string?.replace(/\s+/g, '');

  if (!isValidMsisdn(sanitizedString)) {
    return null;
  }

  const formatFunctions: { [key in FormatType]: (s: string) => string | null } = {
    compact: formatCompact,
    'compact-int': formatCompactInt,
    'compact-leading': formatCompactLeading,
    default: formatDefault,
    int: formatInternational,
    'plus-234': formatWithPlus234,
  };

  const formatted = formatFunctions[format](sanitizedString);
  return formatted;
}

// Convenience function for the default phone formatting used in forms
export const formatPhoneNumber = (phone: string, format: FormatType = 'default'): string => {
  if (!phone) return '';

  const formatted = formatMsisdn(phone, format);
  return formatted || phone; // Return original if formatting fails
};

// Convenience function specifically for +234 formatting
export const formatPhoneWithPlus234 = (phone: string): string => {
  if (!phone) return '';

  const formatted = formatMsisdn(phone, 'plus-234');
  return formatted || phone; // Return original if formatting fails
};
