import { useState, useEffect } from 'react';
import axios from 'axios';

export function useEventsFetch() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [isAutoSync, setIsAutoSync] = useState(false); // <-- New State

  // Initial load (shows spinner)
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5001/api/events');
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Manual Sync (triggers backend scraper)
  const handleSync = async () => {
    setSyncing(true);
    try {
      await axios.post('http://localhost:5001/api/sync'); 
      await fetchEvents(); 
    } catch (error) {
      console.error("Error syncing live feeds:", error);
    }
    setSyncing(false);
  };

  // --- THE WAR ROOM ENGINE ---
  useEffect(() => {
    let intervalId;
    
    if (isAutoSync) {
      // Every 30 seconds, silently fetch the latest DB events without triggering the loading spinner
      intervalId = setInterval(async () => {
        try {
          const response = await axios.get('http://localhost:5001/api/events');
          setEvents(response.data);
          console.log("Silent Auto-Sync Complete");
        } catch (error) {
          console.error("Auto-sync error:", error);
        }
      }, 30000); // 30,000 ms = 30 seconds
    }

    // Cleanup function: destroys the timer if the user turns it off, preventing memory leaks
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isAutoSync]);

  return { events, loading, syncing, handleSync, isAutoSync, setIsAutoSync };
}