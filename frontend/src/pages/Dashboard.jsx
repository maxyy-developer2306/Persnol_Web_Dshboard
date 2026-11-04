import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { StatCard } from '../components/StatCard';

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, active: 0, deleted: 0, old: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/websites/stats');
        setStats(res.data.stats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-20 h-12 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
        <p className="text-gray-500">Manage your websites from one place.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Websites" value={stats.total} type="total" />
        <StatCard label="Active" value={stats.active} type="active" />
        <StatCard label="Deleted" value={stats.deleted} type="deleted" />
        <StatCard label="Old Websites" value={stats.old} type="old" />
      </div>

      <div className="glass-card p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/websites')}
            className="btn-secondary"
          >
            Add New Website
          </button>
          <Link to="/websites">
            <button className="btn-secondary">View All Websites</button>
          </Link>
        </div>
      </div>
    </div>
  );
}