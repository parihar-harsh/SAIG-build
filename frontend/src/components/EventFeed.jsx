import { useState } from 'react';
import { ShieldAlert, ExternalLink, ChevronDown, ChevronUp, MapPin, Target, Activity, FileText, Sparkles, HelpCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function EventFeed({ events, loading, isAutoSync }){
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (idx) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <div className="bg-white dark:bg-panel rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col h-full max-h-[800px] shadow-sm dark:shadow-none transition-colors">
      
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Live Intelligence Feed</h2>
          {isAutoSync && (
            <div className="flex items-center gap-1.5 bg-danger/10 border border-danger/20 px-2 py-0.5 rounded text-[10px] font-black text-danger uppercase tracking-widest animate-in fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-danger"></span>
              </span>
              LIVE
            </div>
          )}
        </div>
        <div className="bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold tracking-wide">
          {events.length} {events.length === 1 ? 'Result' : 'Results'}
        </div>
      </div>


      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {loading && events.length === 0 ? (
          <div className="text-slate-500 text-center py-10 animate-pulse">Initializing OSINT Data Streams...</div>
        ) : events.length === 0 ? (
          <div className="text-slate-500 text-center py-10">No intelligence events found.</div>
        ) : (
          events.map((ev, idx) => {
            const isExpanded = expandedIndex === idx;

            return (
              <div 
                key={idx} 
                onClick={() => toggleExpand(idx)}
                className="bg-slate-50 dark:bg-darker p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary/50 dark:hover:border-slate-500 transition-all cursor-pointer group"
              >
                

                <div className="flex justify-between items-center mb-4">
                  <span className="bg-blue-100 dark:bg-slate-800 text-blue-700 dark:text-primary text-xs font-bold px-2.5 py-1 rounded border border-blue-200 dark:border-slate-700">
                    {ev.source_name}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 text-xs font-medium">
                      {ev.event_datetime_utc ? format(parseISO(ev.event_datetime_utc), 'HH:mm • MMM dd') : 'Unknown Time'}
                    </span>
                    <div className="text-slate-400 group-hover:text-primary transition-colors">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                <div className={isExpanded ? "mb-4" : "mb-0"}>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    <FileText className="w-3 h-3" /> Raw Source Claim (Fact)
                  </div>
                  <p className={`text-slate-900 dark:text-slate-200 font-medium leading-relaxed transition-all duration-200 ${isExpanded ? '' : 'line-clamp-2'}`}>
                    {ev.claim_text}
                  </p>
                </div>


                {isExpanded && (
                  <div className="border-t border-slate-200 dark:border-slate-700/50 pt-4 mt-3 animate-in fade-in duration-200">
                    
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-4">
                      <Sparkles className="w-3.5 h-3.5" /> AI-Inferred Entities & System Scoring
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      

                      <div className="flex flex-col gap-2">
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold flex items-center gap-1">
                          <Target className="w-3 h-3" /> Extracted Actor
                        </span>
                        {ev.actor_1 && ev.actor_1 !== 'Unknown' ? (
                          <span className="inline-flex w-fit items-center gap-1 text-[11px] font-bold px-2 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded border border-purple-200 dark:border-purple-800/50 cursor-help" title="Extracted via NLP">
                            {ev.actor_1} {ev.actor_2 && ev.actor_2 !== 'Unknown' && ` → ${ev.actor_2}`}
                          </span>
                        ) : (
                          <span className="inline-flex w-fit items-center gap-1 text-[11px] font-medium px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded border border-slate-200 dark:border-slate-700">
                            <HelpCircle className="w-3 h-3" /> Unknown Actor
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> Location Focus
                        </span>
                        {ev.location_text && ev.location_text !== 'Unknown' ? (
                          <span className="inline-flex w-fit items-center gap-1 text-[11px] font-bold px-2 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded border border-purple-200 dark:border-purple-800/50 cursor-help" title="Extracted via NLP">
                            {ev.location_text}
                          </span>
                        ) : (
                          <span className="inline-flex w-fit items-center gap-1 text-[11px] font-medium px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded border border-slate-200 dark:border-slate-700">
                            <HelpCircle className="w-3 h-3" /> Unknown Location
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold flex items-center gap-1">
                          <Activity className="w-3 h-3" /> NLP Confidence
                        </span>
                        <span className="text-sm text-slate-800 dark:text-slate-200 font-bold">
                          {ev.confidence_score ? `${ev.confidence_score}/10` : 'Unrated'}
                        </span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3" /> Sys Severity
                        </span>
                        <div className="flex items-center justify-between pr-2">
                          <span className={`text-sm font-bold ${ev.severity_score >= 8 ? 'text-danger' : 'text-slate-700 dark:text-slate-300'}`}>
                            {ev.severity_score}/10
                          </span>
                          <a 
                            href={ev.source_url} 
                            target="_blank" 
                            rel="noreferrer" 
                            onClick={(e) => e.stopPropagation()}
                            className="text-[10px] text-primary hover:text-blue-500 dark:hover:text-blue-400 flex items-center gap-1 font-bold bg-white dark:bg-panel px-2 py-1 rounded border border-slate-200 dark:border-slate-600 transition-colors"
                          >
                            Source <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
