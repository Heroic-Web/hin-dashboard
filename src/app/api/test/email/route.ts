import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/email';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET!
);

// Only allow in development, or require admin auth in production
async function requireAdminOrDev(request: NextRequest): Promise<{ error?: string; status?: number }> {
  // Block entirely in production unless authenticated as admin
  const token = request.cookies.get('auth-token')?.value;
  if (!token) {
    if (process.env.NODE_ENV === 'development') return {};
    return { error: 'Authentication required', status: 401 };
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string }
    });
    if (!user || user.role !== 'ADMIN') {
      return { error: 'Admin access required', status: 403 };
    }
    return {};
  } catch {
    return { error: 'Invalid token', status: 401 };
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminOrDev(request);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    // Test email functionality
    const result = await emailService.sendWelcomeEmail({
      name: 'Test User',
      email: 'test@example.com',
      role: 'affiliate',
      loginUrl: 'http://localhost:3000',
    });

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      // emailId: result.emailId, // Property doesn't exist on result
    });
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to send test email',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const auth = await requireAdminOrDev(request);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  return NextResponse.json({
    success: true,
    message: 'Email test endpoint is working',
    config: {
      apiKeyConfigured: !!process.env.RESEND_API_KEY,
      environment: process.env.NODE_ENV,
    },
  });
}