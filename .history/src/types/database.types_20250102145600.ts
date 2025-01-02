export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          created_at: string;
          username: string;
          full_name: string;
          avatar_url: string | null;
          bio: string | null;
        };
        Insert: {
          id: string;
          created_at?: string;
          username: string;
          full_name: string;
          avatar_url?: string | null;
          bio?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          username?: string;
          full_name?: string;
          avatar_url?: string | null;
          bio?: string | null;
        };
      };
      tweets: {
        Row: {
          id: string;
          created_at: string;
          content: string;
          user_id: string;
          image_url: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          content: string;
          user_id: string;
          image_url?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          content?: string;
          user_id?: string;
          image_url?: string | null;
        };
      };
      likes: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          tweet_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          tweet_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          tweet_id?: string;
        };
      };
      follows: {
        Row: {
          id: string;
          created_at: string;
          follower_id: string;
          following_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          follower_id: string;
          following_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          follower_id?: string;
          following_id?: string;
        };
      };
    };
  };
} 