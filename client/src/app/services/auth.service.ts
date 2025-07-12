// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private router: Router,
    private notificationService: NotificationService,
    private http: HttpClient) {
    const saved = localStorage.getItem('loggedIn');
  }

  loginOld(email: string, password: string): boolean {
    if (email === "adm" && password === "test") {
      localStorage.setItem('loggedIn', 'true');
      return true;
    }
    return false;
  }

  async login(username: string, password: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.post<{ token: string }>('http://localhost:8080/api/auth/login', {
          username,
          password
        })
      );

      if (response && response.token) {
        localStorage.setItem('jwt', response.token);
        localStorage.setItem('loggedIn', 'true');
        return true;
      } else {
        console.error('Inloggningen lyckades men ingen token returnerades.');
        return false;
      }
    } catch (error) {
      console.error('Inloggningsfel:', error);
      return false;
    }
  }



  register(username: string, password: string) {
  return this.http.post('http://localhost:8080/api/auth/register',
    { username, password },
    { responseType: 'text' }  // <== Lägg till detta
  );
}





  logout(): void {
    localStorage.setItem('loggedIn', 'false');
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
