
import React from 'react';
import { RewardRule } from './types';

/**
 * Determines if a navigation item should be marked as active based on the current path.
 * 
 * This function implements a hierarchical navigation system where only the most specific
 * matching route is considered active. It prevents multiple navigation items from being
 * active simultaneously when dealing with nested routes.
 * 
 * @param itemPath - The path of the navigation item to check (e.g., '/dashboard')
 * @param currentPath - The current URL pathname (e.g., '/dashboard/branch-level/1')
 * @param allPaths - Array of all available navigation paths for comparison
 * 
 * @returns `true` if the navigation item should be active, `false` otherwise
 * 
 * @example
 * ```typescript
 * const allPaths = ['/dashboard', '/dashboard/branch-level', '/dashboard/reward-table'];
 * 
 * // Exact match - always active
 * isNavigationItemActive('/dashboard', '/dashboard', allPaths); // true
 * 
 * // Child route with no more specific parent - active
 * isNavigationItemActive('/dashboard/branch-level', '/dashboard/branch-level/1', allPaths); // true
 * 
 * // Parent route when child exists - not active
 * isNavigationItemActive('/dashboard', '/dashboard/branch-level', allPaths); // false
 * 
 * // No match - not active
 * isNavigationItemActive('/dashboard', '/profile', allPaths); // false
 * ```
 * 
 * @remarks
 * The function uses a hierarchical approach:
 * 1. Exact matches are always active
 * 2. Child routes are only active if no more specific parent route exists
 * 3. Parent routes are inactive when a more specific child route matches
 * 
 * This prevents the common issue of both parent and child navigation items
 * being highlighted simultaneously in sidebar navigation.
 */
export const isNavigationItemActive = (itemPath: string, currentPath: string, allPaths: string[]) => {
  // Exact match is always active
  if (currentPath === itemPath) return true;

  // Check if current path is a child of this item
  if (!currentPath.startsWith(itemPath + '/')) return false;

  // Find the most specific matching parent route
  // A route is more specific if it's longer and the current path starts with it
  const moreSpecificPaths = allPaths.filter(path =>
    path !== itemPath &&
    path.length > itemPath.length &&
    (currentPath.startsWith(path + '/') || currentPath === path)
  );

  // Only active if no more specific route exists
  return moreSpecificPaths.length === 0;
};


/**
 * Converts a pathname to a readable page title
 * @param path - The pathname string (e.g., "/dashboard/branch-level")
 * @param searchParams - Optional search parameters object (e.g., { branchName: "My Branch" })
 * @returns A formatted title (e.g., "Branch Level" or "My Branch")
 */
export const getPageTitle = (path: string, searchParams?: Record<string, string>): string => {
  // Debug logging
  // console.log('getPageTitle - path:', path);
  // console.log('getPageTitle - searchParams:', searchParams);
  // console.log('getPageTitle - searchParams type:', typeof searchParams);
  // console.log('getPageTitle - searchParams keys:', searchParams ? Object.keys(searchParams) : 'undefined');

  // Check if we have a branchName in search params for branch-level routes
  if (searchParams?.branchName && path.includes('/branch-level/')) {
    console.log('Returning branchName:', searchParams.branchName);
    return searchParams.branchName;
  }
  if (searchParams?.merchantName && path.includes('/merchants/')) {
    return searchParams.merchantName;
  }

  const pathSegments = path.split('/').filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1];

  // Convert kebab-case or snake_case to Title Case
  return lastSegment
    ? lastSegment
      .split(/[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    : 'Dashboard';
};

/**
 * Converts a color to a class name
 * @param color - The color string (e.g., "green", "red", "gray")
 * @returns A class name (e.g., "bg-green-500", "bg-red-500", "bg-gray-400")
 */
export const getColorClass = (color: string) => {
  switch (color) {
    case 'green':
      return 'bg-green-500';
    case 'red':
      return 'bg-red-500';
    case 'gray':
      return 'bg-gray-400';
    default:
      return 'bg-gray-400';
  }
};

/**
 * Gets the appropriate Tailwind CSS class for bar chart colors
 * @param barColor - The bar color string (e.g., "orange", "red", "green")
 * @returns A Tailwind CSS background color class
 */
export const getBarColor = (barColor: string): string => {
  const colors = [
    'bg-yellow-500',
    'bg-red-500',
    'bg-white border-2 border-gray-200',
    'bg-blue-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-indigo-500',
    'bg-cyan-500'
  ];
  const index = parseInt(barColor) || 0;
  return colors[index % colors.length];
};

/**
 * Gets the appropriate hex color value for chart bars
 * @param barColor - The bar color string (e.g., "0", "1", "2")
 * @returns A hex color value for charts
 */
export const getChartBarColor = (barColor: string): string => {
  const colors = [
    '#eab308', // yellow-500
    '#ef4444', // red-500
    '#ffffff', // white
    '#3b82f6', // blue-500
    '#f97316', // orange-500
    '#ec4899', // pink-500
    '#22c55e', // green-500
    '#a855f7', // purple-500
    '#6366f1', // indigo-500
    '#06b6d4'  // cyan-500
  ];
  const index = parseInt(barColor) || 0;
  return colors[index % colors.length];
};

/**
 * Gets the appropriate Tailwind CSS ring color class for chart icons
 * @param ringColor - The ring color string (e.g., "red", "green", "black", "blue", "orange")
 * @returns A Tailwind CSS ring color class
 */
export const getRingColor = (ringColor: string): string => {
  const colors = [
    'ring-red-500',
    'ring-green-500',
    'ring-black',
    'ring-blue-500',
    'ring-orange-500',
    'ring-purple-500',
    'ring-pink-500',
    'ring-indigo-500',
    'ring-yellow-500',
    'ring-teal-500',
    'ring-cyan-500',
    'ring-gray-500'
  ];
  const index = parseInt(ringColor) || 0;
  return colors[index % colors.length];
};

/**
 * Gets the appropriate Tailwind CSS class for indicator colors in lists
 * @param indicatorColor - The indicator color string (e.g., "red", "green", "black", "blue", "orange", "purple", "yellow")
 * @returns A Tailwind CSS background color class
 */
export const getIndicatorColor = (indicatorColor: string): string => {
  switch (indicatorColor) {
    case 'red': return 'bg-red-500';
    case 'green': return 'bg-green-500';
    case 'black': return 'bg-black';
    case 'blue': return 'bg-blue-500';
    case 'orange': return 'bg-orange-500';
    case 'purple': return 'bg-purple-500';
    case 'yellow': return 'bg-yellow-500';
    default: return 'bg-gray-500';
  }
};

/**
 * Formats a number value with proper locale formatting and decimal places
 * @param value - The numeric value to format
 * @returns A formatted string with commas and 2 decimal places (e.g., "12,345.67")
 */
export const formatValue = (value: number): string => {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};


export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(amount).replace('NGN', '₦');
};

export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'inactive':
    case 'closed':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getStatusText = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'Active';
    case 'inactive':
    case 'closed':
      return 'Inactive';
    case 'pending':
      return 'Pending';
    default:
      return 'Unknown';
  }
};

/**
 * Gets the appropriate Tailwind CSS class for icon colors in modals
 * @param color - The color string (e.g., "red", "green", "blue", "yellow", "gray")
 * @returns A Tailwind CSS text color class
 */
export const getIconColorClass = (color: string): string => {
  switch (color) {
    case 'red':
      return 'text-red-500';
    case 'green':
      return 'text-green-500';
    case 'blue':
      return 'text-blue-500';
    case 'yellow':
      return 'text-yellow-500';
    case 'gray':
      return 'text-gray-500';
    default:
      return 'text-red-500';
  }
};

/**
 * Gets button styles for custom colors in modals
 * @param variant - The button variant
 * @param color - Optional custom color
 * @returns Style object with backgroundColor and borderColor
 */
export const getButtonStyle = (variant: string, color?: string): React.CSSProperties => {
  if (color) {
    return {
      backgroundColor: color,
      borderColor: color,
    };
  }
  return {};
};


export const generateUUID = () => {
  return crypto.randomUUID();
}


export function isStaticAsset(pathname: string) {
  return /\.(svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|eot|otf)$/i.test(pathname);
}


export const getRewardType = (earnMethod: string) => {
  switch (earnMethod) {
    case "percentage":
      return "PERCENTAGE_BASED";
    case "fixed":
      return "FIXED_POINTS";
    default:
      return "PERCENTAGE_BASED";
  }
};

export const getDistributionType = (receiveMethod: string) => {
  switch (receiveMethod) {
    case "INSTANT":
      return "INSTANT";
    case "LATER":
      return "LATER";
    default:
      return "INSTANT";
  }
};

// Reverse mapping functions for prepopulating forms
export const getEarnMethodFromRewardType = (rewardType: string) => {
  switch (rewardType) {
    case "PERCENTAGE_BASED":
      return "percentage";
    case "FIXED_POINTS":
      return "fixed";
    default:
      return "percentage";
  }
};

export const getReceiveMethodFromDistributionType = (distributionType: string) => {
  switch (distributionType) {
    case "INSTANT":
      return "INSTANT";
    case "LATER":
      return "LATER";
    case "MILESTONE_BASED":
      return "LATER";
    default:
      return "INSTANT";
  }
};

/**
 * Formats reward type from API enum to user-friendly display text
 * @param rewardType - The reward type from API (e.g., "PERCENTAGE_BASED")
 * @returns Formatted string for display (e.g., "Percentage Based")
 */
export const formatRewardType = (rewardType: string) => {
  switch (rewardType) {
    case "PERCENTAGE_BASED":
      return "Percentage Based";
    case "FIXED_POINTS":
      return "Fixed Points";
    default:
      return rewardType;
  }
};

/**
 * Formats distribution type from API enum to user-friendly display text
 * @param distributionType - The distribution type from API (e.g., "INSTANT")
 * @returns Formatted string for display (e.g., "Instant")
 */
export const formatDistributionType = (distributionType: string) => {
  switch (distributionType) {
    case "INSTANT":
      return "Instant";
    case "MILESTONE_BASED":
      return "Milestone Based";
    default:
      return distributionType;
  }
};

/**
 * Safely extracts rules from rewards object
 * @param rewards - The rewards object or null
 * @returns Array of rules or empty array if no rewards/rules
 */
export const getRewardsRules = (rewards: { rules?: Array<RewardRule> } | null): Array<RewardRule> => {
  if (!rewards || !rewards.rules) return [];
  return rewards.rules;
};

/**
 * Formats a date string with fallback
 * @param dateString - Date string or null
 * @param fallback - Fallback text if date is null
 * @returns Formatted date string or fallback
 */
export const formatDate = (dateString: string | null, fallback: string) => {
  if (!dateString) return fallback;
  return new Date(dateString).toLocaleDateString();
};

/**
 * Formats a date string with date and time
 * @param dateString - Date string to format
 * @returns Formatted date string with date and time (e.g., "Jan 15, 2024, 10:30 AM")
 */
export const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Creates summary data array from rewards object
 * @param rewards - The rewards object or null
 * @returns Array of summary data objects
 */
export const createRewardsSummaryData = (rewards: {
  rewardType: string;
  distributionType: string;
  startDate: string | null;
  endDate: string | null;
} | null) => {
  if (!rewards) return [];

  return [
    {
      icon: "giftIcon", // Will be replaced with actual icon in component
      label: "Reward Type",
      value: formatRewardType(rewards.rewardType)
    },
    {
      icon: "grayPointIcon", // Will be replaced with actual icon in component
      label: "Claim Type",
      value: formatDistributionType(rewards.distributionType)
    },
    {
      icon: "calenderIcon", // Will be replaced with actual icon in component
      label: "Issuing Date",
      value: formatDate(rewards.startDate, "From today")
    },
    {
      icon: "calenderIcon", // Will be replaced with actual icon in component
      label: "End Date",
      value: formatDate(rewards.endDate, "-")
    }
  ];
};

/**
 * Determines if skeleton should be shown
 * @param isPending - Loading state
 * @param rulesLength - Number of rules
 * @returns Boolean indicating if skeleton should show
 */
export const shouldShowSkeleton = (isPending: boolean, rulesLength: number) => {
  return isPending && rulesLength === 0;
};

/**
 * Determines if rules should be displayed
 * @param rulesLength - Number of rules
 * @returns Boolean indicating if rules should show
 */
export const shouldShowRules = (rulesLength: number) => {
  return rulesLength > 0;
};

/**
 * Determines if empty state should be shown
 * @param isPending - Loading state
 * @param rulesLength - Number of rules
 * @returns Boolean indicating if empty state should show
 */
export const shouldShowEmptyState = (isPending: boolean, rulesLength: number) => {
  return !isPending && rulesLength === 0;
};

/**
 * Formats a number with thousands separators and decimal places
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted number string (e.g., "100,000.00")
 */
export const formatNumber = (value: number | string, decimals: number = 2): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) return '0.00';

  return numValue.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

/**
 * Formats social media URLs for different platforms
 * 
 * This function intelligently formats URLs based on the platform type.
 * It preserves already complete URLs and formats incomplete ones appropriately.
 * 
 * @param url - The URL to format (can be complete, partial, or just a username/handle)
 * @param platform - The social media platform ('whatsapp', 'instagram', 'x', 'linkedin', 'snapchat', 'website')
 * @returns Formatted URL ready for use
 * 
 * @example
 * // Complete URLs are returned as-is
 * formatUrl('https://wa.link/a6zomo', 'whatsapp') // Returns: 'https://wa.link/a6zomo'
 * formatUrl('https://x.com/_iamclement_', 'x') // Returns: 'https://x.com/_iamclement_'
 * 
 * @example
 * // Partial URLs get https protocol added
 * formatUrl('wa.link/a6zomo', 'whatsapp') // Returns: 'https://wa.link/a6zomo'
 * formatUrl('x.com/_iamclement_', 'x') // Returns: 'https://x.com/_iamclement_'
 * 
 * @example
 * // Usernames/handles get platform-specific formatting
 * formatUrl('_iamclement_', 'x') // Returns: 'https://x.com/_iamclement_'
 * formatUrl('username', 'instagram') // Returns: 'https://instagram.com/username'
 * formatUrl('+2348012345679', 'whatsapp') // Returns: 'https://wa.me/2348012345679'
 * 
 * @example
 * // Website URLs just get https protocol
 * formatUrl('example.com', 'website') // Returns: 'https://example.com'
 * formatUrl('https://example.com', 'website') // Returns: 'https://example.com'
 */
export const formatUrl = (url: string, platform: string): string => {
  // If URL is already complete (starts with http/https), return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Handle different platforms for incomplete URLs
  switch (platform) {
    case 'whatsapp':
      // Handle different WhatsApp URL formats
      if (url.includes('wa.link/') || url.includes('wa.me/')) {
        return url.startsWith('http') ? url : `https://${url}`;
      }
      // Extract phone number and format for wa.me
      return `https://wa.me/${url.replace(/[^\d]/g, '')}`;

    case 'instagram':
      // Handle different Instagram URL formats
      if (url.includes('instagram.com/')) {
        return url.startsWith('http') ? url : `https://${url}`;
      }
      return `https://instagram.com/${url}`;

    case 'x':
      // Handle different X/Twitter URL formats
      if (url.includes('twitter.com/') || url.includes('x.com/')) {
        return url.startsWith('http') ? url : `https://${url}`;
      }
      return `https://x.com/${url}`;

    case 'linkedin':
      // Handle different LinkedIn URL formats
      if (url.includes('linkedin.com/')) {
        return url.startsWith('http') ? url : `https://${url}`;
      }
      return `https://linkedin.com/in/${url}`;

    case 'snapchat':
      // Handle different Snapchat URL formats
      if (url.includes('snapchat.com/')) {
        return url.startsWith('http') ? url : `https://${url}`;
      }
      return `https://snapchat.com/add/${url}`;

    case 'website':
      // For websites, just ensure https protocol
      return url.startsWith('http') ? url : `https://${url}`;

    default:
      return url;
  }
};

/**
 * Strips query parameters from S3 signed URLs to get the base URL
 * This prevents QR codes from encoding expired AWS signed URL parameters
 * @param url - The URL (potentially with query parameters)
 * @returns The base URL without query parameters
 * 
 * @example
 * cleanS3Url('https://bucket.s3.amazonaws.com/image.png?X-Amz-Security-Token=...')
 * // Returns: 'https://bucket.s3.amazonaws.com/image.png'
 */
export const cleanS3Url = (url: string | null | undefined): string => {
  if (!url || typeof url !== 'string') {
    return '';
  }

  try {
    // Parse the URL and extract just the base URL without query parameters
    const urlObj = new URL(url);
    return `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;
  } catch (error) {
    // If URL parsing fails, try to remove query string manually
    const queryIndex = url.indexOf('?');
    if (queryIndex !== -1) {
      return url.substring(0, queryIndex);
    }
    return url;
  }
};

/**
 * Downloads a QR code as a PNG image
 * @param printRef - Reference to the element containing the QR code SVG
 * @param title - Title for the downloaded file
 */
export const downloadQRCodeAsImage = async (printRef: React.RefObject<HTMLDivElement | null>, title: string) => {
  try {
    // Get the SVG element from the print ref
    const svgElement = printRef.current?.querySelector('svg');
    if (!svgElement) {
      console.error('QR code SVG not found');
      return;
    }

    // Convert SVG to canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size
    canvas.width = 400;
    canvas.height = 400;

    if (ctx) {
      // Draw white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Convert SVG to data URL
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);

      const img = document.createElement('img');
      img.onload = () => {
        // Calculate position to center the QR code
        const size = Math.min(canvas.width, canvas.height) - 40; // 20px padding on each side
        const x = (canvas.width - size) / 2;
        const y = (canvas.height - size) / 2;

        // Draw the QR code image
        ctx.drawImage(img, x, y, size, size);

        // Convert canvas to blob and download
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${title.replace(/\s+/g, '-').toLowerCase()}-qr-code.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            URL.revokeObjectURL(svgUrl);
          }
        }, 'image/png');
      };

      img.src = svgUrl;
    }
  } catch (error) {
    console.error('Error downloading QR code as image:', error);
    throw error;
  }
};


export const mapPointExpirationToForm = (pointExpirationDays: number): string => {
  if (pointExpirationDays === 1) return "1-day";
  if (pointExpirationDays === 3) return "3-days";
  if (pointExpirationDays === 7) return "7-days";
  if (pointExpirationDays === 14) return "14-days";
  if (pointExpirationDays === 30) return "30-days";
  return "never";
};

export const mapPointExpirationToApi = (pointExpiration: string): number => {
  if (pointExpiration === "1-day") return 1;
  if (pointExpiration === "3-days") return 3;
  if (pointExpiration === "7-days") return 7;
  if (pointExpiration === "14-days") return 14;
  if (pointExpiration === "30-days") return 30;
  return 0;
};

/**
 * Gets the current date in various formats
 * @param format - The format to return the date in ('iso', 'formatted', 'timestamp', 'dd-mm-yyyy')
 * @returns Current date in the specified format
 * 
 * @example
 * getCurrentDate('iso') // Returns: '2024-01-15T10:30:00.000Z'
 * getCurrentDate('formatted') // Returns: 'Jan 15, 2024'
 * getCurrentDate('timestamp') // Returns: 1705312200000
 * getCurrentDate('dd-mm-yyyy') // Returns: '15-01-2024'
 */
export const getCurrentDate = (format: 'iso' | 'formatted' | 'timestamp' | 'dd-mm-yyyy' = 'iso'): string | number => {
  const now = new Date();

  switch (format) {
    case 'iso':
      return now.toISOString();
    case 'formatted':
      return now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    case 'dd-mm-yyyy':
      return now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).replace(/\//g, '-');
    case 'timestamp':
      return now.getTime();
    default:
      return now.toISOString();
  }
};

/**
 * Gets yesterday's date in various formats
 * @param format - The format to return the date in ('iso', 'formatted', 'timestamp', 'dd-mm-yyyy')
 * @returns Yesterday's date in the specified format
 * 
 * @example
 * getYesterdayDate('iso') // Returns: '2024-01-14T10:30:00.000Z'
 * getYesterdayDate('formatted') // Returns: 'Jan 14, 2024'
 * getYesterdayDate('timestamp') // Returns: 1705225800000
 * getYesterdayDate('dd-mm-yyyy') // Returns: '14-01-2024'
 */
export const getYesterdayDate = (format: 'iso' | 'formatted' | 'timestamp' | 'dd-mm-yyyy' = 'iso'): string | number => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  switch (format) {
    case 'iso':
      return yesterday.toISOString();
    case 'formatted':
      return yesterday.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    case 'dd-mm-yyyy':
      return yesterday.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).replace(/\//g, '-');
    case 'timestamp':
      return yesterday.getTime();
    default:
      return yesterday.toISOString();
  }
};

/**
 * Gets the start and end dates for different timeline options
 * @param timeline - The timeline option ('Today', 'Yesterday', 'This Week', 'Last Week', 'This Month', 'Last Month', 'Custom Range')
 * @param customStartDate - Custom start date for 'Custom Range' (optional)
 * @param customEndDate - Custom end date for 'Custom Range' (optional)
 * @returns Object with startDate and endDate in YYYY-MM-DD format
 * 
 * @example
 * getTimelineDates('Today') // Returns: { startDate: '2024-01-15', endDate: '2024-01-15' }
 * getTimelineDates('Yesterday') // Returns: { startDate: '2024-01-14', endDate: '2024-01-14' }
 * getTimelineDates('This Week') // Returns: { startDate: '2024-01-15', endDate: '2024-01-21' }
 * getTimelineDates('Custom Range', '2024-01-01', '2024-01-31') // Returns: { startDate: '2024-01-01', endDate: '2024-01-31' }
 */
export const getTimelineDates = (
  timeline: string,
  customStartDate?: string,
  customEndDate?: string
): { startDate: string; endDate: string } => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Helper function to format date as YYYY-MM-DD (local timezone)
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Helper function to get start of week (Monday)
  const getStartOfWeek = (date: Date): Date => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(date.setDate(diff));
  };

  // Helper function to get end of week (Sunday)
  const getEndOfWeek = (date: Date): Date => {
    const startOfWeek = getStartOfWeek(new Date(date));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return endOfWeek;
  };

  // Helper function to get start of month
  const getStartOfMonth = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  // Helper function to get end of month
  const getEndOfMonth = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  };

  switch (timeline) {
    case 'Today':
      return {
        startDate: formatDate(today),
        endDate: formatDate(today)
      };

    case 'Yesterday': {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return {
        startDate: formatDate(yesterday),
        endDate: formatDate(yesterday)
      };
    }

    case 'This Week': {
      const startOfWeek = getStartOfWeek(new Date(today));
      const endOfWeek = getEndOfWeek(new Date(today));
      return {
        startDate: formatDate(startOfWeek),
        endDate: formatDate(endOfWeek)
      };
    }

    case 'Last Week': {
      const lastWeekStart = new Date(today);
      lastWeekStart.setDate(lastWeekStart.getDate() - 7);
      const startOfLastWeek = getStartOfWeek(lastWeekStart);
      const endOfLastWeek = getEndOfWeek(lastWeekStart);
      return {
        startDate: formatDate(startOfLastWeek),
        endDate: formatDate(endOfLastWeek)
      };
    }

    case 'This Month': {
      const startOfMonth = getStartOfMonth(today);
      const endOfMonth = getEndOfMonth(today);
      return {
        startDate: formatDate(startOfMonth),
        endDate: formatDate(endOfMonth)
      };
    }

    case 'Last Month': {
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const startOfLastMonth = getStartOfMonth(lastMonth);
      const endOfLastMonth = getEndOfMonth(lastMonth);
      return {
        startDate: formatDate(startOfLastMonth),
        endDate: formatDate(endOfLastMonth)
      };
    }

    case 'Custom Range':
      if (customStartDate && customEndDate) {
        return {
          startDate: customStartDate,
          endDate: customEndDate
        };
      }
      // Fallback to today if no custom dates provided
      return {
        startDate: formatDate(today),
        endDate: formatDate(today)
      };

    default:
      // Default to today
      return {
        startDate: formatDate(today),
        endDate: formatDate(today)
      };
  }
};

// File size validation utilities
export const parseFileSize = (sizeString: string): number => {
  const units: { [key: string]: number } = {
    'b': 1,
    'kb': 1024,
    'mb': 1024 * 1024,
    'gb': 1024 * 1024 * 1024,
  };

  const match = sizeString.toLowerCase().match(/^(\d+(?:\.\d+)?)\s*(b|kb|mb|gb)$/);
  if (!match) return 0;

  const size = parseFloat(match[1]);
  const unit = match[2];
  return size * units[unit];
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const validateFileSize = (file: File, maxSizeString: string): { isValid: boolean; error?: string } => {
  const maxSizeBytes = parseFileSize(maxSizeString);
  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `File size is ${formatFileSize(file.size)}. Maximum allowed size is ${maxSizeString.toUpperCase()}.`
    };
  }
  return { isValid: true };
};

// File type validation utility
export const validateFileType = (file: File, allowedTypes: string[] = ['image/png', 'image/jpeg', 'image/jpg']): { isValid: boolean; error?: string } => {
  if (!allowedTypes.includes(file.type)) {
    const allowedExtensions = allowedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ');
    return {
      isValid: false,
      error: `File type not supported. Please upload ${allowedExtensions} files only.`
    };
  }
  return { isValid: true };
};

// Image compression utility
export const compressImage = (file: File, maxWidth: number = 1920, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Compression failed'));
          }
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => reject(new Error('Image load failed'));
    img.src = URL.createObjectURL(file);
  });
};

// Calculate total payload size for validation
export const calculatePayloadSize = (data: { logo?: File; images?: File[]; managerProfilePhoto?: File }): number => {
  let totalSize = 0;

  // Calculate size of all files
  if (data.logo && data.logo instanceof File) {
    totalSize += data.logo.size;
  }

  if (data.images && Array.isArray(data.images)) {
    data.images.forEach((file: File) => {
      if (file instanceof File) {
        totalSize += file.size;
      }
    });
  }

  if (data.managerProfilePhoto && data.managerProfilePhoto instanceof File) {
    totalSize += data.managerProfilePhoto.size;
  }

  return totalSize;
};


// Function to clean phone number by removing country code and formatting
export const cleanPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return '';

  // Remove all non-digit characters
  let cleaned = phoneNumber.replace(/\D/g, '');

  // Remove Nigerian country code (234) if present
  if (cleaned.startsWith('234')) {
    cleaned = cleaned.substring(3);
  }

  // Remove leading zero if present (since we removed country code)
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }

  return cleaned;
};

/**
 * Formats a number with commas (e.g., 10000 -> 10,000)
 * @param value - The string value to format
 * @returns Formatted string with commas
 */
export const formatNumberWithCommas = (value: string): string => {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '');

  // Add commas every 3 digits from the right
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Removes commas from a string for numeric operations
 * @param value - The string value with commas
 * @returns String without commas
 */
export const removeCommas = (value: string): string => {
  return value.replace(/,/g, '');
};

/**
 * Validates if input contains only numeric characters and commas
 * @param value - The string value to validate
 * @returns Boolean indicating if input is numeric only
 */
export const isNumericOnly = (value: string): boolean => {
  // Allow empty string or only digits and commas
  return value === '' || /^[\d,]*$/.test(value);
};