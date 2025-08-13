import React from 'react';
import { 
  RotateCcw, 
  Maximize2, 
  Star, 
  Type, 
  Plus, 
  ArrowUpRight, 
  User 
} from 'lucide-react';
import { SidebarItems, SidebarProps } from '../../types';



const Sidebar: React.FC<SidebarProps> = ({ activeItem, onItemClick }) => {
  const sidebarItems: SidebarItems[] = [
    { id: 'refresh', icon: RotateCcw, label: 'Refresh' },
    { id: 'resize', icon: Maximize2, label: 'Resize' },
    { id: 'favorite', icon: Star, label: 'Favorite' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'add-text', icon: Plus, label: 'Add Text' },
    { id: 'expand', icon: ArrowUpRight, label: 'Expand' },
    { id: 'user', icon: User, label: 'User' },
  ];

  return (
    <div className="w-16 bg-slate-800 flex flex-col items-center py-4 space-y-4">
      {sidebarItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = activeItem === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => onItemClick?.(item.id)}
            className={`
              p-3 rounded-lg transition-colors duration-200 group relative
              ${isActive 
                ? 'bg-slate-700 text-white' 
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }
            `}
            title={item.label}
          >
            <IconComponent size={20} />
            
            <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
              {item.label}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default Sidebar;
