'use client';

import { useState } from 'react';
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

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'invited' | 'suspended';
  joinedAt: string;
  tokenUsage: number;
}

interface UserListProps {
  users: User[];
  onUpdateRole?: (userId: string, newRole: 'admin' | 'user') => void;
  onRemoveUser?: (userId: string) => void;
}

export function UserList({ users, onUpdateRole, onRemoveUser }: UserListProps) {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    invited: 'bg-yellow-100 text-yellow-800',
    suspended: 'bg-red-100 text-red-800',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
        <p className="text-sm text-gray-500 mt-1">
          Manage your organization&apos;s users and roles
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Token Usage</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <UserRoleSelect
                  currentRole={user.role}
                  onRoleChange={(newRole) => onUpdateRole?.(user.id, newRole)}
                />
              </TableCell>
              <TableCell>
                <Badge className={statusColors[user.status]}>
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="text-gray-600">
                {new Date(user.joinedAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-gray-600">
                {user.tokenUsage.toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedUserId(user.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <RemoveUserDialog
        open={selectedUserId !== null}
        onOpenChange={(open) => !open && setSelectedUserId(null)}
        onConfirm={() => {
          if (selectedUserId) {
            onRemoveUser?.(selectedUserId);
            setSelectedUserId(null);
          }
        }}
        userName={users.find((u) => u.id === selectedUserId)?.name || ''}
      />
    </div>
  );
}
