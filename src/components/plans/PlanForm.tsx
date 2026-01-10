import React, { useState, useEffect } from 'react';
import Modal, { ModalBody, ModalFooter } from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { CreatePlanRequest, Plan } from '../../api/plans.api';
import { Plus, X } from 'lucide-react';

interface PlanFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePlanRequest) => void;
  isLoading?: boolean;
  mode?: 'create' | 'edit';
  initialData?: Plan;
}

const PlanForm: React.FC<PlanFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  mode = 'create',
  initialData,
}) => {
  const [formData, setFormData] = useState<CreatePlanRequest>({
    name: 'Free',
    description: '',
    price: 0,
    currency: 'USD',
    billingCycle: 'monthly',
    features: [],
    limits: {
      maxTables: 10,
      maxMenuItems: 50,
      maxAdmins: 3,
      maxOrders: 1000,
    },
    isActive: true,
    displayOrder: 0,
  });

  const [newFeature, setNewFeature] = useState<string>('');

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        price: initialData.price,
        currency: initialData.currency,
        billingCycle: initialData.billingCycle,
        features: initialData.features,
        limits: initialData.limits,
        isActive: initialData.isActive,
        displayOrder: initialData.displayOrder,
      });
    } else if (mode === 'create') {
      // Reset form for create mode
      setFormData({
        name: 'Free',
        description: '',
        price: 0,
        currency: 'USD',
        billingCycle: 'monthly',
        features: [],
        limits: {
          maxTables: 10,
          maxMenuItems: 50,
          maxAdmins: 3,
          maxOrders: 1000,
        },
        isActive: true,
        displayOrder: 0,
      });
    }
  }, [initialData, mode, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      limits: {
        ...prev.limits!,
        [name]: parseInt(value) || 0,
      },
    }));
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Create New Plan' : 'Edit Plan'}
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <div className="space-y-4">
            {/* Plan Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plan Name
              </label>
              <Select
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              >
                <option value="Free">Free</option>
                <option value="Basic">Basic</option>
                <option value="Pro">Pro</option>
                <option value="Enterprise">Enterprise</option>
              </Select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of the plan"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            {/* Price and Currency */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <Input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <Input
                  type="text"
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  placeholder="USD"
                  required
                />
              </div>
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
                <option value="yearly">Yearly</option>
              </Select>
            </div>

            {/* Display Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display Order
              </label>
              <Input
                type="number"
                name="displayOrder"
                value={formData.displayOrder || 0}
                onChange={handleChange}
                placeholder="0"
                min="0"
              />
              <p className="text-xs text-gray-500 mt-1">
                Lower numbers appear first
              </p>
            </div>

            {/* Plan Limits */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Plan Limits</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Tables
                  </label>
                  <Input
                    type="number"
                    name="maxTables"
                    value={formData.limits?.maxTables || ''}
                    onChange={handleLimitChange}
                    placeholder="10"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Menu Items
                  </label>
                  <Input
                    type="number"
                    name="maxMenuItems"
                    value={formData.limits?.maxMenuItems || ''}
                    onChange={handleLimitChange}
                    placeholder="50"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Admins
                  </label>
                  <Input
                    type="number"
                    name="maxAdmins"
                    value={formData.limits?.maxAdmins || ''}
                    onChange={handleLimitChange}
                    placeholder="3"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Orders
                  </label>
                  <Input
                    type="number"
                    name="maxOrders"
                    value={formData.limits?.maxOrders || ''}
                    onChange={handleLimitChange}
                    placeholder="1000"
                    min="0"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Features
              </label>
              <div className="flex space-x-2 mb-3">
                <Input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Enter a feature"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddFeature();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddFeature}
                  className="flex items-center space-x-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add</span>
                </Button>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {formData.features.length > 0 ? (
                  formData.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg"
                    >
                      <span className="text-sm text-gray-700">{feature}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-2">
                    No features added yet
                  </p>
                )}
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                Plan is active and available for subscription
              </label>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {mode === 'create' ? 'Create Plan' : 'Update Plan'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default PlanForm;
