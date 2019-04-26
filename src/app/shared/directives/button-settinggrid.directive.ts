import {Directive, ElementRef, OnInit, Renderer2} from '@angular/core';

@Directive({
  selector: '[appButtonSettinggrid]'
})
export class ButtonSettinggridDirective implements OnInit {

  constructor(private element: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    const nativeElement = this.element.nativeElement;
    this.renderer.setStyle(nativeElement, 'margin', '5px 5px 5px 5px');
    this.renderer.setStyle(nativeElement, 'width', '150px');
  }

}
