import { Component, OnInit } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-ranking-chart',
  templateUrl: './ranking-chart.component.html',
  styleUrls: ['./ranking-chart.component.css']
})
export class RankingChartComponent implements OnInit {
  public chartOptions: any;

  constructor(private firestore: Firestore) {
    this.chartOptions = {
      series: [{
        name: 'Cantidad de Jugadores',
        data: []
      }],
      chart: {
        type: 'bar',
        height: 350
      },
      xaxis: {
        categories: ["Acero", "Bronce", "Plata", "Oro", "Platino", "Cobalto", "Titanio", "Iridio"]
      },
      title: {
        text: 'Jugadores por Rango'
      },
      dataLabels: {
        enabled: true
      },
      tooltip: {
        enabled: true,
        y: {
          formatter: (val: any) => `${val} jugadores`
        }
      }
    };
  }

  ngOnInit(): void {
    this.loadRankingData();
  }

  private loadRankingData(): void {
    const rankingsCollection = collection(this.firestore, 'rankings');
    collectionData(rankingsCollection).pipe(
      map((players: any[]) => this.calculatePlayersPerRank(players))
    ).subscribe(data => {
      this.chartOptions.series = [{
        name: 'Cantidad de Jugadores',
        data: data
      }];

      // Forzar la actualización del gráfico
      this.chartOptions = { ...this.chartOptions };
    });
  }

  private calculatePlayersPerRank(players: any[]): number[] {
    const counts = Array(8).fill(0);

    players.forEach(player => {
      const points = player.points;

      if (points <= 50) {
        counts[0]++; // Acero
      } else if (points <= 100) {
        counts[1]++; // Bronce
      } else if (points <= 150) {
        counts[2]++; // Plata
      } else if (points <= 200) {
        counts[3]++; // Oro
      } else if (points <= 250) {
        counts[4]++; // Platino
      } else if (points <= 300) {
        counts[5]++; // Cobalto
      } else if (points <= 350) {
        counts[6]++; // Titanio
      } else {
        counts[7]++; // Iridio
      }
    });

    return counts;
  }
}
