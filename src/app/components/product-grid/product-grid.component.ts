import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent, Product } from '../product-card/product-card.component';

@Component({
  selector: 'app-product-grid',
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './product-grid.component.html',
  styleUrl: './product-grid.component.css'
})
export class ProductGridComponent {
  products: Product[] = [
    {
      id: 1,
      name: 'Classic Winter Jacket',
      price: 129.99,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop',
      description: 'Stay warm in style with our premium winter jacket'
    },
    {
      id: 2,
      name: 'Elegant Cashmere Sweater',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=500&fit=crop',
      description: 'Luxury cashmere for ultimate comfort'
    },
    {
      id: 3,
      name: 'Designer Denim Jeans',
      price: 79.99,
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop',
      description: 'Premium denim with perfect fit'
    },
    {
      id: 4,
      name: 'Leather Boots',
      price: 159.99,
      image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400&h=500&fit=crop',
      description: 'Handcrafted leather boots for any occasion'
    },
    {
      id: 5,
      name: 'Wool Scarf Collection',
      price: 39.99,
      image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400&h=500&fit=crop',
      description: 'Soft wool scarves in multiple colors'
    },
    {
      id: 6,
      name: 'Stylish Beanie Hat',
      price: 24.99,
      image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400&h=500&fit=crop',
      description: 'Keep your head warm with our trendy beanies'
    },
    {
      id: 7,
      name: 'Premium Hoodie',
      price: 69.99,
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop',
      description: 'Comfortable cotton blend hoodie'
    },
    {
      id: 8,
      name: 'Sport Sneakers',
      price: 119.99,
      image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400&h=500&fit=crop',
      description: 'Performance meets style in our latest sneakers'
    }
  ];
}
