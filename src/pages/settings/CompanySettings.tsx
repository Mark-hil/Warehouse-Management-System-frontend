import React, { useState } from 'react';
import { Form, Input, Select, Button } from '../../components/forms';
import { settingsApi } from '../../api/settings';
import type { CompanySettings as ICompanySettings } from '../../api/settings';

const CompanySettings: React.FC = () => {
  const [companySettings, setCompanySettings] = useState<ICompanySettings>({
    companyName: 'Warehouse Inc.',
    address: '123 Main St, City, Country',
    phone: '+1 234 567 890',
    email: 'contact@warehouse.com',
    website: 'www.warehouse.com',
    taxId: 'TAX-123456',
    currency: 'USD',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    fiscalYearStart: '01-01'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await settingsApi.updateCompanySettings(companySettings);
      // Show success message
    } catch (error) {
      console.error('Error updating company settings:', error);
      // Show error message
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Company Information</h2>
        <p className="text-sm text-gray-500 mb-6">Manage your company's basic information and settings.</p>
      </div>

      <Form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="space-y-6">
          <h3 className="text-sm font-medium text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">Basic Information</h3>
          <div className="grid grid-cols-2 gap-6 px-4">
            <Input
              label="Company Name"
              name="companyName"
              value={companySettings.companyName}
              onChange={e => setCompanySettings({ ...companySettings, companyName: e.target.value })}
              required
            />
            <Input
              label="Tax ID"
              name="taxId"
              value={companySettings.taxId}
              onChange={e => setCompanySettings({ ...companySettings, taxId: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <h3 className="text-sm font-medium text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">Contact Information</h3>
          <div className="grid grid-cols-2 gap-6 px-4">
            <Input
              label="Phone"
              name="phone"
              value={companySettings.phone}
              onChange={e => setCompanySettings({ ...companySettings, phone: e.target.value })}
              required
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={companySettings.email}
              onChange={e => setCompanySettings({ ...companySettings, email: e.target.value })}
              required
            />
            <Input
              label="Website"
              name="website"
              value={companySettings.website}
              onChange={e => setCompanySettings({ ...companySettings, website: e.target.value })}
            />
          </div>
        </div>

        {/* Localization */}
        <div className="space-y-6">
          <h3 className="text-sm font-medium text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">Localization</h3>
          <div className="grid grid-cols-2 gap-6 px-4">
            <Select
              label="Currency"
              name="currency"
              value={companySettings.currency}
              onChange={value => setCompanySettings({ ...companySettings, currency: value })}
              options={[
                { value: 'USD', label: 'US Dollar (USD)' },
                { value: 'EUR', label: 'Euro (EUR)' },
                { value: 'GBP', label: 'British Pound (GBP)' }
              ]}
            />
            <Select
              label="Timezone"
              name="timezone"
              value={companySettings.timezone}
              onChange={value => setCompanySettings({ ...companySettings, timezone: value })}
              options={[
                { value: 'UTC', label: 'UTC' },
                { value: 'America/New_York', label: 'Eastern Time' },
                { value: 'America/Los_Angeles', label: 'Pacific Time' }
              ]}
            />
            <Select
              label="Date Format"
              name="dateFormat"
              value={companySettings.dateFormat}
              onChange={value => setCompanySettings({ ...companySettings, dateFormat: value })}
              options={[
                { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
              ]}
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4 pt-4 border-t">
          <Button type="button" variant="secondary">Cancel</Button>
          <Button type="submit" variant="primary">Save Changes</Button>
        </div>
      </Form>
    </div>
  );
};

export default CompanySettings;
