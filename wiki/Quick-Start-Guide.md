# Quick Start Guide

Get hin up and running in **5 minutes**! ⚡

---

## Prerequisites

Before you begin, ensure you have:

- ✅ **Node.js 18+** - [Download here](https://nodejs.org/)
- ✅ **PostgreSQL 14+** - [Download here](https://www.postgresql.org/download/)
- ✅ **Git** - [Download here](https://git-scm.com/)
- ✅ **Code Editor** - VS Code recommended

---

## Step 1: Clone the Repository

```bash
git clone https://github.com/Heroic-Web/hin-dashboard.git
cd hin
```

---

## Step 2: Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

**Estimated time:** 2-3 minutes

---

## Step 3: Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/hin"

# JWT Secret (generate a random string)
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"

# Email (Resend)
RESEND_API_KEY="re_xxxxxxxxxxxxx"
RESEND_FROM_EMAIL="hin <onboarding@resend.dev>"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Quick Tips:

**Generate JWT Secret:**
```bash
# On macOS/Linux
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**Get Resend API Key:**
1. Sign up at [resend.com](https://resend.com) (free)
2. Generate API key
3. Use `onboarding@resend.dev` for development

---

## Step 4: Set Up Database

Create PostgreSQL database:

```bash
# Using psql
createdb hin

# Or manually
psql -U postgres
CREATE DATABASE hin;
\q
```

Run Prisma migrations:

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push
```

**Estimated time:** 1 minute

---

## Step 5: Run Development Server

```bash
npm run dev
```

**Output:**
```
▲ Next.js 15.2.3
- Local:        http://localhost:3000
- Ready in 2.3s
```

---

## Step 6: Create Admin Account

1. **Open browser:** http://localhost:3000/register

2. **Fill registration form:**
   - Name: `Your Name`
   - Email: `admin@example.com`

3. **Promote to admin:**

```bash
# Connect to database
psql -U postgres -d hin

# Update user role
UPDATE users 
SET role = 'ADMIN', status = 'ACTIVE' 
WHERE email = 'admin@example.com';

\q
```

4. **Login:** http://localhost:3000/login

---

## Step 7: Test Email (Optional)

```bash
npm run test:email admin@example.com
```

**Expected output:**
```
✅ Email sent successfully!
📬 Check your inbox for the test email.
```

---

## 🎉 You're All Set!

Your hin instance is now running at **http://localhost:3000**

### What's Next?

#### Explore the Platform
- 🏠 **Dashboard** - http://localhost:3000/admin
- 👥 **Manage Affiliates** - Approve/reject applications
- 📊 **View Analytics** - Track performance metrics
- 💰 **Process Payouts** - Handle commission payments

#### Configure Settings
- Go to **Settings** in admin dashboard
- Set commission rates
- Customize program details
- Add payment information

#### Invite Affiliates
- Share registration link: http://localhost:3000/register
- Affiliates sign up (status: PENDING)
- Approve them in admin dashboard
- They can start referring!

---

## Common Issues

### Database Connection Error

**Error:** `Can't reach database server`

**Solution:**
```bash
# Check if PostgreSQL is running
pg_isready

# Start PostgreSQL
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql

# Windows
net start postgresql-x64-14
```

### Port Already in Use

**Error:** `Port 3000 is already in use`

**Solution:**
```bash
# Kill process on port 3000
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
npm run dev -- -p 3001
```

### Prisma Client Not Generated

**Error:** `Cannot find module '@prisma/client'`

**Solution:**
```bash
npm run db:generate
```

### Email Not Sending

**Issue:** Welcome emails not arriving

**Solution:**
1. Check RESEND_API_KEY in .env.local
2. Verify API key at https://resend.com/api-keys
3. Check spam folder
4. Run test: `npm run test:email your@email.com`

---

## Development vs Production

### Development Mode
```bash
npm run dev
```
- Hot reload enabled
- Detailed error messages
- Source maps available
- Use `onboarding@resend.dev` for emails

### Production Build
```bash
npm run build
npm start
```
- Optimized bundle
- Better performance
- Verify domain for emails
- Use production database

See **[Deployment Guide](Deployment)** for production setup.

---

## Next Steps

### Learn More
- **[Configuration](Configuration)** - Detailed environment setup
- **[User Management](User-Management)** - Managing users and roles
- **[Commission System](Commission-System)** - Setting up commissions
- **[Email System](Email-System)** - Email configuration

### Customize
- **[White Label Guide](White-Label-Guide)** - Customize branding
- **[Email Templates](Customizing-Emails)** - Customize emails
- **[API Integration](API-Overview)** - Integrate with your app

### Deploy
- **[Vercel Deployment](Deployment#vercel)** - Deploy to Vercel (easiest)
- **[AWS Deployment](Deployment#aws)** - Deploy to AWS
- **[Docker Deployment](Deployment#docker)** - Deploy with Docker

---

## Useful Commands

```bash
# Development
npm run dev                    # Start dev server
npm run build                  # Build for production
npm run start                  # Start production server
npm run lint                   # Run ESLint

# Database
npm run db:generate            # Generate Prisma Client
npm run db:push                # Push schema to database
npm run db:seed                # Seed database (if available)

# Testing
npx tsx scripts/test-all.ts    # Run production test suite (156 assertions)
npx tsc --noEmit               # TypeScript type checking
npm run test:email <email>     # Test email configuration

# Prisma Studio (Database GUI)
npx prisma studio              # Open Prisma Studio at localhost:5555
```

---

## Getting Help

- **[FAQ](FAQ)** - Common questions
- **[Troubleshooting](Troubleshooting)** - Common issues
- **[GitHub Issues](https://github.com/Heroic-Web/hin-dashboard/issues)** - Report bugs
- **[GitHub Discussions](https://github.com/Heroic-Web/hin-dashboard/discussions)** - Ask questions
- **Email:** hello@hin.com

---

## Video Tutorial

📹 **Coming Soon:** Watch our video walkthrough of the Quick Start process.

---

<p align="center">
  <strong>Ready to build your affiliate program?</strong><br>
  Continue to <a href="Creating-First-Program">Creating Your First Affiliate Program</a>
</p>
