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

  getSports(): Observable<any[]> {
    const sportsCollection = collection(this.firestore, 'deportes');
    return collectionData(sportsCollection, { idField: 'id' });
  }

  getFavoriteSportsCount(): Observable<{ [key: string]: number }> {
    return combineLatest([this.getUsers(), this.getSports()]).pipe(
      map(([users, sports]) => {
        const sportsCount: { [key: string]: number } = {};

        // Crear un mapa de deportes para acceder a los nombres por id
        const sportsMap = new Map(sports.map(sport => [sport.nombre, sport.nombre]));

        users.forEach(user => {
          const favoriteSport = user.deporteFavorito;
          const sportName = sportsMap.get(favoriteSport);

          if (sportName) {
            sportsCount[sportName] = (sportsCount[sportName] || 0) + 1;
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

  getUserGrowthByDay(): Observable<{ [key: string]: number }> {
    return this.getUsers().pipe(
      map(users => {
        const userGrowth: { [key: string]: number } = {};
  
        users.forEach(user => {
          // Verificar si el campo 'data' existe y es un Timestamp de Firebase
          if (user.data && typeof user.data.toDate === 'function') {
            const date = user.data.toDate(); // Convertimos el Timestamp a un objeto Date
            const day = date.getDate().toString().padStart(2, '0'); // Formato "dd"
            const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Formato "MM"
            const year = date.getFullYear().toString(); // Formato "YYYY"
            const dayMonthYear = `${day}-${month}-${year}`; // Formato "dd-MM-YYYY"
  
            userGrowth[dayMonthYear] = (userGrowth[dayMonthYear] || 0) + 1;
          } else {
            console.warn('Usuario sin fecha de registro válida:', user);
          }
        });
  
        return userGrowth;
      })
    );
  }
  
  getClubs(): Observable<any[]> {
    const clubsCollection = collection(this.firestore, 'clubs');
    return collectionData(clubsCollection, { idField: 'id' });
  }

  getUsersInClubsCount(): Observable<{ inClub: number, noClub: number }> {
    return combineLatest([this.getUsers(), this.getClubs()]).pipe(
      map(([users, clubs]) => {
        const userIdsInClubs = new Set<string>();
        clubs.forEach(club => {
          if (club.miembroIds && Array.isArray(club.miembroIds)) {
            club.miembroIds.forEach((id: string) => userIdsInClubs.add(id));
          }
        });

        const usersInClub = users.filter(user => userIdsInClubs.has(user.id)).length;
        const usersNoClub = users.length - usersInClub;

        return { inClub: usersInClub, noClub: usersNoClub };
      })
    );
  }

}
