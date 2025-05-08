import React, { useState, useEffect } from 'react';
import { Shield, Key, Clock, Globe } from 'lucide-react';
import { Form, Input, Button, Switch, Select } from '../../components/forms';
import { settingsApi } from '../../api/settings';

interface SecuritySettingsData {
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    expiryDays: number;
  };
  twoFactorAuth: {
    enabled: boolean;
    method: 'app' | 'sms' | 'email';
  };
  sessionTimeout: number;
  ipWhitelist: string[];
}

const SecuritySettings: React.FC = () => {
  const [settings, setSettings] = useState<SecuritySettingsData>({
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      expiryDays: 90
    },
    twoFactorAuth: {
      enabled: false,
      method: 'app'
    },
    sessionTimeout: 30,
    ipWhitelist: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await settingsApi.getSecuritySettings();
      setSettings(response.data as SecuritySettingsData);
    } catch (error) {
      console.error('Error loading security settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await settingsApi.updateSecuritySettings({
        ...settings,
        twoFactorAuth: settings.twoFactorAuth.enabled
      });
      // Show success message
    } catch (error) {
      console.error('Error updating security settings:', error);
      // Show error message
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Security Settings</h2>
        <p className="text-sm text-gray-500 mb-6">Configure security policies and access control settings.</p>
      </div>

      <Form onSubmit={handleSubmit} className="space-y-8">
        {/* Password Policy */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Key className="w-4 h-4 text-gray-500" />
            <h3 className="text-sm font-medium text-gray-900">Password Policy</h3>
          </div>
          <div className="grid grid-cols-2 gap-6 pl-6">
            <Input
              label="Minimum Password Length"
              name="minLength"
              type="number"
              value={settings.passwordPolicy.minLength}
              onChange={e => setSettings({
                ...settings,
                passwordPolicy: {
                  ...settings.passwordPolicy,
                  minLength: parseInt(e.target.value)
                }
              })}
              min={8}
              max={32}
            />
            <Input
              label="Password Expiry (Days)"
              name="expiryDays"
              type="number"
              value={settings.passwordPolicy.expiryDays}
              onChange={e => setSettings({
                ...settings,
                passwordPolicy: {
                  ...settings.passwordPolicy,
                  expiryDays: parseInt(e.target.value)
                }
              })}
              min={0}
            />
            <div className="col-span-2 space-y-4">
              <Switch
                label="Require Uppercase Letters"
                checked={settings.passwordPolicy.requireUppercase}
                onChange={checked => setSettings({
                  ...settings,
                  passwordPolicy: {
                    ...settings.passwordPolicy,
                    requireUppercase: checked
                  }
                })}
              />
              <Switch
                label="Require Numbers"
                checked={settings.passwordPolicy.requireNumbers}
                onChange={checked => setSettings({
                  ...settings,
                  passwordPolicy: {
                    ...settings.passwordPolicy,
                    requireNumbers: checked
                  }
                })}
              />
              <Switch
                label="Require Special Characters"
                checked={settings.passwordPolicy.requireSpecialChars}
                onChange={checked => setSettings({
                  ...settings,
                  passwordPolicy: {
                    ...settings.passwordPolicy,
                    requireSpecialChars: checked
                  }
                })}
              />
            </div>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-gray-500" />
            <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
          </div>
          <div className="pl-6 space-y-4">
            <Switch
              label="Require Two-Factor Authentication for all users"
              checked={settings.twoFactorAuth.enabled}
              onChange={checked => setSettings({
                ...settings,
                twoFactorAuth: {
                  ...settings.twoFactorAuth,
                  enabled: checked
                }
              })}
            />
            {settings.twoFactorAuth.enabled && (
              <Select
                label="Default Authentication Method"
                value={settings.twoFactorAuth.method}
                onChange={value => setSettings({
                  ...settings,
                  twoFactorAuth: {
                    ...settings.twoFactorAuth,
                    method: value as 'app' | 'sms' | 'email'
                  }
                })}
                options={[
                  { value: 'app', label: 'Authenticator App' },
                  { value: 'sms', label: 'SMS' },
                  { value: 'email', label: 'Email' }
                ]}
              />
            )}
          </div>
        </div>

        {/* Session Settings */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <h3 className="text-sm font-medium text-gray-900">Session Settings</h3>
          </div>
          <div className="pl-6">
            <Input
              label="Session Timeout (minutes)"
              name="sessionTimeout"
              type="number"
              value={settings.sessionTimeout}
              onChange={e => setSettings({
                ...settings,
                sessionTimeout: parseInt(e.target.value)
              })}
              min={5}
              max={1440}
            />
          </div>
        </div>

        {/* IP Whitelist */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-gray-500" />
            <h3 className="text-sm font-medium text-gray-900">IP Whitelist</h3>
          </div>
          <div className="pl-6 space-y-4">
            {settings.ipWhitelist.map((ip, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  label={`IP Address ${index + 1}`}
                  value={ip}
                  onChange={e => {
                    const newIps = [...settings.ipWhitelist];
                    newIps[index] = e.target.value;
                    setSettings({
                      ...settings,
                      ipWhitelist: newIps
                    });
                  }}
                  placeholder="Enter IP address"
                />
                <Button
                  type="button"
                  variant="danger"
                  onClick={() => {
                    const newIps = settings.ipWhitelist.filter((_, i) => i !== index);
                    setSettings({
                      ...settings,
                      ipWhitelist: newIps
                    });
                  }}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              onClick={() => setSettings({
                ...settings,
                ipWhitelist: [...settings.ipWhitelist, '']
              })}
            >
              Add IP Address
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4 pt-4 border-t">
          <Button type="button" variant="secondary">Reset to Defaults</Button>
          <Button type="submit" variant="primary">Save Changes</Button>
        </div>
      </Form>
    </div>
  );
};

export default SecuritySettings;
