import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[appScaleOnHover]',
})
export class ScaleOnHoverDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.scale('1.1');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.scale('1');
  }

  private scale(scale: string) {
    this.renderer.setStyle(
      this.el.nativeElement,
      'transform',
      `scale(${scale})`
    );
    this.renderer.setStyle(
      this.el.nativeElement,
      'transition',
      'transform 0.3s ease-in-out'
    );
  }
}
