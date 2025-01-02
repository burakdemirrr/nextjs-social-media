export interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

export interface Like {
  id: string;
  userId: string;
  tweetId: string;
  createdAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  tweetId: string;
  createdAt: Date;
  author: {
    name: string | null;
    image: string | null;
  };
}

export interface Tweet {
  id: string;
  content: string;
  image?: string | null;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  author: {
    name: string | null;
    image: string | null;
  };
  likes: Like[];
  comments: Comment[];
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