import { CartItem, Order } from "../types";

// This service mocks what a Python backend (Django/Flask/FastAPI) would do.
// In a real app, this would use fetch() to call your Python API endpoints.

export const processOrder = async (items: CartItem[], studentId: string): Promise<Order> => {
  return new Promise((resolve) => {
    // Simulate network latency
    setTimeout(() => {
      const orderId = `ORD-${Math.floor(Math.random() * 10000)}`;
      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      
      const newOrder: Order = {
        id: orderId,
        items: [...items],
        total,
        status: 'preparing',
        timestamp: Date.now(),
        studentId
      };
      
      resolve(newOrder);
    }, 1500);
  });
};