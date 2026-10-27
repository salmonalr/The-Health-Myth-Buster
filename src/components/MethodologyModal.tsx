import React from 'react';
import { X, CheckCircle2, AlertCircle, HelpCircle, XCircle } from 'lucide-react';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-slate-800 bg-[#0E131F] p-6 md:p-8 text-slate-100 shadow-2xl space-y-6"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Clinical Evidence Hierarchy & Methodology</h3>
            <p className="text-xs text-slate-400">How Veritas adjudicates health and medical claims</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-700/60 p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Verdict Definitions */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono text-teal-400 uppercase tracking-wider">
            Verdict Standards
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="rounded-lg border border-rose-500/30 bg-rose-950/20 p-3 space-y-1">
              <span className="flex items-center gap-1.5 font-bold text-rose-400">
                <XCircle className="h-4 w-4" /> BUSTED
              </span>
              <p className="text-slate-300">
                Directly contradicted by reproducible human randomized controlled trials (RCTs) or established physiological laws.
              </p>
            </div>

            <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-3 space-y-1">
              <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                <CheckCircle2 className="h-4 w-4" /> CONFIRMED
              </span>
              <p className="text-slate-300">
                Substantiated by robust systematic reviews, meta-analyses, and peer-reviewed clinical guidelines.
              </p>
            </div>

            <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-3 space-y-1">
              <span className="flex items-center gap-1.5 font-bold text-amber-400">
                <AlertCircle className="h-4 w-4" /> NUANCED
              </span>
              <p className="text-slate-300">
                Contains an element of physiological truth, but is distorted, overstated, or only valid under specific clinical conditions.
              </p>
            </div>

            <div className="rounded-lg border border-cyan-500/30 bg-cyan-950/20 p-3 space-y-1">
              <span className="flex items-center gap-1.5 font-bold text-cyan-400">
                <HelpCircle className="h-4 w-4" /> PLAUSIBLE
              </span>
              <p className="text-slate-300">
                Has biological mechanistic plausibility in early phase or animal studies, but awaits definitive large-scale human verification.
              </p>
            </div>
          </div>
        </div>

        {/* Evidence Tiers */}
        <div className="space-y-3 border-t border-slate-800/80 pt-4">
          <h4 className="text-xs font-mono text-teal-400 uppercase tracking-wider">
            Evidence Quality Grading
          </h4>
          <div className="space-y-2.5 text-xs text-slate-300">
            <div className="rounded-lg bg-slate-900/60 p-3 border border-slate-800">
              <span className="font-mono font-bold text-teal-300 block mb-0.5">
                Grade A · High Certainty
              </span>
              <p>
                Cochrane Systematic Reviews, PRISMA meta-analyses, and double-blinded randomized placebo-controlled trials with sample sizes &gt; 500.
              </p>
            </div>

            <div className="rounded-lg bg-slate-900/60 p-3 border border-slate-800">
              <span className="font-mono font-bold text-teal-300 block mb-0.5">
                Grade B · Moderate Certainty
              </span>
              <p>
                Longitudinal prospective cohort studies (e.g., Framingham, Nurses' Health Study), controlled case studies, and well-designed cross-sectional surveys.
              </p>
            </div>

            <div className="rounded-lg bg-slate-900/60 p-3 border border-slate-800">
              <span className="font-mono font-bold text-teal-300 block mb-0.5">
                Grade C · Preliminary Certainty
              </span>
              <p>
                In-vitro cell culture assays, murine/porcine animal models, mechanistic hypotheses, or clinical consensus statements.
              </p>
            </div>
          </div>
        </div>

        {/* Medical Disclaimer */}
        <div className="rounded-lg bg-slate-950/80 border border-slate-800 p-3.5 text-[11px] text-slate-400 leading-relaxed">
          <span className="font-semibold text-slate-300 block mb-1">Clinical Disclaimer:</span>
          Veritas is an educational and scientific synthesis resource. Content is not individualized medical advice, clinical diagnosis, or treatment prescription. Always consult a licensed medical physician for personal diagnostic concerns.
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
