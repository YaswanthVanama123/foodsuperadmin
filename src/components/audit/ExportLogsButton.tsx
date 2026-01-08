import React, { useState } from 'react';
import { Download } from 'lucide-react';
import Button from '../ui/Button';
import { AuditLog } from '../../api';

interface ExportLogsButtonProps {
  logs: AuditLog[];
  filters?: any;
  disabled?: boolean;
}

const ExportLogsButton: React.FC<ExportLogsButtonProps> = ({
  logs,
  filters,
  disabled = false,
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const convertToCSV = (data: AuditLog[]): string => {
    if (data.length === 0) return '';

    // CSV Headers
    const headers = [
      'ID',
      'Timestamp',
      'Admin',
      'User ID',
      'Action',
      'Resource',
      'Resource ID',
      'Status',
      'IP Address',
      'User Agent',
      'Details',
    ];

    // CSV Rows
    const rows = data.map((log) => [
      log.id,
      new Date(log.timestamp).toISOString(),
      log.username,
      log.userId,
      log.action,
      log.resource,
      log.resourceId || '',
      log.status,
      log.ipAddress || '',
      log.userAgent || '',
      log.details ? JSON.stringify(log.details) : '',
    ]);

    // Escape and format CSV
    const escapeCsvValue = (value: string) => {
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map(escapeCsvValue).join(',')),
    ].join('\n');

    return csvContent;
  };

  const downloadCSV = (csvContent: string, filename: string) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    setIsExporting(true);

    try {
      // Simulate processing time for large datasets
      await new Promise((resolve) => setTimeout(resolve, 500));

      const csvContent = convertToCSV(logs);
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `audit-logs-${timestamp}.csv`;

      downloadCSV(csvContent, filename);
    } catch (error) {
      console.error('Error exporting logs:', error);
      alert('Failed to export logs. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleExport}
      disabled={disabled || logs.length === 0 || isExporting}
      isLoading={isExporting}
    >
      <Download className="h-4 w-4 mr-2" />
      {isExporting ? 'Exporting...' : 'Export CSV'}
    </Button>
  );
};

export default ExportLogsButton;
