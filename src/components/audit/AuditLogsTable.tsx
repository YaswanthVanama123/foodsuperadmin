import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { AuditLog } from '../../api';
import { formatDistanceToNow } from 'date-fns';

interface AuditLogsTableProps {
  logs: AuditLog[];
  onLogClick?: (log: AuditLog) => void;
}

const AuditLogsTable: React.FC<AuditLogsTableProps> = ({ logs, onLogClick }) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const getActionColor = (action: string) => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('create')) {
      return 'bg-green-100 text-green-800 border-green-200';
    } else if (actionLower.includes('delete')) {
      return 'bg-red-100 text-red-800 border-red-200';
    } else if (actionLower.includes('update')) {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    } else if (actionLower.includes('login')) {
      return 'bg-purple-100 text-purple-800 border-purple-200';
    } else if (actionLower.includes('logout')) {
      return 'bg-gray-100 text-gray-800 border-gray-200';
    }
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusColor = (status: string) => {
    return status === 'success'
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-red-100 text-red-800 border-red-200';
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return {
        relative: formatDistanceToNow(date, { addSuffix: true }),
        absolute: date.toLocaleString(),
      };
    } catch (error) {
      return {
        relative: 'Unknown',
        absolute: timestamp,
      };
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-8 px-4 py-3"></th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Timestamp
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Admin
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Action
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Resource
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              IP Address
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {logs.map((log) => {
            const isExpanded = expandedRows.has(log.id);
            const timestamp = formatTimestamp(log.timestamp);

            return (
              <React.Fragment key={log.id}>
                <tr
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => onLogClick?.(log)}
                >
                  <td className="px-4 py-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleRow(log.id);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{timestamp.relative}</div>
                    <div className="text-xs text-gray-500">{timestamp.absolute}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {log.username}
                    </div>
                    <div className="text-xs text-gray-500">{log.userId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border ${getActionColor(
                        log.action
                      )}`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{log.resource}</div>
                    {log.resourceId && (
                      <div className="text-xs text-gray-500 font-mono">
                        {log.resourceId}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border ${getStatusColor(
                        log.status
                      )}`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                    {log.ipAddress || 'N/A'}
                  </td>
                </tr>
                {isExpanded && (
                  <tr className="bg-gray-50">
                    <td colSpan={7} className="px-6 py-4">
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-gray-700">
                          Details
                        </h4>
                        {log.userAgent && (
                          <div>
                            <span className="text-xs font-medium text-gray-600">
                              User Agent:
                            </span>
                            <p className="text-xs text-gray-500 mt-1 font-mono">
                              {log.userAgent}
                            </p>
                          </div>
                        )}
                        {log.details && Object.keys(log.details).length > 0 && (
                          <div>
                            <span className="text-xs font-medium text-gray-600">
                              Additional Details:
                            </span>
                            <pre className="mt-1 text-xs text-gray-700 bg-white p-3 rounded-lg border border-gray-200 overflow-x-auto font-mono">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AuditLogsTable;
