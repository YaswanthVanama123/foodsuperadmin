import React, { useState } from 'react';
import { FileText, Calendar } from 'lucide-react';
import Card from '../components/ui/Card';
import { ReportCard, ReportGenerator, getReportConfig, ReportType } from '../components/reports';

const Reports: React.FC = () => {
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState<ReportType | null>(null);
  const [selectedReportTitle, setSelectedReportTitle] = useState('');

  const reportTypes: ReportType[] = [
    'revenue',
    'restaurant-performance',
    'subscription',
    'user-activity',
  ];

  const handleGenerateReport = (type: ReportType) => {
    const config = getReportConfig(type);
    setSelectedReportType(type);
    setSelectedReportTitle(config.title);
    setIsGeneratorOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="h-8 w-8 text-indigo-600" />
            Reports
          </h1>
          <p className="text-gray-600 mt-1">
            Generate comprehensive reports and analytics
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <Calendar className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Pre-built Reports
              </h3>
              <p className="text-sm text-gray-700">
                Select a report type below, choose your date range and parameters, then generate and download in PDF or CSV format.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportTypes.map((type) => {
          const config = getReportConfig(type);
          return (
            <ReportCard
              key={type}
              type={type}
              title={config.title}
              description={config.description}
              icon={config.icon}
              onGenerate={() => handleGenerateReport(type)}
            />
          );
        })}
      </div>

      {/* Additional Info Section */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Report Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Flexible Date Ranges
              </h3>
              <p className="text-sm text-gray-600">
                Select custom date ranges or use quick presets like Last 7 Days, Last 30 Days, or This Year.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Multiple Formats
              </h3>
              <p className="text-sm text-gray-600">
                Download reports in PDF for presentation or CSV for further analysis in spreadsheet applications.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Real-time Data
              </h3>
              <p className="text-sm text-gray-600">
                All reports are generated with the latest data from your platform for accurate insights.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Scheduled Reports Section */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Scheduled Reports
          </h2>
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-2">
              Automated report scheduling coming soon
            </p>
            <p className="text-sm text-gray-500">
              Set up automatic report generation and email delivery on a recurring schedule.
            </p>
          </div>
        </div>
      </Card>

      {/* Report Generator Modal */}
      <ReportGenerator
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        reportType={selectedReportType}
        reportTitle={selectedReportTitle}
      />
    </div>
  );
};

export default Reports;
