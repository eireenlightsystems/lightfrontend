import {Directive, ElementRef, OnInit, Renderer2} from '@angular/core';

@Directive({
  selector: '[appInputFilterStyle]'
})
export class InputFilterStyleDirective implements OnInit {

  constructor(private element: ElementRef, private renderer: Renderer2) {
  }

  ngOnInit() {
    const nativeElement = this.element.nativeElement;

    this.renderer.setStyle(nativeElement, 'margin', '2px 2px 2px 2px');
    this.renderer.setStyle(nativeElement, 'height', '43px');
    this.renderer.setStyle(nativeElement, 'width', '200px');

    this.renderer.addClass(nativeElement, 'input-field');
    this.renderer.addClass(nativeElement, 'inline');
    this.renderer.addClass(nativeElement, 'order-position-input');
  }
}
