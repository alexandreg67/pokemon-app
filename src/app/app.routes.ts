import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { PokemonService } from './core/services/pokemon.service';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component')
      .then(m => m.HomeComponent),
    title: 'Pokédex - Accueil'
  },
  {
    path: 'pokemon',
    loadComponent: () => import('./features/pokemon-list/pokemon-list.component')
      .then(m => m.PokemonListComponent),
    title: 'Pokédex - Liste des Pokémon'
  },
  {
    path: 'pokemon/:id',
    loadComponent: () => import('./features/pokemon-detail/pokemon-detail.component')
      .then(m => m.PokemonDetailComponent),
    title: 'Pokédex - Détail Pokémon',
    canActivate: [(route) => {
      const id = +route.params['id'];
      return id > 0 && id <= 10000; // Validation de base
    }]
  },
  {
    path: 'favorites',
    loadComponent: () => import('./features/favorites/favorites.component')
      .then(m => m.FavoritesComponent),
    title: 'Pokédex - Mes Favoris'
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];
