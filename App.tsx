import React, { useState, useEffect } from 'react';
import { MenuItem, UserRole, User, Order, CartItem } from './types';
import { MENU_ITEMS } from './constants';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';
import LoginPage from './components/LoginPage';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  const handleLogin = (role: UserRole, id: string) => {
    setCurrentUser({
      id,
      name: role === 'admin' ? 'Administrator' : id,
      role
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const addMenuItem = (item: MenuItem) => {
    setMenuItems(prev => [item, ...prev]);
  };

  const handleEditMenuItem = (updatedItem: MenuItem) => {
    setMenuItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
  };

  const handleDeleteMenuItem = (itemId: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleToggleAvailability = (itemId: string) => {
    setMenuItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, available: !item.available } : item
    ));
  };

  const handlePlaceOrder = (items: CartItem[], studentId: string): Promise<Order> => {
    return new Promise((resolve) => {
      // Simulate network delay for realism
      setTimeout(() => {
        const newOrder: Order = {
          id: `ORD-${Math.floor(Math.random() * 10000)}`,
          items: [...items],
          total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
          status: 'pending',
          timestamp: Date.now(),
          studentId
        };
        setOrders(prev => [newOrder, ...prev]);
        resolve(newOrder);
      }, 1000);
    });
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
  };

  if (!currentUser) {
    return (
      <LoginPage 
        onLogin={handleLogin} 
        isDarkMode={isDarkMode} 
        toggleTheme={toggleTheme} 
      />
    );
  }

  if (currentUser.role === 'admin') {
    return (
      <AdminDashboard 
        menuItems={menuItems} 
        orders={orders}
        onAddItem={addMenuItem} 
        onEditItem={handleEditMenuItem}
        onDeleteItem={handleDeleteMenuItem}
        onToggleAvailability={handleToggleAvailability}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />
    );
  }

  return (
    <StudentDashboard 
      menuItems={menuItems} 
      studentId={currentUser.id} 
      orders={orders.filter(o => o.studentId === currentUser.id)}
      onPlaceOrder={handlePlaceOrder}
      onLogout={handleLogout}
      isDarkMode={isDarkMode}
      toggleTheme={toggleTheme}
    />
  );
}

export default App;