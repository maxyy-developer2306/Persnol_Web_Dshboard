import { Globe, Activity, Trash2, AlertTriangle } from 'lucide-react';

const iconMap = {
  total: Globe,
  active: Activity,
  deleted: Trash2,
  old: AlertTriangle,
};

export const StatCard = ({ label, value, type }) => {
  const Icon = iconMap[type] || Globe;
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-600">
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};