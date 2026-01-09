import React, { useState, useEffect } from 'react';
import Modal, { ModalBody, ModalFooter } from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { CreateSubscriptionRequest } from '../../api/subscriptions.api';
import { Plan } from '../../api/plans.api';
import { Restaurant } from '../../api/restaurants.api';

interface SubscriptionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSubscriptionRequest) => void;
  isLoading?: boolean;
  restaurants: Restaurant[];
  plans: Plan[];
  mode?: 'create' | 'extend';
  initialData?: Partial<CreateSubscriptionRequest>;
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  restaurants,
  plans,
  mode = 'create',
  initialData,
}) => {
  const [formData, setFormData] = useState<CreateSubscriptionRequest>({
    restaurantId: '',
    planId: '',
    startDate: new Date().toISOString().split('T')[0],
    billingCycle: 'monthly',
    autoRenew: true,
  });

  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [calculatedPrice, setCalculatedPrice] = useState<number>(0);

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  useEffect(() => {
    if (formData.planId) {
      const plan = plans.find((p) => p._id === formData.planId);
      if (plan) {
        setSelectedPlan(plan);
        const basePrice = plan.price;
        const price = formData.billingCycle === 'yearly' ? basePrice * 12 * 0.8 : basePrice;
        setCalculatedPrice(price);
      }
    }
  }, [formData.planId, formData.billingCycle, plans]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const calculateEndDate = (startDate: string, billingCycle: 'monthly' | 'yearly'): string => {
    const start = new Date(startDate);
    if (billingCycle === 'yearly') {
      start.setFullYear(start.getFullYear() + 1);
    } else {
      start.setMonth(start.getMonth() + 1);
    }
    return start.toISOString().split('T')[0];
  };

  const endDate = formData.startDate
    ? calculateEndDate(formData.startDate, formData.billingCycle)
    : '';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Create New Subscription' : 'Extend Subscription'}
      size="md"
    >
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <div className="space-y-4">
            {/* Restaurant Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Restaurant
              </label>
              <Select
                name="restaurantId"
                value={formData.restaurantId}
                onChange={handleChange}
                required
                disabled={mode === 'extend'}
              >
                <option value="">Select Restaurant</option>
                {restaurants.map((restaurant) => (
                  <option key={restaurant._id} value={restaurant._id}>
                    {restaurant.name}
                  </option>
                ))}
              </Select>
            </div>

            {/* Plan Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subscription Plan
              </label>
              <Select
                name="planId"
                value={formData.planId}
                onChange={handleChange}
                required
              >
                <option value="">Select Plan</option>
                {plans.map((plan) => (
                  <option key={plan._id} value={plan._id}>
                    {plan.name} - ${plan.price}/{plan.billingCycle}
                  </option>
                ))}
              </Select>
            </div>

            {/* Billing Cycle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Billing Cycle
              </label>
              <Select
                name="billingCycle"
                value={formData.billingCycle}
                onChange={handleChange}
                required
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly (20% off)</option>
              </Select>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <Input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>

            {/* End Date (Calculated) */}
            {endDate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date (Calculated)
                </label>
                <Input type="date" value={endDate} disabled />
              </div>
            )}

            {/* Price Summary */}
            {calculatedPrice > 0 && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-indigo-900 mb-2">
                  Price Summary
                </h4>
                {selectedPlan && (
                  <>
                    <div className="flex justify-between text-sm text-indigo-800 mb-1">
                      <span>Base Price:</span>
                      <span>${selectedPlan.price}</span>
                    </div>
                    <div className="flex justify-between text-sm text-indigo-800 mb-1">
                      <span>Billing Cycle:</span>
                      <span className="capitalize">{formData.billingCycle}</span>
                    </div>
                    {formData.billingCycle === 'yearly' && (
                      <div className="flex justify-between text-sm text-green-700 mb-1">
                        <span>Yearly Discount (20%):</span>
                        <span>-${(selectedPlan.price * 12 * 0.2).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-base font-bold text-indigo-900 pt-2 border-t border-indigo-300 mt-2">
                      <span>Total Price:</span>
                      <span>${calculatedPrice.toFixed(2)}</span>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Auto Renew */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoRenew"
                name="autoRenew"
                checked={formData.autoRenew}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, autoRenew: e.target.checked }))
                }
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="autoRenew" className="ml-2 text-sm text-gray-700">
                Enable auto-renewal
              </label>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {mode === 'create' ? 'Create Subscription' : 'Extend Subscription'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default SubscriptionForm;
