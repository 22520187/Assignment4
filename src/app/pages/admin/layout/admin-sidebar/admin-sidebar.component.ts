import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, state } from '@angular/animations';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.css',
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)'}),
        animate('300ms ease-in', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
    ]),
    trigger('hoverEffect', [
      state('normal', style({ transform: 'translateX(0)' })),
      state('hovered', style({ transform: 'translateX(4px)' })),
      transition('normal <=> hovered', [
        animate('200ms ease-in-out'),
      ]),
    ])
  ]
})
export class AdminSidebarComponent {
  @Input() isCollapsed = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  sidebarItems = [
    { icon: 'fas fa-tachometer-alt', label: 'Dashboard', route: '/admin/dashboard' },
    { icon: 'fas fa-users', label: 'Users', route: '/admin/users' },
    { icon: 'fas fa-tags', label: 'Categories', route: '/admin/categories' },
    { icon: 'fas fa-award', label: 'Brands', route: '/admin/brands' },
    { icon: 'fas fa-box', label: 'Products', route: '/admin/products' },
    { icon: 'fas fa-chart-bar', label: 'Reports', route: '/admin/reports' },
    { icon: 'fas fa-cog', label: 'Settings', route: '/admin/settings' },
    { icon: 'fas fa-sign-out-alt', label: 'Logout', route: '/logout' },
  ];

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  onLogout() {
    if (confirm('Are you sure you want to logout?')) {
      console.log('Logout successful');
    }
  }

  // Thêm method để handle hover effects an toàn
  onMouseEnter(event: Event) {
    const target = event.target as HTMLElement;
    if (target) {
      target.style.transform = 'translateX(4px)';
    }
  }

  onMouseLeave(event: Event) {
    const target = event.target as HTMLElement;
    if (target) {
      target.style.transform = 'translateX(0)';
    }
  }
}


