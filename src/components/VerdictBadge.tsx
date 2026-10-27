import React from 'react';
import { Verdict } from '../types/myth';
import { CheckCircle2, XCircle, HelpCircle, AlertCircle } from 'lucide-react';

interface VerdictBadgeProps {
  verdict: Verdict;
  size?: 'sm' | 'md' | 'lg';
}

export const VerdictBadge: React.FC<VerdictBadgeProps> = ({ verdict, size = 'md' }) => {
  const getVerdictConfig = () => {
    switch (verdict) {
      case 'BUSTED':
        return {
          bg: 'bg-rose-950/40',
          border: 'border-rose-500/40',
          text: 'text-rose-400',
          label: 'BUSTED',
          icon: XCircle,
        };
      case 'CONFIRMED':
        return {
          bg: 'bg-emerald-950/40',
          border: 'border-emerald-500/40',
          text: 'text-emerald-400',
          label: 'CONFIRMED',
          icon: CheckCircle2,
        };
      case 'NUANCED':
        return {
          bg: 'bg-amber-950/40',
          border: 'border-amber-500/40',
          text: 'text-amber-400',
          label: 'NUANCED / CONTEXT-DEPENDENT',
          icon: AlertCircle,
        };
      case 'PLAUSIBLE':
        return {
          bg: 'bg-cyan-950/40',
          border: 'border-cyan-500/40',
          text: 'text-cyan-400',
          label: 'PLAUSIBLE (PRELIMINARY)',
          icon: HelpCircle,
        };
    }
  };

  const config = getVerdictConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-3.5 w-3.5',
    lg: 'h-4 w-4',
  };

  return (
    <span
      className={`inline-flex items-center font-mono font-medium rounded border ${config.bg} ${config.border} ${config.text} ${sizeClasses[size]}`}
    >
      <Icon className={iconSizes[size]} />
      <span>{config.label}</span>
    </span>
  );
};
