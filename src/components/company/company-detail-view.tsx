'use client';

import { useState } from 'react';
import { useCompanyDetail } from '@/hooks/useCompanyDashboard';
import { CompanyProfile } from './company-profile';
import { UserList } from './user-list';
import { InviteUserDialog } from './invite-user-dialog';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Activity, ShieldCheck, DollarSign } from 'lucide-react';
import type { CompanyDetail } from '@/types/company';
import type { CompanyRole } from '@/types/company';

interface CompanyDetailViewProps {
  companyId: string;
  onBack?: () => void;
  /** Pre-loaded data from the list endpoint (company users get this) */
  preloaded?: CompanyDetail;
  /** Hide members table and invite dialog (employee view) */
  hideTeamManagement?: boolean;
}

function DetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3" />
      <div className="bg-white rounded-lg border p-6">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded" />
          ))}
        </div>
      </div>
      <div className="bg-white rounded-lg border p-6">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function CompanyDetailView({ companyId, onBack, preloaded, hideTeamManagement }: CompanyDetailViewProps) {
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  // Only fetch if no preloaded data
  const { data, isLoading, error } = useCompanyDetail(preloaded ? null : companyId);

  const detail = preloaded || data;

  if (!preloaded && isLoading) return <DetailSkeleton />;
  if (!preloaded && error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load company details.</p>
      </div>
    );
  }
  if (!detail) return null;

  const { company, members, analytics } = detail;

  const handleUpdateRole = (_userId: string, _newRole: CompanyRole) => {
    alert('Role update will be available soon.');
  };

  const handleRemoveUser = (_userId: string) => {
    alert('User removal will be available soon.');
  };

  const handleInviteUser = (email: string, _role: CompanyRole) => {
    alert(`Invitation to ${email} will be available soon.`);
  };

  return (
    <div className="space-y-6">
      {/* Back button (only when navigating from a list) */}
      {onBack && (
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1.5">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      )}

      {/* Stat Cards (hidden for employees) */}
      {!hideTeamManagement && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<Users className="w-5 h-5 text-blue-600" />}
            label="Members"
            value={String(members.length)}
            bg="bg-blue-50"
          />
          <StatCard
            icon={<Activity className="w-5 h-5 text-green-600" />}
            label="Active Users (30d)"
            value={String(analytics?.active_users ?? 0)}
            bg="bg-green-50"
          />
          <StatCard
            icon={<ShieldCheck className="w-5 h-5 text-purple-600" />}
            label="Compliance Score"
            value={
              analytics?.overall_compliance_score_percentage != null
                ? `${analytics.overall_compliance_score_percentage}%`
                : '--'
            }
            bg="bg-purple-50"
          />
          <StatCard
            icon={<DollarSign className="w-5 h-5 text-orange-600" />}
            label="Cost (30d)"
            value={
              analytics?.total_cost_usd != null
                ? `$${analytics.total_cost_usd.toFixed(2)}`
                : '$0.00'
            }
            bg="bg-orange-50"
          />
        </div>
      )}

      {/* Company Profile */}
      <CompanyProfile
        company={company}
        analytics={analytics}
        memberCount={members.length}
      />

      {/* Members Table (hidden for employees) */}
      {!hideTeamManagement && (
        <>
          <UserList
            members={members}
            onUpdateRole={handleUpdateRole}
            onRemoveUser={handleRemoveUser}
            onInviteUser={() => setShowInviteDialog(true)}
          />

          {/* Invite Dialog */}
          <InviteUserDialog
            open={showInviteDialog}
            onOpenChange={setShowInviteDialog}
            onInvite={handleInviteUser}
          />
        </>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  bg: string;
}) {
  return (
    <div className={`${bg} rounded-lg p-4`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-sm font-medium text-gray-600">{label}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
