import { Calendar, MapPin, Phone, Globe, Info, Clock, Bus } from "lucide-react";
import type { FestivalItem } from "../types";

interface FestivalDetailProps {
  festival: FestivalItem;
  onClose: () => void;
}

export function FestivalDetail({ festival, onClose }: FestivalDetailProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm sm:p-6">
      <div 
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-[#0A0A0A] border border-neutral-800 rounded-2xl shadow-2xl flex flex-col md:flex-row"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-neutral-900/80 border border-neutral-700 text-neutral-300 hover:bg-blue-600 hover:text-white transition-colors"
          aria-label="Close"
        >
          <span className="text-xl leading-none">&times;</span>
        </button>

        <div className="md:w-5/12 relative bg-neutral-900 flex-shrink-0 border-r border-neutral-800">
          <img
            src={festival.MAIN_IMG_NORMAL || "/api/placeholder/400/600"}
            alt={festival.MAIN_TITLE}
            className="w-full h-80 md:h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent z-10 md:bg-none md:bg-gradient-to-r md:from-transparent md:to-[#0A0A0A]/20"></div>
          
          <div className="absolute bottom-6 left-6 z-20 md:hidden">
            <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full uppercase tracking-widest mb-3 inline-block">Featured</span>
            <h2 className="text-2xl font-bold text-white tracking-tight">{festival.MAIN_TITLE}</h2>
          </div>
        </div>

        <div className="p-6 md:p-10 md:w-7/12 flex flex-col gap-8">
          <div className="hidden md:block">
            <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full uppercase tracking-widest mb-3 inline-block">Featured</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight mb-2 leading-tight">
              {festival.MAIN_TITLE}
            </h2>
            <p className="text-lg text-neutral-400 font-medium tracking-wide">
              {festival.TITLE || festival.SUBTITLE}
            </p>
          </div>

          <div className="space-y-8">
            <div>
              <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-3">Description</h4>
              <div className="text-neutral-300 leading-relaxed text-sm whitespace-pre-line bg-neutral-900/50 p-5 rounded-xl border border-neutral-800/50">
                {festival.ITEMCNTNTS?.trim() || "상세 정보가 없습니다."}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-900/20 to-neutral-900 border border-blue-500/20">
              <h4 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-4">Information</h4>
              <ul className="space-y-4 text-sm">
                {festival.USAGE_DAY_WEEK_AND_TIME && (
                  <li className="flex gap-4">
                    <span className="text-neutral-500 w-24 shrink-0 flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Duration</span>
                    <span className="text-neutral-200 font-medium font-mono">{festival.USAGE_DAY_WEEK_AND_TIME}</span>
                  </li>
                )}
                
                {(festival.MAIN_PLACE || festival.PLACE) && (
                  <li className="flex gap-4">
                    <span className="text-neutral-500 w-24 shrink-0 flex items-center gap-1.5"><MapPin className="w-4 h-4" /> Location</span>
                    <span className="text-neutral-200 font-medium">{festival.MAIN_PLACE || festival.PLACE}</span>
                  </li>
                )}

                {festival.TRFC_INFO && (
                  <li className="flex gap-4">
                    <span className="text-neutral-500 w-24 shrink-0 flex items-center gap-1.5"><Bus className="w-4 h-4" /> Transit</span>
                    <span className="text-neutral-200">{festival.TRFC_INFO}</span>
                  </li>
                )}

                {festival.CNTCT_TEL && (
                  <li className="flex gap-4">
                    <span className="text-neutral-500 w-24 shrink-0 flex items-center gap-1.5"><Phone className="w-4 h-4" /> Contact</span>
                    <span className="text-neutral-200 font-mono">{festival.CNTCT_TEL}</span>
                  </li>
                )}

                {festival.HOMEPAGE_URL && (
                  <li className="flex gap-4">
                    <span className="text-neutral-500 w-24 shrink-0 flex items-center gap-1.5"><Globe className="w-4 h-4" /> Website</span>
                    <a 
                      href={festival.HOMEPAGE_URL} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 transition-colors truncate block"
                    >
                      {festival.HOMEPAGE_URL}
                    </a>
                  </li>
                )}
              </ul>
              
              {festival.HOMEPAGE_URL && (
                <a 
                  href={festival.HOMEPAGE_URL} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block w-full text-center mt-6 py-3 bg-blue-600/90 hover:bg-blue-500 text-white font-bold rounded-lg transition-all text-xs uppercase tracking-widest"
                >
                  Visit Website
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
