# Welcome to the hin Wiki! 🎉

<p align="center">
  <img src="https://raw.githubusercontent.com/hin/hin/main/public/images/logo/hin-logo.svg" alt="hin Logo" width="200"/>
</p>

<p align="center">
  <strong>The Open Source Affiliate Management Platform</strong>
</p>

---

## 📚 Documentation Navigation

### Getting Started
- **[Home](Home)** - You are here!
- **[Quick Start Guide](Quick-Start-Guide)** - Get up and running in 5 minutes
- **[Installation](Installation)** - Detailed installation instructions
- **[Configuration](Configuration)** - Environment variables and settings
- **[Deployment](Deployment)** - Production deployment guides

### Core Features
- **[User Management](User-Management)** - Managing admins and affiliates
- **[Referral Tracking](Referral-Tracking)** - How referral tracking works
- **[Commission System](Commission-System)** - Commission rules and calculations
- **[Payout Processing](Payout-Processing)** - Managing affiliate payouts
- **[Email System](Email-System)** - Email notifications and templates
- **[Analytics Dashboard](Analytics-Dashboard)** - Metrics and reporting

### API Documentation
- **[API Overview](API-Overview)** - API architecture and authentication
- **[Admin API](Admin-API)** - Admin endpoints reference
- **[Affiliate API](Affiliate-API)** - Affiliate endpoints reference
- **[Auth API](Auth-API)** - Authentication endpoints
- **[Webhook API](Webhook-API)** - Webhook integration

### Development
- **[Development Setup](Development-Setup)** - Local development environment
- **[Database Schema](Database-Schema)** - Database structure and relationships
- **[Architecture](Architecture)** - System architecture and design
- **[Contributing](Contributing)** - How to contribute to hin
- **[Code Style Guide](Code-Style-Guide)** - Coding standards and conventions
- **[Testing Guide](Testing-Guide)** - Testing strategies and tools

### Guides & Tutorials
- **[Creating Your First Affiliate Program](Creating-First-Program)** - Step-by-step tutorial
- **[Customizing Email Templates](Customizing-Emails)** - Email customization guide
- **[Setting Up Webhooks](Setting-Up-Webhooks)** - Webhook integration guide
- **[White Label Customization](White-Label-Guide)** - Branding customization
- **[Multi-Tenant Setup](Multi-Tenant-Setup)** - Running multiple programs

### Advanced Topics
- **[Security Best Practices](Security-Best-Practices)** - Securing your installation
- **[Performance Optimization](Performance-Optimization)** - Scaling and optimization
- **[Backup & Recovery](Backup-Recovery)** - Data backup strategies
- **[Monitoring & Logging](Monitoring-Logging)** - Application monitoring
- **[Troubleshooting](Troubleshooting)** - Common issues and solutions

### Integration Guides
- **[Stripe Integration](Stripe-Integration)** - Payment processing setup
- **[Analytics Integration](Analytics-Integration)** - Google Analytics, Mixpanel, etc.
- **[CRM Integration](CRM-Integration)** - Connecting to CRMs
- **[Zapier Integration](Zapier-Integration)** - Automation workflows

### Resources
- **[FAQ](FAQ)** - Frequently asked questions
- **[Roadmap](Roadmap)** - Future features and timeline
- **[Changelog](Changelog)** - Version history and updates
- **[Migration Guides](Migration-Guides)** - Upgrading between versions
- **[Glossary](Glossary)** - Terms and definitions

---

## 🎯 What is hin?

**hin** is a comprehensive, open-source affiliate management platform built with modern web technologies. It provides everything you need to create, manage, and scale your affiliate marketing program.

### Key Features

✅ **Complete Affiliate Portal** - Dashboard for affiliates to track earnings and manage referrals  
✅ **Admin Control Panel** - Manage partners, approve referrals, process payouts  
✅ **Real-time Analytics** - Track conversions, commissions, and performance  
✅ **Automated Workflows** - Email notifications, commission calculations, payouts  
✅ **Flexible Commission Rules** - Percentage-based and fixed commissions  
✅ **White-Label Ready** - Customizable branding and subdomain support  

### Technology Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Next.js App Router, API Routes
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT with OTP verification
- **Email:** Resend API
- **Payments:** Stripe Connect (optional)

---

## 🚀 Quick Links

### For New Users
1. **[Quick Start Guide](Quick-Start-Guide)** - Get started in 5 minutes
2. **[Installation](Installation)** - Step-by-step setup
3. **[Configuration](Configuration)** - Configure environment variables

### For Developers
1. **[Development Setup](Development-Setup)** - Set up your dev environment
2. **[Architecture](Architecture)** - Understand the system design
3. **[Contributing](Contributing)** - Contribute to the project

### For Admins
1. **[User Management](User-Management)** - Managing users
2. **[Commission System](Commission-System)** - Setting up commissions
3. **[Payout Processing](Payout-Processing)** - Processing payments

---

## 💡 Use Cases

hin is perfect for:

- **SaaS Companies** - Grow through affiliate partnerships
- **E-commerce Stores** - Reward customer referrals
- **Digital Products** - Course creators, software vendors
- **Service Businesses** - Consultants, agencies, service providers
- **Marketplaces** - Multi-vendor platforms
- **Membership Sites** - Recurring revenue businesses

---

## 🌟 Why Choose hin?

### Open Source & Free
- MIT Licensed - use commercially without restrictions
- Full source code access
- No vendor lock-in
- Active community support

### Production Ready
- Built with enterprise-grade technologies
- Comprehensive test coverage
- Security best practices
- Scalable architecture

### Developer Friendly
- Well-documented API
- TypeScript for type safety
- Modern tech stack
- Easy to customize and extend

### Feature Complete
- Everything you need out of the box
- No expensive plugins required
- Regular updates and improvements
- Community-driven roadmap

---

## 📊 Current Status

**Version:** 1.3.0  
**Status:** Production Ready ✅  
**Last Updated:** February 2026  
**License:** MIT  

### Recent Updates (v1.3.0)
- ✅ 3 CRITICAL security fixes: login JWT, password hashing, referral tracking
- ✅ PrismaClient singleton migration across 36 files (no more connection leaks)
- ✅ 7 new admin pages: invoices, team, programs, coupons, resources, emails, program-settings
- ✅ 5 affiliate sub-pages: referrals, payouts, resources, reports, settings
- ✅ 10+ new API routes with full CRUD
- ✅ 5 new database models (28 total)
- ✅ 156-assertion production test suite — all passing
- ✅ 6 dead code files removed
- ✅ Commission rates now use partner group configuration
- ✅ Zero TypeScript errors

### Upcoming Features
See our **[Roadmap](Roadmap)** for planned features and timeline.

---

## 🤝 Community & Support

### Getting Help
- **Wiki Documentation** - You're reading it!
- **GitHub Issues** - Report bugs and request features
- **GitHub Discussions** - Ask questions and share ideas
- **Email Support** - hello@hin.com

### Contributing
We welcome contributions! See our **[Contributing Guide](Contributing)** to get started.

### Code of Conduct
Please read our **[Code of Conduct](Code-of-Conduct)** before participating in the community.

---

## 📈 Project Stats

- **🎯 48+ API Endpoints** — Comprehensive REST API
- **📊 28 Database Models** — Full-featured data layer
- **🔐 JWT + OTP Authentication** — Secure token-based auth
- **💾 PostgreSQL Database** — Reliable and scalable data storage
- **📱 Responsive Design** — Mobile-friendly with shadcn/ui
- **🌍 Production Ready** — 156 tests passing, zero TS errors

---

## 🗺️ Navigation Tips

### Using This Wiki

1. **Search** - Use the search bar to find specific topics
2. **Sidebar** - Browse categories in the sidebar
3. **Breadcrumbs** - Track your location within the wiki
4. **Internal Links** - Click blue links to navigate between pages
5. **External Links** - Links to GitHub, docs, and resources

### Recommended Reading Order

#### New to hin?
1. Quick Start Guide
2. Installation
3. Configuration
4. Creating Your First Affiliate Program

#### Setting Up for Production?
1. Deployment
2. Security Best Practices
3. Email System
4. Monitoring & Logging

#### Want to Contribute?
1. Development Setup
2. Architecture
3. Contributing
4. Code Style Guide

---

## 📝 License

hin is open source software licensed under the **[MIT License](https://github.com/Heroic-Web/hin-dashboard/blob/main/LICENSE)**.

Copyright © 2025 hin Team

---

## 🎓 Learn More

- **[GitHub Repository](https://github.com/Heroic-Web/hin-dashboard)** - Source code
- **[Live Demo](https://demo.hin.com)** - Try it out (coming soon)
- **[API Documentation](API-Overview)** - REST API reference
- **[Blog](https://blog.hin.com)** - Tutorials and updates (coming soon)

---

<p align="center">
  Made with ❤️ by the hin Team
</p>

<p align="center">
  <a href="https://github.com/Heroic-Web/hin-dashboard">⭐ Star us on GitHub</a>
</p>
