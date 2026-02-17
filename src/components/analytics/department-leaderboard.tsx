'use client';

import { Trophy, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import type { DepartmentLeaderboardEntry } from '@/types/analytics';

interface DepartmentLeaderboardProps {
  data: DepartmentLeaderboardEntry[];
}

function getScoreBadge(score: number): string {
  if (score >= 85) return 'bg-green-100 text-green-700';
  if (score >= 70) return 'bg-yellow-100 text-yellow-700';
  return 'bg-red-100 text-red-700';
}

export function DepartmentLeaderboard({ data }: DepartmentLeaderboardProps) {
  const sorted = [...data].sort((a, b) => a.rank - b.rank);

  return (
    <div className="bg-card rounded-lg shadow-sm border p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground">Department Leaderboard</h2>
        <p className="text-sm text-muted-foreground">Ranked by communication health score</p>
      </div>

      <div className="space-y-3">
        {sorted.map((dept, index) => {
          const isTop = dept.rank === 1;
          const isRedFlag = dept.adoptionRate < 70;
          const nextDept = sorted[index + 1];
          const scoreDiff = nextDept ? dept.healthScore - nextDept.healthScore : 0;

          return (
            <div key={dept.name}>
              <div
                className={`flex items-center gap-4 p-3 rounded-lg border ${
                  isTop ? 'bg-amber-50 border-amber-200' : isRedFlag ? 'bg-red-50 border-red-200' : 'bg-card border-border'
                }`}
              >
                {/* Rank */}
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-bold text-foreground">
                  {isTop ? <Trophy className="w-4 h-4 text-amber-500" /> : `#${dept.rank}`}
                </div>

                {/* Name & stats */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{dept.name}</p>
                    {isRedFlag && (
                      <span className="inline-flex items-center gap-1 text-xs text-red-600">
                        <AlertTriangle className="w-3 h-3" /> Low adoption
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {dept.activeUsers}/{dept.totalUsers} active users · {dept.adoptionRate}% adoption
                  </p>
                </div>

                {/* Score */}
                <div className="text-right">
                  <span className={`inline-block px-2 py-0.5 rounded text-sm font-bold ${getScoreBadge(dept.healthScore)}`}>
                    {dept.healthScore}
                  </span>
                </div>

                {/* Trend */}
                <div className={`flex items-center gap-0.5 text-sm ${dept.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {dept.trend >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  {Math.abs(dept.trend)}%
                </div>
              </div>

              {/* Peer comparison callout */}
              {nextDept && scoreDiff > 0 && (
                <p className="text-xs text-muted-foreground ml-12 mt-1 italic">
                  {dept.name} is {scoreDiff} points ahead of {nextDept.name}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
