import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { WebsiteCard } from '../components/WebsiteCard';
import { Plus, Search, Trash2, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'deleted', label: 'Deleted' },
  { value: 'old', label: 'Old' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
];

const emptyForm = { name: '', url: '', logo: '', username: '', password: '' };

export default function Websites() {
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [addForm, setAddForm] = useState(emptyForm);
  const [addLogoFile, setAddLogoFile] = useState(null);
  const [addLogoPreview, setAddLogoPreview] = useState(null);
  const [addErrors, setAddErrors] = useState({});
  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const [editForm, setEditForm] = useState(emptyForm);
  const [editLogoFile, setEditLogoFile] = useState(null);
  const [editLogoPreview, setEditLogoPreview] = useState(null);
  const [editErrors, setEditErrors] = useState({});

  useEffect(() => {
    fetchWebsites();
  }, [search, statusFilter, sort]);

  const fetchWebsites = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter && statusFilter !== 'all') params.status = statusFilter;
      if (sort) params.sort = sort;
      const res = await api.get('/websites', { params });
      setWebsites(res.data.websites);
    } catch (err) {
      toast.error('Failed to load websites');
    } finally {
      setLoading(false);
    }
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

  const handleEditLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setEditLogoPreview(reader.result);
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
      if (addLogoFile) formData.append('logo', addLogoFile);

      await api.post('/upload/websites-with-logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Website added');
      setAddModalOpen(false);
      setAddForm(emptyForm);
      setAddLogoFile(null);
      setAddLogoPreview(null);
      setAddErrors({});
      fetchWebsites();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add website');
    } finally {
      setAddLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm(editForm);
    if (Object.keys(errors).length > 0) {
      setEditErrors(errors);
      return;
    }
    setEditLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', editForm.name);
      formData.append('url', editForm.url);
      formData.append('username', editForm.username);
      formData.append('password', editForm.password);
      if (editLogoFile) formData.append('logo', editLogoFile);

      await api.put(`/upload/websites-with-logo/${editForm.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Website updated');
      setEditModalOpen(false);
      setEditLogoFile(null);
      setEditLogoPreview(null);
      fetchWebsites();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update website');
    } finally {
      setEditLoading(false);
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

  const handleDelete = (id) => {
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

  const handleMarkAsOld = (id) => {
    setLoading(true);
    api
      .patch(`/websites/${id}/mark-old`)
      .then(() => {
        toast.success('Website marked as old');
        fetchWebsites();
      })
      .catch(() => toast.error('Failed to mark as old'))
      .finally(() => setLoading(false));
  };

  const handlePermanentDelete = (id) => {
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

  const openEdit = (website) => {
    setEditForm({
      id: website.id,
      name: website.name,
      url: website.url,
      logo: website.logo,
      username: website.username,
      password: website.password,
    });
    setEditLogoFile(null);
    setEditLogoPreview(website.logo || null);
    setEditErrors({});
    setEditModalOpen(true);
  };

  const filtered = websites.filter((w) => {
    const matchSearch = w.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || w.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const sorted = [...filtered].sort((a, b) => {
    return sort === 'newest'
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(a.createdAt) - new Date(b.createdAt);
  });
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Websites</h1>
          <p className="text-gray-500 text-sm">Manage your website credentials</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAddModalOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Website
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 lg:flex-none lg:w-72">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name..."
              className="input-field pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 lg:flex-none lg:w-64">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1 lg:flex-none lg:w-56">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="input-field"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-24 h-12 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
      ) : sorted.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4 text-gray-400">
            <Trash2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No websites found</h3>
          <p className="text-gray-500 text-sm">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {sorted.map((website) => {
            const isDeleted = website.status === 'deleted';
            const isOld = website.status === 'old';
            return (
              <WebsiteCard
                key={website.id}
                website={website}
                onVisit={(url) => window.open(url, '_blank', 'noopener,noreferrer')}
                onEdit={openEdit}
                onDelete={isDeleted ? null : () => handleDelete(website.id)}
                onMarkOld={isOld ? null : () => handleMarkAsOld(website.id)}
              />
            );
          })}
        </div>
      )}
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
            <h2 className="text-lg font-bold text-gray-900">Add Website</h2>
            <button
              onClick={() => setAddModalOpen(false)}
              className="text-gray-400 hover:text-gray-900"
            >
              <RotateCcw className="w-5 h-5" />
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
                placeholder="e.g. Google"
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
                placeholder="••••••••"
                autoComplete="new-password"
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
                {addLoading ? 'Adding...' : 'Add Website'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center ${
          editModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none transition-opacity duration-300'
        }`}
      >
        <div
          onClick={() => setEditModalOpen(false)}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />
        <div className="relative bg-white rounded-xl border border-gray-100 p-6 w-full max-w-md mx-4 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Edit Website</h2>
            <button
              onClick={() => setEditModalOpen(false)}
              className="text-gray-400 hover:text-gray-900"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="label-text">Website Name</label>
              <input
                type="text"
                className={`input-field ${editErrors.name ? 'border-red-500' : ''}`}
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
              {editErrors.name && <p className="text-xs text-red-600 mt-1">{editErrors.name}</p>}
            </div>
            <div>
              <label className="label-text">Website URL</label>
              <input
                type="url"
                className={`input-field ${editErrors.url ? 'border-red-500' : ''}`}
                value={editForm.url}
                onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
              />
              {editErrors.url && <p className="text-xs text-red-600 mt-1">{editErrors.url}</p>}
            </div>
            <div>
              <label className="label-text">Logo Image (optional)</label>
              <input
                type="file"
                accept="image/*"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                onChange={handleEditLogoChange}
              />
              {editLogoPreview && (
                <div className="mt-3 flex items-center gap-3">
                  <img
                    src={editLogoPreview}
                    alt="Preview"
                    className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setEditLogoFile(null);
                      setEditLogoPreview(null);
                      setEditForm({ ...editForm, logo: '' });
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
                className={`input-field ${editErrors.username ? 'border-red-500' : ''}`}
                value={editForm.username}
                onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
              />
              {editErrors.username && <p className="text-xs text-red-600 mt-1">{editErrors.username}</p>}
            </div>
            <div>
              <label className="label-text">Password</label>
              <input
                type="password"
                className={`input-field ${editErrors.password ? 'border-red-500' : ''}`}
                value={editForm.password}
                onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                autoComplete="current-password"
              />
              {editErrors.password && <p className="text-xs text-red-600 mt-1">{editErrors.password}</p>}
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={editLoading}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                {editLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}