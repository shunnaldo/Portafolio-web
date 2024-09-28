import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Auth, authState, User } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-recuperar-contrasena',
  templateUrl: './recuperar-contrasena.component.html',
  styleUrls: ['./recuperar-contrasena.component.css']
})
export class RecuperarContrasenaComponent implements OnInit {

  mailSent: boolean;
  isProgressVisible: boolean;
  forgotPasswordForm: FormGroup;
  firebaseErrorMessage: string;
  user$: Observable<User | null>;  // Declaramos la propiedad user$ como un Observable

  constructor(private authService: AuthService, private router: Router, private auth: Auth) {
    this.mailSent = false;
    this.isProgressVisible = false;

    this.forgotPasswordForm = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.email])
    });

    this.firebaseErrorMessage = '';

    // Inicializamos user$ con el observable authState
    this.user$ = authState(this.auth);
  }

  ngOnInit(): void {
    // Nos suscribimos al observable user$ para rastrear el estado del usuario
    this.user$.subscribe((user: User | null) => {
      if (user) {
        this.forgotPasswordForm.patchValue({
          email: user.email  // Si el usuario está autenticado, llenamos el campo email del formulario
        });
      }
    });
  }

  retrievePassword() {
    this.isProgressVisible = true;  // Mostramos el indicador de progreso al iniciar el proceso de restablecimiento de contraseña

    if (this.forgotPasswordForm.invalid) {
      this.isProgressVisible = false;
      return;
    }

    this.authService.resetPassword(this.forgotPasswordForm.value.email).then((result) => {
      this.isProgressVisible = false;  // Ocultamos el indicador de progreso una vez que el servicio de autenticación retorna

      if (result == null) {  // Si el resultado es nulo, el correo de restablecimiento de contraseña fue enviado exitosamente
        console.log('password reset email sent...');
        this.mailSent = true;
      } else if (result.isValid == false) {
        console.log('login error', result);
        this.firebaseErrorMessage = result.message;
      }
    });
  }

}
