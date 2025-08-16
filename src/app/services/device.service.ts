import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { IotDevice, DeviceAlert } from '../models/iot-device.model';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private mockDevices: IotDevice[] = [
    {
      id: 'device-001',
      name: 'Temperature Sensor 1',
      type: 'sensor',
      location: 'Field A - North',
      status: 'online',
      lastSeen: new Date(),
      batteryLevel: 85,
      firmwareVersion: 'v2.1.0',
      coordinates: { latitude: 40.7128, longitude: -74.0060 }
    },
    {
      id: 'device-002',
      name: 'Humidity Sensor 1',
      type: 'sensor',
      location: 'Field A - South',
      status: 'online',
      lastSeen: new Date(),
      batteryLevel: 92,
      firmwareVersion: 'v2.1.0',
      coordinates: { latitude: 40.7129, longitude: -74.0061 }
    },
    {
      id: 'device-003',
      name: 'Soil Moisture Sensor 1',
      type: 'sensor',
      location: 'Field B - East',
      status: 'offline',
      lastSeen: new Date(Date.now() - 3600000), // 1 hour ago
      batteryLevel: 15,
      firmwareVersion: 'v2.0.5',
      coordinates: { latitude: 40.7130, longitude: -74.0062 }
    },
    {
      id: 'device-004',
      name: 'Irrigation Controller 1',
      type: 'controller',
      location: 'Field A - Center',
      status: 'online',
      lastSeen: new Date(),
      batteryLevel: 78,
      firmwareVersion: 'v1.9.2',
      coordinates: { latitude: 40.7127, longitude: -74.0059 }
    },
    {
      id: 'device-005',
      name: 'Light Sensor 1',
      type: 'sensor',
      location: 'Greenhouse 1',
      status: 'maintenance',
      lastSeen: new Date(Date.now() - 7200000), // 2 hours ago
      batteryLevel: 45,
      firmwareVersion: 'v2.1.1',
      coordinates: { latitude: 40.7131, longitude: -74.0063 }
    }
  ];

  private mockAlerts: DeviceAlert[] = [
    {
      id: 'alert-001',
      deviceId: 'device-003',
      type: 'warning',
      message: 'Low battery level detected',
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      isRead: false,
      severity: 'medium'
    },
    {
      id: 'alert-002',
      deviceId: 'device-005',
      type: 'error',
      message: 'Device offline for more than 2 hours',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      isRead: false,
      severity: 'high'
    },
    {
      id: 'alert-003',
      deviceId: 'device-001',
      type: 'info',
      message: 'Firmware update available',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      isRead: true,
      severity: 'low'
    }
  ];

  constructor() {}

  // Device CRUD operations
  getDevices(): Observable<IotDevice[]> {
    return of([...this.mockDevices]).pipe(delay(500)); // Simulate network delay
  }

  getDeviceById(id: string): Observable<IotDevice | undefined> {
    const device = this.mockDevices.find(d => d.id === id);
    if (device) {
      return of({ ...device }).pipe(delay(300));
    }
    return throwError(() => new Error('Device not found'));
  }

  createDevice(device: Omit<IotDevice, 'id' | 'lastSeen'>): Observable<IotDevice> {
    const newDevice: IotDevice = {
      ...device,
      id: `device-${Date.now()}`,
      lastSeen: new Date()
    };
    
    this.mockDevices.push(newDevice);
    return of({ ...newDevice }).pipe(delay(500));
  }

  updateDevice(id: string, updates: Partial<IotDevice>): Observable<IotDevice> {
    const index = this.mockDevices.findIndex(d => d.id === id);
    if (index === -1) {
      return throwError(() => new Error('Device not found'));
    }

    this.mockDevices[index] = { ...this.mockDevices[index], ...updates };
    return of({ ...this.mockDevices[index] }).pipe(delay(500));
  }

  deleteDevice(id: string): Observable<void> {
    const index = this.mockDevices.findIndex(d => d.id === id);
    if (index === -1) {
      return throwError(() => new Error('Device not found'));
    }

    this.mockDevices.splice(index, 1);
    return of(void 0).pipe(delay(300));
  }

  // Alert operations
  getAlerts(): Observable<DeviceAlert[]> {
    return of([...this.mockAlerts]).pipe(delay(300));
  }

  markAlertAsRead(id: string): Observable<void> {
    const alert = this.mockAlerts.find(a => a.id === id);
    if (alert) {
      alert.isRead = true;
    }
    return of(void 0).pipe(delay(200));
  }

  // Device status operations
  updateDeviceStatus(id: string, status: IotDevice['status']): Observable<IotDevice> {
    return this.updateDevice(id, { status });
  }

  // Mock real-time status updates
  getDeviceStatusUpdates(): Observable<IotDevice[]> {
    return of(this.mockDevices).pipe(delay(1000));
  }

  // Search and filter methods
  searchDevices(query: string): Observable<IotDevice[]> {
    const filtered = this.mockDevices.filter(device =>
      device.name.toLowerCase().includes(query.toLowerCase()) ||
      device.location.toLowerCase().includes(query.toLowerCase()) ||
      device.type.toLowerCase().includes(query.toLowerCase())
    );
    return of(filtered).pipe(delay(200));
  }

  getDevicesByType(type: IotDevice['type']): Observable<IotDevice[]> {
    const filtered = this.mockDevices.filter(device => device.type === type);
    return of(filtered).pipe(delay(200));
  }

  getDevicesByStatus(status: IotDevice['status']): Observable<IotDevice[]> {
    const filtered = this.mockDevices.filter(device => device.status === status);
    return of(filtered).pipe(delay(200));
  }
}
