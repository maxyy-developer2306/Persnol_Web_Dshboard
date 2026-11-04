import { useState, useEffect } from 'react';
import api from '../services/api';
import { WebsiteCard } from '../components/WebsiteCard';
import { Search, Trash2, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Deleted() {
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchWebsites();
  }, [search]);

  const fetchWebsites = async () => {
    setLoading(true);
    try {
      const params = { status: 'deleted' };
      if (search) params.search = search;
      const res = await api.get('/websites', { params });
      setWebsites(res.data.websites);
    } catch (err) {
      toast.error('Failed to load deleted websites');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = (id) => {
    setLoading(true);
    api
      .patch(`/websites/${id}/restore`)
      .then(() => {
        toast.success('Website restored');
        fetchWebsites();
      })
      .catch(() => toast.error('Failed to restore'))
      .finally(() => setLoading(false));
  };

  const handlePermanentDelete = (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this website?')) return;
    setLoading(true);
    api
      .delete(`/websites/${id}/permanent`)
      .then(() => {
        toast.success('Website permanently deleted');
        fetchWebsites();
      })
      .catch(() => toast.error('Failed to delete'))
      .finally(() => setLoading(false));
  };

  const filtered = websites.filter((w) =>
    w.name.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Deleted Websites</h1>
          <p className="text-gray-500 text-sm">Soft-deleted websites awaiting permanent removal</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search deleted websites..."
          className="input-field pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="w-24 h-12 bg-gray-200 rounded animate-pulse" />
        </div>
      ) : sorted.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4 text-gray-400">
            <Trash2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No deleted websites</h3>
          <p className="text-gray-500 text-sm">Deleted websites will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {sorted.map((website) => (
            <div key={website.id} className="glass-card p-5">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-semibold text-gray-900 truncate">{website.name}</h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700">
                  Deleted
                </span>
              </div>
              <p className="text-xs text-gray-500 truncate mb-3">{website.url}</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRestore(website.id)}
                  className="flex-1 py-2 bg-black text-white text-xs rounded-md hover:bg-gray-800 transition-colors"
                >
                  Restore
                </button>
                <button
                  onClick={() => handlePermanentDelete(website.id)}
                  className="px-3 py-2 text-red-500 hover:text-red-700 border border-transparent rounded-md text-xs transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Permanent
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}