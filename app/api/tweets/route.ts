import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const tweets = await prisma.tweet.findMany({
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
        likes: true,
        comments: {
          include: {
            author: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(tweets);
  } catch (error) {
    console.error('Error in GET /api/tweets:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { content, image } = await request.json();

    if (!content?.trim()) {
      return new NextResponse('Tweet content is required', { status: 400 });
    }

    const tweet = await prisma.tweet.create({
      data: {
        content,
        image,
        author: { connect: { id: session.user.id } },
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
        likes: true,
        comments: true,
      },
    });

    return NextResponse.json(tweet);
  } catch (error) {
    console.error('Error in POST /api/tweets:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 