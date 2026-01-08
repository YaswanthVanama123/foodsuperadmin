import React, { useState, useEffect } from 'react';
import Modal, { ModalBody } from '../ui/Modal';
import Badge from '../ui/Badge';
import LoadingState from '../common/LoadingState';
import { Admin, ActivityLog } from '../../api/admins.api';
import adminsApi from '../../api/admins.api';
import { User, Mail, Building2, Shield, Calendar, Activity } from 'lucide-react';

interface AdminDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  admin: Admin | null;
}

const AdminDetailsModal: React.FC<AdminDetailsModalProps> = ({
  isOpen,
  onClose,
  admin,
}) => {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(false);

  useEffect(() => {
    if (isOpen && admin) {
      loadActivity();
    }
  }, [isOpen, admin]);

  const loadActivity = async () => {
    if (!admin) return;

    try {
      setLoadingActivity(true);
      const logs = await adminsApi.getActivity(admin._id);
      setActivityLogs(logs);
    } catch (error) {
      console.error('Error loading activity logs:', error);
      setActivityLogs([]);
    } finally {
      setLoadingActivity(false);
    }
  };

  if (!admin) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Admin Details"
      size="lg"
    >
      <ModalBody>
        <div className="space-y-6">
          {/* Admin Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Personal Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Name</label>
                <p className="text-gray-900 mt-1">
                  {admin.firstName} {admin.lastName}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Username</label>
                <p className="text-gray-900 mt-1">{admin.username}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-gray-900 mt-1 flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  {admin.email}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <div className="mt-1">
                  <Badge
                    variant={admin.isActive ? 'success' : 'gray'}
                    size="sm"
                  >
                    {admin.isActive ? 'active' : 'inactive'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Restaurant & Role */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              Assignment Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Restaurant</label>
                <p className="text-gray-900 mt-1">
                  {typeof admin.restaurantId === 'string' ? admin.restaurantId : admin.restaurantId.name}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Role</label>
                <div className="mt-1 flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-gray-400" />
                  <Badge variant="primary" size="sm">
                    {admin.role}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Timeline
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Created</label>
                <p className="text-gray-900 mt-1">
                  {new Date(admin.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Last Updated</label>
                <p className="text-gray-900 mt-1">
                  {new Date(admin.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Activity History */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Recent Activity
            </h3>

            {loadingActivity ? (
              <LoadingState message="Loading activity..." />
            ) : activityLogs.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {activityLogs.map((log) => (
                  <div
                    key={log.id}
                    className="bg-white rounded-lg p-3 border border-gray-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {log.action}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          Resource: {log.resource}
                        </p>
                        {log.details && (
                          <p className="text-xs text-gray-500 mt-1">
                            {typeof log.details === 'string'
                              ? log.details
                              : JSON.stringify(log.details)}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No recent activity found
              </p>
            )}
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default AdminDetailsModal;
