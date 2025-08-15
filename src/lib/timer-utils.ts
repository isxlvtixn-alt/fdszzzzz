/**
 * Format time in milliseconds to display format (MM:SS.mmm or SS.mmm)
 */
export const formatTime = (timeMs: number): string => {
  if (timeMs < 0) return '0.000';
  
  const totalSeconds = timeMs / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const milliseconds = Math.floor((timeMs % 1000) / 10);

  if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  } else {
    return `${seconds}.${milliseconds.toString().padStart(2, '0')}`;
  }
};

/**
 * Format time for display in statistics (removes trailing zeros)
 */
export const formatTimeCompact = (timeMs: number): string => {
  const formatted = formatTime(timeMs);
  return formatted.replace(/\.?0+$/, '') || '0';
};

/**
 * Calculate average of times (excluding DNF)
 */
export const calculateAverage = (times: number[]): number => {
  if (times.length === 0) return 0;
  const validTimes = times.filter(time => time > 0);
  if (validTimes.length === 0) return 0;
  
  return validTimes.reduce((sum, time) => sum + time, 0) / validTimes.length;
};

/**
 * Calculate average of 5 (remove best and worst)
 */
export const calculateAverageOf5 = (times: number[]): number => {
  if (times.length < 5) return 0;
  
  const lastFive = times.slice(-5);
  const validTimes = lastFive.filter(time => time > 0);
  if (validTimes.length < 3) return 0;
  
  const sorted = [...validTimes].sort((a, b) => a - b);
  // Remove best and worst
  const middle = sorted.slice(1, -1);
  
  return middle.reduce((sum, time) => sum + time, 0) / middle.length;
};

/**
 * Calculate average of 12 (remove best and worst)
 */
export const calculateAverageOf12 = (times: number[]): number => {
  if (times.length < 12) return 0;
  
  const lastTwelve = times.slice(-12);
  const validTimes = lastTwelve.filter(time => time > 0);
  if (validTimes.length < 10) return 0;
  
  const sorted = [...validTimes].sort((a, b) => a - b);
  // Remove best and worst
  const middle = sorted.slice(1, -1);
  
  return middle.reduce((sum, time) => sum + time, 0) / middle.length;
};

/**
 * Get best time from array
 */
export const getBestTime = (times: number[]): number => {
  const validTimes = times.filter(time => time > 0);
  if (validTimes.length === 0) return 0;
  
  return Math.min(...validTimes);
};