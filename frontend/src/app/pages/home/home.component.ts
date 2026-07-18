import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuService, MenuItem } from '../../services/menu.service';
import { MenuCardComponent } from '../../components/menu-card/menu-card.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private menuService = inject(MenuService);
  hotItems$!: Observable<MenuItem[]>;
  loading$ = this.menuService.loading$;

  ngOnInit(): void {
    // Make sure we fetch the menu items
    this.menuService.fetchMenuItems().subscribe();
    // Get the shared hot items filter
    this.hotItems$ = this.menuService.getHotItems();
  }
}
