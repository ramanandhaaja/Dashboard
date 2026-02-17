'use client';

import { useState } from 'react';
import { Shield, FileCheck, Euro, TrendingDown, TrendingUp, Minus, Info } from 'lucide-react';
import type { HeroMetricsData } from '@/types/analytics';

interface HeroMetricsProps {
  data: HeroMetricsData;
}

function getScoreColor(value: number): string {
  if (value >= 85) return 'text-green-600';
  if (value >= 70) return 'text-yellow-600';
  return 'text-red-600';
}

function getScoreBg(value: number): string {
  if (value >= 85) return 'bg-green-50 border-green-200';
  if (value >= 70) return 'bg-yellow-50 border-yellow-200';
  return 'bg-red-50 border-red-200';
}

function TrendIndicator({ trend }: { trend: number }) {
  if (trend > 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-sm text-green-600">
        <TrendingUp className="w-3.5 h-3.5" />+{trend}%
      </span>
    );
  }
  if (trend < 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-sm text-red-600">
        <TrendingDown className="w-3.5 h-3.5" />{trend}%
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-0.5 text-sm text-muted-foreground">
      <Minus className="w-3.5 h-3.5" />0%
    </span>
  );
}

function InfoTooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-flex">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        className="text-muted-foreground/60 hover:text-muted-foreground transition-colors"
        aria-label="More information"
      >
        <Info className="w-4 h-4" />
      </button>
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 z-50">
          <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2.5 leading-relaxed shadow-lg">
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
              <div className="w-2.5 h-2.5 bg-gray-900 rotate-45 -translate-y-1/2" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const cardInfoText: Record<string, string> = {
  'Communication Health Score':
    'Calculated from the ratio of resolved DEI issues (accepted + auto-corrected) to total detected issues. A higher score means more issues are being actively addressed by users.',
  'CSRD Readiness':
    'Measures the percentage of detected issues that have been classified into Bias, Tone, or Clarity modules. Full classification is required for CSRD (Corporate Sustainability Reporting Directive) ESRS S1 compliance reporting.',
  'Cost Savings from AI Coaching':
    'Estimated savings based on resolved issues. Each auto-corrected or accepted suggestion saves approximately €2.50 in manual review and editing time compared to traditional compliance workflows.',
  'Risk Reduction':
    'Percentage of detected compliance risks that have been mitigated through accepted suggestions or auto-corrections. Unresolved issues represent outstanding compliance risk exposure.',
};

export function HeroMetrics({ data }: HeroMetricsProps) {
  const cards = [
    {
      label: 'Communication Health Score',
      value: data.healthScore.value,
      suffix: '/100',
      icon: Shield,
      trend: data.healthScore.trend,
      prevLabel: `Previously: ${data.healthScore.previousValue}`,
      colorClass: getScoreColor(data.healthScore.value),
      bgClass: getScoreBg(data.healthScore.value),
      iconColor: 'text-blue-600',
    },
    {
      label: 'CSRD Readiness',
      value: data.csrdReadiness.value,
      suffix: '%',
      icon: FileCheck,
      trend: data.csrdReadiness.trend,
      prevLabel: `Previously: ${data.csrdReadiness.previousValue}%`,
      colorClass: getScoreColor(data.csrdReadiness.value),
      bgClass: getScoreBg(data.csrdReadiness.value),
      iconColor: 'text-purple-600',
    },
    {
      label: 'Cost Savings from AI Coaching',
      value: `€${data.costSavings.value.toLocaleString('de-DE')}`,
      suffix: '',
      icon: Euro,
      trend: data.costSavings.trend,
      prevLabel: `Previously: €${data.costSavings.previousValue.toLocaleString('de-DE')}`,
      colorClass: 'text-green-600',
      bgClass: 'bg-green-50 border-green-200',
      iconColor: 'text-green-600',
    },
    {
      label: 'Risk Reduction',
      value: data.riskReduction.value,
      suffix: '%',
      icon: TrendingDown,
      trend: data.riskReduction.trend,
      prevLabel: `Previously: ${data.riskReduction.previousValue}%`,
      colorClass: 'text-orange-600',
      bgClass: 'bg-orange-50 border-orange-200',
      iconColor: 'text-orange-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className={`rounded-lg border p-5 ${card.bgClass}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
                <InfoTooltip text={cardInfoText[card.label]} />
              </div>
              <Icon className={`w-5 h-5 ${card.iconColor}`} />
            </div>
            <p className={`text-3xl font-bold ${card.colorClass}`}>
              {card.value}{card.suffix}
            </p>
            <div className="flex items-center justify-between mt-2">
              <TrendIndicator trend={card.trend} />
              <span className="text-xs text-muted-foreground">{card.prevLabel}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
