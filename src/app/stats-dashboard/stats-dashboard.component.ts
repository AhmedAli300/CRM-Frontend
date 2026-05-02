import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { ClientService } from '../services/client.service';

@Component({
  selector: 'app-stats-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent, NgChartsModule],
   templateUrl: './stats-dashboard.component.html',
  styleUrls: ['./stats-dashboard.component.css']
})
export class StatsDashboardComponent implements OnInit {
  totalClients = 0;
  activeClients = 0;
  inactiveClients = 0;
  totalRevenue = 0;
  avgRevenue = 0;

  topClients: any[] = [];
  topFields: { field: string; count: number }[] = [];

  selectedMonth: string | null = null;
  selectedMonthStats: any = null;

  monthNumbers: number[] = [];
  monthlyStats: any[] = [];

  campaigns: any[] = [];
  behaviorStats: any[] = [];
  complaints: any[] = [];


  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    onClick: (event: ChartEvent, elements) => this.onChartClick(event, elements),
    scales: { x: {}, y: { beginAtZero: true, ticks: { stepSize: 1 } } },
    plugins: {
      legend: { position: 'top', labels: { font: { size: 14 } } },
      title: { display: true, text: 'تحليل العملاء الجدد خلال آخر 6 شهور', font: { size: 16 } }
    }
  };

  barChartType: ChartType = 'bar';
  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'عدد العملاء الجدد',
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1
      }
    ]
  };

  detailChartType: ChartType = 'bar';
  detailChartData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };

  constructor(private clientService: ClientService) {}

  ngOnInit() {
    this.loadOverview();
    this.loadFinance();
    this.loadTopClients();
    this.loadTopFields();
    this.loadChart();
    this.loadCampaigns();
    this.loadClientBehavior();
    this.loadComplaints();
  }

  loadOverview() {
    this.clientService.getStats().subscribe(res => {
      this.totalClients = res.total;
      this.activeClients = res.active;
      this.inactiveClients = res.inactive;
    });
  }

  loadFinance() {
    this.clientService.getFinancialStats().subscribe(res => {
      this.totalRevenue = res.totalRevenue;
      this.avgRevenue = res.avgRevenue;
    });
  }

  loadTopClients() {
    this.clientService.getTopClients().subscribe(res => (this.topClients = res));
  }

  loadTopFields() {
    this.clientService.getTopFields().subscribe(res => (this.topFields = res));
  }


  loadChart() {
    this.clientService.getLast6MonthsChart().subscribe(res => {
      this.barChartData = {
        labels: res.labels,
        datasets: [
          {
            data: res.data,
            label: 'عدد العملاء الجدد',
            backgroundColor: Array(res.data.length).fill('rgba(75, 192, 192, 0.6)'),
            borderColor: Array(res.data.length).fill('rgba(75, 192, 192, 1)'),
            borderWidth: 1
          }
        ]
      };

      this.monthNumbers = res.labels.map((_, i) => i + 1);
      this.monthlyStats = res.labels.map((label: string, index: number) => ({
        month: label,
        count: res.data[index]
      }));
    });
  }

 
  onChartClick(event: ChartEvent, elements: any[]) {
    if (elements.length > 0) {
      const index = elements[0].index;
      const monthNumber = this.monthNumbers[index];
      this.selectedMonth = this.barChartData.labels![index] as string;

      this.clientService.getMonthlyStats(monthNumber).subscribe(res => {
        this.selectedMonthStats = res;


        this.detailChartData = {
          labels: ['العملاء الجدد', 'الإيرادات', 'العملاء النشطين', 'العملاء غير النشطين'],
          datasets: [
            {
              data: [res.newClients, res.revenue, res.active, res.inactive],
              label: `تفاصيل شهر ${this.selectedMonth}`,
              backgroundColor: [
                'rgba(54,162,235,0.6)',
                'rgba(75,192,192,0.6)',
                'rgba(153,102,255,0.6)',
                'rgba(255,159,64,0.6)'
              ],
              borderColor: [
                'rgba(54,162,235,1)',
                'rgba(75,192,192,1)',
                'rgba(153,102,255,1)',
                'rgba(255,159,64,1)'
              ],
              borderWidth: 1
            }
          ]
        };
      });
    }
  }

  loadCampaigns() {
    this.clientService.getMarketingCampaignStats().subscribe(res => (this.campaigns = res));
  }

  loadClientBehavior() {
    this.clientService.getClientBehaviorStats().subscribe(res => (this.behaviorStats = res));
  }

  loadComplaints() {
    this.clientService.getClientComplaints().subscribe(res => (this.complaints = res));
  }
}
