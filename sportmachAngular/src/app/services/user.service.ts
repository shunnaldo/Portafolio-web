import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: Firestore) {}

  getUsers(): Observable<any[]> {
    const usersCollection = collection(this.firestore, 'Users');
    return collectionData(usersCollection, { idField: 'id' });
  }

  getFavoriteSportsCount(): Observable<{ [key: string]: number }> {
    return this.getUsers().pipe(
      map(users => {
        const sportsCount: { [key: string]: number } = {};
        users.forEach(user => {
          const sport = user.deporteFavorito;
          // Filtramos para asegurarnos de que 'sport' sea una cadena válida
          if (sport && typeof sport === 'string') {
            sportsCount[sport] = (sportsCount[sport] || 0) + 1;
          }
        });
        return sportsCount;
      })
    );
  }

  getEvents(): Observable<any[]> {
    const eventsCollection = collection(this.firestore, 'eventosAlumnos');
    return collectionData(eventsCollection, { idField: 'id' });
  }

  getSectors(): Observable<any[]> {
    const sectorsCollection = collection(this.firestore, 'sectores');
    return collectionData(sectorsCollection, { idField: 'id' });
  }

  getSectorUsageCount(): Observable<{ [key: string]: number }> {
    return combineLatest([this.getEvents(), this.getSectors()]).pipe(
      map(([events, sectors]) => {
        const sectorCount: { [key: string]: number } = {};

        // Creamos un mapa de sectores para acceder fácilmente por id
        const sectorMap = new Map(sectors.map(sector => [sector.id, sector.nombre]));

        events.forEach(event => {
          const sectorName = sectorMap.get(event.idSector);
          if (sectorName) {
            sectorCount[sectorName] = (sectorCount[sectorName] || 0) + 1;
          }
        });

        return sectorCount;
      })
    );
  }

  getUserGrowthByMonth(): Observable<{ [key: string]: number }> {
    return this.getUsers().pipe(
      map(users => {
        const userGrowth: { [key: string]: number } = {};

        users.forEach(user => {
          // Verificar si el campo 'data' existe y es un Timestamp de Firebase
          if (user.data && typeof user.data.toDate === 'function') {
            const date = user.data.toDate(); // Convertimos el Timestamp a un objeto Date
            const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`; // Formato "MM-YYYY"

            userGrowth[monthYear] = (userGrowth[monthYear] || 0) + 1;
          } else {
            console.warn('Usuario sin fecha de registro válida:', user);
          }
        });

        return userGrowth;
      })
    );
  }
  
}
