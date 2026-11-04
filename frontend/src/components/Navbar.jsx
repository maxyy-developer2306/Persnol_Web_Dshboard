import { Bell, Search, User } from 'lucide-react';

export const Navbar = () => {
  return (
    <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-3.5">
        <div className="flex items-center gap-4 w-full max-w-xl">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search websites..."
              className="pl-9 pr-3 py-1.5 text-[12px] border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-1 focus:ring-black w-64"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 text-gray-500 hover:text-gray-900">
            <Bell className="w-4 h-4" />
          </button>
          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-gray-200">
            <span className="text-xs text-gray-600 font-medium">Admin</span>
            <User className="w-4 h-4 text-gray-600" />
          </div>
        </div>
      </div>
    </div>
  );
};