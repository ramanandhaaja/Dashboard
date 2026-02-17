'use client';

import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserRoleSelect } from './user-role-select';
import { RemoveUserDialog } from './remove-user-dialog';
import { UserPlus, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import type { CompanyMember, CompanyRole } from '@/types/company';

interface UserListProps {
  members: CompanyMember[];
  onUpdateRole?: (userId: string, newRole: CompanyRole) => void;
  onRemoveUser?: (userId: string) => void;
  onInviteUser?: () => void;
}

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  suspended: 'bg-red-100 text-red-800',
  removed: 'bg-gray-100 text-gray-800',
};

const PAGE_SIZE = 10;

export function UserList({ members, onUpdateRole, onRemoveUser, onInviteUser }: UserListProps) {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);

  // Unique departments for filter dropdown
  const departments = useMemo(() => {
    const depts = new Set<string>();
    members.forEach((m) => { if (m.department) depts.add(m.department); });
    return Array.from(depts).sort();
  }, [members]);

  // Unique statuses for filter dropdown
  const statuses = useMemo(() => {
    const s = new Set<string>();
    members.forEach((m) => s.add(m.status));
    return Array.from(s).sort();
  }, [members]);

  // Filtered members
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return members.filter((m) => {
      if (departmentFilter !== 'all' && (m.department || '') !== departmentFilter) return false;
      if (statusFilter !== 'all' && m.status !== statusFilter) return false;
      if (q && !m.user_name.toLowerCase().includes(q) && !m.user_email.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [members, search, departmentFilter, statusFilter]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // Reset page when filters change
  const handleSearch = (val: string) => { setSearch(val); setPage(1); };
  const handleDeptFilter = (val: string) => { setDepartmentFilter(val); setPage(1); };
  const handleStatusFilter = (val: string) => { setStatusFilter(val); setPage(1); };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="p-6 border-b flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
          <p className="text-sm text-gray-500 mt-1">
            {filtered.length} of {members.length} member{members.length !== 1 ? 's' : ''}
          </p>
        </div>
        {onInviteUser && (
          <Button onClick={onInviteUser} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <UserPlus className="w-4 h-4" />
            Invite User
          </Button>
        )}
      </div>

      {/* Search & Filters */}
      <div className="p-4 border-b flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
          />
        </div>
        <select
          value={departmentFilter}
          onChange={(e) => handleDeptFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        >
          <option value="all">All Departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => handleStatusFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        >
          <option value="all">All Statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {paged.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          {members.length === 0 ? 'No members yet.' : 'No members match your filters.'}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((member) => (
              <TableRow key={member.user_id}>
                <TableCell className="font-medium">{member.user_name}</TableCell>
                <TableCell>{member.user_email}</TableCell>
                <TableCell className="text-gray-600">{member.department || '--'}</TableCell>
                <TableCell>
                  <UserRoleSelect
                    currentRole={member.company_role}
                    onRoleChange={(newRole) => onUpdateRole?.(member.user_id, newRole)}
                  />
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[member.status] || statusColors.active}>
                    {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-600">
                  {member.joined_at
                    ? new Date(member.joined_at).toLocaleDateString()
                    : '--'}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedUserId(member.user_id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={p === safePage ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPage(p)}
                className="h-8 w-8 p-0 text-xs"
              >
                {p}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <RemoveUserDialog
        open={selectedUserId !== null}
        onOpenChange={(open) => !open && setSelectedUserId(null)}
        onConfirm={() => {
          if (selectedUserId) {
            onRemoveUser?.(selectedUserId);
            setSelectedUserId(null);
          }
        }}
        userName={members.find((m) => m.user_id === selectedUserId)?.user_name || ''}
      />
    </div>
  );
}
