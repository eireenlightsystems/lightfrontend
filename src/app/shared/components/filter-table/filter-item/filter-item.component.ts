import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {isUndefined} from 'util';

import {jqxDateTimeInputComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxdatetimeinput';
import {jqxComboBoxComponent} from 'jqwidgets-scripts/jqwidgets-ng/jqxcombobox';

import {DateTimeFormat} from '../../../classes/DateTimeFormat';

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
  @ViewChild('jqxDateTimeInput') jqxDateTimeInput: jqxDateTimeInputComponent;
  @ViewChild('jqxComboBox') jqxComboBox: jqxComboBoxComponent;

  // other variables

  constructor() {
  }

  ngOnInit() {
    switch (this.itemFilter.type) {
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
    if (!isUndefined(event.args)) {
      this.itemFilter.selectId = event.args.item.value;
    } else {
      this.itemFilter.selectId = '';
    }
  }

  onValueChanged(event: any) {
    if (!isUndefined(event.args)) {
      this.itemFilter.selectId = new DateTimeFormat().fromDataPickerString(event.args.date);
    } else {
      this.itemFilter.selectId = '';
    }
  }
}
