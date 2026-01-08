import React, { useState, useEffect } from 'react';
import Modal, { ModalBody, ModalFooter } from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { Restaurant } from '../../api/restaurants.api';

interface RestaurantFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RestaurantFormData) => Promise<void>;
  restaurant?: Restaurant;
}

export interface RestaurantFormData {
  name: string;
  subdomain: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  subscription?: {
    plan: string;
    status: string;
    startDate: string;
    endDate: string;
    billingCycle: string;
  };
}

const RestaurantForm: React.FC<RestaurantFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  restaurant,
}) => {
  const [formData, setFormData] = useState<RestaurantFormData>({
    name: '',
    subdomain: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US',
    },
    subscription: {
      plan: 'trial',
      status: 'active',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      billingCycle: 'monthly',
    },
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RestaurantFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (restaurant) {
      setFormData({
        name: restaurant.name || '',
        subdomain: restaurant.subdomain || '',
        email: restaurant.email || '',
        phone: restaurant.phone || '',
        address: restaurant.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'US',
        },
        subscription: restaurant.subscription || {
          plan: 'trial',
          status: 'active',
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          billingCycle: 'monthly',
        },
      });
    } else {
      setFormData({
        name: '',
        subdomain: '',
        email: '',
        phone: '',
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'US',
        },
        subscription: {
          plan: 'trial',
          status: 'active',
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          billingCycle: 'monthly',
        },
      });
    }
    setErrors({});
  }, [restaurant, isOpen]);

  const generateSubdomain = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      name: value,
      subdomain: generateSubdomain(value),
    }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof RestaurantFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Restaurant name is required';
    }

    if (!formData.subdomain.trim()) {
      newErrors.subdomain = 'Subdomain is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const subscriptionPlans = [
    { value: 'trial', label: 'Trial' },
    { value: 'basic', label: 'Basic (Starter)' },
    { value: 'pro', label: 'Professional' },
    { value: 'enterprise', label: 'Enterprise' },
  ];

  const handlePlanChange = (plan: string) => {
    // Calculate end date based on plan (trial = 14 days, others = 30 days)
    const daysToAdd = plan === 'trial' ? 14 : 30;
    const endDate = new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000).toISOString();

    setFormData({
      ...formData,
      subscription: {
        ...formData.subscription!,
        plan,
        endDate,
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={restaurant ? 'Edit Restaurant' : 'Add New Restaurant'}
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <div className="space-y-4">
            <Input
              label="Restaurant Name"
              placeholder="e.g., The Gourmet Kitchen"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              error={errors.name}
              required
            />

            <Input
              label="Subdomain"
              placeholder="the-gourmet-kitchen"
              value={formData.subdomain}
              onChange={(e) => setFormData({ ...formData, subdomain: e.target.value })}
              error={errors.subdomain}
              helperText="Used for the restaurant's unique subdomain (e.g., the-gourmet-kitchen.patlinks.com)"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Email"
                type="email"
                placeholder="restaurant@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
                required
              />

              <Input
                label="Phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                error={errors.phone}
                required
              />
            </div>

            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700">Address</h4>
              <Input
                label="Street"
                placeholder="123 Main St"
                value={formData.address.street}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, street: e.target.value },
                  })
                }
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="City"
                  placeholder="City"
                  value={formData.address.city}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, city: e.target.value },
                    })
                  }
                />
                <Input
                  label="State"
                  placeholder="State"
                  value={formData.address.state}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, state: e.target.value },
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="ZIP Code"
                  placeholder="12345"
                  value={formData.address.zipCode}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, zipCode: e.target.value },
                    })
                  }
                />
                <Input
                  label="Country"
                  placeholder="US"
                  value={formData.address.country}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, country: e.target.value },
                    })
                  }
                />
              </div>
            </div>

            <Select
              label="Subscription Plan"
              value={formData.subscription?.plan || 'trial'}
              onChange={(e) => handlePlanChange(e.target.value)}
              options={subscriptionPlans}
            />
          </div>
        </ModalBody>

        <ModalFooter>
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {restaurant ? 'Update Restaurant' : 'Create Restaurant'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default RestaurantForm;
