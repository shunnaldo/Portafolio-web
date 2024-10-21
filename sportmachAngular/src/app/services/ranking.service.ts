import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc, updateDoc, deleteDoc, where, query, getDocs, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Ranking {
  id: string;
  userId: string;
  points: number;
  name?: string;
  position?: number;
}

@Injectable({
  providedIn: 'root'
})
export class RankingService {

  constructor(private firestore: Firestore) {}


  async getUserById(userId: string) {
    const usersCollection = collection(this.firestore, 'Users');
    const q = query(usersCollection, where('id', '==', userId.trim())); // Asegúrate de que no haya espacios en blanco

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return userDoc.data(); // Devuelve los datos del usuario
    } else {
      throw new Error('User not found');
    }
  }
  
  // Obtener el ranking completo
  getRankings(): Observable<any[]> {
    const rankingsCollection = collection(this.firestore, 'rankings');
    return collectionData(rankingsCollection, { idField: 'id' }).pipe(
      map(rankings => rankings.sort((a, b) => b['points'] - a['points'])) // Ordenar por puntos descendentes
    );
  }

  // Agregar o actualizar un usuario en el ranking
  async addOrUpdateUserInRanking(userId: string, points: number): Promise<void> {
    try {
      const rankingDocRef = doc(this.firestore, `rankings/${userId.trim()}`); // Asegúrate de que el userId no tenga espacios en blanco
      const rankingSnapshot = await getDoc(rankingDocRef);
      
      if (rankingSnapshot.exists()) {
        // Si el documento ya existe, actualizamos sus puntos y otros datos
        await updateDoc(rankingDocRef, { points, lastUpdate: new Date() });
      } else {
        // Si no existe, obtenemos los datos del usuario desde la colección Users
        const user = await this.getUserById(userId);
        if (user) {
          // Creamos un nuevo documento con el nombre y los puntos del usuario
          await setDoc(rankingDocRef, { userId: userId.trim(), points, name: user['name'], lastUpdate: new Date() });
        }
      }
  
      await this.updatePositions(); // Actualizamos las posiciones después de añadir o actualizar
    } catch (error) {
      console.error("Error al actualizar el ranking:", error);
    }
  }
  
  // Actualizar posiciones en el ranking
  async updatePositions(): Promise<void> {
    const rankingsCollection = collection(this.firestore, 'rankings');
    // Obtener la colección de rankings como un array
    const rankingsSnapshot = await getDocs(rankingsCollection);
  
    if (!rankingsSnapshot.empty) {
      // Convertir los documentos en un array y tiparlos correctamente
      const sortedRankings = rankingsSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Ranking))
        .sort((a, b) => b.points - a.points);
  
      for (let i = 0; i < sortedRankings.length; i++) {
        const rankingDocRef = doc(this.firestore, `rankings/${sortedRankings[i].id}`);
        await updateDoc(rankingDocRef, { position: i + 1 });
      }
    }
  }
  
  

  // Eliminar un usuario del ranking
  async removeUserFromRanking(userId: string): Promise<void> {
    const rankingDocRef = doc(this.firestore, `rankings/${userId}`);
    try {
      await deleteDoc(rankingDocRef);
      await this.updatePositions(); // Actualizamos las posiciones después de eliminar
    } catch (error) {
      console.error("Error al eliminar el usuario del ranking:", error);
    }
  }
}
