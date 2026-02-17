'use client';

import { useState, useRef, useEffect } from 'react';
import { Download, FileText, Table, Loader2 } from 'lucide-react';

interface ExportButtonProps {
  onExportPDF: () => void;
  onExportCSV: () => void;
  isExporting: boolean;
}

export function ExportButton({ onExportPDF, onExportCSV, isExporting }: ExportButtonProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        disabled={isExporting}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground bg-secondary rounded-md hover:bg-secondary/80 transition-colors disabled:opacity-50"
      >
        {isExporting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        {isExporting ? 'Exporting...' : 'Export'}
      </button>

      {open && !isExporting && (
        <div className="absolute right-0 top-full mt-1 bg-card border rounded-lg shadow-lg z-50 w-48 py-1">
          <button
            onClick={() => { onExportPDF(); setOpen(false); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
          >
            <FileText className="w-4 h-4 text-red-500" />
            Export PDF Report
          </button>
          <button
            onClick={() => { onExportCSV(); setOpen(false); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
          >
            <Table className="w-4 h-4 text-green-500" />
            Export CSV Data
          </button>
        </div>
      )}
    </div>
  );
}
