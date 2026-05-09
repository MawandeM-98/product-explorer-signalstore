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
    <div class="min-h-screen bg-gradient-to-br from-[#0D1B3E] via-[#0D1B3E] to-[#1A2E5A] flex items-center justify-center px-4">
      <!-- Animated Background Decoration -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -top-40 -right-40 w-80 h-80 bg-[#00C2B5] rounded-full opacity-10 blur-3xl"></div>
        <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-[#00C2B5] rounded-full opacity-10 blur-3xl"></div>
      </div>

      <!-- Login Modal -->
      <div class="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden relative z-10">
        <!-- Top Accent Bar -->
        <div class="h-2 bg-gradient-to-r from-[#00C2B5] to-[#00A89A]"></div>
        
        <!-- Header Section -->
        <div class="text-center pt-8 pb-4 px-6">
          <h1 class="text-4xl font-black text-[#0D1B3E] tracking-tight">
            deVere
          </h1>
          <p class="text-[#00C2B5] text-xl font-bold mt-1 tracking-wide">
            productExplorer
          </p>
          <div class="w-16 h-1 bg-[#00C2B5] mx-auto mt-4 rounded-full"></div>
          <p class="text-[#6B7A99] font-medium mt-4">
            Sign in to access the catalogue
          </p>
        </div>

        <!-- Login Form -->
        <div class="px-8 pb-8">
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-5">
            <!-- Username Field -->
            <div>
              <label class="block text-sm font-bold text-[#1A1A2E] mb-2">
                Username
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-[#6B7A99]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <input
                  type="text"
                  formControlName="username"
                  placeholder="Enter your username"
                  class="w-full pl-10 pr-4 py-3 border-2 border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#00C2B5] focus:border-[#00C2B5] bg-white text-[#1A1A2E] font-medium transition duration-200"
                />
              </div>
            </div>

            <!-- Password Field -->
            <div>
              <label class="block text-sm font-bold text-[#1A1A2E] mb-2">
                Password
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-[#6B7A99]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
                <input
                  type="password"
                  formControlName="password"
                  placeholder="Enter your password"
                  class="w-full pl-10 pr-4 py-3 border-2 border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#00C2B5] focus:border-[#00C2B5] bg-white text-[#1A1A2E] font-medium transition duration-200"
                />
              </div>
            </div>

            <!-- Demo Credentials Card -->
            <div class="bg-[#F5F7FA] rounded-xl p-4 border border-[#E2E8F0]">
              <p class="text-xs font-bold text-[#6B7A99] text-center uppercase tracking-wider mb-2">
                Demo Credentials
              </p>
              <div class="flex justify-center gap-6">
                <div class="text-center">
                  <p class="text-sm font-bold text-[#0D1B3E] font-mono">admin</p>
                  <p class="text-xs text-[#6B7A99]">/ admin</p>
                </div>
                <div class="text-center">
                  <p class="text-sm font-bold text-[#0D1B3E] font-mono">user</p>
                  <p class="text-xs text-[#6B7A99]">/ user</p>
                </div>
              </div>
            </div>

            <!-- Error Message -->
            @if (authStore.loginError()) {
              <div class="bg-red-50 border-l-4 border-red-500 rounded-lg p-3">
                <p class="text-red-600 text-sm font-medium">{{ authStore.loginError() }}</p>
              </div>
            }

            <!-- Login Button with Loading State -->
            <button
              type="submit"
              [disabled]="loginForm.invalid || authStore.loginLoading()"
              class="w-full bg-gradient-to-r from-[#00C2B5] to-[#00A89A] text-white py-3 rounded-xl hover:from-[#00A89A] hover:to-[#008F7A] transition-all duration-200 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              @if (authStore.loginLoading()) {
                <span class="flex items-center justify-center gap-3">
                  <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </span>
              } @else {
                Sign In
              }
            </button>
          </form>

          <!-- Footer -->
          <div class="mt-6 text-center">
            <p class="text-xs font-semibold text-[#6B7A99] tracking-wide">
              SECURED ACCESS FOR DE VERE STAKEHOLDERS
            </p>
          </div>
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
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 2000);
    }
  }
}