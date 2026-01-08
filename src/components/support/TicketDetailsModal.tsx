import React, { useState } from 'react';
import Modal, { ModalBody, ModalFooter } from '../ui/Modal';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Select from '../ui/Select';
import TextArea from '../ui/TextArea';
import { SupportTicket, UpdateTicketRequest } from '../../api/support.api';
import { formatDate } from '../../utils/format';
import { Clock, User, Tag, AlertCircle } from 'lucide-react';

interface TicketDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: SupportTicket | null;
  onUpdate: (id: string, data: UpdateTicketRequest) => Promise<void>;
}

const TicketDetailsModal: React.FC<TicketDetailsModalProps> = ({
  isOpen,
  onClose,
  ticket,
  onUpdate,
}) => {
  const [status, setStatus] = useState<'open' | 'in-progress' | 'resolved' | 'closed'>(ticket?.status || 'open');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>(ticket?.priority || 'medium');
  const [reply, setReply] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  React.useEffect(() => {
    if (ticket) {
      setStatus(ticket.status);
      setPriority(ticket.priority);
      setReply('');
    }
  }, [ticket]);

  if (!ticket) return null;

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

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await onUpdate(ticket._id, {
        status,
        priority,
      });
      onClose();
    } catch (error) {
      console.error('Failed to update ticket:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ticket Details" size="lg">
      <ModalBody>
        <div className="space-y-6">
          {/* Header Info */}
          <div className="border-b border-gray-200 pb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-semibold text-gray-900">
                {ticket.subject}
              </h3>
              <span className="text-sm font-mono text-gray-500">
                {ticket.ticketNumber}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{ticket.restaurantName}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{formatDate(ticket.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Current Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Status
              </label>
              {getStatusBadge(ticket.status)}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Priority
              </label>
              {getPriorityBadge(ticket.priority)}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <div className="bg-gray-50 rounded-lg p-4 text-gray-700">
              {ticket.description}
            </div>
          </div>

          {/* Category & Assigned To */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <div className="flex items-center gap-2 text-gray-700">
                <Tag className="h-4 w-4" />
                <span>{ticket.category}</span>
              </div>
            </div>
            {ticket.assignedToName && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assigned To
                </label>
                <div className="flex items-center gap-2 text-gray-700">
                  <User className="h-4 w-4" />
                  <span>{ticket.assignedToName}</span>
                </div>
              </div>
            )}
          </div>

          {/* Update Section */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Update Ticket
            </h4>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <Select
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value as typeof status)}
                options={[
                  { value: 'open', label: 'Open' },
                  { value: 'in-progress', label: 'In Progress' },
                  { value: 'resolved', label: 'Resolved' },
                  { value: 'closed', label: 'Closed' },
                ]}
              />

              <Select
                label="Priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as typeof priority)}
                options={[
                  { value: 'low', label: 'Low' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'high', label: 'High' },
                  { value: 'urgent', label: 'Urgent' },
                ]}
              />
            </div>

            <TextArea
              label="Add Note / Reply"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Add internal notes or reply to the ticket..."
              rows={4}
            />
          </div>

          {/* Additional Info */}
          {ticket.resolvedAt && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-800">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">
                  Resolved on {formatDate(ticket.resolvedAt)}
                </span>
              </div>
            </div>
          )}
        </div>
      </ModalBody>

      <ModalFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleUpdate} isLoading={isUpdating}>
          Update Ticket
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default TicketDetailsModal;
