import React, { useState } from 'react';
import { Settings as SettingsIcon, Globe, Mail, CreditCard, ToggleLeft, Shield, CheckCircle2 } from 'lucide-react';
import Card, { CardBody, CardHeader } from '../components/ui/Card';
import {
  GeneralSettings,
  EmailSettings,
  PaymentSettings,
  FeatureToggles,
  SecuritySettings,
  GeneralSettingsData,
  EmailSettingsData,
  PaymentSettingsData,
  FeatureTogglesData,
  SecuritySettingsData,
} from '../components/settings';

type TabType = 'general' | 'email' | 'payment' | 'features' | 'security';

interface Tab {
  id: TabType;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const tabs: Tab[] = [
  {
    id: 'general',
    label: 'General',
    icon: <Globe className="h-5 w-5" />,
    description: 'Platform name, logo, timezone, and currency settings',
  },
  {
    id: 'email',
    label: 'Email',
    icon: <Mail className="h-5 w-5" />,
    description: 'SMTP configuration and email notification settings',
  },
  {
    id: 'payment',
    label: 'Payment',
    icon: <CreditCard className="h-5 w-5" />,
    description: 'Payment gateway configuration and API settings',
  },
  {
    id: 'features',
    label: 'Features',
    icon: <ToggleLeft className="h-5 w-5" />,
    description: 'Enable or disable platform features',
  },
  {
    id: 'security',
    label: 'Security',
    icon: <Shield className="h-5 w-5" />,
    description: 'Password policy, session management, and access control',
  },
];

interface Toast {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [toast, setToast] = useState<Toast>({ show: false, message: '', type: 'success' });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const handleGeneralSave = async (data: GeneralSettingsData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Saving general settings:', data);
    showToast('General settings saved successfully!');
  };

  const handleEmailSave = async (data: EmailSettingsData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Saving email settings:', data);
    showToast('Email settings saved successfully!');
  };

  const handleTestEmail = async (data: EmailSettingsData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log('Sending test email with:', data);
    // Simulate success/failure randomly for demo
    const success = Math.random() > 0.3;
    if (success) {
      showToast('Test email sent successfully!');
    } else {
      throw new Error('Failed to send test email. Please check your SMTP settings.');
    }
  };

  const handlePaymentSave = async (data: PaymentSettingsData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Saving payment settings:', data);
    showToast('Payment settings saved successfully!');
  };

  const handleFeatureSave = async (data: FeatureTogglesData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Saving feature settings:', data);
    showToast('Feature settings saved successfully!');
  };

  const handleSecuritySave = async (data: SecuritySettingsData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Saving security settings:', data);
    showToast('Security settings saved successfully!');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings onSave={handleGeneralSave} />;
      case 'email':
        return <EmailSettings onSave={handleEmailSave} onTestEmail={handleTestEmail} />;
      case 'payment':
        return <PaymentSettings onSave={handlePaymentSave} />;
      case 'features':
        return <FeatureToggles onSave={handleFeatureSave} />;
      case 'security':
        return <SecuritySettings onSave={handleSecuritySave} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-violet-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-3">
            <div className="p-3 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl shadow-lg mr-4">
              <SettingsIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                System Settings
              </h1>
              <p className="text-gray-600 mt-1">
                Configure platform-wide settings and preferences
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar Navigation */}
          <div className="col-span-12 lg:col-span-3">
            <Card className="sticky top-6">
              <CardBody className="p-2">
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                          w-full flex items-start px-4 py-3 rounded-lg text-left transition-all duration-200
                          ${
                            isActive
                              ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg'
                              : 'text-gray-700 hover:bg-gray-100'
                          }
                        `}
                      >
                        <span className={`mr-3 mt-0.5 ${isActive ? 'text-white' : 'text-gray-500'}`}>
                          {tab.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold">{tab.label}</div>
                          <div
                            className={`text-xs mt-0.5 ${
                              isActive ? 'text-white/90' : 'text-gray-500'
                            }`}
                          >
                            {tab.description}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </nav>
              </CardBody>
            </Card>
          </div>

          {/* Main Content */}
          <div className="col-span-12 lg:col-span-9">
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <span className="text-violet-600 mr-3">
                    {tabs.find((tab) => tab.id === activeTab)?.icon}
                  </span>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {tabs.find((tab) => tab.id === activeTab)?.label} Settings
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {tabs.find((tab) => tab.id === activeTab)?.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="p-6">{renderTabContent()}</CardBody>
            </Card>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-8 right-8 z-50 animate-slide-up">
          <div
            className={`
              flex items-center px-6 py-4 rounded-lg shadow-2xl
              ${
                toast.type === 'success'
                  ? 'bg-green-600 text-white'
                  : 'bg-red-600 text-white'
              }
            `}
          >
            <CheckCircle2 className="h-5 w-5 mr-3" />
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Settings;
