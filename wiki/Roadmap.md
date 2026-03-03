# Roadmap

This roadmap outlines the planned features and improvements for hin. Items are subject to change based on community feedback and priorities.

---

## 🎯 Vision

To become the **most comprehensive, developer-friendly, and feature-rich open-source affiliate management platform** that empowers businesses of all sizes to build and scale their affiliate programs.

---

## ✅ Version 1.0.0 (October 2025)

**Status:** Released

### Core Features
- ✅ User authentication with JWT + OTP
- ✅ Admin dashboard with analytics
- ✅ Affiliate portal with earnings tracking
- ✅ Referral submission and tracking
- ✅ Commission calculation system
- ✅ Payout processing (Bank CSV, Stripe Connect)
- ✅ Email notifications (Resend integration)
- ✅ User status management (PENDING/ACTIVE/INACTIVE/SUSPENDED)
- ✅ Batch operations for admin
- ✅ Comprehensive API (31 endpoints)

### Documentation
- ✅ Complete README.md
- ✅ API documentation
- ✅ Deployment guides
- ✅ Database schema documentation
- ✅ Email configuration guide
- ✅ Contributing guidelines

### Infrastructure
- ✅ PostgreSQL database with Prisma ORM
- ✅ Next.js 15 with App Router
- ✅ TypeScript throughout
- ✅ Vercel deployment ready
- ✅ MIT License

---

## ✅ Version 1.1.0 (Current - December 2025)

**Status:** Released  
**Focus:** UI Modernization, Analytics & Webhooks

### Completed Features

#### UI Modernization
- ✅ Modern gradient backgrounds and glass-morphism effects
- ✅ Improved sidebar with better visual hierarchy
- ✅ Enhanced navigation with hover states and transitions
- ✅ Refined card shadows and border styling
- ✅ Better typography and spacing
- ✅ Smooth animations and micro-interactions

#### Analytics Dashboard
- ✅ Real-time conversion tracking
- ✅ Revenue attribution charts
- ✅ Top performers leaderboard
- ✅ Geographic analytics
- ✅ Traffic source tracking
- ✅ Conversion funnel visualization
- ✅ Custom date range filtering
- ✅ Export reports (CSV, PDF)

#### Reporting System
- ✅ Performance comparisons
- ✅ ROI calculator

#### Admin Improvements
- ✅ Bulk affiliate approval
- ✅ Advanced search and filters
- ✅ Activity audit logs
- ✅ Quick actions toolbar

#### API Enhancements (Webhooks)
- ✅ Webhooks for key events (12 event types)
- ✅ Webhook retry logic with exponential backoff
- ✅ Webhook signature verification
- ✅ Webhook logs and delivery tracking

#### Settings & Integration
- ✅ Simplified integration to Custom Integration only
- ✅ Removed third-party provider dependencies

#### Database
- ✅ New Webhook model
- ✅ New WebhookLog model
- ✅ WebhookStatus enum

---

## ✅ Version 1.2.0 (Q1 2026)

**Status:** Released (February 17, 2026)  
**Focus:** shadcn/ui Redesign & Code Quality

### Completed Features

#### shadcn/ui Redesign
- [x] Complete UI redesign with shadcn/ui component library (50+ components)
- [x] New login page with OTP-based 2-step verification flow
- [x] New register page with 3-step affiliate onboarding
- [x] Admin dashboard redesigned (stat cards, progress bars, quick actions)
- [x] Consistent design tokens via CSS custom properties

#### Code Quality
- [x] Resolved all 61 TypeScript compilation errors
- [x] Fixed tailwind.config.ts duplicate properties
- [x] Updated react-resizable-panels imports for v3
- [x] Regenerated Prisma client for full type exports
- [x] Cleaned up stale backup files

#### Advanced Reporting
- [x] Automated weekly/monthly reports (scheduled reports with DAILY/WEEKLY/BIWEEKLY/MONTHLY frequency)
- [x] Custom report builder (save/load report configurations with column & filter selection)
- [x] Email report delivery (send HTML reports via Resend to multiple recipients)
- [x] Cohort analysis (affiliate retention & performance by join date)

#### API Enhancements
- [x] API rate limiting (sliding window rate limiter with DB-backed tracking)
- [x] API key management (create, revoke, scope-based permissions, expiration)
- [x] API usage analytics (daily breakdown, top endpoints, status distribution, per-key usage)

---

## ✅ Version 1.3.0 (Q1 2026)

**Status:** Released (February 17, 2026)  
**Focus:** Production Hardening, Admin Expansion & Affiliate Portal

### Security Fixes (CRITICAL)
- [x] Login JWT cookie — Login API now creates and sets JWT token (was missing entirely)
- [x] Password hashing — Admin affiliate creation now uses bcrypt (was storing plain text)
- [x] Referral tracking — `/r/[code]` rewritten from localStorage mock to Prisma (was completely broken)
- [x] JWT secret standardization — All 20+ routes unified to single fallback secret

### Bug Fixes (HIGH)
- [x] Commission rates now use partner group rates + referral metadata (was hardcoded 10%/₹100)
- [x] 2 critical DELETE API handlers fixed (wrong model references)
- [x] PrismaClient singleton migration across 36 files (eliminated connection leaks)
- [x] Invoice delete functionality added to admin UI

### New Admin Pages (7 pages)
- [x] `/admin/invoices` — Invoice management
- [x] `/admin/team` — Team member management
- [x] `/admin/programs` — Program management
- [x] `/admin/coupons` — Coupon/discount codes
- [x] `/admin/resources` — Marketing resource library
- [x] `/admin/emails` — Email template editor
- [x] `/admin/program-settings` — Referral tracking widget

### Affiliate Sub-Pages (5 pages)
- [x] `/affiliate/referrals` — Referral submissions and tracking
- [x] `/affiliate/payouts` — Payout history
- [x] `/affiliate/resources` — Marketing materials
- [x] `/affiliate/reports` — Performance reports
- [x] `/affiliate/settings` — Profile and payment settings

### New API Endpoints (10+)
- [x] Invoices CRUD, Team CRUD, Programs CRUD, Coupons CRUD, Resources CRUD
- [x] Auto-payouts, Refund protection, Affiliate branding, Code regeneration

### Database (5 new models)
- [x] Coupon, Resource, Invoice, Program, TeamMember

### Production Test Suite
- [x] Comprehensive test script (`scripts/test-all.ts`) — 156 assertions, 15 sections
- [x] Full pipeline test: referral → click → conversion → commission → payout → transaction
- [x] Data integrity checks: orphans, passwords, duplicates, negative balances
- [x] File structure verification: 26 pages + 48 API routes

### Dead Code Removed (6 files)
- [x] Removed `database.ts`, `services/api.ts`, `AuthContext.tsx`, `Navigation.tsx`, `lib/api.ts`, root `route.ts`

### White-Label (Partial — carried to v1.4.0)
- [x] Custom email templates editor
- [x] Branded affiliate portal with custom branding API
- [ ] Custom domain support (moved to v1.4.0)
- [ ] Multi-language support / i18n (moved to v1.4.0)

---

## 🎨 Version 1.4.0 (Q2 2026)

**Target:** May 2026  
**Focus:** Customization, White-Label & Theme System

### Planned Features

#### White-Label Capabilities
- [ ] Custom domain support
- [ ] Multi-language support (i18n)
- [ ] Custom CSS/styling
- [ ] Custom terms & conditions

#### Theme System
- [ ] Multiple pre-built themes
- [ ] Dark mode support
- [ ] Theme customizer UI
- [ ] Custom component library
- [ ] Mobile app themes

#### Customization Tools
- [ ] Landing page builder
- [ ] Custom field builder
- [ ] Form customization
- [ ] Dashboard widget builder

---

## 💰 Version 1.5.0 (Q3 2026)

**Target:** July 2026  
**Focus:** Advanced Commission System

### Planned Features

#### Commission Enhancements
- [ ] Tiered commission structures
- [ ] Performance-based bonuses
- [ ] Recurring commission support
- [ ] Lifetime value tracking
- [ ] Commission caps and limits
- [ ] Group-based commission rates
- [ ] Product-specific commissions
- [ ] Time-based commission rules

#### Payout System
- [ ] Multiple payout methods (PayPal, Wise, etc.)
- [ ] Automatic payout scheduling
- [ ] Payout thresholds per affiliate
- [ ] Tax document generation (1099, etc.)
- [ ] Multi-currency support
- [ ] Payout history tracking
- [ ] Dispute management

#### Financial Reporting
- [ ] Tax reporting
- [ ] Profit & loss statements
- [ ] Commission forecasting
- [ ] Budget tracking
- [ ] Expense management

---

## 🔗 Version 1.6.0 (Q4 2026)

**Target:** October 2026  
**Focus:** Integrations & Ecosystem

### Planned Features

#### E-commerce Integrations
- [ ] Shopify plugin
- [ ] WooCommerce plugin
- [ ] Magento integration
- [ ] BigCommerce integration
- [ ] Custom cart integration

#### Payment Processors
- [ ] PayPal integration
- [ ] Square integration
- [ ] Wise integration
- [ ] Payoneer integration
- [ ] Cryptocurrency payouts

#### CRM Integrations
- [ ] HubSpot integration
- [ ] Salesforce integration
- [ ] Pipedrive integration
- [ ] Zoho CRM integration

#### Marketing Tools
- [ ] Mailchimp integration
- [ ] ConvertKit integration
- [ ] Google Analytics integration
- [ ] Facebook Pixel integration
- [ ] Custom tracking pixels

#### Automation
- [ ] Zapier integration
- [ ] Make.com integration
- [ ] Custom workflow builder
- [ ] Automated email sequences
- [ ] Trigger-based actions

---

## 🚀 Version 1.7.0 (Q1 2027)

**Target:** January 2027  
**Focus:** Advanced Features & Scale

### Planned Features

#### Multi-Tier Affiliates
- [ ] Affiliate hierarchy (MLM support)
- [ ] Sub-affiliate management
- [ ] Network-wide analytics
- [ ] Multi-level commissions
- [ ] Team performance tracking

#### Advanced Tracking
- [ ] Cross-device tracking
- [ ] Cookie-less tracking
- [ ] Server-side tracking
- [ ] UTM parameter support
- [ ] Custom parameter tracking
- [ ] Attribution modeling

#### Fraud Prevention
- [ ] Duplicate detection
- [ ] IP blocking
- [ ] Click fraud detection
- [ ] Automated fraud alerts
- [ ] Manual review queue
- [ ] Blacklist management

#### Performance
- [ ] Redis caching
- [ ] CDN integration
- [ ] Database optimization
- [ ] API response caching
- [ ] Load balancing support
- [ ] Horizontal scaling

#### Mobile App
- [ ] iOS app (React Native)
- [ ] Android app (React Native)
- [ ] Push notifications
- [ ] Offline mode
- [ ] QR code scanning

---

## 🔮 Version 2.0.0 (2027)

**Target:** Mid 2027  
**Focus:** Enterprise Features & AI

### Planned Features

#### Enterprise Features
- [ ] Multi-tenant architecture
- [ ] SSO (SAML, OAuth)
- [ ] Advanced permissions (RBAC)
- [ ] Custom roles
- [ ] Team management
- [ ] Department-based access
- [ ] Compliance tools (GDPR, CCPA)

#### AI & Machine Learning
- [ ] Predictive analytics
- [ ] Fraud detection AI
- [ ] Smart commission recommendations
- [ ] Conversion optimization
- [ ] Churn prediction
- [ ] Automated insights

#### Advanced Analytics
- [ ] Predictive modeling
- [ ] A/B testing platform
- [ ] Customer lifetime value
- [ ] Cohort retention analysis
- [ ] Attribution modeling
- [ ] Marketing mix modeling

#### Developer Tools
- [ ] GraphQL API
- [ ] SDK libraries (JS, Python, PHP)
- [ ] CLI tools
- [ ] Local development tools
- [ ] Testing frameworks
- [ ] API playground

---

## 💡 Backlog (Future Considerations)

These features are being considered but not yet scheduled:

### Community Requests
- [ ] Affiliate marketplace
- [ ] Resource library
- [ ] Training courses for affiliates
- [ ] Community forum
- [ ] Affiliate leaderboards
- [ ] Gamification features
- [ ] Badge system
- [ ] Challenges and contests

### Technical Improvements
- [ ] Microservices architecture
- [ ] Kubernetes deployment
- [ ] Real-time collaboration
- [ ] Advanced search (Elasticsearch)
- [ ] Time-series data (InfluxDB)
- [ ] Message queue (RabbitMQ)

### Business Features
- [ ] Affiliate onboarding wizard
- [ ] Contract management
- [ ] NDA signing
- [ ] Affiliate agreements
- [ ] Compliance tracking
- [ ] Legal document storage

---

## 📊 Priority Matrix

### High Priority (Next 3 Months)
1. White-label customization & themes
2. Multi-language support (i18n)
3. Dark mode
4. Advanced commission rules (tiered, recurring)
5. Custom domain support

### Medium Priority (3-6 Months)
1. E-commerce integrations (Shopify, WooCommerce)
2. Mobile app (React Native)
3. Fraud prevention
4. Performance optimization (Redis)
5. Multiple payout methods (PayPal, Wise)

### Low Priority (6+ Months)
1. Multi-tier affiliates (MLM)
2. AI features
3. Enterprise features (SSO, RBAC)
4. Marketplace
5. GraphQL API

---

## 🤝 Community Input

We value community feedback! Here's how you can influence the roadmap:

### Vote on Features
- **[GitHub Discussions](https://github.com/Heroic-Web/hin-dashboard/discussions)** - Vote on feature requests
- **[Feature Request Form](https://github.com/Heroic-Web/hin-dashboard/issues/new?template=feature_request.md)** - Suggest new features

### Contribute
- **[Open Issues](https://github.com/Heroic-Web/hin-dashboard/issues)** - Pick up an issue
- **[Pull Requests](https://github.com/Heroic-Web/hin-dashboard/pulls)** - Submit improvements
- **[Contributing Guide](Contributing)** - Learn how to contribute

### Sponsor Features
Want a feature prioritized? Consider sponsoring development:
- Email: hello@hin.com
- GitHub Sponsors: Coming soon

---

## 📅 Release Schedule

- **Minor Updates:** Monthly (bug fixes, small improvements)
- **Feature Releases:** Quarterly (new features, enhancements)
- **Major Versions:** Annually (breaking changes, major rewrites)

### Release Naming
- **X.0.0** - Major version (breaking changes)
- **1.X.0** - Minor version (new features)
- **1.0.X** - Patch version (bug fixes)

---

## 🔄 Recently Completed

### February 2026 (v1.3.0)
- ✅ 3 CRITICAL security fixes (login JWT, password hashing, referral tracking)
- ✅ PrismaClient singleton migration (36 files)
- ✅ 7 new admin pages (invoices, team, programs, coupons, resources, emails, program-settings)
- ✅ 5 affiliate sub-pages (referrals, payouts, resources, reports, settings)
- ✅ 10+ new API routes
- ✅ 5 new database models
- ✅ 156-assertion production test suite
- ✅ 6 dead code files removed
- ✅ Commission rates use partner group configuration

### February 2026 (v1.2.0)
- ✅ Complete shadcn/ui redesign (50+ components)
- ✅ Advanced reporting (scheduled, saved, cohort)
- ✅ API key management + rate limiting + analytics
- ✅ 61 TypeScript errors resolved

### December 2025 (v1.1.0)
- ✅ UI Modernization with gradient effects
- ✅ Analytics dashboard with charts
- ✅ Webhook system (12 event types)

### October 2025 (v1.0.0)
- ✅ Initial release with core features
- ✅ Admin dashboard & affiliate portal
- ✅ Email notifications, OTP auth, commission system

---

## 📣 Stay Updated

- **[GitHub Releases](https://github.com/Heroic-Web/hin-dashboard/releases)** - Version updates
- **[Changelog](Changelog)** - Detailed changes
- **[Blog](https://blog.hin.com)** - Announcements (coming soon)
- **[Twitter](https://twitter.com/hin)** - Quick updates (coming soon)
- **[Newsletter](https://hin.com/newsletter)** - Monthly digest (coming soon)

---

## 🎯 Long-Term Goals

### 2025-2026
- Become the #1 open-source affiliate platform
- 1,000+ GitHub stars
- 100+ contributors
- 50+ production deployments

### 2027-2028
- 10,000+ GitHub stars
- 500+ contributors
- 1,000+ production deployments
- Enterprise adoption

### 2029+
- Industry standard for affiliate management
- Large enterprise clients
- Global community
- Sustainable open-source business model

---

<p align="center">
  <strong>Have ideas for the roadmap?</strong><br>
  Share your thoughts in <a href="https://github.com/Heroic-Web/hin-dashboard/discussions">GitHub Discussions</a>
</p>

<p align="center">
  Last Updated: February 17, 2026
</p>
