import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {isUndefined} from 'util';
import {jqxDateTimeInputComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxdatetimeinput';
import {DateTimeFormat} from '../../../classes/DateTimeFormat';

@Component({
  selector: 'app-filter-item',
  templateUrl: './filter-item.component.html',
  styleUrls: ['./filter-item.component.css']
})
export class FilterItemComponent implements OnInit {

  // variables from master component
  @Input() itemFilter;

  // determine the functions that need to be performed in the parent component

  // define variables - link to view objects
  @ViewChild('jqxDateTimeInput') jqxDateTimeInput: jqxDateTimeInputComponent;

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
