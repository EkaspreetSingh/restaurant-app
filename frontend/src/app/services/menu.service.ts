import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map, tap } from 'rxjs';

export interface MenuItem {
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: 'Appetizers' | 'Mains' | 'Desserts' | 'Beverages';
  image: string;
  tags: string[];
  available: boolean;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = 'http://localhost:5000/api/menu';
  private menuItemsSubject = new BehaviorSubject<MenuItem[]>([]);
  public menuItems$ = this.menuItemsSubject.asObservable();
  
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Fetch menu from backend and update BehaviorSubject
  fetchMenuItems(): Observable<MenuItem[]> {
    this.loadingSubject.next(true);
    return this.http.get<MenuItem[]>(this.apiUrl).pipe(
      tap(items => {
        this.menuItemsSubject.next(items);
        this.loadingSubject.next(false);
      }),
      tap({
        error: () => this.loadingSubject.next(false)
      })
    );
  }

  // Add new menu item (for custom addition by user)
  addMenuItem(item: MenuItem): Observable<MenuItem> {
    return this.http.post<MenuItem>(this.apiUrl, item).pipe(
      tap(newItem => {
        const currentItems = this.menuItemsSubject.value;
        this.menuItemsSubject.next([...currentItems, newItem]);
      })
    );
  }

  // Get items filtered by category
  getItemsByCategory(category: string): Observable<MenuItem[]> {
    return this.menuItems$.pipe(
      map(items => items.filter(item => item.category.toLowerCase() === category.toLowerCase()))
    );
  }

  // Get hot items (referred by home and menu pages)
  getHotItems(): Observable<MenuItem[]> {
    return this.menuItems$.pipe(
      map(items => items.filter(item => 
        item.tags.includes('hot') || item.tags.includes('chef-special') || item.tags.includes('popular')
      ))
    );
  }
}
