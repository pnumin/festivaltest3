import { Calendar, MapPin, Phone, Globe, Info, Clock, Bus, Sparkles, Loader2, X } from "lucide-react";
import type { FestivalItem } from "../types";
import { useState } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";

interface FestivalDetailProps {
  festival: FestivalItem;
  onClose: () => void;
}

export function FestivalDetail({ festival, onClose }: FestivalDetailProps) {
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [travelPlan, setTravelPlan] = useState<string | null>(null);
  const [planError, setPlanError] = useState<string | null>(null);
  const [showPlanModal, setShowPlanModal] = useState(false);

  const generateTravelPlan = async () => {
    setShowPlanModal(true);
    if (travelPlan || planError) return;

    setLoadingPlan(true);    
    setPlanError(null);
    try {
      const response = await fetch("/api/travelPlan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ festival }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to generate travel plan");
      }
      
      const data = await response.json();
      setTravelPlan(data.plan);
    } catch (err: any) {
      setPlanError(err.message || "여행 계획을 가져오는데 실패했습니다.");
    } finally {
      setLoadingPlan(false);
    }
  };

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
            className="w-full h-80 md:h-full object-cover md:sticky md:top-0"
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
              
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                {festival.HOMEPAGE_URL && (
                  <a 
                    href={festival.HOMEPAGE_URL} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex-1 block text-center py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-lg transition-all text-xs uppercase tracking-widest border border-neutral-700"
                  >
                    Visit Website
                  </a>
                )}
                <button
                  onClick={generateTravelPlan}
                  disabled={loadingPlan && !showPlanModal}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600/90 hover:bg-blue-500 text-white font-bold rounded-lg transition-all text-xs uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingPlan && !showPlanModal ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> 생성 중...</>
                  ) : travelPlan || planError ? (
                    <><Sparkles className="w-4 h-4" /> AI 여행계획 보기</>
                  ) : (
                    <><Sparkles className="w-4 h-4" /> AI 여행계획 세우기</>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {showPlanModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md sm:p-6 shadow-2xl">
          <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-neutral-900 border border-indigo-500/30 rounded-2xl overflow-hidden shadow-[0_0_50px_-12px_rgb(99_102_241_/_0.25)]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/50">
              <h4 className="text-lg font-bold text-indigo-400 flex items-center gap-2">
                <Sparkles className="w-5 h-5" /> AI 추천 여행 코스
              </h4>
              <button
                onClick={() => setShowPlanModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
                aria-label="Close Plan"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              {loadingPlan ? (
                <div className="flex flex-col items-center justify-center h-48 gap-4">
                  <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                  <p className="text-indigo-300 font-medium animate-pulse">최적의 여행 코스를 생성하고 있습니다...</p>
                </div>
              ) : planError ? (
                <div className="text-base text-red-400 bg-red-500/10 p-6 rounded-xl border border-red-500/20 text-center">
                  {planError}
                </div>
              ) : (
                <div className="prose prose-invert prose-indigo max-w-none prose-headings:text-indigo-300 prose-a:text-blue-400 prose-li:my-1 text-neutral-200">
                  <Markdown rehypePlugins={[rehypeRaw]}>{travelPlan || ""}</Markdown>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
