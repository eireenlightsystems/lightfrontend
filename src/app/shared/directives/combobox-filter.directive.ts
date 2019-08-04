import {Directive, ElementRef, OnInit, Renderer2} from '@angular/core';

@Directive({
  selector: '[appComboboxFilter]'
})
export class ComboboxFilterDirective implements OnInit {

  constructor(private element: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    const nativeElement = this.element.nativeElement;
    this.renderer.setStyle(nativeElement, 'margin', '15px 5px 15px 5px');
  }
}
