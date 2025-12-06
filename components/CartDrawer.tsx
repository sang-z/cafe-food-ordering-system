import React, { useState } from 'react';
import { CartItem, Order } from '../types';
import { MinusIcon, PlusIcon, XIcon, ShoppingBagIcon } from './Icons';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  studentId: string;
  onUpdateQuantity: (id: string, delta: number) => void;
  onClearCart: () => void;
  onPlaceOrder: (items: CartItem[], studentId: string) => Promise<Order>;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  studentId,
  onUpdateQuantity,
  onClearCart,
  onPlaceOrder
}) => {
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderStatus, setOrderStatus] = useState<'idle' | 'success'>('idle');
  const [lastOrderId, setLastOrderId] = useState<string>('');

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!studentId) {
      alert("Session error. Please relogin.");
      return;
    }
    setIsOrdering(true);
    try {
      const order = await onPlaceOrder(items, studentId);
      
      setLastOrderId(order.id);
      setOrderStatus('success');
      setTimeout(() => {
        onClearCart();
        setOrderStatus('idle');
        onClose();
      }, 3000);
    } catch (e) {
      console.error(e);
      alert("Order failed. Please try again.");
    } finally {
      setIsOrdering(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white dark:bg-gray-800 h-full shadow-2xl flex flex-col transform transition-transform animate-slide-in-right">
        <div className="p-5 border-b dark:border-gray-700 flex items-center justify-between bg-brand-dark text-white">
          <div className="flex items-center gap-3">
            <ShoppingBagIcon className="w-6 h-6" />
            <h2 className="text-xl font-bold">Your Tray</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 dark:text-gray-100">
          {orderStatus === 'success' ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 animate-fade-in">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Order Placed!</h3>
              <p className="text-gray-500 dark:text-gray-400">Your food is being prepared. <br/>Order ID: #{lastOrderId.split('-')[1] || lastOrderId}</p>
            </div>
          ) : items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <ShoppingBagIcon className="w-16 h-16 opacity-20" />
              <p className="text-lg">Your tray is empty.</p>
              <button onClick={onClose} className="text-brand-dark dark:text-brand-light hover:underline">Browse Menu</button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-3 border dark:border-gray-700 rounded-lg hover:border-brand-light transition-colors bg-white dark:bg-gray-700/50">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md bg-gray-100" />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">{item.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">₹{item.price}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <button 
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors"
                      >
                        <MinusIcon className="w-4 h-4" />
                      </button>
                      <span className="font-semibold w-6 text-center">{item.quantity}</span>
                      <button 
                         onClick={() => onUpdateQuantity(item.id, 1)}
                         className="p-1 rounded-full bg-brand-light/30 dark:bg-brand-light/20 hover:bg-brand-light/50 text-brand-dark dark:text-brand-light transition-colors"
                      >
                        <PlusIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between items-end">
                    <span className="font-bold text-gray-800 dark:text-white">₹{item.price * item.quantity}</span>
                    <button 
                        onClick={() => onUpdateQuantity(item.id, -item.quantity)}
                        className="text-red-400 hover:text-red-600 p-1"
                    >
                        <XIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && orderStatus !== 'success' && (
          <div className="p-5 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
              <span className="text-xl font-bold text-gray-900 dark:text-white">₹{total}</span>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Student ID</label>
              <input 
                type="text" 
                value={studentId}
                readOnly
                disabled
                className="w-full border dark:border-gray-600 rounded-lg px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed font-medium"
              />
              <p className="text-xs text-gray-400 mt-1">Locked to login session</p>
            </div>

            <div className="flex gap-3">
              <button
                 onClick={onClose}
                 disabled={isOrdering}
                 className="flex-1 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-bold text-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                 Back
              </button>
              <button 
                onClick={handleCheckout}
                disabled={isOrdering}
                className={`flex-[2] py-3 rounded-lg text-white font-bold text-lg shadow-md flex items-center justify-center gap-2
                  ${isOrdering ? 'bg-green-400 cursor-wait' : 'bg-green-600 hover:bg-green-700 hover:shadow-lg active:transform active:scale-95 transition-all'}`}
              >
                {isOrdering ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;