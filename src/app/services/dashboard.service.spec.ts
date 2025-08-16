import { TestBed } from '@angular/core/testing';
import { DashboardService } from './dashboard.service';
import { SensorData } from '../models/iot-device.model';

describe('DashboardService', () => {
    let service: DashboardService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DashboardService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should initialize with mock sensor data', () => {
        const sensorData = service.currentSensorData();
        expect(sensorData.length).toBeGreaterThan(0);
    });

    it('should calculate average metrics correctly', () => {
        const metrics = service.currentMetrics();
        expect(metrics.averageTemperature).toBeGreaterThan(0);
        expect(metrics.averageHumidity).toBeGreaterThan(0);
        expect(metrics.averageSoilMoisture).toBeGreaterThan(0);
        expect(metrics.totalDevices).toBe(12);
        expect(metrics.onlineDevices).toBe(10);
    });

    it('should generate temperature alerts for high temperatures', () => {
        // Mock high temperature scenario
        const mockData: SensorData[] = [
            {
                deviceId: 'test-device',
                timestamp: new Date(),
                temperature: 36, // High temperature
                humidity: 60,
                soilMoisture: 45
            }
        ];

        // Update the service with mock data
        (service as any).sensorData.set(mockData);
        (service as any).updateMetrics();

        const alert = service.temperatureAlerts();
        expect(alert).toBeTruthy();
        expect(alert?.type).toBe('danger');
        expect(alert?.message).toContain('High temperature alert');
    });

    it('should generate temperature alerts for low temperatures', () => {
        // Mock low temperature scenario
        const mockData: SensorData[] = [
            {
                deviceId: 'test-device',
                timestamp: new Date(),
                temperature: 8, // Low temperature
                humidity: 60,
                soilMoisture: 45
            }
        ];

        // Update the service with mock data
        (service as any).sensorData.set(mockData);
        (service as any).updateMetrics();

        const alert = service.temperatureAlerts();
        expect(alert).toBeTruthy();
        expect(alert?.type).toBe('warning');
        expect(alert?.message).toContain('Low temperature alert');
    });

    it('should provide real-time data streams', (done) => {
        const dataStream = service.getSensorDataStream();
        let dataReceived = false;

        dataStream.subscribe(data => {
            expect(data).toBeTruthy();
            expect(Array.isArray(data)).toBe(true);
            dataReceived = true;
            done();
        });

        // Trigger a refresh to ensure data is sent
        service.refreshData();
    });

    it('should provide metrics streams', (done) => {
        const metricsStream = service.getMetricsStream();
        let metricsReceived = false;

        metricsStream.subscribe(metrics => {
            expect(metrics).toBeTruthy();
            metricsReceived = true;
            done();
        });

        // Trigger a refresh to ensure metrics are sent
        service.refreshData();
    });

    it('should handle data updates correctly', () => {
        const initialMetrics = service.currentMetrics();
        service.refreshData();

        // After refresh, metrics should still be valid
        const updatedMetrics = service.currentMetrics();
        expect(updatedMetrics.averageTemperature).toBeGreaterThan(0);
        expect(updatedMetrics.averageHumidity).toBeGreaterThan(0);
        expect(updatedMetrics.averageSoilMoisture).toBeGreaterThan(0);
    });
});
