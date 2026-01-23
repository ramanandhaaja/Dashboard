'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Building2 } from 'lucide-react';

interface Company {
  id: string;
  name: string;
}

interface CompanySwitcherProps {
  companies: Company[];
  currentCompanyId: string;
  onCompanyChange?: (companyId: string) => void;
}

export function CompanySwitcher({
  companies,
  currentCompanyId,
  onCompanyChange,
}: CompanySwitcherProps) {
  if (companies.length <= 1) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
      <Building2 className="w-4 h-4 text-gray-600" />
      <Select value={currentCompanyId} onValueChange={onCompanyChange}>
        <SelectTrigger className="w-48 border-none bg-transparent">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {companies.map((company) => (
            <SelectItem key={company.id} value={company.id}>
              {company.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
