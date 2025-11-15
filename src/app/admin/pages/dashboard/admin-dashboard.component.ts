import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  stats = [
    { label: 'Pedidos Totales', value: 0, trend: 0 },
    { label: 'Ventas Mensuales', value: '$0', trend: 0 },
    { label: 'Clientes Activos', value: 0, trend: 0 },
    { label: 'Productos', value: 0, trend: 0 }
  ];
}
