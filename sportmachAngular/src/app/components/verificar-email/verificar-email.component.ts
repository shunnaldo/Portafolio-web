import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Auth, authState, User } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-verificar-email',
  templateUrl: './verificar-email.component.html',
  styleUrls: ['./verificar-email.component.css']
})
export class VerificarEmailComponent implements OnInit {

  email: string;
  mailSent: boolean;
  isProgressVisible: boolean;
  firebaseErrorMessage: string;
  user$: Observable<User | null>;  // Observable para rastrear el estado de autenticación del usuario

  constructor(private authService: AuthService, private router: Router, private auth: Auth) {
    this.email = '';
    this.mailSent = false;
    this.isProgressVisible = false;
    this.firebaseErrorMessage = '';

    // Inicializamos el observable authState
    this.user$ = authState(this.auth);
  }

  ngOnInit(): void {
    // Nos suscribimos al estado del usuario para obtener su email si está autenticado
    this.user$.subscribe((user: User | null) => {
      if (user) {
        this.email = user.email || '';
      }
    });
  }

  resendVerificationEmail() {
    this.isProgressVisible = true;

    // Llamamos al servicio para reenviar el correo de verificación
    this.authService.resendVerificationEmail().then((result) => {
      this.isProgressVisible = false;

      if (result == null) {
        console.log('Verification email resent...');
        this.mailSent = true;
      } else if (result.isValid === false) {
        console.log('Verification error', result);
        this.firebaseErrorMessage = result.message;
      }
    }).catch((error) => {
      this.isProgressVisible = false;
      console.error('Error resending verification email:', error);
      this.firebaseErrorMessage = 'Error sending verification email. Please try again.';
    });
  }
}
