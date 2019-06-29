import {Directive, ElementRef, HostBinding, HostListener, Input, OnInit, Renderer2} from '@angular/core';

@Directive({
  selector: '[appTextFontweightDirective]'
})
export class TextFontweightDirective implements OnInit {
  @Input() hoverFontWeight;
  @Input() defaultFontWeight;

  @HostBinding('style.fontWeight') fontWeight: string;


  hoverDirectiveFontWeight = '900';
  defaultDirectiveFontWeight = 'normal';

  constructor(private element: ElementRef, private renderer: Renderer2) {
  }

  ngOnInit() {
    this.fontWeight = this.defaultFontWeight ? this.defaultFontWeight : this.defaultDirectiveFontWeight;
  }

  @HostListener('mouseenter') mouseEnter() {
    this.fontWeight = this.hoverFontWeight ? this.hoverFontWeight : this.hoverDirectiveFontWeight;
  }

  @HostListener('mouseleave') mouseLeave() {
    this.fontWeight = this.defaultFontWeight ? this.defaultFontWeight : this.defaultDirectiveFontWeight;
  }

}
