import React, { useState, useEffect } from 'react';
import { FileText, AlertCircle } from 'lucide-react';
import {
  AuditLogsTable,
  AuditLogFilters,
  AuditLogDetailsModal,
  ExportLogsButton,
} from '../components/audit';
import Pagination from '../components/common/Pagination';
import LoadingState from '../components/common/LoadingState';
import { auditApi, adminsApi, AuditLog, AuditLogFilters as Filters } from '../api';

const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [admins, setAdmins] = useState<Array<{ id: string; name: string }>>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const itemsPerPage = 20;

  // Filter state
  const [filters, setFilters] = useState<{
    startDate: string;
    endDate: string;
    userId: string;
    action: string;
    resource: string;
    status: string;
  }>({
    startDate: '',
    endDate: '',
    userId: '',
    action: '',
    resource: '',
    status: '',
  });

  // Fetch admins for filter dropdown
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await adminsApi.getAll({ limit: 100 });
        setAdmins(
          response.admins.map((admin) => ({
            id: admin._id,
            name: `${admin.firstName || ''} ${admin.lastName || ''}`.trim() || admin.username,
          }))
        );
      } catch (err) {
        console.error('Failed to fetch admins:', err);
      }
    };

    fetchAdmins();
  }, []);

  // Fetch audit logs
  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Build filters
        const apiFilters: Filters = {};
        if (filters.startDate) apiFilters.startDate = filters.startDate;
        if (filters.endDate) apiFilters.endDate = filters.endDate;
        if (filters.userId) apiFilters.userId = filters.userId;
        if (filters.action) apiFilters.action = filters.action;
        if (filters.resource) apiFilters.resource = filters.resource;
        if (filters.status) apiFilters.status = filters.status as 'success' | 'failure';

        const response = await auditApi.getLogs(
          currentPage,
          itemsPerPage,
          apiFilters
        );

        setLogs(response.logs || []);
        setTotalPages(response.totalPages || 1);
        setTotalLogs(response.total || 0);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load audit logs');
        console.error('Error fetching audit logs:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, [currentPage, filters]);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleClearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      userId: '',
      action: '',
      resource: '',
      status: '',
    });
    setCurrentPage(1);
  };

  const handleLogClick = (log: AuditLog) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLog(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <FileText className="h-8 w-8 text-indigo-600" />
            <span>Audit Logs</span>
          </h1>
          <p className="mt-2 text-gray-600">
            Track and monitor all administrative actions and system events
          </p>
        </div>
        <ExportLogsButton logs={logs} filters={filters} disabled={isLoading} />
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-indigo-100 text-sm font-medium">Total Audit Logs</p>
            <p className="text-4xl font-bold mt-1">
              {(totalLogs || 0).toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-indigo-100 text-sm font-medium">Current Page</p>
            <p className="text-2xl font-semibold mt-1">
              {currentPage} / {totalPages || 1}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <AuditLogFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        admins={admins}
      />

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && <LoadingState message="Loading audit logs..." />}

      {/* Audit Logs Table */}
      {!isLoading && !error && logs.length > 0 && (
        <>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <AuditLogsTable logs={logs} onLogClick={handleLogClick} />
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Empty State */}
      {!isLoading && !error && logs.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Audit Logs Found
          </h3>
          <p className="text-gray-600">
            {filters.startDate ||
            filters.endDate ||
            filters.userId ||
            filters.action ||
            filters.resource ||
            filters.status
              ? 'No logs match the selected filters. Try adjusting your search criteria.'
              : 'There are no audit logs to display at this time.'}
          </p>
          {(filters.startDate ||
            filters.endDate ||
            filters.userId ||
            filters.action ||
            filters.resource ||
            filters.status) && (
            <button
              onClick={handleClearFilters}
              className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Details Modal */}
      <AuditLogDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        log={selectedLog}
      />
    </div>
  );
};

export default AuditLogs;
