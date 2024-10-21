import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import ApexCharts from 'apexcharts';

@Component({
  selector: 'app-user-growth-chart',
  templateUrl: './user-growth-chart.component.html',
  styleUrls: ['./user-growth-chart.component.css']
})
export class UserGrowthChartComponent implements OnInit {
  public chartOptions: any;
  private chart: any;

  constructor(private userService: UserService) {
    this.chartOptions = {
      series: [
        {
          name: 'Usuarios Registrados',
          data: [] // Datos de Firebase
        }
      ],
      chart: {
        id: 'area-datetime',
        type: 'area',
        height: 350,
        zoom: {
          autoScaleYaxis: true
        }
      },
      toolbar: {
        tools: {
          zoom: false,    
          zoomin: false,    
          zoomout: false,
          pan: false,      
          reset: false, 
        },
      },
      title: {
        text: 'Total de Usuarios'
      },
      dataLabels: {
        enabled: false
      },
      markers: {
        size: 0,
        style: 'hollow',
      },
      xaxis: {
        type: 'datetime',
        min: undefined,
        max: undefined,
        tickAmount: 6,
      },
      tooltip: {
        x: {
          format: 'dd MMM yyyy'
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 100]
        }
      }
    };
  }

  ngOnInit(): void {
    this.userService.getUserGrowthByMonth().subscribe(data => {
      const seriesData = Object.keys(data).map(date => {
        const [month, year] = date.split('-');
        const formattedDate = new Date(parseInt(year), parseInt(month) - 1).getTime();
        return { date: formattedDate, count: data[date] };
      });

      // Ordenar los datos por fecha
    seriesData.sort((a, b) => a.date - b.date);

    // Calcular la cantidad acumulada de usuarios
    let totalUsers = 0;
    const cumulativeData = seriesData.map(point => {
      totalUsers += point.count;
      return [point.date, totalUsers];
    });

    // Si hay datos en la serie, agregar un punto inicial en 0
    if (cumulativeData.length > 0) {
      const firstDate = cumulativeData[0][0]; // Obtener la fecha de la primera entrada
      const initialDate = new Date(firstDate);
      initialDate.setDate(initialDate.getDay() - 1); // Restar un mes para la fecha inicial

      // Agregar el punto inicial con valor 0
      cumulativeData.unshift([initialDate.getTime(), 0]);
    }

    // Asignar datos y configurar la serie
    this.chartOptions.series[0].data = cumulativeData;
    this.chartOptions.xaxis.min = cumulativeData[0][0]; // Fecha mínima
    this.chartOptions.xaxis.max = cumulativeData[cumulativeData.length - 1][0]; // Fecha máxima

    // Forzar actualización del gráfico para que se reflejen las etiquetas y los datos correctamente
    this.chartOptions = { ...this.chartOptions };

    // Renderizar el gráfico
    this.chart = new ApexCharts(document.querySelector("#chart-timeline"), this.chartOptions);
    this.chart.render();
  });
  }

  // Funciones para mostrar rangos específicos
  showLastWeek() {
    const endDate = new Date().getTime();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    this.chart.zoomX(startDate.getTime(), endDate);
  }

  showLastMonth() {
    const endDate = new Date().getTime();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    this.chart.zoomX(startDate.getTime(), endDate);
  }

  showLastSixMonths() {
    const endDate = new Date().getTime();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);
    this.chart.zoomX(startDate.getTime(), endDate);
  }

  showLastYear() {
    const endDate = new Date().getTime();
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);
    this.chart.zoomX(startDate.getTime(), endDate);
  }

  showAll() {
    this.chart.resetSeries();
  }
}

