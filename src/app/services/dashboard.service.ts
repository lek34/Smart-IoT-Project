import { Injectable, computed, signal } from '@angular/core';
import { Observable, interval, map, startWith } from 'rxjs';
import { SensorData } from '../models/iot-device.model';

export interface DashboardMetrics {
  averageTemperature: number;
  averageHumidity: number;
  averageSoilMoisture: number;
  totalDevices: number;
  onlineDevices: number;
  criticalAlerts: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  // Real-time sensor data signals
  private sensorData = signal<SensorData[]>([]);
  private metrics = signal<DashboardMetrics>({
    averageTemperature: 0,
    averageHumidity: 0,
    averageSoilMoisture: 0,
    totalDevices: 0,
    onlineDevices: 0,
    criticalAlerts: 0
  });

  // Computed signals for reactive UI updates
  readonly currentSensorData = computed(() => this.sensorData());
  readonly currentMetrics = computed(() => this.metrics());
  
  readonly averageTemperature = computed(() => this.metrics().averageTemperature);
  readonly averageHumidity = computed(() => this.metrics().averageHumidity);
  readonly averageSoilMoisture = computed(() => this.metrics().averageSoilMoisture);
  
  // Temperature alerts using computed signals
  readonly temperatureAlerts = computed(() => {
    const temp = this.metrics().averageTemperature;
    if (temp > 35) return { type: 'danger', message: 'High temperature alert!', severity: 'high' };
    if (temp > 30) return { type: 'warning', message: 'Temperature rising', severity: 'medium' };
    if (temp < 10) return { type: 'warning', message: 'Low temperature alert!', severity: 'medium' };
    return null;
  });

  constructor() {
    this.initializeMockData();
    this.startRealTimeUpdates();
  }

  private initializeMockData(): void {
    const mockData: SensorData[] = [
      {
        deviceId: 'sensor-001',
        timestamp: new Date(),
        temperature: 25.5,
        humidity: 65,
        soilMoisture: 45,
        lightIntensity: 800,
        ph: 6.8,
        nitrogen: 120,
        phosphorus: 45,
        potassium: 180
      },
      {
        deviceId: 'sensor-002',
        timestamp: new Date(),
        temperature: 28.2,
        humidity: 58,
        soilMoisture: 38,
        lightIntensity: 950,
        ph: 7.1,
        nitrogen: 110,
        phosphorus: 52,
        potassium: 165
      },
      {
        deviceId: 'sensor-003',
        timestamp: new Date(),
        temperature: 22.8,
        humidity: 72,
        soilMoisture: 52,
        lightIntensity: 650,
        ph: 6.5,
        nitrogen: 135,
        phosphorus: 48,
        potassium: 190
      }
    ];

    this.sensorData.set(mockData);
    this.updateMetrics();
  }

  private startRealTimeUpdates(): void {
    // Simulate real-time sensor data updates every 5 seconds
    interval(5000).subscribe(() => {
      this.updateMockSensorData();
    });
  }

  private updateMockSensorData(): void {
    const currentData = this.sensorData();
    const updatedData = currentData.map(sensor => ({
      ...sensor,
      timestamp: new Date(),
      temperature: this.generateRandomValue(sensor.temperature || 25, 2),
      humidity: this.generateRandomValue(sensor.humidity || 60, 5),
      soilMoisture: this.generateRandomValue(sensor.soilMoisture || 45, 3),
      lightIntensity: this.generateRandomValue(sensor.lightIntensity || 800, 50),
      ph: this.generateRandomValue(sensor.ph || 6.8, 0.2),
      nitrogen: this.generateRandomValue(sensor.nitrogen || 120, 10),
      phosphorus: this.generateRandomValue(sensor.phosphorus || 45, 5),
      potassium: this.generateRandomValue(sensor.potassium || 180, 15)
    }));

    this.sensorData.set(updatedData);
    this.updateMetrics();
  }

  private generateRandomValue(baseValue: number, variance: number): number {
    const randomFactor = (Math.random() - 0.5) * 2; // -1 to 1
    return Math.max(0, baseValue + (randomFactor * variance));
  }

  private updateMetrics(): void {
    const data = this.sensorData();
    if (data.length === 0) return;

    const avgTemp = data.reduce((sum, sensor) => sum + (sensor.temperature || 0), 0) / data.length;
    const avgHumidity = data.reduce((sum, sensor) => sum + (sensor.humidity || 0), 0) / data.length;
    const avgSoilMoisture = data.reduce((sum, sensor) => sum + (sensor.soilMoisture || 0), 0) / data.length;

    this.metrics.set({
      averageTemperature: Math.round(avgTemp * 10) / 10,
      averageHumidity: Math.round(avgHumidity),
      averageSoilMoisture: Math.round(avgSoilMoisture),
      totalDevices: 12, // Mock total devices
      onlineDevices: 10, // Mock online devices
      criticalAlerts: this.temperatureAlerts() ? 1 : 0
    });
  }

  // Public methods for external components
  getSensorDataStream(): Observable<SensorData[]> {
    return interval(1000).pipe(
      startWith(this.currentSensorData()),
      map(() => this.currentSensorData())
    );
  }

  getMetricsStream(): Observable<DashboardMetrics> {
    return interval(1000).pipe(
      startWith(this.currentMetrics()),
      map(() => this.currentMetrics())
    );
  }

  // Method to manually refresh data (useful for testing)
  refreshData(): void {
    this.updateMockSensorData();
  }
}
