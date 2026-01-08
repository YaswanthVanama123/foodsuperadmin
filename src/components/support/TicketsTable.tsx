import React from 'react';
import { Eye } from 'lucide-react';
import DataTable, { Column } from '../common/DataTable';
import Badge from '../ui/Badge';
import { SupportTicket } from '../../api/support.api';
import { formatDate } from '../../utils/format';

interface TicketsTableProps {
  tickets: SupportTicket[];
  isLoading?: boolean;
  onView: (ticket: SupportTicket) => void;
}

const TicketsTable: React.FC<TicketsTableProps> = ({
  tickets,
  isLoading,
  onView,
}) => {
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="danger">Urgent</Badge>;
      case 'high':
        return <Badge variant="warning">High</Badge>;
      case 'medium':
        return <Badge variant="info">Medium</Badge>;
      case 'low':
        return <Badge variant="gray">Low</Badge>;
      default:
        return <Badge variant="gray">{priority}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="info">Open</Badge>;
      case 'in-progress':
        return <Badge variant="warning">In Progress</Badge>;
      case 'resolved':
        return <Badge variant="success">Resolved</Badge>;
      case 'closed':
        return <Badge variant="gray">Closed</Badge>;
      default:
        return <Badge variant="gray">{status}</Badge>;
    }
  };

  const columns: Column<SupportTicket>[] = [
    {
      key: 'ticketNumber',
      label: 'Ticket #',
      sortable: true,
      render: (ticket) => (
        <div className="font-medium text-indigo-600">
          {ticket.ticketNumber}
        </div>
      ),
    },
    {
      key: 'restaurantName',
      label: 'Restaurant',
      sortable: true,
      render: (ticket) => (
        <div className="text-gray-900">
          {ticket.restaurantName || 'Unknown'}
        </div>
      ),
    },
    {
      key: 'subject',
      label: 'Subject',
      render: (ticket) => (
        <div>
          <div className="font-medium text-gray-900">{ticket.subject}</div>
          <div className="text-sm text-gray-500 truncate max-w-xs">
            {ticket.description}
          </div>
        </div>
      ),
    },
    {
      key: 'priority',
      label: 'Priority',
      sortable: true,
      render: (ticket) => getPriorityBadge(ticket.priority),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (ticket) => getStatusBadge(ticket.status),
    },
    {
      key: 'createdAt',
      label: 'Created Date',
      sortable: true,
      render: (ticket) => (
        <div className="text-sm text-gray-700">
          {formatDate(ticket.createdAt)}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (ticket) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onView(ticket);
          }}
          className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
          title="View Details"
        >
          <Eye className="h-4 w-4" />
        </button>
      ),
    },
  ];

  return (
    <DataTable
      data={tickets}
      columns={columns}
      isLoading={isLoading}
      emptyMessage="No tickets found"
      rowKey="_id"
      onRowClick={onView}
    />
  );
};

export default TicketsTable;
