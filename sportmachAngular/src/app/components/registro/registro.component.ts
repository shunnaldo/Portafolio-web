import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Auth } from '@angular/fire/auth';

@Component({
    selector: 'app-Registro',
    templateUrl: './Registro.component.html',
    styleUrls: ['./Registro.component.css']
})
export class RegistroComponent implements OnInit {

  isProgressVisible: boolean;
  signupForm!: FormGroup;  // Usamos el operador '!' para decirle a TypeScript que será inicializado posteriormente
  firebaseErrorMessage: string;

  constructor(private authService: AuthService, private router: Router, private afAuth: Auth) {
      this.isProgressVisible = false;
      this.firebaseErrorMessage = '';
  }

  ngOnInit(): void {
      if (this.authService.userLoggedIn) {
          this.router.navigate(['/dashboard']);
      }

      // Inicializamos signupForm en ngOnInit
      this.signupForm = new FormGroup({
          'displayName': new FormControl('', Validators.required),
          'email': new FormControl('', [Validators.required, Validators.email]),
          'password': new FormControl('', Validators.required)
      });
  }

  signup() {
      if (this.signupForm.invalid) {
          return;
      }

      this.isProgressVisible = true;
      this.authService.signupUser(this.signupForm.value).then((result) => {
          if (result == null) {
              this.router.navigate(['/dashboard']);
          } else if (result.isValid === false) {
              this.firebaseErrorMessage = result.message;
          }
          this.isProgressVisible = false;
      }).catch(() => {
          this.isProgressVisible = false;
      });
  }
}
