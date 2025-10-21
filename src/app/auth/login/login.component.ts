import {
    Component,
    OnInit,
  } from '@angular/core';
  import {
    FormBuilder,
    FormGroup,
    Validators,
    ReactiveFormsModule,
  } from '@angular/forms';
  import {
    trigger,
    transition,
    style,
    animate,
    query,
    stagger,
  } from '@angular/animations';
  import { Router, RouterModule } from '@angular/router';
  import { NzFormModule } from 'ng-zorro-antd/form';
  import { NzInputModule } from 'ng-zorro-antd/input';
  import { NzButtonModule } from 'ng-zorro-antd/button';
  import { NzIconModule } from 'ng-zorro-antd/icon';
  
  @Component({
    selector: 'app-login',
    standalone: true,
    imports: [
      ReactiveFormsModule,
      RouterModule,
      NzFormModule,
      NzInputModule,
      NzButtonModule,
      NzIconModule,
    ],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    animations: [
      trigger('fadeSlideIn', [
        transition(':enter', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
        ]),
      ]),
      trigger('staggerFade', [
        transition(':enter', [
          query('.stagger-item', [
            style({ opacity: 0, transform: 'translateY(10px)' }),
            stagger(150, [
              animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
            ]),
          ]),
        ]),
      ]),
    ],
  })
  export class LoginComponent implements OnInit {
    loginForm!: FormGroup;
    loading = false;
  
    constructor(private fb: FormBuilder, private router: Router) {}
  
    ngOnInit() {
      this.loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
      });
    }
  
    onSubmit() {
      if (this.loginForm.valid) {
        this.loading = true;
        console.log(this.loginForm.value);
        setTimeout(() => {
          this.loading = false;
        }, 1500);
      } else {
        Object.values(this.loginForm.controls).forEach((control) => {
          control.markAsDirty();
          control.updateValueAndValidity();
        });
      }
    }
  }
  