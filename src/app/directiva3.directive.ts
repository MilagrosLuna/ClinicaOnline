import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[appTextColor]'
})
export class TextColorDirective {

  private colors: string[] = ['red', 'orange', 'green', 'blue', 'indigo', 'violet'];
  private i: number = 0;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  @HostListener('click') onClick() {
    this.changeColor(this.colors[this.i % this.colors.length]);
    this.i++;
  }

  private changeColor(color: string) {
    this.renderer.setStyle(this.el.nativeElement, 'color', color);
  }

}
