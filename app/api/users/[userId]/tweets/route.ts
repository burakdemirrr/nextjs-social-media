import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const tweets = await prisma.tweet.findMany({
      where: { authorId: params.userId },
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
    console.error("Error fetching user tweets:", error);
    return NextResponse.json(
      { message: "Error fetching user tweets" },
      { status: 500 }
    );
  }
} 