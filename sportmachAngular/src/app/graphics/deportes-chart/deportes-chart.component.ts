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
        type: 'pie',
        height: 350
      },
      labels: [],
      title: {
        text: 'Deportes Favoritos'
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: any, opts: any) {
          // Muestra el nombre del deporte y su porcentaje en el gráfico
          return val.toFixed(2) + "%";
        }
      },
      legend: {
        position: 'bottom',
        formatter: (seriesName: any, opts: any) => {
          return this.chartOptions.labels[opts.seriesIndex]; // Muestra el nombre del deporte en la leyenda
        }
      }
      
    };
  }

  ngOnInit(): void {
    this.userService.getFavoriteSportsCount().subscribe(data => {
      console.log('Datos filtrados:', data); // Verifica los datos en la consola
      this.chartOptions.series = Object.values(data); // Los valores son los conteos de cada deporte
      this.chartOptions.labels = Object.keys(data); // Las etiquetas son los nombres de los deportes

      // Forzar la actualización de las opciones para asegurarse de que el gráfico se redibuje
      this.chartOptions = { ...this.chartOptions };
    });
  }
}
