// Routing configuration for LightUp app
export interface RouteConfig {
  path: string
  name: string
  requireAuth: boolean
  unsavedDataTypes: string[]
  preload: boolean
  description: string
  category: 'public' | 'auth' | 'dashboard' | 'feature'
}

export const ROUTES: Record<string, RouteConfig> = {
  // Public routes
  home: {
    path: '/',
    name: 'Home',
    requireAuth: false,
    unsavedDataTypes: [],
    preload: true,
    description: 'Welcome to LightUp - Catholic Youth Platform',
    category: 'public'
  },
  features: {
    path: '/features',
    name: 'Features',
    requireAuth: false,
    unsavedDataTypes: [],
    preload: true,
    description: 'Explore LightUp features and capabilities',
    category: 'public'
  },
  about: {
    path: '/about',
    name: 'About',
    requireAuth: false,
    unsavedDataTypes: [],
    preload: false,
    description: 'Learn about LightUp and our mission',
    category: 'public'
  },
  support: {
    path: '/support',
    name: 'Support',
    requireAuth: false,
    unsavedDataTypes: [],
    preload: false,
    description: 'Get help and support',
    category: 'public'
  },
  search: {
    path: '/search',
    name: 'Search',
    requireAuth: false,
    unsavedDataTypes: [],
    preload: true,
    description: 'Search prayers, journal entries, groups, and events',
    category: 'public'
  },

  // Authentication routes
  signIn: {
    path: '/auth/sign-in',
    name: 'Sign In',
    requireAuth: false,
    unsavedDataTypes: [],
    preload: true,
    description: 'Sign in to your account',
    category: 'auth'
  },
  signUp: {
    path: '/auth/sign-up',
    name: 'Sign Up',
    requireAuth: false,
    unsavedDataTypes: [],
    preload: true,
    description: 'Create a new account',
    category: 'auth'
  },
  forgotPassword: {
    path: '/auth/forgot-password',
    name: 'Forgot Password',
    requireAuth: false,
    unsavedDataTypes: [],
    preload: false,
    description: 'Reset your password',
    category: 'auth'
  },
  resetPassword: {
    path: '/auth/reset-password',
    name: 'Reset Password',
    requireAuth: false,
    unsavedDataTypes: [],
    preload: false,
    description: 'Set a new password',
    category: 'auth'
  },

  // Dashboard routes
  dashboard: {
    path: '/dashboard',
    name: 'Dashboard',
    requireAuth: true,
    unsavedDataTypes: ['prayer', 'journal', 'event'],
    preload: true,
    description: 'Your personal dashboard',
    category: 'dashboard'
  },
  profile: {
    path: '/profile',
    name: 'Profile',
    requireAuth: true,
    unsavedDataTypes: [],
    preload: false,
    description: 'Manage your profile',
    category: 'dashboard'
  },
  settings: {
    path: '/settings',
    name: 'Settings',
    requireAuth: true,
    unsavedDataTypes: [],
    preload: false,
    description: 'Account and app settings',
    category: 'dashboard'
  },

  // Feature routes
  prayerWall: {
    path: '/prayer-wall',
    name: 'Prayer Wall',
    requireAuth: false,
    unsavedDataTypes: ['prayer'],
    preload: true,
    description: 'Share and pray for others',
    category: 'feature'
  },
  faithJournal: {
    path: '/faith-journal',
    name: 'Faith Journal',
    requireAuth: false,
    unsavedDataTypes: ['journal'],
    preload: true,
    description: 'Document your spiritual journey',
    category: 'feature'
  },
  faithQuiz: {
    path: '/faith-quiz',
    name: 'Faith Quiz',
    requireAuth: false,
    unsavedDataTypes: [],
    preload: true,
    description: 'Test your faith knowledge',
    category: 'feature'
  },
  faithBot: {
    path: '/faithbot',
    name: 'FaithBot AI',
    requireAuth: false,
    unsavedDataTypes: [],
    preload: true,
    description: 'AI assistant for faith questions',
    category: 'feature'
  },
  youthGroups: {
    path: '/youth-groups',
    name: 'Youth Groups',
    requireAuth: false,
    unsavedDataTypes: ['group'],
    preload: true,
    description: 'Find and join youth groups',
    category: 'feature'
  },
  dailyBibleVerse: {
    path: '/daily-bible-verse',
    name: 'Daily Bible Verse',
    requireAuth: false,
    unsavedDataTypes: [],
    preload: true,
    description: 'Daily scripture and reflection',
    category: 'feature'
  },
  liturgicalCalendar: {
    path: '/liturgical-calendar',
    name: 'Liturgical Calendar',
    requireAuth: false,
    unsavedDataTypes: [],
    preload: false,
    description: 'Catholic liturgical seasons and feast days',
    category: 'feature'
  }
}

// Route categories for navigation
export const ROUTE_CATEGORIES = {
  public: Object.values(ROUTES).filter(route => route.category === 'public'),
  auth: Object.values(ROUTES).filter(route => route.category === 'auth'),
  dashboard: Object.values(ROUTES).filter(route => route.category === 'dashboard'),
  feature: Object.values(ROUTES).filter(route => route.category === 'feature')
}

// Helper functions
export function getRouteByPath(path: string): RouteConfig | undefined {
  return Object.values(ROUTES).find(route => route.path === path)
}

export function getRoutesByCategory(category: string): RouteConfig[] {
  return Object.values(ROUTES).filter(route => route.category === category)
}

export function getPreloadableRoutes(): RouteConfig[] {
  return Object.values(ROUTES).filter(route => route.preload)
}

export function getProtectedRoutes(): RouteConfig[] {
  return Object.values(ROUTES).filter(route => route.requireAuth)
}

export function getRoutesWithUnsavedData(): RouteConfig[] {
  return Object.values(ROUTES).filter(route => route.unsavedDataTypes.length > 0)
}

// Navigation breadcrumbs
export function getBreadcrumbs(currentPath: string): Array<{ label: string; href: string }> {
  const route = getRouteByPath(currentPath)
  if (!route) return []

  const breadcrumbs = [
    { label: 'Home', href: '/' }
  ]

  // Add category-specific breadcrumbs
  if (route.category === 'feature') {
    breadcrumbs.push({ label: 'Features', href: '/features' })
  } else if (route.category === 'dashboard') {
    breadcrumbs.push({ label: 'Dashboard', href: '/dashboard' })
  }

  // Add current page (if not home)
  if (currentPath !== '/') {
    breadcrumbs.push({ label: route.name, href: currentPath })
  }

  return breadcrumbs
}
