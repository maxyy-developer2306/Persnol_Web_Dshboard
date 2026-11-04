import { useState, useEffect } from 'react';
import { Plus, Search, X } from 'lucide-react';
import api from '../services/api';
import { WebsiteCard } from '../components/WebsiteCard';
import { AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Old() {
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', url: '', logo: '', username: '', password: '' });
  const [addLogoFile, setAddLogoFile] = useState(null);
  const [addLogoPreview, setAddLogoPreview] = useState(null);
  const [addErrors, setAddErrors] = useState({});
  const [addLoading, setAddLoading] = useState(false);

  useEffect(() => {
    fetchWebsites();
  }, [search]);

  const fetchWebsites = async () => {
    setLoading(true);
    try {
      const params = { status: 'old' };
      if (search) params.search = search;
      const res = await api.get('/websites', { params });
      setWebsites(res.data.websites);
    } catch (err) {
      toast.error('Failed to load old websites');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = (id) => {
    setLoading(true);
    api
      .patch(`/websites/${id}/restore`)
      .then(() => {
        toast.success('Website restored to active');
        fetchWebsites();
      })
      .catch(() => toast.error('Failed to restore'))
      .finally(() => setLoading(false));
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this old website?')) return;
    setLoading(true);
    api
      .patch(`/websites/${id}/delete`)
      .then(() => {
        toast.success('Website moved to deleted');
        fetchWebsites();
      })
      .catch(() => toast.error('Failed to delete'))
      .finally(() => setLoading(false));
  };

  const validateForm = (data) => {
    const errors = {};
    if (!data.name.trim()) errors.name = 'Name is required';
    if (!data.url.trim()) errors.url = 'URL is required';
    if (!data.username.trim()) errors.username = 'Username is required';
    if (!data.password) errors.password = 'Password is required';
    return errors;
  };

  const handleAddLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAddLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAddLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm(addForm);
    if (Object.keys(errors).length > 0) {
      setAddErrors(errors);
      return;
    }
    setAddLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', addForm.name);
      formData.append('url', addForm.url);
      formData.append('username', addForm.username);
      formData.append('password', addForm.password);
      formData.append('status', 'old');
      if (addLogoFile) formData.append('logo', addLogoFile);

      await api.post('/upload/websites-with-logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Old website added');
      setAddModalOpen(false);
      setAddForm({ name: '', url: '', logo: '', username: '', password: '' });
      setAddLogoFile(null);
      setAddLogoPreview(null);
      setAddErrors({});
      fetchWebsites();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add old website');
    } finally {
      setAddLoading(false);
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Old Websites</h1>
          <p className="text-gray-500 text-sm">
            Websites marked as old / legacy
          </p>
        </div>
        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm rounded-md hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Old Website</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search old websites..."
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
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4 text-amber-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No old websites</h3>
          <p className="text-gray-500 text-sm">
            Old websites will appear here when marked as old.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {sorted.map((website) => (
            <WebsiteCard
              key={website.id}
              website={website}
              onVisit={(url) => window.open(url, '_blank', 'noopener,noreferrer')}
              onEdit={() => {}}
              onDelete={handleDelete}
              onRestore={handleRestore}
            />
          ))}
        </div>
      )}

      {/* Add Old Website Modal */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center ${
          addModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none transition-opacity duration-300'
        }`}
      >
        <div
          onClick={() => setAddModalOpen(false)}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />
        <div className="relative bg-white rounded-xl border border-gray-100 p-6 w-full max-w-md mx-4 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Add Old Website</h2>
            <button
              onClick={() => setAddModalOpen(false)}
              className="text-gray-400 hover:text-gray-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div>
              <label className="label-text">Website Name</label>
              <input
                type="text"
                className={`input-field ${addErrors.name ? 'border-red-500' : ''}`}
                value={addForm.name}
                onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                placeholder="e.g. Old Site"
              />
              {addErrors.name && <p className="text-xs text-red-600 mt-1">{addErrors.name}</p>}
            </div>
            <div>
              <label className="label-text">Website URL</label>
              <input
                type="url"
                className={`input-field ${addErrors.url ? 'border-red-500' : ''}`}
                value={addForm.url}
                onChange={(e) => setAddForm({ ...addForm, url: e.target.value })}
                placeholder="https://example.com"
              />
              {addErrors.url && <p className="text-xs text-red-600 mt-1">{addErrors.url}</p>}
            </div>
            <div>
              <label className="label-text">Logo Image (optional)</label>
              <input
                type="file"
                accept="image/*"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                onChange={handleAddLogoChange}
              />
              {addLogoPreview && (
                <div className="mt-3 flex items-center gap-3">
                  <img
                    src={addLogoPreview}
                    alt="Preview"
                    className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setAddLogoFile(null);
                      setAddLogoPreview(null);
                    }}
                    className="text-xs text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
            <div>
              <label className="label-text">Username</label>
              <input
                type="text"
                className={`input-field ${addErrors.username ? 'border-red-500' : ''}`}
                value={addForm.username}
                onChange={(e) => setAddForm({ ...addForm, username: e.target.value })}
                placeholder="admin"
              />
              {addErrors.username && <p className="text-xs text-red-600 mt-1">{addErrors.username}</p>}
            </div>
            <div>
              <label className="label-text">Password</label>
              <input
                type="password"
                className={`input-field ${addErrors.password ? 'border-red-500' : ''}`}
                value={addForm.password}
                onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                autoComplete="current-password"
              />
              {addErrors.password && <p className="text-xs text-red-600 mt-1">{addErrors.password}</p>}
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={addLoading}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                {addLoading ? 'Adding...' : 'Add Old Website'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}