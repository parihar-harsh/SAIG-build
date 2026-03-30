import { Sun, Moon, Shield, RefreshCw , Activity} from 'lucide-react';

export default function Header({ isDarkMode, setIsDarkMode, handleSync, syncing, loading, isAutoSync, setIsAutoSync }) 
{return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
          <Shield className="w-8 h-8 text-primary" /> 
          SAIG OSINT Dashboard
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Real-time Middle East geopolitical intelligence feed</p>
      </div>
      
      <div className="flex items-center gap-3 w-full md:w-auto">
        

        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2.5 rounded-lg border transition-colors bg-white border-slate-300 text-slate-600 hover:bg-slate-100 dark:bg-panel dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          title="Toggle Light/Dark Mode"
        >
          {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
        </button>


        <div className="flex items-center gap-2 bg-white dark:bg-panel px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 transition-colors hidden sm:flex">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">AUTO-SYNC</span>
          <button 
            onClick={() => setIsAutoSync(!isAutoSync)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${isAutoSync ? 'bg-danger' : 'bg-slate-300 dark:bg-slate-600'}`}
            title="Toggle background auto-polling every 30 seconds"
          >
            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${isAutoSync ? 'translate-x-5' : 'translate-x-1'}`} />
          </button>
        </div>

     
        <button 
          onClick={handleSync}
          disabled={syncing || loading}
          className="flex-grow md:flex-grow-0 flex items-center justify-center gap-2 bg-white hover:bg-slate-50 dark:bg-panel dark:hover:bg-slate-700 px-5 py-2.5 rounded-lg transition-colors border border-slate-300 dark:border-slate-600 font-medium disabled:opacity-50 text-slate-700 dark:text-slate-200"
        >
          <RefreshCw className={`w-5 h-5 ${syncing ? 'animate-spin text-primary' : 'text-slate-500 dark:text-slate-300'}`} />
          {syncing ? 'Scraping Live Feeds...' : 'Sync Live Data'}
        </button>
        
      </div>
    </div>
  );
}
