import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PokemonBorder } from './pokemon-border';

@Component({
  template: `<div [appPokemonBorder]="pokemonType"></div>`,
  standalone: true,
  imports: [PokemonBorder]
})
class TestComponent {
  pokemonType = 'fire';
}

describe('PokemonBorder', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let divElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    divElement = fixture.debugElement.query(By.css('div'));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply initial border styles', () => {
    const element = divElement.nativeElement;
    
    expect(element.style.borderWidth).toBe('3px');
    expect(element.style.borderStyle).toBe('solid');
    expect(element.style.borderRadius).toBe('8px');
    expect(element.style.transition).toBe('border-color 0.3s ease');
  });

  it('should change border color on mouse enter for fire type', () => {
    const element = divElement.nativeElement;
    
    divElement.triggerEventHandler('mouseenter', null);
    
    expect(element.style.borderColor).toBe('rgb(255, 107, 107)'); // #ff6b6b
  });

  it('should reset border color on mouse leave', () => {
    const element = divElement.nativeElement;
    const initialColor = element.style.borderColor;
    
    divElement.triggerEventHandler('mouseenter', null);
    divElement.triggerEventHandler('mouseleave', null);
    
    expect(element.style.borderColor).toBe(initialColor);
  });

  it('should handle different pokemon types', () => {
    const element = divElement.nativeElement;
    
    // Test water type
    component.pokemonType = 'water';
    fixture.detectChanges();
    divElement.triggerEventHandler('mouseenter', null);
    expect(element.style.borderColor).toBe('rgb(78, 205, 196)'); // #4ecdc4
    
    // Test grass type
    component.pokemonType = 'grass';
    fixture.detectChanges();
    divElement.triggerEventHandler('mouseenter', null);
    expect(element.style.borderColor).toBe('rgb(81, 207, 102)'); // #51cf66
  });

  it('should handle unknown type with default color', () => {
    const element = divElement.nativeElement;
    
    component.pokemonType = 'unknown';
    fixture.detectChanges();
    divElement.triggerEventHandler('mouseenter', null);
    
    expect(element.style.borderColor).toBe('rgb(48, 48, 48)'); // #303030
  });
});