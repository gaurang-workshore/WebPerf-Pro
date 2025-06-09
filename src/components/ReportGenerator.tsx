import React from 'react';
import { Download, FileText, Share2 } from 'lucide-react';
import { AnalysisResult } from '../types';
import jsPDF from 'jspdf';

interface ReportGeneratorProps {
  result: AnalysisResult;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ result }) => {
  const generatePDFReport = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    let yPosition = margin;

    // Title
    doc.setFontSize(20);
    doc.text('WebPerf Pro Analysis Report', margin, yPosition);
    yPosition += 15;

    // URL and Date
    doc.setFontSize(12);
    doc.text(`URL: ${result.url}`, margin, yPosition);
    yPosition += 8;
    doc.text(`Date: ${new Date(result.timestamp).toLocaleDateString()}`, margin, yPosition);
    yPosition += 15;

    // Performance Summary
    doc.setFontSize(16);
    doc.text('Performance Summary', margin, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    const performanceData = [
      `Load Time: ${result.performance.loadTime}ms`,
      `First Contentful Paint: ${result.performance.firstContentfulPaint}ms`,
      `Largest Contentful Paint: ${result.performance.largestContentfulPaint}ms`,
      `Total Requests: ${result.performance.requests}`,
      `Total Size: ${(result.performance.totalBytes / 1024 / 1024).toFixed(2)}MB`
    ];

    performanceData.forEach(line => {
      doc.text(line, margin, yPosition);
      yPosition += 6;
    });

    yPosition += 10;

    // Core Web Vitals
    doc.setFontSize(16);
    doc.text('Core Web Vitals', margin, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    const vitalsData = [
      `LCP: ${result.performance.coreWebVitals.lcp.value}ms (${result.performance.coreWebVitals.lcp.rating})`,
      `FID: ${result.performance.coreWebVitals.fid.value}ms (${result.performance.coreWebVitals.fid.rating})`,
      `CLS: ${result.performance.coreWebVitals.cls.value.toFixed(3)} (${result.performance.coreWebVitals.cls.rating})`
    ];

    vitalsData.forEach(line => {
      doc.text(line, margin, yPosition);
      yPosition += 6;
    });

    yPosition += 10;

    // Security Summary
    doc.setFontSize(16);
    doc.text('Security Summary', margin, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.text(`Security Score: ${result.security.score}/100`, margin, yPosition);
    yPosition += 8;
    doc.text(`Issues Found: ${result.security.issues.length}`, margin, yPosition);
    yPosition += 8;
    doc.text(`HTTPS: ${result.security.encryption.https ? 'Enabled' : 'Disabled'}`, margin, yPosition);
    yPosition += 8;
    doc.text(`TLS Version: ${result.security.encryption.tlsVersion}`, margin, yPosition);

    // Security Issues
    if (result.security.issues.length > 0) {
      yPosition += 15;
      doc.setFontSize(14);
      doc.text('Security Issues', margin, yPosition);
      yPosition += 8;

      doc.setFontSize(9);
      result.security.issues.forEach(issue => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = margin;
        }
        doc.text(`${issue.severity.toUpperCase()}: ${issue.type}`, margin, yPosition);
        yPosition += 5;
        const description = doc.splitTextToSize(issue.description, pageWidth - margin * 2);
        doc.text(description, margin + 5, yPosition);
        yPosition += description.length * 4 + 5;
      });
    }

    // Save the PDF
    doc.save(`webperf-analysis-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const exportJSON = () => {
    const dataStr = JSON.stringify(result, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `webperf-analysis-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const shareReport = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'WebPerf Pro Analysis Report',
          text: `Performance analysis results for ${result.url}`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      const summary = `WebPerf Pro Analysis Report
URL: ${result.url}
Load Time: ${result.performance.loadTime}ms
Security Score: ${result.security.score}/100
Generated: ${new Date(result.timestamp).toLocaleDateString()}`;
      
      navigator.clipboard.writeText(summary);
      alert('Report summary copied to clipboard!');
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <FileText className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Export Report</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={generatePDFReport}
          className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>PDF Report</span>
        </button>

        <button
          onClick={exportJSON}
          className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>JSON Data</span>
        </button>

        <button
          onClick={shareReport}
          className="flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>
      </div>

      <div className="mt-4 p-4 bg-gray-700 rounded-lg">
        <h4 className="text-sm font-medium text-white mb-2">Report Includes</h4>
        <ul className="text-xs text-gray-300 space-y-1">
          <li>• Complete performance metrics and Core Web Vitals</li>
          <li>• Security audit results and recommendations</li>
          <li>• Asset breakdown and optimization suggestions</li>
          <li>• Request waterfall and timing analysis</li>
          <li>• Authentication and encryption assessment</li>
        </ul>
      </div>
    </div>
  );
};

export default ReportGenerator;