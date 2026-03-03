import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET!
);

// GET: List active resources for affiliates
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'No authentication token' }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
    });

    if (!user || user.role !== 'AFFILIATE') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const resources = await prisma.resource.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      resources: resources.map((r) => ({
        id: r.id,
        title: r.title,
        description: r.description,
        type: r.type,
        fileUrl: r.fileUrl,
        fileName: r.fileName,
        fileSize: r.fileSize,
        mimeType: r.mimeType,
        category: r.category,
        downloads: r.downloads,
        createdAt: r.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Affiliate resources API error:', error);
    return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 });
  }
}

// POST: Track download (increment counter)
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
    });

    if (!user || user.role !== 'AFFILIATE') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Resource ID required' }, { status: 400 });
    }

    await prisma.resource.update({
      where: { id },
      data: { downloads: { increment: 1 } },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Track download error:', error);
    return NextResponse.json({ error: 'Failed to track download' }, { status: 500 });
  }
}
