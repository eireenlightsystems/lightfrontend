import {Directive, ElementRef, HostBinding, HostListener, Input, OnInit, Renderer2} from '@angular/core';

@Directive({
  selector: '[appButtonMenuDirective]'
})
export class ButtonMenuDirective implements OnInit {
  @Input() theme = 'dark';
  @Input() hoverTextColor;
  @Input() defaultTextColor;

  @HostBinding('style.color') textColor: string;
  @HostBinding('style.background') backgroundColor: string;

  hoverLightTextColor = 'white';
  defaultLightTextColor = 'rgba(255,255,255,.5)';
  hoverDarkTextColor = '#283593';
  defaultDarkTextColor = '#5C6BC0';
  hoverLightBackground = '#FFF3E0';
  defaultLightBackground = 'white';
  hoverDarkBackground = '#EF5350';
  defaultDarkBackground = '#EF5350';

  constructor(private element: ElementRef, private renderer: Renderer2) {
  }

  ngOnInit() {
    switch (this.theme) {
      case 'dark':
        this.textColor = this.defaultTextColor ? this.defaultTextColor : this.defaultLightTextColor;
        this.backgroundColor = this.defaultDarkBackground;
        break;
      case 'light':
        this.textColor = this.defaultTextColor ? this.defaultTextColor : this.defaultDarkTextColor;
        this.backgroundColor = this.defaultLightBackground;
        break;
      default:
        this.textColor = this.defaultTextColor ? this.defaultTextColor : this.defaultLightTextColor;
        break;
    }
  }

  @HostListener('mouseenter') mouseEnter() {
    switch (this.theme) {
      case 'dark':
        this.textColor = this.hoverTextColor ? this.hoverTextColor : this.hoverLightTextColor;
        this.backgroundColor = this.hoverDarkBackground;
        break;
      case 'light':
        this.textColor = this.hoverTextColor ? this.hoverTextColor : this.hoverDarkTextColor;
        this.backgroundColor = this.hoverLightBackground;
        break;
      default:
        this.textColor = this.hoverTextColor ? this.hoverTextColor : this.hoverLightTextColor;
        break;
    }
  }

  @HostListener('mouseleave') mouseLeave() {
    switch (this.theme) {
      case 'dark':
        this.textColor = this.defaultTextColor ? this.defaultTextColor : this.defaultLightTextColor;
        this.backgroundColor = this.defaultDarkBackground;
        break;
      case 'light':
        this.textColor = this.defaultTextColor ? this.defaultTextColor : this.defaultDarkTextColor;
        this.backgroundColor = this.defaultLightBackground;
        break;
      default:
        this.textColor = this.defaultTextColor ? this.defaultTextColor : this.defaultLightTextColor;
        break;
    }
  }
}
