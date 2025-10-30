import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit, OnDestroy {
  isOpen = false;
  private toggleListener: any;

  categories = [
    { name: 'Men', icon: '👔' },
    { name: 'Women', icon: '👗' },
    { name: 'Kids', icon: '🧒' },
    { name: 'Accessories', icon: '👜' },
    { name: 'Footwear', icon: '👟' },
    { name: 'Sale', icon: '🏷️' }
  ];

  ngOnInit() {
    this.toggleListener = () => this.toggle();
    window.addEventListener('toggleSidebar', this.toggleListener);
  }

  ngOnDestroy() {
    window.removeEventListener('toggleSidebar', this.toggleListener);
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }

  close() {
    this.isOpen = false;
  }
}
