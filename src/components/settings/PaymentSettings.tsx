import React, { useState } from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { CreditCard, Key, Link2, Eye, EyeOff, Copy, CheckCircle2 } from 'lucide-react';

interface PaymentSettingsProps {
  onSave: (data: PaymentSettingsData) => Promise<void>;
}

export interface PaymentSettingsData {
  gateway: string;
  apiKey: string;
  apiSecret: string;
  webhookSecret: string;
  testMode: boolean;
  currency: string;
}

const gatewayOptions = [
  { value: 'stripe', label: 'Stripe' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'square', label: 'Square' },
  { value: 'razorpay', label: 'Razorpay' },
  { value: 'braintree', label: 'Braintree' },
];

const PaymentSettings: React.FC<PaymentSettingsProps> = ({ onSave }) => {
  const [formData, setFormData] = useState<PaymentSettingsData>({
    gateway: 'stripe',
    apiKey: '',
    apiSecret: '',
    webhookSecret: '',
    testMode: true,
    currency: 'USD',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showApiSecret, setShowApiSecret] = useState(false);
  const [showWebhookSecret, setShowWebhookSecret] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const webhookUrl = `https://api.patlinks.com/webhooks/payments/${formData.gateway}`;

  const handleChange = (field: keyof PaymentSettingsData, value: string | boolean) => {
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

  const handleCopyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied('webhook');
    setTimeout(() => setCopied(null), 2000);
  };

  const maskValue = (value: string) => {
    if (!value) return '';
    if (value.length <= 8) return '*'.repeat(value.length);
    return value.substring(0, 4) + '*'.repeat(value.length - 8) + value.substring(value.length - 4);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <CreditCard className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
          <div>
            <h4 className="text-sm font-semibold text-yellow-900">Payment Gateway Configuration</h4>
            <p className="text-sm text-yellow-700 mt-1">
              Securely store your payment gateway credentials. All sensitive data is encrypted.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Payment Gateway"
          options={gatewayOptions}
          value={formData.gateway}
          onChange={(e) => handleChange('gateway', e.target.value)}
          placeholder="Select payment gateway"
        />

        <div className="flex items-center space-x-3 pt-8">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.testMode}
              onChange={(e) => handleChange('testMode', e.target.checked)}
              className="w-4 h-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">Test Mode</span>
          </label>
          {formData.testMode && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Testing
            </span>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            API Key / Publishable Key
          </label>
          <div className="relative">
            <Input
              type={showApiKey ? 'text' : 'password'}
              placeholder={`Enter ${formData.gateway} API key`}
              value={formData.apiKey}
              onChange={(e) => handleChange('apiKey', e.target.value)}
              leftIcon={<Key className="h-5 w-5" />}
              required
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showApiKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {formData.gateway === 'stripe' && 'Starts with pk_test_ or pk_live_'}
            {formData.gateway === 'paypal' && 'Your PayPal Client ID'}
            {formData.gateway !== 'stripe' && formData.gateway !== 'paypal' && 'Public/Publishable API key'}
          </p>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            API Secret / Secret Key
          </label>
          <div className="relative">
            <Input
              type={showApiSecret ? 'text' : 'password'}
              placeholder={`Enter ${formData.gateway} secret key`}
              value={formData.apiSecret}
              onChange={(e) => handleChange('apiSecret', e.target.value)}
              leftIcon={<Lock className="h-5 w-5" />}
              required
            />
            <button
              type="button"
              onClick={() => setShowApiSecret(!showApiSecret)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showApiSecret ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {formData.gateway === 'stripe' && 'Starts with sk_test_ or sk_live_'}
            {formData.gateway === 'paypal' && 'Your PayPal Secret'}
            {formData.gateway !== 'stripe' && formData.gateway !== 'paypal' && 'Private/Secret API key'}
          </p>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Webhook Secret
          </label>
          <div className="relative">
            <Input
              type={showWebhookSecret ? 'text' : 'password'}
              placeholder="Enter webhook signing secret"
              value={formData.webhookSecret}
              onChange={(e) => handleChange('webhookSecret', e.target.value)}
              leftIcon={<Key className="h-5 w-5" />}
            />
            <button
              type="button"
              onClick={() => setShowWebhookSecret(!showWebhookSecret)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showWebhookSecret ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Used to verify webhook signatures from {formData.gateway}
          </p>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Webhook URL
          </label>
          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <Input
                value={webhookUrl}
                readOnly
                leftIcon={<Link2 className="h-5 w-5" />}
                className="bg-gray-50"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleCopyWebhookUrl}
              className="flex-shrink-0"
            >
              {copied === 'webhook' ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Add this URL to your {formData.gateway} webhook settings
          </p>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-200">
        <Button type="submit" isLoading={isLoading}>
          Save Payment Settings
        </Button>
      </div>
    </form>
  );
};

export default PaymentSettings;
