export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm">Manage your dashboard preferences</p>
      </div>

      <div className="glass-card p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Account</h2>
        <div className="space-y-4">
          <div>
            <label className="label-text">Admin Username</label>
            <p className="text-sm text-gray-600 truncate">Configured via backend ADMIN_USERNAME</p>
          </div>
          <div>
            <label className="label-text">Change Password</label>
            <p className="text-sm text-gray-500">Update the admin password in the backend .env file and restart the server.</p>
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Security</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Session Duration</p>
              <p className="text-xs text-gray-500">7 days</p>
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">Active</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Password Encryption</p>
              <p className="text-xs text-gray-500">AES-256-CBC at rest</p>
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">Enabled</span>
          </div>
        </div>
      </div>
    </div>
  );
}