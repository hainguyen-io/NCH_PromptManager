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

export type ViewName = 'HOME' | 'LIBRARY' | 'MY_PROMPTS' | 'CATEGORIES' | 'SETTINGS' | 'USER' | 'ADMIN';

export interface User {
  name: string;
  avatarInitials: string;
}


// Add to existing types
export type UserStatus = 'pending' | 'approved' | 'rejected';
export type UserRole = 'admin' | 'user';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  createdAt: number;
  approvedAt?: number;
  approvedBy?: string;
  avatarInitials: string;
}
