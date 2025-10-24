import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [ReactiveFormsModule, RouterModule, NzFormModule, NzInputModule, NzButtonModule, NzIconModule],
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css'],
    animations: [
      trigger('fadeSlideIn', [
        transition(':enter', [
          style({ opacity: 0, transform: 'translateX(30px)' }),
          animate('600ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
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
export class SignupComponent implements OnInit {
    signupForm!: FormGroup;
    loading = false;

    constructor(private fb: FormBuilder, private router: Router) {}

    ngOnInit() {
        this.signupForm = this.fb.group({
            username: ['', [Validators.required, Validators.minLength(3)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', Validators.required],
        }, {
            validator: this.passwordMatchValidator,
        });
    }

    passwordMatchValidator(form: FormGroup) {
        const password = form.get('password');
        const confirmPassword = form.get('confirmPassword');
        if (password && confirmPassword && password.value !== confirmPassword.value) {
            confirmPassword.setErrors({ passwordMismatch: true });
            return { passwordMismatch: true };
        }
        return null;
    }

    onSubmit() {
        if (this.signupForm.valid) {
            this.loading = true;
            console.log(this.signupForm.value);
            setTimeout(() => {
                this.loading = false;
                this.router.navigate(['/login']);
            }, 1500);
        } else {
            Object.values(this.signupForm.controls).forEach((control) => {
                control.markAsDirty();
                control.updateValueAndValidity();
            });
        }
    }
}