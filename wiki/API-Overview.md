# API Overview

Complete reference for the hin REST API.

---

## 📚 Table of Contents

- [Introduction](#introduction)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
- [Request Format](#request-format)
- [Response Format](#response-format)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Examples](#examples)

---

## Introduction

The hin API is a RESTful API that allows you to programmatically interact with your affiliate program. All API endpoints return JSON responses.

### Base URL

```
http://localhost:3000/api  # Development
https://yourdomain.com/api  # Production
```

### API Version

Current version: **v1.3.0**

---

## Authentication

hin uses **JWT (JSON Web Tokens)** for authentication.

### Authentication Flow (OTP-Based)

hin uses a passwordless OTP (One-Time Password) authentication flow:

**Step 1: Request OTP**

**Endpoint:** `POST /api/auth/send-otp`

```bash
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent to your email"
}
```

**Step 2: Verify OTP**

**Endpoint:** `POST /api/auth/verify-otp`

```bash
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "otp": "123456"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "AFFILIATE"
  }
}
```

The JWT token is set automatically as an HTTP-only cookie (`auth-token`).

### Using the Token

The `auth-token` cookie is sent automatically with browser requests. For programmatic access:

```bash
curl -X GET http://localhost:3000/api/auth/me \
  --cookie "auth-token=YOUR_JWT_TOKEN"
```

### Token Expiration

Tokens expire after **24 hours**. You'll need to re-authenticate via OTP after expiration.

---

## API Endpoints

### Summary

| Category | Endpoints | Description |
|----------|-----------|-------------|
| **Auth** | 6 | Authentication and user management |
| **Admin** | 34+ | Admin operations |
| **Affiliate** | 8 | Affiliate operations |
| **Tracking** | 3 | Referral & conversion tracking |
| **Webhook** | 1 | External integrations |
| **Testing** | 1 | Email testing |

### Endpoint List

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/send-otp` - Send OTP code
- `POST /api/auth/verify-otp` - Verify OTP code

#### Admin - Affiliates
- `GET /api/admin/affiliates` - List all affiliates
- `POST /api/admin/affiliates` - Create affiliate
- `PATCH /api/admin/affiliates/[id]` - Update affiliate
- `DELETE /api/admin/affiliates/[id]` - Delete affiliate
- `POST /api/admin/affiliates/batch` - Batch operations

#### Admin - Referrals
- `GET /api/admin/referrals` - List all referrals
- `POST /api/admin/referrals` - Create referral
- `PUT /api/admin/referrals/[id]` - Approve/reject referral
- `PATCH /api/admin/referrals/[id]` - Update referral details
- `DELETE /api/admin/referrals/[id]` - Delete referral

#### Admin - Analytics
- `GET /api/admin/dashboard` - Dashboard metrics
- `GET /api/admin/analytics` - Detailed analytics
- `GET /api/admin/reports` - Generate reports

#### Admin - Payouts
- `GET /api/admin/payouts` - List payouts
- `POST /api/admin/payouts` - Process payouts

#### Admin - Settings
- `GET /api/admin/settings` - Get program settings
- `PUT /api/admin/settings` - Update program settings
- `GET /api/admin/settings/profile` - Get admin profile
- `PUT /api/admin/settings/profile` - Update admin profile
- `PUT /api/admin/settings/integration` - Update integrations

#### Admin - Email
- `GET/POST/PUT/DELETE /api/admin/emails` - Email template management
- `POST /api/admin/emails/test` - Test email configuration

#### Admin - Reports
- `GET /api/admin/reports` - Generate reports
- `GET /api/admin/reports/cohort` - Cohort analysis
- `POST /api/admin/reports/email` - Email report delivery
- `GET/POST/PUT/DELETE /api/admin/scheduled-reports` - Scheduled reports
- `GET/POST/PUT/DELETE /api/admin/saved-reports` - Saved reports

#### Admin - Invoices, Team & Programs
- `GET/POST/DELETE /api/admin/invoices` - Invoice management
- `GET/POST/PUT/DELETE /api/admin/team` - Team member management
- `GET/POST/PUT/DELETE /api/admin/programs` - Program management
- `GET/POST/PUT/DELETE /api/admin/coupons` - Coupon management
- `GET/POST/DELETE /api/admin/resources` - Resource management

#### Admin - Integration & API
- `GET/PUT /api/admin/integration` - Integration settings
- `POST /api/admin/integration/generate-key` - Generate integration key
- `GET/POST/PUT/DELETE /api/admin/api-keys` - API key management
- `GET /api/admin/api-usage` - API usage analytics
- `GET/POST/PUT/DELETE /api/admin/webhooks` - Webhook management

#### Admin - Advanced
- `POST /api/admin/refunds` - Refund protection with commission clawback
- `POST /api/admin/payouts/auto` - Automated payout processing

#### Affiliate
- `GET/POST /api/affiliate/referrals` - Submit and view referrals
- `GET /api/affiliate/payouts` - View payout history
- `GET/PUT /api/affiliate/profile` - Manage profile
- `GET/PUT /api/affiliate/branding` - Portal branding
- `POST /api/affiliate/generate-code` - Regenerate referral code
- `GET /api/affiliate/resources` - Access marketing materials

#### Tracking
- `GET /r/[code]` - Referral redirect with attribution
- `POST /api/track/referral` - Manual referral tracking
- `POST /api/track/conversion` - Conversion tracking

#### Webhook
- `POST /api/webhook/conversion` - External conversion tracking

---

## Request Format

### Headers

All requests should include:

```http
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN
```

### Body

Use JSON for request bodies:

```json
{
  "key": "value",
  "nested": {
    "key": "value"
  }
}
```

### Query Parameters

For GET requests with filters:

```
GET /api/admin/affiliates?status=ACTIVE&page=1&limit=10
```

---

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "error": "DETAILED_ERROR_CODE"
}
```

### HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET/PUT/PATCH |
| 201 | Created | Successful POST |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists |
| 500 | Server Error | Internal error |

---

## Error Handling

### Common Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| `INVALID_CREDENTIALS` | Wrong email/password | Check credentials |
| `TOKEN_EXPIRED` | JWT expired | Re-authenticate |
| `UNAUTHORIZED` | Not logged in | Include auth token |
| `FORBIDDEN` | Wrong role | Check permissions |
| `NOT_FOUND` | Resource missing | Check ID/URL |
| `VALIDATION_ERROR` | Invalid input | Check request body |
| `DUPLICATE_EMAIL` | Email exists | Use different email |

### Error Response Example

```json
{
  "success": false,
  "message": "Email already registered",
  "error": "DUPLICATE_EMAIL"
}
```

---

## Rate Limiting

### Current Limits (v1.2.0+)

API rate limiting is enforced via a sliding-window algorithm backed by the database:

- **Default:** 100 requests/minute per IP
- **API Key:** Custom rate limits configurable per key
- **Response Headers:** `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

### Best Practices

- Cache responses when possible
- Use webhooks instead of polling
- Implement exponential backoff for retries

---

## Examples

### Register New Affiliate

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "role": "AFFILIATE"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "user": {
    "id": "123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "AFFILIATE",
    "status": "PENDING"
  }
}
```

### Submit Referral

```bash
curl -X POST http://localhost:3000/api/affiliate/referrals \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "leadName": "Jane Smith",
    "leadEmail": "jane@example.com",
    "company": "Acme Inc",
    "estimatedValue": 100000,
    "notes": "Interested in enterprise plan"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Referral submitted successfully",
  "referral": {
    "id": "456",
    "leadName": "Jane Smith",
    "leadEmail": "jane@example.com",
    "status": "PENDING",
    "createdAt": "2025-10-10T12:00:00Z"
  }
}
```

### Approve Referral (Admin)

```bash
curl -X PUT http://localhost:3000/api/admin/referrals/456 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -d '{
    "action": "approve",
    "commissionAmount": 20000,
    "notes": "Signed up for annual plan"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Referral approved",
  "referral": {
    "id": "456",
    "status": "APPROVED",
    "commissionAmount": 20000
  },
  "commission": {
    "id": "789",
    "amount": 20000,
    "status": "UNPAID"
  }
}
```

### Get Dashboard Analytics (Admin)

```bash
curl -X GET http://localhost:3000/api/admin/dashboard \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalAffiliates": 25,
    "activeAffiliates": 18,
    "pendingAffiliates": 7,
    "totalReferrals": 150,
    "approvedReferrals": 120,
    "totalCommissions": 500000,
    "unpaidCommissions": 125000,
    "conversionRate": 0.80
  }
}
```

---

## Pagination

List endpoints support pagination:

```bash
GET /api/admin/affiliates?page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

---

## Filtering

Use query parameters to filter results:

```bash
GET /api/admin/affiliates?status=ACTIVE&group=premium
```

**Available Filters:**

**Affiliates:**
- `status` - PENDING, ACTIVE, INACTIVE, SUSPENDED
- `group` - Group name
- `search` - Name or email

**Referrals:**
- `status` - PENDING, APPROVED, REJECTED
- `affiliateId` - Filter by affiliate
- `dateFrom` - Start date (ISO 8601)
- `dateTo` - End date (ISO 8601)

---

## Sorting

Use `sortBy` and `order` parameters:

```bash
GET /api/admin/referrals?sortBy=createdAt&order=desc
```

**Sort Fields:**
- `createdAt` - Creation date
- `name` - Name
- `amount` - Commission amount
- `status` - Status

**Order:**
- `asc` - Ascending
- `desc` - Descending

---

## Detailed API Documentation

For complete endpoint documentation with all parameters and examples, see:

- **[Admin API](Admin-API)** - Admin endpoint reference
- **[Affiliate API](Affiliate-API)** - Affiliate endpoint reference
- **[Auth API](Auth-API)** - Authentication endpoint reference
- **[Webhook API](Webhook-API)** - Webhook integration guide

---

## SDK & Libraries

### Official SDKs

Coming soon:
- JavaScript/TypeScript SDK
- Python SDK
- PHP SDK

### Community SDKs

Have you built an SDK? [Let us know!](https://github.com/Heroic-Web/hin-dashboard/discussions)

---

## Testing

### Postman Collection

Download our Postman collection: **Coming soon**

### Testing Endpoints

Use the test email endpoint to verify configuration:

```bash
curl -X POST http://localhost:3000/api/test/email \
  -H "Content-Type: application/json" \
  -d '{
    "type": "welcome",
    "to": "test@example.com"
  }'
```

---

## Webhooks

Webhooks are available since v1.1.0. Subscribe to 12 event types:
- `affiliate.created`, `affiliate.approved`, `affiliate.rejected`
- `referral.submitted`, `referral.approved`, `referral.rejected`
- `commission.created`, `commission.approved`, `commission.paid`
- `payout.requested`, `payout.completed`, `payout.failed`

Manage webhooks via the Admin API:
- `GET /api/admin/webhooks` - List webhooks
- `POST /api/admin/webhooks` - Create, test, or trigger webhooks
- `PUT /api/admin/webhooks` - Update webhook
- `DELETE /api/admin/webhooks` - Delete webhook

All webhook deliveries include HMAC SHA-256 signatures for verification.

See [Webhook API](Webhook-API) for details.

---

## API Changelog

### v1.3.0 (February 2026)
- 10+ new admin API routes (invoices, team, programs, coupons, resources, refunds, auto-payouts)
- 3 new affiliate routes (branding, generate-code, resources)
- Referral tracking route `/r/[code]` rewritten with Prisma (was broken)
- Login API now creates JWT token and sets cookie
- Commission approval uses partner group rates
- Total: 48+ API routes

### v1.2.0 (February 2026)
- Scheduled/saved reports APIs
- API key management (create, revoke, scope-based)
- API usage analytics endpoint
- Cohort analysis and email report delivery
- Rate limiting with sliding window

### v1.1.0 (December 2025)
- Webhooks API (CRUD + test + trigger)
- 12 webhook event types
- HMAC SHA-256 signature verification
- Webhook logs and retry logic

### v1.0.0 (October 2025)
- Initial API release
- 31 endpoints
- JWT authentication
- JSON responses

---

## Support

Need help with the API?

- **[GitHub Issues](https://github.com/Heroic-Web/hin-dashboard/issues)** - Report bugs
- **[GitHub Discussions](https://github.com/Heroic-Web/hin-dashboard/discussions)** - Ask questions
- **Email:** hello@hin.com

---

<p align="center">
  <strong>Ready to integrate?</strong><br>
  Check out our <a href="Admin-API">detailed API reference</a>
</p>
