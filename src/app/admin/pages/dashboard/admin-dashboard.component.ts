import { Component, OnInit, computed, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface DashboardStat {
  label: string;
  value: string | number;
  trend: number;
  iconPath: string;
  colorClass: string;
}

interface RecentOrder {
  id: number;
  customerName: string;
  amount: number;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  date: string;
}

interface TopProduct {
  name: string;
  category: string;
  sales: number;
  revenue: number;
  image: string;
}

interface Activity {
  text: string;
  time: string;
  type: 'order' | 'product' | 'user';
  iconPath: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('salesChart') salesChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('ordersChart') ordersChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('revenueChart') revenueChartRef!: ElementRef<HTMLCanvasElement>;

  private salesChart?: Chart;
  private ordersChart?: Chart;
  private revenueChart?: Chart;

  currentUser = computed(() => this.authService.getCurrentUser());  // Dashboard Statistics
  stats: DashboardStat[] = [
    {
      label: 'Ventas Totales',
      value: '$45,231',
      trend: 12.5,
      iconPath: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      colorClass: 'blue'
    },
    {
      label: 'Pedidos',
      value: 156,
      trend: 8.3,
      iconPath: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
      colorClass: 'purple'
    },
    {
      label: 'Clientes',
      value: 1243,
      trend: 15.2,
      iconPath: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
      colorClass: 'green'
    },
    {
      label: 'Productos',
      value: 89,
      trend: -2.4,
      iconPath: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
      colorClass: 'orange'
    }
  ];

  // Recent Orders
  recentOrders: RecentOrder[] = [
    {
      id: 1234,
      customerName: 'María González',
      amount: 1250,
      status: 'delivered',
      date: '2025-11-16'
    },
    {
      id: 1233,
      customerName: 'Carlos Rodríguez',
      amount: 890,
      status: 'processing',
      date: '2025-11-16'
    },
    {
      id: 1232,
      customerName: 'Ana Martínez',
      amount: 2100,
      status: 'pending',
      date: '2025-11-15'
    },
    {
      id: 1231,
      customerName: 'Luis Fernández',
      amount: 650,
      status: 'delivered',
      date: '2025-11-15'
    },
    {
      id: 1230,
      customerName: 'Sofia López',
      amount: 1800,
      status: 'cancelled',
      date: '2025-11-14'
    }
  ];

  // Top Products
  topProducts: TopProduct[] = [
    {
      name: 'Camisa Casual Bosko',
      category: 'Camisas',
      sales: 124,
      revenue: 6200,
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=100&h=100&fit=crop'
    },
    {
      name: 'Pantalón Slim Fit',
      category: 'Pantalones',
      sales: 98,
      revenue: 5880,
      image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=100&h=100&fit=crop'
    },
    {
      name: 'Chaqueta de Cuero',
      category: 'Chaquetas',
      sales: 67,
      revenue: 8040,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100&h=100&fit=crop'
    },
    {
      name: 'Zapatillas Deportivas',
      category: 'Calzado',
      sales: 156,
      revenue: 9360,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop'
    },
    {
      name: 'Polo Premium',
      category: 'Polos',
      sales: 89,
      revenue: 3560,
      image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=100&h=100&fit=crop'
    }
  ];

  // Recent Activity
  recentActivity: Activity[] = [
    {
      text: 'Nuevo pedido #1234 creado por María González',
      time: 'Hace 5 minutos',
      type: 'order',
      iconPath: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
    },
    {
      text: 'Producto "Camisa Casual" actualizado',
      time: 'Hace 15 minutos',
      type: 'product',
      iconPath: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
    },
    {
      text: 'Nuevo cliente registrado: Carlos Rodríguez',
      time: 'Hace 32 minutos',
      type: 'user',
      iconPath: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
    },
    {
      text: 'Pedido #1230 marcado como entregado',
      time: 'Hace 1 hora',
      type: 'order',
      iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    {
      text: 'Nuevo producto añadido: "Chaqueta de Invierno"',
      time: 'Hace 2 horas',
      type: 'product',
      iconPath: 'M12 6v6m0 0v6m0-6h6m-6 0H6'
    }
  ];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Data will be loaded from backend when service is integrated
  }

  ngAfterViewInit(): void {
    this.initSalesChart();
    this.initOrdersChart();
    this.initRevenueChart();
  }

  private initSalesChart(): void {
    const ctx = this.salesChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    this.salesChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
        datasets: [
          {
            label: 'Ventas 2025',
            data: [12000, 15000, 18000, 22000, 25000, 28000],
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 2,
            borderRadius: 8,
          },
          {
            label: 'Ventas 2024',
            data: [10000, 13000, 16000, 19000, 21000, 23000],
            backgroundColor: 'rgba(139, 92, 246, 0.6)',
            borderColor: 'rgba(139, 92, 246, 1)',
            borderWidth: 2,
            borderRadius: 8,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: '#cbd5e1',
              font: {
                size: 12,
                family: 'Inter, system-ui, sans-serif'
              },
              padding: 15,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            titleColor: '#f8fafc',
            bodyColor: '#cbd5e1',
            borderColor: '#334155',
            borderWidth: 1,
            padding: 12,
            displayColors: true,
            callbacks: {
              label: function(context) {
                const value = context.parsed.y ?? 0;
                return context.dataset.label + ': $' + value.toLocaleString();
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(51, 65, 85, 0.3)'
            },
            ticks: {
              color: '#94a3b8',
              callback: function(value) {
                return '$' + (value as number / 1000) + 'k';
              }
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#94a3b8'
            }
          }
        }
      }
    });
  }

  private initOrdersChart(): void {
    const ctx = this.ordersChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    this.ordersChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Pendientes', 'Procesando', 'Entregados', 'Cancelados'],
        datasets: [{
          data: [40, 30, 25, 5],
          backgroundColor: [
            'rgba(251, 146, 60, 0.8)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(239, 68, 68, 0.8)'
          ],
          borderColor: [
            'rgba(251, 146, 60, 1)',
            'rgba(59, 130, 246, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(239, 68, 68, 1)'
          ],
          borderWidth: 2,
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              color: '#cbd5e1',
              font: {
                size: 12,
                family: 'Inter, system-ui, sans-serif'
              },
              padding: 15,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            titleColor: '#f8fafc',
            bodyColor: '#cbd5e1',
            borderColor: '#334155',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: function(context) {
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const percentage = ((context.parsed / total) * 100).toFixed(1);
                return context.label + ': ' + context.parsed + ' (' + percentage + '%)';
              }
            }
          }
        },
        cutout: '65%'
      }
    });
  }

  private initRevenueChart(): void {
    const ctx = this.revenueChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    this.revenueChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        datasets: [
          {
            label: 'Semana Actual',
            data: [3200, 4100, 3800, 5200, 4800, 6500, 5900],
            borderColor: 'rgba(59, 130, 246, 1)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBackgroundColor: 'rgba(59, 130, 246, 1)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(59, 130, 246, 1)',
            pointHoverBorderWidth: 3
          },
          {
            label: 'Semana Anterior',
            data: [2800, 3500, 3200, 4100, 4200, 5800, 5200],
            borderColor: 'rgba(139, 92, 246, 1)',
            backgroundColor: 'rgba(139, 92, 246, 0.05)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: 'rgba(139, 92, 246, 1)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            borderDash: [5, 5]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: '#cbd5e1',
              font: {
                size: 12,
                family: 'Inter, system-ui, sans-serif'
              },
              padding: 15,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            titleColor: '#f8fafc',
            bodyColor: '#cbd5e1',
            borderColor: '#334155',
            borderWidth: 1,
            padding: 12,
            displayColors: true,
            callbacks: {
              label: function(context) {
                const value = context.parsed.y ?? 0;
                return context.dataset.label + ': $' + value.toLocaleString();
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(51, 65, 85, 0.3)'
            },
            ticks: {
              color: '#94a3b8',
              callback: function(value) {
                return '$' + (value as number / 1000) + 'k';
              }
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#94a3b8'
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    });
  }

  refreshData(): void {
    console.log('Refreshing dashboard data...');
    // Actualizar datos de los gráficos
    if (this.salesChart) {
      this.salesChart.data.datasets[0].data = [
        Math.random() * 30000,
        Math.random() * 30000,
        Math.random() * 30000,
        Math.random() * 30000,
        Math.random() * 30000,
        Math.random() * 30000
      ];
      this.salesChart.update();
    }
    if (this.revenueChart) {
      this.revenueChart.data.datasets[0].data = [
        Math.random() * 7000,
        Math.random() * 7000,
        Math.random() * 7000,
        Math.random() * 7000,
        Math.random() * 7000,
        Math.random() * 7000,
        Math.random() * 7000
      ];
      this.revenueChart.update();
    }
  }

  getInitials(name: string): string {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'pending': 'Pendiente',
      'processing': 'Procesando',
      'delivered': 'Entregado',
      'cancelled': 'Cancelado'
    };
    return labels[status] || status;
  }
}
