import {Directive, ElementRef, OnInit, Renderer2} from '@angular/core';

@Directive({
  selector: '[appObjectPosition2]'
})
export class ObjectPosition2Directive implements OnInit {

  constructor(private element: ElementRef, private renderer: Renderer2) {
  }

  ngOnInit() {
    const nativeElement = this.element.nativeElement;
    this.renderer.setStyle(nativeElement, 'margin', '2px 2px 2px 2px');
  }

}
