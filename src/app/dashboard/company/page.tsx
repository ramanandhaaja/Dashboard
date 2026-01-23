'use client';

import { useState } from 'react';
import { CompanyProfile, type Company } from '@/components/company/company-profile';
import { UserList, type User } from '@/components/company/user-list';
import { InviteUserDialog } from '@/components/company/invite-user-dialog';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

// Mock data
const mockCompany: Company = {
  id: '1',
  name: 'Acme Corporation',
  planTier: 'professional',
  createdAt: '2024-01-15',
  userCount: 5,
  tokenUsage: 125000,
  address: {
    street: '123 Business Ave, Suite 400',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94105',
    country: 'United States',
  },
  phone: '+1 (555) 123-4567',
  website: 'https://www.acmecorp.com',
  industry: 'Technology & Software',
  companySize: '50-200 employees',
  billingEmail: 'billing@acme.com',
};

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@acme.com',
    role: 'admin',
    status: 'active',
    joinedAt: '2024-01-15',
    tokenUsage: 45000,
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@acme.com',
    role: 'user',
    status: 'active',
    joinedAt: '2024-01-20',
    tokenUsage: 32000,
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@acme.com',
    role: 'user',
    status: 'active',
    joinedAt: '2024-02-01',
    tokenUsage: 28000,
  },
  {
    id: '4',
    name: 'Alice Williams',
    email: 'alice@acme.com',
    role: 'admin',
    status: 'active',
    joinedAt: '2024-02-15',
    tokenUsage: 15000,
  },
  {
    id: '5',
    name: 'Charlie Brown',
    email: 'charlie@acme.com',
    role: 'user',
    status: 'invited',
    joinedAt: '2024-03-01',
    tokenUsage: 5000,
  },
];

export default function CompanyPage() {
  const [users, setUsers] = useState(mockUsers);
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  const handleUpdateRole = (userId: string, newRole: 'admin' | 'user') => {
    setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    alert(`Role updated successfully`);
  };

  const handleRemoveUser = (userId: string) => {
    setUsers(users.filter((u) => u.id !== userId));
    alert('User removed successfully');
  };

  const handleInviteUser = (email: string, role: 'admin' | 'user') => {
    const newUser: User = {
      id: String(users.length + 1),
      name: email.split('@')[0],
      email,
      role,
      status: 'invited',
      joinedAt: new Date().toISOString(),
      tokenUsage: 0,
    };
    setUsers([...users, newUser]);
    alert(`Invitation sent to ${email}`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Company Management</h1>
            <p className="text-muted-foreground mt-1">Manage your organization and team members</p>
          </div>
          <Button onClick={() => setShowInviteDialog(true)} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <UserPlus className="w-4 h-4" />
            Invite User
          </Button>
        </div>

        {/* Company Profile */}
        <CompanyProfile company={mockCompany} />

        {/* User List */}
        <UserList
          users={users}
          onUpdateRole={handleUpdateRole}
          onRemoveUser={handleRemoveUser}
        />

        {/* Invite Dialog */}
        <InviteUserDialog
          open={showInviteDialog}
          onOpenChange={setShowInviteDialog}
          onInvite={handleInviteUser}
        />
      </div>
    </div>
  );
}
