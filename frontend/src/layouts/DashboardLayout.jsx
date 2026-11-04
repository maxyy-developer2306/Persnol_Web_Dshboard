import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar, MobileHeader } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export const DashboardLayout = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { replace: true });
    }
  }, [loading, user, navigate]);

  const handleAddWebsite = () => {
    setSidebarOpen(false);
    navigate('/websites');
  };

  const handleLogout = () => {
    setSidebarOpen(false);
    navigate('/login', { replace: true });
  };

  if (loading || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Mobile-only header with hamburger menu to open sidebar */}
      <MobileHeader
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onAddWebsite={handleAddWebsite}
        onLogout={handleLogout}
      />

      {/* Sidebar: off-screen on mobile, fixed on desktop */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onAddWebsite={handleAddWebsite}
        onLogout={handleLogout}
      />

      {/* Mobile backdrop: closes sidebar when tapped */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="min-h-screen sm:ml-64">
        {/* Navbar: desktop only (MobileHeader handles mobile) */}
        <nav className="hidden sm:flex">
          <Navbar />
        </nav>

        <main className="p-4 sm:p-6"><Outlet /></main>
      </div>
    </div>
  );
};