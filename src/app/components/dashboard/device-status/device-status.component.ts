import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IotDevice } from '../../../models/iot-device.model';

@Component({
  selector: 'app-device-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './device-status.component.html',
  styleUrls: ['./device-status.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeviceStatusComponent {
  @Input() devices: IotDevice[] = [];

  getStatusColor(status: string): string {
    switch (status) {
      case 'online':
        return 'bg-success-100 text-success-800 border-success-200';
      case 'offline':
        return 'bg-danger-100 text-danger-800 border-danger-200';
      case 'maintenance':
        return 'bg-warning-100 text-warning-800 border-warning-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'online':
        return 'M5 13l4 4L19 7';
      case 'offline':
        return 'M6 18L18 6M6 6l12 12';
      case 'maintenance':
        return 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z';
      default:
        return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
    }
  }

  getDeviceTypeIcon(type: string): string {
    switch (type) {
      case 'sensor':
        return 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z';
      case 'actuator':
        return 'M13 10V3L4 14h7v7l9-11h-7z';
      case 'controller':
        return 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z';
      default:
        return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
    }
  }

  getBatteryColor(level: number): string {
    if (level > 60) return 'text-success-600';
    if (level > 30) return 'text-warning-600';
    return 'text-danger-600';
  }

  getBatteryIcon(level: number): string {
    if (level > 80) return 'M5 12h14M5 12v6a2 2 0 002 2h10a2 2 0 002-2v-6M5 12V6a2 2 0 012-2h10a2 2 0 012 2v6';
    if (level > 60) return 'M5 12h10M5 12v6a2 2 0 002 2h6a2 2 0 002-2v-6M5 12V6a2 2 0 012-2h10a2 2 0 012 2v6';
    if (level > 40) return 'M5 12h6M5 12v6a2 2 0 002 2h2a2 2 0 002-2v-6M5 12V6a2 2 0 012-2h10a2 2 0 012 2v6';
    return 'M5 12h2M5 12v6a2 2 0 002 2h2a2 2 0 002-2v-6M5 12V6a2 2 0 012-2h10a2 2 0 012 2v6';
  }

  formatTimeAgo(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  }

  trackByDeviceId(index: number, device: IotDevice): string {
    return device.id;
  }
}
