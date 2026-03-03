import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { AVAILABLE_EVENTS, triggerWebhook, type WebhookEventType } from '@/lib/webhooks';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET!
);

// ─── SSRF Protection: Validate webhook URLs ────────────────────
const BLOCKED_HOSTNAMES = [
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '::1',
  '[::1]',
  'metadata.google.internal',
  'metadata.google',
  '169.254.169.254',       // AWS/GCP metadata
  'metadata.internal',
];

const PRIVATE_IP_RANGES = [
  /^10\./,                 // 10.0.0.0/8
  /^172\.(1[6-9]|2\d|3[01])\./,  // 172.16.0.0/12
  /^192\.168\./,           // 192.168.0.0/16
  /^127\./,                // 127.0.0.0/8
  /^0\./,                  // 0.0.0.0/8
  /^169\.254\./,           // Link-local
  /^fc00:/i,               // IPv6 unique local
  /^fe80:/i,               // IPv6 link-local
  /^::1$/,                 // IPv6 loopback
];

function validateWebhookUrl(urlString: string): { valid: boolean; error?: string } {
  let parsed: URL;
  try {
    parsed = new URL(urlString);
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }

  // Only allow HTTPS (and HTTP in development)
  const allowedProtocols = process.env.NODE_ENV === 'development'
    ? ['https:', 'http:']
    : ['https:'];
  if (!allowedProtocols.includes(parsed.protocol)) {
    return { valid: false, error: 'Only HTTPS webhook URLs are allowed' };
  }

  // Block known internal hostnames
  const hostname = parsed.hostname.toLowerCase();
  if (BLOCKED_HOSTNAMES.includes(hostname)) {
    return { valid: false, error: 'Webhook URL must not point to internal or loopback addresses' };
  }

  // Block private IP ranges
  if (PRIVATE_IP_RANGES.some(range => range.test(hostname))) {
    return { valid: false, error: 'Webhook URL must not point to private network addresses' };
  }

  // Block URLs without a valid TLD (e.g., http://intranet)
  if (!hostname.includes('.') && hostname !== 'localhost') {
    return { valid: false, error: 'Webhook URL must use a fully qualified domain name' };
  }

  return { valid: true };
}

// Helper: Verify admin auth
async function verifyAdminAuth(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return { error: 'No authentication token', status: 401 };
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string }
    });

    if (!user || user.role !== 'ADMIN') {
      return { error: 'Admin access required', status: 403 };
    }

    return { user };
  } catch {
    return { error: 'Invalid token', status: 401 };
  }
}

// Helper: Generate webhook secret
function generateWebhookSecret(): string {
  return `whsec_${crypto.randomBytes(24).toString('hex')}`;
}

// Helper: Generate HMAC signature
function generateSignature(payload: any, secret: string): string {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(JSON.stringify(payload));
  return `sha256=${hmac.digest('hex')}`;
}

// GET - List all webhooks
export async function GET(request: NextRequest) {
  const auth = await verifyAdminAuth(request);
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const url = new URL(request.url);
    const includeInactive = url.searchParams.get('includeInactive') === 'true';
    const includeLogs = url.searchParams.get('includeLogs') === 'true';

    const webhooks = await prisma.webhook.findMany({
      where: includeInactive ? {} : { isActive: true },
      include: {
        logs: includeLogs ? {
          orderBy: { createdAt: 'desc' },
          take: 10
        } : false
      },
      orderBy: { createdAt: 'desc' }
    });

    // Get webhook statistics
    const stats = await prisma.webhookLog.groupBy({
      by: ['status'],
      _count: { id: true }
    });

    const statsMap = stats.reduce((acc, s) => {
      acc[s.status] = s._count.id;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      success: true,
      webhooks: webhooks.map(w => ({
        ...w,
        secret: '••••••••' // Hide secret in list
      })),
      stats: {
        total: webhooks.length,
        active: webhooks.filter(w => w.isActive).length,
        pending: statsMap['PENDING'] || 0,
        success: statsMap['SUCCESS'] || 0,
        failed: statsMap['FAILED'] || 0,
        retrying: statsMap['RETRYING'] || 0
      },
      availableEvents: AVAILABLE_EVENTS
    });

  } catch (error) {
    console.error('Webhooks GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch webhooks' },
      { status: 500 }
    );
  }
}

// POST - Create webhook, trigger webhook, or test webhook
export async function POST(request: NextRequest) {
  const auth = await verifyAdminAuth(request);
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await request.json();
    const { action } = body;

    // CREATE - Create new webhook
    if (action === 'create') {
      const { name, url, events } = body;

      if (!name || !url) {
        return NextResponse.json(
          { error: 'Name and URL are required' },
          { status: 400 }
        );
      }

      // Validate URL (SSRF protection)
      const urlValidation = validateWebhookUrl(url);
      if (!urlValidation.valid) {
        return NextResponse.json(
          { error: urlValidation.error },
          { status: 400 }
        );
      }

      // Validate events
      const selectedEvents = events || AVAILABLE_EVENTS;
      const invalidEvents = selectedEvents.filter((e: string) => !AVAILABLE_EVENTS.includes(e as WebhookEventType));
      if (invalidEvents.length > 0) {
        return NextResponse.json(
          { error: `Invalid events: ${invalidEvents.join(', ')}` },
          { status: 400 }
        );
      }

      const secret = generateWebhookSecret();

      const webhook = await prisma.webhook.create({
        data: {
          name,
          url,
          secret,
          events: selectedEvents,
          isActive: true,
          failureCount: 0
        }
      });

      return NextResponse.json({
        success: true,
        webhook: {
          ...webhook,
          secret // Return secret only on creation
        },
        message: 'Webhook created successfully. Save your secret - it will not be shown again.'
      });
    }

    // TEST - Test webhook endpoint
    if (action === 'test') {
      const { webhookId, url: testUrl } = body;

      let webhookUrl = testUrl;
      let webhookSecret = 'test_secret';

      if (webhookId) {
        const webhook = await prisma.webhook.findUnique({
          where: { id: webhookId }
        });

        if (!webhook) {
          return NextResponse.json(
            { error: 'Webhook not found' },
            { status: 404 }
          );
        }

        webhookUrl = webhook.url;
        webhookSecret = webhook.secret;
      }

      if (!webhookUrl) {
        return NextResponse.json(
          { error: 'Webhook URL is required' },
          { status: 400 }
        );
      }

      // SSRF protection: validate the test URL
      const testUrlValidation = validateWebhookUrl(webhookUrl);
      if (!testUrlValidation.valid) {
        return NextResponse.json(
          { error: testUrlValidation.error },
          { status: 400 }
        );
      }

      const testPayload = {
        event: 'test',
        timestamp: new Date().toISOString(),
        data: { 
          message: 'This is a test webhook from hin',
          testId: crypto.randomBytes(8).toString('hex')
        }
      };

      try {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-hin-Event': 'test',
            'X-hin-Signature': generateSignature(testPayload, webhookSecret),
            'X-hin-Delivery': `test_${Date.now()}`
          },
          body: JSON.stringify(testPayload)
        });

        const responseText = await response.text();

        // Log the test
        if (webhookId) {
          await prisma.webhookLog.create({
            data: {
              webhookId,
              eventType: 'test',
              payload: testPayload,
              status: response.ok ? 'SUCCESS' : 'FAILED',
              statusCode: response.status,
              response: responseText.substring(0, 1000),
              completedAt: new Date()
            }
          });
        }

        return NextResponse.json({
          success: response.ok,
          statusCode: response.status,
          message: response.ok ? 'Webhook test successful' : `Webhook test failed with status ${response.status}`,
          response: responseText.substring(0, 500)
        });

      } catch (error: any) {
        // Log the failure
        if (webhookId) {
          await prisma.webhookLog.create({
            data: {
              webhookId,
              eventType: 'test',
              payload: testPayload,
              status: 'FAILED',
              error: error.message,
              completedAt: new Date()
            }
          });
        }

        return NextResponse.json({
          success: false,
          message: 'Webhook test failed: connection error'
        });
      }
    }

    // TRIGGER - Manually trigger webhook for specific event
    if (action === 'trigger') {
      const { eventType, eventData } = body;

      if (!eventType || !eventData) {
        return NextResponse.json(
          { error: 'Event type and data are required' },
          { status: 400 }
        );
      }

      if (!AVAILABLE_EVENTS.includes(eventType)) {
        return NextResponse.json(
          { error: `Invalid event type: ${eventType}` },
          { status: 400 }
        );
      }

      const results = await triggerWebhook(eventType, eventData);

      return NextResponse.json({
        success: true,
        message: `Webhook triggered for ${eventType}`,
        results
      });
    }

    return NextResponse.json(
      { error: 'Invalid action. Use: create, test, or trigger' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Webhooks POST error:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook request' },
      { status: 500 }
    );
  }
}

// PUT - Update webhook
export async function PUT(request: NextRequest) {
  const auth = await verifyAdminAuth(request);
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await request.json();
    const { id, name, url, events, isActive, regenerateSecret } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Webhook ID is required' },
        { status: 400 }
      );
    }

    const existingWebhook = await prisma.webhook.findUnique({
      where: { id }
    });

    if (!existingWebhook) {
      return NextResponse.json(
        { error: 'Webhook not found' },
        { status: 404 }
      );
    }

    const updateData: any = {};

    if (name !== undefined) updateData.name = name;
    if (url !== undefined) {
      const updateUrlValidation = validateWebhookUrl(url);
      if (!updateUrlValidation.valid) {
        return NextResponse.json(
          { error: updateUrlValidation.error },
          { status: 400 }
        );
      }
      updateData.url = url;
    }
    if (events !== undefined) updateData.events = events;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (regenerateSecret) {
      updateData.secret = generateWebhookSecret();
    }

    const webhook = await prisma.webhook.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      webhook: {
        ...webhook,
        secret: regenerateSecret ? webhook.secret : '••••••••'
      },
      message: regenerateSecret 
        ? 'Webhook updated with new secret. Save your secret - it will not be shown again.'
        : 'Webhook updated successfully'
    });

  } catch (error) {
    console.error('Webhooks PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update webhook' },
      { status: 500 }
    );
  }
}

// DELETE - Remove webhook
export async function DELETE(request: NextRequest) {
  const auth = await verifyAdminAuth(request);
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const url = new URL(request.url);
    const webhookId = url.searchParams.get('id');

    if (!webhookId) {
      return NextResponse.json(
        { error: 'Webhook ID is required' },
        { status: 400 }
      );
    }

    const webhook = await prisma.webhook.findUnique({
      where: { id: webhookId }
    });

    if (!webhook) {
      return NextResponse.json(
        { error: 'Webhook not found' },
        { status: 404 }
      );
    }

    // Delete webhook (cascades to logs)
    await prisma.webhook.delete({
      where: { id: webhookId }
    });

    return NextResponse.json({
      success: true,
      message: 'Webhook deleted successfully'
    });

  } catch (error) {
    console.error('Webhooks DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete webhook' },
      { status: 500 }
    );
  }
}

