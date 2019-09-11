import {Directive, ElementRef, OnInit, Renderer2} from '@angular/core';

@Directive({
  selector: '[appButtonSimpleStyle]'
})
export class ButtonSimpleStyleDirective implements OnInit {

  constructor(private element: ElementRef, private renderer: Renderer2) {
  }

  ngOnInit() {
    const nativeElement = this.element.nativeElement;

    this.renderer.setStyle(nativeElement, 'margin', '2px 2px 2px 2px');
    this.renderer.setStyle(nativeElement, 'text-align', 'center');
    // this.renderer.setStyle(nativeElement, 'vertical-align', 'middle');

    this.renderer.addClass(nativeElement, 'btn');
    this.renderer.addClass(nativeElement, 'btn-small');
    this.renderer.addClass(nativeElement, 'white');
    this.renderer.addClass(nativeElement, 'blue-text');
  }
}
