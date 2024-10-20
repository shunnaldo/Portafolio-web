import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-sectores-chart',
  templateUrl: './sectores-chart.component.html',
  styleUrls: ['./sectores-chart.component.css']
})
export class SectoresChartComponent implements OnInit {
  public chartOptions: any;

  constructor(private userService: UserService) {
    this.chartOptions = {
      series: [], // Se llenará con los datos de Firebase
      chart: {
        type: 'pie', // Cambiado a "pie" para gráfico de pastel
        height: 350
      },
      labels: [], // Nombres de los sectores
      title: {
        text: 'Sectores Utilizados'
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: any, opts: any) {
          return val.toFixed(2) + "%";
        }
      },
      legend: {
        position: 'bottom'
      }
    };
  }

  ngOnInit(): void {
    this.userService.getSectorUsageCount().subscribe(data => {
      this.chartOptions.series = Object.values(data); // Cantidad de eventos por sector
      this.chartOptions.labels = Object.keys(data); // Nombres de los sectores

      // Forzar la actualización del gráfico
      this.chartOptions = { ...this.chartOptions };
    });
  }
}
