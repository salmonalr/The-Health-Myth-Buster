import React from 'react';
import { HealthMyth } from '../types/myth';
import { VerdictBadge } from './VerdictBadge';
import { X, Bookmark, BookmarkCheck, ExternalLink, Activity, BookOpen, Clock, Users } from 'lucide-react';

interface MythModalProps {
  myth: HealthMyth | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
}

export const MythModal: React.FC<MythModalProps> = ({
  myth,
  onClose,
  isBookmarked,
  onToggleBookmark,
}) => {
  if (!myth) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-slate-800 bg-[#0E131F] p-6 md:p-8 text-slate-100 shadow-2xl shadow-teal-950/20"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header controls */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="font-semibold text-teal-400 uppercase tracking-wider">{myth.category}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 font-mono text-slate-400">
              <Clock className="h-3.5 w-3.5" />
              {myth.readTime}
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 font-mono text-slate-400">
              <Users className="h-3.5 w-3.5" />
              {myth.popularBeliefRate}% belief rate
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleBookmark(myth.id)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700/60 bg-slate-800/50 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark this myth'}
            >
              {isBookmarked ? (
                <>
                  <BookmarkCheck className="h-3.5 w-3.5 text-teal-400" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <Bookmark className="h-3.5 w-3.5" />
                  <span>Save</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="rounded-lg border border-slate-700/60 p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Title and Claim */}
        <div className="space-y-3 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <VerdictBadge verdict={myth.verdict} size="lg" />
            <span className="text-xs font-mono text-slate-400 border border-slate-800 rounded px-2 py-1 bg-slate-900/60">
              {myth.evidenceGrade}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            {myth.title}
          </h2>
          <div className="rounded-lg bg-slate-900/80 border border-slate-800 p-4 text-sm text-slate-300">
            <span className="text-xs font-mono text-teal-400 uppercase tracking-wider block mb-1">The Popular Claim:</span>
            <p className="italic">"{myth.claim}"</p>
          </div>
        </div>

        {/* Deep Dive Sections */}
        <div className="space-y-6 text-sm">
          {/* Scientific Reality */}
          <div className="space-y-2">
            <h3 className="flex items-center gap-2 text-base font-semibold text-white">
              <BookOpen className="h-4 w-4 text-teal-400" />
              The Scientific Reality
            </h3>
            <p className="text-slate-300 leading-relaxed bg-slate-900/40 p-4 rounded-lg border border-slate-800/60">
              {myth.scientificReality}
            </p>
          </div>

          {/* Biological Mechanism */}
          <div className="space-y-2">
            <h3 className="flex items-center gap-2 text-base font-semibold text-white">
              <Activity className="h-4 w-4 text-teal-400" />
              Physiological & Biological Mechanism
            </h3>
            <p className="text-slate-300 leading-relaxed bg-slate-900/40 p-4 rounded-lg border border-slate-800/60">
              {myth.biologicalMechanism}
            </p>
          </div>

          {/* Misconception Origin */}
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-white">Historical Origin & Proliferation</h3>
            <p className="text-slate-300 leading-relaxed bg-slate-900/40 p-4 rounded-lg border border-slate-800/60">
              {myth.commonOrigin}
            </p>
          </div>

          {/* Citations */}
          <div className="space-y-2 border-t border-slate-800/80 pt-5">
            <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Peer-Reviewed Evidence & Clinical Citations
            </h3>
            <ul className="space-y-2">
              {myth.citations.map((citation, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-xs font-mono text-slate-400 bg-slate-950/60 p-2.5 rounded border border-slate-800/60"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-teal-400 shrink-0 mt-0.5" />
                  <span>{citation}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
