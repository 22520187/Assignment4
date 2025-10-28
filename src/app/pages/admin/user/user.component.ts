import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'user';
  createdAt: string;
  status: 'active' | 'disabled';
  totalOrders: number;
  lastLogin: string;
}

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {

  users: User[] = [];
  filteredUsers: User[] = [];
  searchQuery: string = '';
  statusFilter: 'all' | 'active' | 'disabled' = 'all';
  roleFilter: 'all' | 'admin' | 'user' = 'all';
  isLoading = true;
  currentPage = 1;
  itemsPerPage = 10;

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    setTimeout(() => {
      this.users = [
        { id: '1', name: 'Nguyen Van A', email: 'nguyenvanA@example.com', phone: '1234567890', role: 'admin', createdAt: '2021-01-01', status: 'active', totalOrders: 21, lastLogin: '2021-01-01' },
        { id: '2', name: 'Nguyen Van B', email: 'nguyenvanB@example.com', phone: '1234567890', role: 'user', createdAt: '2021-01-01', status: 'active', totalOrders: 12, lastLogin: '2021-01-01' },
        { id: '3', name: 'Nguyen Van C', email: 'nguyenvanC@example.com', phone: '1234567890', role: 'admin', createdAt: '2021-01-01', status: 'disabled', totalOrders: 15, lastLogin: '2021-01-01' },
        { id: '4', name: 'Nguyen Van D', email: 'nguyenvanD@example.com', phone: '1234567890', role: 'user', createdAt: '2021-01-01', status: 'disabled', totalOrders: 13, lastLogin: '2021-01-01' },
        { id: '5', name: 'Nguyen Van E', email: 'nguyenvanE@example.com', phone: '1234567890', role: 'user', createdAt: '2021-01-01', status: 'active', totalOrders: 14, lastLogin: '2021-01-01' },
        { id: '6', name: 'Nguyen Van F', email: 'nguyenvanF@example.com', phone: '1234567890', role: 'user', createdAt: '2021-01-01', status: 'active', totalOrders: 18, lastLogin: '2021-01-01' },
        { id: '7', name: 'Nguyen Van G', email: 'nguyenvanG@example.com', phone: '1234567890', role: 'user', createdAt: '2021-01-01', status: 'active', totalOrders: 20, lastLogin: '2021-01-01' },
        { id: '8', name: 'Nguyen Van H', email: 'nguyenvanH@example.com', phone: '1234567890', role: 'user', createdAt: '2021-01-01', status: 'active', totalOrders: 22, lastLogin: '2021-01-01' },
        { id: '9', name: 'Nguyen Van I', email: 'nguyenvanI@example.com', phone: '1234567890', role: 'user', createdAt: '2021-01-01', status: 'active', totalOrders: 24, lastLogin: '2021-01-01' },
        { id: '10', name: 'Nguyen Van J', email: 'nguyenvanJ@example.com', phone: '1234567890', role: 'admin', createdAt: '2021-01-01', status: 'active', totalOrders: 26, lastLogin: '2021-01-01' },

      ];
      this.filteredUsers = this.users;
      this.isLoading = false;
    }, 1000);
  }

  toggleUserStatus(user: User): void {
    user.status = user.status === 'active' ? 'disabled' : 'active';
    this.applyFilters();
  }

  filterUsers(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = !this.searchQuery ||
        user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.phone.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesStatus = this.statusFilter === 'all' || user.status === this.statusFilter;

      const matchesRole = this.roleFilter === 'all' || user.role === this.roleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }

  get paginatedUsers(): User[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredUsers.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  getRoleClass(role: string): string {
    const classes = {
      'admin': 'bg-red-100 text-red-800',
      'user': 'bg-blue-100 text-blue-800',
    }
    return classes[role as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  }

  getRoleText(role: string): string {
    const text = {
      'admin': 'Quản trị viên',
      'user': 'Người dùng',
    }
    return text[role as keyof typeof text] || role;
  }

  getStatusText(status: string): string {
    return status === 'active' ? 'Hoạt động' : 'Vô hiệu hóa';
  }

  getActiveUsersCount(): number {
    return this.users.filter(user => user.status === 'active').length;
  }

  getDisabledUsersCount(): number {
    return this.users.filter(user => user.status === 'disabled').length;
  }

  getTotalUsersCount(): number {
    return this.users.length;
  }
}
