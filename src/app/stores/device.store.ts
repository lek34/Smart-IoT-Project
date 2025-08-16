import { Injectable, computed, signal } from '@angular/core';
import { IotDevice, DeviceAlert } from '../models/iot-device.model';

export interface DeviceState {
  devices: IotDevice[];
  alerts: DeviceAlert[];
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class DeviceStore {
  // State
  private state = signal<DeviceState>({
    devices: [],
    alerts: [],
    loading: false,
    error: null
  });

  // Selectors
  readonly devices = computed(() => this.state().devices);
  readonly alerts = computed(() => this.state().alerts);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);
  
  readonly onlineDevices = computed(() => 
    this.devices().filter(device => device.status === 'online')
  );
  
  readonly offlineDevices = computed(() => 
    this.devices().filter(device => device.status === 'offline')
  );
  
  readonly maintenanceDevices = computed(() => 
    this.devices().filter(device => device.status === 'maintenance')
  );
  
  readonly unreadAlerts = computed(() => 
    this.alerts().filter(alert => !alert.isRead)
  );
  
  readonly highSeverityAlerts = computed(() => 
    this.alerts().filter(alert => alert.severity === 'high')
  );

  // Actions
  setLoading(loading: boolean) {
    this.state.update(state => ({ ...state, loading, error: null }));
  }

  setError(error: string) {
    this.state.update(state => ({ ...state, error, loading: false }));
  }

  setDevices(devices: IotDevice[]) {
    this.state.update(state => ({ ...state, devices, loading: false, error: null }));
  }

  addDevice(device: IotDevice) {
    this.state.update(state => ({
      ...state,
      devices: [...state.devices, device],
      error: null
    }));
  }

  updateDevice(updatedDevice: IotDevice) {
    this.state.update(state => ({
      ...state,
      devices: state.devices.map(device => 
        device.id === updatedDevice.id ? updatedDevice : device
      ),
      error: null
    }));
  }

  deleteDevice(deviceId: string) {
    this.state.update(state => ({
      ...state,
      devices: state.devices.filter(device => device.id !== deviceId),
      error: null
    }));
  }

  setAlerts(alerts: DeviceAlert[]) {
    this.state.update(state => ({ ...state, alerts, error: null }));
  }

  addAlert(alert: DeviceAlert) {
    this.state.update(state => ({
      ...state,
      alerts: [alert, ...state.alerts],
      error: null
    }));
  }

  markAlertAsRead(alertId: string) {
    this.state.update(state => ({
      ...state,
      alerts: state.alerts.map(alert => 
        alert.id === alertId ? { ...alert, isRead: true } : alert
      )
    }));
  }

  clearError() {
    this.state.update(state => ({ ...state, error: null }));
  }
}
