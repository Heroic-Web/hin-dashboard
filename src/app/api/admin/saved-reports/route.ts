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

// GET - List saved reports
export async function GET(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const reports = await prisma.savedReport.findMany({
      where: { createdBy: user.id },
      orderBy: { updatedAt: 'desc' },
    });
    return NextResponse.json({ success: true, reports });
  } catch (error) {
    console.error('Saved reports GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch saved reports' }, { status: 500 });
  }
}

// POST - Save a custom report configuration
export async function POST(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { name, description, reportType, columns, filters, sortBy, sortOrder } = body;

    if (!name || !reportType) {
      return NextResponse.json({ error: 'Name and reportType are required' }, { status: 400 });
    }

    const report = await prisma.savedReport.create({
      data: {
        name,
        description,
        reportType,
        columns: columns || [],
        filters: filters || {},
        sortBy,
        sortOrder: sortOrder || 'desc',
        createdBy: user.id,
      },
    });

    return NextResponse.json({ success: true, report });
  } catch (error) {
    console.error('Saved reports POST error:', error);
    return NextResponse.json({ error: 'Failed to save report' }, { status: 500 });
  }
}

// PUT - Update a saved report
export async function PUT(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) return NextResponse.json({ error: 'Report ID is required' }, { status: 400 });

    const report = await prisma.savedReport.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json({ success: true, report });
  } catch (error) {
    console.error('Saved reports PUT error:', error);
    return NextResponse.json({ error: 'Failed to update report' }, { status: 500 });
  }
}

// DELETE - Remove a saved report
export async function DELETE(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'Report ID is required' }, { status: 400 });

    await prisma.savedReport.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Report deleted' });
  } catch (error) {
    console.error('Saved reports DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete report' }, { status: 500 });
  }
}
