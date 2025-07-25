import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private snackBar: MatSnackBar) { }

  showMessage(message: string, duration: number = 3000) {
    this.snackBar.open(message, 'Stäng', {
      duration: duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
