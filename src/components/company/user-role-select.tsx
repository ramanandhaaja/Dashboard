'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { CompanyRole } from '@/types/company';

interface UserRoleSelectProps {
  currentRole: CompanyRole;
  onRoleChange?: (role: CompanyRole) => void;
}

const roleLabels: Record<CompanyRole, string> = {
  owner: 'Owner',
  admin: 'Admin',
  manager: 'Manager',
  member: 'Member',
  viewer: 'Viewer',
};

export function UserRoleSelect({ currentRole, onRoleChange }: UserRoleSelectProps) {
  return (
    <Select value={currentRole} onValueChange={(value) => onRoleChange?.(value as CompanyRole)}>
      <SelectTrigger className="w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {(Object.entries(roleLabels) as [CompanyRole, string][]).map(([value, label]) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
