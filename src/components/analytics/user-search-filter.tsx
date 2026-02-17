'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, User } from 'lucide-react';

interface SearchUser {
  id: string;
  name: string;
  email: string;
  role: string;
  company_id: string | null;
  is_active: boolean;
}

export interface SelectedUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UserSearchFilterProps {
  onUserSelect: (userId: string | null, user: SelectedUser | null) => void;
}

const roleColors: Record<string, string> = {
  super_admin: 'bg-orange-100 text-orange-800',
  company_owner: 'bg-purple-100 text-purple-800',
  employee: 'bg-blue-100 text-blue-800',
  individual: 'bg-gray-100 text-gray-700',
};

export function UserSearchFilter({ onUserSelect }: UserSearchFilterProps) {
  const [query, setQuery] = useState('');
  const [allUsers, setAllUsers] = useState<SearchUser[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SearchUser | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch all users once on first open
  async function fetchUsers() {
    if (hasFetched) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/users/search?q=');
      if (res.ok) {
        const data = await res.json();
        setAllUsers(data.users || []);
      }
    } catch {
      setAllUsers([]);
    } finally {
      setIsLoading(false);
      setHasFetched(true);
    }
  }

  const filtered = query.length > 0
    ? allUsers.filter((user) => {
        const q = query.toLowerCase();
        return (
          user.name.toLowerCase().includes(q) ||
          user.email.toLowerCase().includes(q) ||
          user.role.toLowerCase().includes(q)
        );
      })
    : allUsers;

  function handleSelect(user: SearchUser) {
    setSelectedUser(user);
    setQuery('');
    setIsOpen(false);
    onUserSelect(user.id, { id: user.id, name: user.name, email: user.email, role: user.role });
  }

  function handleClear() {
    setSelectedUser(null);
    setQuery('');
    onUserSelect(null, null);
  }

  function handleFocus() {
    fetchUsers();
    setIsOpen(true);
  }

  return (
    <div className="rounded-lg border bg-card p-4" ref={dropdownRef}>
      <div className="flex items-center gap-2 mb-2">
        <User className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">Filter by User</span>
      </div>

      {selectedUser ? (
        <div className="flex items-center justify-between rounded-md border bg-muted/50 px-3 py-2">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium">
              {selectedUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium">{selectedUser.name}</p>
              <p className="text-xs text-muted-foreground">{selectedUser.email}</p>
            </div>
            <span className={`rounded-full px-2 py-0.5 text-xs ${roleColors[selectedUser.role] || roleColors.individual}`}>
              {selectedUser.role.replace('_', ' ')}
            </span>
          </div>
          <button
            onClick={handleClear}
            className="rounded-md p-1 hover:bg-muted transition-colors"
            aria-label="Clear filter"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search users by name, email, or role..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={handleFocus}
            className="w-full rounded-md border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
            </div>
          )}

          {isOpen && !isLoading && filtered.length > 0 && (
            <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg max-h-64 overflow-y-auto">
              {filtered.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleSelect(user)}
                  className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-muted transition-colors first:rounded-t-md last:rounded-b-md"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs shrink-0 ${roleColors[user.role] || roleColors.individual}`}>
                    {user.role.replace('_', ' ')}
                  </span>
                </button>
              ))}
            </div>
          )}

          {isOpen && !isLoading && filtered.length === 0 && hasFetched && (
            <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover p-3 shadow-lg">
              <p className="text-sm text-muted-foreground text-center">No users found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
