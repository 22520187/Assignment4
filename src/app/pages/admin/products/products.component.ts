import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Product = {
	id: number;
	name: string;
	price: number;
	imageUrl: string;
	rating: number; // 0..5
	reviewCount: number;
	description?: string;
	category: string;
	brand: string;
	createdAt: number; // dùng cho sort "Newest"
};

type SortKey = 'newest' | 'price-asc' | 'price-desc' | 'rating-desc' | 'name-asc';

@Component({
	selector: 'app-products',
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: './products.component.html',
	styleUrls: ['./products.component.css']
})
export class ProductsComponent {
	// Sample data
	products = signal<Product[]>([
		{
			id: 1,
			name: 'iPhone 15',
			price: 21990000,
			imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085c9?w=900&q=80&auto=format&fit=crop',
			rating: 4.7,
			reviewCount: 412,
			description: 'Smartphone cao cấp, chip A17.',
			category: 'Smartphones',
			brand: 'Apple',
			createdAt: Date.now() - 1000 * 60 * 60 * 24 * 1
		},
		{
			id: 2,
			name: 'Galaxy S24',
			price: 18990000,
			imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&q=80&auto=format&fit=crop',
			rating: 4.5,
			reviewCount: 356,
			description: 'Màn hình Dynamic AMOLED, camera AI.',
			category: 'Smartphones',
			brand: 'Samsung',
			createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2
		},
		{
			id: 3,
			name: 'iPad Air',
			price: 14990000,
			imageUrl: 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=900&q=80&auto=format&fit=crop',
			rating: 4.6,
			reviewCount: 210,
			description: 'Máy tính bảng mỏng nhẹ.',
			category: 'Tablets',
			brand: 'Apple',
			createdAt: Date.now() - 1000 * 60 * 60 * 24 * 4
		},
		{
			id: 4,
			name: 'Surface Pro 9',
			price: 32990000,
			imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&q=80&auto=format&fit=crop',
			rating: 4.3,
			reviewCount: 98,
			description: '2-trong-1, hiệu năng mạnh.',
			category: 'Tablets',
			brand: 'Microsoft',
			createdAt: Date.now() - 1000 * 60 * 60 * 24 * 6
		},
		{
			id: 5,
			name: 'AirPods Pro',
			price: 5990000,
			imageUrl: 'https://images.unsplash.com/photo-1518441982124-5f3872edc213?w=900&q=80&auto=format&fit=crop',
			rating: 4.8,
			reviewCount: 870,
			description: 'Chống ồn chủ động.',
			category: 'Headphones',
			brand: 'Apple',
			createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3
		},
		{
			id: 6,
			name: 'Sony WH-1000XM5',
			price: 7990000,
			imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=900&q=80&auto=format&fit=crop',
			rating: 4.9,
			reviewCount: 540,
			description: 'Huyền thoại chống ồn.',
			category: 'Headphones',
			brand: 'Sony',
			createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5
		}
	]);

	// Filters state
	searchTerm = signal<string>('');
	selectedCategory = signal<string | null>(null);
	selectedBrands = signal<Set<string>>(new Set());

	// Price range
	priceBounds = computed(() => {
		const prices = this.products().map(p => p.price);
		const min = prices.length ? Math.min(...prices) : 0;
		const max = prices.length ? Math.max(...prices) : 0;
		return { min, max };
	});
	priceMin = signal<number>(0);
	priceMax = signal<number>(0);

	// (giữ nguyên các properties, BUT thêm imagePreview và xử lý upload ở dưới)
	imagePreview: string | null = null;

	constructor() {
		// init price range with bounds
		const b = this.priceBounds();
		this.priceMin.set(b.min);
		this.priceMax.set(b.max);
	}

	setPriceMin(val: number) {
		const v = Math.min(Math.max(val, this.priceBounds().min), this.priceMax());
		this.priceMin.set(v);
	}
	setPriceMax(val: number) {
		const v = Math.max(Math.min(val, this.priceBounds().max), this.priceMin());
		this.priceMax.set(v);
	}

	// Sort
	sortBy = signal<SortKey>('newest');

	// Derived lists
	categories = computed(() => {
		const counts = new Map<string, number>();
		for (const p of this.products()) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
		return Array.from(counts.entries()).map(([name, count]) => ({ name, count }));
	});
	brands = computed(() => {
		const counts = new Map<string, number>();
		for (const p of this.products()) counts.set(p.brand, (counts.get(p.brand) ?? 0) + 1);
		return Array.from(counts.entries()).map(([name, count]) => ({ name, count }));
	});

	// Filtering + sorting
	filteredProducts = computed(() => {
		const term = this.searchTerm().trim().toLowerCase();
		const cat = this.selectedCategory();
		const brands = this.selectedBrands();
		const minP = this.priceMin();
		const maxP = this.priceMax();

		return this.products().filter(p => {
			const matchText =
				!term ||
				p.name.toLowerCase().includes(term) ||
				p.brand.toLowerCase().includes(term) ||
				p.category.toLowerCase().includes(term);

			const matchCat = !cat || p.category === cat;
			const matchBrand = brands.size === 0 || brands.has(p.brand);
			const matchPrice = p.price >= minP && p.price <= maxP;

			return matchText && matchCat && matchBrand && matchPrice;
		});
	});

	visibleProducts = computed(() => {
		const items = [...this.filteredProducts()];
		switch (this.sortBy()) {
			case 'price-asc':
				items.sort((a, b) => a.price - b.price);
				break;
			case 'price-desc':
				items.sort((a, b) => b.price - a.price);
				break;
			case 'rating-desc':
				items.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
				break;
			case 'name-asc':
				items.sort((a, b) => a.name.localeCompare(b.name));
				break;
			case 'newest':
			default:
				items.sort((a, b) => b.createdAt - a.createdAt);
		}
		return items;
	});

	// UI actions
	toggleCategory(cat: string | null): void {
		this.selectedCategory.set(this.selectedCategory() === cat ? null : cat);
	}
	toggleBrand(brand: string): void {
		const s = new Set(this.selectedBrands());
		if (s.has(brand)) s.delete(brand);
		else s.add(brand);
		this.selectedBrands.set(s);
	}
	clearFilters(): void {
		this.searchTerm.set('');
		this.selectedCategory.set(null);
		this.selectedBrands.set(new Set());
		const b = this.priceBounds();
		this.priceMin.set(b.min);
		this.priceMax.set(b.max);
		this.sortBy.set('newest');
	}

	// CRUD (giữ nguyên như trước)
	showModal = false;
	isEditing = false;
	form: Product = this.emptyForm();

	private emptyForm(): Product {
		return {
			id: 0,
			name: '',
			price: 0,
			imageUrl: '',
			rating: 0,
			reviewCount: 0,
			description: '',
			category: '',
			brand: '',
			createdAt: Date.now()
		};
	}

	openAddModal(): void {
		this.isEditing = false;
		this.form = this.emptyForm();
		this.imagePreview = null;
		this.showModal = true;
	}
	openEditModal(p: Product): void {
		this.isEditing = true;
		this.form = { ...p };
		this.imagePreview = this.form.imageUrl || null;
		this.showModal = true;
	}
	// Xử lý chọn ảnh file
	onImageFileChange(event: any): void {
		const file = event.target.files && event.target.files[0];
		if (!file) { this.imagePreview = null; return; }
		const reader = new FileReader();
		reader.onload = (e: ProgressEvent<FileReader>) => {
			this.imagePreview = e.target?.result as string;
			this.form.imageUrl = this.imagePreview as string;
		};
		reader.readAsDataURL(file);
	}
	closeModal(): void {
		this.showModal = false;
	}
	saveProduct(): void {
		if (!this.form.name.trim()) return;
		if (!this.form.category || !this.form.brand) return;
		// rating & reviewCount giữ giá trị cũ hoặc random hoặc 0 khi tạo mới
		if (!this.isEditing) {
			this.form.rating = 0;
			this.form.reviewCount = 0;
		}
		if (this.isEditing) {
			this.products.set(this.products().map(p => (p.id === this.form.id ? { ...this.form } : p)));
		} else {
			const nextId = this.products().length ? Math.max(...this.products().map(p => p.id)) + 1 : 1;
			this.products.set([{ ...this.form, id: nextId, createdAt: Date.now() }, ...this.products()]);
		}
		this.closeModal();
	}
	deleteProduct(p: Product): void {
		if (confirm(`Xoá sản phẩm "${p.name}"?`)) {
			this.products.set(this.products().filter(x => x.id !== p.id));
		}
	}

	// Rating helpers
	starsArray = Array.from({ length: 5 }, (_, i) => i);
	isStarFilled(index: number, rating: number): boolean {
		return index < Math.floor(rating);
	}
	formatCurrency(v: number): string {
		return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(v);
	}
}