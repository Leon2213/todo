import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username = '';
  password = '';
  message = '';
  error = '';

  constructor(private authService: AuthService) { }

  register() {
    this.authService.register(this.username, this.password).subscribe({
      next: () => {
        this.message = '✅ Registrering lyckades!';
        this.error = '';
        this.username = '';
        this.password = '';
      },
      error: (err) => {
        this.error = '❌ Registrering misslyckades: ' + (err.error?.message || err.message || 'Okänt fel');
        this.message = '';
      }
    })
  }
}
