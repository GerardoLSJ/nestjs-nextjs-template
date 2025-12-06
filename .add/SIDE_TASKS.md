# Side Tasks & Nice-to-Haves

> Parallel work and improvements that can be done alongside main tasks

## Active Side Tasks

### 📝 Documentation Improvements

**Priority**: LOW
**Effort**: Ongoing
**Status**: 🔄 ONGOING

**Tasks**:

- [ ] Add JSDoc comments to complex functions
- [ ] Create API usage examples in ARCHITECTURE.md
- [ ] Add diagrams for authentication flow
- [ ] Document environment variables in .env.example

**Why it matters**: Better onboarding for new developers, easier maintenance

---

### 🧪 Test Coverage Improvements

**Priority**: MEDIUM
**Effort**: ~2 hours
**Status**: 💡 IDEA

**Current Coverage**:

- API: ~90% (10/10 unit tests, 6/6 E2E tests)
- Web: ~85% (96/98 unit tests)
- Shared Types: 100% (1/1 tests)

**Tasks**:

- [ ] Add edge case tests for useEvents hook (2 currently skipped)
- [ ] Add integration tests for event creation flow
- [ ] Add E2E tests for event planner feature
- [ ] Improve error handling tests
- [ ] Add performance tests for query efficiency

**Goal**: Achieve 90%+ coverage across all projects

---

### 🎨 UI/UX Polish

**Priority**: LOW
**Effort**: ~2 hours
**Status**: 💡 IDEA

**Tasks**:

- [ ] Add loading skeletons instead of "Loading..." text
- [ ] Add success toast notifications for create/delete events
- [ ] Add confirmation dialog for delete event
- [ ] Improve empty states with illustrations or icons
- [ ] Add dark mode support
- [ ] Add animations for list items (fade in/out)
- [ ] Improve mobile responsiveness (touch targets, spacing)

**Why it matters**: Better user experience, more polished application

---

### ♿ Accessibility Improvements

**Priority**: MEDIUM
**Effort**: ~1 hour
**Status**: 💡 IDEA

**Tasks**:

- [ ] Run axe DevTools audit
- [ ] Fix any WCAG violations
- [ ] Add keyboard shortcuts documentation
- [ ] Improve focus management (trap focus in modals)
- [ ] Add screen reader announcements for dynamic content
- [ ] Test with screen readers (NVDA, JAWS, VoiceOver)
- [ ] Add skip navigation link

**Goal**: WCAG 2.1 Level AA compliance

---

### 🔧 Developer Experience

**Priority**: LOW
**Effort**: ~1 hour
**Status**: 💡 IDEA

**Tasks**:

- [ ] Add pre-commit hooks (lint, test)
- [ ] Setup Husky for git hooks
- [ ] Add commit message linting (commitlint)
- [ ] Add GitHub Actions CI/CD workflow
- [ ] Add code coverage reporting
- [ ] Setup Dependabot for dependency updates
- [ ] Add VS Code recommended extensions

**Why it matters**: Faster development, fewer bugs, consistent code quality

---

### 📊 Performance Optimization

**Priority**: LOW
**Effort**: ~2 hours
**Status**: 💡 IDEA

**Tasks**:

- [ ] Analyze bundle size with webpack-bundle-analyzer
- [ ] Implement code splitting for routes
- [ ] Add React.lazy() for heavy components
- [ ] Optimize images (next/image)
- [ ] Add service worker for offline support
- [ ] Implement virtual scrolling for long event lists
- [ ] Add pagination for events

**Current Performance**:

- Web bundle size: ~500KB (unoptimized)
- Initial page load: ~1.5s
- Time to interactive: ~2s

**Goal**: <200KB bundle, <1s load time

---

### 🔍 Code Quality

**Priority**: MEDIUM
**Effort**: Ongoing
**Status**: 🔄 ONGOING

**Tasks**:

- [ ] Run SonarQube analysis
- [ ] Fix any code smells
- [ ] Reduce code duplication (DRY principle)
- [ ] Improve TypeScript strict mode compliance
- [ ] Add ESLint rules for React best practices
- [ ] Setup Prettier for consistent formatting
- [ ] Add spell checker (cspell)

**Current State**:

- 5 pre-existing lint warnings
- TypeScript strict mode enabled
- No major code smells identified

---

## Completed Side Tasks

### ✅ MSW Testing Infrastructure (Session 2)

**Completed**: 2025-12-06

**What was done**:

- Setup MSW for frontend testing
- Created polyfills for Jest environment
- Added test utilities

**Impact**: Frontend can be tested without backend, faster test execution

---

### ✅ Cleanup Scripts (Session 1)

**Completed**: 2025-12-05

**What was done**:

- Added npm run kill-ports script
- Added npm run clean-locks script
- Added npm run dev:clean script

**Impact**: Fewer port conflicts, smoother development workflow

---

## Future Side Tasks

### 🌐 Internationalization (i18n)

**Priority**: LOW
**Effort**: ~3 hours
**Status**: 💡 IDEA

**Tasks**:

- [ ] Install next-intl or react-i18next
- [ ] Extract all strings to translation files
- [ ] Add language switcher
- [ ] Support English and one other language
- [ ] Add locale-based date formatting

**Why defer**: Not critical for MVP, can add later

---

### 📱 Progressive Web App (PWA)

**Priority**: LOW
**Effort**: ~2 hours
**Status**: 💡 IDEA

**Tasks**:

- [ ] Add manifest.json
- [ ] Add service worker for offline support
- [ ] Add install prompt
- [ ] Add offline fallback page
- [ ] Test on mobile devices

**Why defer**: Nice-to-have, not critical for core functionality

---

### 🔐 Advanced Security Features

**Priority**: LOW
**Effort**: ~4 hours
**Status**: 💡 IDEA

**Tasks**:

- [ ] Add rate limiting
- [ ] Add CSRF protection
- [ ] Add XSS protection headers
- [ ] Add Content Security Policy
- [ ] Add input sanitization
- [ ] Add password strength requirements
- [ ] Add account lockout after failed attempts
- [ ] Add security audit logging

**Why defer**: Basic security in place, can enhance later

---

### 📈 Analytics & Monitoring

**Priority**: LOW
**Effort**: ~2 hours
**Status**: 💡 IDEA

**Tasks**:

- [ ] Add error tracking (Sentry)
- [ ] Add performance monitoring (Lighthouse CI)
- [ ] Add usage analytics (Google Analytics, Plausible)
- [ ] Add custom event tracking
- [ ] Setup alerting for errors

**Why defer**: Not needed for development/MVP

---

## Notes

- Side tasks should not block main development
- Can be picked up during downtime or as learning opportunities
- Prioritize based on user feedback and pain points
- Document decisions in DECISIONS.md if choosing to implement
