import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';

export default function TrendView({ events }) {
  // Process data for the chart
  const timelineData = events.reduce((acc, event) => {
    if (!event.event_datetime_utc) return acc;
    
    // Group by hour
    const dateObj = parseISO(event.event_datetime_utc);
    const timeKey = format(dateObj, 'MMM dd - HH:00');
    
    if (!acc[timeKey]) {
      acc[timeKey] = { time: timeKey, LowMedium: 0, High: 0 };
    }
    
    if (event.severity_score >= 8) {
      acc[timeKey].High += 1;
    } else {
      acc[timeKey].LowMedium += 1;
    }
    
    return acc;
  }, {});

  const chartData = Object.values(timelineData).reverse();

  return (
    <div className="bg-white dark:bg-panel rounded-xl border border-slate-200 dark:border-slate-700 p-5 flex flex-col h-full max-h-[800px] shadow-sm dark:shadow-none transition-colors">
      
      {/* 1. HEADER & HTML LEGEND (Totally immune to Recharts layout bugs) */}
      <div className="flex flex-col gap-3 mb-2">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Incident Volume & Severity Trend</h2>
        
        {/* Bulletproof Tailwind Legend */}
        <div className="flex flex-row items-center gap-5">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-sm bg-[#ef4444] shrink-0 shadow-sm"></div>
            <span className="text-xs font-bold text-[#ef4444] whitespace-nowrap">High Severity (8-10)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-sm bg-[#3b82f6] shrink-0 shadow-sm"></div>
            <span className="text-xs font-bold text-[#3b82f6] whitespace-nowrap">Low/Med Severity (1-7)</span>
          </div>
        </div>
      </div>
      
      {/* 2. THE CHART */}
      <div className="flex-grow min-h-[300px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          {/* We keep the left: -20 here so the Y-axis is flush, but it won't affect the legend anymore! */}
          <BarChart data={chartData} margin={{ top: 0, right: 10, left: -20, bottom: 60 }}>
            <XAxis 
              dataKey="time" 
              angle={-45} 
              textAnchor="end" 
              tick={{ fill: '#64748b', fontSize: 12 }} 
              tickMargin={10} 
            />
            
            <YAxis 
              allowDecimals={false} 
              tick={{ fill: '#64748b', fontSize: 12 }} 
            />
            
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
              itemStyle={{ color: '#f8fafc' }}
              cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
            />
            
            {/* The Bars */}
            <Bar dataKey="High" stackId="a" fill="#ef4444" name="High Severity" />
            <Bar dataKey="LowMedium" stackId="a" fill="#3b82f6" name="Low/Med Severity" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}