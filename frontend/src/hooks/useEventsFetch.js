import { useState, useEffect } from 'react';
import axios from 'axios';

export function useEventsFetch() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [isAutoSync, setIsAutoSync] = useState(false); 


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


  useEffect(() => {
    let intervalId;
    
    if (isAutoSync) {
     intervalId = setInterval(async () => {
        try {
          const response = await axios.get('http://localhost:5001/api/events');
          setEvents(response.data);
          console.log("Silent Auto-Sync Complete");
        } catch (error) {
          console.error("Auto-sync error:", error);
        }
      }, 30000);  }

     return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isAutoSync]);

  return { events, loading, syncing, handleSync, isAutoSync, setIsAutoSync };
}
