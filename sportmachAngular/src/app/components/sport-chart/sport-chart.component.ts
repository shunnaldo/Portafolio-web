import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartData } from 'chart.js';
import { AuthService  } from '../../services/auth.service';

@Component({
  selector: 'app-sport-chart',
  templateUrl: './sport-chart.component.html',
  styleUrls: ['./sport-chart.component.css']
})
export class SportChartComponent implements OnInit {

  public chartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Usuarios por Deporte Favorito' }
    ]
  };
  public chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };
  public chartType: ChartType = 'bar';

  constructor(private userService: AuthService) {}

  ngOnInit(): void {
    this.userService.getFavoriteSportsCount().subscribe(data => {
      this.chartData.labels = Object.keys(data);
      this.chartData.datasets[0].data = Object.values(data);
    });
  }
}