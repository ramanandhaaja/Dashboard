'use client';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { queryKeys } from '@/lib/query-client';
import type { CompanyListItem, CompanyDetail } from '@/types/company';

interface CompanyListResponse {
  companies?: CompanyListItem[];
  company?: CompanyDetail;
  noCompany?: boolean;
}

async function fetchCompanyList(): Promise<CompanyListResponse> {
  const response = await fetch('/api/companies');
  if (!response.ok) {
    throw new Error('Failed to fetch companies');
  }
  return response.json();
}

async function fetchCompanyDetail(companyId: string): Promise<CompanyDetail> {
  const response = await fetch(`/api/companies/${companyId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch company details');
  }
  return response.json();
}

export function useCompanyList() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useQuery({
    queryKey: queryKeys.companies.list(),
    queryFn: fetchCompanyList,
    enabled: !!userId,
    placeholderData: keepPreviousData,
  });
}

export function useCompanyDetail(companyId: string | null) {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useQuery({
    queryKey: queryKeys.companies.detail(companyId || ''),
    queryFn: () => fetchCompanyDetail(companyId!),
    enabled: !!userId && !!companyId,
    placeholderData: keepPreviousData,
  });
}
