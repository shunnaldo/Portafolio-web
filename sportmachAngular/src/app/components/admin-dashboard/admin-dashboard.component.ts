import { Component, OnInit } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  user: Observable<any> | null = null;

  constructor(private auth: Auth, private firestore: Firestore) {}

  ngOnInit(): void {
    // Observamos el estado de autenticación
    authState(this.auth).subscribe((user) => {
      if (user) {
        const emailLower = user.email!.toLowerCase();
        const userDocRef = doc(this.firestore, `users/${emailLower}`);
        this.user = docData(userDocRef);
      }
    });
  }
}
