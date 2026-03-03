# Changelog

All notable changes to hin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.3.0] - 2026-02-17

### 🔒 Production Hardening, Admin Expansion & Affiliate Portal

This release delivers critical security fixes, eliminates PrismaClient connection leaks across 36 files, adds 7 new admin pages, 5 affiliate sub-pages, 10+ new API routes, and a comprehensive 156-assertion production test suite. The platform is now verified production-ready.

### 🔒 Security Fixes (CRITICAL)

- **Login JWT Cookie** — Login API now creates JWT token via `SignJWT` and sets `auth-token` HTTP-only cookie (was missing entirely)
- **Password Hashing** — Admin affiliate creation now hashes passwords with `bcrypt.hash(password, 12)` (was storing plain text)
- **Referral Tracking** — `/r/[code]` route completely rewritten from broken `localStorage` mock to production Prisma queries (finds affiliate by `referralCode`, creates referral record, tracks click in `ReferralClick` table)
- **JWT Secret Standardization** — All 20+ route files standardized to single fallback secret (previously 3 different strings caused cross-route auth failures)

### 🐛 Bug Fixes (HIGH)

- **Commission Rates** — Referral approval now uses `partnerGroup.commissionRate` and `metadata.estimated_value` instead of hardcoded 10%/₹100 values
- **DELETE API Bugs** — Fixed 2 critical DELETE handlers that crashed with `prisma.undefined.delete()` due to wrong model references
- **PrismaClient Singleton** — Migrated 36 files from `new PrismaClient()` to shared singleton import, eliminating connection pool exhaustion in production
- **Invoice Delete** — Added missing delete functionality to admin invoices page (Trash2 icon + confirmation dialog)

### ✨ Added

#### New Admin Pages (7 pages)
- `/admin/invoices` — Invoice management with create, view, delete, and status tracking
- `/admin/team` — Team member management with role assignment and invitations
- `/admin/programs` — Affiliate program management with commission rate configuration
- `/admin/coupons` — Coupon/discount code management
- `/admin/resources` — Marketing resource library (banners, links, documents)
- `/admin/emails` — Email template editor with variable preview
- `/admin/program-settings` — Referral tracking widget with embed code generator

#### Affiliate Sub-Pages (5 pages)
- `/affiliate/referrals` — Referral submissions and tracking
- `/affiliate/payouts` — Payout history and requests
- `/affiliate/resources` — Access marketing materials
- `/affiliate/reports` — Performance reports and analytics
- `/affiliate/settings` — Profile and payment settings

#### New API Routes (10+ endpoints)
- `GET/POST/DELETE /api/admin/invoices` — Invoice CRUD
- `GET/POST/PUT/DELETE /api/admin/team` — Team member management
- `GET/POST/PUT/DELETE /api/admin/programs` — Program management
- `GET/POST/PUT/DELETE /api/admin/coupons` — Coupon management
- `GET/POST/DELETE /api/admin/resources` — Resource management
- `POST /api/admin/payouts/auto` — Automated payout processing
- `POST /api/admin/refunds` — Refund protection with commission clawback
- `GET/PUT /api/affiliate/branding` — Affiliate portal branding
- `POST /api/affiliate/generate-code` — Referral code regeneration
- `GET /api/affiliate/resources` — Affiliate resource access

#### Database Models (5 new)
- `Coupon` — Discount codes with usage tracking and expiration
- `Resource` — Marketing materials (IMAGE, DOCUMENT, LINK, VIDEO)
- `Invoice` — Invoice records with line items and tax
- `Program` — Affiliate program configurations
- `TeamMember` — Admin team with role-based access

#### Production Test Suite
- Comprehensive `scripts/test-all.ts` with 15 test sections
- 156 assertions covering all 28 database models
- Full affiliate pipeline test (referral → click → conversion → commission → balance → payout → transaction)
- Data integrity checks (orphaned records, unhashed passwords, duplicate codes, negative balances)
- File structure verification (26 pages + 48 API routes)
- All test data created and cleaned up automatically

#### Admin Sidebar Redesign
- 3 navigation groups: Main, Management, Configuration
- All 17 admin pages accessible from sidebar
- Active state highlighting and section grouping

#### Branded Affiliate Portal
- Custom branding API with logo, colors, and company name
- Branded sidebar with affiliate's company identity
- Consistent design across all affiliate sub-pages

### 🗑️ Removed

#### Dead Code Cleanup (6 files)
- `src/lib/database.ts` — 608-line localStorage mock (replaced by Prisma)
- `src/services/api.ts` — Unused API client referencing non-existent endpoints
- `src/context/AuthContext.tsx` — Legacy mock auth context
- `src/components/Navigation.tsx` — Legacy navigation with broken links
- `src/lib/api.ts` — Unused API wrapper
- `route.ts` — Empty root route file

### 🔧 Technical

- Zero TypeScript errors (`npx tsc --noEmit` passes cleanly)
- All 156 production tests pass (0 failures, 68.4s runtime)
- PrismaClient singleton used across all 36+ files
- JWT authentication verified: login, OTP, and all admin/affiliate routes
- 28 database models verified with record counts
- 1 admin user (ACTIVE), 102 active affiliates, 69 pending affiliates
- Currency: INR (₹) with cents-based storage throughout
- All passwords verified as properly hashed (bcrypt)
- No orphaned records, no duplicate referral codes, no negative balances

---

## [1.2.0] - 2026-02-17

### 🎨 shadcn/ui Redesign, Advanced Reporting & API Enhancements

This release delivers a complete UI redesign using the shadcn/ui component library, advanced reporting with scheduled/email delivery and cohort analysis, a full API key management system with rate limiting and usage analytics, and resolves all TypeScript compilation errors.

### ✨ Added

#### Advanced Reporting
- Scheduled reports with configurable frequency (Daily, Weekly, Biweekly, Monthly)
- Custom report builder — save and load report configurations with column and filter selection
- Email report delivery — generate and send HTML-formatted reports to multiple recipients via Resend
- Cohort analysis — analyze affiliate retention and performance grouped by join week or month
- New Reports page with 4 tabs: Generate, Scheduled, Saved, Cohort

#### API Key Management
- Full API key lifecycle: create, list (masked), toggle active, revoke
- Secure key generation with `rfq_` prefix + 32 random hex bytes (shown only once on creation)
- Scope-based permissions (read, write, admin)
- Configurable rate limits per key and optional expiration dates
- API Keys admin page with stats, key table, and inline authentication docs

#### API Rate Limiting & Analytics
- Sliding-window rate limiter backed by database (multi-instance safe)
- API key validation middleware with scope checking and usage logging
- API Analytics dashboard: stat cards, daily request chart, top endpoints, status distribution, per-key breakdown, recent logs
- `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset` response headers

#### Database Models (5 new)
- `ScheduledReport` — automated report configurations with frequency and recipients
- `SavedReport` — saved custom report builder configurations
- `ApiKey` — API keys with scopes, rate limits, and expiration
- `ApiUsageLog` — per-request usage logging with response times
- `RateLimitEntry` — sliding window rate limit tracking
- `ReportFrequency` enum (DAILY, WEEKLY, BIWEEKLY, MONTHLY)

#### New API Routes (6 endpoints)
- `GET/POST/PUT/DELETE /api/admin/scheduled-reports` — Scheduled report CRUD
- `GET/POST/PUT/DELETE /api/admin/saved-reports` — Saved report CRUD
- `GET/POST/PUT/DELETE /api/admin/api-keys` — API key management
- `GET /api/admin/api-usage` — Usage analytics with period filtering
- `GET /api/admin/reports/cohort` — Cohort analysis endpoint
- `POST /api/admin/reports/email` — Email report delivery

#### New Admin Pages (3 pages)
- `/admin/reports` — Expanded with Scheduled, Saved, and Cohort tabs
- `/admin/api-keys` — API key management UI
- `/admin/api-analytics` — API usage analytics dashboard

#### shadcn/ui Component Library
- Integrated 50+ shadcn/ui components (new-york style)
- Card, Button, Badge, Avatar, Progress, Separator, Tooltip, Skeleton
- InputOTP for OTP verification flows
- Alert components for form feedback
- Dialog, Tabs, Table for data management
- SidebarProvider with inset layout for admin

#### Login Page (New)
- Built from scratch with shadcn/ui Card and InputOTP
- 2-step OTP-based flow: email entry → 6-digit OTP verification
- Responsive design with branded gradient background
- Real-time form validation and error alerts

#### Register Page (New)
- 3-step registration flow: details → OTP → success
- Calls `/api/auth/register` then OTP verification
- Role auto-set to AFFILIATE on registration
- Consistent design language with login page

#### Admin Dashboard Redesign
- Stat cards with tooltips (Revenue, Commission, Partners, Referrals)
- Activity overview with Progress bar visualization
- Quick actions grid for common admin tasks
- Top partners list with Avatar and earnings
- Recent customers list with status badges
- Skeleton loading states during data fetch
- EmptyState component for zero-data scenarios

### 🔄 Changed

#### UI Framework
- Migrated from raw HTML/Tailwind to shadcn/ui components throughout
- Admin layout already using shadcn Sidebar (preserved)
- Partners list page using shadcn Tabs, Table, Dialog (preserved)
- Consistent design tokens via CSS custom properties

#### Dependencies
- Updated `react-resizable-panels` imports for v3 API (`Group`, `Panel`, `Separator`)
- Regenerated Prisma Client for proper type exports

### 🐛 Fixed

#### TypeScript Errors (61 resolved)
- **tailwind.config.ts** - Removed 6 duplicate property keys (sidebar colors, accordion keyframes/animations)
- **src/lib/auth.ts** - Fixed `User`, `Role`, `UserStatus` imports via Prisma client regeneration
- **src/components/ui/resizable.tsx** - Updated to named imports for react-resizable-panels v3
- **11 API route files** - Resolved 46 implicit `any` type errors via Prisma client regeneration
- **src/app/api/admin/referrals/route.ts** - Fixed `name`/`rate` property access on Map values
- **src/app/api/admin/dashboard/route.ts** - Fixed arithmetic operation type for `commissionRate`

#### Cleanup
- Removed stale backup files (`page.tsx.old`, `page.tsx.bak`, `page.tsx.backup`)

### 🔧 Technical
- Zero TypeScript errors (`npx tsc --noEmit` passes cleanly)
- All existing functionality preserved — no breaking changes
- Currency remains INR (₹) with cents-based storage
- New `src/lib/rate-limit.ts` library with `withRateLimit` middleware helper
- Admin sidebar updated with API Keys and API Analytics navigation items
- 5 new Prisma models synced to database via `prisma db push`
- API key authentication via `x-api-key` header

---

## [1.1.0] - 2025-12-14

### 🎨 UI Modernization & Analytics Release

This release focuses on modernizing the user interface, adding comprehensive analytics/reporting, and implementing webhooks system.

### ✨ Added

#### Analytics & Reporting Dashboard
- Real-time conversion tracking
- Revenue attribution charts with visual graphs
- Top performers leaderboard
- Geographic analytics
- Traffic source tracking
- Conversion funnel visualization
- Custom date range filtering (Today, 7 days, 30 days, 90 days, 1 year)
- Export reports (CSV, PDF)
- Performance comparisons
- ROI calculator

#### Webhooks System
- Webhook management API (CRUD operations)
- Support for 12 event types:
  - affiliate.created, affiliate.approved, affiliate.rejected
  - referral.submitted, referral.approved, referral.rejected
  - commission.created, commission.approved, commission.paid
  - payout.requested, payout.completed, payout.failed
- Webhook signature verification (HMAC SHA-256)
- Automatic retry logic with exponential backoff
- Webhook logs and delivery tracking
- Test webhook functionality
- Auto-disable after 5 consecutive failures

#### Admin Improvements
- Bulk affiliate approval/rejection
- Advanced search and filters
- Activity audit logs
- Quick actions toolbar
- Enhanced partner management

#### Admin Dashboard UI
- Modern gradient backgrounds and glass-morphism effects
- Improved sidebar with better visual hierarchy
- Enhanced navigation with hover states and transitions
- Refined card shadows and border styling
- Better typography and spacing
- Smooth animations and micro-interactions

#### Affiliate Portal UI
- Consistent modern design language
- Improved stats cards with gradient accents
- Better form styling and input states
- Enhanced table designs with hover effects
- Refined button styles and interactions

#### Database
- New `Webhook` model for webhook configurations
- New `WebhookLog` model for delivery tracking
- New `WebhookStatus` enum (PENDING, SUCCESS, FAILED, RETRYING)


### 🔄 Changed

#### Settings & Integration
- Simplified integration provider to "Custom Integration" only
- Removed third-party provider options (Tolt.io, Rewardful, Tapfiliate, PartnerStack)

#### CSS & Styling
- New CSS custom properties for consistent theming
- Added utility classes for modern effects
- Improved responsive breakpoints

### 🗑️ Removed
- Third-party integration provider options from Settings

### 📦 Dependencies
- All packages remain at latest stable versions

---

## [1.0.0] - 2025-10-10

### 🎉 Initial Release

The first stable release of hin - a comprehensive open-source affiliate management platform.

### ✨ Added

#### Core Features
- **User Authentication**
  - JWT-based authentication system
  - OTP (One-Time Password) email verification
  - Password-less login flow
  - Session management with cookies
  - Secure token refresh mechanism

- **Admin Dashboard**
  - Comprehensive analytics overview
  - Affiliate management (approve, reject, suspend)
  - Referral tracking and approval
  - Commission management
  - Payout processing interface
  - Program settings configuration
  - Batch operations (status changes, deletions)

- **Affiliate Portal**
  - Personal dashboard with earnings overview
  - Referral submission form
  - Referral history and status tracking
  - Commission breakdown
  - Payout history
  - Profile management
  - Unique referral code and links

- **Referral System**
  - Manual referral submission
  - Automatic tracking with referral codes
  - Status workflow (PENDING → APPROVED/REJECTED)
  - Referral details (name, email, company, value)
  - Notes and feedback system

- **Commission System**
  - Flexible commission rules (percentage & fixed)
  - Automatic commission calculation
  - Commission approval workflow
  - Commission history tracking
  - Unpaid/paid status management

- **Payout System**
  - Multiple payout methods (Bank CSV, Stripe Connect)
  - Batch payout processing
  - Payout history tracking
  - Status tracking (PENDING, PROCESSING, COMPLETED, FAILED)
  - Minimum payout thresholds

- **Email Notifications**
  - Welcome emails for new registrations
  - Referral submission notifications to admins
  - Approval/rejection emails to affiliates
  - Payout confirmation emails
  - Password reset emails
  - Email verification
  - Professional HTML templates with hin branding

- **User Management**
  - Role-based access (ADMIN, AFFILIATE)
  - Status management (PENDING, ACTIVE, INACTIVE, SUSPENDED)
  - User profile management
  - Account settings
  - Group assignments

#### API Endpoints (31 Total)

**Admin API (18 endpoints)**
- `GET/POST /api/admin/affiliates` - List and manage affiliates
- `PATCH/DELETE /api/admin/affiliates/[id]` - Update/delete individual affiliate
- `POST /api/admin/affiliates/batch` - Batch operations
- `GET /api/admin/dashboard` - Dashboard analytics
- `GET /api/admin/analytics` - Detailed analytics
- `GET /api/admin/reports` - Generate reports
- `GET/POST /api/admin/referrals` - Manage referrals
- `PUT/PATCH/DELETE /api/admin/referrals/[id]` - Update/delete referral
- `GET/POST /api/admin/payouts` - Process payouts
- `GET/PUT /api/admin/settings` - Program settings
- `GET/PUT /api/admin/settings/profile` - Admin profile
- `PUT /api/admin/settings/integration` - Integration settings
- `POST /api/admin/emails/test` - Test email configuration

**Affiliate API (6 endpoints)**
- `GET/POST /api/affiliate/referrals` - Submit and view referrals
- `GET /api/affiliate/payouts` - View payout history
- `GET/PUT /api/affiliate/profile` - Manage profile

**Auth API (7 endpoints)**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/send-otp` - Send OTP code
- `POST /api/auth/verify-otp` - Verify OTP code

**Webhook API (1 endpoint)**
- `POST /api/webhook/conversion` - External conversion tracking

**Testing API (1 endpoint)**
- `POST /api/test/email` - Email testing

#### Database Schema
- **Users** - User accounts with roles and status
- **Affiliates** - Affiliate profiles with referral codes
- **Referrals** - Tracked referrals with commissions
- **Commissions** - Commission records and calculations
- **Payouts** - Payout history and status
- **AuditLogs** - Activity tracking and auditing
- **ProgramSettings** - Configurable program settings

#### Documentation
- Comprehensive README.md
- API documentation (2000+ lines)
- Deployment guides (Vercel, AWS, Docker)
- Database schema documentation
- Email configuration guide (300+ lines)
- Email implementation guide
- Contributing guidelines
- Code of Conduct
- MIT License

#### Developer Tools
- Email testing script (`npm run test:email`)
- Prisma Studio integration
- TypeScript throughout
- ESLint configuration
- Prettier configuration
- Environment variable templates

#### UI/UX
- Modern, responsive design
- Tailwind CSS styling
- Green branding (#10b981)
- Mobile-friendly interface
- Accessible forms
- Loading states
- Error handling
- Toast notifications

### 🔧 Technical Stack
- **Frontend:** Next.js 15.2.3, React 19, TypeScript 5.8
- **Backend:** Next.js App Router, API Routes
- **Database:** PostgreSQL with Prisma ORM 6.16.3
- **Authentication:** JWT via jose library
- **Email:** Resend API
- **Styling:** Tailwind CSS 3.4
- **Validation:** Zod
- **HTTP Client:** Axios
- **Date Handling:** date-fns
- **Icons:** Lucide React
- **Charts:** Recharts

### 📦 Dependencies
- Production: 28 packages
- Development: 24 packages
- Zero vulnerabilities

### 🚀 Deployment
- Vercel deployment ready
- Docker support
- Environment variable configuration
- Database migration support
- Production build optimization

### 📚 Wiki
- Home page with navigation
- Quick Start Guide (5-minute setup)
- Roadmap with future features
- Changelog (this page)
- FAQ
- Troubleshooting guide

---

## [Unreleased]

Features in development or planned for next release.

### 🔄 In Progress
- Enhanced analytics dashboard
- Webhook system for integrations
- Advanced search and filtering
- Performance monitoring

### 📝 Planned
See our [Roadmap](Roadmap) for upcoming features.

---

## Version History Summary

| Version | Release Date | Highlights |
|---------|--------------|------------|
| 1.3.0 | 2026-02-17 | 🔒 Production Hardening, 3 Critical Security Fixes, 7 Admin Pages, 5 Affiliate Pages, 156-Test Suite |
| 1.2.0 | 2026-02-17 | 🎨 shadcn/ui Redesign, Advanced Reporting, API Keys & Analytics, 61 TS Fixes |
| 1.1.0 | 2025-12-14 | 🎨 UI Modernization, Analytics Dashboard, Webhooks System |
| 1.0.0 | 2025-10-10 | 🎉 Initial release with core features |

---

## Migration Guides

### From Pre-Release to 1.0.0

No migration needed - this is the first stable release.

---

## Breaking Changes

### Version 1.0.0
- First release - no breaking changes

---

## Deprecations

### Version 1.0.0
- No deprecations in initial release

---

## Security Updates

### Version 1.0.0
- JWT authentication with secure token handling
- Password hashing with bcrypt
- CSRF protection
- XSS prevention
- SQL injection prevention via Prisma
- Rate limiting recommended for production

---

## Known Issues

### Version 1.0.0

**Minor Issues:**
- Email delivery may be slow with free Resend tier
- Prisma Studio requires manual start
- No automatic session refresh (manual re-login required)

**Workarounds:**
- Upgrade Resend plan for faster delivery
- Use `npx prisma studio` command
- Set longer JWT expiration times

**Planned Fixes:**
- Automatic session refresh (v1.1.0)
- Integrated Prisma Studio (v1.2.0)
- Email queue system (v1.3.0)

---

## Contributors

### Version 1.0.0

Special thanks to everyone who contributed to the initial release:

- **hin Team** - Core development
- **Community** - Testing and feedback

Want to contribute? See our [Contributing Guide](Contributing).

---

## Release Notes Format

Each release includes:

### Added ✨
New features and functionality

### Changed 🔄
Changes to existing features

### Deprecated ⚠️
Features marked for removal

### Removed 🗑️
Removed features

### Fixed 🐛
Bug fixes

### Security 🔒
Security improvements

---

## Semantic Versioning

hin follows [Semantic Versioning](https://semver.org/):

- **MAJOR** (X.0.0) - Breaking changes
- **MINOR** (1.X.0) - New features (backwards compatible)
- **PATCH** (1.0.X) - Bug fixes (backwards compatible)

---

## Release Schedule

- **Patch Releases:** As needed (bug fixes)
- **Minor Releases:** Quarterly (new features)
- **Major Releases:** Annually (breaking changes)

---

## Getting Updates

Stay informed about new releases:

- **[GitHub Releases](https://github.com/Heroic-Web/hin-dashboard/releases)** - Official releases
- **[GitHub Watch](https://github.com/Heroic-Web/hin-dashboard)** - Get notifications
- **[Roadmap](Roadmap)** - See what's coming
- **Email:** hello@hin.com - Contact for updates

---

## Version Support

| Version | Status | Support Until |
|---------|--------|---------------|
| 1.3.x | Current | Ongoing |
| 1.2.x | Previous | Security updates (6 months) |
| 1.1.x | Legacy | Upgrade recommended |
| 1.0.x | EOL | Upgrade required |

### Support Policy
- **Current Version:** Full support with updates
- **Previous Minor:** Security updates only (6 months)
- **Older Versions:** No support (upgrade recommended)

---

<p align="center">
  <strong>Have feedback on a release?</strong><br>
  Share it in <a href="https://github.com/Heroic-Web/hin-dashboard/discussions">GitHub Discussions</a>
</p>

<p align="center">
  Last Updated: February 17, 2026
</p>
