import { Component, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

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
export class AdminDashboardComponent implements OnInit {
  currentUser = computed(() => this.authService.getCurrentUser());

  // Dashboard Statistics
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

  refreshData(): void {
    console.log('Refreshing dashboard data...');
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
