import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Brand {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'active' | 'pending' | 'inactive';
  productCount: number;
  createdAt: string;
  image?: string; // đường dẫn ảnh (base64 hoặc url)
}

@Component({
  selector: 'app-brand',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './brand.component.html',
  styleUrl: './brand.component.css',
})
export class BrandComponent implements OnInit {
  brands: Brand[] = [];
  filteredBrands: Brand[] = [];
  searchQuery = '';
  categoryFilter = '';
  currentBrand: Partial<Brand> = { name: '', description: '', category: '', status: 'active', image: '' };
  isLoading = true;
  showForm = false;
  formMode: 'create' | 'edit' = 'create';
  editingId: string | null = null;
  formError = '';
  categories: string[] = ['Technology', 'Sports & Fashion', 'E-commerce', 'Music & Entertainment', 'Social Media'];

  ngOnInit(): void {
    this.loadBrands();
  }

  loadBrands() {
    setTimeout(() => {
      this.brands = [
        { id: '1', name: 'Apple Inc.', description: 'Premium technology products and innovative solutions', category: 'Technology', status: 'active', productCount: 156, createdAt: '2022-01-01', image: '' },
        { id: '2', name: 'Nike', description: 'Athletic footwear, apparel, and sports equipment', category: 'Sports & Fashion', status: 'active', productCount: 89, createdAt: '2022-04-10', image: '' },
        { id: '3', name: 'Amazon', description: 'Online marketplace and cloud computing services', category: 'E-commerce', status: 'pending', productCount: 2341, createdAt: '2022-08-07', image: '' },
        { id: '4', name: 'Spotify', description: 'Digital music streaming platform and services', category: 'Music & Entertainment', status: 'active', productCount: 82, createdAt: '2022-03-17', image: '' },
        { id: '5', name: 'Meta', description: 'Social networking and virtual reality technologies', category: 'Social Media', status: 'inactive', productCount: 107, createdAt: '2021-11-22', image: '' },
        { id: '6', name: 'Google', description: 'Search engine and cloud computing services', category: 'Technology', status: 'active', productCount: 205, createdAt: '2021-12-19', image: '' }
      ];
      this.filteredBrands = [...this.brands];
      this.isLoading = false;
    }, 600);
  }

  onSearch(): void {
    const q = this.searchQuery.trim().toLowerCase();
    this.filteredBrands = this.brands.filter(b => {
      const nameMatch = b.name.toLowerCase().includes(q) || (b.description || '').toLowerCase().includes(q);
      const categoryMatch = !this.categoryFilter || b.category === this.categoryFilter;
      return (!q || nameMatch) && categoryMatch;
    });
  }

  openCreate(): void {
    this.formMode = 'create';
    this.editingId = null;
    this.currentBrand = { name: '', description: '', category: '', status: 'active', image: '' };
    this.formError = '';
    this.showForm = true;
  }

  openEdit(brand: Brand): void {
    this.formMode = 'edit';
    this.editingId = brand.id;
    this.currentBrand = { ...brand };
    this.formError = '';
    this.showForm = true;
  }

  deleteBrand(brand: Brand): void {
    const ok = confirm(`Xóa brand "${brand.name}"? Hành động không thể hoàn tác!`);
    if (!ok) return;
    this.brands = this.brands.filter(b => b.id !== brand.id);
    this.onSearch();
  }

  handleImageChange(event: any): void {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.currentBrand.image = e.target.result as string;
    };
    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.currentBrand.image = '';
  }

  saveBrand(): void {
    this.formError = '';
    const name = (this.currentBrand.name || '').trim();
    const category = (this.currentBrand.category || '').trim();
    if (!name) {
      this.formError = 'Tên brand không được để trống';
      return;
    }
    if (!category) {
      this.formError = 'Category không được để trống';
      return;
    }
    const payload: Brand = {
      id: this.editingId ?? this.generateId(),
      name,
      description: (this.currentBrand.description || '').trim(),
      category,
      status: (this.currentBrand.status as 'active' | 'inactive' | 'pending') ?? 'active',
      productCount: (this.currentBrand.productCount as number) ?? 0,
      createdAt: this.editingId
        ? (this.currentBrand.createdAt as string) || new Date().toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),
      image: this.currentBrand.image || '',
    };
    if (this.formMode === 'create') {
      this.brands = [payload, ...this.brands];
    } else {
      this.brands = this.brands.map(b => (b.id === payload.id ? { ...b, ...payload } : b));
    }
    this.closeForm();
    this.onSearch();
  }

  closeForm(): void {
    this.showForm = false;
    this.editingId = null;
    this.currentBrand = { name: '', description: '', category: '', status: 'active', image: '' };
    this.formError = '';
  }

  private generateId(): string {
    return Math.random().toString(36).slice(2, 9);
  }
}
