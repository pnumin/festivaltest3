import { useEffect, useState, useMemo } from "react";
import { FestivalCard } from "./components/FestivalCard";
import { FestivalDetail } from "./components/FestivalDetail";
import type { FestivalItem, FestivalResponse } from "./types";
import { Loader2, CalendarHeart, Search, Calendar as CalendarIcon } from "lucide-react";

export default function App() {
  const [festivals, setFestivals] = useState<FestivalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFestival, setSelectedFestival] = useState<FestivalItem | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredFestivals = useMemo(() => {
    return festivals.filter((festival) => {
      const searchMatch =
        festival.MAIN_TITLE.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (festival.SUBTITLE && festival.SUBTITLE.toLowerCase().includes(searchTerm.toLowerCase()));

      let dateMatch = true;
      if (startDate || endDate) {
        const dateStr = festival.USAGE_DAY || festival.USAGE_DAY_WEEK_AND_TIME || "";
        const datePattern = /(?:(\d{4})\s*[년.\/-]\s*)?(\d{1,2})\s*[월.\/-]\s*(\d{1,2})/g;
        const matches = [...dateStr.matchAll(datePattern)];

        if (matches.length > 0) {
          const firstY = matches[0][1] ? parseInt(matches[0][1]) : new Date().getFullYear();
          const festStart = new Date(firstY, parseInt(matches[0][2]) - 1, parseInt(matches[0][3]));

          const lastMatch = matches[matches.length - 1];
          const lastY = lastMatch[1] ? parseInt(lastMatch[1]) : firstY;
          const festEnd = new Date(lastY, parseInt(lastMatch[2]) - 1, parseInt(lastMatch[3]));

          const filterStart = startDate ? new Date(startDate) : new Date("1970-01-01");
          const filterEnd = endDate ? new Date(endDate + "T23:59:59") : new Date("2099-12-31");

          dateMatch = festStart <= filterEnd && festEnd >= filterStart;
        } else {
          // If we can't parse the date format at all, assume it doesn't match the strict filter
          dateMatch = false;
        }
      }

      return searchMatch && dateMatch;
    });
  }, [festivals, searchTerm, startDate, endDate]);

  useEffect(() => {
    async function fetchFestivals() {
      try {
        const res = await fetch("/api/festivals?numOfRows=50");
        if (!res.ok) {
          throw new Error("Failed to fetch data from the server");
        }
        const data: FestivalResponse = await res.json();
        
        if (data?.getFestivalKr?.item) {
          setFestivals(data.getFestivalKr.item);
        } else {
          setFestivals([]);
        }
      } catch (err: any) {
        console.error("Error loading festivals:", err);
        setError(err.message || "Failed to load festivals");
      } finally {
        setLoading(false);
      }
    }

    fetchFestivals();
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-neutral-200 font-sans selection:bg-blue-500/30 flex flex-col">
      <header className="h-16 border-b border-neutral-800 bg-[#0F0F0F] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">B</span>
            </div>
            <h1 className="text-lg font-semibold tracking-tight text-neutral-100 italic">BUSAN FESTIVAL <span className="text-blue-500">HUB</span></h1>
          </div>
          <div className="hidden md:flex gap-6 text-sm text-neutral-400 items-center">
            <span className="text-blue-500 font-medium border-b border-blue-500 pb-1">Current Festivals</span>
            <span className="hover:text-neutral-200 transition-colors cursor-pointer pb-1">Schedule</span>
            <span className="hover:text-neutral-200 transition-colors cursor-pointer pb-1">Cultural Map</span>
            <div className="px-3 py-1 bg-neutral-800 rounded text-xs text-green-400 font-mono">API: Live</div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8 bg-[#0F0F0F] p-5 rounded-2xl border border-neutral-800 shadow-sm">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input 
              type="text"
              placeholder="Search festivals by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-11 pr-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-neutral-600"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-40">
              <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input 
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-11 pr-3 py-3 text-sm text-neutral-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all [color-scheme:dark]"
              />
            </div>
            <span className="text-neutral-600 font-medium">~</span>
            <div className="relative flex-1 md:w-40">
              <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input 
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-11 pr-3 py-3 text-sm text-neutral-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all [color-scheme:dark]"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            <p className="text-neutral-500 font-medium animate-pulse">Loading festival data...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center text-red-400">
            <p className="text-lg font-bold mb-2">Failed to load data</p>
            <p className="text-sm font-mono bg-neutral-900 border border-neutral-800 inline-block px-4 py-2 rounded-lg">{error}</p>
          </div>
        ) : filteredFestivals.length === 0 ? (
          <div className="bg-[#0F0F0F] rounded-2xl p-16 text-center border border-neutral-800">
            <p className="text-neutral-500 text-lg">No festivals match your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFestivals.map((festival) => (
              <FestivalCard 
                key={festival.UC_SEQ} 
                festival={festival} 
                onClick={setSelectedFestival} 
              />
            ))}
          </div>
        )}
      </main>

      <footer className="h-10 bg-[#0F0F0F] border-t border-neutral-800 flex items-center justify-between px-4 sm:px-8 text-[10px] text-neutral-500 mt-auto">
        <div className="flex gap-4">
          <span>Source: Busan Data Portal</span>
          <span className="hidden sm:inline">Update Frequency: Real-time</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span>System Online</span>
        </div>
      </footer>

      {selectedFestival && (
        <FestivalDetail 
          festival={selectedFestival} 
          onClose={() => setSelectedFestival(null)} 
        />
      )}
    </div>
  );
}
