import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Firestore, collection, collectionData, doc, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-deportes',
  templateUrl: './deportes.component.html',
  styleUrls: ['./deportes.component.css']
})
export class DeportesComponent implements OnInit {
  displayedColumns: string[] = ['nombre', 'descripcion', 'acciones']; // Cambia a 'descripcion'
  deporteForm: FormGroup;
  sports: any[] = []; // Arreglo que contendrá los deportes
  isEditMode: boolean = false;
  sportIdEditando: string | null = null;

  constructor(private firestore: Firestore, private auth: Auth, private router: Router) {
    // Inicializamos el formulario
    this.deporteForm = new FormGroup({
      'nombre': new FormControl('', Validators.required),
      'descripcion': new FormControl('') // Cambia a 'descripcion'
    });

    // Obtenemos la lista de deportes desde Firestore
    const deportesCollection = collection(this.firestore, 'deportes');
    collectionData(deportesCollection, { idField: 'id' }).subscribe(
      (data) => {
        this.sports = data; // Asignamos los datos a la variable sports
        console.log(this.sports); // Verifica que los datos se carguen correctamente
      },
      (error) => {
        console.error('Error al obtener deportes:', error); // Maneja el error
      }
    );
  }

  ngOnInit(): void { }

  // Guardar (Agregar o Actualizar)
  guardarDeporte(): void {
    const { nombre, descripcion } = this.deporteForm.value; // Cambia a 'descripcion'
    const deportesCollection = collection(this.firestore, 'deportes');

    if (this.isEditMode && this.sportIdEditando) {
      // Actualizar deporte existente
      const sportDoc = doc(this.firestore, `deportes/${this.sportIdEditando}`);
      updateDoc(sportDoc, { nombre, descripcion }).then(() => { // Cambia a 'descripcion'
        this.cancelarEdicion();
      });
    } else {
      // Agregar nuevo deporte
      addDoc(deportesCollection, { nombre, descripcion }).then(() => { // Cambia a 'descripcion'
        this.deporteForm.reset();
      });
    }
  }

  // Editar deporte
  editarDeporte(deporte: any): void {
    this.isEditMode = true;
    this.sportIdEditando = deporte.id;
    this.deporteForm.patchValue({ nombre: deporte.nombre, descripcion: deporte.descripcion }); // Cambia a 'descripcion'
  }

  // Eliminar deporte
  eliminarDeporte(deporteId: string): void {
    const sportDoc = doc(this.firestore, `deportes/${deporteId}`);
    deleteDoc(sportDoc);
  }

  // Cancelar edición
  cancelarEdicion(): void {
    this.isEditMode = false;
    this.sportIdEditando = null;
    this.deporteForm.reset();
  }

}
