import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, User, onAuthStateChanged, sendPasswordResetEmail, signOut } from '@angular/fire/auth';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Router } from '@angular/router';
import { Firestore, collection, doc, setDoc, addDoc, collectionData  } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userLoggedIn: boolean;

  constructor(private router: Router, private afAuth: AngularFireAuth, private afs: Firestore, private auth: Auth) {
    this.userLoggedIn = false;

    onAuthStateChanged(this.auth, (user) => {
        if (user) {
            this.userLoggedIn = true;
        } else {
            this.userLoggedIn = false;
        }
    });
}

getUsers(): Observable<any[]> {
  const usersCollection = collection(this.afs, 'Users'); // Cambia 'Users' por el nombre correcto de tu colección si es diferente
  return collectionData(usersCollection, { idField: 'id' });
}

getFavoriteSportsCount(): Observable<{ [key: string]: number }> {
  return this.getUsers().pipe(
    map(users => {
      const sportsCount: { [key: string]: number } = {};
      users.forEach(user => {
        const sport = user.deporteFavorito;
        if (sport) {
          sportsCount[sport] = (sportsCount[sport] || 0) + 1;
        }
      });
      return sportsCount;
    })
  );
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
      
      // Usamos addDoc para dejar que Firestore genere automáticamente el ID del documento
      const usersCollection = collection(this.afs, 'AdminUsers');
      return addDoc(usersCollection, {
        accountType: 'Admin',
        displayName: user.displayName,
        email: user.email
      }).then(() => {
        return sendEmailVerification(result.user);  // Enviamos verificación de email
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

setUserInfo(payload: object): void {
  console.log('Auth Service: saving user info...');
  
  const usersCollectionRef = collection(this.afs, 'users');  // Referencia a la colección 'users'
  
  addDoc(usersCollectionRef, payload).then((res: any) => {
    console.log("Auth Service: setUserInfo response...");
    console.log(res);
  }).catch((error: any) => {
    console.error("Error saving user info:", error);
  });
}

getCurrentUser() {
  return this.auth.currentUser;
}
}
