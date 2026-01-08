import React from 'react';
import Modal, { ModalBody } from '../ui/Modal';
import { AuditLog } from '../../api';
import { Clock, User, Activity, Folder, CheckCircle, XCircle, Globe } from 'lucide-react';

interface AuditLogDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  log: AuditLog | null;
}

const AuditLogDetailsModal: React.FC<AuditLogDetailsModalProps> = ({
  isOpen,
  onClose,
  log,
}) => {
  if (!log) return null;

  const getStatusIcon = (status: string) => {
    return status === 'success' ? (
      <CheckCircle className="h-5 w-5 text-green-600" />
    ) : (
      <XCircle className="h-5 w-5 text-red-600" />
    );
  };

  const getActionColor = (action: string) => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('create')) return 'text-green-700';
    if (actionLower.includes('delete')) return 'text-red-700';
    if (actionLower.includes('update')) return 'text-blue-700';
    if (actionLower.includes('login')) return 'text-purple-700';
    return 'text-gray-700';
  };

  const formatDate = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
      });
    } catch (error) {
      return timestamp;
    }
  };

  const renderDetails = () => {
    if (!log.details || Object.keys(log.details).length === 0) {
      return (
        <p className="text-sm text-gray-500 italic">No additional details available</p>
      );
    }

    // Check for before/after values (for updates)
    if (log.details.before && log.details.after) {
      return (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Before:</h4>
            <pre className="text-xs text-gray-700 bg-red-50 p-4 rounded-lg border border-red-200 overflow-x-auto font-mono">
              {JSON.stringify(log.details.before, null, 2)}
            </pre>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">After:</h4>
            <pre className="text-xs text-gray-700 bg-green-50 p-4 rounded-lg border border-green-200 overflow-x-auto font-mono">
              {JSON.stringify(log.details.after, null, 2)}
            </pre>
          </div>
          {log.details.changes && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Changes:</h4>
              <div className="space-y-2">
                {Object.entries(log.details.changes).map(([key, value]) => (
                  <div
                    key={key}
                    className="text-sm bg-blue-50 p-2 rounded border border-blue-200"
                  >
                    <span className="font-medium text-blue-900">{key}:</span>{' '}
                    <span className="text-blue-700">{JSON.stringify(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    // Regular details
    return (
      <pre className="text-xs text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto font-mono">
        {JSON.stringify(log.details, null, 2)}
      </pre>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Audit Log Details" size="lg">
      <ModalBody className="space-y-6">
        {/* Status Banner */}
        <div
          className={`flex items-center justify-between p-4 rounded-lg ${
            log.status === 'success' ? 'bg-green-50' : 'bg-red-50'
          }`}
        >
          <div className="flex items-center space-x-3">
            {getStatusIcon(log.status)}
            <span
              className={`text-lg font-semibold ${
                log.status === 'success' ? 'text-green-900' : 'text-red-900'
              }`}
            >
              {log.status.toUpperCase()}
            </span>
          </div>
          <span className={`text-2xl font-bold ${getActionColor(log.action)}`}>
            {log.action}
          </span>
        </div>

        {/* Main Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Timestamp */}
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="h-4 w-4" />
              <span className="text-xs font-medium uppercase">Timestamp</span>
            </div>
            <p className="text-sm text-gray-900 font-medium">
              {formatDate(log.timestamp)}
            </p>
          </div>

          {/* Admin */}
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-gray-600">
              <User className="h-4 w-4" />
              <span className="text-xs font-medium uppercase">Admin</span>
            </div>
            <p className="text-sm text-gray-900 font-medium">{log.username}</p>
            <p className="text-xs text-gray-500 font-mono">{log.userId}</p>
          </div>

          {/* Action */}
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-gray-600">
              <Activity className="h-4 w-4" />
              <span className="text-xs font-medium uppercase">Action</span>
            </div>
            <p className={`text-sm font-semibold ${getActionColor(log.action)}`}>
              {log.action}
            </p>
          </div>

          {/* Resource */}
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-gray-600">
              <Folder className="h-4 w-4" />
              <span className="text-xs font-medium uppercase">Resource</span>
            </div>
            <p className="text-sm text-gray-900 font-medium">{log.resource}</p>
            {log.resourceId && (
              <p className="text-xs text-gray-500 font-mono">{log.resourceId}</p>
            )}
          </div>

          {/* IP Address */}
          {log.ipAddress && (
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-gray-600">
                <Globe className="h-4 w-4" />
                <span className="text-xs font-medium uppercase">IP Address</span>
              </div>
              <p className="text-sm text-gray-900 font-mono">{log.ipAddress}</p>
            </div>
          )}

          {/* Log ID */}
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-gray-600">
              <Activity className="h-4 w-4" />
              <span className="text-xs font-medium uppercase">Log ID</span>
            </div>
            <p className="text-xs text-gray-500 font-mono">{log.id}</p>
          </div>
        </div>

        {/* User Agent */}
        {log.userAgent && (
          <div className="space-y-2">
            <h4 className="text-xs font-medium uppercase text-gray-600">User Agent</h4>
            <p className="text-xs text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono break-all">
              {log.userAgent}
            </p>
          </div>
        )}

        {/* Details Section */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium uppercase text-gray-600">Details</h4>
          {renderDetails()}
        </div>
      </ModalBody>
    </Modal>
  );
};

export default AuditLogDetailsModal;
