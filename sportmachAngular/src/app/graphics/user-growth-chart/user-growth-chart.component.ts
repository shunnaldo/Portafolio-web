import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-growth-chart',
  templateUrl: './user-growth-chart.component.html',
  styleUrls: ['./user-growth-chart.component.css']
})
export class UserGrowthChartComponent implements OnInit {
  public chartOptions: any;

  constructor(private userService: UserService) {
    this.chartOptions = {
      series: [
        {
          name: 'Usuarios Registrados',
          data: [] // Se llenará con los datos de Firebase
        }
      ],
      chart: {
        type: 'line', // Gráfico de líneas para visualizar el crecimiento
        height: 350
      },
      xaxis: {
        categories: [] // Se llenará con las etiquetas de los meses y años
      },
      title: {
        text: 'Crecimiento de Usuarios por Mes'
      },
      yaxis: {
        title: {
          text: 'Número de Usuarios'
        }
      },
      stroke: {
        curve: 'smooth' // Suaviza las líneas
      }
    };
  }

  ngOnInit(): void {
    this.userService.getUserGrowthByMonth().subscribe(data => {
      this.chartOptions.series[0].data = Object.values(data); // Cantidad de usuarios por mes
      this.chartOptions.xaxis.categories = Object.keys(data); // Meses y años

      // Forzar la actualización del gráfico
      this.chartOptions = { ...this.chartOptions };
    });
  }
}
