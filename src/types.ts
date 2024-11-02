export type BookmarkType = 'link' | 'text' | 'photo';

export interface Bookmark {
  id: string;
  userId: string;
  type: BookmarkType;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  avatar_url?: string;
}