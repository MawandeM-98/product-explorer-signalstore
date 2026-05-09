export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'user';
}

export interface StoredUser {
  id: string;
  username: string;
  role: 'admin' | 'user';
}

export interface AuthState {
  currentUser: StoredUser | null;
  isAuthenticated: boolean;
  loginStatus: 'idle' | 'loading' | 'success' | 'error';
  loginError: string | null;
}