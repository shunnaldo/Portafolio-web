import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-deportes-chart',
  templateUrl: './deportes-chart.component.html',
  styleUrls: ['./deportes-chart.component.css']
})
export class DeportesChartComponent implements OnInit {
  public chartOptions: any;

  constructor(private userService: UserService) {
    this.chartOptions = {
      series: [],
      chart: {
        type: 'pie', // Gráfico de pastel
        height: 350
      },
      labels: [], // Aquí se establecerán los nombres de los deportes
      title: {
        text: 'Deportes Favoritos'
      },
      dataLabels: {
        enabled: true,
        formatter: (val: any, opts: any) => {
          // Usar las etiquetas configuradas en el gráfico
          return val.toFixed(2) + "%";
        }
      },
      legend: {
        position: 'bottom',
        formatter: (seriesName: any, opts: any) => {
          return this.chartOptions.labels[opts.seriesIndex]; // Muestra el nombre del deporte en la leyenda
        }
      },
      tooltip: {
        enabled: false
      }
    };
  }

  ngOnInit(): void {
    this.userService.getFavoriteSportsCount().subscribe(data => {
      this.chartOptions.series = Object.values(data); // Cantidad de eventos por sector
      this.chartOptions.labels = Object.keys(data); // Nombres de los sectores

      // Forzar la actualización del gráfico
      this.chartOptions = { ...this.chartOptions };
    });
  }
}
