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

    const tweet = await prisma.tweet.findUnique({
      where: { id: params.id },
      include: { likes: true },
    });

    if (!tweet) {
      return new NextResponse('Tweet not found', { status: 404 });
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        tweetId_userId: {
          tweetId: params.id,
          userId: session.user.id,
        },
      },
    });

    if (existingLike) {
      // Unlike
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
    } else {
      // Like
      await prisma.like.create({
        data: {
          tweet: { connect: { id: params.id } },
          user: { connect: { id: session.user.id } },
        },
      });
    }

    return new NextResponse('Success', { status: 200 });
  } catch (error) {
    console.error('Error in like route:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 