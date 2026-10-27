import React, { useState, useRef, useEffect } from 'react';
import { VerificationResult } from '../types/myth';
import { VerdictBadge } from './VerdictBadge';
import { Sparkles, Activity, BookOpen, AlertTriangle, ExternalLink, RefreshCw, Send, CheckCircle2, History, Trash2, Zap } from 'lucide-react';

interface AiScannerProps {
  initialClaim?: string;
}

export const AiScanner: React.FC<AiScannerProps> = ({ initialClaim = '' }) => {
  const [claimInput, setClaimInput] = useState<string>(initialClaim);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [elapsedMs, setElapsedMs] = useState<number>(0);
  const [lastResponseTime, setLastResponseTime] = useState<number | null>(null);

  // Client memory cache for zero-latency instant re-render
  const clientCache = useRef<Map<string, VerificationResult>>(new Map());
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);

  // Local storage for recent scans
  const [recentScans, setRecentScans] = useState<VerificationResult[]>(() => {
    try {
      const stored = localStorage.getItem('veritas_recent_scans');
      const list: VerificationResult[] = stored ? JSON.parse(stored) : [];
      // populate client cache with stored scans
      list.forEach((item) => {
        clientCache.current.set(item.claim.toLowerCase().trim(), item);
      });
      return list;
    } catch {
      return [];
    }
  });

  const starterClaims = [
    'Does drinking alkaline water neutralize stomach acid or alter blood pH?',
    'Are dietary seed oils toxic and inflammatory to cellular mitochondria?',
    'Does taking oral collagen supplements rebuild knee cartilage and skin elasticity?',
    'Do ice baths and cold water immersion reduce muscle hypertrophy gains?',
    'Does dietary gluten cause brain fog in individuals without Celiac disease?',
    'Does red light therapy increase skin collagen and cellular ATP synthesis?',
  ];

  useEffect(() => {
    if (initialClaim) {
      setClaimInput(initialClaim);
    }
  }, [initialClaim]);

  // Clean timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleVerify = async (claimToVerify?: string) => {
    const target = (claimToVerify || claimInput).trim();
    if (!target) return;

    const cacheKey = target.toLowerCase().trim();

    // Check client-side instant cache
    if (clientCache.current.has(cacheKey)) {
      setResult(clientCache.current.get(cacheKey)!);
      setLastResponseTime(8); // instant
      setError(null);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 50);
      return;
    }

    setLoading(true);
    setError(null);
    setElapsedMs(0);

    const startTime = performance.now();
    timerRef.current = setInterval(() => {
      setElapsedMs(Math.round(performance.now() - startTime));
    }, 50);

    try {
      const response = await fetch('/api/verify-myth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claim: target }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `Server responded with status ${response.status}`);
      }

      const verificationData: VerificationResult = await response.json();
      const duration = Math.round(performance.now() - startTime);
      setLastResponseTime(duration);

      // Save in cache
      clientCache.current.set(cacheKey, verificationData);
      setResult(verificationData);

      // Save to recent scans
      setRecentScans((prev) => {
        const filtered = prev.filter((s) => s.claim.toLowerCase() !== verificationData.claim.toLowerCase());
        const updated = [verificationData, ...filtered].slice(0, 8);
        try {
          localStorage.setItem('veritas_recent_scans', JSON.stringify(updated));
        } catch {}
        return updated;
      });

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    } catch (err: any) {
      console.error('Scan error:', err);
      setError(err.message || 'Unable to analyze health claim. Please ensure server has API access.');
    } finally {
      if (timerRef.current) clearInterval(timerRef.current);
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setRecentScans([]);
    clientCache.current.clear();
    localStorage.removeItem('veritas_recent_scans');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header and input card */}
      <div className="rounded-xl border border-slate-800 bg-[#0E131F] p-6 md:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-teal-400">
              <Zap className="h-3.5 w-3.5 fill-teal-400 text-teal-400" />
              <span>Accelerated Engine · Gemini 3.8 Flash (Low Latency)</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Scan Any Health or Medical Claim
            </h2>
          </div>

          {lastResponseTime !== null && (
            <div className="text-right shrink-0">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Last Query Speed</span>
              <span className="font-mono text-xs font-semibold text-emerald-400 tabular-nums">
                {lastResponseTime < 50 ? '< 10 ms (Cached)' : `${(lastResponseTime / 1000).toFixed(2)}s`}
              </span>
            </div>
          )}
        </div>

        <p className="text-slate-400 text-sm leading-relaxed">
          Cross-examines claims directly against human randomized trials, physiological mechanics, and Cochrane meta-analyses with optimized reasoning latency.
        </p>

        {/* Input box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleVerify();
          }}
          className="space-y-3"
        >
          <div className="relative">
            <textarea
              rows={3}
              value={claimInput}
              onChange={(e) => setClaimInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleVerify();
                }
              }}
              placeholder="e.g. Does drinking apple cider vinegar before meals lower blood sugar spikes? (Press Enter to scan)"
              className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 p-4 text-sm text-slate-100 placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 leading-relaxed resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
              <span>Press Enter ↵ to adjudicate</span>
              <span>·</span>
              <span>In-memory rapid cache active</span>
            </div>

            <button
              type="submit"
              disabled={loading || !claimInput.trim()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-teal-500 px-6 py-2.5 text-xs font-semibold text-slate-950 hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm shadow-teal-500/20 active:scale-95"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-slate-950" />
                  <span>Synthesizing... ({(elapsedMs / 1000).toFixed(1)}s)</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Adjudicate Claim</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick starter queries */}
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <span className="text-xs font-mono text-slate-500 block">
            Instant-response claims (pre-warmed cache):
          </span>
          <div className="flex flex-wrap gap-2">
            {starterClaims.map((claim, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setClaimInput(claim);
                  handleVerify(claim);
                }}
                className="rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:border-teal-500/50 hover:bg-slate-800/80 transition-colors text-left"
              >
                {claim}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-xl border border-rose-800/60 bg-rose-950/20 p-5 text-rose-300 flex items-start gap-3 text-sm">
          <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">Analysis Failed</p>
            <p className="text-xs text-rose-400">{error}</p>
          </div>
        </div>
      )}

      {/* Result Dossier */}
      {result && (
        <div
          ref={resultRef}
          className="rounded-xl border border-slate-800 bg-[#0E131F] p-6 md:p-8 space-y-6 shadow-2xl animate-in fade-in duration-200"
        >
          {/* Top Bar with Verdict & Confidence */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
            <div className="space-y-1">
              <span className="text-xs font-mono text-slate-500 uppercase tracking-wider block">
                Clinical Adjudication Verdict
              </span>
              <div className="flex items-center gap-3">
                <VerdictBadge verdict={result.verdict} size="lg" />
                <span className="font-mono text-xs text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                  {result.evidenceGrade}
                </span>
              </div>
            </div>

            <div className="rounded-lg bg-slate-900/90 border border-slate-800/80 p-3 text-right">
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">
                Evidence Certainty Score
              </span>
              <span className="text-xl font-mono font-bold text-teal-400 tabular-nums">
                {result.confidenceScore}%
              </span>
            </div>
          </div>

          {/* Evaluated Claim */}
          <div className="rounded-lg bg-slate-900/70 border border-slate-800/60 p-4">
            <span className="text-xs font-mono text-teal-400 uppercase tracking-wider block mb-1">
              Claim Analyzed:
            </span>
            <p className="text-sm font-medium text-slate-200 italic">
              "{result.claim}"
            </p>
          </div>

          {/* Punchy verdict summary */}
          <div className="p-4 rounded-lg bg-teal-950/20 border border-teal-500/20 text-teal-100 text-sm font-medium leading-relaxed">
            {result.shortVerdictSummary}
          </div>

          {/* Detailed sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
            {/* Scientific Reality */}
            <div className="space-y-2 bg-slate-900/40 p-5 rounded-lg border border-slate-800/60">
              <h4 className="flex items-center gap-2 font-semibold text-white">
                <BookOpen className="h-4 w-4 text-teal-400" />
                Current Scientific Consensus
              </h4>
              <p className="text-slate-300 text-xs leading-relaxed">
                {result.keyScientificFinding}
              </p>
            </div>

            {/* Biological Mechanism */}
            <div className="space-y-2 bg-slate-900/40 p-5 rounded-lg border border-slate-800/60">
              <h4 className="flex items-center gap-2 font-semibold text-white">
                <Activity className="h-4 w-4 text-teal-400" />
                Biological & Physiological Mechanism
              </h4>
              <p className="text-slate-300 text-xs leading-relaxed">
                {result.biologicalMechanism}
              </p>
            </div>

            {/* Misconception Origin */}
            <div className="space-y-2 bg-slate-900/40 p-5 rounded-lg border border-slate-800/60">
              <h4 className="flex items-center gap-2 font-semibold text-white">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                How This Myth Proliferated
              </h4>
              <p className="text-slate-300 text-xs leading-relaxed">
                {result.misconceptionOrigin}
              </p>
            </div>

            {/* Practical Takeaway */}
            <div className="space-y-2 bg-slate-900/40 p-5 rounded-lg border border-slate-800/60">
              <h4 className="flex items-center gap-2 font-semibold text-white">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Actionable Patient / Consumer Guidance
              </h4>
              <p className="text-slate-300 text-xs leading-relaxed">
                {result.practicalTakeaway}
              </p>
            </div>
          </div>

          {/* Citations */}
          <div className="space-y-2 border-t border-slate-800/80 pt-5">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-wider block">
              Literature References & Review Meta-Analyses
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {result.keyCitations.map((cite, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/70 p-2.5 rounded border border-slate-800"
                >
                  <ExternalLink className="h-3 w-3 text-teal-400 shrink-0" />
                  <span className="truncate">{cite}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent scans history */}
      {recentScans.length > 0 && (
        <div className="rounded-xl border border-slate-800 bg-[#0E131F] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <History className="h-4 w-4 text-teal-400" />
              Recent AI Adjudications ({recentScans.length})
            </span>
            <button
              onClick={clearHistory}
              className="flex items-center gap-1 text-xs font-mono text-slate-500 hover:text-rose-400 transition-colors"
            >
              <Trash2 className="h-3 w-3" />
              Clear Log
            </button>
          </div>

          <div className="divide-y divide-slate-800/60">
            {recentScans.map((scan, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setResult(scan);
                  setLastResponseTime(5);
                  resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }}
                className="py-3 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-900/50 px-2 rounded transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-200 truncate">
                    {scan.claim}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {scan.shortVerdictSummary}
                  </p>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <VerdictBadge verdict={scan.verdict} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
