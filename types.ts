export enum Category {
  LUNCH = 'Lunch',
  SNACKS = 'Snacks',
  DRINKS = 'Drinks',
  SPECIAL_OFFER = 'Special Offer'
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  calories: number;
  isPopular?: boolean;
  isVeg: boolean;
  available: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed';
  timestamp: number;
  studentId: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  suggestedItemIds?: string[];
  isThinking?: boolean;
}

export type UserRole = 'student' | 'admin' | null;

export interface User {
  id: string;
  name: string;
  role: UserRole;
}