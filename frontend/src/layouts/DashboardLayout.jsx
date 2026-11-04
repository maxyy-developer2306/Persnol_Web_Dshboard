import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export const DashboardLayout = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
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
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onAddWebsite={handleAddWebsite}
        onLogout={handleLogout}
      />
      <div className="min-h-screen sm:ml-64">
        {location.pathname !== '/' && (
          <>
            <Navbar />
            <main className="p-6 sm:p-8"><Outlet /></main>
          </>
        )}
      </div>
    </div>
  );
};