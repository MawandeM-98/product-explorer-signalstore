import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private readonly BASE_URL = 'http://localhost:3000';

  login(username: string, password: string): Observable<User | null> {
    return this.http.get<User[]>(`${this.BASE_URL}/users`).pipe(
      map(users => {
        const user = users.find(u => u.username === username && u.password === password);
        return user || null;
      }),
      catchError(() => of(null))
    );
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.BASE_URL}/users`);
  }
}