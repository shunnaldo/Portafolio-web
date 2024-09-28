import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, User, onAuthStateChanged, sendPasswordResetEmail, signOut } from '@angular/fire/auth';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  

  userLoggedIn: boolean;

  constructor(private router: Router, private afAuth: AngularFireAuth, private afs: AngularFirestore, private auth: Auth) {
    this.userLoggedIn = false;

    onAuthStateChanged(this.auth, (user) => {
        if (user) {
            this.userLoggedIn = true;
        } else {
            this.userLoggedIn = false;
        }
    });
}

loginUser(email: string, password: string): Promise<any> {
  return signInWithEmailAndPassword(this.auth, email, password)
        .then(() => {
            console.log('Auth Service: loginUser: success');
        })
        .catch((error) => {
          console.log('Auth Service: login error...');
          console.log('error code', error.code);
          console.log('error', error);
          return { isValid: false, message: error.message };
        });
}

signupUser(user: any): Promise<any> {
  return createUserWithEmailAndPassword(this.auth, user.email, user.password) 
    .then((result) => {
      const emailLower = user.email.toLowerCase();

  
      return setDoc(doc(this.afs, 'users', emailLower), {
        accountType: 'endUser',
        displayName: user.displayName,
        displayName_lower: user.displayName.toLowerCase(),
        email: user.email,
        email_lower: emailLower
      }).then(() => {
        return sendEmailVerification(result.user);
      });
    })
    .catch((error) => {
      console.log('Auth Service: signup error', error);
      if (error.code) {
        return { isValid: false, message: error.message };
      }
      return { isValid: false, message: 'Unknown error' };
    });
}

resetPassword(email: string): Promise<any> {
  return sendPasswordResetEmail(this.auth, email)
        .then(() => {
            console.log('Auth Service: reset password success');
        })
        .catch((error) => {
            console.log('Auth Service: reset password error...');
            console.log(error.code);
            console.log(error)
            if (error.code)
                return error;
        });
}

async resendVerificationEmail() {
    const user = this.auth.currentUser;

    if (user) {
      return sendEmailVerification(user)
        .then(() => {
          console.log('Verification email sent successfully');
        })
        .catch((error) => {
            console.log('Auth Service: sendVerificationEmail error...');
            console.log('error code', error.code);
            console.log('error', error);
            if (error.code)
                return error;
        });
    }
}
logoutUser(): Promise<void> {
  return signOut(this.auth)
        .then(() => {
            this.router.navigate(['/home']);
        })
        .catch((error) => {
            console.log('Auth Service: logout error...');
            console.log('error code', error.code);
            console.log('error', error);
            if (error.code)
                return error;
        });
}

setUserInfo(payload: object) {
    console.log('Auth Service: saving user info...');
    this.afs.collection('users')
        .add(payload).then(function (res: any) {
            console.log("Auth Service: setUserInfo response...")
            console.log(res);
        })
}

getCurrentUser() {
  return this.auth.currentUser;
}
}
