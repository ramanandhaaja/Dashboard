'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface UserRoleSelectProps {
  currentRole: 'admin' | 'user';
  onRoleChange?: (role: 'admin' | 'user') => void;
}

export function UserRoleSelect({ currentRole, onRoleChange }: UserRoleSelectProps) {
  return (
    <Select value={currentRole} onValueChange={(value) => onRoleChange?.(value as 'admin' | 'user')}>
      <SelectTrigger className="w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="admin">Admin</SelectItem>
        <SelectItem value="user">User</SelectItem>
      </SelectContent>
    </Select>
  );
}
