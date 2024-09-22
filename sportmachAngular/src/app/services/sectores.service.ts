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

  constructor(private firestore: AngularFirestore,
              private storage: AngularFireStorage
  ) { }


  // Agregar Sector
  addSector(sector: sectores): Promise<any> {
    if (sector.image) {
      const filePath = `sectores/${sector.image.name}`;
      const fileRef = this.storage.ref(filePath);


      return this.storage.upload(filePath, sector.image).then(() => {
        return fileRef.getDownloadURL().toPromise().then((url) => {
          const sectorData = {
            idSector: sector.idSector,
            nombre: sector.nombre,
            image: url,
            description: sector.description,
            horario: sector.horario,
            capacidad: sector.capacidad,
          };
          return this.firestore.collection(this.collectionName).add(sectorData);
        });
      });
    } else {

      return this.firestore.collection(this.collectionName).add(sector);
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

  // obtener sectores
  getSectores(): Observable<sectores[]> {
    return this.firestore.collection<sectores>(this.collectionName).valueChanges();
  }

}
