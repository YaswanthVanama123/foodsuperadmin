import React, { useState } from 'react';
import Modal, { ModalBody, ModalFooter } from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { ReportType } from './ReportCard';
import { Download, FileText, Loader2 } from 'lucide-react';

interface ReportGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  reportType: ReportType | null;
  reportTitle: string;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({
  isOpen,
  onClose,
  reportType,
  reportTitle,
}) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [format, setFormat] = useState<'pdf' | 'csv'>('pdf');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [progress, setProgress] = useState(0);

  React.useEffect(() => {
    if (isOpen) {
      // Set default dates (last 30 days)
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 30);

      setStartDate(start.toISOString().split('T')[0]);
      setEndDate(end.toISOString().split('T')[0]);
      setIsGenerated(false);
      setProgress(0);
    }
  }, [isOpen]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setProgress(0);

    // Simulate report generation with progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          setIsGenerated(true);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleDownload = () => {
    // Simulate download
    console.log('Downloading report:', {
      type: reportType,
      startDate,
      endDate,
      format,
    });

    // In production, this would trigger an actual download
    alert(`Report would be downloaded as ${format.toUpperCase()}`);
  };

  const handleClose = () => {
    setIsGenerated(false);
    setProgress(0);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={reportTitle} size="md">
      <ModalBody>
        <div className="space-y-6">
          {/* Date Range Selection */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Select Date Range
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="date"
                label="Start Date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <Input
                type="date"
                label="End Date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* Quick Date Presets */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Quick Select
            </h4>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Last 7 Days', days: 7 },
                { label: 'Last 30 Days', days: 30 },
                { label: 'Last 90 Days', days: 90 },
                { label: 'This Year', days: new Date().getDayOfYear() },
              ].map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => {
                    const end = new Date();
                    const start = new Date();
                    start.setDate(start.getDate() - preset.days);
                    setStartDate(start.toISOString().split('T')[0]);
                    setEndDate(end.toISOString().split('T')[0]);
                  }}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Format Selection */}
          <Select
            label="Export Format"
            value={format}
            onChange={(e) => setFormat(e.target.value as 'pdf' | 'csv')}
            options={[
              { value: 'pdf', label: 'PDF Document' },
              { value: 'csv', label: 'CSV Spreadsheet' },
            ]}
          />

          {/* Additional Parameters based on report type */}
          {reportType === 'restaurant-performance' && (
            <Select
              label="Performance Metric"
              options={[
                { value: 'all', label: 'All Metrics' },
                { value: 'revenue', label: 'Revenue Only' },
                { value: 'engagement', label: 'Engagement Only' },
                { value: 'subscriptions', label: 'Subscriptions Only' },
              ]}
            />
          )}

          {reportType === 'subscription' && (
            <Select
              label="Subscription Status"
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'active', label: 'Active Only' },
                { value: 'cancelled', label: 'Cancelled Only' },
                { value: 'expiring', label: 'Expiring Soon' },
              ]}
            />
          )}

          {/* Progress Indicator */}
          {isGenerating && (
            <div className="bg-indigo-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Loader2 className="h-5 w-5 text-indigo-600 animate-spin" />
                <span className="text-sm font-medium text-indigo-900">
                  Generating report... {progress}%
                </span>
              </div>
              <div className="w-full bg-indigo-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Success State */}
          {isGenerated && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-900">
                    Report generated successfully!
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    Your report is ready to download
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </ModalBody>

      <ModalFooter>
        <Button variant="outline" onClick={handleClose}>
          Cancel
        </Button>
        {isGenerated ? (
          <Button onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download {format.toUpperCase()}
          </Button>
        ) : (
          <Button
            onClick={handleGenerate}
            isLoading={isGenerating}
            disabled={!startDate || !endDate || isGenerating}
          >
            Generate Report
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
};

// Helper function for day of year (for quick select)
declare global {
  interface Date {
    getDayOfYear(): number;
  }
}

Date.prototype.getDayOfYear = function () {
  const start = new Date(this.getFullYear(), 0, 0);
  const diff = this.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

export default ReportGenerator;
