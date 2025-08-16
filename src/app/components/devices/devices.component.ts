import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { DeviceStore } from '../../stores/device.store';
import { DeviceService } from '../../services/device.service';
import { IotDevice } from '../../models/iot-device.model';

@Component({
  selector: 'app-devices',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DevicesComponent implements OnInit, OnDestroy {
  private deviceStore = inject(DeviceStore);
  private deviceService = inject(DeviceService);
  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();

  // Signals from store
  readonly devices = this.deviceStore.devices;
  readonly loading = this.deviceStore.loading;
  readonly error = this.deviceStore.error;

  // Form for adding/editing devices
  deviceForm: FormGroup;
  isEditing = false;
  editingDeviceId: string | null = null;
  showForm = false;

  // Search and filters
  searchQuery = '';
  selectedType: string = '';
  selectedStatus: string = '';

  constructor() {
    this.deviceForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      type: ['sensor', Validators.required],
      location: ['', Validators.required],
      status: ['online', Validators.required],
      firmwareVersion: ['v1.0.0', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadDevices();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDevices(): void {
    this.deviceStore.setLoading(true);
    this.deviceService.getDevices()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (devices) => {
          this.deviceStore.setDevices(devices);
        },
        error: (error) => {
          this.deviceStore.setError(error.message);
        }
      });
  }

  // Form handling
  showAddForm(): void {
    this.isEditing = false;
    this.editingDeviceId = null;
    this.deviceForm.reset({
      type: 'sensor',
      status: 'online',
      firmwareVersion: 'v1.0.0'
    });
    this.showForm = true;
  }

  showEditForm(device: IotDevice): void {
    this.isEditing = true;
    this.editingDeviceId = device.id;
    this.deviceForm.patchValue({
      name: device.name,
      type: device.type,
      location: device.location,
      status: device.status,
      firmwareVersion: device.firmwareVersion
    });
    this.showForm = true;
  }

  cancelForm(): void {
    this.showForm = false;
    this.deviceForm.reset();
    this.isEditing = false;
    this.editingDeviceId = null;
  }

  onSubmit(): void {
    if (this.deviceForm.valid) {
      const deviceData = this.deviceForm.value;
      
      if (this.isEditing && this.editingDeviceId) {
        this.deviceService.updateDevice(this.editingDeviceId, deviceData)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (updatedDevice) => {
              this.deviceStore.updateDevice(updatedDevice);
              this.cancelForm();
            },
            error: (error) => {
              this.deviceStore.setError(error.message);
            }
          });
      } else {
        this.deviceService.createDevice(deviceData)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (newDevice) => {
              this.deviceStore.addDevice(newDevice);
              this.cancelForm();
            },
            error: (error) => {
              this.deviceStore.setError(error.message);
            }
          });
      }
    }
  }

  // Device operations
  deleteDevice(deviceId: string): void {
    if (confirm('Are you sure you want to delete this device?')) {
      this.deviceService.deleteDevice(deviceId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.deviceStore.deleteDevice(deviceId);
          },
          error: (error) => {
            this.deviceStore.setError(error.message);
          }
        });
    }
  }

  updateDeviceStatus(deviceId: string, status: IotDevice['status']): void {
    this.deviceService.updateDeviceStatus(deviceId, status)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedDevice) => {
          this.deviceStore.updateDevice(updatedDevice);
        },
        error: (error) => {
          this.deviceStore.setError(error.message);
        }
      });
  }

  // Search and filtering
  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.deviceService.searchDevices(this.searchQuery)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (devices) => {
            this.deviceStore.setDevices(devices);
          },
          error: (error) => {
            this.deviceStore.setError(error.message);
          }
        });
    } else {
      this.loadDevices();
    }
  }

  onTypeFilter(): void {
    if (this.selectedType) {
      this.deviceService.getDevicesByType(this.selectedType as IotDevice['type'])
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (devices) => {
            this.deviceStore.setDevices(devices);
          },
          error: (error) => {
            this.deviceStore.setError(error.message);
          }
        });
    } else {
      this.loadDevices();
    }
  }

  onStatusFilter(): void {
    if (this.selectedStatus) {
      this.deviceService.getDevicesByStatus(this.selectedStatus as IotDevice['status'])
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (devices) => {
            this.deviceStore.setDevices(devices);
          },
          error: (error) => {
            this.deviceStore.setError(error.message);
          }
        });
    } else {
      this.loadDevices();
    }
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedType = '';
    this.selectedStatus = '';
    this.loadDevices();
  }

  // Utility methods
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

  trackByDeviceId(index: number, device: IotDevice): string {
    return device.id;
  }
}
