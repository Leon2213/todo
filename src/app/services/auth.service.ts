// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private router: Router, private notificationService: NotificationService) {
    const saved = localStorage.getItem('loggedIn');
  }

  login(email: string, password: string): boolean {
    if (email === "adm" && password === "test") {
      localStorage.setItem('loggedIn', 'true');
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.setItem('loggedIn','false');
    this.router.navigate(['/login']);
    this.notificationService.showMessage("Du loggades ut.");

  }

  isAuthenticated(): boolean {
    if (localStorage.getItem('loggedIn') === 'true') {
      return true;
    } else {
      return false;
    }

  }
}
