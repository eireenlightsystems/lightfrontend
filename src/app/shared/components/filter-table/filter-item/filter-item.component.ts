// @ts-ignore
import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {isUndefined} from 'util';

import {jqxDateTimeInputComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxdatetimeinput';
import {jqxComboBoxComponent} from 'jqwidgets-scripts/jqwidgets-ng/jqxcombobox';

import {DateTimeFormat} from '../../../classes/DateTimeFormat';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-filter-item',
  templateUrl: './filter-item.component.html',
  styleUrls: ['./filter-item.component.css']
})
export class FilterItemComponent implements OnInit, OnDestroy {

  // variables from master component
  @Input() itemFilter;

  // determine the functions that need to be performed in the parent component

  // define variables - link to view objects
  @ViewChild('jqxDateTimeInput', {static: false}) jqxDateTimeInput: jqxDateTimeInputComponent;
  @ViewChild('jqxComboBox', {static: false}) jqxComboBox: jqxComboBoxComponent;

  // other variables


  constructor() {
  }

  ngOnInit() {
    switch (this.itemFilter.type) {
      case 'jqxComboBox':

        break;
      case 'jqxDateTimeInput':
        setTimeout(_ => this.jqxDateTimeInput.setDate(this.itemFilter.defaultValue));
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
  }

  OnSelect(event: any) {
    this.itemFilter.selectId = '';
    this.itemFilter.defaultValue = '';
    if (!isUndefined(event)
      && !isUndefined(event.args)
      && !isUndefined(event.args.item)
      && !isUndefined(event.args.item.value)
      && !isUndefined(event.args.item.index)) {
      this.itemFilter.selectId = event.args.item.value;
      this.itemFilter.defaultValue = event.args.item.index;
    }
  }

  onValueChanged(event: any) {
    this.itemFilter.selectId = '';
    if (!isUndefined(event.args)) {
      this.itemFilter.selectId = new DateTimeFormat().fromDataPickerString(event.args.date);
      this.itemFilter.defaultValue = formatDate(event.args.date, 'yyyy-MM-dd HH:mm', 'en');
    }
  }
}
