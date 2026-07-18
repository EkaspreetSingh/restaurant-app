import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from '../../services/menu.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-menu-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-card.component.html',
  styleUrl: './menu-card.component.css'
})
export class MenuCardComponent {
  @Input() item!: MenuItem;
  addedSuccessfully = false;

  constructor(private cartService: CartService) {}

  onAddToCart(event: Event) {
    event.stopPropagation();
    this.cartService.addToCart(this.item);
    
    // Simple micro-animation state
    this.addedSuccessfully = true;
    setTimeout(() => {
      this.addedSuccessfully = false;
    }, 1500);
  }
}
