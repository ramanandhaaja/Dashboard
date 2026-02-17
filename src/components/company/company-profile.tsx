'use client';

import { Badge } from '@/components/ui/badge';
import { Globe, Briefcase, Users, FileText } from 'lucide-react';
import type { CompanyData, CompanyAnalytics } from '@/types/company';

interface CompanyProfileProps {
  company: CompanyData;
  analytics: CompanyAnalytics | null;
  memberCount: number;
}

const planColors: Record<string, string> = {
  free: 'bg-gray-100 text-gray-700',
  pro: 'bg-purple-100 text-purple-800',
  enterprise: 'bg-orange-100 text-orange-800',
  starter: 'bg-blue-100 text-blue-800',
  professional: 'bg-purple-100 text-purple-800',
};

export function CompanyProfile({ company, analytics, memberCount }: CompanyProfileProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="flex items-start justify-between p-6 border-b">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">{company.name}</h2>
          <p className="text-sm text-gray-500 mt-1">
            Member since {new Date(company.created_at).toLocaleDateString()}
          </p>
        </div>
        <Badge className={planColors[company.plan] || planColors.free}>
          {company.plan.charAt(0).toUpperCase() + company.plan.slice(1)}
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 border-b bg-gray-50">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm font-medium text-gray-600">Total Members</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{memberCount}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm font-medium text-gray-600">Active Users (30d)</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {analytics?.active_users ?? 0}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm font-medium text-gray-600">Compliance Score</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {analytics?.overall_compliance_score_percentage != null
              ? `${analytics.overall_compliance_score_percentage}%`
              : '--'}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm font-medium text-gray-600">Cost (30d)</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {analytics?.total_cost_usd != null
              ? `$${analytics.total_cost_usd.toFixed(2)}`
              : '$0.00'}
          </p>
        </div>
      </div>

      {/* Company Details */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {company.website && (
            <div className="flex gap-3">
              <Globe className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-600">Website</p>
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-indigo-600 hover:text-indigo-700 mt-1 inline-block"
                >
                  {company.website}
                </a>
              </div>
            </div>
          )}

          {company.industry && (
            <div className="flex gap-3">
              <Briefcase className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-600">Industry</p>
                <p className="text-sm text-gray-900 mt-1">{company.industry}</p>
              </div>
            </div>
          )}

          {company.company_size && (
            <div className="flex gap-3">
              <Users className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-600">Company Size</p>
                <p className="text-sm text-gray-900 mt-1">{company.company_size}</p>
              </div>
            </div>
          )}

          {company.description && (
            <div className="flex gap-3 md:col-span-2">
              <FileText className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-600">Description</p>
                <p className="text-sm text-gray-900 mt-1">{company.description}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
