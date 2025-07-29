# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a modern Angular 20+ Pokemon application (Pokédex) built with standalone components, signals-based state management, and Angular Material. The app fetches data from the PokeAPI and includes features like Pokemon listing, detailed views, favorites management, and filtering.

## Common Development Commands

- **Start development server**: `npm start` or `ng serve` (runs on `http://localhost:4200`)
- **Build for production**: `npm run build` or `ng build`
- **Watch mode (development build)**: `npm run watch` or `ng build --watch --configuration development`
- **Run tests**: `npm test` or `ng test` (uses Karma + Jasmine)
- **Generate components**: `ng generate component component-name`
- **Generate services**: `ng generate service service-name`

## Architecture Overview

### Core Structure
- **Feature-based architecture** with lazy-loaded components
- **Signals-first approach** for reactive state management
- **Standalone components** (no NgModules)
- **Angular Material** for UI components
- **RxJS** for async operations and reactive patterns

### Key Directories
- `src/app/core/` - Core business logic (services, models, interceptors)
- `src/app/features/` - Feature modules (home, pokemon-list, pokemon-detail, favorites)
- `src/app/shared/` - Reusable components and utilities
- `src/app/layout/` - Layout components
- `src/app/directives/` - Custom directives

### State Management
The application uses Angular signals for state management:
- **PokemonService** (`src/app/core/services/pokemon.service.ts`) manages all Pokemon data using signals
- State includes: pokemons list, favorites, loading status, error handling, and filters
- Combines signals with RxJS for complex async operations
- LocalStorage integration for favorites persistence

### Key Features
- **Lazy loading**: All feature components are lazy-loaded using `loadComponent()`
- **Route guards**: Pokemon detail route has ID validation (1-10000)
- **Search & filtering**: Real-time search with debouncing, type filtering
- **Favorites system**: Toggle and persist favorites in localStorage
- **Error handling**: Centralized error state management
- **Responsive design**: Angular Material with custom SCSS

### Data Models
- **Pokemon interface** with comprehensive type definitions
- **PokemonService** handles API integration with PokeAPI
- Supports both signals and Observables for different use cases

### Routing Structure
- `/home` - Landing page
- `/pokemon` - Pokemon listing with search/filters
- `/pokemon/:id` - Individual Pokemon details (with ID validation)
- `/favorites` - User's favorite Pokemon
- Fallback to `/home` for unknown routes

## Development Notes

- Uses Angular CLI 20.1.3 with latest Angular features
- TypeScript ~5.8.2 with strict mode
- Prettier configured for HTML templates with Angular parser
- No end-to-end testing framework configured by default
- French language interface ("Pokédex", "Mes Favoris", etc.)