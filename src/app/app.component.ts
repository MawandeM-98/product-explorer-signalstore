import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthStore } from './features/auth/stores/auth.store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`
})
export class AppComponent implements OnInit {
  private authStore = inject(AuthStore);
  
  ngOnInit(): void {
    // Check localStorage for existing session on app load
    this.authStore.initializeFromStorage();
  }
}