import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';

import {jqxDateTimeInputComponent} from 'jqwidgets-scripts/jqwidgets-ng/jqxdatetimeinput';
import {jqxComboBoxComponent} from 'jqwidgets-scripts/jqwidgets-ng/jqxcombobox';
import {isUndefined} from 'util';
import {DateTimeFormat} from '../../../classes/DateTimeFormat';
import {jqxTextAreaComponent} from 'jqwidgets-scripts/jqwidgets-ng/jqxtextarea';

@Component({
  selector: 'app-edit-form-item',
  templateUrl: './edit-form-item.component.html',
  styleUrls: ['./edit-form-item.component.css']
})
export class EditFormItemComponent implements OnInit, AfterViewInit, OnDestroy {

  // variables from master component
  @Input() itemEditForm;

  // determine the functions that need to be performed in the parent component

  // define variables - link to view objects
  @ViewChild('jqxDateTimeInput') jqxDateTimeInput: jqxDateTimeInputComponent;
  @ViewChild('jqxComboBox') jqxComboBox: jqxComboBoxComponent;
  @ViewChild('jqxTextArea') jqxTextArea: jqxTextAreaComponent;

  // other variables

  constructor() {
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    switch (this.itemEditForm.type) {
      case 'jqxDateTimeInput':
        setTimeout(_ => this.jqxDateTimeInput.setDate(this.itemEditForm.defaultValue));
        break;
      default:
        break;
    }
  }

  ngOnDestroy() {
    if (this.jqxDateTimeInput) {
      this.jqxDateTimeInput.destroy();
    }
    if (this.jqxComboBox) {
      this.jqxComboBox.destroy();
    }
    if (this.jqxTextArea) {
      this.jqxTextArea.destroy();
    }
  }

  OnSelect(event: any) {
    if (!isUndefined(event.args)) {
      this.itemEditForm.selectId = event.args.item.value;
      this.itemEditForm.selectCode = !isUndefined(event.args.item.originalItem.code) ? event.args.item.originalItem.code : '';
      this.itemEditForm.selectName = !isUndefined(event.args.item.originalItem.name) ? event.args.item.originalItem.name : '';
    } else {
      this.itemEditForm.selectId = '';
    }
  }

  onValueChanged(event: any) {
    if (!isUndefined(event.args)) {
      this.itemEditForm.selectId = new DateTimeFormat().fromDataPickerString(event.args.date);
    } else {
      this.itemEditForm.selectId = '';
    }
  }

}
