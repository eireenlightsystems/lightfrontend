import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';

import {jqxWindowComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxwindow';
import {jqxButtonComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxbuttons';

@Component({
  selector: 'app-event-window',
  templateUrl: './event-window.component.html',
  styleUrls: ['./event-window.component.css']
})

export class EventWindowComponent {

  @Input() warning = '';

  @Output() onOkEvenwinBtn = new EventEmitter();
  @Output() onCancelEvenwinBtn = new EventEmitter();

  @ViewChild('eventWindow') eventWindow: jqxWindowComponent;
  @ViewChild('okButton') okButton: jqxButtonComponent;

  okEvenwinBtn() {
    this.onOkEvenwinBtn.emit();
  }

  cancelEvenwinBtn() {
    this.onCancelEvenwinBtn.emit();
  }

  openEventWindow() {
    this.eventWindow.open();
  }

  destroyEventWindow() {
    this.eventWindow.destroy();
  }

  hideEventWindow() {
    this.eventWindow.hide();
  }

  okButtonDisabled(flg_disable: boolean) {
    this.okButton.disabled(flg_disable);
  }
}
