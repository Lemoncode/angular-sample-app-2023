import { Directive, ElementRef, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
})
export class HighlightDirective {
  originalColor!: string;
  color: string;

  constructor(private el: ElementRef) {
    this.color = 'yellow';
  }

  @Input() set appHighlight(color: string) {
    this.originalColor = this.el.nativeElement.style.color;
    if (color) {
      this.color = color;
    }
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.el.nativeElement.style.color = this.color;
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.el.nativeElement.style.color = this.originalColor;
  }
}
