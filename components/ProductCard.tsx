import React from 'react';
import { MenuItem } from '../types';
import { PlusIcon, LeafIcon } from './Icons';

interface ProductCardProps {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
  isHighlighted?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ item, onAdd, isHighlighted }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 transition-all duration-300 overflow-hidden flex flex-col h-full group ${isHighlighted ? 'ring-2 ring-indigo-500 shadow-lg scale-[1.02]' : 'hover:shadow-md border-gray-100'}`}>
      <div className="relative h-48 overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-2 left-2 flex gap-1">
          {item.isVeg ? (
            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
              <LeafIcon className="w-3 h-3" /> Veg
            </span>
          ) : (
             <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium">Non-Veg</span>
          )}
          {item.isPopular && (
            <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-medium">
              Popular
            </span>
          )}
        </div>
        {!item.available && (
           <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold">
             Sold Out
           </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 line-clamp-2 leading-tight">{item.name}</h3>
          <span className="font-bold text-lg text-green-600 dark:text-green-400">₹{item.price}</span>
        </div>
        
        <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4 flex-1">{item.description}</p>
        
        <div className="mt-auto flex items-center justify-between text-xs text-gray-400 mb-4">
           <span>{item.calories} kcal</span>
           <span>{item.category}</span>
        </div>

        <button 
          onClick={() => onAdd(item)}
          disabled={!item.available}
          className={`w-full py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors
            ${item.available 
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'}`}
        >
          <PlusIcon className="w-4 h-4" />
          Add to Tray
        </button>
      </div>
    </div>
  );
};

export default ProductCard;