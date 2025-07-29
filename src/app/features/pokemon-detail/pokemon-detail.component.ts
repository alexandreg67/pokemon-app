import { Component, signal, computed, inject, effect, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { lastValueFrom } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { PokemonService } from '../../core/services/pokemon.service';
import { Pokemon } from '../../core/models/pokemon.model';
import { PokemonBorder } from '../../directives/pokemon-border';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatTabsModule,
    MatProgressBarModule,
    PokemonBorder // Ajout de la directive aux imports
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="pokemon-detail-container">
      <!-- Toolbar de navigation -->
      <mat-toolbar color="primary" class="detail-toolbar">
        <button mat-icon-button (click)="goBack()" title="Retour">
          <mat-icon>arrow_back</mat-icon>
        </button>
        
        @if (pokemon(); as poke) {
          <span class="pokemon-title">{{ poke.name | titlecase }}</span>
          <span class="spacer"></span>
          <span class="pokemon-id">#{{ poke.id.toString().padStart(3, '0') }}</span>
          
          <button mat-icon-button
                  (click)="toggleFavorite()"
                  [title]="isFavorite() ? 'Retirer des favoris' : 'Ajouter aux favoris'">
            <mat-icon [color]="isFavorite() ? 'warn' : ''">
              {{ isFavorite() ? 'favorite' : 'favorite_border' }}
            </mat-icon>
          </button>
        }
      </mat-toolbar>

      <!-- Contenu principal -->
      <div class="detail-content">
        @if (isLoading()) {
          <div class="loading-container">
            <mat-progress-spinner mode="indeterminate" diameter="80"></mat-progress-spinner>
            <p>Chargement des détails...</p>
          </div>
        } @else if (error()) {
          <div class="error-container">
            <mat-icon color="warn">error</mat-icon>
            <h3>Erreur de chargement</h3>
            <p>{{ error() }}</p>
            <button mat-raised-button color="primary" (click)="retry()">
              Réessayer
            </button>
          </div>
        } @else {
          @if (pokemon(); as poke) {
          <!-- Carte principale avec image -->
          <mat-card class="hero-card">
            <div class="hero-content">
              <div class="pokemon-image-section">
                @if (poke.sprites?.other?.['official-artwork']?.front_default) {
                  @if (poke.types && poke.types.length > 0) {
                    <img [src]="poke.sprites?.other?.['official-artwork']?.front_default || ''"
                         [alt]="poke.name"
                         class="main-image"
                         loading="eager"
                         [appPokemonBorder]="poke.types[0].type.name">
                  }
                } @else if (poke.sprites?.front_default) {
                  @if (poke.types && poke.types.length > 0) {
                    <img [src]="poke.sprites?.front_default || ''"
                         [alt]="poke.name"
                         class="main-image"
                         loading="eager"
                         [appPokemonBorder]="poke.types[0].type.name">
                  }
                } @else {
                  <div class="no-image">
                    <mat-icon>catching_pokemon</mat-icon>
                  </div>
                }
              </div>

              <div class="pokemon-info-section">
                <h1>{{ poke.name | titlecase }}</h1>
                <div class="basic-info">
                  @if (poke.types) {
                    <div class="types">
                      <h3>Types</h3>
                      <div class="type-chips">
                        @for (typeInfo of poke.types; track typeInfo.type.name) {
                          <mat-chip [class]="'type-' + typeInfo.type.name">
                            {{ typeInfo.type.name | titlecase }}
                          </mat-chip>
                        }
                      </div>
                    </div>
                  }

                  <div class="measurements">
                    @if (poke.height) {
                      <div class="measurement">
                        <span class="label">Taille</span>
                        <span class="value">{{ (poke.height / 10).toFixed(1) }} m</span>
                      </div>
                    }
                    @if (poke.weight) {
                      <div class="measurement">
                        <span class="label">Poids</span>
                        <span class="value">{{ (poke.weight / 10).toFixed(1) }} kg</span>
                      </div>
                    }
                    @if (poke.base_experience) {
                      <div class="measurement">
                        <span class="label">Exp. de base</span>
                        <span class="value">{{ poke.base_experience }}</span>
                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>
          </mat-card>

          <!-- Onglets avec détails -->
          <mat-tab-group class="detail-tabs">
            <!-- Onglet Statistiques -->
            <mat-tab label="Statistiques">
              <div class="tab-content">
                @if (poke.stats) {
                  <mat-card class="stats-card">
                    <mat-card-header>
                      <mat-card-title>Statistiques de base</mat-card-title>
                    </mat-card-header>
                    <mat-card-content>
                      <div class="stats-list">
                        @for (stat of poke.stats; track stat.stat.name) {
                          <div class="stat-item">
                            <div class="stat-info">
                              <span class="stat-name">{{ getStatDisplayName(stat.stat.name) }}</span>
                              <span class="stat-value">{{ stat.base_stat }}</span>
                            </div>
                            <div class="stat-bar-container">
                              <mat-progress-bar
                                mode="determinate"
                                [value]="getStatPercentage(stat.base_stat)"
                                [class]="getStatColorClass(stat.base_stat)">
                              </mat-progress-bar>
                            </div>
                          </div>
                        }
                      </div>
                      
<!-- Total des stats -->
                        <div class="total-stats">
                          <strong>Total: {{ totalStats() }}</strong>
                        </div>                    </mat-card-content>
                  </mat-card>
                }
              </div>
            </mat-tab>

            <!-- Onglet Capacités -->
            <mat-tab label="Capacités">
              <div class="tab-content">
                @if (poke.abilities) {
                  <mat-card class="abilities-card">
                    <mat-card-header>
                      <mat-card-title>Capacités</mat-card-title>
                    </mat-card-header>
                    <mat-card-content>
                      <div class="abilities-list">
                        @for (abilityInfo of poke.abilities; track abilityInfo.ability.name) {
                          <div class="ability-item" [class.hidden]="abilityInfo.is_hidden">
                            <div class="ability-name">
                              {{ abilityInfo.ability.name | titlecase }}
                              @if (abilityInfo.is_hidden) {
                                <mat-chip color="accent" class="hidden-chip">Cachée</mat-chip>
                              }
                            </div>
                            <div class="ability-slot">Slot {{ abilityInfo.slot }}</div>
                          </div>
                        }
                      </div>
                    </mat-card-content>
                  </mat-card>
                }
              </div>
            </mat-tab>

            <!-- Onglet Sprites -->
            <mat-tab label="Images">
              <div class="tab-content">
                @if (poke.sprites) {
                  <mat-card class="sprites-card">
                    <mat-card-header>
                      <mat-card-title>Sprites</mat-card-title>
                    </mat-card-header>
                    <mat-card-content>
                      <div class="sprites-grid">
                        @if (poke.sprites.front_default || '') {
                          <div class="sprite-item">
                            <img [src]="poke.sprites.front_default || ''"
                                 [alt]="poke.name + ' face'"
                                 loading="lazy">
                            <span>Face normale</span>
                          </div>
                        }
                        @if (poke.sprites.front_shiny) {
                          <div class="sprite-item">
                            <img [src]="poke.sprites.front_shiny"
                                 [alt]="poke.name + ' face shiny'"
                                 loading="lazy">
                            <span>Face shiny</span>
                          </div>
                        }
                      </div>
                    </mat-card-content>
                  </mat-card>
                }
              </div>
            </mat-tab>
          </mat-tab-group>

          <!-- Navigation vers Pokémon précédent/suivant -->
          <div class="navigation-card">
            <button mat-raised-button
                    [disabled]="poke.id <= 1"
                    (click)="navigateToPokemon(poke.id - 1)"
                    class="nav-button prev">
              <mat-icon>chevron_left</mat-icon>
              Précédent
            </button>
            
            <button mat-raised-button
                    color="primary"
                    routerLink="/pokemon"
                    class="nav-button list">
              <mat-icon>list</mat-icon>
              Retour à la liste
            </button>
            
            <button mat-raised-button
                    [disabled]="poke.id >= 1000"
                    (click)="navigateToPokemon(poke.id + 1)"
                    class="nav-button next">
              Suivant
              <mat-icon>chevron_right</mat-icon>
            </button>
          </div>
          }
        }
      </div>
    </div>
  `,
  styleUrls: ['./pokemon-detail.component.scss']
})
export class PokemonDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly pokemonService = inject(PokemonService);

  // Signals pour l'état local
  readonly pokemon = signal<Pokemon | null>(null);
  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);
  
  // Signal pour l'ID du Pokémon depuis la route
  private readonly pokemonId = toSignal(
    this.route.params.pipe(map(params => +params['id'])),
    { initialValue: 0 }
  );

  // Computed pour vérifier si c'est un favori
  readonly isFavorite = computed(() => {
    const poke = this.pokemon();
    return poke ? this.pokemonService.isFavorite(poke.id) : false;
  });

  // Computed pour le total des statistiques
  readonly totalStats = computed(() => {
    const poke = this.pokemon();
    return poke?.stats?.reduce((total, stat) => total + stat.base_stat, 0) || 0;
  });

  constructor() {
    // Effect pour charger le Pokémon quand l'ID change
    effect(() => {
      const id = this.pokemonId();
      if (id > 0) {
        this.loadPokemon(id);
      }
    });
  }

  ngOnInit(): void {
    // L'effect s'occupera du chargement initial
  }

  private async loadPokemon(id: number): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);
    
    try {
      const pokemon$ = this.pokemonService.getPokemonById(id);
      const pokemon = await lastValueFrom(pokemon$);
      if (pokemon) {
        this.pokemon.set(pokemon);
      } else {
        this.error.set('Pokémon introuvable');
      }
    } catch (err) {
      this.error.set('Erreur lors du chargement du Pokémon');
      console.error('Error loading Pokemon:', err);
    } finally {
      this.isLoading.set(false);
    }
  }

  toggleFavorite(): void {
    const poke = this.pokemon();
    if (poke) {
      this.pokemonService.toggleFavorite(poke.id);
    }
  }

  goBack(): void {
    this.router.navigate(['/pokemon']);
  }

  retry(): void {
    const id = this.pokemonId();
    if (id > 0) {
      this.loadPokemon(id);
    }
  }

  navigateToPokemon(id: number): void {
    this.router.navigate(['/pokemon', id]);
  }

  getStatDisplayName(statName: string): string {
    const statMap: { [key: string]: string } = {
      'hp': 'PV',
      'attack': 'Attaque',
      'defense': 'Défense',
      'special-attack': 'Att. Spé.',
      'special-defense': 'Déf. Spé.',
      'speed': 'Vitesse'
    };
    return statMap[statName] || statName;
  }

  getStatPercentage(value: number): number {
    // Normalise la stat sur une échelle de 0-100 (max théorique ~255)
    return Math.min((value / 255) * 100, 100);
  }

  getStatColorClass(value: number): string {
    if (value >= 100) return 'stat-excellent';
    if (value >= 80) return 'stat-good';
    if (value >= 60) return 'stat-average';
    return 'stat-low';
  }

  
}