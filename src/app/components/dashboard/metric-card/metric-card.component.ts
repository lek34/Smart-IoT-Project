import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type TrendType = 'up' | 'down' | 'stable';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './metric-card.component.html',
  styleUrls: ['./metric-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MetricCardComponent {
  @Input() title: string = '';
  @Input() value: number = 0;
  @Input() unit: string = '';
  @Input() icon: string = '';
  @Input() trend: TrendType = 'stable';
  @Input() total?: number;

  // Make Math available in template
  Math = Math;

  getIconPath(): string {
    switch (this.icon) {
      case 'thermometer':
        return 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z';
      case 'droplet':
        return 'M12 2.69l5.66 5.66a8 8 0 11-11.31 0z';
      case 'leaf':
        return 'M12 2.69l5.66 5.66a8 8 0 11-11.31 0z';
      case 'wifi':
        return 'M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0';
      default:
        return 'M13 10V3L4 14h7v7l9-11h-7z';
    }
  }

  getTrendIcon(): string {
    switch (this.trend) {
      case 'up':
        return 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6';
      case 'down':
        return 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6';
      case 'stable':
        return 'M5 12h14';
      default:
        return 'M5 12h14';
    }
  }

  getTrendColor(): string {
    switch (this.trend) {
      case 'up':
        return 'text-success-600';
      case 'down':
        return 'text-danger-600';
      case 'stable':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  }

  getFormattedValue(): string {
    if (this.total !== undefined) {
      return `${this.value}/${this.total}`;
    }
    return this.value.toString();
  }
}
