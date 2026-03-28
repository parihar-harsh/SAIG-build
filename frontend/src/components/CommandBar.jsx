import { Search, Download, Filter, SortDesc, ShieldCheck } from 'lucide-react'; // <-- Added ShieldCheck

export default function CommandBar({
  searchQuery,
  setSearchQuery,
  sourceFilter,
  setSourceFilter,
  sortBy,
  setSortBy,
  verifiedOnly, 
  setVerifiedOnly,
  handleExportCSV
}) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 mb-6 bg-white dark:bg-panel p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
      
      {/* Search Input */}
      <div className="relative flex-grow">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Search Iran-centric events, actors, or locations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-500 transition-colors"
        />
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-wrap items-center gap-3">
        
        {/* Source Filter */}
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 transition-colors">
          <Filter className="w-4 h-4 text-slate-500" />
          <select 
            value={sourceFilter} 
            onChange={(e) => setSourceFilter(e.target.value)}
            className="bg-transparent text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Sources</option>
            <option value="Official">Official / UN Only</option>
            <option value="NGO">NGOs Only</option>
            <option value="News">News Media Only</option>
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 transition-colors">
          <SortDesc className="w-4 h-4 text-slate-500" />
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="newest">Latest First</option>
            <option value="oldest">Oldest First</option>
            <option value="severity">Highest Severity</option>
          </select>
        </div>

        {/* THE NEW VERIFICATION TOGGLE */}
        <button 
          onClick={() => setVerifiedOnly(!verifiedOnly)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
            verifiedOnly 
              ? 'bg-green-100 border-green-300 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-400' 
              : 'bg-slate-50 border-slate-200 text-slate-500 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="Filter out unverified or low-confidence reports"
        >
          <ShieldCheck className="w-4 h-4" />
          {verifiedOnly ? 'Verified Only' : 'Include Unverified'}
        </button>

        {/* CSV Export Button */}
        <button 
          onClick={handleExportCSV}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>

      </div>
    </div>
  );
}