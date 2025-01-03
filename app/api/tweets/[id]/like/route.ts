import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const tweet = await prisma.tweet.findUnique({
      where: { id: params.id },
      include: {
        likes: {
          where: {
            userId: session.user.id,
          },
        },
      },
    });

    if (!tweet) {
      return NextResponse.json(
        { message: 'Tweet not found' },
        { status: 404 }
      );
    }

    const isLiked = tweet.likes.length > 0;

    if (isLiked) {
      await prisma.like.deleteMany({
        where: {
          userId: session.user.id,
          tweetId: params.id,
        },
      });
      return NextResponse.json({ liked: false });
    }

    await prisma.like.create({
      data: {
        userId: session.user.id,
        tweetId: params.id,
      },
    });

    return NextResponse.json({ liked: true });
  } catch (error) {
    console.error('Like error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 