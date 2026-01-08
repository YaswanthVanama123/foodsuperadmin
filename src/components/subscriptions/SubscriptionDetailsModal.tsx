import React from 'react';
import Modal, { ModalBody, ModalFooter } from '../ui/Modal';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { Subscription } from '../../api/subscriptions.api';
import { formatCurrency, formatDate } from '../../utils/format';
import {
  Building2,
  CreditCard,
  Calendar,
  DollarSign,
  Clock,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';

interface SubscriptionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: Subscription | null;
}

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'active':
      return 'success';
    case 'expired':
      return 'danger';
    case 'cancelled':
      return 'gray';
    case 'pending':
      return 'warning';
    default:
      return 'gray';
  }
};

const SubscriptionDetailsModal: React.FC<SubscriptionDetailsModalProps> = ({
  isOpen,
  onClose,
  subscription,
}) => {
  if (!subscription) return null;

  const daysRemaining = Math.ceil(
    (new Date(subscription.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Subscription Details" size="lg">
      <ModalBody>
        <div className="space-y-6">
          {/* Header with Status */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {subscription.restaurantName || 'Restaurant'}
              </h3>
              <p className="text-sm text-gray-500">ID: {subscription.restaurantId}</p>
            </div>
            <Badge variant={getStatusBadgeVariant(subscription.status)} size="lg">
              {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
            </Badge>
          </div>

          {/* Plan Information */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <CreditCard className="h-5 w-5 text-indigo-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Plan</p>
                <p className="font-semibold text-gray-900">{subscription.planName || 'N/A'}</p>
                <p className="text-xs text-gray-500 capitalize mt-0.5">
                  {subscription.billingCycle} billing
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <DollarSign className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="font-semibold text-gray-900">
                  {formatCurrency(subscription.amount)}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{subscription.currency}</p>
              </div>
            </div>
          </div>

          {/* Date Information */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <Calendar className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Start Date</p>
                <p className="font-semibold text-gray-900">
                  {formatDate(subscription.startDate)}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Calendar className="h-5 w-5 text-orange-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">End Date</p>
                <p className="font-semibold text-gray-900">
                  {formatDate(subscription.endDate)}
                </p>
                {subscription.status === 'active' && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {daysRemaining > 0
                      ? `${daysRemaining} days remaining`
                      : 'Expired'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <RefreshCw className="h-5 w-5 text-purple-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Auto Renewal</p>
                <p className="font-semibold text-gray-900">
                  {subscription.autoRenew ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>

            {subscription.renewalDate && (
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-teal-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Next Renewal</p>
                  <p className="font-semibold text-gray-900">
                    {formatDate(subscription.renewalDate)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Usage Statistics */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              <h4 className="text-sm font-semibold text-indigo-900">Usage Statistics</h4>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-indigo-900">--</p>
                <p className="text-xs text-indigo-700">Orders</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-indigo-900">--</p>
                <p className="text-xs text-indigo-700">Menu Items</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-indigo-900">--</p>
                <p className="text-xs text-indigo-700">Tables</p>
              </div>
            </div>
            <p className="text-xs text-indigo-600 text-center mt-3">
              Usage data will be available soon
            </p>
          </div>

          {/* Payment History */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Building2 className="h-5 w-5 text-gray-400" />
              <h4 className="text-sm font-semibold text-gray-900">Payment History</h4>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Initial Payment</p>
                    <p className="text-xs text-gray-500">{formatDate(subscription.createdAt)}</p>
                  </div>
                  <Badge variant="success" size="sm">
                    Paid
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 text-center py-2">
                  No additional payment history available
                </p>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
              <div>
                <span className="font-medium">Created:</span>{' '}
                {formatDate(subscription.createdAt)}
              </div>
              <div>
                <span className="font-medium">Last Updated:</span>{' '}
                {formatDate(subscription.updatedAt)}
              </div>
            </div>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default SubscriptionDetailsModal;
