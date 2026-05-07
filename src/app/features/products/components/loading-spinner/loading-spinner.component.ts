import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `
    <div class="flex justify-center items-center py-8 md:py-12">
      <div class="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-[#00C2B5]"></div>
    </div>
  `
})
export class LoadingSpinnerComponent {}