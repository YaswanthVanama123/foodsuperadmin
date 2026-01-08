import React, { useState } from 'react';
import Switch from '../ui/Switch';
import Button from '../ui/Button';
import { BarChart3, Users, Code, Palette, Database, Bell, Shield, Globe } from 'lucide-react';

interface FeatureTogglesProps {
  onSave: (data: FeatureTogglesData) => Promise<void>;
}

export interface FeatureTogglesData {
  analytics: boolean;
  multiTenant: boolean;
  apiAccess: boolean;
  customBranding: boolean;
  advancedReporting: boolean;
  emailNotifications: boolean;
  ssoIntegration: boolean;
  webhooks: boolean;
}

interface Feature {
  key: keyof FeatureTogglesData;
  label: string;
  description: string;
  icon: React.ReactNode;
  category: 'core' | 'advanced' | 'integrations';
}

const features: Feature[] = [
  {
    key: 'analytics',
    label: 'Analytics & Insights',
    description: 'Enable advanced analytics dashboard and reporting capabilities',
    icon: <BarChart3 className="h-6 w-6 text-violet-600" />,
    category: 'core',
  },
  {
    key: 'multiTenant',
    label: 'Multi-Tenant Support',
    description: 'Allow multiple organizations with isolated data and settings',
    icon: <Users className="h-6 w-6 text-blue-600" />,
    category: 'core',
  },
  {
    key: 'apiAccess',
    label: 'API Access',
    description: 'Provide REST API access for external integrations',
    icon: <Code className="h-6 w-6 text-green-600" />,
    category: 'core',
  },
  {
    key: 'customBranding',
    label: 'Custom Branding',
    description: 'Allow tenants to customize logos, colors, and themes',
    icon: <Palette className="h-6 w-6 text-pink-600" />,
    category: 'advanced',
  },
  {
    key: 'advancedReporting',
    label: 'Advanced Reporting',
    description: 'Enable custom reports, exports, and scheduled reports',
    icon: <Database className="h-6 w-6 text-indigo-600" />,
    category: 'advanced',
  },
  {
    key: 'emailNotifications',
    label: 'Email Notifications',
    description: 'Send automated email notifications for events and updates',
    icon: <Bell className="h-6 w-6 text-orange-600" />,
    category: 'advanced',
  },
  {
    key: 'ssoIntegration',
    label: 'SSO Integration',
    description: 'Enable Single Sign-On with SAML, OAuth, and other providers',
    icon: <Shield className="h-6 w-6 text-red-600" />,
    category: 'integrations',
  },
  {
    key: 'webhooks',
    label: 'Webhooks',
    description: 'Send real-time event notifications to external systems',
    icon: <Globe className="h-6 w-6 text-teal-600" />,
    category: 'integrations',
  },
];

const FeatureToggles: React.FC<FeatureTogglesProps> = ({ onSave }) => {
  const [formData, setFormData] = useState<FeatureTogglesData>({
    analytics: true,
    multiTenant: true,
    apiAccess: true,
    customBranding: false,
    advancedReporting: true,
    emailNotifications: true,
    ssoIntegration: false,
    webhooks: true,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = (key: keyof FeatureTogglesData, value: boolean) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
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

  const groupedFeatures = {
    core: features.filter((f) => f.category === 'core'),
    advanced: features.filter((f) => f.category === 'advanced'),
    integrations: features.filter((f) => f.category === 'integrations'),
  };

  const renderFeatureGroup = (title: string, groupFeatures: Feature[]) => (
    <div key={title} className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-4">
        {groupFeatures.map((feature) => (
          <div
            key={feature.key}
            className="flex items-start space-x-4 p-4 rounded-lg border-2 border-gray-200 hover:border-violet-300 transition-colors duration-200"
          >
            <div className="flex-shrink-0 mt-1">{feature.icon}</div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-900">{feature.label}</h4>
              <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
            </div>
            <div className="flex-shrink-0">
              <Switch
                enabled={formData[feature.key]}
                onChange={(value) => handleToggle(feature.key, value)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const enabledCount = Object.values(formData).filter(Boolean).length;
  const totalCount = Object.keys(formData).length;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-violet-900">Platform Features</h4>
            <p className="text-sm text-violet-700 mt-1">
              Enable or disable features across the entire platform
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-violet-900">
              {enabledCount}/{totalCount}
            </div>
            <div className="text-xs text-violet-700">Features Enabled</div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {renderFeatureGroup('Core Features', groupedFeatures.core)}
        {renderFeatureGroup('Advanced Features', groupedFeatures.advanced)}
        {renderFeatureGroup('Integrations', groupedFeatures.integrations)}
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-200">
        <Button type="submit" isLoading={isLoading}>
          Save Feature Settings
        </Button>
      </div>
    </form>
  );
};

export default FeatureToggles;
