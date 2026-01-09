import React, { useState, useEffect } from 'react';
import { Ticket, Search, RefreshCw } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { TicketsTable, TicketDetailsModal, TicketFilters } from '../components/support';
import { supportApi, SupportTicket, UpdateTicketRequest } from '../api';

const Support: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    filterTickets();
  }, [tickets, searchQuery, statusFilter, priorityFilter]);

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const response = await supportApi.getTickets();
      setTickets(response.tickets);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterTickets = () => {
    let filtered = [...tickets];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (ticket) =>
          ticket.ticketNumber?.toLowerCase().includes(query) ||
          ticket.subject.toLowerCase().includes(query) ||
          ticket.description?.toLowerCase().includes(query) ||
          ticket.restaurantName?.toLowerCase().includes(query)
      );
    }

    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter((ticket) => ticket.status === statusFilter);
    }

    // Filter by priority
    if (priorityFilter) {
      filtered = filtered.filter((ticket) => ticket.priority === priorityFilter);
    }

    setFilteredTickets(filtered);
  };

  const handleViewTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const handleUpdateTicket = async (id: string, data: UpdateTicketRequest) => {
    try {
      const updatedTicket = await supportApi.updateTicket(id, data);
      setTickets((prev) =>
        prev.map((ticket) => (ticket._id === id ? updatedTicket : ticket))
      );
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to update ticket:', error);
      throw error;
    }
  };

  const getStatusCounts = () => {
    return {
      total: tickets.length,
      open: tickets.filter((t) => t.status === 'open').length,
      inProgress: tickets.filter((t) => t.status === 'in-progress').length,
      resolved: tickets.filter((t) => t.status === 'resolved').length,
      closed: tickets.filter((t) => t.status === 'closed').length,
    };
  };

  const counts = getStatusCounts();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Ticket className="h-8 w-8 text-indigo-600" />
            Support Tickets
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and respond to restaurant support requests
          </p>
        </div>
        <Button onClick={fetchTickets} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <div className="p-6">
            <div className="text-sm font-medium text-gray-600">Total Tickets</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">
              {counts.total}
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="text-sm font-medium text-gray-600">Open</div>
            <div className="text-3xl font-bold text-blue-600 mt-2">
              {counts.open}
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="text-sm font-medium text-gray-600">In Progress</div>
            <div className="text-3xl font-bold text-yellow-600 mt-2">
              {counts.inProgress}
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="text-sm font-medium text-gray-600">Resolved</div>
            <div className="text-3xl font-bold text-green-600 mt-2">
              {counts.resolved}
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="text-sm font-medium text-gray-600">Closed</div>
            <div className="text-3xl font-bold text-gray-600 mt-2">
              {counts.closed}
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <div className="p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search tickets by number, subject, or restaurant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <TicketFilters
              status={statusFilter}
              priority={priorityFilter}
              onStatusChange={setStatusFilter}
              onPriorityChange={setPriorityFilter}
            />
          </div>
        </div>
      </Card>

      {/* Tickets Table */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              All Tickets ({filteredTickets.length})
            </h2>
          </div>
          <TicketsTable
            tickets={filteredTickets}
            isLoading={isLoading}
            onView={handleViewTicket}
          />
        </div>
      </Card>

      {/* Ticket Details Modal */}
      <TicketDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        ticket={selectedTicket}
        onUpdate={handleUpdateTicket}
      />
    </div>
  );
};

export default Support;
