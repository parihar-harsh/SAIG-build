import { BarChart2, Map } from 'lucide-react';

export default function ViewSwitcher({ activeTab, setActiveTab }) {
  return (
    <div className="flex gap-2 mb-4 bg-white dark:bg-panel p-1 rounded-lg border border-slate-300 dark:border-slate-700 shrink-0">
      <button 
        onClick={() => setActiveTab('trend')}
        className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'trend' ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
      >
        <BarChart2 className="w-4 h-4" /> Trend View
      </button>
      <button 
        onClick={() => setActiveTab('location')}
        className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'location' ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
      >
        <Map className="w-4 h-4" /> Location View
      </button>
    </div>
  );
}