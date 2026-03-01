'use client';

import { useState, useRef, useCallback } from 'react';
import { ChevronDown, ChevronUp, Brain, MessageCircle, BookOpen } from 'lucide-react';
import type { ModulePerformanceData, ModuleData } from '@/types/analytics';

interface ModulePerformanceTilesProps {
  data: ModulePerformanceData;
}

const moduleConfig = {
  bias: { label: 'Bias Detection', icon: Brain, color: 'blue', scoreName: 'Inclusivity Score' },
  tone: { label: 'Tone Analysis', icon: MessageCircle, color: 'purple', scoreName: 'Tone Health Score' },
  clarity: { label: 'Clarity Check', icon: BookOpen, color: 'green', scoreName: 'Readability Score' },
} as const;

const colorMap: Record<string, { bg: string; border: string; text: string; badge: string; bar: string }> = {
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700', bar: 'bg-blue-500' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', badge: 'bg-purple-100 text-purple-700', bar: 'bg-purple-500' },
  green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', badge: 'bg-green-100 text-green-700', bar: 'bg-green-500' },
};

function TruncatedText({ text, className }: { text: string; className?: string }) {
  const textRef = useRef<HTMLSpanElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = useCallback(() => {
    const el = textRef.current;
    if (el && el.scrollWidth > el.clientWidth) {
      setShowTooltip(true);
    }
  }, []);

  return (
    <span className={`relative ${className || ''}`} onMouseEnter={handleMouseEnter} onMouseLeave={() => setShowTooltip(false)}>
      <span ref={textRef} className="text-xs text-muted-foreground truncate block">{text}</span>
      {showTooltip && (
        <span className="absolute left-0 bottom-full mb-1 bg-foreground text-background text-xs rounded px-2 py-1 whitespace-nowrap z-50 shadow-lg pointer-events-none">
          {text}
        </span>
      )}
    </span>
  );
}

const INITIAL_CATEGORY_COUNT = 10;

function ModuleTile({ moduleKey, data }: { moduleKey: keyof typeof moduleConfig; data: ModuleData }) {
  const [expanded, setExpanded] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const config = moduleConfig[moduleKey];
  const colors = colorMap[config.color];
  const Icon = config.icon;
  const resolutionRate = data.incidentCount > 0
    ? Math.round((data.resolvedCount / data.incidentCount) * 100)
    : 100;

  return (
    <div className={`rounded-lg border ${colors.border} ${colors.bg} overflow-hidden`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors.badge}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className={`text-base font-semibold ${colors.text}`}>{config.label}</h3>
            <p className="text-sm text-muted-foreground">
              {config.scoreName}: <span className="font-medium">{data.score}/100</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">{data.incidentCount}</p>
            <p className="text-xs text-muted-foreground">incidents</p>
          </div>
          {expanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-dashed" style={{ borderColor: 'inherit' }}>
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">{data.activeUserPercentage}%</p>
              <p className="text-xs text-muted-foreground">Active Users</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">{resolutionRate}%</p>
              <p className="text-xs text-muted-foreground">Resolution Rate</p>
            </div>
            <div className="text-center">
              <p className={`text-lg font-bold ${data.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {data.trend > 0 ? '+' : ''}{data.trend}%
              </p>
              <p className="text-xs text-muted-foreground">Trend</p>
            </div>
          </div>

          {/* Category breakdown */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Categories</h4>
            <div className="space-y-2">
              {[...data.categories].sort((a, b) => b.count - a.count).slice(0, showAllCategories ? undefined : INITIAL_CATEGORY_COUNT).map((cat) => (
                <div key={cat.name} className="flex items-center gap-3">
                  <TruncatedText text={cat.name} className="w-40" />
                  <div className="flex-1 h-2 bg-white rounded-full overflow-hidden">
                    <div className={`h-full ${colors.bar} rounded-full`} style={{ width: `${cat.percentage}%` }} />
                  </div>
                  <span className="text-xs font-medium text-foreground w-8 text-right">{cat.count}</span>
                </div>
              ))}
            </div>
            {data.categories.length > INITIAL_CATEGORY_COUNT && (
              <button
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="mt-2 flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                {showAllCategories ? (
                  <>Show less <ChevronUp className="w-3 h-3" /></>
                ) : (
                  <>See more ({data.categories.length - INITIAL_CATEGORY_COUNT} more) <ChevronDown className="w-3 h-3" /></>
                )}
              </button>
            )}
          </div>

          {/* App breakdown */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Detection by App</h4>
            <div className="flex gap-3">
              {Object.entries(data.appBreakdown).map(([app, count]) => (
                <div key={app} className="flex-1 bg-white rounded-md p-2 text-center">
                  <p className="text-sm font-bold text-foreground">{count}</p>
                  <p className="text-xs text-muted-foreground capitalize">{app}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function ModulePerformanceTiles({ data }: ModulePerformanceTilesProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Module Performance</h2>
      <div className="space-y-3">
        <ModuleTile moduleKey="bias" data={data.bias} />
        {/* TODO: Re-enable when tone and clarity modules are ready
        <ModuleTile moduleKey="tone" data={data.tone} />
        <ModuleTile moduleKey="clarity" data={data.clarity} />
        */}
      </div>
    </div>
  );
}
