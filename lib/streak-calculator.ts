/**
 * Timezone-aware streak calculation for Daily Bible Verse
 * Handles proper date boundary detection based on user's local timezone
 */

export interface StreakData {
  streak: number
  lastCompletedDate: string | null
  completedDates: string[]
}

/**
 * Calculate reading streak with timezone support
 * @param userId - User ID
 * @param timezone - User's timezone (e.g., 'America/New_York', 'Europe/London')
 * @param completedDates - Array of completed dates in YYYY-MM-DD format (UTC)
 * @returns StreakData object with streak count and metadata
 */
export function calculateStreak(
  userId: string, 
  timezone: string, 
  completedDates: string[]
): StreakData {
  if (!completedDates || completedDates.length === 0) {
    return {
      streak: 0,
      lastCompletedDate: null,
      completedDates: []
    }
  }

  // Sort dates in descending order (most recent first)
  const sortedDates = [...completedDates].sort((a, b) => b.localeCompare(a))
  
  // Get current date in user's timezone
  const now = new Date()
  const userNow = new Date(now.toLocaleString("en-US", { timeZone: timezone }))
  const todayInUserTz = userNow.toISOString().split('T')[0]
  
  // Convert all completed dates to user's timezone for comparison
  const completedDatesInUserTz = sortedDates.map(utcDate => {
    // Parse UTC date and convert to user's timezone
    const utcDateTime = new Date(utcDate + 'T00:00:00.000Z')
    const userDateTime = new Date(utcDateTime.toLocaleString("en-US", { timeZone: timezone }))
    return userDateTime.toISOString().split('T')[0]
  })

  // Remove duplicates and sort again
  const uniqueDates = [...new Set(completedDatesInUserTz)].sort((a, b) => b.localeCompare(a))
  
  let streak = 0
  let lastCompletedDate: string | null = null
  
  // Calculate streak by checking consecutive days
  for (let i = 0; i < uniqueDates.length; i++) {
    const checkDate = new Date(uniqueDates[i])
    const expectedDate = new Date(todayInUserTz)
    expectedDate.setDate(expectedDate.getDate() - i)
    const expectedDateStr = expectedDate.toISOString().split('T')[0]
    
    if (uniqueDates[i] === expectedDateStr) {
      streak++
      if (i === 0) {
        lastCompletedDate = uniqueDates[i]
      }
    } else {
      break
    }
  }
  
  return {
    streak,
    lastCompletedDate,
    completedDates: uniqueDates
  }
}

/**
 * Check if a date is today in the user's timezone
 * @param date - Date string in YYYY-MM-DD format
 * @param timezone - User's timezone
 * @returns boolean
 */
export function isTodayInTimezone(date: string, timezone: string): boolean {
  const now = new Date()
  const userNow = new Date(now.toLocaleString("en-US", { timeZone: timezone }))
  const todayInUserTz = userNow.toISOString().split('T')[0]
  
  return date === todayInUserTz
}

/**
 * Get user's timezone from browser or return default
 * @returns timezone string
 */
export function getUserTimezone(): string {
  if (typeof window !== 'undefined') {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  }
  return 'UTC' // Default fallback for server-side
}

/**
 * Convert UTC date to user's timezone date string
 * @param utcDate - UTC date string in YYYY-MM-DD format
 * @param timezone - User's timezone
 * @returns Date string in user's timezone
 */
export function convertToUserTimezone(utcDate: string, timezone: string): string {
  const utcDateTime = new Date(utcDate + 'T00:00:00.000Z')
  const userDateTime = new Date(utcDateTime.toLocaleString("en-US", { timeZone: timezone }))
  return userDateTime.toISOString().split('T')[0]
}

/**
 * Get date range for streak calculation (last 30 days)
 * @param timezone - User's timezone
 * @returns Object with start and end dates
 */
export function getStreakDateRange(timezone: string): { startDate: string; endDate: string } {
  const now = new Date()
  const userNow = new Date(now.toLocaleString("en-US", { timeZone: timezone }))
  const endDate = userNow.toISOString().split('T')[0]
  
  const startDate = new Date(userNow)
  startDate.setDate(startDate.getDate() - 30)
  const startDateStr = startDate.toISOString().split('T')[0]
  
  return { startDate: startDateStr, endDate }
}
