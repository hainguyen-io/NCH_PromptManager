export interface Category {
  id: string;
  name: string;
  color: string; // Hex code or tailwind color name
}

export interface Prompt {
  id: string;
  title: string;
  content: string;
  description?: string;
  categoryId: string;
  tags: string[];
  viewCount: number;
  author: string;
  createdAt: number;
  isFavorite: boolean;
}

export type ViewName = 'HOME' | 'LIBRARY' | 'MY_PROMPTS' | 'CATEGORIES' | 'SETTINGS' | 'USER';

export interface User {
  name: string;
  avatarInitials: string;
}
