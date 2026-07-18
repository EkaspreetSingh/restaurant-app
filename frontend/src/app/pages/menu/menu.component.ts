import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuService, MenuItem } from '../../services/menu.service';
import { MenuCardComponent } from '../../components/menu-card/menu-card.component';
import { Observable, combineLatest, map, startWith } from 'rxjs';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MenuCardComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
  private menuService = inject(MenuService);
  private fb = inject(FormBuilder);

  menuItems$ = this.menuService.menuItems$;
  loading$ = this.menuService.loading$;
  
  selectedCategory = 'All';
  searchQuery = '';
  showAdminPanel = false;
  
  // Customization Form
  menuForm!: FormGroup;
  formSuccessMsg = '';
  formErrorMsg = '';

  categories: string[] = ['All', 'Appetizers', 'Mains', 'Desserts', 'Beverages'];

  ngOnInit(): void {
    // Initial fetch
    this.menuService.fetchMenuItems().subscribe();
    
    // Initialize form
    this.menuForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [null, [Validators.required, Validators.min(0.1)]],
      category: ['Appetizers', Validators.required],
      image: [''],
      tagHot: [false],
      tagChefSpecial: [false],
      tagVegetarian: [false],
      tagPopular: [false]
    });
  }

  // Filtered Menu Items
  get filteredItems(): MenuItem[] {
    // Note: BehaviorSubject value could change, so we evaluate the filter synchronously or reactively.
    // Given the small size, we can filter using a standard getter connected to the current state.
    // For reactive flow, let's filter using current values.
    const items = (this.menuService.menuItems$ as any).value || [];
    return items.filter((item: MenuItem) => {
      const matchesCategory = this.selectedCategory === 'All' || item.category === this.selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            item.description.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
  }

  toggleAdminPanel() {
    this.showAdminPanel = !this.showAdminPanel;
    this.formSuccessMsg = '';
    this.formErrorMsg = '';
  }

  onSubmit() {
    if (this.menuForm.invalid) {
      this.formErrorMsg = 'Please fill out all required fields correctly.';
      return;
    }

    const formVal = this.menuForm.value;
    
    // Construct tags list
    const tags: string[] = [];
    if (formVal.tagHot) tags.push('hot');
    if (formVal.tagChefSpecial) tags.push('chef-special');
    if (formVal.tagVegetarian) tags.push('vegetarian');
    if (formVal.tagPopular) tags.push('popular');

    // Default image if empty
    let imageUrl = formVal.image;
    if (!imageUrl) {
      if (formVal.category === 'Appetizers') {
        imageUrl = 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=600';
      } else if (formVal.category === 'Mains') {
        imageUrl = 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=600';
      } else if (formVal.category === 'Desserts') {
        imageUrl = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=600';
      } else {
        imageUrl = 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600';
      }
    }

    const newDish: MenuItem = {
      name: formVal.name,
      description: formVal.description,
      price: Number(formVal.price),
      category: formVal.category,
      image: imageUrl,
      tags: tags,
      available: true
    };

    this.menuService.addMenuItem(newDish).subscribe({
      next: (res) => {
        this.formSuccessMsg = `"${res.name}" successfully added to the central database!`;
        this.formErrorMsg = '';
        this.menuForm.reset({
          category: 'Appetizers',
          tagHot: false,
          tagChefSpecial: false,
          tagVegetarian: false,
          tagPopular: false
        });
        
        // Hide message after 4s
        setTimeout(() => this.formSuccessMsg = '', 4000);
      },
      error: (err) => {
        this.formErrorMsg = 'Failed to add dish: ' + (err.error?.error || err.message);
        this.formSuccessMsg = '';
      }
    });
  }
}
