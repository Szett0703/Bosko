import { Component } from '@angular/core';
import { HeroComponent } from '../../components/hero/hero.component';
import { ProductGridComponent } from '../../components/product-grid/product-grid.component';

@Component({
  selector: 'app-home',
  imports: [HeroComponent, ProductGridComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
