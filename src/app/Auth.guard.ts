import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { NotificationService } from './services/notification.service';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService)

  if (authService.isAuthenticated()) {
    notificationService.showMessage('Du loggades in');
    return true;
  } else {
    notificationService.showMessage('Du måste logga in för att se dina todos');
    return router.parseUrl('/login');
  }
};
