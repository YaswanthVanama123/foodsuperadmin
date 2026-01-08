import React, { useState, useEffect } from 'react';
import Modal, { ModalBody, ModalFooter } from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import Select from '../ui/Select';
import { Restaurant } from '../../types';

interface RestaurantFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RestaurantFormData) => Promise<void>;
  restaurant?: Restaurant;
}

export interface RestaurantFormData {
  name: string;
  slug: string;
  email: string;
  phone: string;
  address: string;
  ownerId?: string;
  subscription?: {
    plan: 'starter' | 'professional' | 'enterprise';
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
    slug: '',
    email: '',
    phone: '',
    address: '',
    ownerId: '',
    subscription: {
      plan: 'starter',
    },
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RestaurantFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (restaurant) {
      setFormData({
        name: restaurant.name || '',
        slug: restaurant.slug || '',
        email: restaurant.email || '',
        phone: restaurant.phone || '',
        address: restaurant.address || '',
        ownerId: restaurant.ownerId || '',
        subscription: restaurant.subscription || { plan: 'starter' },
      });
    } else {
      setFormData({
        name: '',
        slug: '',
        email: '',
        phone: '',
        address: '',
        ownerId: '',
        subscription: {
          plan: 'starter',
        },
      });
    }
    setErrors({});
  }, [restaurant, isOpen]);

  const generateSlug = (name: string): string => {
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
      slug: generateSlug(value),
    }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof RestaurantFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Restaurant name is required';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
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
    { value: 'starter', label: 'Starter' },
    { value: 'professional', label: 'Professional' },
    { value: 'enterprise', label: 'Enterprise' },
  ];

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
              label="Slug (URL)"
              placeholder="the-gourmet-kitchen"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              error={errors.slug}
              helperText="Used in the restaurant's unique URL"
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

            <TextArea
              label="Address"
              placeholder="123 Main St, City, State, ZIP"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              error={errors.address}
              rows={3}
              required
            />

            {!restaurant && (
              <Input
                label="Owner ID (Optional)"
                placeholder="Owner user ID"
                value={formData.ownerId}
                onChange={(e) => setFormData({ ...formData, ownerId: e.target.value })}
                helperText="Leave empty to create without owner"
              />
            )}

            <Select
              label="Subscription Plan"
              value={formData.subscription?.plan || 'starter'}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  subscription: {
                    plan: e.target.value as 'starter' | 'professional' | 'enterprise',
                  },
                })
              }
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
