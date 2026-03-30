
import { useDashboardData } from './hooks/useDashBoardData';


import Header from './components/Header';
import ExecutiveSummary from './components/ExecutiveSummary';
import CommandBar from './components/CommandBar';
import EventFeed from './components/EventFeed';
import ViewSwitcher from './components/ViewSwitcher';
import TrendView from './components/TrendView';
import LocationView from './components/LocationView';

function App() {
  
  const {
    isDarkMode, setIsDarkMode,
    loading, syncing,
    isAutoSync, setIsAutoSync, activeTab, setActiveTab,
    activeFilter, setActiveFilter,
    searchQuery, setSearchQuery,
    sortBy, setSortBy,
    sourceFilter, setSourceFilter,
    verifiedOnly, setVerifiedOnly,
    baseEvents, searchedEvents, displayedEvents,
    handleSync, handleResetAllFilters, handleExportCSV
  } = useDashboardData();


  return (
    <div className="min-h-screen transition-colors duration-300 bg-slate-50 dark:bg-darker p-4 md:p-8 text-slate-900 dark:text-slate-200">
      
      <Header 
        isDarkMode={isDarkMode} 
        setIsDarkMode={setIsDarkMode} 
        handleSync={handleSync} 
        syncing={syncing} 
        loading={loading} 
        isAutoSync={isAutoSync}       
    setIsAutoSync={setIsAutoSync}
      />

      <ExecutiveSummary 
        baseEvents={baseEvents}          
        searchedEvents={searchedEvents}  
        activeFilter={activeFilter} 
        setActiveFilter={setActiveFilter} 
        resetAllFilters={handleResetAllFilters} 
      />

      <CommandBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sourceFilter={sourceFilter}
        setSourceFilter={setSourceFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        verifiedOnly={verifiedOnly}       
        setVerifiedOnly={setVerifiedOnly}
        handleExportCSV={handleExportCSV}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 h-[800px]">
         <EventFeed 
    events={displayedEvents} 
    loading={loading} 
    isAutoSync={isAutoSync} 
  />
        </div>
        
        <div className="h-[800px] flex flex-col">
          <ViewSwitcher activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="flex-grow">
            {activeTab === 'trend' ? (
              <TrendView events={displayedEvents} />
            ) : (
              <LocationView events={displayedEvents} isDarkMode={isDarkMode} />
            )}
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default App;
