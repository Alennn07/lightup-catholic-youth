# 🚀 LightUp Routing & Navigation Improvements

This document outlines the comprehensive routing and navigation improvements implemented for the LightUp Catholic Youth Platform.

## 📋 Overview

The improvements include:
- **Navigation Guards** - Prevent accidental loss of unsaved data
- **URL State Management** - Deep linking and state persistence
- **Smooth Navigation** - Enhanced page transitions
- **Focus Management** - Accessibility improvements
- **Lazy Loading** - Route-based code splitting
- **Enhanced Components** - Improved UX and accessibility

## 🛠️ New Hooks

### `useNavigationGuard`
Prevents accidental navigation when there's unsaved data.

```typescript
import { useNavigationGuard } from '@/hooks/use-navigation-guard'

function MyComponent() {
  const { 
    registerUnsavedData, 
    clearUnsavedData, 
    safeNavigate, 
    safeGoBack 
  } = useNavigationGuard()

  // Register unsaved data when editing
  const handleEdit = (id: string, data: any) => {
    registerUnsavedData(id, 'journal', data)
  }

  // Clear when saving
  const handleSave = (id: string) => {
    clearUnsavedData(id)
  }

  // Safe navigation with confirmation
  const handleNavigation = () => {
    safeNavigate('/other-page')
  }
}
```

### `useURLState`
Manages URL state for deep linking and state persistence.

```typescript
import { useURLState, useURLString, useURLBoolean } from '@/hooks/use-url-state'

function MyComponent() {
  // String state
  const [searchQuery, setSearchQuery] = useURLString('search', '')
  
  // Boolean state
  const [showFilters, setShowFilters] = useURLBoolean('filters', false)
  
  // Complex state
  const [filters, setFilters] = useURLState('filters', {
    category: '',
    sort: 'newest',
    page: 1
  })

  // State automatically syncs with URL
  return (
    <div>
      <input 
        value={searchQuery} 
        onChange={(e) => setSearchQuery(e.target.value)} 
      />
    </div>
  )
}
```

### `useSmoothNavigation`
Provides smooth page transitions and scroll management.

```typescript
import { useSmoothNavigation } from '@/hooks/use-smooth-navigation'

function MyComponent() {
  const { smoothNavigate, pageTransition } = useSmoothNavigation()

  const handleNavigation = () => {
    smoothNavigate('/other-page', {
      duration: 300,
      scrollToTop: true,
      preserveScroll: false
    })
  }
}
```

### `useFocusManagement`
Handles accessibility and focus management.

```typescript
import { useFocusManagement } from '@/hooks/use-focus-management'

function MyComponent() {
  const { 
    skipLinkRef, 
    mainContentRef, 
    focusOnNavigation 
  } = useFocusManagement()

  return (
    <div>
      <a ref={skipLinkRef} href="#main-content">
        Skip to main content
      </a>
      <main ref={mainContentRef} tabIndex={-1}>
        {/* Content */}
      </main>
    </div>
  )
}
```

## 🧩 New Components

### `RouteGuard`
Protects routes and handles unsaved data warnings.

```typescript
import { RouteGuard } from '@/components/route-guard'

function ProtectedPage() {
  return (
    <RouteGuard
      requireAuth={true}
      unsavedDataTypes={['prayer', 'journal']}
      fallbackPath="/auth/sign-in"
    >
      <YourPageContent />
    </RouteGuard>
  )
}
```

### `EnhancedPageWrapper`
Provides enhanced page functionality with transitions and accessibility.

```typescript
import { 
  EnhancedPageWrapper, 
  DashboardPageWrapper,
  FeaturePageWrapper 
} from '@/components/enhanced-page-wrapper'

// Basic wrapper
function MyPage() {
  return (
    <EnhancedPageWrapper
      unsavedDataTypes={['journal']}
      enableTransitions={true}
    >
      <YourContent />
    </EnhancedPageWrapper>
  )
}

// Specialized wrappers
function DashboardPage() {
  return (
    <DashboardPageWrapper>
      <DashboardContent />
    </DashboardPageWrapper>
  )
}
```

### `EnhancedBackButton`
Provides smart back navigation with fallbacks.

```typescript
import { EnhancedBackButton, Breadcrumb } from '@/components/enhanced-back-button'

function MyPage() {
  return (
    <div>
      <EnhancedBackButton 
        fallbackHref="/dashboard"
        fallbackLabel="Dashboard"
        showHomeButton={true}
      />
      
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Features', href: '/features' },
        { label: 'Current Page', href: '/current' }
      ]} />
    </div>
  )
}
```

### `LazyPage`
Implements route-based code splitting.

```typescript
import { LazyPage, useRoutePreloading } from '@/components/lazy-page'

function MyPage() {
  const { preloadOnHover } = useRoutePreloading()

  return (
    <div>
      <LazyPage 
        pageName="features"
        fallback={<CustomLoadingComponent />}
      />
      
      <Link 
        href="/other-page"
        onMouseEnter={() => preloadOnHover('/other-page')}
      >
        Other Page
      </Link>
    </div>
  )
}
```

## 🔧 Integration Examples

### Updating Existing Pages

**Before:**
```typescript
// app/faith-journal/page.tsx
export default function FaithJournalPage() {
  const router = useRouter()
  
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 pt-24 pb-8">
        <Button onClick={() => router.back()}>
          Back
        </Button>
        <FaithJournal />
      </div>
    </div>
  )
}
```

**After:**
```typescript
// app/faith-journal/page.tsx
import { EnhancedPageWrapper } from '@/components/enhanced-page-wrapper'
import { EnhancedNavigation } from '@/components/enhanced-navigation'
import { EnhancedBackButton } from '@/components/enhanced-back-button'
import { useNavigationGuard } from '@/hooks/use-navigation-guard'

export default function FaithJournalPage() {
  const { registerUnsavedData, clearUnsavedData } = useNavigationGuard()

  const handleEditStart = (id: string, data: any) => {
    registerUnsavedData(id, 'journal', data)
  }

  const handleSave = (id: string) => {
    clearUnsavedData(id)
  }

  return (
    <EnhancedPageWrapper
      unsavedDataTypes={['journal']}
      className="bg-gradient-to-br from-blue-50 via-white to-purple-50"
    >
      <EnhancedNavigation />
      <main className="container mx-auto px-4 pt-24 pb-8">
        <EnhancedBackButton 
          fallbackHref="/dashboard"
          fallbackLabel="Dashboard"
        />
        <FaithJournal 
          onEditStart={handleEditStart}
          onSave={handleSave}
        />
      </main>
    </EnhancedPageWrapper>
  )
}
```

### Adding URL State Management

```typescript
import { useURLState, useURLString } from '@/hooks/use-url-state'

function PrayerWallPage() {
  // URL state automatically syncs with browser URL
  const [searchQuery, setSearchQuery] = useURLString('search', '')
  const [category, setCategory] = useURLString('category', '')
  const [sortBy, setSortBy] = useURLState('sort', 'newest')

  return (
    <div>
      <input 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search prayers..."
      />
      {/* State persists in URL for deep linking */}
    </div>
  )
}
```

## 🎯 Best Practices

### 1. Navigation Guards
- Always register unsaved data when editing
- Clear unsaved data when saving or cancelling
- Use appropriate data types for different content

### 2. URL State Management
- Use URL state for filters, search, and pagination
- Keep state simple and serializable
- Provide sensible defaults

### 3. Focus Management
- Always include skip links for accessibility
- Manage focus on route changes
- Provide keyboard navigation support

### 4. Lazy Loading
- Preload critical routes
- Use loading skeletons for better UX
- Implement error boundaries

### 5. Smooth Navigation
- Use appropriate transition durations
- Consider scroll restoration
- Provide visual feedback during navigation

## 🚀 Performance Optimizations

### Route Preloading
```typescript
// Preload critical routes on app start
useEffect(() => {
  preloadPage('dashboard')
  preloadPage('prayer-wall')
  preloadPage('faith-journal')
}, [])
```

### Code Splitting
```typescript
// Lazy load non-critical components
const NonCriticalComponent = lazy(() => import('./NonCriticalComponent'))
```

### Caching
```typescript
// Use React Query or SWR for data caching
const { data, isLoading } = useSWR('/api/prayers', fetcher, {
  revalidateOnFocus: false,
  dedupingInterval: 60000
})
```

## 🔍 Accessibility Features

### Keyboard Navigation
- **Alt + S**: Skip to main content
- **Escape**: Close modals and overlays
- **Tab**: Navigate through focusable elements

### Screen Reader Support
- Proper ARIA labels and roles
- Live regions for dynamic content
- Focus management on route changes

### Focus Indicators
- Visible focus indicators
- Logical tab order
- Skip links for main content

## 📱 Mobile Optimizations

### Touch Navigation
- Touch-friendly button sizes
- Swipe gestures for navigation
- Optimized mobile layouts

### Performance
- Reduced bundle sizes with code splitting
- Optimized images and assets
- Efficient state management

## 🧪 Testing

### Navigation Testing
```typescript
// Test navigation guards
test('prevents navigation with unsaved data', async () => {
  const { result } = renderHook(() => useNavigationGuard())
  
  result.current.registerUnsavedData('test-id', 'journal', {})
  
  const canNavigate = await result.current.safeNavigate('/other-page')
  expect(canNavigate).toBe(false)
})
```

### URL State Testing
```typescript
// Test URL state management
test('syncs state with URL', () => {
  const { result } = renderHook(() => useURLString('search', ''))
  
  act(() => {
    result.current[1]('test query')
  })
  
  expect(window.location.search).toContain('search=test%20query')
})
```

## 🔧 Configuration

### Route Configuration
```typescript
// lib/routing-config.ts
export const ROUTES = {
  prayerWall: {
    path: '/prayer-wall',
    requireAuth: false,
    unsavedDataTypes: ['prayer'],
    preload: true
  }
  // ... other routes
}
```

### Middleware Updates
```typescript
// app/middleware.ts
export async function middleware(request: NextRequest) {
  // Existing middleware logic
  // Add navigation guard checks
  // Handle unsaved data warnings
}
```

## 📈 Monitoring

### Performance Metrics
- Route change timing
- Bundle size impact
- User interaction tracking

### Error Tracking
- Navigation errors
- State management issues
- Accessibility violations

## 🎉 Benefits

### For Users
- **Better UX**: Smooth transitions and intuitive navigation
- **Data Safety**: Protection against accidental data loss
- **Accessibility**: Full keyboard and screen reader support
- **Performance**: Faster page loads with lazy loading

### For Developers
- **Maintainable**: Clean, reusable components and hooks
- **Type Safe**: Full TypeScript support
- **Testable**: Comprehensive testing utilities
- **Scalable**: Easy to extend and modify

## 🚀 Getting Started

1. **Install Dependencies**: All hooks and components are ready to use
2. **Update Pages**: Replace existing navigation with enhanced components
3. **Add Guards**: Implement navigation guards for data protection
4. **Configure Routes**: Set up route configuration for your app
5. **Test Thoroughly**: Ensure all functionality works as expected

The routing improvements provide a solid foundation for a modern, accessible, and performant web application while maintaining the existing LightUp functionality.
