import { Component, OnInit } from '@angular/core';
import { RankingService } from '../../services/ranking.service';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-ranking-management',
  templateUrl: './ranking-management.component.html',
  styleUrls: ['./ranking-management.component.css']
})
export class RankingManagementComponent implements OnInit {
  rankings: any[] = [];
  userId: string = '';
  points: number = 0;

  constructor(private rankingService: RankingService, private firestore: Firestore) {}

  ngOnInit(): void {
    this.loadRankings();
  }

  loadRankings(): void {
    this.rankingService.getRankings().subscribe((data) => {
      this.rankings = data;
    });
  }

  async addOrUpdateUser(userId: string, points: number) {
    console.log('ID proporcionada:', userId);
    try {
      const user = await this.rankingService.getUserById(userId);
      if (user) {
        await this.rankingService.addOrUpdateUserInRanking(userId, points);
        console.log('Usuario actualizado en el ranking:', user);
      }
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
    }
  }

  // Este es el método que debe estar accesible desde el template
  removeUser(userId: string): void {
    this.rankingService.removeUserFromRanking(userId).then(() => {
      console.log('Usuario eliminado del ranking:', userId);
      this.loadRankings(); // Volver a cargar el ranking para reflejar la eliminación
    }).catch(error => {
      console.error('Error al eliminar el usuario:', error);
    });
  }
}
