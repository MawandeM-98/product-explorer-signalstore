import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthStore } from '../stores/auth.store';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-[#0D1B3E] to-[#1A2E5A] flex items-center justify-center px-4">
      <div class="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-[#0D1B3E]">deVere</h1>
          <p class="text-[#00C2B5] text-lg mt-1">productExplorer</p>
          <p class="text-[#6B7A99] text-sm mt-4">Sign in to access the catalogue</p>
        </div>

        <!-- Login Form -->
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-[#1A1A2E] mb-1">Username</label>
            <input
              type="text"
              formControlName="username"
              placeholder="Enter your username"
              class="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#00C2B5] focus:border-[#00C2B5] bg-white text-[#1A1A2E]"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-[#1A1A2E] mb-1">Password</label>
            <input
              type="password"
              formControlName="password"
              placeholder="Enter your password"
              class="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#00C2B5] focus:border-[#00C2B5] bg-white text-[#1A1A2E]"
            />
          </div>

          <!-- Demo Credentials Hint -->
          <div class="bg-[#F5F7FA] rounded-lg p-3 text-center">
            <p class="text-xs text-[#6B7A99]">Demo Credentials:</p>
            <p class="text-xs text-[#0D1B3E] font-mono">admin / admin &nbsp;&nbsp;|&nbsp;&nbsp; user / user</p>
          </div>

          <!-- Error Message -->
          @if (authStore.loginError()) {
            <div class="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
              <p class="text-red-600 text-sm">{{ authStore.loginError() }}</p>
            </div>
          }

          <!-- Login Button with Loading State -->
          <button
            type="submit"
            [disabled]="loginForm.invalid || authStore.loginLoading()"
            class="w-full bg-[#00C2B5] text-white py-2 rounded-lg hover:bg-[#00A89A] transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            @if (authStore.loginLoading()) {
              <span class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Authenticating...
              </span>
            } @else {
              ' Sign In
            }
          </button>
        </form>

        <!-- Footer -->
        <div class="mt-6 text-center">
          <p class="text-xs text-[#6B7A99]">Secured Access for deVere Stakeholders</p>
        </div>
      </div>
    </div>
  `
})
export class LoginPageComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  authStore = inject(AuthStore);

  loginForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) return;

    const { username, password } = this.loginForm.value;
    const success = await this.authStore.login(username, password);

    if (success) {
      // Simulate 2 second delay for creative effect
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 2000);
    }
  }
}