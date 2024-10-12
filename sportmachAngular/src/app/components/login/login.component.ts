import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isProgressVisible: boolean;
  loginForm: FormGroup;
  firebaseErrorMessage: string;

  constructor(private authService: AuthService, private router: Router, private auth: Auth) { 
    this.isProgressVisible = false;

    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });

    this.firebaseErrorMessage = '';
  }

  ngOnInit(): void {
    if (this.authService.userLoggedIn) {
      this.router.navigate(['/dashboard']);
    }
  }

  loginUser() {
    this.isProgressVisible = true;

    if (this.loginForm.invalid) {
      this.isProgressVisible = false;
      return;
    }

    this.authService.loginUser(this.loginForm.value.email, this.loginForm.value.password)
      .then((result : any) => {
        this.isProgressVisible = false;
        if (result == null) {
          this.router.navigate(['/home']);
        } else if (result.isValid === false) {
          this.firebaseErrorMessage = result.message;
        }
      })
      .catch((error: any) => {
        this.isProgressVisible = false;
        this.firebaseErrorMessage = 'Error inesperado durante el inicio de sesión. Por favor, inténtalo de nuevo.';
      });
  }
}
