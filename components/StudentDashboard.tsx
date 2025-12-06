
import React, { useState, useMemo } from 'react';
import { MenuItem, CartItem, Category, Order } from '../types';
import { CATEGORIES } from '../constants';
import ProductCard from './ProductCard';
import CartDrawer from './CartDrawer';
import { ShoppingBagIcon, SearchIcon, ClockIcon, XIcon, InstagramIcon, SunIcon, MoonIcon } from './Icons';

interface StudentDashboardProps {
  menuItems: MenuItem[];
  studentId: string;
  orders: Order[];
  onPlaceOrder: (items: CartItem[], studentId: string) => Promise<Order>;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ 
  menuItems, 
  studentId, 
  orders, 
  onPlaceOrder, 
  onLogout,
  isDarkMode,
  toggleTheme
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Cart Logic
  const addToCart = (item: MenuItem) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(0, item.quantity + delta) };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const clearCart = () => setCartItems([]);
  
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const activeOrdersCount = orders.filter(o => o.status !== 'completed').length;

  // Filter Logic
  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, menuItems]);

  const getStatusBadge = (status: Order['status']) => {
    switch(status) {
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-bold uppercase">Waiting for Accept</span>;
      case 'preparing':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-bold uppercase">Accepted & Cooking</span>;
      case 'ready':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-bold uppercase">Ready to Pickup</span>;
      case 'completed':
        return <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-bold uppercase">Delivered</span>;
    }
  };

  const developers = [
    { name: 'Sangeeth', link: 'https://www.instagram.com/sang._.z?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==' },
    { name: 'Sreeraj', link: 'https://www.instagram.com/criz._s7_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==' },
    { name: 'Ajith', link: 'https://www.instagram.com/aji_.thh?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==' },
    { name: 'Varsha', link: '' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 transition-colors duration-200">
      {/* Navigation */}
      <nav className="sticky top-0 z-30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-700 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                L
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 leading-none">
                  LoL cafe
                </h1>
                <span className="text-xs text-gray-500 dark:text-gray-400">Welcome, {studentId}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <div className="hidden md:flex relative group">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                  type="text"
                  placeholder="Search food..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-100 dark:bg-gray-700 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64 transition-all text-gray-900 dark:text-white dark:placeholder-gray-400"
                />
              </div>

              <button 
                onClick={() => setIsOrdersOpen(true)}
                className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors flex items-center gap-2"
                title="Track Orders"
              >
                <div className="relative">
                  <ClockIcon className="w-6 h-6" />
                  {activeOrdersCount > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-blue-500 rounded-full animate-pulse">
                      {activeOrdersCount}
                    </span>
                  )}
                </div>
                <span className="hidden md:block text-sm font-medium">My Orders</span>
              </button>

              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <ShoppingBagIcon className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full transform translate-x-1/4 -translate-y-1/4">
                    {cartCount}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-2 border-l border-gray-200 dark:border-gray-600 pl-4 ml-2">
                <button
                  onClick={toggleTheme}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  {isDarkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                </button>

                <button onClick={onLogout} className="text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero / Banner */}
      <div className="bg-indigo-900 text-white py-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] opacity-20 bg-cover bg-center" />
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4">Fuel Your Studies</h2>
          <p className="text-indigo-200 text-lg max-w-xl mb-6">Order fresh food from the canteen and skip the line.</p>
          <button 
             onClick={() => document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth'})}
             className="bg-white text-indigo-900 px-6 py-3 rounded-full font-bold hover:bg-indigo-50 transition-colors inline-flex items-center gap-2"
          >
            Order Now
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main id="menu-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Categories */}
        <div className="flex overflow-x-auto pb-4 gap-2 mb-8 hide-scrollbar">
          <button
            onClick={() => setActiveCategory('All')}
            className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors border ${
              activeCategory === 'All' 
                ? 'bg-indigo-600 text-white border-indigo-600' 
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            All Items
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors border ${
                activeCategory === cat 
                  ? 'bg-indigo-600 text-white border-indigo-600' 
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <div key={item.id} id={`product-${item.id}`}>
              <ProductCard 
                item={item} 
                onAdd={addToCart} 
              />
            </div>
          ))}
          {filteredItems.length === 0 && (
             <div className="col-span-full text-center py-20 text-gray-400">
                <p className="text-xl">No items found matching your filters.</p>
                <button onClick={() => {setSearchQuery(''); setActiveCategory('All');}} className="mt-4 text-indigo-600 dark:text-indigo-400 hover:underline">Clear Filters</button>
             </div>
          )}
        </div>
      </main>

      {/* Simple Footer with About Button */}
      <footer className="mt-12 py-8 flex justify-center">
        <button 
          onClick={() => setIsAboutOpen(true)}
          className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium text-sm transition-colors border-b border-transparent hover:border-indigo-600"
        >
          About Us
        </button>
      </footer>

      {/* Mobile Sticky Cart Button (if cart has items and drawer closed) */}
      {!isCartOpen && cartCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 md:hidden">
           <button 
             onClick={() => setIsCartOpen(true)}
             className="bg-gray-900 dark:bg-gray-700 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3 active:scale-95 transition-transform"
           >
             <div className="bg-gray-700 dark:bg-gray-900 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">{cartCount}</div>
             <span className="font-medium">View Tray</span>
           </button>
        </div>
      )}

      {/* Orders Modal */}
      {isOrdersOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsOrdersOpen(false)} />
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col animate-scale-in">
             <div className="p-5 border-b dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-800">
               <div className="flex items-center gap-2">
                 <ClockIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                 <h2 className="text-xl font-bold text-gray-800 dark:text-white">My Orders</h2>
               </div>
               <button onClick={() => setIsOrdersOpen(false)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                 <XIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
               </button>
             </div>
             
             <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 dark:bg-gray-900/50">
                {orders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 text-gray-400 text-center">
                    <ClockIcon className="w-12 h-12 mb-3 opacity-20" />
                    <p>No past orders found.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                     {orders.map((order) => (
                       <div key={order.id} className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 shadow-sm p-4 hover:shadow-md transition-shadow">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
                             <div>
                                <span className="font-bold text-gray-800 dark:text-white mr-2">#{order.id.split('-')[1]}</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                   {new Date(order.timestamp).toLocaleString()}
                                </span>
                             </div>
                             {getStatusBadge(order.status)}
                          </div>
                          
                          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-3 text-sm">
                             {order.items.map((item, idx) => (
                               <div key={idx} className="flex justify-between text-gray-600 dark:text-gray-300 mb-1 last:mb-0">
                                  <span>{item.quantity}x {item.name}</span>
                                  <span>₹{item.price * item.quantity}</span>
                               </div>
                             ))}
                          </div>
                          
                          <div className="flex justify-between items-center font-bold text-gray-900 dark:text-white border-t dark:border-gray-700 pt-3">
                             <span>Total Amount</span>
                             <span className="text-lg">₹{order.total}</span>
                          </div>
                       </div>
                     ))}
                  </div>
                )}
             </div>
          </div>
        </div>
      )}

      {/* About Modal */}
      {isAboutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
           <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsAboutOpen(false)} />
           <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-in">
              <div className="p-5 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800">
                 <h2 className="text-xl font-bold text-gray-900 dark:text-white">About Us</h2>
                 <button onClick={() => setIsAboutOpen(false)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
                    <XIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                 </button>
              </div>
              <div className="p-8 text-center space-y-6">
                 <div>
                    <h3 className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-400 mb-2">CAS VDY</h3>
                 </div>
                 
                 <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-4">Developed By</span>
                    <div className="flex flex-col w-full max-w-[220px] mx-auto space-y-3">
                        {developers.map((dev, index) => (
                           <div key={index} className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-2">
                                 <span className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500 shrink-0"></span>
                                 <span className="text-sm text-gray-800 dark:text-gray-200 font-medium">{dev.name}</span>
                              </div>
                              {index < 3 && dev.link ? (
                                <a 
                                  href={dev.link} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-gray-400 hover:text-pink-500 transition-colors"
                                >
                                  <InstagramIcon className="w-4 h-4" />
                                </a>
                              ) : <div className="w-4 h-4"></div>}
                           </div>
                        ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-6">Dept. of Computer Science</p>
                    <p className="text-xs text-gray-300 mt-2">© 2025 CAS VDY. All rights reserved.</p>
                 </div>
              </div>
           </div>
        </div>
      )}

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cartItems} 
        studentId={studentId}
        onUpdateQuantity={updateQuantity}
        onClearCart={clearCart}
        onPlaceOrder={onPlaceOrder}
      />
      
    </div>
  );
}

export default StudentDashboard;
