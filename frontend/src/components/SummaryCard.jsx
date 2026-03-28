import { Info } from 'lucide-react';

export default function SummaryCard({
  title,
  value,
  icon: Icon,
  tooltipContent,
  onClick,
  isActive,
  colorClass = "text-primary",
  tooltipAlign = "left-0",
  isClickable = true
}) {
  
  // Base classes for the card body
  let cardClasses = "rounded-xl p-5 shadow-sm transition-all duration-200 border relative hover:z-50 ";
  
  if (isClickable) {
    cardClasses += "cursor-pointer hover:-translate-y-1 hover:shadow-md active:scale-95 ";
  } else {
    cardClasses += "cursor-default ";
  }

  // Active state styling
  if (isActive) {
    cardClasses += "bg-slate-50 dark:bg-slate-800/80 border-primary dark:border-primary";
  } else {
    cardClasses += "bg-white dark:bg-panel border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500";
  }

  return (
    <div onClick={isClickable ? onClick : undefined} className={cardClasses}>
      
      {/* HEADER & TOOLTIP */}
      <div className={`flex items-center gap-1.5 ${colorClass} mb-2 font-semibold text-sm relative group w-max`}>
        <Icon className="w-4 h-4 shrink-0" /> 
        <span className="whitespace-nowrap">{title}</span>
        <Info className={`w-3 h-3 text-slate-400 group-hover:${colorClass} transition-colors cursor-help ml-1`} />
        
        {/* The Dropdown Tooltip */}
        <div className={`absolute top-full ${tooltipAlign} mt-2 w-64 p-4 bg-slate-800 dark:bg-slate-900 text-slate-200 text-xs rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50 text-left font-normal border border-slate-700`}>
          {tooltipContent}
        </div>
      </div>
      
      {/* THE VALUE */}
      <div 
        className={`text-3xl font-black ${colorClass === 'text-danger' ? 'text-danger' : 'text-slate-800 dark:text-white'} truncate`} 
        title={typeof value === 'string' ? value : undefined}
      >
        {value}
      </div>
      
    </div>
  );
}