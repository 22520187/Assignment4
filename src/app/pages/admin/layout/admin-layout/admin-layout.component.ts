import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, AdminSidebarComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms 200ms ease-in', style({ opacity: 1 })),
      ]),
    ])
  ]
})
export class AdminLayoutComponent {
  isCollapsed = false;

  onToggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}
