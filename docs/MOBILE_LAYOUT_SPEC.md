# Mobile App Layout - Development Specification

## Document Metadata

- **Feature**: Common Mobile App Layout with Floating Bottom Navigation
- **Status**: Proposal - Awaiting Approval
- **Created**: 2025-12-06
- **Target Phase**: Phase 1.4 (UI/UX Enhancement)
- **Priority**: Medium
- **Estimated Complexity**: Medium

---

## Overview

This specification outlines the implementation of a modern, mobile-first application layout with a persistent header, scrollable content area, and floating bottom navigation with three action buttons.

### Goals

1. Create a reusable, responsive mobile layout structure
2. Implement a fixed header with branding and navigation options
3. Add a floating bottom navigation bar with three primary actions
4. Ensure the layout is accessible, performant, and follows modern mobile UX patterns
5. Maintain consistency with existing authentication UI and design system

### Non-Goals

- Tablet/desktop-specific layouts (mobile-first only)
- Native mobile app features (PWA features can be added later)
- Complex navigation hierarchies (keeping it simple with 3 main actions)
- Dark mode implementation (can be added as a future enhancement)

---

## Design Specification

### Visual Layout Structure

```
┌─────────────────────────────────────┐
│  [Logo/Title]    [Menu] [Profile]   │ ← Header (60px, fixed)
├─────────────────────────────────────┤
│                                     │
│                                     │
│      Main Content Area              │
│      (scrollable)                   │
│                                     │
│      - User info                    │
│      - Dashboard cards              │
│      - Activity feed                │
│      - etc.                         │
│                                     │
│                                     │
│                                     │
│                                     │
│                                     │
├─────────────────────────────────────┤
│  [Home]     [Action]     [Profile]  │ ← Bottom Nav (70px, fixed)
└─────────────────────────────────────┘
```

### Component Hierarchy

```
<MobileLayout>
  ├── <Header>
  │   ├── <Logo />
  │   ├── <MenuButton />
  │   └── <ProfileButton />
  │
  ├── <MainContent>
  │   └── {children} (page-specific content)
  │
  └── <BottomNavigation>
      ├── <NavButton icon="home" />
      ├── <NavButton icon="add" elevated />
      └── <NavButton icon="user" />
</MobileLayout>
```

### Design Tokens

```css
/* Colors */
--primary-gradient-start: #667eea
--primary-gradient-end: #764ba2
--surface-bg: #ffffff
--surface-elevated: #f7fafc
--text-primary: #1a202c
--text-secondary: #718096
--border-color: #e2e8f0
--shadow-color: rgba(0, 0, 0, 0.1)

/* Spacing */
--header-height: 60px
--bottom-nav-height: 70px
--content-padding: 1rem
--safe-area-top: env(safe-area-inset-top)
--safe-area-bottom: env(safe-area-inset-bottom)

/* Z-index layers */
--z-header: 100
--z-bottom-nav: 90
--z-elevated-button: 95
--z-content: 1

/* Shadows */
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12)
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1)
--shadow-lg: 0 10px 20px rgba(0, 0, 0, 0.15)
--shadow-floating: 0 8px 16px rgba(0, 0, 0, 0.2)
```

---

## Technical Specification

### Technology Stack

- **Framework**: Next.js 16.x (App Router) with React 19.x
- **Styling**: CSS Modules (consistent with existing codebase)
- **Icons**: SVG icons (inline for performance)
- **State Management**: React Context API for layout state (menu open/close)
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation

### File Structure

```
apps/web/src/
├── components/
│   └── layout/
│       ├── MobileLayout.tsx
│       ├── MobileLayout.module.css
│       ├── MobileLayout.spec.tsx
│       ├── Header/
│       │   ├── Header.tsx
│       │   ├── Header.module.css
│       │   └── Header.spec.tsx
│       ├── BottomNavigation/
│       │   ├── BottomNavigation.tsx
│       │   ├── BottomNavigation.module.css
│       │   └── BottomNavigation.spec.tsx
│       └── icons/
│           ├── HomeIcon.tsx
│           ├── PlusIcon.tsx
│           └── UserIcon.tsx
└── app/
    ├── layout.tsx (update to use MobileLayout)
    └── page.tsx (update to work with new layout)
```

### Component API Design

#### 1. MobileLayout Component

```typescript
// apps/web/src/components/layout/MobileLayout.tsx

interface MobileLayoutProps {
  children: React.ReactNode;
  showBottomNav?: boolean;
  showHeader?: boolean;
  headerTitle?: string;
  onMenuClick?: () => void;
  onProfileClick?: () => void;
}

export function MobileLayout({
  children,
  showBottomNav = true,
  showHeader = true,
  headerTitle = 'App',
  onMenuClick,
  onProfileClick,
}: MobileLayoutProps): JSX.Element;
```

**Responsibilities**:

- Orchestrate header, content, and bottom navigation
- Manage layout state (menu drawer open/close)
- Handle safe area insets for notched devices
- Provide scroll context for hiding/showing UI elements

#### 2. Header Component

```typescript
// apps/web/src/components/layout/Header/Header.tsx

interface HeaderProps {
  title?: string;
  onMenuClick?: () => void;
  onProfileClick?: () => void;
  showProfile?: boolean;
  transparent?: boolean;
}

export function Header({
  title = 'App',
  onMenuClick,
  onProfileClick,
  showProfile = true,
  transparent = false,
}: HeaderProps): JSX.Element;
```

**Features**:

- Fixed positioning at top
- App logo/title (left)
- Menu hamburger icon (middle-right)
- Profile avatar/icon (right)
- Optional transparency for scroll effects
- Safe area inset support for iOS notch

#### 3. BottomNavigation Component

```typescript
// apps/web/src/components/layout/BottomNavigation/BottomNavigation.tsx

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  elevated?: boolean;
}

interface BottomNavigationProps {
  items?: NavItem[];
  activeId?: string;
  onItemClick?: (id: string) => void;
}

export function BottomNavigation({
  items = defaultNavItems,
  activeId,
  onItemClick,
}: BottomNavigationProps): JSX.Element;
```

**Features**:

- Fixed positioning at bottom
- Three navigation buttons by default
- Center button elevated with larger touch target
- Active state indication
- Smooth transitions
- Safe area inset support for iOS home indicator
- Accessibility: role="navigation", proper ARIA labels

**Default Navigation Items**:

```typescript
const defaultNavItems: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: HomeIcon,
    href: '/',
    elevated: false,
  },
  {
    id: 'add',
    label: 'Add',
    icon: PlusIcon,
    href: '/add',
    elevated: true, // Larger, elevated button
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: UserIcon,
    href: '/profile',
    elevated: false,
  },
];
```

---

## Implementation Plan

### Phase 1: Core Layout Structure (2-3 hours)

**Tasks**:

1. Create `components/layout/` directory structure
2. Implement `MobileLayout` component
   - Basic structure with header, content, footer slots
   - CSS Grid or Flexbox layout
   - Safe area inset handling
3. Create CSS Module with responsive styles
4. Update `app/layout.tsx` to use MobileLayout
5. Update `app/page.tsx` to work within new layout

**Acceptance Criteria**:

- Layout renders with three distinct sections
- Header and bottom nav are fixed
- Content area scrolls independently
- No layout shift or flickering

### Phase 2: Header Implementation (1-2 hours)

**Tasks**:

1. Create `Header` component
2. Implement menu button (hamburger icon)
3. Implement profile button
4. Add logo/title area
5. Style with CSS Modules
6. Add responsive behavior
7. Integrate with MobileLayout

**Acceptance Criteria**:

- Header stays fixed at top during scroll
- All buttons are accessible and clickable
- Header respects safe area insets on iOS
- Menu and profile callbacks work correctly

### Phase 3: Bottom Navigation (2-3 hours)

**Tasks**:

1. Create `BottomNavigation` component
2. Implement three navigation buttons
3. Create SVG icon components (Home, Plus, User)
4. Implement elevated center button styling
5. Add active state styling
6. Implement Next.js Link integration
7. Add touch interaction feedback

**Acceptance Criteria**:

- Bottom nav stays fixed at bottom during scroll
- Center button is visually elevated
- Active state is clearly indicated
- Navigation works with Next.js routing
- Buttons have proper touch targets (min 44x44px)
- Respects safe area insets on iOS

### Phase 4: Polish & Refinements (1-2 hours)

**Tasks**:

1. Add smooth transitions and animations
2. Implement floating shadow for bottom nav
3. Add haptic feedback (if supported)
4. Optimize for performance (memoization)
5. Test on various screen sizes
6. Fix any visual glitches

**Acceptance Criteria**:

- Animations are smooth (60fps)
- No jank during scroll
- Works on screens from 320px to 428px width
- Passes performance audit (Lighthouse)

### Phase 5: Testing (2-3 hours)

**Tasks**:

1. Write unit tests for MobileLayout
2. Write unit tests for Header
3. Write unit tests for BottomNavigation
4. Write integration tests for navigation flow
5. Add accessibility tests (ARIA, keyboard nav)
6. Test on various devices/browsers

**Acceptance Criteria**:

- All components have >80% test coverage
- Navigation flow works end-to-end
- Passes accessibility audit (WAVE, axe)
- Works on Chrome, Safari, Firefox mobile

---

## User Experience Flows

### Flow 1: Home Navigation

```
User on any page
  → Taps "Home" button in bottom nav
  → Navigates to home page (/)
  → Bottom nav updates active state
  → Content area scrolls to top
```

### Flow 2: Add Action

```
User wants to create new item
  → Taps elevated "Add" button (center)
  → Navigates to /add route (or opens modal)
  → User can create new item
  → Returns to previous page on completion
```

### Flow 3: Profile Access

```
User wants to view profile
  → Taps "Profile" button in bottom nav
  → Navigates to profile page
  → OR taps profile icon in header
  → Opens profile menu/settings
```

### Flow 4: Menu Access

```
User wants to access menu
  → Taps hamburger menu icon in header
  → Side drawer/menu opens
  → User can access settings, logout, etc.
  → Drawer closes on item selection or backdrop tap
```

---

## Accessibility Requirements

### WCAG 2.1 AA Compliance

1. **Perceivable**

   - Minimum contrast ratio of 4.5:1 for text
   - Touch targets minimum 44x44px
   - Focus indicators visible on all interactive elements

2. **Operable**

   - All navigation accessible via keyboard
   - No keyboard traps
   - Skip to main content link
   - Touch targets well-spaced (min 8px gap)

3. **Understandable**

   - Clear labels for all navigation items
   - Consistent navigation pattern
   - Active state clearly indicated

4. **Robust**
   - Semantic HTML (`<nav>`, `<header>`, `<main>`)
   - Proper ARIA labels and roles
   - Works with screen readers (VoiceOver, TalkBack)

### Implementation Checklist

- [ ] Add `role="navigation"` to bottom nav
- [ ] Add `aria-label` to all icon buttons
- [ ] Add `aria-current="page"` to active nav item
- [ ] Implement focus management for menu drawer
- [ ] Test with VoiceOver (iOS) and TalkBack (Android)
- [ ] Ensure keyboard navigation works (Tab, Enter, Escape)
- [ ] Add skip links for keyboard users

---

## Performance Considerations

### Optimization Strategies

1. **Rendering Performance**

   - Use `React.memo()` for navigation components
   - Lazy load menu drawer content
   - Use CSS transforms for animations (GPU acceleration)
   - Avoid layout thrashing during scroll

2. **Bundle Size**

   - Inline SVG icons (avoid icon library)
   - CSS Modules for scoped styles (tree-shakable)
   - Code split menu drawer if complex

3. **Runtime Performance**
   - Debounce scroll listeners if adding scroll effects
   - Use `will-change` CSS property sparingly
   - Optimize re-renders with proper memoization

### Performance Budget

- Time to Interactive (TTI): < 3s on 3G
- First Contentful Paint (FCP): < 1.5s
- Layout shift (CLS): < 0.1
- JavaScript bundle increase: < 15KB gzipped
- CSS bundle increase: < 5KB gzipped

---

## Testing Strategy

### Unit Tests (Jest + React Testing Library)

**MobileLayout.spec.tsx**

```typescript
describe('MobileLayout', () => {
  it('should render children in main content area');
  it('should render header when showHeader is true');
  it('should hide header when showHeader is false');
  it('should render bottom navigation when showBottomNav is true');
  it('should hide bottom nav when showBottomNav is false');
  it('should call onMenuClick when menu button is clicked');
  it('should apply correct safe area insets');
});
```

**Header.spec.tsx**

```typescript
describe('Header', () => {
  it('should render title prop');
  it('should call onMenuClick when menu button is clicked');
  it('should call onProfileClick when profile button is clicked');
  it('should hide profile button when showProfile is false');
  it('should have proper ARIA labels');
  it('should be accessible via keyboard');
});
```

**BottomNavigation.spec.tsx**

```typescript
describe('BottomNavigation', () => {
  it('should render all navigation items');
  it('should highlight active item');
  it('should call onItemClick when item is clicked');
  it('should apply elevated styling to center button');
  it('should navigate to correct href on click');
  it('should have proper ARIA attributes');
  it('should be keyboard navigable');
});
```

### Integration Tests

**Navigation Flow Test**

```typescript
describe('Mobile Layout Navigation', () => {
  it('should navigate between pages using bottom nav');
  it('should maintain active state across navigation');
  it('should scroll content area without affecting fixed elements');
  it('should open menu drawer from header');
  it('should close menu drawer on item click');
});
```

### Visual Regression Tests (Optional - Future)

- Snapshot tests for each component
- Cross-browser visual testing (Percy, Chromatic)
- Responsive breakpoint testing

### Manual Testing Checklist

- [ ] Test on iPhone SE (smallest modern iPhone)
- [ ] Test on iPhone 14 Pro (notch)
- [ ] Test on Android (various sizes)
- [ ] Test in Chrome DevTools device emulation
- [ ] Test with slow 3G throttling
- [ ] Test with screen reader enabled
- [ ] Test keyboard navigation
- [ ] Test in landscape orientation
- [ ] Verify no horizontal scroll

---

## Implementation Questions for Iteration

Before proceeding with implementation, please clarify:

### 1. Bottom Navigation Actions

**Question**: What should the three bottom buttons do?

**Options**:

- **Option A**: Home, Add/Create, Profile

  - Standard social media app pattern
  - Center button for primary action

- **Option B**: Home, Dashboard, Settings

  - Business/productivity app pattern
  - Equal emphasis on all three

- **Option C**: Feed, Search, Notifications
  - Discovery-focused pattern
  - Center button for search

**Recommendation**: Option A (Home, Add, Profile) - most versatile and extensible

### 2. Header Menu Contents

**Question**: What should appear in the header menu?

**Options**:

- **Option A**: Minimal (Settings, Logout only)
- **Option B**: Full navigation (Settings, Help, About, Logout)
- **Option C**: Drawer with nested navigation

**Recommendation**: Option A for now, can expand later

### 3. Styling Approach

**Question**: Should we keep the purple gradient theme or go minimal?

**Options**:

- **Option A**: Keep gradient for header/nav (brand consistency)
- **Option B**: Clean white/gray minimal design
- **Option C**: Gradient accent with mostly white surfaces

**Recommendation**: Option C - gradient for floating bottom nav, white header

### 4. Animation Level

**Question**: How animated should the interface be?

**Options**:

- **Option A**: Minimal (simple fades)
- **Option B**: Moderate (slides, scales, bounces)
- **Option C**: Rich (complex transitions, micro-interactions)

**Recommendation**: Option B - smooth but not distracting

### 5. Future Features

**Question**: Should we plan for these features?

- [ ] Dark mode support
- [ ] Notification badges on nav items
- [ ] Gesture navigation (swipe to go back)
- [ ] Pull-to-refresh in content area
- [ ] Haptic feedback
- [ ] PWA install prompt

**Recommendation**: Keep architecture flexible, implement as needed in future phases

---

## Authentication-Aware Layout Strategy

### Critical Requirement

The mobile layout **MUST** be conditionally applied based on authentication state and route. This ensures:

- Login/Register pages use their own minimal design
- Authenticated app pages use the full mobile layout
- Proper separation of concerns between auth and app UI

### Layout Scenarios

#### Scenario 1: Logged Out - Login Page

```
Route: /login
Auth State: Logged out
Layout: NO mobile layout (custom login design)

┌─────────────────────────────────────┐
│                                     │
│         [Logo/Branding]             │
│                                     │
│     ┌───────────────────────┐       │
│     │   Email Input         │       │
│     │   Password Input      │       │
│     │   [Login Button]      │       │
│     └───────────────────────┘       │
│                                     │
│     Don't have account? Register    │
│                                     │
└─────────────────────────────────────┘

Features:
- Full screen centered card design
- No header, no bottom navigation
- Purple gradient background
- Focus on authentication form
```

#### Scenario 2: Logged Out - Register Page

```
Route: /register
Auth State: Logged out
Layout: NO mobile layout (custom register design)

Similar to login page:
- Full screen centered card
- No mobile layout components
- Registration form only
```

#### Scenario 3: Logged In - Home Page

```
Route: /
Auth State: Logged in
Layout: FULL mobile layout applied

┌─────────────────────────────────────┐
│  [Logo]      [Menu] [Profile]       │ ← Header
├─────────────────────────────────────┤
│  Welcome, John!                     │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  User Info Card             │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Activity Feed              │   │
│  └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│  [Home]     [Add]      [Profile]    │ ← Bottom Nav
└─────────────────────────────────────┘

Features:
- Fixed header with user context
- Scrollable content area
- Fixed bottom navigation
- All mobile layout features
```

#### Scenario 4: Logged In - Profile Page

```
Route: /profile
Auth State: Logged in
Layout: FULL mobile layout applied

Same structure as home:
- Header present
- Bottom navigation present
- Active state on Profile button
- Page-specific content in middle
```

#### Scenario 5: Logged In - Add/Create Page

```
Route: /add
Auth State: Logged in
Layout: FULL mobile layout applied

Same structure:
- Header present
- Bottom navigation present
- Active state on Add button
- Creation form in content area
```

### Implementation Strategy

#### Option A: Conditional Layout in Root Layout (Recommended)

**Pros**: Centralized logic, easy to maintain
**Cons**: Root layout needs to know about routes

```typescript
// apps/web/src/app/layout.tsx
'use client';

import { usePathname } from 'next/navigation';
import { MobileLayout } from '@/components/layout/MobileLayout';

const AUTH_ROUTES = ['/login', '/register'];

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          {isAuthRoute ? (
            // Auth pages: No mobile layout
            children
          ) : (
            // App pages: Full mobile layout
            <MobileLayout>{children}</MobileLayout>
          )}
        </QueryClientProvider>
      </body>
    </html>
  );
}
```

#### Option B: Route Groups (Next.js 13+ Pattern)

**Pros**: Clean separation, follows Next.js conventions
**Cons**: Requires restructuring app directory

```
apps/web/src/app/
├── (auth)/              # Auth route group (no layout)
│   ├── login/
│   │   └── page.tsx
│   └── register/
│       └── page.tsx
│
├── (app)/               # App route group (with mobile layout)
│   ├── layout.tsx       # MobileLayout wrapper
│   ├── page.tsx         # Home
│   ├── profile/
│   │   └── page.tsx
│   └── add/
│       └── page.tsx
│
└── layout.tsx           # Root layout (no MobileLayout)
```

**Recommended Implementation**: Option A for simplicity, can migrate to Option B later if needed.

---

## Completion Criteria - Authentication Scenarios

These scenarios **MUST** be tested and working before the feature is considered complete:

### Test Scenario 1: Logged Out User

```
GIVEN: User is not authenticated
WHEN: User visits /login
THEN:
  ✓ No header is displayed
  ✓ No bottom navigation is displayed
  ✓ Login form is centered and styled independently
  ✓ Purple gradient background is shown
  ✓ Page is fully functional for login
```

### Test Scenario 2: Logged Out Redirect

```
GIVEN: User is not authenticated
WHEN: User tries to visit / (home)
THEN:
  ✓ User is redirected to /login
  ✓ No mobile layout components are rendered
  ✓ Login page is shown
```

### Test Scenario 3: Login Success

```
GIVEN: User is on /login
WHEN: User enters valid credentials and clicks Login
THEN:
  ✓ User is authenticated
  ✓ User is redirected to / (home)
  ✓ Mobile layout appears (header + bottom nav)
  ✓ User info is displayed in content area
  ✓ "Home" button in bottom nav is active
```

### Test Scenario 4: Navigation While Logged In

```
GIVEN: User is authenticated and on home page
WHEN: User clicks "Profile" in bottom navigation
THEN:
  ✓ User navigates to /profile
  ✓ Header remains visible
  ✓ Bottom navigation remains visible
  ✓ "Profile" button is now active
  ✓ Content area shows profile information
```

### Test Scenario 5: Logout

```
GIVEN: User is authenticated and on any app page
WHEN: User clicks Logout (from header menu)
THEN:
  ✓ User is logged out
  ✓ User is redirected to /login
  ✓ Mobile layout is removed
  ✓ Login page is displayed without layout
  ✓ Token is cleared from localStorage
```

### Test Scenario 6: Direct URL Access

```
GIVEN: User is authenticated
WHEN: User directly navigates to /add
THEN:
  ✓ Page loads with mobile layout
  ✓ Header is visible
  ✓ Bottom nav is visible with "Add" active
  ✓ Add/create form is displayed
```

### Test Scenario 7: Back Navigation

```
GIVEN: User is on /profile
WHEN: User clicks "Home" in bottom navigation
THEN:
  ✓ User navigates to /
  ✓ Layout persists (no flicker)
  ✓ Content updates smoothly
  ✓ "Home" button is now active
```

---

## Integration with Existing Codebase

### Changes Required

**1. Update Root Layout** (`apps/web/src/app/layout.tsx`)

```typescript
'use client';

import { usePathname } from 'next/navigation';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { MobileLayout } from '@/components/layout/MobileLayout';
import './global.css';

const AUTH_ROUTES = ['/login', '/register'];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          {isAuthRoute ? children : <MobileLayout>{children}</MobileLayout>}
        </QueryClientProvider>
      </body>
    </html>
  );
}
```

**2. Update Home Page** (`apps/web/src/app/page.tsx`)

```typescript
// Remove outer container/page wrapper
// MobileLayout provides the structure
export default function HomePage() {
  return (
    <>
      <UserInfoCard user={user} />
      <ActivityFeed />
      {/* Other content */}
    </>
  );
}
```

**3. Create New Routes** (if using Option A for nav)

```
apps/web/src/app/
├── page.tsx (home)
├── add/
│   └── page.tsx (create new item)
└── profile/
    └── page.tsx (user profile)
```

### Backward Compatibility

- Existing pages will work within new layout
- Login page should **not** use MobileLayout (different design)
- Add `showHeader={false}` and `showBottomNav={false}` for auth pages

---

## Success Metrics

### Critical Authentication Scenarios (MUST PASS)

All scenarios from "Completion Criteria - Authentication Scenarios" section must pass:

- [ ] **Scenario 1**: Login page renders without mobile layout
- [ ] **Scenario 2**: Unauthenticated users redirected from protected routes
- [ ] **Scenario 3**: Login success shows mobile layout on home page
- [ ] **Scenario 4**: Bottom nav navigation works between app pages
- [ ] **Scenario 5**: Logout removes layout and redirects to login
- [ ] **Scenario 6**: Direct URL access works with proper layout
- [ ] **Scenario 7**: Navigation has no layout flicker or persistence issues

### Technical Metrics

- [ ] Lighthouse Performance Score: >90
- [ ] Lighthouse Accessibility Score: 100
- [ ] Lighthouse Best Practices Score: 100
- [ ] Bundle size increase: <20KB gzipped
- [ ] Test coverage: >80% for all layout components
- [ ] Zero console errors/warnings
- [ ] All 7 authentication scenarios pass manual testing
- [ ] All 7 authentication scenarios have automated tests

### UX Metrics (Post-Launch)

- User engagement with bottom navigation
- Time to complete common tasks
- Bounce rate on mobile
- User feedback/satisfaction surveys
- No reports of layout appearing on login/register pages
- No reports of missing layout on authenticated pages

---

## Migration & Rollout Plan

### Phase 1: Development

1. Create feature branch: `feature/mobile-layout`
2. Implement components following plan above
3. Write comprehensive tests
4. Code review

### Phase 2: Testing

1. Deploy to staging environment
2. QA testing on real devices
3. Accessibility audit
4. Performance testing

### Phase 3: Release

1. Merge to main branch
2. Deploy to production
3. Monitor analytics and error logs
4. Gather user feedback
5. Iterate based on feedback

### Rollback Plan

If critical issues are found:

1. Revert deployment
2. Fix issues in feature branch
3. Re-test thoroughly
4. Deploy again

---

## Open Questions & Decisions Needed

1. **Navigation Structure**: Confirm the three bottom navigation actions
2. **Menu Content**: Define what appears in header menu drawer
3. **Theme**: Confirm color scheme (gradient vs minimal)
4. **Future Features**: Prioritize which enhancements to plan for
5. **Routes**: Define routes for new navigation items (/add, /profile, etc.)
6. **Icons**: Use built-in SVG icons or add icon library?

---

## References & Resources

### Design Inspiration

- [Material Design Bottom Navigation](https://m3.material.io/components/navigation-bar/overview)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/tab-bars)
- [Mobile UX Best Practices](https://www.nngroup.com/articles/mobile-navigation/)

### Technical Resources

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [CSS Modules Documentation](https://github.com/css-modules/css-modules)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Existing Codebase

- [ARCHITECTURE.md](../ARCHITECTURE.md) - Project architecture
- [apps/web/src/app/login](../apps/web/src/app/login) - Existing UI patterns
- [apps/web/src/app/page.module.css](../apps/web/src/app/page.module.css) - Current styles

---

## Approval & Sign-off

**Prepared by**: Claude Code
**Review required from**: Product Owner, Tech Lead, UX Designer
**Approval status**: ⏳ Awaiting Review

### Definition of Done

This feature is considered **COMPLETE** only when:

1. ✅ All components implemented (MobileLayout, Header, BottomNavigation)
2. ✅ All 7 authentication scenarios pass (manual + automated tests)
3. ✅ Test coverage >80% for all layout components
4. ✅ Lighthouse scores meet targets (Performance >90, A11y 100)
5. ✅ Login page works WITHOUT mobile layout
6. ✅ Home page works WITH mobile layout
7. ✅ Navigation between routes maintains layout
8. ✅ Logout flow properly removes layout
9. ✅ Code review approved
10. ✅ QA testing on real devices passed

### Critical Success Factors

**MUST HAVE before deployment**:

- Login page must NOT show header/bottom nav (own design)
- Home page MUST show full mobile layout when logged in
- No layout flickering during route transitions
- Proper redirect behavior for logged out users

**Next Steps**:

1. Review this specification
2. Answer open questions in "Implementation Questions" section
3. Approve authentication scenario requirements
4. Approve design decisions (nav buttons, theme, animations)
5. Begin implementation upon full approval

---

## Revision History

| Version | Date       | Author      | Changes                                      |
| ------- | ---------- | ----------- | -------------------------------------------- |
| 1.0     | 2025-12-06 | Claude Code | Initial specification                        |
| 1.1     | 2025-12-06 | Claude Code | Added authentication-aware layout section    |
| 1.2     | 2025-12-06 | Claude Code | Added completion criteria for auth scenarios |
