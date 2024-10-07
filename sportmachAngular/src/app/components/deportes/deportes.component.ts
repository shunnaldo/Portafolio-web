import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Firestore, collection, collectionData, doc, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-deportes',
  templateUrl: './deportes.component.html',
  styleUrls: ['./deportes.component.css']
})
export class DeportesComponent implements OnInit {

  displayedColumns: string[] = ['nombre', 'description', 'acciones'];
  deporteForm: FormGroup;
  sports: any[] = [];  // Arreglo que contendrá los deportes
  isEditMode: boolean = false;
  sportIdEditando: string | null = null;

  constructor(private firestore: Firestore, private auth: Auth, private router: Router) {
    // Inicializamos el formulario
    this.deporteForm = new FormGroup({
      'nombre': new FormControl('', Validators.required),
      'description': new FormControl('')  // Campo opcional
    });

    // Obtenemos la lista de deportes desde Firestore
    const sportsCollection = collection(this.firestore, 'sports');
    collectionData(sportsCollection, { idField: 'id' }).subscribe((data) => {
      this.sports = data;  // Asignamos los datos a la variable sports
    });
  }

  ngOnInit(): void { }

  // Guardar (Agregar o Actualizar)
  guardarDeporte(): void {
    const { nombre, description } = this.deporteForm.value;
    const sportsCollection = collection(this.firestore, 'sports');
  
    if (this.isEditMode && this.sportIdEditando) {
      // Actualizar deporte existente
      const sportDoc = doc(this.firestore, `sports/${this.sportIdEditando}`);
      updateDoc(sportDoc, { name, description }).then(() => {
        this.cancelarEdicion();
      });
    } else {
      // Agregar nuevo deporte
      addDoc(sportsCollection, { name, description }).then(() => {
        this.deporteForm.reset();
      });
    }
  }
  

  // Editar deporte
  editarDeporte(deporte: any): void {
    this.isEditMode = true;
    this.sportIdEditando = deporte.id;
    this.deporteForm.patchValue({ nombre: deporte.nombre });
  }

  // Eliminar deporte
  eliminarDeporte(deporteId: string): void {
    const sportDoc = doc(this.firestore, `sports/${deporteId}`);
    deleteDoc(sportDoc);
  }

  // Cancelar edición
  cancelarEdicion(): void {
    this.isEditMode = false;
    this.sportIdEditando = null;
    this.deporteForm.reset();
  }

  logout(): void {
    this.auth.signOut().then(() => {
      this.router.navigate(['/login']);  // Redirigir al login después de cerrar sesión
    }).catch((error) => {
      console.error('Error al cerrar sesión', error);
    });
  }
}