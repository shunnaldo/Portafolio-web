import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { sectores } from '../models/sectores.models';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class SectoresService {

  private collectionName = 'sectores';

  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) { }

  // Agregar Sector con generación de ID
  addSector(sector: sectores): Promise<any> {
    const id = this.firestore.createId(); // Generar una ID única
    sector.idSector = id; // Asignar la ID al sector

    if (sector.image) {
      const filePath = `sectores/${sector.image.name}`;
      const fileRef = this.storage.ref(filePath);

      return this.storage.upload(filePath, sector.image).then(() => {
        return fileRef.getDownloadURL().toPromise().then((url) => {
          const sectorData = {
            idSector: sector.idSector,
            nombre: sector.nombre,
            image: url, // Asignar la URL de la imagen
            description: sector.description,
            horarios: sector.horarios, // Aquí cambiamos a 'horarios', ya que es un array
            capacidad: sector.capacidad,
          };
          return this.firestore.collection(this.collectionName).doc(id).set(sectorData); // Guardar el sector con la ID generada
        });
      });
    } else {
      // Si no hay imagen, guardar el sector directamente
      return this.firestore.collection(this.collectionName).doc(id).set({
        ...sector,
        horarios: sector.horarios // Asegurarse de que 'horarios' esté presente en el set
      });
    }
  }

  // Eliminar Sector
  deleteSector(idSector: string): Promise<void> {
    return this.firestore.collection(this.collectionName).doc(idSector).delete();
  }

  // Actualizar Sector
  updateSector(idSector: string, sector: sectores): Promise<void> {
    return this.firestore.collection(this.collectionName).doc(idSector).update(sector);
  }

  // Obtener Sectores
  getSectores(): Observable<sectores[]> {
    return this.firestore.collection<sectores>(this.collectionName).valueChanges();
  }
}
