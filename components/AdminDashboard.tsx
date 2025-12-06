import React, { useState, useRef, useEffect } from 'react';
import { MenuItem, Category, Order } from '../types';
import { CATEGORIES } from '../constants';
import { PlusIcon, XIcon, LeafIcon, ShoppingBagIcon, CameraIcon, UploadIcon, EditIcon, TrashIcon, SunIcon, MoonIcon } from './Icons';

interface AdminDashboardProps {
  menuItems: MenuItem[];
  orders: Order[];
  onAddItem: (item: MenuItem) => void;
  onEditItem: (item: MenuItem) => void;
  onDeleteItem: (itemId: string) => void;
  onToggleAvailability: (itemId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  menuItems, 
  orders, 
  onAddItem, 
  onEditItem,
  onDeleteItem,
  onToggleAvailability, 
  onUpdateOrderStatus,
  onLogout,
  isDarkMode,
  toggleTheme
}) => {
  const [activeTab, setActiveTab] = useState<'live-orders' | 'menu-list' | 'add-item'>('live-orders');
  
  // Form State for Add Item
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    price: 0,
    category: Category.SNACKS,
    image: '',
    calories: 0,
    isVeg: true,
    available: true
  });

  // Edit State
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  // Delete State
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);

  // Camera State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraMode, setCameraMode] = useState<'add' | 'edit'>('add');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Analytics Calculation
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todaysOrders = orders.filter(o => o.timestamp >= todayStart.getTime());
  const totalOrdersToday = todaysOrders.length;
  // Only calculate sales for completed orders
  const totalSalesToday = todaysOrders
    .filter(o => o.status === 'completed')
    .reduce((acc, o) => acc + o.total, 0);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation: Ensure Name and Price are present
    if (!newItem.name?.trim() || !newItem.price || newItem.price <= 0) {
        alert("Please enter both an Item Name and a valid Price.");
        return;
    }

    const item: MenuItem = {
      ...newItem as MenuItem,
      id: Date.now().toString(),
      isPopular: false,
      // Provide defaults for optional fields
      description: newItem.description || 'No description available',
      calories: newItem.calories || 0,
      image: newItem.image || 'https://placehold.co/400x300?text=No+Image'
    };

    onAddItem(item);
    setActiveTab('menu-list');
    setNewItem({
      name: '',
      description: '',
      price: 0,
      category: Category.SNACKS,
      image: '',
      calories: 0,
      isVeg: true,
      available: true
    });
    alert('Item added successfully!');
  };

  const handleUpdateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    onEditItem(editingItem);
    setEditingItem(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, mode: 'add' | 'edit') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
          const result = reader.result as string;
          if (mode === 'add') {
             setNewItem({ ...newItem, image: result });
          } else if (mode === 'edit' && editingItem) {
             setEditingItem({ ...editingItem, image: result });
          }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const startCamera = async (mode: 'add' | 'edit') => {
      setCameraMode(mode);
      setIsCameraOpen(true);
      try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
          // Short delay to ensure video element is rendered
          setTimeout(() => {
              if (videoRef.current) {
                  videoRef.current.srcObject = stream;
              }
          }, 100);
      } catch (err) {
          console.error("Error accessing camera:", err);
          alert("Could not access camera. Please check permissions.");
          setIsCameraOpen(false);
      }
  };
  
  const capturePhoto = () => {
      if (videoRef.current && canvasRef.current) {
          const video = videoRef.current;
          const canvas = canvasRef.current;
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const context = canvas.getContext('2d');
          if (context) {
              context.drawImage(video, 0, 0, canvas.width, canvas.height);
              const dataUrl = canvas.toDataURL('image/jpeg');
              
              if (cameraMode === 'add') {
                  setNewItem({ ...newItem, image: dataUrl });
              } else if (cameraMode === 'edit' && editingItem) {
                  setEditingItem({ ...editingItem, image: dataUrl });
              }
              
              stopCamera();
          }
      }
  };
  
  const stopCamera = () => {
      if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
      }
      setIsCameraOpen(false);
  };

  // Clean up camera stream if component unmounts
  useEffect(() => {
    return () => {
        if (isCameraOpen) stopCamera();
    }
  }, []);

  const getStatusColor = (status: Order['status']) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-200 dark:border-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-200 dark:border-blue-800';
      case 'ready': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-200 dark:border-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const activeOrders = orders.filter(o => o.status !== 'completed');
  const completedOrders = orders.filter(o => o.status === 'completed');

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      {/* Admin Header */}
      <header className="bg-gray-900 dark:bg-gray-800 text-white shadow-lg sticky top-0 z-30 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-500 rounded flex items-center justify-center font-bold">A</div>
            <h1 className="font-bold text-xl">Admin Dashboard</h1>
            {activeOrders.length > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
                {activeOrders.length} Active Orders
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
             <button
                onClick={toggleTheme}
                className="p-2 text-gray-300 hover:text-white rounded-full transition-colors"
             >
                {isDarkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
             </button>
             <button onClick={onLogout} className="text-gray-300 hover:text-white text-sm font-medium">
                Logout
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Orders Today</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalOrdersToday}</p>
            </div>
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-full text-indigo-600 dark:text-indigo-400">
              <ShoppingBagIcon className="w-8 h-8" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Sales Today</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">₹{totalSalesToday}</p>
              <p className="text-xs text-gray-400 mt-1">(Completed Orders Only)</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400">
               <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 <line x1="12" y1="1" x2="12" y2="23"></line>
                 <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
               </svg>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
           <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
             {activeTab === 'live-orders' ? 'Kitchen Display System' : 'Menu Management'}
           </h2>
           <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border dark:border-gray-700 inline-flex overflow-x-auto max-w-full">
              <button 
                onClick={() => setActiveTab('live-orders')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'live-orders' ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              >
                Live Orders
              </button>
              <button 
                onClick={() => setActiveTab('menu-list')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'menu-list' ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              >
                Menu List
              </button>
              <button 
                onClick={() => setActiveTab('add-item')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'add-item' ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              >
                Add Item
              </button>
           </div>
        </div>

        {activeTab === 'live-orders' && (
          <div className="space-y-6">
            {activeOrders.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🍽️</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No active orders</h3>
                <p className="text-gray-500 dark:text-gray-400">Wait for students to place orders.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {activeOrders.map(order => (
                  <div key={order.id} className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
                    <div className="p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-gray-900 dark:text-white">#{order.id.split('-')[1]}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">({order.studentId})</span>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-bold border ${getStatusColor(order.status)} uppercase`}>
                        {order.status}
                      </span>
                    </div>
                    
                    <div className="p-4 flex-1 overflow-y-auto max-h-60">
                      <ul className="space-y-3">
                        {order.items.map((item, idx) => (
                          <li key={idx} className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2">
                              <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded font-bold text-gray-700 dark:text-gray-300">{item.quantity}x</span>
                              <span className="text-gray-800 dark:text-gray-200">{item.name}</span>
                            </div>
                            <span className="text-gray-500 dark:text-gray-400">₹{item.price * item.quantity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                      <div className="flex justify-between items-center mb-4 font-bold text-gray-900 dark:text-white">
                        <span>Total</span>
                        <span>₹{order.total}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        {order.status === 'pending' && (
                          <button 
                            onClick={() => onUpdateOrderStatus(order.id, 'preparing')}
                            className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                          >
                            Accept
                          </button>
                        )}
                        {order.status === 'preparing' && (
                          <button 
                            onClick={() => onUpdateOrderStatus(order.id, 'ready')}
                            className="flex-1 bg-orange-500 text-white py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors"
                          >
                            Mark Ready
                          </button>
                        )}
                        {order.status === 'ready' && (
                          <button 
                            onClick={() => onUpdateOrderStatus(order.id, 'completed')}
                            className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                          >
                            Complete Order
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {completedOrders.length > 0 && (
               <div className="mt-8">
                 <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4">Completed Orders ({completedOrders.length})</h3>
                 <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-hidden">
                   <table className="w-full text-left text-sm">
                     <thead className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                       <tr>
                         <th className="px-4 py-3 text-gray-500 dark:text-gray-400">ID</th>
                         <th className="px-4 py-3 text-gray-500 dark:text-gray-400">Student</th>
                         <th className="px-4 py-3 text-gray-500 dark:text-gray-400">Items</th>
                         <th className="px-4 py-3 text-gray-500 dark:text-gray-400">Total</th>
                         <th className="px-4 py-3 text-gray-500 dark:text-gray-400">Time</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                       {completedOrders.slice(0, 10).map(order => (
                         <tr key={order.id} className="dark:text-gray-300">
                           <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{order.id}</td>
                           <td className="px-4 py-3">{order.studentId}</td>
                           <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{order.items.length} items</td>
                           <td className="px-4 py-3 font-bold">₹{order.total}</td>
                           <td className="px-4 py-3 text-gray-400">
                             {new Date(order.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
               </div>
            )}
          </div>
        )}

        {activeTab === 'menu-list' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Item</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {menuItems.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img className="h-10 w-10 rounded-full object-cover" src={item.image} alt="" />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{item.isVeg ? 'Veg' : 'Non-Veg'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">₹{item.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                        <button 
                           type="button"
                           onClick={() => setEditingItem(item)}
                           className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 p-1"
                           title="Edit Item"
                        >
                           <EditIcon className="w-5 h-5" />
                        </button>

                        <button 
                           type="button"
                           onClick={() => setItemToDelete(item)}
                           className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-1"
                           title="Delete Item"
                        >
                           <TrashIcon className="w-5 h-5" />
                        </button>
                        
                        <div className="flex items-center gap-2 border-l dark:border-gray-600 pl-3 ml-1">
                            <button 
                               type="button"
                               onClick={() => onToggleAvailability(item.id)}
                               className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${item.available ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-600'}`}
                            >
                              <span className="sr-only">Use setting</span>
                              <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${item.available ? 'translate-x-5' : 'translate-x-0'}`}
                              />
                            </button>
                            <span className="text-xs text-gray-500 dark:text-gray-400 w-16">
                                {item.available ? 'Stock In' : 'Stock Out'}
                            </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'add-item' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-8 max-w-2xl mx-auto">
             <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Add New Menu Item</h3>
             <form onSubmit={handleAddItem} className="space-y-6">
                <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Item Name</label>
                   <input 
                     required
                     type="text" 
                     className="w-full border border-gray-600 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-700 text-white placeholder-gray-400"
                     value={newItem.name}
                     onChange={e => setNewItem({...newItem, name: e.target.value})}
                   />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (₹)</label>
                        <input 
                            required
                            type="number" 
                            className="w-full border border-gray-600 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-700 text-white placeholder-gray-400"
                            value={newItem.price || ''}
                            onChange={e => setNewItem({...newItem, price: Number(e.target.value)})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Calories (Optional)</label>
                        <input 
                            type="number" 
                            className="w-full border border-gray-600 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-700 text-white placeholder-gray-400"
                            value={newItem.calories || ''}
                            onChange={e => setNewItem({...newItem, calories: Number(e.target.value)})}
                        />
                    </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                   <select 
                     className="w-full border border-gray-600 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-700 text-white placeholder-gray-400"
                     value={newItem.category}
                     onChange={e => setNewItem({...newItem, category: e.target.value as Category})}
                   >
                     {CATEGORIES.map(cat => (
                       <option key={cat} value={cat}>{cat}</option>
                     ))}
                   </select>
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (Optional)</label>
                   <textarea 
                     rows={3}
                     className="w-full border border-gray-600 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-700 text-white placeholder-gray-400"
                     value={newItem.description}
                     onChange={e => setNewItem({...newItem, description: e.target.value})}
                   />
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Item Image (Optional)</label>
                   {newItem.image ? (
                     <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden mb-2 border border-gray-600">
                        <img src={newItem.image} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                            type="button"
                            onClick={() => setNewItem({...newItem, image: ''})}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600 transition-colors"
                        >
                            <XIcon className="w-4 h-4" />
                        </button>
                     </div>
                   ) : (
                     <div className="flex gap-4">
                         {/* File Upload Button */}
                         <label className="flex-1 cursor-pointer bg-gray-700 text-white rounded-lg px-4 py-8 flex flex-col items-center justify-center border-2 border-dashed border-gray-500 hover:border-indigo-500 hover:bg-gray-600 transition-all">
                            <UploadIcon className="w-8 h-8 mb-2 text-gray-400" />
                            <span className="text-sm font-medium">Upload from Gallery</span>
                            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'add')} className="hidden" />
                         </label>

                         {/* Camera Button */}
                         <button 
                            type="button"
                            onClick={() => startCamera('add')}
                            className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-8 flex flex-col items-center justify-center border-2 border-dashed border-gray-500 hover:border-indigo-500 hover:bg-gray-600 transition-all"
                         >
                            <CameraIcon className="w-8 h-8 mb-2 text-gray-400" />
                            <span className="text-sm font-medium">Take Photo</span>
                         </button>
                     </div>
                   )}
                </div>

                <div className="flex items-center gap-2">
                   <input 
                     type="checkbox"
                     id="isVeg"
                     checked={newItem.isVeg}
                     onChange={e => setNewItem({...newItem, isVeg: e.target.checked})}
                     className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                   />
                   <label htmlFor="isVeg" className="text-sm text-gray-700 dark:text-gray-300 font-medium">Is Vegetarian?</label>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <PlusIcon className="w-5 h-5" />
                  Add Item to Menu
                </button>
             </form>
          </div>
        )}
      </main>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-5 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex justify-between items-center sticky top-0">
                 <h3 className="text-lg font-bold text-gray-900 dark:text-white">Edit Menu Item</h3>
                 <button onClick={() => setEditingItem(null)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
                    <XIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                 </button>
              </div>
              
              <div className="p-6">
                 <form onSubmit={handleUpdateItem} className="space-y-6">
                    <div>
                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Item Name</label>
                       <input 
                         required
                         type="text" 
                         className="w-full border border-gray-600 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-700 text-white placeholder-gray-400"
                         value={editingItem.name}
                         onChange={e => setEditingItem({...editingItem, name: e.target.value})}
                       />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (₹)</label>
                            <input 
                                required
                                type="number" 
                                className="w-full border border-gray-600 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-700 text-white placeholder-gray-400"
                                value={editingItem.price || ''}
                                onChange={e => setEditingItem({...editingItem, price: Number(e.target.value)})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Calories (Optional)</label>
                            <input 
                                type="number" 
                                className="w-full border border-gray-600 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-700 text-white placeholder-gray-400"
                                value={editingItem.calories || ''}
                                onChange={e => setEditingItem({...editingItem, calories: Number(e.target.value)})}
                            />
                        </div>
                    </div>

                    <div>
                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                       <select 
                         className="w-full border border-gray-600 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-700 text-white placeholder-gray-400"
                         value={editingItem.category}
                         onChange={e => setEditingItem({...editingItem, category: e.target.value as Category})}
                       >
                         {CATEGORIES.map(cat => (
                           <option key={cat} value={cat}>{cat}</option>
                         ))}
                       </select>
                    </div>

                    <div>
                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (Optional)</label>
                       <textarea 
                         rows={3}
                         className="w-full border border-gray-600 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-700 text-white placeholder-gray-400"
                         value={editingItem.description}
                         onChange={e => setEditingItem({...editingItem, description: e.target.value})}
                       />
                    </div>

                    <div>
                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Item Image (Optional)</label>
                       {editingItem.image ? (
                         <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden mb-2 border border-gray-600">
                            <img src={editingItem.image} alt="Preview" className="w-full h-full object-cover" />
                            <button 
                                type="button"
                                onClick={() => setEditingItem({...editingItem, image: ''})}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600 transition-colors"
                            >
                                <XIcon className="w-4 h-4" />
                            </button>
                         </div>
                       ) : (
                         <div className="flex gap-4">
                             {/* File Upload Button */}
                             <label className="flex-1 cursor-pointer bg-gray-700 text-white rounded-lg px-4 py-8 flex flex-col items-center justify-center border-2 border-dashed border-gray-500 hover:border-indigo-500 hover:bg-gray-600 transition-all">
                                <UploadIcon className="w-8 h-8 mb-2 text-gray-400" />
                                <span className="text-sm font-medium">Upload from Gallery</span>
                                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'edit')} className="hidden" />
                             </label>

                             {/* Camera Button */}
                             <button 
                                type="button"
                                onClick={() => startCamera('edit')}
                                className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-8 flex flex-col items-center justify-center border-2 border-dashed border-gray-500 hover:border-indigo-500 hover:bg-gray-600 transition-all"
                             >
                                <CameraIcon className="w-8 h-8 mb-2 text-gray-400" />
                                <span className="text-sm font-medium">Take Photo</span>
                             </button>
                         </div>
                       )}
                    </div>

                    <div className="flex items-center gap-2">
                       <input 
                         type="checkbox"
                         id="editIsVeg"
                         checked={editingItem.isVeg}
                         onChange={e => setEditingItem({...editingItem, isVeg: e.target.checked})}
                         className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                       />
                       <label htmlFor="editIsVeg" className="text-sm text-gray-700 dark:text-gray-300 font-medium">Is Vegetarian?</label>
                    </div>

                    <div className="flex gap-3">
                        <button 
                          type="button"
                          onClick={() => setEditingItem(null)}
                          className="flex-1 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white font-bold py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit"
                          className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 shadow-md transition-all"
                        >
                          Save Changes
                        </button>
                    </div>
                 </form>
              </div>
           </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm w-full animate-scale-in">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Item</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Are you sure you want to delete "{itemToDelete.name}"? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  onDeleteItem(itemToDelete.id);
                  setItemToDelete(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Camera Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-black rounded-lg overflow-hidden border border-gray-800">
                 <video ref={videoRef} autoPlay playsInline className="w-full h-auto" />
                 <canvas ref={canvasRef} className="hidden" />
                 
                 <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                     <button 
                        type="button" 
                        onClick={stopCamera}
                        className="bg-gray-800 text-white px-6 py-2 rounded-full font-bold shadow-lg border border-gray-600 hover:bg-gray-700"
                     >
                        Cancel
                     </button>
                     <button 
                        type="button" 
                        onClick={capturePhoto}
                        className="bg-white text-black px-6 py-2 rounded-full font-bold shadow-lg flex items-center gap-2 hover:bg-gray-200"
                     >
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        Capture
                     </button>
                 </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;