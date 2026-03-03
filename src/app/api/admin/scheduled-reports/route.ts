import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

async function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: payload.userId as string } });
    if (!user || user.role !== 'ADMIN') return null;
    return user;
  } catch {
    return null;
  }
}

// GET - List all scheduled reports
export async function GET(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const reports = await prisma.scheduledReport.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, reports });
  } catch (error) {
    console.error('Scheduled reports GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch scheduled reports' }, { status: 500 });
  }
}

// POST - Create a new scheduled report
export async function POST(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { name, reportType, frequency, recipients, filters, format } = body;

    if (!name || !reportType || !frequency) {
      return NextResponse.json({ error: 'Name, reportType, and frequency are required' }, { status: 400 });
    }

    // Calculate next run time
    const nextRunAt = calculateNextRun(frequency);

    const report = await prisma.scheduledReport.create({
      data: {
        name,
        reportType,
        frequency,
        recipients: recipients || [],
        filters: filters || {},
        format: format || 'csv',
        nextRunAt,
        createdBy: user.id,
      },
    });

    return NextResponse.json({ success: true, report });
  } catch (error) {
    console.error('Scheduled reports POST error:', error);
    return NextResponse.json({ error: 'Failed to create scheduled report' }, { status: 500 });
  }
}

// PUT - Update a scheduled report
export async function PUT(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) return NextResponse.json({ error: 'Report ID is required' }, { status: 400 });

    // Recalculate next run if frequency changed
    if (updates.frequency) {
      updates.nextRunAt = calculateNextRun(updates.frequency);
    }

    const report = await prisma.scheduledReport.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json({ success: true, report });
  } catch (error) {
    console.error('Scheduled reports PUT error:', error);
    return NextResponse.json({ error: 'Failed to update scheduled report' }, { status: 500 });
  }
}

// DELETE - Remove a scheduled report
export async function DELETE(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'Report ID is required' }, { status: 400 });

    await prisma.scheduledReport.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Scheduled report deleted' });
  } catch (error) {
    console.error('Scheduled reports DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete scheduled report' }, { status: 500 });
  }
}

function calculateNextRun(frequency: string): Date {
  const now = new Date();
  switch (frequency) {
    case 'DAILY':
      now.setDate(now.getDate() + 1);
      now.setHours(8, 0, 0, 0);
      break;
    case 'WEEKLY':
      now.setDate(now.getDate() + (7 - now.getDay() + 1)); // Next Monday
      now.setHours(8, 0, 0, 0);
      break;
    case 'BIWEEKLY':
      now.setDate(now.getDate() + 14);
      now.setHours(8, 0, 0, 0);
      break;
    case 'MONTHLY':
      now.setMonth(now.getMonth() + 1, 1); // 1st of next month
      now.setHours(8, 0, 0, 0);
      break;
    default:
      now.setDate(now.getDate() + 7);
      now.setHours(8, 0, 0, 0);
  }
  return now;
}
