import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HomeComponent } from './home.component';
import { PokemonService } from '../../core/services/pokemon.service';
import { signal } from '@angular/core';
import { Pokemon } from '../../core/models/pokemon.model';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockPokemonService: jasmine.SpyObj<PokemonService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockPokemon: Pokemon = {
    id: 1,
    name: 'bulbasaur',
    url: 'https://pokeapi.co/api/v2/pokemon/1/',
    sprites: {
      front_default: 'https://example.com/bulbasaur.png'
    },
    types: [{
      slot: 1,
      type: {
        name: 'grass',
        url: 'https://pokeapi.co/api/v2/type/12/'
      }
    }]
  };

  beforeEach(async () => {
    const pokemonServiceSpy = jasmine.createSpyObj('PokemonService', [
      'getAvailableTypes'
    ], {
      pokemons: signal([mockPokemon]),
      favorites: signal([]),
      isLoading: signal(false)
    });

    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: PokemonService, useValue: pokemonServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    mockPokemonService = TestBed.inject(PokemonService) as jasmine.SpyObj<PokemonService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    mockPokemonService.getAvailableTypes.and.returnValue(['grass', 'fire', 'water']);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show random pokemon', () => {
    component.showRandomPokemon();
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/pokemon', mockPokemon.id]);
  });

  it('should calculate total pokemons correctly', () => {
    expect(component.totalPokemons()).toBe(1);
  });

  it('should calculate favorites count correctly', () => {
    expect(component.favoritesCount()).toBe(0);
  });

  it('should calculate available types count correctly', () => {
    expect(component.availableTypesCount()).toBe(3);
  });
});