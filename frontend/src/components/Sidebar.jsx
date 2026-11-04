import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Globe,
  Trash2,
  AlertTriangle,
  Plus,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';

const navItems = [
  { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
  { name: 'All Websites', path: '/websites', icon: Globe },
  { name: 'Deleted Websites', path: '/deleted', icon: Trash2 },
  { name: 'Old Websites', path: '/old', icon: AlertTriangle },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export const Sidebar = ({ onToggle, isOpen, onAddWebsite, onLogout }) => {
  const location = useLocation();

  const handleLogout = (e) => {
    e.preventDefault();
    onLogout();
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0`}
    >
      <div className="flex h-14 items-center justify-between px-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-black rounded-sm flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">M</span>
          </div>
          <span className="font-bold text-sm tracking-tight text-gray-900">MAXYY</span>
        </div>
        <button
          onClick={onToggle}
          className="sm:hidden p-1.5 text-gray-600 hover:text-gray-900"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <nav className="py-4 px-2 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => onToggle && onToggle()}
              className={`flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-colors ${
                isActive
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto py-4 px-2 border-t border-gray-200 bg-white">
        <button
          onClick={onAddWebsite}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        >
          <Plus className="w-4 h-4" />
          <span className="font-medium">Add Website</span>
        </button>
        <button
          onClick={handleLogout}
          className="mt-2 w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        >
          <LogOut className="w-4 h-4" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export const MobileHeader = ({ onToggle, onAddWebsite, onLogout }) => {
  return (
    <div className="sm:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 bg-black rounded-sm flex items-center justify-center">
          <span className="text-white text-[10px] font-bold">M</span>
        </div>
        <span className="font-bold text-sm tracking-tight text-gray-900">MAXYY</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onToggle}
          className="p-1.5 text-gray-600 hover:text-gray-900"
        >
          <Menu className="w-4 h-4" />
        </button>
        <button
          onClick={onAddWebsite}
          className="px-3 py-1.5 bg-black text-white text-[11px] rounded-sm hover:bg-gray-800"
        >
          Add Website
        </button>
      </div>
    </div>
  );
};

export default Sidebar;