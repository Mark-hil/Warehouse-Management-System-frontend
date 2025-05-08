import { api } from './api';

export interface CompanySettings {
  companyName: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  taxId: string;
  logo?: string;
  currency: string;
  timezone: string;
  dateFormat: string;
  fiscalYearStart: string;
}

export interface NotificationSettings {
  lowStockAlerts: boolean;
  orderNotifications: boolean;
  paymentAlerts: boolean;
  systemUpdates: boolean;
  emailNotifications: boolean;
  stockThreshold: number;
  emailFrequency: 'instant' | 'daily' | 'weekly';
}

export interface PrintingSettings {
  invoiceTemplate: string;
  receiptTemplate: string;
  barcodeFormat: string;
  printerName: string;
  pageSize: string;
  orientation: 'portrait' | 'landscape';
  margin: string;
  headerFooter: boolean;
}

export interface SecuritySettings {
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    expiryDays: number;
  };
  twoFactorAuth: boolean;
  sessionTimeout: number;
  ipWhitelist: string[];
}

export interface IntegrationSettings {
  paymentGateways: {
    stripe: boolean;
    paypal: boolean;
    squareup: boolean;
  };
  shipping: {
    fedex: boolean;
    ups: boolean;
    usps: boolean;
  };
  accounting: {
    quickbooks: boolean;
    xero: boolean;
    sage: boolean;
  };
}

export const settingsApi = {
  getCompanySettings: () => 
    api.get<CompanySettings>('/api/settings/company'),

  updateCompanySettings: (settings: Partial<CompanySettings>) =>
    api.put('/api/settings/company', settings),

  getNotificationSettings: () =>
    api.get<NotificationSettings>('/api/settings/notifications'),

  updateNotificationSettings: (settings: Partial<NotificationSettings>) =>
    api.put('/api/settings/notifications', settings),

  getPrintingSettings: () =>
    api.get<PrintingSettings>('/api/settings/printing'),

  updatePrintingSettings: (settings: Partial<PrintingSettings>) =>
    api.put('/api/settings/printing', settings),

  getSecuritySettings: () =>
    api.get<SecuritySettings>('/api/settings/security'),

  updateSecuritySettings: (settings: Partial<SecuritySettings>) =>
    api.put('/api/settings/security', settings),

  getIntegrationSettings: () =>
    api.get<IntegrationSettings>('/api/settings/integrations'),

  updateIntegrationSettings: (settings: Partial<IntegrationSettings>) =>
    api.put('/api/settings/integrations', settings),

  uploadLogo: (file: File) => {
    const formData = new FormData();
    formData.append('logo', file);
    return api.post('/api/settings/company/logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
