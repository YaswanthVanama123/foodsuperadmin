import React from 'react';
import Select from '../ui/Select';

interface TicketFiltersProps {
  status: string;
  priority: string;
  onStatusChange: (status: string) => void;
  onPriorityChange: (priority: string) => void;
}

const TicketFilters: React.FC<TicketFiltersProps> = ({
  status,
  priority,
  onStatusChange,
  onPriorityChange,
}) => {
  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'open', label: 'Open' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' },
  ];

  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex-1 min-w-[200px]">
        <Select
          label="Status"
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          options={statusOptions}
        />
      </div>

      <div className="flex-1 min-w-[200px]">
        <Select
          label="Priority"
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value)}
          options={priorityOptions}
        />
      </div>
    </div>
  );
};

export default TicketFilters;
