// src/hooks/useEventsFilter.js
import { useState } from 'react';

export function useEventsFilter(events) {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState(''); 
  const [sortBy, setSortBy] = useState('newest'); 
  const [sourceFilter, setSourceFilter] = useState('ALL');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const handleResetAllFilters = () => {
    setActiveFilter('ALL');       
    setSearchQuery('');           
    setSourceFilter('ALL');       
    setSortBy('newest');   
    setVerifiedOnly(false);       
  };

  const baseEvents = events.filter(ev => {
    if (sourceFilter !== 'ALL' && ev.source_type !== sourceFilter) return false;
    return true;
  });

  const searchedEvents = baseEvents.filter(ev => {
    if (searchQuery.trim() !== '' && !JSON.stringify(ev).toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const topActor = baseEvents.length > 0 ? 
    Object.entries(baseEvents.reduce((acc, ev) => {
      let a = ev.actor_1;
      if (a && typeof a === 'string' && a.trim() !== '' && a.trim().toLowerCase() !== 'unknown') {
        a = a.trim();
        acc[a] = (acc[a] || 0) + 1;
      }
      return acc;
    }, {})).sort((a, b) => b[1] - a[1])[0]?.[0] : null;

  const displayedEvents = searchedEvents
    .filter(ev => {
      if (verifiedOnly && (ev.confidence_score < 9 || !ev.confidence_score)) return false;
      if (activeFilter === 'HIGH_SEVERITY') return ev.severity_score >= 8;
      if (activeFilter === 'TOP_ACTOR') {
        const cleanActor = ev.actor_1 && typeof ev.actor_1 === 'string' ? ev.actor_1.trim() : '';
        return cleanActor === topActor;
      }
      return true; 
    })
    .sort((a, b) => {
      if (sortBy === 'severity') return b.severity_score - a.severity_score;
      if (sortBy === 'oldest') return new Date(a.event_datetime_utc) - new Date(b.event_datetime_utc);
      return new Date(b.event_datetime_utc) - new Date(a.event_datetime_utc); 
    });

  return {
    activeFilter, setActiveFilter,
    searchQuery, setSearchQuery,
    sortBy, setSortBy,
    sourceFilter, setSourceFilter,
    verifiedOnly, setVerifiedOnly,
    baseEvents, searchedEvents, displayedEvents,
    handleResetAllFilters
  };
}