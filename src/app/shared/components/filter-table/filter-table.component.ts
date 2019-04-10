import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-filter-table',
  templateUrl: './filter-table.component.html',
  styleUrls: ['./filter-table.component.css']
})
export class FilterTableComponent implements OnInit, OnDestroy {

  // variables from master component
  @Input() sourceForFilter;


  // determine the functions that need to be performed in the parent component
  @Output() onFilter = new EventEmitter<any>();
  @Output() onInitSourceFilter = new EventEmitter();

  // define variables - link to view objects

  // other variables
  filterItems: Array<{ name: string, id: number }> = [];

  constructor() {
  }

  ngOnInit() {
    this.onInitSourceFilter.emit();
  }

  ngOnDestroy() {

  }

  submitFilter() {
    this.filterItems.length = 0;
    for (let i = 0; i < this.sourceForFilter.length; i++) {
      this.filterItems.push({
        name: this.sourceForFilter[i].name,
        id: this.sourceForFilter[i].selectId
      });
    }
    this.onFilter.emit(this.filterItems);
  }
}
