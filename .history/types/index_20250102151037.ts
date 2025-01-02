export interface Tweet {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  author: {
    name: string | null;
    image: string | null;
  };
  likes: Like[];
}

export interface Like {
  id: string;
  createdAt: Date;
  userId: string;
  tweetId: string;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
} 