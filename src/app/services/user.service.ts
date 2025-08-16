import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUser: User = {
    id: 'user-001',
    email: 'farmer@smartfarm.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'farmer',
    phone: '+1 (555) 123-4567',
    farmName: 'Green Valley Farm',
    farmSize: 150,
    farmLocation: 'California, USA',
    preferences: {
      temperatureUnit: 'celsius',
      humidityUnit: 'percentage',
      notifications: true,
      emailAlerts: true,
      smsAlerts: false
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  };

  constructor() {}

  getCurrentUser(): Observable<User> {
    return of({ ...this.currentUser }).pipe(delay(300));
  }

  updateUser(updates: Partial<User>): Observable<User> {
    this.currentUser = { ...this.currentUser, ...updates, updatedAt: new Date() };
    return of({ ...this.currentUser }).pipe(delay(500));
  }

  updatePreferences(preferences: Partial<User['preferences']>): Observable<User> {
    this.currentUser.preferences = { ...this.currentUser.preferences, ...preferences };
    this.currentUser.updatedAt = new Date();
    return of({ ...this.currentUser }).pipe(delay(300));
  }

  changePassword(currentPassword: string, newPassword: string): Observable<{ success: boolean; message: string }> {
    // Mock password change - in real app, this would validate current password
    if (currentPassword === 'current123') {
      return of({ success: true, message: 'Password changed successfully' }).pipe(delay(500));
    } else {
      return of({ success: false, message: 'Current password is incorrect' }).pipe(delay(500));
    }
  }

  updateNotificationSettings(settings: Partial<User['preferences']>): Observable<User> {
    return this.updatePreferences(settings);
  }

  // Mock method to simulate user activity
  updateLastActivity(): void {
    this.currentUser.updatedAt = new Date();
  }
}
