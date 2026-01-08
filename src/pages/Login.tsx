import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Shield } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/SuperAdminAuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors = {
      username: '',
      password: '',
    };
    let isValid = true;

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await login(formData.username, formData.password);
      toast.success('Login successful! Welcome to the Super Admin Portal.');
      navigate('/dashboard');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: 'username' | 'password') => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: '',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 mb-6 shadow-2xl">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Super Admin Portal
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            Patlinks Platform Management
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Secure access for platform administrators
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-violet-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Input */}
            <Input
              type="text"
              label="Username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange('username')}
              error={errors.username}
              leftIcon={<User className="w-5 h-5" />}
              disabled={isLoading}
              autoComplete="username"
            />

            {/* Password Input */}
            <Input
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange('password')}
              error={errors.password}
              leftIcon={<Lock className="w-5 h-5" />}
              disabled={isLoading}
              autoComplete="current-password"
            />

            {/* Login Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-violet-50 rounded-lg border border-violet-200">
            <div className="flex items-start">
              <Shield className="w-5 h-5 text-violet-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-violet-900">Security Notice</p>
                <p className="text-xs text-violet-700 mt-1">
                  This is a protected area. All access attempts are logged and monitored.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Protected by Patlinks Security
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Authorized personnel only
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
