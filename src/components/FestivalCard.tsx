import { MapPin, Calendar } from "lucide-react";
import type { FestivalItem } from "../types";

interface FestivalCardProps {
  festival: FestivalItem;
  onClick: (festival: FestivalItem) => void;
}

export function FestivalCard({ festival, onClick }: FestivalCardProps) {
  return (
    <button 
      onClick={() => onClick(festival)}
      className="group relative flex flex-col bg-[#0F0F0F] rounded-2xl overflow-hidden text-left w-full h-full border border-neutral-800 hover:border-blue-500/50 hover:bg-[#151515] transition-all duration-300"
    >
      <div className="relative h-48 w-full overflow-hidden bg-neutral-900 border-b border-neutral-800">
        <img 
          src={festival.MAIN_IMG_THUMB || festival.MAIN_IMG_NORMAL || "/api/placeholder/400/300"} 
          alt={festival.MAIN_TITLE}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 bg-neutral-900/90 backdrop-blur text-blue-400 px-3 py-1 rounded border border-neutral-800/50 text-xs font-semibold uppercase tracking-wider">
          {festival.GUGUN_NM || "부산"}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-neutral-100 leading-snug line-clamp-2 mb-2 group-hover:text-blue-400 transition-colors">
          {festival.MAIN_TITLE}
        </h3>
        
        {festival.SUBTITLE && (
          <p className="text-xs text-neutral-500 mb-4 line-clamp-1 uppercase tracking-wide">
            {festival.SUBTITLE}
          </p>
        )}
        
        <div className="mt-auto space-y-2">
          {festival.USAGE_DAY_WEEK_AND_TIME && (
            <div className="flex items-center text-xs text-neutral-400 gap-2">
              <Calendar className="w-3.5 h-3.5 text-blue-500/70" />
              <span className="line-clamp-1 font-mono tracking-tight">{festival.USAGE_DAY_WEEK_AND_TIME}</span>
            </div>
          )}
          
          {(festival.MAIN_PLACE || festival.PLACE) && (
            <div className="flex items-center text-xs text-neutral-400 gap-2">
              <MapPin className="w-3.5 h-3.5 text-blue-500/70" />
              <span className="line-clamp-1">{festival.MAIN_PLACE || festival.PLACE}</span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
