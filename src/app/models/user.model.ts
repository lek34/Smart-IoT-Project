export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'farmer' | 'technician';
  phone?: string;
  farmName?: string;
  farmSize?: number;
  farmLocation?: string;
  preferences: {
    temperatureUnit: 'celsius' | 'fahrenheit';
    humidityUnit: 'percentage';
    notifications: boolean;
    emailAlerts: boolean;
    smsAlerts: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}
