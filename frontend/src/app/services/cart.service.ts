import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { MenuItem } from './menu.service';

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  public cartCount$ = this.cartItems$.pipe(
    map(items => items.reduce((acc, curr) => acc + curr.quantity, 0))
  );

  public cartTotal$ = this.cartItems$.pipe(
    map(items => items.reduce((acc, curr) => acc + (curr.item.price * curr.quantity), 0))
  );

  constructor() {
    // Load initial cart from localStorage if available
    const savedCart = localStorage.getItem('kimayas_cart');
    if (savedCart) {
      try {
        this.cartItemsSubject.next(JSON.parse(savedCart));
      } catch (e) {
        localStorage.removeItem('kimayas_cart');
      }
    }
  }

  private saveToLocalStorage(items: CartItem[]) {
    localStorage.setItem('kimayas_cart', JSON.stringify(items));
  }

  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  addToCart(item: MenuItem) {
    const currentItems = [...this.cartItemsSubject.value];
    const existingIndex = currentItems.findIndex(i => i.item._id === item._id || (i.item.name === item.name && i.item.price === item.price));

    if (existingIndex > -1) {
      currentItems[existingIndex].quantity += 1;
    } else {
      currentItems.push({ item, quantity: 1 });
    }

    this.cartItemsSubject.next(currentItems);
    this.saveToLocalStorage(currentItems);
  }

  removeFromCart(item: MenuItem) {
    const currentItems = [...this.cartItemsSubject.value];
    const existingIndex = currentItems.findIndex(i => i.item._id === item._id || (i.item.name === item.name && i.item.price === item.price));

    if (existingIndex > -1) {
      if (currentItems[existingIndex].quantity > 1) {
        currentItems[existingIndex].quantity -= 1;
      } else {
        currentItems.splice(existingIndex, 1);
      }
      this.cartItemsSubject.next(currentItems);
      this.saveToLocalStorage(currentItems);
    }
  }

  removeProductEntirely(item: MenuItem) {
    const currentItems = this.cartItemsSubject.value.filter(
      i => i.item._id !== item._id && !(i.item.name === item.name && i.item.price === item.price)
    );
    this.cartItemsSubject.next(currentItems);
    this.saveToLocalStorage(currentItems);
  }

  clearCart() {
    this.cartItemsSubject.next([]);
    localStorage.removeItem('kimayas_cart');
  }
}
