// src/hooks/useDashboardData.js
import { useState } from 'react';

// Import our new micro-hooks
import { useTheme } from './useTheme';
import { useEventsFetch } from './useEventsFetch';
import { useEventsFilter } from './useEventsFilter';

export function useDashboardData() {
  const [activeTab, setActiveTab] = useState('trend'); // UI state for the right panel
  
  // 1. Get Theme
  const { isDarkMode, setIsDarkMode } = useTheme();
  
  // 2. Fetch Raw Data
  const { events, loading, syncing, handleSync, isAutoSync, setIsAutoSync } = useEventsFetch();
  
  // 3. Pass Raw Data into the Filter Hook
  const filterControls = useEventsFilter(events);

  // 4. Handle CSV Export (using the filtered data)
  const handleExportCSV = () => {
    const headers = ['Date', 'Source', 'Type', 'Location', 'Primary Actor', 'Secondary Actor', 'Severity', 'Headline', 'URL'];
    const csvRows = filterControls.displayedEvents.map(ev => {
      const safeHeadline = ev.claim_text ? ev.claim_text.replace(/"/g, '""') : '';
      return `"${ev.event_datetime_utc}","${ev.source_name}","${ev.source_type}","${ev.location_text}","${ev.actor_1}","${ev.actor_2}",${ev.severity_score},"${safeHeadline}","${ev.source_url}"`;
    });
    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `OSINT_Iran_Report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // 5. Combine everything and send it to App.jsx!
  return {
    isDarkMode, setIsDarkMode,
    loading, syncing, handleSync,
    isAutoSync, setIsAutoSync, // <-- Add them to the export
    activeTab, setActiveTab,
    ...filterControls, 
    handleExportCSV
  };
}