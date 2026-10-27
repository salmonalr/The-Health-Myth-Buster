import React, { useState, useMemo } from 'react';
import { HealthMyth, MythCategory, Verdict } from '../types/myth';
import { VerdictBadge } from './VerdictBadge';
import { Search, Bookmark, BookmarkCheck, ArrowUpRight, Filter, Sparkles } from 'lucide-react';

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

  const categories: (MythCategory | 'All')[] = [
    'All',
    'Nutrition',
    'Fitness',
    'Immunity & Illness',
    'Medicine & Drugs',
  ];

  const verdicts: (Verdict | 'All')[] = ['All', 'BUSTED', 'CONFIRMED', 'NUANCED'];

  const filteredMyths = useMemo(() => {
    return myths.filter((myth) => {
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
  }, [myths, selectedCategory, selectedVerdict, searchQuery, onlyBookmarks, bookmarks]);

  return (
    <div className="space-y-6">
      {/* Search and Filter Strip */}
      <div className="rounded-xl border border-slate-800 bg-[#0E131F] p-4 md:p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search claims, symptoms, physiology (e.g. coffee, water, carbs, cold)..."
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

          <button
            onClick={() => setOnlyBookmarks(!onlyBookmarks)}
            className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-xs font-medium transition-colors ${
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

        {/* Categories segmented controls */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs font-mono text-slate-500 mr-2 flex items-center gap-1">
            <Filter className="h-3 w-3" /> Topic:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === cat
                  ? 'bg-teal-500 text-slate-950 font-semibold shadow-sm'
                  : 'bg-slate-900/90 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Verdict filter tabs */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-800/60">
          <span className="text-xs font-mono text-slate-500 mr-2">Verdict:</span>
          {verdicts.map((v) => (
            <button
              key={v}
              onClick={() => setSelectedVerdict(v)}
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
        <span>Showing {filteredMyths.length} documented claims</span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMyths.map((myth) => {
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
      )}
    </div>
  );
};
