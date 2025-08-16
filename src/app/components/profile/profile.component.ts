import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit, OnDestroy {
  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();

  // User data
  user: User | null = null;
  loading = false;
  error: string | null = null;
  success: string | null = null;

  // Forms
  profileForm: FormGroup;
  preferencesForm: FormGroup;
  passwordForm: FormGroup;

  // Form states
  isEditingProfile = false;
  isEditingPreferences = false;
  isChangingPassword = false;

  constructor() {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      farmName: [''],
      farmSize: [0, [Validators.min(0)]],
      farmLocation: ['']
    });

    this.preferencesForm = this.fb.group({
      temperatureUnit: ['celsius', Validators.required],
      humidityUnit: ['percentage', Validators.required],
      notifications: [true],
      emailAlerts: [true],
      smsAlerts: [false]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUserProfile(): void {
    this.loading = true;
    this.userService.getCurrentUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          this.user = user;
          this.populateForms();
          this.loading = false;
        },
        error: (error) => {
          this.error = error.message;
          this.loading = false;
        }
      });
  }

  private populateForms(): void {
    if (this.user) {
      this.profileForm.patchValue({
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email,
        phone: this.user.phone || '',
        farmName: this.user.farmName || '',
        farmSize: this.user.farmSize || 0,
        farmLocation: this.user.farmLocation || ''
      });

      this.preferencesForm.patchValue({
        temperatureUnit: this.user.preferences.temperatureUnit,
        humidityUnit: this.user.preferences.humidityUnit,
        notifications: this.user.preferences.notifications,
        emailAlerts: this.user.preferences.emailAlerts,
        smsAlerts: this.user.preferences.smsAlerts
      });
    }
  }

  private passwordMatchValidator(group: FormGroup): { [key: string]: any } | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  // Profile form handling
  startEditingProfile(): void {
    this.isEditingProfile = true;
    this.error = null;
    this.success = null;
  }

  cancelProfileEdit(): void {
    this.isEditingProfile = false;
    this.populateForms();
    this.error = null;
  }

  saveProfile(): void {
    if (this.profileForm.valid && this.user) {
      const updates = this.profileForm.value;
      this.loading = true;

      this.userService.updateUser(updates)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updatedUser) => {
            this.user = updatedUser;
            this.isEditingProfile = false;
            this.success = 'Profile updated successfully!';
            this.loading = false;
            setTimeout(() => this.success = null, 3000);
          },
          error: (error) => {
            this.error = error.message;
            this.loading = false;
          }
        });
    }
  }

  // Preferences form handling
  startEditingPreferences(): void {
    this.isEditingPreferences = true;
    this.error = null;
    this.success = null;
  }

  cancelPreferencesEdit(): void {
    this.isEditingPreferences = false;
    this.populateForms();
    this.error = null;
  }

  savePreferences(): void {
    if (this.preferencesForm.valid) {
      const updates = this.preferencesForm.value;
      this.loading = true;

      this.userService.updatePreferences(updates)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updatedUser) => {
            this.user = updatedUser;
            this.isEditingPreferences = false;
            this.success = 'Preferences updated successfully!';
            this.loading = false;
            setTimeout(() => this.success = null, 3000);
          },
          error: (error) => {
            this.error = error.message;
            this.loading = false;
          }
        });
    }
  }

  // Password form handling
  startChangingPassword(): void {
    this.isChangingPassword = true;
    this.passwordForm.reset();
    this.error = null;
    this.success = null;
  }

  cancelPasswordChange(): void {
    this.isChangingPassword = false;
    this.error = null;
  }

  changePassword(): void {
    if (this.passwordForm.valid) {
      const { currentPassword, newPassword } = this.passwordForm.value;
      this.loading = true;

      this.userService.changePassword(currentPassword, newPassword)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (result) => {
            if (result.success) {
              this.isChangingPassword = false;
              this.success = result.message;
              this.loading = false;
              setTimeout(() => this.success = null, 3000);
            } else {
              this.error = result.message;
              this.loading = false;
            }
          },
          error: (error) => {
            this.error = error.message;
            this.loading = false;
          }
        });
    }
  }

  // Utility methods
  getRoleDisplayName(role: string): string {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'farmer':
        return 'Farmer';
      case 'technician':
        return 'Technician';
      default:
        return role;
    }
  }

  getRoleColor(role: string): string {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'farmer':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'technician':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  clearError(): void {
    this.error = null;
  }

  clearSuccess(): void {
    this.success = null;
  }
}
