import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET!
);

async function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
    });
    if (!user || user.role !== 'ADMIN') return null;
    return user;
  } catch {
    return null;
  }
}

// GET: List all resources
export async function GET(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const resources = await prisma.resource.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, resources });
  } catch (error) {
    console.error('Admin resources GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 });
  }
}

// POST: Create resource
export async function POST(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { title, description, type, fileUrl, fileName, fileSize, mimeType, category, tags } = body;

    if (!title || !type || !fileUrl || !fileName) {
      return NextResponse.json({ error: 'Title, type, fileUrl, and fileName are required' }, { status: 400 });
    }

    const resource = await prisma.resource.create({
      data: {
        title,
        description: description || null,
        type,
        fileUrl,
        fileName,
        fileSize: fileSize || null,
        mimeType: mimeType || null,
        category: category || null,
        tags: tags || [],
        createdBy: user.id,
      },
    });

    return NextResponse.json({ success: true, resource });
  } catch (error) {
    console.error('Admin resources POST error:', error);
    return NextResponse.json({ error: 'Failed to create resource' }, { status: 500 });
  }
}

// PUT: Update resource
export async function PUT(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Resource ID required' }, { status: 400 });
    }

    // Only allow specific fields (prevent mass assignment)
    const allowedFields = ['title', 'description', 'url', 'type', 'category', 'isPublished'];
    const updates: Record<string, any> = {};
    for (const key of allowedFields) {
      if (key in body && body[key] !== undefined) updates[key] = body[key];
    }

    const resource = await prisma.resource.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json({ success: true, resource });
  } catch (error) {
    console.error('Admin resources PUT error:', error);
    return NextResponse.json({ error: 'Failed to update resource' }, { status: 500 });
  }
}

// DELETE: Delete resource
export async function DELETE(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Resource ID required' }, { status: 400 });
    }

    await prisma.resource.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin resources DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete resource' }, { status: 500 });
  }
}
