import React from 'react';
import { ArrowRight, Sparkles, BookOpen, BrainCircuit } from 'lucide-react';

interface HeroSectionProps {
  onExplore: () => void;
  onOpenScanner: () => void;
  onOpenQuiz: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExplore,
  onOpenScanner,
  onOpenQuiz,
}) => {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#0E131F] p-6 md:p-10 mb-8 shadow-2xl">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-72 w-72 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column: Editorial Headline & Value */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-teal-400">
              <span className="flex h-2 w-2 rounded-full bg-teal-400" />
              <span>Evidence-Based Biomedical Adjudication</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15] text-balance">
              Dismantling Wellness Folklore with Clinical Evidence.
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
              From viral social media diets to multi-generational old wives' tales, health misinformation spreads 6× faster than medical reality. Veritas cross-examines claims directly against human randomized trials and biological mechanics.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onExplore}
              className="flex items-center gap-2 rounded-lg bg-teal-500 px-5 py-2.5 text-xs font-semibold text-slate-950 hover:bg-teal-400 transition-colors shadow-sm shadow-teal-500/20"
            >
              <BookOpen className="h-4 w-4" />
              <span>Browse 16+ Clinical Myths</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={onOpenScanner}
              className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Sparkles className="h-4 w-4 text-teal-400" />
              <span>Scan Custom Health Claim</span>
            </button>

            <button
              onClick={onOpenQuiz}
              className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
            >
              <BrainCircuit className="h-4 w-4 text-amber-400" />
              <span>Truth vs. Myth Quiz</span>
            </button>
          </div>

          {/* KPI Strip */}
          <div className="grid grid-cols-3 gap-4 border-t border-slate-800/80 pt-6 text-xs font-mono">
            <div>
              <span className="text-slate-500 block uppercase text-[10px]">Verified Myths</span>
              <span className="text-lg font-bold text-white tabular-nums">16 Dossiers</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase text-[10px]">Clinical Rigor</span>
              <span className="text-lg font-bold text-teal-400 tabular-nums">Grade A/B</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase text-[10px]">Scanner Engine</span>
              <span className="text-lg font-bold text-white tabular-nums">Gemini 3.8</span>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Visual Image Card */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          <div className="relative w-full h-64 sm:h-80 lg:h-full min-h-[280px] rounded-xl overflow-hidden border border-slate-800 shadow-xl group">
            <img
              src="/src/assets/images/clinical_research_hero_1793102379249.jpg"
              alt="Clinical Biomedical Research Laboratory with diagnostic screens"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            {/* Measured contrast scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17]/90 via-[#0B0F17]/30 to-transparent" />

            {/* In-image caption / pill-free evidence tag */}
            <div className="absolute bottom-4 left-4 right-4 text-xs">
              <span className="font-mono text-teal-400 block text-[11px] uppercase tracking-wider mb-0.5">
                Lab Review · Systematic Synthesis
              </span>
              <p className="text-slate-200 font-medium">
                Real-time literature verification backed by clinical RCTs and physiology.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
