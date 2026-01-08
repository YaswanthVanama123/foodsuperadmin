import React, { useState, useEffect } from 'react';
import Modal, { ModalBody, ModalFooter } from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { Admin, CreateAdminRequest, UpdateAdminRequest } from '../../api/admins.api';
import adminsApi from '../../api/admins.api';
import restaurantsApi, { Restaurant } from '../../api/restaurants.api';

interface AdminFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  admin?: Admin | null;
  mode: 'create' | 'edit';
}

const AdminForm: React.FC<AdminFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
  admin,
  mode,
}) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    restaurantId: '',
    role: 'admin',
    status: 'active' as 'active' | 'inactive',
  });

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loadingRestaurants, setLoadingRestaurants] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load restaurants on mount
  useEffect(() => {
    if (isOpen) {
      loadRestaurants();
    }
  }, [isOpen]);

  // Pre-fill form when editing
  useEffect(() => {
    if (admin && mode === 'edit') {
      setFormData({
        username: admin.username,
        email: admin.email,
        password: '',
        firstName: admin.firstName,
        lastName: admin.lastName,
        restaurantId: admin.restaurantId,
        role: admin.role,
        status: admin.status,
      });
    } else {
      // Reset form for create mode
      setFormData({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        restaurantId: '',
        role: 'admin',
        status: 'active',
      });
    }
    setErrors({});
  }, [admin, mode, isOpen]);

  const loadRestaurants = async () => {
    try {
      setLoadingRestaurants(true);
      const response = await restaurantsApi.getAll(1, 100);
      setRestaurants(response.restaurants);
    } catch (error) {
      console.error('Error loading restaurants:', error);
    } finally {
      setLoadingRestaurants(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (mode === 'create' && !formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.restaurantId) {
      newErrors.restaurantId = 'Restaurant is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setIsSubmitting(true);

      if (mode === 'create') {
        const createData: CreateAdminRequest = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          restaurantId: formData.restaurantId,
          role: formData.role,
        };
        await adminsApi.create(createData);
      } else if (admin) {
        const updateData: UpdateAdminRequest = {
          username: formData.username,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: formData.role,
          status: formData.status,
        };
        // Only include password if it's not empty
        if (formData.password) {
          updateData.password = formData.password;
        }
        await adminsApi.update(admin.id, updateData);
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error submitting admin form:', error);
      setErrors({
        submit: error.response?.data?.message || 'Failed to save admin',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const restaurantOptions = restaurants.map((restaurant) => ({
    value: restaurant.id,
    label: restaurant.name,
  }));

  const roleOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'manager', label: 'Manager' },
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Add New Admin' : 'Edit Admin'}
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <div className="space-y-4">
            {errors.submit && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {errors.submit}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
                placeholder="Enter first name"
                required
              />

              <Input
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
                placeholder="Enter last name"
                required
              />
            </div>

            <Input
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              placeholder="Enter username"
              required
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="admin@example.com"
              required
            />

            <Input
              label={mode === 'create' ? 'Password' : 'Password (leave blank to keep current)'}
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder={mode === 'create' ? 'Enter password' : 'Enter new password'}
              required={mode === 'create'}
              helperText={mode === 'create' ? 'Minimum 6 characters' : 'Only enter if changing password'}
            />

            <Select
              label="Restaurant"
              name="restaurantId"
              value={formData.restaurantId}
              onChange={handleChange}
              error={errors.restaurantId}
              options={restaurantOptions}
              placeholder={loadingRestaurants ? 'Loading restaurants...' : 'Select restaurant'}
              disabled={loadingRestaurants || mode === 'edit'}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                options={roleOptions}
                required
              />

              {mode === 'edit' && (
                <Select
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  options={statusOptions}
                  required
                />
              )}
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {mode === 'create' ? 'Create Admin' : 'Update Admin'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default AdminForm;
