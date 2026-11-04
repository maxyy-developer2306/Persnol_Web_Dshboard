import { useState } from 'react';
import {
  ExternalLink,
  Eye,
  EyeOff,
  Copy,
  Check,
  Edit2,
  Trash2,
  RotateCcw,
  Image,
  AlertTriangle,
  X,
} from 'lucide-react';

export const WebsiteCard = ({
  website,
  onVisit,
  onEdit,
  onDelete,
  onRestore,
  onMarkOld,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(null); // 'username' | 'password'
  const [imgError, setImgError] = useState(false);
  
  // State for Confirmation Modal: null | 'delete'
  const [activeModal, setActiveModal] = useState(null);

  const showLogo = website.logo && !imgError;

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      // clipboard blocked, ignore
    }
    setCopied(type);
    setTimeout(() => setCopied(null), 1500);
  };

  const handleConfirmAction = () => {
    if (activeModal === 'delete' && onDelete) {
      onDelete(website.id);
    }
    setActiveModal(null);
  };

  const iconBtn =
    'shrink-0 w-9 h-9 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 transition-colors';

  return (
    <>
      <div className="glass-card p-4 hover:shadow-md transition-shadow flex flex-col gap-4 h-full relative">
        {/* Header: logo + name + url */}
        <div className="flex items-center gap-3">
          <div className="shrink-0 w-16 h-16 rounded-xl overflow-hidden border border-gray-100 bg-white flex items-center justify-center">
            {showLogo ? (
              <img
                src={website.logo}
                alt={website.name}
                className="w-full h-full object-contain p-1"
                onError={() => setImgError(true)}
              />
            ) : (
              <Image className="w-7 h-7 text-gray-300" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3
                className="text-sm font-semibold text-gray-900 truncate"
                title={website.name}
              >
                {website.name}
              </h3>
              {website.status === 'deleted' && (
                <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-red-50 text-red-700">
                  Deleted
                </span>
              )}
              {website.status === 'old' && (
                <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-700">
                  Old
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 truncate mt-0.5" title={website.url}>
              {website.url}
            </p>
          </div>
        </div>

        {/* Credentials */}
        <div className="space-y-2">
          {/* Username */}
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-wide text-gray-400">Username</p>
              <p
                className="text-sm font-medium text-gray-900 truncate"
                title={website.username}
              >
                {website.username}
              </p>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(website.username, 'username')}
              className="shrink-0 p-1.5 rounded-md text-gray-400 hover:text-gray-900 hover:bg-white transition-colors"
              title="Copy username"
            >
              {copied === 'username' ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Password */}
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-wide text-gray-400">Password</p>
              <p
                className="text-sm font-medium text-gray-900 truncate"
                title={showPassword ? website.password : ''}
              >
                {showPassword ? website.password : '••••••••'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="shrink-0 p-1.5 rounded-md text-gray-400 hover:text-gray-900 hover:bg-white transition-colors"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={() => copyToClipboard(website.password, 'password')}
              className="shrink-0 p-1.5 rounded-md text-gray-400 hover:text-gray-900 hover:bg-white transition-colors"
              title="Copy password"
            >
              {copied === 'password' ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => onVisit && onVisit(website.url)}
            className="flex-1 min-w-0 h-9 bg-black text-white text-xs rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Visit</span>
          </button>

          <button
            type="button"
            onClick={() => onEdit && onEdit(website)}
            className={`${iconBtn} hover:text-gray-900 hover:bg-gray-50`}
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          {onRestore && (
            <button
              type="button"
              onClick={() => onRestore(website.id)}
              className={`${iconBtn} hover:text-green-600 hover:bg-green-50`}
              title="Restore"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {onMarkOld && (
            <button
              type="button"
              onClick={() => onMarkOld(website.id)}
              className={`${iconBtn} hover:text-amber-600 hover:bg-amber-50`}
              title="Mark as Old"
            >
              <AlertTriangle className="w-4 h-4" />
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={() => setActiveModal('delete')}
              className={`${iconBtn} text-red-400 hover:text-red-600 hover:bg-red-50`}
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal Overlay */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl border border-gray-100 max-w-sm w-full p-5 relative overflow-hidden">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4">
              <div
                className={`p-2.5 rounded-full shrink-0 ${
                  activeModal === 'delete'
                    ? 'bg-red-100 text-red-600'
                    : 'bg-yellow-100 text-yellow-600'
                }`}
              >
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  Delete Website
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Are you sure you want to delete{' '}
                  <span className="font-medium text-gray-800">
                    "{website.name}"
                  </span>
                  ?
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-3.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                className={`px-3.5 py-1.5 text-xs font-medium text-white rounded-md transition-colors ${
                  activeModal === 'delete'
                    ? 'bg-black hover:bg-black'
                    : 'bg-black hover:bg-black'
                }`}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};