'use client';

import { useState } from 'react';
import type { DashboardScope, DashboardFilters } from '@/types/analytics';

/**
 * Hook for triggering CSV export download.
 */
export function useExportCSV(scope: DashboardScope, filters?: DashboardFilters) {
  const [isExporting, setIsExporting] = useState(false);

  const trigger = async () => {
    setIsExporting(true);
    try {
      const params = new URLSearchParams();
      params.set('scope', scope);
      if (filters?.companyId) params.set('company_id', filters.companyId);
      if (filters?.userId) params.set('user_id', filters.userId);

      const response = await fetch(`/api/export/csv?${params}`);
      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `be-inc-csrd-data-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('CSV export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return { trigger, isExporting };
}
