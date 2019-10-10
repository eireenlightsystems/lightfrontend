import {Directive, ElementRef, OnInit, Renderer2} from '@angular/core';

@Directive({
  selector: '[appWavesDirective]'
})
export class WavesDirectiveDirective implements OnInit{

  constructor(private element: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    // const nativeElement = this.element.nativeElement;
    // this.renderer.addClass(nativeElement, 'waves-effect');
    // this.renderer.addClass(nativeElement, 'waves-yellow');
  }
}
