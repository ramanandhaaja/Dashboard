'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUpDown } from 'lucide-react';
import { useState } from 'react';

export interface TopUser {
  id: string;
  name: string;
  email: string;
  totalTokens: number;
  operationsCount: number;
  lastActivity: string;
}

interface TopUsersTableProps {
  users: TopUser[];
}

export function TopUsersTable({ users }: TopUsersTableProps) {
  const [sortField, setSortField] = useState<'totalTokens' | 'operationsCount'>('totalTokens');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const sortedUsers = [...users].sort((a, b) => {
    const multiplier = sortDirection === 'asc' ? 1 : -1;
    return (a[sortField] - b[sortField]) * multiplier;
  });

  const toggleSort = (field: 'totalTokens' | 'operationsCount') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-gray-900">Top Users by Token Consumption</h3>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>
              <button
                onClick={() => toggleSort('totalTokens')}
                className="flex items-center gap-1 hover:text-gray-900"
              >
                Total Tokens <ArrowUpDown className="w-4 h-4" />
              </button>
            </TableHead>
            <TableHead>
              <button
                onClick={() => toggleSort('operationsCount')}
                className="flex items-center gap-1 hover:text-gray-900"
              >
                Operations <ArrowUpDown className="w-4 h-4" />
              </button>
            </TableHead>
            <TableHead>Last Activity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell className="text-gray-600">{user.email}</TableCell>
              <TableCell className="font-semibold">{user.totalTokens.toLocaleString()}</TableCell>
              <TableCell className="text-gray-600">{user.operationsCount}</TableCell>
              <TableCell className="text-gray-600">
                {new Date(user.lastActivity).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
