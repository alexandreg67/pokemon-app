import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-types',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="types-section">
      <h2>Explorer par Type</h2>
      <div class="types-grid">
        @for (type of popularTypes; track type) {
          <button 
            class="type-button"
            [class]="'type-' + type"
            [routerLink]="'/pokemon'"
            [queryParams]="{type: type}">
            {{ type | titlecase }}
          </button>
        }
      </div>
    </section>
  `,
  styleUrls: ['./home-types.component.scss']
})
export class HomeTypesComponent {
  @Input() popularTypes: string[] = [];
}