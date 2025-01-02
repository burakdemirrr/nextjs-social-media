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
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const tweetId = params.id;
    const userId = session.user.id;

    // Check if tweet exists
    const tweet = await prisma.tweet.findUnique({
      where: { id: tweetId },
    });

    if (!tweet) {
      return NextResponse.json(
        { message: 'Tweet not found' },
        { status: 404 }
      );
    }

    // Check if user has already liked the tweet
    const existingLike = await prisma.like.findUnique({
      where: {
        tweetId_userId: {
          tweetId,
          userId,
        },
      },
    });

    if (existingLike) {
      // Unlike the tweet
      await prisma.like.delete({
        where: {
          tweetId_userId: {
            tweetId,
            userId,
          },
        },
      });

      return NextResponse.json({ message: 'Tweet unliked' });
    }

    // Like the tweet
    await prisma.like.create({
      data: {
        tweetId,
        userId,
      },
    });

    return NextResponse.json({ message: 'Tweet liked' });
  } catch (error) {
    console.error('Error in POST /api/tweets/[id]/like:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 