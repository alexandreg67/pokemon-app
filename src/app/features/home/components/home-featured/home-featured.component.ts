import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Pokemon } from '../../../../core/models/pokemon.model';

@Component({
  selector: 'app-home-featured',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="featured-section">
      <h2>Pokémon Populaires</h2>
      @if (isLoading) {
        <div class="loading-container">
          <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
          <p>Chargement des Pokémon populaires...</p>
        </div>
      } @else {
        <div class="featured-grid">
          @for (pokemon of featuredPokemons; track pokemon.id) {
            <mat-card class="featured-card" [routerLink]="'/pokemon/' + pokemon.id">
              <div class="featured-image-container">
                @if (pokemon.sprites?.other?.['official-artwork']?.front_default) {
                  <img [src]="pokemon.sprites?.other?.['official-artwork']?.front_default || ''"
                       [alt]="pokemon.name"
                       class="featured-image"
                       loading="lazy">
                } @else if (pokemon.sprites?.front_default) {
                  <img [src]="pokemon.sprites?.front_default || ''"
                       [alt]="pokemon.name"
                       class="featured-image"
                       loading="lazy">
                } @else {
                  <div class="no-image">
                    <mat-icon>catching_pokemon</mat-icon>
                  </div>
                }
              </div>
              
              <mat-card-content>
                <h3>{{ pokemon.name | titlecase }}</h3>
                <p class="pokemon-id">#{{ pokemon.id.toString().padStart(3, '0') }}</p>
                
                <div class="types-container">
                  @for (typeInfo of pokemon.types; track typeInfo.type.name) {
                    <mat-chip [class]="'type-' + typeInfo.type.name">
                      {{ typeInfo.type.name | titlecase }}
                    </mat-chip>
                  }
                </div>
              </mat-card-content>
            </mat-card>
          }
        </div>
      }
    </section>
  `,
  styleUrls: ['./home-featured.component.scss']
})
export class HomeFeaturedComponent {
  @Input() featuredPokemons: Pokemon[] = [];
  @Input() isLoading: boolean = false;
}