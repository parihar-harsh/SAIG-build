import { Globe, AlertTriangle, Activity, Crosshair } from 'lucide-react';
import SummaryCard from './SummaryCard'; 

export default function ExecutiveSummary({ baseEvents, searchedEvents, activeFilter, setActiveFilter, resetAllFilters }) {
  
 
  const totalEvents = baseEvents.length;
  
  
  const highSeverityCount = searchedEvents.filter(e => e.severity_score >= 8).length;
 
  const activeSources = [...new Set(baseEvents.map(e => e.source_name))].length;

  
  const actorCounts = baseEvents.reduce((acc, event) => {
    let actor = event.actor_1;
    if (actor && typeof actor === 'string' && actor.trim() !== '') {
      actor = actor.trim(); 
      if (actor.toLowerCase() !== 'unknown') {
        acc[actor] = (acc[actor] || 0) + 1;
      }
    }
    return acc;
  }, {});
  
  let topActor = 'None';
  let maxCount = 0;
  for (const [actor, count] of Object.entries(actorCounts)) {
    if (count > maxCount) {
      maxCount = count;
      topActor = actor;
    }
  }

  
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      
      <SummaryCard 
        title="TOTAL EVENTS"
        value={totalEvents}
        icon={Globe}
        isActive={activeFilter === 'ALL'}
        onClick={resetAllFilters}
        tooltipContent="Total number of intelligence events loaded. Ignores keyword search."
      />

      <SummaryCard 
        title="HIGH SEVERITY"
        value={highSeverityCount}
        icon={AlertTriangle}
        colorClass="text-danger"
        isActive={activeFilter === 'HIGH_SEVERITY'}
        onClick={() => setActiveFilter('HIGH_SEVERITY')}
        tooltipContent="High severity events matching your current search criteria."
      />

      <SummaryCard 
        title="ACTIVE SOURCES"
        value={activeSources}
        icon={Activity}
        isClickable={false} 
        tooltipContent="Number of unique news and official websites currently being scraped."
      />

      <SummaryCard 
        title="TOP ACTOR"
        value={topActor}
        icon={Crosshair}
        colorClass="text-slate-500 dark:text-slate-400"
        tooltipAlign="right-0" 
        isActive={activeFilter === 'TOP_ACTOR'}
        onClick={() => setActiveFilter('TOP_ACTOR')}
        tooltipContent={
          <>
            <span className="block font-bold mb-2 text-white border-b border-slate-600 pb-1.5">What does this mean?</span>
            <p className="mb-2.5 leading-relaxed">This is the most talked-about group or country across the entire active dataset.</p>
            <span className="text-primary font-bold bg-primary/10 px-2 py-1 rounded inline-block">
              Currently the main subject in {maxCount} global events.
            </span>
          </>
        }
      />

    </div>
  );
}
