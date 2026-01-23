'use client';

import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, Phone, Globe, Users, Briefcase } from 'lucide-react';

export interface Company {
  id: string;
  name: string;
  planTier: 'starter' | 'professional' | 'enterprise';
  createdAt: string;
  userCount: number;
  tokenUsage: number;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  phone?: string;
  website?: string;
  industry?: string;
  companySize?: string;
  billingEmail?: string;
}

interface CompanyProfileProps {
  company: Company;
}

export function CompanyProfile({ company }: CompanyProfileProps) {
  const planColors = {
    starter: 'bg-blue-100 text-blue-800',
    professional: 'bg-purple-100 text-purple-800',
    enterprise: 'bg-orange-100 text-orange-800',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="flex items-start justify-between p-6 border-b">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">{company.name}</h2>
          <p className="text-sm text-gray-500 mt-1">
            Member since {new Date(company.createdAt).toLocaleDateString()}
          </p>
        </div>
        <Badge className={planColors[company.planTier]}>
          {company.planTier.charAt(0).toUpperCase() + company.planTier.slice(1)}
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 border-b bg-gray-50">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm font-medium text-gray-600">Total Users</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{company.userCount}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm font-medium text-gray-600">Token Usage (This Month)</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {company.tokenUsage.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm font-medium text-gray-600">Plan Tier</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {company.planTier.charAt(0).toUpperCase() + company.planTier.slice(1)}
          </p>
        </div>
      </div>

      {/* Company Details */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Address */}
          {company.address && (
            <div className="flex gap-3">
              <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-600">Address</p>
                <p className="text-sm text-gray-900 mt-1">{company.address.street}</p>
                <p className="text-sm text-gray-900">
                  {company.address.city}, {company.address.state} {company.address.postalCode}
                </p>
                <p className="text-sm text-gray-900">{company.address.country}</p>
              </div>
            </div>
          )}

          {/* Phone */}
          {company.phone && (
            <div className="flex gap-3">
              <Phone className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-600">Phone Number</p>
                <p className="text-sm text-gray-900 mt-1">{company.phone}</p>
              </div>
            </div>
          )}

          {/* Website */}
          {company.website && (
            <div className="flex gap-3">
              <Globe className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-600">Website</p>
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-indigo-600 hover:text-indigo-700 mt-1 inline-block"
                >
                  {company.website}
                </a>
              </div>
            </div>
          )}

          {/* Industry */}
          {company.industry && (
            <div className="flex gap-3">
              <Briefcase className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-600">Industry</p>
                <p className="text-sm text-gray-900 mt-1">{company.industry}</p>
              </div>
            </div>
          )}

          {/* Company Size */}
          {company.companySize && (
            <div className="flex gap-3">
              <Users className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-600">Company Size</p>
                <p className="text-sm text-gray-900 mt-1">{company.companySize}</p>
              </div>
            </div>
          )}

          {/* Billing Email */}
          {company.billingEmail && (
            <div className="flex gap-3">
              <Building2 className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-600">Billing Contact</p>
                <p className="text-sm text-gray-900 mt-1">{company.billingEmail}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
