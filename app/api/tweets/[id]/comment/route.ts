import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { content } = await request.json();

    if (!content?.trim()) {
      return new NextResponse('Comment content is required', { status: 400 });
    }

    const tweet = await prisma.tweet.findUnique({
      where: { id: params.id },
    });

    if (!tweet) {
      return new NextResponse('Tweet not found', { status: 404 });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        tweet: { connect: { id: params.id } },
        author: { connect: { id: session.user.id } },
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error('Error in comment route:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 