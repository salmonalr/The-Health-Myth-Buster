import React, { useState, useMemo } from 'react';
import { HealthMyth, MythCategory, Verdict } from '../types/myth';
import { VerdictBadge } from './VerdictBadge';
import { Search, Bookmark, BookmarkCheck, ArrowUpRight, Filter, Sparkles, ChevronDown } from 'lucide-react';

interface MythExplorerProps {
  myths: HealthMyth[];
  onSelectMyth: (myth: HealthMyth) => void;
  bookmarks: string[];
  onToggleBookmark: (id: string) => void;
  onNavigateToScanner: (suggestedClaim?: string) => void;
}

export const MythExplorer: React.FC<MythExplorerProps> = ({
  myths,
  onSelectMyth,
  bookmarks,
  onToggleBookmark,
  onNavigateToScanner,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedVerdict, setSelectedVerdict] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyBookmarks, setOnlyBookmarks] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'belief' | 'az' | 'readTime'>('belief');
  const [visibleCount, setVisibleCount] = useState<number>(18);

  const categories: (MythCategory | 'All')[] = [
    'All',
    'Nutrition',
    'Fitness',
    'Immunity & Illness',
    'Sleep & Recovery',
    'Medicine & Drugs',
  ];

  const verdicts: (Verdict | 'All')[] = ['All', 'BUSTED', 'CONFIRMED', 'NUANCED'];

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: myths.length };
    myths.forEach((m) => {
      counts[m.category] = (counts[m.category] || 0) + 1;
    });
    return counts;
  }, [myths]);

  const filteredMyths = useMemo(() => {
    const list = myths.filter((myth) => {
      // Category filter
      if (selectedCategory !== 'All' && myth.category !== selectedCategory) {
        return false;
      }
      // Verdict filter
      if (selectedVerdict !== 'All' && myth.verdict !== selectedVerdict) {
        return false;
      }
      // Bookmark filter
      if (onlyBookmarks && !bookmarks.includes(myth.id)) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = myth.title.toLowerCase().includes(q);
        const matchesClaim = myth.claim.toLowerCase().includes(q);
        const matchesSummary = myth.summary.toLowerCase().includes(q);
        const matchesMechanism = myth.biologicalMechanism.toLowerCase().includes(q);
        return matchesTitle || matchesClaim || matchesSummary || matchesMechanism;
      }
      return true;
    });

    // Sorting
    return list.sort((a, b) => {
      if (sortBy === 'belief') return (b.popularBeliefRate || 0) - (a.popularBeliefRate || 0);
      if (sortBy === 'az') return a.title.localeCompare(b.title);
      return a.readTime.localeCompare(b.readTime);
    });
  }, [myths, selectedCategory, selectedVerdict, searchQuery, onlyBookmarks, bookmarks, sortBy]);

  const displayedMyths = filteredMyths.slice(0, visibleCount);

  return (
    <div className="space-y-6">
      {/* Search and Filter Strip */}
      <div className="rounded-xl border border-slate-800 bg-[#0E131F] p-4 md:p-6 space-y-4 shadow-lg">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(18);
              }}
              placeholder="Search across 50+ claims, physiology, symptoms (e.g. coffee, salt, sleep, cold)..."
              className="w-full rounded-lg border border-slate-700/80 bg-slate-900/90 pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-lg border border-slate-700/80 bg-slate-900/80 px-3 py-2.5 text-xs text-slate-300 focus:border-teal-500 focus:outline-none"
            >
              <option value="belief">Sort: Highest Belief Rate</option>
              <option value="az">Sort: Title (A-Z)</option>
              <option value="readTime">Sort: Read Time</option>
            </select>

            <button
              onClick={() => setOnlyBookmarks(!onlyBookmarks)}
              className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                onlyBookmarks
                  ? 'border-teal-500/50 bg-teal-500/10 text-teal-300'
                  : 'border-slate-700/80 bg-slate-900/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {onlyBookmarks ? (
                <BookmarkCheck className="h-4 w-4 text-teal-400" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
              <span>Saved ({bookmarks.length})</span>
            </button>
          </div>
        </div>

        {/* Categories segmented controls with counts */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs font-mono text-slate-500 mr-2 flex items-center gap-1">
            <Filter className="h-3 w-3" /> Topic:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setVisibleCount(18);
              }}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === cat
                  ? 'bg-teal-500 text-slate-950 font-semibold shadow-sm'
                  : 'bg-slate-900/90 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat} ({categoryCounts[cat] || 0})
            </button>
          ))}
        </div>

        {/* Verdict filter tabs */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-800/60">
          <span className="text-xs font-mono text-slate-500 mr-2">Verdict:</span>
          {verdicts.map((v) => (
            <button
              key={v}
              onClick={() => {
                setSelectedVerdict(v);
                setVisibleCount(18);
              }}
              className={`rounded-md px-2.5 py-1 text-xs font-mono transition-colors ${
                selectedVerdict === v
                  ? 'bg-slate-800 text-teal-400 border border-teal-500/40 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-mono">
        <span>
          Showing {displayedMyths.length} of {filteredMyths.length} documented claims ({myths.length} total in catalog)
        </span>
        <span>Peer-reviewed clinical evidence</span>
      </div>

      {/* Cards Grid */}
      {filteredMyths.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-[#0E131F] p-12 text-center space-y-4">
          <p className="text-slate-400 text-sm">
            No health myths matched your current filter criteria.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedVerdict('All');
                setSearchQuery('');
                setOnlyBookmarks(false);
              }}
              className="text-xs text-teal-400 hover:underline"
            >
              Reset all filters
            </button>
            <span className="text-slate-600">·</span>
            <button
              onClick={() => onNavigateToScanner(searchQuery)}
              className="flex items-center gap-1 text-xs text-teal-400 hover:underline font-medium"
            >
              <Sparkles className="h-3 w-3" />
              Verify "{searchQuery}" with AI Scanner
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedMyths.map((myth) => {
              const isBookmarked = bookmarks.includes(myth.id);
              return (
                <div
                  key={myth.id}
                  className="group relative flex flex-col justify-between rounded-xl border border-slate-800/90 bg-[#0E131F] p-5 hover:border-teal-500/40 transition-all hover:shadow-lg hover:shadow-teal-950/20"
                >
                  <div>
                    {/* Clean unboxed metadata with typographic separators */}
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-teal-400 font-medium">{myth.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-slate-400">{myth.readTime}</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleBookmark(myth.id);
                        }}
                        className="text-slate-500 hover:text-teal-400 transition-colors p-1"
                        title={isBookmarked ? 'Remove bookmark' : 'Bookmark this myth'}
                      >
                        {isBookmarked ? (
                          <BookmarkCheck className="h-4 w-4 text-teal-400" />
                        ) : (
                          <Bookmark className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    {/* Verdict Badge & Title */}
                    <div className="space-y-2 mb-3">
                      <VerdictBadge verdict={myth.verdict} size="sm" />
                      <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors leading-snug">
                        {myth.title}
                      </h3>
                    </div>

                    {/* Claim quote */}
                    <p className="text-xs text-slate-400 italic mb-3 line-clamp-2">
                      "{myth.claim}"
                    </p>

                    {/* Summary */}
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-4">
                      {myth.summary}
                    </p>
                  </div>

                  {/* Card footer */}
                  <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between text-xs">
                    <div className="text-[11px] font-mono text-slate-400">
                      Belief rate: <span className="text-slate-300 font-semibold">{myth.popularBeliefRate}%</span>
                    </div>

                    <button
                      onClick={() => onSelectMyth(myth)}
                      className="flex items-center gap-1 font-medium text-teal-400 hover:text-teal-300 transition-colors"
                    >
                      <span>Read Evidence</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Load More Button if filteredMyths > visibleCount */}
          {filteredMyths.length > visibleCount && (
            <div className="flex justify-center pt-4">
              <button
                onClick={() => setVisibleCount((prev) => prev + 18)}
                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/90 px-6 py-3 text-xs font-medium text-slate-200 hover:text-white hover:border-teal-500/50 hover:bg-slate-800 transition-colors shadow-sm"
              >
                <span>Show More ({filteredMyths.length - visibleCount} remaining)</span>
                <ChevronDown className="h-4 w-4 text-teal-400" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
