import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-club-members-chart',
  templateUrl: './club-members-chart.component.html',
  styleUrls: ['./club-members-chart.component.css']
})
export class ClubMembersChartComponent implements OnInit {
  public chartOptions: any;

  constructor(private userService: UserService) {
    this.chartOptions = {
      series: [],
      chart: {
        type: 'pie',
        height: 350
      },
      labels: ['Con Club', 'Sin Club'],
      title: {
        text: 'Usuarios en Clubes'
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
    this.userService.getUsersInClubsCount().subscribe(data => {
      this.chartOptions.series = [data.inClub, data.noClub];
      this.chartOptions = { ...this.chartOptions }; // Forzar actualización del gráfico
    });
  }
}
