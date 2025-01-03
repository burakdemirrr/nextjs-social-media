export interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

export interface Tweet {
  id: string;
  content: string;
  image?: string | null;
  createdAt: string;
  author: {
    id: string;
    name: string;
    image?: string | null;
  };
  likes: {
    id: string;
    userId: string;
    user: {
      id: string;
      name: string;
      image?: string | null;
    };
  }[];
  comments: {
    id: string;
    content: string;
    author: {
      id: string;
      name: string;
      image?: string | null;
    };
  }[];
}

export interface Like {
  id: string;
  userId: string;
  tweetId: string;
  createdAt: string;
  user: User;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: User;
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