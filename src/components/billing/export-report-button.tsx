'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface ExportReportButtonProps {
  onExport?: () => void;
}

export function ExportReportButton({ onExport }: ExportReportButtonProps) {
  const handleExport = () => {
    // Mock CSV export
    const csvContent = 'data:text/csv;charset=utf-8,Date,User,Operation,Tokens,Cost\n2025-01-15,John Doe,DEI Analysis,1500,0.23\n2025-01-14,Jane Smith,Email Generation,800,0.12';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `usage-report-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onExport?.();
  };

  return (
    <Button onClick={handleExport} variant="outline" className="gap-2">
      <Download className="w-4 h-4" />
      Export Report
    </Button>
  );
}
