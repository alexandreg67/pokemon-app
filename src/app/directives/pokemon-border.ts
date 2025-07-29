import { Directive, ElementRef, HostListener, input } from '@angular/core';

@Directive({
  selector: '[appPokemonBorder]'
})
export class PokemonBorder {

  private initialColor: string;
  appPokemonBorder = input.required<string>();

  constructor(private el: ElementRef) {
    this.initialColor = el.nativeElement.style.borderColor || '#e0e0e0';
    this.el.nativeElement.style.borderWidth = '3px';
    this.el.nativeElement.style.borderStyle = 'solid';
    this.el.nativeElement.style.borderColor = this.initialColor;
    this.el.nativeElement.style.borderRadius = '8px';
    this.el.nativeElement.style.transition = 'border-color 0.3s ease';
  }

  @HostListener('mouseenter') onMouseEnter() {
    const color = this.getBorderColor();
    this.setBorder(color);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.setBorder(this.initialColor);
  }

  private setBorder(color: string): void {
    this.el.nativeElement.style.borderColor = color;
  }

  private getBorderColor() {
    switch (this.appPokemonBorder()) {
      case 'fire':
        return '#ff6b6b';
      case 'water':
        return '#4ecdc4';
      case 'grass':
        return '#51cf66';
      case 'electric':
        return '#ffd43b';
      case 'psychic':
        return '#da77f2';
      case 'ice':
        return '#74c0fc';
      case 'dragon':
        return '#845ef7';
      case 'dark':
        return '#495057';
      case 'fairy':
        return '#f783ac';
      case 'normal':
        return '#adb5bd';
      case 'fighting':
        return '#f76707';
      case 'poison':
        return '#9775fa';
      case 'ground':
        return '#fab005';
      case 'flying':
        return '#91a7ff';
      case 'bug':
        return '#8ce99a';
      case 'rock':
        return '#868e96';
      case 'ghost':
        return '#6c5ce7';
      case 'steel':
        return '#ced4da';
      default:
        return '#303030';
    }
  }

}
