import React, { useState } from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { Globe, Building2, Clock, DollarSign, Upload } from 'lucide-react';

interface GeneralSettingsProps {
  onSave: (data: GeneralSettingsData) => Promise<void>;
}

export interface GeneralSettingsData {
  platformName: string;
  platformLogo: string;
  timezone: string;
  currency: string;
  dateFormat: string;
  supportEmail: string;
}

const timezoneOptions = [
  { value: 'UTC', label: 'UTC - Coordinated Universal Time' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Paris', label: 'Paris (CET)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEDT)' },
];

const currencyOptions = [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
  { value: 'JPY', label: 'JPY - Japanese Yen' },
  { value: 'AUD', label: 'AUD - Australian Dollar' },
  { value: 'CAD', label: 'CAD - Canadian Dollar' },
  { value: 'INR', label: 'INR - Indian Rupee' },
];

const dateFormatOptions = [
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (US)' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (EU)' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (ISO)' },
  { value: 'DD MMM YYYY', label: 'DD MMM YYYY (e.g., 08 Jan 2026)' },
];

const GeneralSettings: React.FC<GeneralSettingsProps> = ({ onSave }) => {
  const [formData, setFormData] = useState<GeneralSettingsData>({
    platformName: 'PatLinks',
    platformLogo: '',
    timezone: 'UTC',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    supportEmail: 'support@patlinks.com',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: keyof GeneralSettingsData, value: string) => {
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Input
            label="Platform Name"
            placeholder="Enter platform name"
            value={formData.platformName}
            onChange={(e) => handleChange('platformName', e.target.value)}
            leftIcon={<Building2 className="h-5 w-5" />}
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Platform Logo
          </label>
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              {formData.platformLogo ? (
                <img
                  src={formData.platformLogo}
                  alt="Platform logo"
                  className="h-16 w-16 rounded-lg object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                  <Building2 className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <Input
                placeholder="Logo URL or upload"
                value={formData.platformLogo}
                onChange={(e) => handleChange('platformLogo', e.target.value)}
              />
            </div>
            <Button type="button" variant="outline" size="md">
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Recommended size: 512x512px, PNG or SVG format
          </p>
        </div>

        <Select
          label="Timezone"
          options={timezoneOptions}
          value={formData.timezone}
          onChange={(e) => handleChange('timezone', e.target.value)}
          placeholder="Select timezone"
        />

        <Select
          label="Currency"
          options={currencyOptions}
          value={formData.currency}
          onChange={(e) => handleChange('currency', e.target.value)}
          placeholder="Select currency"
        />

        <Select
          label="Date Format"
          options={dateFormatOptions}
          value={formData.dateFormat}
          onChange={(e) => handleChange('dateFormat', e.target.value)}
          placeholder="Select date format"
        />

        <Input
          label="Support Email"
          type="email"
          placeholder="support@example.com"
          value={formData.supportEmail}
          onChange={(e) => handleChange('supportEmail', e.target.value)}
          leftIcon={<Globe className="h-5 w-5" />}
          required
        />
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-200">
        <Button type="submit" isLoading={isLoading}>
          Save General Settings
        </Button>
      </div>
    </form>
  );
};

export default GeneralSettings;
