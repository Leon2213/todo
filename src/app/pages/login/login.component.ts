// login.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, MatFormFieldModule],
})
export class LoginComponent {
  email = '';
  password = '';
  shakeAnimation = false;

  constructor(private authservice: AuthService, private router: Router, private notificationService: NotificationService) { }

  onLogin() {
    const success = this.authservice.login(this.email, this.password);
    if (success) {
      this.router.navigate(['/todos']);
    } else {
     this.notificationService.showMessage("Felaktigt användarnamn eller lösenord.");
      this.shakeAnimation = true;

      setTimeout(() => {
        this.shakeAnimation = false;
      }, 500);  
    }
    
  }

  isLoggedIn(): boolean {
    return this.authservice.isAuthenticated();
  }




}
