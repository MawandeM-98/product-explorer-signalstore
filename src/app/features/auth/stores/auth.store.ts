import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { inject, computed } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { StoredUser, AuthState } from '../models/auth.model';

const initialState: AuthState = {
  currentUser: null,
  isAuthenticated: false,
  loginStatus: 'idle',
  loginError: null
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  
  withState(initialState),
  
  withComputed((store) => ({
    isAdmin: computed(() => store.currentUser()?.role === 'admin'),
    isUser: computed(() => store.currentUser()?.role === 'user'),
    username: computed(() => store.currentUser()?.username || ''),
    loginLoading: computed(() => store.loginStatus() === 'loading')
  })),
  
  withMethods((store, authService = inject(AuthService)) => ({
    initializeFromStorage(): void {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const user = JSON.parse(storedUser) as StoredUser;
        patchState(store, {
          currentUser: user,
          isAuthenticated: true,
          loginStatus: 'success',
          loginError: null
        });
      }
    },
    
    login(username: string, password: string): Promise<boolean> {
      patchState(store, { loginStatus: 'loading', loginError: null });
      
      return new Promise((resolve) => {
        authService.login(username, password).subscribe({
          next: (user) => {
            if (user) {
              const userToStore: StoredUser = {
                id: user.id,
                username: user.username,
                role: user.role
              };
              localStorage.setItem('currentUser', JSON.stringify(userToStore));
              patchState(store, {
                currentUser: userToStore,
                isAuthenticated: true,
                loginStatus: 'success',
                loginError: null
              });
              resolve(true);
            } else {
              patchState(store, {
                loginStatus: 'error',
                loginError: 'Invalid username or password'
              });
              resolve(false);
            }
          },
          error: (error) => {
            patchState(store, {
              loginStatus: 'error',
              loginError: error.message || 'Login failed'
            });
            resolve(false);
          }
        });
      });
    },
    
    logout(): void {
      localStorage.removeItem('currentUser');
      patchState(store, {
        currentUser: null,
        isAuthenticated: false,
        loginStatus: 'idle',
        loginError: null
      });
    }
  }))
);