'use client';

import { useState } from 'react';
import type { DashboardAnalyticsData } from '@/types/analytics';

/**
 * Hook for triggering client-side PDF generation.
 * Uses jspdf + jspdf-autotable for ESRS S1 report structure.
 */
export function useExportPDF() {
  const [isExporting, setIsExporting] = useState(false);

  const trigger = async (data: DashboardAnalyticsData, companyName?: string) => {
    setIsExporting(true);
    try {
      const { default: jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      // Title
      doc.setFontSize(20);
      doc.text('ESRS S1 Compliance Report', pageWidth / 2, 20, { align: 'center' });
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleDateString('en-GB')}`, pageWidth / 2, 28, { align: 'center' });
      if (companyName) {
        doc.text(`Company: ${companyName}`, pageWidth / 2, 34, { align: 'center' });
      }

      // Executive Summary
      doc.setFontSize(14);
      doc.text('Executive Summary', 14, 48);
      autoTable(doc, {
        startY: 52,
        head: [['Metric', 'Value', 'Trend', 'Previous']],
        body: [
          ['Health Score', `${data.heroMetrics.healthScore.value}/100`, `${data.heroMetrics.healthScore.trend > 0 ? '+' : ''}${data.heroMetrics.healthScore.trend}%`, `${data.heroMetrics.healthScore.previousValue}`],
          ['CSRD Readiness', `${data.heroMetrics.csrdReadiness.value}%`, `${data.heroMetrics.csrdReadiness.trend > 0 ? '+' : ''}${data.heroMetrics.csrdReadiness.trend}%`, `${data.heroMetrics.csrdReadiness.previousValue}%`],
          ['Cost Savings', `€${data.heroMetrics.costSavings.value.toLocaleString('de-DE')}`, `${data.heroMetrics.costSavings.trend > 0 ? '+' : ''}${data.heroMetrics.costSavings.trend}%`, `€${data.heroMetrics.costSavings.previousValue.toLocaleString('de-DE')}`],
          ['Risk Reduction', `${data.heroMetrics.riskReduction.value}%`, `${data.heroMetrics.riskReduction.trend > 0 ? '+' : ''}${data.heroMetrics.riskReduction.trend}%`, `${data.heroMetrics.riskReduction.previousValue}%`],
        ],
      });

      // Module Performance
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const lastY = (doc as any).lastAutoTable?.finalY ?? 100;
      doc.setFontSize(14);
      doc.text('Module Performance', 14, lastY + 12);
      autoTable(doc, {
        startY: lastY + 16,
        head: [['Module', 'Score', 'Incidents', 'Resolved', 'Trend']],
        body: [
          ['Bias', `${data.modules.bias.score}/100`, `${data.modules.bias.incidentCount}`, `${data.modules.bias.resolvedCount}`, `${data.modules.bias.trend > 0 ? '+' : ''}${data.modules.bias.trend}%`],
          ['Tone', `${data.modules.tone.score}/100`, `${data.modules.tone.incidentCount}`, `${data.modules.tone.resolvedCount}`, `${data.modules.tone.trend > 0 ? '+' : ''}${data.modules.tone.trend}%`],
          ['Clarity', `${data.modules.clarity.score}/100`, `${data.modules.clarity.incidentCount}`, `${data.modules.clarity.resolvedCount}`, `${data.modules.clarity.trend > 0 ? '+' : ''}${data.modules.clarity.trend}%`],
        ],
      });

      // Department Rankings
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const lastY2 = (doc as any).lastAutoTable?.finalY ?? 160;
      doc.setFontSize(14);
      doc.text('Department Rankings', 14, lastY2 + 12);
      autoTable(doc, {
        startY: lastY2 + 16,
        head: [['Rank', 'Department', 'Health Score', 'Adoption Rate', 'Trend']],
        body: data.departments.map((d) => [
          `#${d.rank}`,
          d.name,
          `${d.healthScore}/100`,
          `${d.adoptionRate}%`,
          `${d.trend > 0 ? '+' : ''}${d.trend}%`,
        ]),
      });

      // Save
      doc.save(`be-inc-esrs-s1-report-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('PDF export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return { trigger, isExporting };
}
