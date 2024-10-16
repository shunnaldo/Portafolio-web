import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, catchError } from 'rxjs';
import { eventosAlumnos } from '../models/evento-alumno';
import { AngularFireStorage } from '@angular/fire/compat/storage';


@Injectable({
  providedIn: 'root'
})
export class EventosAlumnosService {

  private collectionName = 'eventosAlumnos';

  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) {}


   // Crear un nuevo evento
   createEvento(evento: eventosAlumnos): Promise<void> {
    const id = this.firestore.createId();
    return this.firestore.collection(this.collectionName).doc(id).set({ ...evento, idEventosAdmin: id })
      .catch(error => {
        console.error("Error creando evento: ", error);
        throw error; // Propagar el error si es necesario
      });
  }

  // Obtener todos los eventos
  getEventos(): Observable<eventosAlumnos[]> {
    return this.firestore.collection<eventosAlumnos>(this.collectionName).valueChanges()
      .pipe(
        catchError((error) => {
          console.error('Error obteniendo eventos:', error);
          throw error;
        })
      );
  }


  // Obtener un evento por ID
  getEvento(id: string): Observable<eventosAlumnos | undefined> {
    return this.firestore.collection<eventosAlumnos>(this.collectionName).doc(id).valueChanges()
      .pipe(catchError(error => {
        console.error(`Error obteniendo evento con ID ${id}: `, error);
        throw error; // Propagar el error si es necesario
      }));
  }

  // Actualizar un evento
  updateEvento(id: string, data: Partial<eventosAlumnos>): Promise<void> {
    if (!id) {
      console.error('El ID proporcionado es inválido.');
      return Promise.reject('ID inválido');
    }

    return this.firestore.collection(this.collectionName).doc(id).update(data)
      .catch((error) => {
        console.error(`Error actualizando evento con ID ${id}:`, error);
        throw error;
      });
  }



  // Eliminar un evento
  deleteEvento(id: string): Promise<void> {
    return this.firestore.collection(this.collectionName).doc(id).delete()
      .catch(error => {
        console.error(`Error eliminando evento con ID ${id}: `, error);
        throw error; // Propagar el error si es necesario
      });
  }
}
