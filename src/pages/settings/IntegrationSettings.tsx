import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Truck,
  Calculator,
  ExternalLink,
  Check
} from 'lucide-react';
import { Form, Button, Switch } from '../../components/forms';
import type { IntegrationSettings } from '../../api/settings';
import { settingsApi } from '../../api/settings';

interface IntegrationCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  onConfigure: () => void;
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({
  title,
  description,
  icon,
  enabled,
  onToggle,
  onConfigure
}) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-start justify-between">
      <div className="flex items-start space-x-4">
        <div className="p-2 bg-blue-50 rounded-lg">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
      </div>
      <Switch
        checked={enabled}
        onChange={onToggle}
      />
    </div>
    {enabled && (
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Check className="w-4 h-4 text-green-500 mr-2" />
            <span className="text-sm text-gray-600">Connected</span>
          </div>
          <Button
            variant="secondary"
            onClick={onConfigure}
            className="text-sm"
          >
            Configure
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    )}
  </div>
);

const IntegrationSettings: React.FC = () => {
  const [settings, setSettings] = useState<IntegrationSettings>({
    paymentGateways: {
      stripe: false,
      paypal: false,
      squareup: false,
    },
    shipping: {
      fedex: false,
      ups: false,
      usps: false,
    },
    accounting: {
      quickbooks: false,
      xero: false,
      sage: false,
    },
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await settingsApi.getIntegrationSettings();
      setSettings(response.data);
    } catch (error) {
      console.error('Error loading integration settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await settingsApi.updateIntegrationSettings(settings);
      // Show success message
    } catch (error) {
      console.error('Error updating integration settings:', error);
      // Show error message
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Form onSubmit={handleSubmit} className="space-y-8">
      {/* Payment Gateways */}
      <div className="space-y-6">
        <h2 className="text-lg font-medium text-gray-900">Payment Gateways</h2>
        <div className="grid grid-cols-1 gap-6">
          <IntegrationCard
            title="Stripe"
            description="Accept credit card payments and manage subscriptions"
            icon={<CreditCard className="w-6 h-6 text-blue-600" />}
            enabled={settings.paymentGateways.stripe}
            onToggle={(enabled) => setSettings({
              ...settings,
              paymentGateways: {
                ...settings.paymentGateways,
                stripe: enabled
              }
            })}
            onConfigure={() => window.open('https://dashboard.stripe.com', '_blank')}
          />
          <IntegrationCard
            title="PayPal"
            description="Accept PayPal payments and enable express checkout"
            icon={<CreditCard className="w-6 h-6 text-blue-600" />}
            enabled={settings.paymentGateways.paypal}
            onToggle={(enabled) => setSettings({
              ...settings,
              paymentGateways: {
                ...settings.paymentGateways,
                paypal: enabled
              }
            })}
            onConfigure={() => window.open('https://www.paypal.com/businessmanage', '_blank')}
          />
          <IntegrationCard
            title="Square"
            description="Process in-person and online payments"
            icon={<CreditCard className="w-6 h-6 text-blue-600" />}
            enabled={settings.paymentGateways.squareup}
            onToggle={(enabled) => setSettings({
              ...settings,
              paymentGateways: {
                ...settings.paymentGateways,
                squareup: enabled
              }
            })}
            onConfigure={() => window.open('https://squareup.com/dashboard', '_blank')}
          />
        </div>
      </div>

      {/* Shipping Providers */}
      <div className="space-y-6">
        <h2 className="text-lg font-medium text-gray-900">Shipping Providers</h2>
        <div className="grid grid-cols-1 gap-6">
          <IntegrationCard
            title="FedEx"
            description="Ship packages and track deliveries with FedEx"
            icon={<Truck className="w-6 h-6 text-blue-600" />}
            enabled={settings.shipping.fedex}
            onToggle={(enabled) => setSettings({
              ...settings,
              shipping: {
                ...settings.shipping,
                fedex: enabled
              }
            })}
            onConfigure={() => window.open('https://www.fedex.com/login', '_blank')}
          />
          <IntegrationCard
            title="UPS"
            description="Manage shipments and tracking with UPS"
            icon={<Truck className="w-6 h-6 text-blue-600" />}
            enabled={settings.shipping.ups}
            onToggle={(enabled) => setSettings({
              ...settings,
              shipping: {
                ...settings.shipping,
                ups: enabled
              }
            })}
            onConfigure={() => window.open('https://www.ups.com/business', '_blank')}
          />
          <IntegrationCard
            title="USPS"
            description="Ship via USPS and print shipping labels"
            icon={<Truck className="w-6 h-6 text-blue-600" />}
            enabled={settings.shipping.usps}
            onToggle={(enabled) => setSettings({
              ...settings,
              shipping: {
                ...settings.shipping,
                usps: enabled
              }
            })}
            onConfigure={() => window.open('https://www.usps.com/business', '_blank')}
          />
        </div>
      </div>

      {/* Accounting Software */}
      <div className="space-y-6">
        <h2 className="text-lg font-medium text-gray-900">Accounting Software</h2>
        <div className="grid grid-cols-1 gap-6">
          <IntegrationCard
            title="QuickBooks"
            description="Sync transactions and manage accounting with QuickBooks"
            icon={<Calculator className="w-6 h-6 text-blue-600" />}
            enabled={settings.accounting.quickbooks}
            onToggle={(enabled) => setSettings({
              ...settings,
              accounting: {
                ...settings.accounting,
                quickbooks: enabled
              }
            })}
            onConfigure={() => window.open('https://quickbooks.intuit.com', '_blank')}
          />
          <IntegrationCard
            title="Xero"
            description="Connect your business finances with Xero"
            icon={<Calculator className="w-6 h-6 text-blue-600" />}
            enabled={settings.accounting.xero}
            onToggle={(enabled) => setSettings({
              ...settings,
              accounting: {
                ...settings.accounting,
                xero: enabled
              }
            })}
            onConfigure={() => window.open('https://www.xero.com/dashboard', '_blank')}
          />
          <IntegrationCard
            title="Sage"
            description="Manage your business accounting with Sage"
            icon={<Calculator className="w-6 h-6 text-blue-600" />}
            enabled={settings.accounting.sage}
            onToggle={(enabled) => setSettings({
              ...settings,
              accounting: {
                ...settings.accounting,
                sage: enabled
              }
            })}
            onConfigure={() => window.open('https://www.sage.com/dashboard', '_blank')}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" variant="primary">
          Save Integration Settings
        </Button>
      </div>
    </Form>
  );
};

export default IntegrationSettings;
