import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  todayOrders: number;
  weekOrders: number;
  monthOrders: number;
}

interface RecentOrder {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  date: string;
}

interface TopProduct {
  id: string;
  name: string;
  sales: number;
  image?: string;
  revenue: number;
}

interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {

  stats: DashboardStats = {
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    todayOrders: 0,
    weekOrders: 0,
    monthOrders: 0,
  };


  recentOrders: RecentOrder[] = [];
  topProducts: TopProduct[] = [];
  revenueData: RevenueData[] = [];
  isLoading = true;
  errorMessage = '';
  
  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;
  chart: any = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }
  
  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngAfterViewInit(): void {
    // Chart will be initialized after data is loaded
  }

  loadDashboardData() {
    setTimeout(() => {
      this.stats = {
        totalUsers: 1248,
        totalProducts: 345,
        totalOrders: 1567,
        totalRevenue: 1234567890,
        todayOrders: 123,
        weekOrders: 678,
        monthOrders: 345,
      }

      this.recentOrders = [
        { id: '#ORD-001', customer: 'Nguyen Van A', product: 'Iphone 15 Pro Max', amount: 15000000, status: 'completed', date: '2025-01-01' },
        { id: '#ORD-002', customer: 'Nguyen Van B', product: 'Samsung Galaxy S23 Ultra', amount: 12000000, status: 'processing', date: '2025-01-02' },
        { id: '#ORD-003', customer: 'Nguyen Van C', product: 'Xiaomi 13 Pro', amount: 10000000, status: 'pending', date: '2025-01-03' },
        { id: '#ORD-004', customer: 'Nguyen Van D', product: 'Oppo Find X6 Pro', amount: 13000000, status: 'cancelled', date: '2025-01-04' },
        { id: '#ORD-005', customer: 'Nguyen Van E', product: 'Realme 11 Pro+', amount: 11000000, status: 'completed', date: '2025-01-05' },
        { id: '#ORD-006', customer: 'Nguyen Van F', product: 'Vivo X90 Pro+', amount: 14000000, status: 'processing', date: '2025-01-06' },
        { id: '#ORD-007', customer: 'Nguyen Van G', product: 'OnePlus 12', amount: 16000000, status: 'pending', date: '2025-01-07' },
        { id: '#ORD-008', customer: 'Nguyen Van H', product: 'Google Pixel 8 Pro', amount: 17000000, status: 'cancelled', date: '2025-01-08' },
        { id: '#ORD-009', customer: 'Nguyen Van I', product: 'Nokia 1100', amount: 18000000, status: 'completed', date: '2025-01-09' },
        { id: '#ORD-010', customer: 'Nguyen Van J', product: 'Lenovo ThinkPad X1 Carbon', amount: 19000000, status: 'processing', date: '2025-01-10' },
      ];

      this.topProducts = [
        { id: '1', name: 'Iphone 15 Pro Max', sales: 120, revenue: 15000000, image: 'https://via.placeholder.com/150' },
        { id: '2', name: 'Samsung Galaxy S24 Ultra', sales: 100, revenue: 12000000, image: 'https://via.placeholder.com/150' },
        { id: '3', name: 'Xiaomi 13 Pro', sales: 80, revenue: 10000000, image: 'https://via.placeholder.com/150' },
        { id: '4', name: 'Oppo Find X6 Pro', sales: 70, revenue: 13000000, image: 'https://via.placeholder.com/150' },
        { id: '5', name: 'Realme 11 Pro+', sales: 60, revenue: 11000000, image: 'https://via.placeholder.com/150' },
      ]

      this.revenueData = [
        { date: 'Jan', revenue: 45000000, orders: 120 },
        { date: 'Feb', revenue: 52000000, orders: 100 },
        { date: 'Mar', revenue: 48000000, orders: 80 },
        { date: 'Apr', revenue: 61000000, orders: 70 },
        { date: 'May', revenue: 58000000, orders: 60 },
        { date: 'Jun', revenue: 67000000, orders: 50 },
        { date: 'Jul', revenue: 72000000, orders: 65 },
        { date: 'Aug', revenue: 68000000, orders: 55 },
        { date: 'Sep', revenue: 75000000, orders: 70 },
        { date: 'Oct', revenue: 81000000, orders: 75 },
        { date: 'Nov', revenue: 79000000, orders: 72 },
        { date: 'Dec', revenue: 88000000, orders: 80 },
      ]

      this.isLoading = false;
      // Initialize chart after data is loaded
      setTimeout(() => this.initChart(), 100);
    }, 1000);
  }

  getStatusClass(status: string): string {
    const classes = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'processing': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
    }
    return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  }

  getStatusText(status: string): string {
    const text = {
      'pending': 'Chờ xử lý',
      'processing': 'Đang xử lý',
      'completed': 'Đã hoàn thành',
      'cancelled': 'Đã hủy',
    }
    return text[status as keyof typeof text] || status;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }


  async initChart() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (this.chartContainer && this.revenueData.length > 0) {
      // Dynamically import ApexCharts only in browser
      const ApexCharts = (await import('apexcharts')).default;
      
      const options = {
        series: [{
          name: 'Doanh thu',
          data: this.revenueData.map(d => d.revenue)
        }],
        chart: {
          height: 350,
          type: 'area',
          toolbar: {
            show: false
          },
          zoom: {
            enabled: false
          }
        },
        stroke: {
          curve: 'smooth',
          width: 3
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.4,
            opacityTo: 0.1,
            stops: [0, 90, 100],
            colorStops: [
              {
                offset: 0,
                color: '#3b82f6',
                opacity: 0.4
              },
              {
                offset: 90,
                color: '#3b82f6',
                opacity: 0.2
              },
              {
                offset: 100,
                color: '#3b82f6',
                opacity: 0
              }
            ]
          }
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          categories: this.revenueData.map(d => d.date)
        },
        yaxis: {
          labels: {
            formatter: (val: number) => {
              return (val / 1000000).toFixed(0) + 'M₫';
            }
          }
        },
        tooltip: {
          y: {
            formatter: (val: number) => {
              return new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(val);
            }
          }
        },
        colors: ['#3b82f6']
      };

      const chartOptions: any = options;
      this.chart = new ApexCharts(this.chartContainer.nativeElement, chartOptions);
      this.chart.render();
    }
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
