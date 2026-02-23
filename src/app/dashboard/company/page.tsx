'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useCompanyList, useCompanyDetail } from '@/hooks/useCompanyDashboard';
import { useDashboardAnalytics } from '@/hooks/useDashboardAnalytics';
import { useExportCSV } from '@/hooks/useExportCSV';
import { useExportPDF } from '@/hooks/useExportPDF';
import { CompanySearchFilter, type SelectedCompany } from '@/components/company/company-search-filter';
import { CompanyDetailView } from '@/components/company/company-detail-view';
import { CompanyListSkeleton } from '@/components/company/company-list-view';
import { HeroMetrics } from '@/components/analytics/hero-metrics';
import { ModulePerformanceTiles } from '@/components/analytics/module-performance-tiles';
import { DepartmentLeaderboard } from '@/components/analytics/department-leaderboard';
import { TrendAnalysis } from '@/components/analytics/trend-analysis';
import { AppBreakdownChart } from '@/components/analytics/app-breakdown-chart';
import { ExportButton } from '@/components/analytics/export-button';
import { RefreshCw, Building2 } from 'lucide-react';

/**
 * KPI analytics section shown when a company is selected/loaded.
 * Renders: Hero Metrics → Modules → Department + App Breakdown → Trends
 */
function CompanyKPISection({ companyId }: { companyId?: string }) {
  const { data } = useDashboardAnalytics('company', companyId ? { companyId } : undefined);

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Executive KPIs */}
      <HeroMetrics data={data.heroMetrics} />

      {/* Module Breakdown */}
      <ModulePerformanceTiles data={data.modules} />

      {/* Department Rankings + Cross-App Detection side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DepartmentLeaderboard data={data.departments} />
        <AppBreakdownChart data={data.appBreakdown} />
      </div>

      {/* Trend over time */}
      <TrendAnalysis data={data.trends} />
    </div>
  );
}

/**
 * Page header with title, subtitle, export + refresh buttons.
 */
function PageHeader({
  subtitle,
  companyId,
  isFetching,
  onRefresh,
}: {
  subtitle: string;
  companyId?: string;
  isFetching: boolean;
  onRefresh: () => void;
}) {
  const { data: kpiData } = useDashboardAnalytics('company', companyId ? { companyId } : undefined);
  const { trigger: exportCSV, isExporting: isExportingCSV } = useExportCSV('company', companyId ? { companyId } : undefined);
  const { trigger: exportPDF, isExporting: isExportingPDF } = useExportPDF();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Company Analytics</h1>
        <p className="text-muted-foreground mt-1">{subtitle}</p>
      </div>
      <div className="flex items-center gap-2">
        {kpiData && (
          <ExportButton
            onExportPDF={() => exportPDF(kpiData)}
            onExportCSV={exportCSV}
            isExporting={isExportingCSV || isExportingPDF}
          />
        )}
        <button
          onClick={onRefresh}
          disabled={isFetching}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground bg-secondary rounded-md hover:bg-secondary/80 transition-colors disabled:opacity-50"
          title="Refresh data"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          {isFetching ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
    </div>
  );
}

/**
 * Divider with section title between KPI analytics and team management.
 */
function SectionDivider({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4 pt-4 pb-1">
      <div className="h-px flex-1 bg-border" />
      <h2 className="text-lg font-bold text-foreground uppercase tracking-wide">{title}</h2>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

export default function CompanyPage() {
  const { data: session } = useSession();
  const { data, isLoading, error, refetch, isFetching } = useCompanyList();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<SelectedCompany | null>(null);

  const role = session?.user?.role;
  const isSuperAdmin = role === 'super_admin';

  const { data: selectedDetail, isLoading: isDetailLoading } = useCompanyDetail(
    isSuperAdmin ? selectedCompanyId : null
  );

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Company Analytics</h1>
            <p className="text-muted-foreground mt-1">
              {isSuperAdmin ? 'Cross-app compliance analytics' : 'Your organization analytics'}
            </p>
          </div>
          <CompanyListSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Company Analytics</h1>
            <p className="text-muted-foreground mt-1">Cross-app compliance analytics</p>
          </div>
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="text-red-500">Failed to load company data. Please try again.</div>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Company member: show their company directly ───
  if (data?.company) {
    const companyId = data.company.company.id;
    const isEmployee = role === 'employee';

    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {!isEmployee && (
            <PageHeader
              subtitle="Cross-app compliance analytics for your organization"
              companyId={companyId}
              isFetching={isFetching}
              onRefresh={() => refetch()}
            />
          )}

          {isEmployee ? (
            /* Employees only see company details card */
            <CompanyDetailView
              companyId={companyId}
              preloaded={data.company}
              hideTeamManagement
            />
          ) : (
            <>
              {/* Analytics KPIs */}
              <CompanyKPISection companyId={companyId} />

              {/* Team Management */}
              <SectionDivider title="Team Management" />
              <CompanyDetailView
                companyId={companyId}
                preloaded={data.company}
              />
            </>
          )}
        </div>
      </div>
    );
  }

  // ─── Super admin: company selector + analytics + detail ───
  const companies = data?.companies || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader
          subtitle={
            selectedCompany
              ? `Viewing: ${selectedCompany.name}${selectedCompany.industry ? ` · ${selectedCompany.industry}` : ''}`
              : `${companies.length} ${companies.length === 1 ? 'company' : 'companies'} registered`
          }
          companyId={selectedCompanyId ?? undefined}
          isFetching={isFetching}
          onRefresh={() => refetch()}
        />

        {/* Company Selector */}
        <CompanySearchFilter
          companies={companies}
          onCompanySelect={(companyId, company) => {
            setSelectedCompanyId(companyId);
            setSelectedCompany(company);
          }}
        />

        {/* Selected Company Content */}
        {selectedCompanyId ? (
          isDetailLoading ? (
            <CompanyListSkeleton />
          ) : selectedDetail ? (
            <>
              {/* Analytics KPIs */}
              <CompanyKPISection companyId={selectedCompanyId} />

              {/* Team Management */}
              <SectionDivider title="Team Management" />
              <CompanyDetailView
                companyId={selectedCompanyId}
                preloaded={selectedDetail}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64">
              <p className="text-muted-foreground">Failed to load company details.</p>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Building2 className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Select a Company</h2>
            <p className="text-muted-foreground max-w-sm">
              Choose a company above to view cross-app analytics, department rankings, and team management.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
