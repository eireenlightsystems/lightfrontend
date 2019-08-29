// angular lib
import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
// jqwidgets
import {jqxWindowComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxwindow';
import {jqxButtonComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxbuttons';
// app interfaces
// app services
// app components


@Component({
  selector: 'app-event-window',
  templateUrl: './event-window.component.html',
  styleUrls: ['./event-window.component.css']
})

export class EventWindowComponent {

  // variables from parent component
  @Input() warning = '';
  @Output() onOkEvenwinBtn = new EventEmitter();
  @Output() onCancelEvenwinBtn = new EventEmitter();
  // determine the functions that need to be performed in the parent component

  // define variables - link to view objects
  @ViewChild('eventWindow', {static: false}) eventWindow: jqxWindowComponent;
  @ViewChild('okButton', {static: false}) okButton: jqxButtonComponent;

  // other variables

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
