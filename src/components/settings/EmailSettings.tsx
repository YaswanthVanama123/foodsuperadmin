import React, { useState } from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { Mail, Server, User, Lock, Send, CheckCircle2 } from 'lucide-react';

interface EmailSettingsProps {
  onSave: (data: EmailSettingsData) => Promise<void>;
  onTestEmail: (data: EmailSettingsData) => Promise<void>;
}

export interface EmailSettingsData {
  smtpHost: string;
  smtpPort: string;
  smtpUsername: string;
  smtpPassword: string;
  smtpEncryption: string;
  fromEmail: string;
  fromName: string;
}

const encryptionOptions = [
  { value: 'none', label: 'None' },
  { value: 'ssl', label: 'SSL' },
  { value: 'tls', label: 'TLS' },
];

const EmailSettings: React.FC<EmailSettingsProps> = ({ onSave, onTestEmail }) => {
  const [formData, setFormData] = useState<EmailSettingsData>({
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUsername: '',
    smtpPassword: '',
    smtpEncryption: 'tls',
    fromEmail: 'noreply@patlinks.com',
    fromName: 'PatLinks',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleChange = (field: keyof EmailSettingsData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setTestResult(null);
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

  const handleTestEmail = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      await onTestEmail(formData);
      setTestResult({ success: true, message: 'Test email sent successfully!' });
    } catch (error) {
      setTestResult({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to send test email'
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <Mail className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
          <div>
            <h4 className="text-sm font-semibold text-blue-900">SMTP Configuration</h4>
            <p className="text-sm text-blue-700 mt-1">
              Configure your SMTP settings to enable email notifications and communications.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="SMTP Host"
          placeholder="smtp.gmail.com"
          value={formData.smtpHost}
          onChange={(e) => handleChange('smtpHost', e.target.value)}
          leftIcon={<Server className="h-5 w-5" />}
          helperText="Your email provider's SMTP server address"
          required
        />

        <Input
          label="SMTP Port"
          type="number"
          placeholder="587"
          value={formData.smtpPort}
          onChange={(e) => handleChange('smtpPort', e.target.value)}
          helperText="Common ports: 25, 465 (SSL), 587 (TLS)"
          required
        />

        <Input
          label="SMTP Username"
          placeholder="username@example.com"
          value={formData.smtpUsername}
          onChange={(e) => handleChange('smtpUsername', e.target.value)}
          leftIcon={<User className="h-5 w-5" />}
          required
        />

        <Input
          label="SMTP Password"
          type="password"
          placeholder="Enter password"
          value={formData.smtpPassword}
          onChange={(e) => handleChange('smtpPassword', e.target.value)}
          leftIcon={<Lock className="h-5 w-5" />}
          helperText="Use app-specific password if 2FA is enabled"
          required
        />

        <Select
          label="Encryption"
          options={encryptionOptions}
          value={formData.smtpEncryption}
          onChange={(e) => handleChange('smtpEncryption', e.target.value)}
        />

        <div></div>

        <Input
          label="From Email"
          type="email"
          placeholder="noreply@example.com"
          value={formData.fromEmail}
          onChange={(e) => handleChange('fromEmail', e.target.value)}
          leftIcon={<Mail className="h-5 w-5" />}
          required
        />

        <Input
          label="From Name"
          placeholder="Your Platform Name"
          value={formData.fromName}
          onChange={(e) => handleChange('fromName', e.target.value)}
          required
        />
      </div>

      {testResult && (
        <div
          className={`rounded-lg p-4 ${
            testResult.success
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          <div className="flex items-start">
            <CheckCircle2
              className={`h-5 w-5 mt-0.5 mr-3 ${
                testResult.success ? 'text-green-600' : 'text-red-600'
              }`}
            />
            <p
              className={`text-sm font-medium ${
                testResult.success ? 'text-green-800' : 'text-red-800'
              }`}
            >
              {testResult.message}
            </p>
          </div>
        </div>
      )}

      <div className="flex justify-between pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={handleTestEmail}
          isLoading={isTesting}
        >
          <Send className="h-4 w-4 mr-2" />
          Send Test Email
        </Button>
        <Button type="submit" isLoading={isLoading}>
          Save Email Settings
        </Button>
      </div>
    </form>
  );
};

export default EmailSettings;
