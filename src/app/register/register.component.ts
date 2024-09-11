import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        username: ['', Validators.required],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            this.passwordPatternValidator(),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.mustMatch('password', 'confirmPassword') }
    );
  }

  get f() {
    return this.registerForm.controls;
  }

  passwordPatternValidator(): Validators {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value || '';
      const hasNumber = /\d/.test(value);
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(value);

      const passwordValid =
        hasNumber && hasUpperCase && hasLowerCase && hasSpecialCharacter;

      return !passwordValid ? { passwordStrength: true } : null;
    };
  }

  register() {
    this.errorMessage = '';
    if (this.registerForm.invalid) {
      return;
    }

    this.authService.register(this.registerForm.value).subscribe(
      (response) => {
        this.successMessage = 'Registration successful';
        setTimeout(() => {
          this.authService.navigateToLogin();
        }, 2000); // Redireciona após 2 segundos
      },
      (error) => {
        if (error.status === 400 && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'An unexpected error occurred.';
        }
      }
    );
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  mustMatch(password: string, confirmPassword: string) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const control = formGroup.get(password);
      const matchingControl = formGroup.get(confirmPassword);

      if (matchingControl?.errors && !matchingControl.errors['mustMatch']) {
        return null;
      }

      if (control?.value !== matchingControl?.value) {
        matchingControl?.setErrors({ mustMatch: true });
      } else {
        matchingControl?.setErrors(null);
      }
      return null;
    };
  }
}
