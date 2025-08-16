import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { DashboardService } from '../../services/dashboard.service';
import { DeviceStore } from '../../stores/device.store';
import { MetricCardComponent } from './metric-card/metric-card.component';
import { SensorChartComponent } from './sensor-chart/sensor-chart.component';
import { AlertPanelComponent } from './alert-panel/alert-panel.component';
import { DeviceStatusComponent } from './device-status/device-status.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MetricCardComponent,
    SensorChartComponent,
    AlertPanelComponent,
    DeviceStatusComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit, OnDestroy {
  private dashboardService = inject(DashboardService);
  private deviceStore = inject(DeviceStore);
  private destroy$ = new Subject<void>();

  // Signals from services
  readonly metrics = this.dashboardService.currentMetrics;
  readonly temperatureAlerts = this.dashboardService.temperatureAlerts;
  readonly devices = this.deviceStore.devices;
  readonly alerts = this.deviceStore.alerts;
  readonly loading = this.deviceStore.loading;

  ngOnInit(): void {
    this.loadInitialData();
    this.startRealTimeUpdates();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadInitialData(): void {
    this.deviceStore.setLoading(true);
    
    // Load devices and alerts
    this.deviceStore.setDevices([
      {
        id: 'device-001',
        name: 'Temperature Sensor 1',
        type: 'sensor',
        location: 'Field A - North',
        status: 'online',
        lastSeen: new Date(),
        batteryLevel: 85,
        firmwareVersion: 'v2.1.0'
      },
      {
        id: 'device-002',
        name: 'Humidity Sensor 1',
        type: 'sensor',
        location: 'Field A - South',
        status: 'online',
        lastSeen: new Date(),
        batteryLevel: 92,
        firmwareVersion: 'v2.1.0'
      },
      {
        id: 'device-003',
        name: 'Soil Moisture Sensor 1',
        type: 'sensor',
        location: 'Field B - East',
        status: 'offline',
        lastSeen: new Date(Date.now() - 3600000),
        batteryLevel: 15,
        firmwareVersion: 'v2.0.5'
      }
    ]);

    this.deviceStore.setAlerts([
      {
        id: 'alert-001',
        deviceId: 'device-003',
        type: 'warning',
        message: 'Low battery level detected',
        timestamp: new Date(Date.now() - 1800000),
        isRead: false,
        severity: 'medium'
      },
      {
        id: 'alert-002',
        deviceId: 'device-001',
        type: 'info',
        message: 'Temperature within normal range',
        timestamp: new Date(),
        isRead: true,
        severity: 'low'
      }
    ]);
  }

  private startRealTimeUpdates(): void {
    // Subscribe to real-time updates
    this.dashboardService.getMetricsStream()
      .pipe(takeUntil(this.destroy$))
      .subscribe();

    this.dashboardService.getSensorDataStream()
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  refreshData(): void {
    this.dashboardService.refreshData();
  }

  trackByDeviceId(index: number, device: any): string {
    return device.id;
  }

  trackByAlertId(index: number, alert: any): string {
    return alert.id;
  }
}
