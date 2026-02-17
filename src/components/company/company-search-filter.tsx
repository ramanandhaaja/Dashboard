'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X, Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { CompanyListItem } from '@/types/company';

export interface SelectedCompany {
  id: string;
  name: string;
  industry: string | null;
  plan: string;
}

interface CompanySearchFilterProps {
  companies: CompanyListItem[];
  onCompanySelect: (companyId: string | null, company: SelectedCompany | null) => void;
}

const planColors: Record<string, string> = {
  free: 'bg-gray-100 text-gray-700',
  pro: 'bg-purple-100 text-purple-800',
  enterprise: 'bg-orange-100 text-orange-800',
  starter: 'bg-blue-100 text-blue-800',
  professional: 'bg-purple-100 text-purple-800',
};

export function CompanySearchFilter({ companies, onCompanySelect }: CompanySearchFilterProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CompanyListItem | null>(null);
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

  const filtered = query.length > 0
    ? companies.filter((item) => {
        const q = query.toLowerCase();
        return (
          item.company.name.toLowerCase().includes(q) ||
          (item.company.industry?.toLowerCase().includes(q) ?? false) ||
          item.company.plan.toLowerCase().includes(q)
        );
      })
    : companies;

  function handleSelect(item: CompanyListItem) {
    setSelectedCompany(item);
    setQuery('');
    setIsOpen(false);
    onCompanySelect(item.company.id, {
      id: item.company.id,
      name: item.company.name,
      industry: item.company.industry,
      plan: item.company.plan,
    });
  }

  function handleClear() {
    setSelectedCompany(null);
    setQuery('');
    onCompanySelect(null, null);
  }

  return (
    <div className="rounded-lg border bg-card p-4" ref={dropdownRef}>
      <div className="flex items-center gap-2 mb-2">
        <Building2 className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">Select Company</span>
      </div>

      {selectedCompany ? (
        <div className="flex items-center justify-between rounded-md border bg-muted/50 px-3 py-2">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium">
              {selectedCompany.company.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium">{selectedCompany.company.name}</p>
              {selectedCompany.company.industry && (
                <p className="text-xs text-muted-foreground">{selectedCompany.company.industry}</p>
              )}
            </div>
            <Badge className={planColors[selectedCompany.company.plan] || planColors.free}>
              {selectedCompany.company.plan.charAt(0).toUpperCase() + selectedCompany.company.plan.slice(1)}
            </Badge>
          </div>
          <button
            onClick={handleClear}
            className="rounded-md p-1 hover:bg-muted transition-colors"
            aria-label="Clear selection"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search companies by name, industry, or plan..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            className="w-full rounded-md border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />

          {isOpen && filtered.length > 0 && (
            <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg max-h-64 overflow-y-auto">
              {filtered.map((item) => (
                <button
                  key={item.company.id}
                  onClick={() => handleSelect(item)}
                  className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-muted transition-colors first:rounded-t-md last:rounded-b-md"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium">
                    {item.company.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.company.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {item.company.industry || 'No industry'} · {item.member_count} members
                    </p>
                  </div>
                  <Badge className={`${planColors[item.company.plan] || planColors.free} shrink-0`}>
                    {item.company.plan.charAt(0).toUpperCase() + item.company.plan.slice(1)}
                  </Badge>
                </button>
              ))}
            </div>
          )}

          {isOpen && filtered.length === 0 && query.length > 0 && (
            <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover p-3 shadow-lg">
              <p className="text-sm text-muted-foreground text-center">No companies found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
