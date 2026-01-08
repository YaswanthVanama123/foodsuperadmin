import React, { useState } from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Switch from '../ui/Switch';
import Button from '../ui/Button';
import { Shield, Lock, Clock, Smartphone, Globe, AlertTriangle } from 'lucide-react';

interface SecuritySettingsProps {
  onSave: (data: SecuritySettingsData) => Promise<void>;
}

export interface SecuritySettingsData {
  passwordMinLength: string;
  passwordRequireUppercase: boolean;
  passwordRequireLowercase: boolean;
  passwordRequireNumbers: boolean;
  passwordRequireSpecialChars: boolean;
  passwordExpiryDays: string;
  sessionTimeout: string;
  maxLoginAttempts: string;
  lockoutDuration: string;
  twoFactorRequired: boolean;
  twoFactorMethod: string;
  ipWhitelist: string;
  allowedDomains: string;
}

const sessionTimeoutOptions = [
  { value: '15', label: '15 minutes' },
  { value: '30', label: '30 minutes' },
  { value: '60', label: '1 hour' },
  { value: '120', label: '2 hours' },
  { value: '240', label: '4 hours' },
  { value: '480', label: '8 hours' },
  { value: '1440', label: '24 hours' },
];

const twoFactorMethodOptions = [
  { value: 'app', label: 'Authenticator App (TOTP)' },
  { value: 'sms', label: 'SMS' },
  { value: 'email', label: 'Email' },
  { value: 'any', label: 'Any Method' },
];

const SecuritySettings: React.FC<SecuritySettingsProps> = ({ onSave }) => {
  const [formData, setFormData] = useState<SecuritySettingsData>({
    passwordMinLength: '8',
    passwordRequireUppercase: true,
    passwordRequireLowercase: true,
    passwordRequireNumbers: true,
    passwordRequireSpecialChars: true,
    passwordExpiryDays: '90',
    sessionTimeout: '60',
    maxLoginAttempts: '5',
    lockoutDuration: '30',
    twoFactorRequired: false,
    twoFactorMethod: 'app',
    ipWhitelist: '',
    allowedDomains: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: keyof SecuritySettingsData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSave(formData);
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = () => {
    let strength = 0;
    const minLength = parseInt(formData.passwordMinLength);

    if (minLength >= 8) strength++;
    if (minLength >= 12) strength++;
    if (formData.passwordRequireUppercase) strength++;
    if (formData.passwordRequireLowercase) strength++;
    if (formData.passwordRequireNumbers) strength++;
    if (formData.passwordRequireSpecialChars) strength++;

    if (strength <= 2) return { label: 'Weak', color: 'text-red-600', bg: 'bg-red-100' };
    if (strength <= 4) return { label: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { label: 'Strong', color: 'text-green-600', bg: 'bg-green-100' };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 mr-3" />
          <div>
            <h4 className="text-sm font-semibold text-red-900">Security Configuration</h4>
            <p className="text-sm text-red-700 mt-1">
              These settings affect all users. Changes may require users to update their credentials.
            </p>
          </div>
        </div>
      </div>

      {/* Password Policy */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Lock className="h-5 w-5 mr-2 text-violet-600" />
            Password Policy
          </h3>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${passwordStrength.bg} ${passwordStrength.color}`}
          >
            {passwordStrength.label} Policy
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-7">
          <Input
            label="Minimum Password Length"
            type="number"
            min="6"
            max="32"
            value={formData.passwordMinLength}
            onChange={(e) => handleChange('passwordMinLength', e.target.value)}
            helperText="Recommended: 12 or more characters"
            required
          />

          <Input
            label="Password Expiry (Days)"
            type="number"
            min="0"
            value={formData.passwordExpiryDays}
            onChange={(e) => handleChange('passwordExpiryDays', e.target.value)}
            helperText="0 = Never expires"
          />

          <div className="space-y-3">
            <Switch
              enabled={formData.passwordRequireUppercase}
              onChange={(value) => handleChange('passwordRequireUppercase', value)}
              label="Require Uppercase Letters (A-Z)"
            />
            <Switch
              enabled={formData.passwordRequireLowercase}
              onChange={(value) => handleChange('passwordRequireLowercase', value)}
              label="Require Lowercase Letters (a-z)"
            />
          </div>

          <div className="space-y-3">
            <Switch
              enabled={formData.passwordRequireNumbers}
              onChange={(value) => handleChange('passwordRequireNumbers', value)}
              label="Require Numbers (0-9)"
            />
            <Switch
              enabled={formData.passwordRequireSpecialChars}
              onChange={(value) => handleChange('passwordRequireSpecialChars', value)}
              label="Require Special Characters (!@#$)"
            />
          </div>
        </div>
      </div>

      {/* Session Management */}
      <div className="space-y-4 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-violet-600" />
          Session Management
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-7">
          <Select
            label="Session Timeout"
            options={sessionTimeoutOptions}
            value={formData.sessionTimeout}
            onChange={(e) => handleChange('sessionTimeout', e.target.value)}
            helperText="Inactive users will be logged out automatically"
          />

          <Input
            label="Max Login Attempts"
            type="number"
            min="3"
            max="10"
            value={formData.maxLoginAttempts}
            onChange={(e) => handleChange('maxLoginAttempts', e.target.value)}
            helperText="Failed attempts before account lockout"
            required
          />

          <Input
            label="Lockout Duration (Minutes)"
            type="number"
            min="5"
            value={formData.lockoutDuration}
            onChange={(e) => handleChange('lockoutDuration', e.target.value)}
            helperText="How long accounts are locked after max attempts"
            required
          />
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="space-y-4 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Smartphone className="h-5 w-5 mr-2 text-violet-600" />
          Two-Factor Authentication (2FA)
        </h3>

        <div className="grid grid-cols-1 gap-6 pl-7">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <Switch
              enabled={formData.twoFactorRequired}
              onChange={(value) => handleChange('twoFactorRequired', value)}
              label="Require 2FA for All Users"
            />
            <p className="text-sm text-blue-700 mt-2 ml-14">
              When enabled, all users must set up two-factor authentication to access their accounts
            </p>
          </div>

          {formData.twoFactorRequired && (
            <Select
              label="Preferred 2FA Method"
              options={twoFactorMethodOptions}
              value={formData.twoFactorMethod}
              onChange={(e) => handleChange('twoFactorMethod', e.target.value)}
            />
          )}
        </div>
      </div>

      {/* Access Control */}
      <div className="space-y-4 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Globe className="h-5 w-5 mr-2 text-violet-600" />
          Access Control
        </h3>

        <div className="grid grid-cols-1 gap-6 pl-7">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              IP Whitelist
            </label>
            <textarea
              className="w-full rounded-lg border-2 border-gray-300 focus:border-violet-500 focus:ring-violet-500 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200"
              rows={4}
              placeholder="Enter IP addresses or CIDR ranges, one per line&#10;Example:&#10;192.168.1.1&#10;10.0.0.0/24"
              value={formData.ipWhitelist}
              onChange={(e) => handleChange('ipWhitelist', e.target.value)}
            />
            <p className="mt-2 text-sm text-gray-500">
              Leave empty to allow access from any IP. Add IP addresses to restrict access.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Allowed Email Domains
            </label>
            <textarea
              className="w-full rounded-lg border-2 border-gray-300 focus:border-violet-500 focus:ring-violet-500 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200"
              rows={3}
              placeholder="Enter allowed email domains, one per line&#10;Example:&#10;company.com&#10;example.org"
              value={formData.allowedDomains}
              onChange={(e) => handleChange('allowedDomains', e.target.value)}
            />
            <p className="mt-2 text-sm text-gray-500">
              Leave empty to allow any email domain. Specify domains to restrict user registration.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-200">
        <Button type="submit" isLoading={isLoading}>
          Save Security Settings
        </Button>
      </div>
    </form>
  );
};

export default SecuritySettings;
