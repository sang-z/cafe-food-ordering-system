import { Category, MenuItem } from './types';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Classic Masala Dosa',
    description: 'Crispy rice crepe filled with spiced potato mash, served with coconut chutney and sambar.',
    price: 60,
    category: Category.LUNCH,
    image: 'https://picsum.photos/seed/dosa/400/300',
    calories: 350,
    isPopular: true,
    isVeg: true,
    available: true
  },
  {
    id: '2',
    name: 'Veggie Grilled Sandwich',
    description: 'Toasted bread loaded with fresh cucumber, tomato, onion, and mint chutney.',
    price: 85,
    category: Category.SNACKS,
    image: 'https://picsum.photos/seed/sandwich/400/300',
    calories: 280,
    isVeg: true,
    available: true
  },
  {
    id: '3',
    name: 'Chicken Biryani Bowl',
    description: 'Aromatic basmati rice cooked with tender chicken pieces and authentic spices.',
    price: 150,
    category: Category.LUNCH,
    image: 'https://picsum.photos/seed/biryani/400/300',
    calories: 600,
    isPopular: true,
    isVeg: false,
    available: true
  },
  {
    id: '4',
    name: 'Paneer Butter Masala Meal',
    description: 'Rich tomato-based paneer gravy served with 2 parathas and salad.',
    price: 140,
    category: Category.LUNCH,
    image: 'https://picsum.photos/seed/paneer/400/300',
    calories: 550,
    isVeg: true,
    available: true
  },
  {
    id: '5',
    name: 'Spicy Samosa (2pcs)',
    description: 'Fried pastry with a savory filling of spiced potatoes and peas.',
    price: 40,
    category: Category.SNACKS,
    image: 'https://picsum.photos/seed/samosa/400/300',
    calories: 220,
    isPopular: true,
    isVeg: true,
    available: true
  },
  {
    id: '6',
    name: 'Loaded Nachos',
    description: 'Tortilla chips topped with melted cheese, jalapenos, and salsa.',
    price: 120,
    category: Category.SNACKS,
    image: 'https://picsum.photos/seed/nachos/400/300',
    calories: 450,
    isVeg: true,
    available: true
  },
  {
    id: '7',
    name: 'Cold Coffee',
    description: 'Chilled milk coffee blend with a scoop of vanilla ice cream.',
    price: 70,
    category: Category.DRINKS,
    image: 'https://picsum.photos/seed/coffee/400/300',
    calories: 200,
    isPopular: true,
    isVeg: true,
    available: true
  },
  {
    id: '8',
    name: 'Masala Chai',
    description: 'Traditional Indian tea brewed with aromatic spices.',
    price: 20,
    category: Category.DRINKS,
    image: 'https://picsum.photos/seed/chai/400/300',
    calories: 120,
    isVeg: true,
    available: true
  },
  {
    id: '9',
    name: 'Chocolate Brownie',
    description: 'Fudgy chocolate brownie with walnuts.',
    price: 65,
    category: Category.SPECIAL_OFFER,
    image: 'https://picsum.photos/seed/brownie/400/300',
    calories: 300,
    isVeg: false,
    available: true
  },
  {
    id: '10',
    name: 'Fresh Lime Soda',
    description: 'Refreshing lemon drink, sweet or salted.',
    price: 40,
    category: Category.DRINKS,
    image: 'https://picsum.photos/seed/lime/400/300',
    calories: 80,
    isVeg: true,
    available: true
  }
];

export const CATEGORIES = [
  Category.SPECIAL_OFFER,
  Category.LUNCH,
  Category.SNACKS,
  Category.DRINKS
];
