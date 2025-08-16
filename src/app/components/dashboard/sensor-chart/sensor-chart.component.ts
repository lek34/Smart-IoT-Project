import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-sensor-chart',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './sensor-chart.component.html',
    styleUrls: ['./sensor-chart.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SensorChartComponent {
    // Mock chart data - in a real app, this would use a charting library like Chart.js
    chartData = {
        labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
        temperature: [22, 20, 18, 25, 28, 26, 24],
        humidity: [65, 70, 75, 60, 55, 58, 62],
        soilMoisture: [45, 48, 50, 42, 38, 40, 43]
    };

    // Mock chart options
    chartOptions = {
        responsive: true,
        maintainAspectRatio: false
    };
}
