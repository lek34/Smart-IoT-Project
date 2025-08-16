export interface IotDevice {
  id: string;
  name: string;
  type: 'sensor' | 'actuator' | 'controller';
  location: string;
  status: 'online' | 'offline' | 'maintenance';
  lastSeen: Date;
  batteryLevel?: number;
  firmwareVersion: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  metadata?: Record<string, any>;
}

export interface SensorData {
  deviceId: string;
  timestamp: Date;
  temperature?: number;
  humidity?: number;
  soilMoisture?: number;
  lightIntensity?: number;
  ph?: number;
  nitrogen?: number;
  phosphorus?: number;
  potassium?: number;
}

export interface DeviceAlert {
  id: string;
  deviceId: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: Date;
  isRead: boolean;
  severity: 'low' | 'medium' | 'high';
}
