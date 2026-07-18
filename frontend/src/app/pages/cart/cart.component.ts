import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, map } from 'rxjs';
import { CartService, CartItem } from '../../services/cart.service';
import { MenuItem } from '../../services/menu.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);

  cartItems$!: Observable<CartItem[]>;
  cartTotal$!: Observable<number>;
  cartCount$!: Observable<number>;
  cartTax$!: Observable<number>;
  cartSubtotal$!: Observable<number>;
  cartGrandTotal$!: Observable<number>;
  isEmpty$!: Observable<boolean>;

  private readonly TAX_RATE = 0.10;

  ngOnInit(): void {
    this.cartItems$ = this.cartService.cartItems$;
    this.cartTotal$ = this.cartService.cartTotal$;
    this.cartCount$ = this.cartService.cartCount$;

    this.cartSubtotal$ = this.cartTotal$;

    this.cartTax$ = this.cartTotal$.pipe(
      map(total => total * this.TAX_RATE)
    );

    this.cartGrandTotal$ = this.cartTotal$.pipe(
      map(total => total + total * this.TAX_RATE)
    );

    this.isEmpty$ = this.cartItems$.pipe(
      map(items => items.length === 0)
    );
  }

  increaseQuantity(item: MenuItem): void {
    this.cartService.addToCart(item);
  }

  decreaseQuantity(item: MenuItem): void {
    this.cartService.removeFromCart(item);
  }

  removeItem(item: MenuItem): void {
    this.cartService.removeProductEntirely(item);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  placeOrder(): void {
    alert('🎉 Order placed successfully! Thank you for dining with Kimaya\'s Kitchen. Your exquisite meal is being prepared.');
  }

  getLineTotal(cartItem: CartItem): number {
    return cartItem.item.price * cartItem.quantity;
  }

  trackByName(index: number, cartItem: CartItem): string {
    return cartItem.item.name;
  }
}
