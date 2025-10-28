import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Category {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  createdAt: string;
  productCount: number;
}

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit {

  categories: Category[] = [];
  filteredCategories: Category[] = [];
  searchQuery: string = '';
  currentCategory: Partial<Category> = { name: '', description: '', status: 'active' };
  isLoading = true;
  currentPage = 1;
  itemsPerPage = 10;
  showForm = false;
  formMode: 'create' | 'edit' = 'create';
  editingId: string | null = null;
  formError = '';

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    setTimeout(() => {
      this.categories = [
        { id: '1', name: 'Điện thoại', description: 'Các loại smartphone', status: 'active', createdAt: '2021-01-20', productCount: 10 },
        { id: '2', name: 'Laptop', description: 'Máy tính xách tay', status: 'active', createdAt: '2021-01-20', productCount: 10 },
        { id: '3', name: 'Tablet', description: 'Máy tính bảng', status: 'active', createdAt: '2021-01-20', productCount: 10 },
        { id: '4', name: 'Smartwatch', description: 'Máy đeo tay', status: 'active', createdAt: '2021-01-20', productCount: 10 },
        { id: '5', name: 'Smart TV', description: 'Tivi thông minh', status: 'active', createdAt: '2021-01-20', productCount: 10 },
        { id: '6', name: 'Smart Home', description: 'Thiết bị nhà thông minh', status: 'active', createdAt: '2021-01-20', productCount: 10 },
        { id: '7', name: 'Smart Car', description: 'Phương tiện thông minh', status: 'active', createdAt: '2021-01-20', productCount: 10 },
        { id: '8', name: 'Smart Watch', description: 'Máy đeo tay thông minh', status: 'active', createdAt: '2021-01-20', productCount: 10 },
      ];
      this.filteredCategories = [...this.categories];
      this.isLoading = false;
    }, 600);
  }

  // Search
  onSearch(): void {
    const q = this.searchQuery.trim().toLowerCase();
    this.filteredCategories = this.categories.filter(c => !q || c.name.toLowerCase().includes(q) || (c.description || '').toLowerCase().includes(q)
    );
  }

  // Toggle status
  toggleStatus(cat: Category): void {
    cat.status = cat.status === 'active' ? 'inactive' : 'active';
    this.onSearch();
  }

  // Create
  openCreate(): void {
    this.formMode = 'create';
    this.editingId = null;
    this.currentCategory = { name: '', description: '', status: 'active' };
    this.formError = '';
    this.showForm = true;
  }

  // Edit
  openEdit(cat: Category): void {
    this.formMode = 'edit';
    this.editingId = cat.id;
    this.currentCategory = { ...cat };
    this.formError = '';
    this.showForm = true;
  }

  // Delete
  deleteCategory(cat: Category): void {
    const ok = confirm(`Xóa danh mục "${cat.name}"? Hành động không thể hoàn tác!`);
    if (!ok) return;
    this.categories = this.categories.filter(c => c.id !== cat.id);
    this.onSearch();
  }

  // Save 
  saveCategory(): void {
    this.formError = '';
    const name = (this.currentCategory.name || '').trim();
    if (!name) {
      this.formError = 'Tên danh mục không được để trống';
      return;
    }

    const payload: Category = {
      id: this.editingId ?? this.generateId(),
      name,
      description: (this.currentCategory.description || '').trim(),
      status: (this.currentCategory.status as 'active' | 'inactive') ?? 'active',
      createdAt: this.editingId
        ? (this.currentCategory.createdAt as string) || new Date().toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),
      productCount: (this.currentCategory.productCount as number) ?? 0,
    };

    if (this.formMode === 'create') {
      this.categories = [payload, ...this.categories];
    } else {
      this.categories = this.categories.map(c => (c.id === payload.id ? { ...c, ...payload } : c));
    }

    this.closeForm();
    this.onSearch();
  }

  closeForm(): void {
    this.showForm = false;
    this.editingId = null;
    this.currentCategory = { name: '', description: '', status: 'active' };
    this.formError = '';
  }

  private generateId(): string {
    return Math.random().toString(36).slice(2, 9);
  }
}
