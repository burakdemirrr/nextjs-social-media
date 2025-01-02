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
            id: true,
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
    console.error("Error fetching tweets:", error);
    return NextResponse.json(
      { message: "Error fetching tweets" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const json = await request.json();
    const { content, image } = json;

    if (!content) {
      return NextResponse.json(
        { message: "Content is required" },
        { status: 400 }
      );
    }

    const tweet = await prisma.tweet.create({
      data: {
        content,
        image,
        authorId: session.user.id as string,
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

    return NextResponse.json(tweet, { status: 201 });
  } catch (error) {
    console.error("Error creating tweet:", error);
    return NextResponse.json(
      { message: "Error creating tweet" },
      { status: 500 }
    );
  }
} 