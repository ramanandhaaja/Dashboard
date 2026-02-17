'use client';

import { Badge } from '@/components/ui/badge';
import { Building2, Users, AlertTriangle, ShieldCheck } from 'lucide-react';
import type { CompanyListItem } from '@/types/company';

interface CompanyListViewProps {
  companies: CompanyListItem[];
  onSelectCompany: (id: string) => void;
}

function CompanyCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-2/3 mb-3" />
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-10 bg-gray-100 rounded" />
        <div className="h-10 bg-gray-100 rounded" />
        <div className="h-10 bg-gray-100 rounded" />
        <div className="h-10 bg-gray-100 rounded" />
      </div>
    </div>
  );
}

export function CompanyListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <CompanyCardSkeleton key={i} />
      ))}
    </div>
  );
}

const planColors: Record<string, string> = {
  free: 'bg-gray-100 text-gray-700',
  pro: 'bg-purple-100 text-purple-800',
  enterprise: 'bg-orange-100 text-orange-800',
  starter: 'bg-blue-100 text-blue-800',
  professional: 'bg-purple-100 text-purple-800',
};

export function CompanyListView({ companies, onSelectCompany }: CompanyListViewProps) {
  if (companies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Building2 className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No Companies Yet</h2>
        <p className="text-gray-500 max-w-sm">
          Companies will appear here once they are created.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {companies.map(({ company, member_count, analytics }) => (
        <button
          key={company.id}
          onClick={() => onSelectCompany(company.id)}
          className="bg-white rounded-lg shadow-sm border p-6 text-left hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {company.name}
              </h3>
              {company.industry && (
                <p className="text-sm text-gray-500 mt-0.5">{company.industry}</p>
              )}
            </div>
            <Badge className={planColors[company.plan] || planColors.free}>
              {company.plan.charAt(0).toUpperCase() + company.plan.slice(1)}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                <Users className="w-3.5 h-3.5" />
                <span className="text-xs">Members</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">{member_count}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                <Users className="w-3.5 h-3.5" />
                <span className="text-xs">Active</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {analytics?.active_users ?? 0}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span className="text-xs">Issues</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {analytics?.total_issues_detected ?? 0}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="text-xs">Score</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {analytics?.overall_compliance_score_percentage != null
                  ? `${analytics.overall_compliance_score_percentage}%`
                  : '--'}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
