'use client';

import { Building2 } from 'lucide-react';

export function NoCompanyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Building2 className="w-8 h-8 text-gray-400" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        No Company
      </h2>
      <p className="text-gray-500 max-w-sm">
        You are not part of any company. Contact your administrator to receive an invitation.
      </p>
    </div>
  );
}
