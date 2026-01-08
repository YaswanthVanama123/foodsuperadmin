import React from 'react';
import { Edit, Trash2, KeyRound, Eye } from 'lucide-react';
import DataTable, { Column } from '../common/DataTable';
import Badge from '../ui/Badge';
import { Admin } from '../../api/admins.api';

interface AdminsTableProps {
  admins: Admin[];
  isLoading?: boolean;
  onEdit: (admin: Admin) => void;
  onDelete: (admin: Admin) => void;
  onResetPassword: (admin: Admin) => void;
  onViewDetails: (admin: Admin) => void;
}

const AdminsTable: React.FC<AdminsTableProps> = ({
  admins,
  isLoading,
  onEdit,
  onDelete,
  onResetPassword,
  onViewDetails,
}) => {
  const columns: Column<Admin>[] = [
    {
      key: 'username',
      label: 'Username',
      sortable: true,
      render: (admin) => (
        <div className="font-medium text-gray-900">{admin.username}</div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      render: (admin) => (
        <div className="text-gray-600">{admin.email}</div>
      ),
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (admin) => (
        <div className="text-gray-900">
          {admin.firstName} {admin.lastName}
        </div>
      ),
    },
    {
      key: 'restaurantName',
      label: 'Restaurant',
      sortable: true,
      render: (admin) => (
        <div className="text-gray-900">
          {typeof admin.restaurantId === 'string' ? admin.restaurantId : admin.restaurantId.name}
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (admin) => (
        <Badge variant="primary" size="sm">
          {admin.role}
        </Badge>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (admin) => (
        <Badge
          variant={admin.isActive ? 'success' : 'gray'}
          size="sm"
        >
          {admin.isActive ? 'active' : 'inactive'}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (admin) => (
        <div className="text-gray-600 text-sm">
          {new Date(admin.createdAt).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (admin) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(admin);
            }}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(admin);
            }}
            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Edit Admin"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onResetPassword(admin);
            }}
            className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
            title="Reset Password"
          >
            <KeyRound className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(admin);
            }}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Admin"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={admins}
      columns={columns}
      isLoading={isLoading}
      emptyMessage="No admins found"
      rowKey="_id"
    />
  );
};

export default AdminsTable;
