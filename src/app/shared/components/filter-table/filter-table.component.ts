// angular lib
import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {isNull, isUndefined} from 'util';
import {TranslateService} from '@ngx-translate/core';
// jqwidgets
import {jqxWindowComponent} from 'jqwidgets-scripts/jqwidgets-ng/jqxwindow';
// app interfaces
// app services
// app components


@Component({
  selector: 'app-filter-table',
  templateUrl: './filter-table.component.html',
  styleUrls: ['./filter-table.component.css']
})
export class FilterTableComponent implements OnInit, OnDestroy {

  // variables from parent component
  @Input() sourceForFilter;
  @Input() isMasterGrid;
  @Input() coordinateX;
  @Input() coordinateY;

  // determine the functions that need to be performed in the parent component
  @Output() onFilter = new EventEmitter<any>();
  @Output() onDestroyFilterForm = new EventEmitter();

  // define variables - link to view objects
  @ViewChild('filtrWindow', {static: false}) filtrWindow: jqxWindowComponent;

  // other variables
  filterItems: Array<{ name: string, id: number }> = [];
  offsetWidth: any;
  offsetHeight: any;
  widthFiltrWindow: number;
  heightFiltrWindow: number;

  constructor(
    // service
    public translate: TranslateService) {
  }

  ngOnInit() {
    this.offsetWidth = document.body.offsetWidth;
    this.offsetHeight = document.body.offsetHeight;
    this.widthFiltrWindow = 400;
    this.heightFiltrWindow = 35 + (this.sourceForFilter.length * 70) + 65;
    this.getCoordinateX();
    this.getCoordinateY();
  }

  ngOnDestroy() {
    this.destroy();
  }

  destroy() {
    if (this.filtrWindow) {
      this.filtrWindow.destroy();
    }
  }

  closeDestroy() {
    this.onDestroyFilterForm.emit();
  }

  open() {
    this.filtrWindow.open();
  }

  close() {
    this.filtrWindow.close();
  }

  hide() {
    this.filtrWindow.hide();
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

  getCoordinateX() {
    if (this.widthFiltrWindow < this.offsetWidth) {
      this.coordinateX = !isNull(this.coordinateX) ? this.coordinateX : (this.offsetWidth - this.widthFiltrWindow) * 0.8;
    } else {
      this.coordinateX = 20;
    }
  }

  getCoordinateY() {
    let coordY: number;
    if (this.isMasterGrid) {
      coordY = 100;
    } else {
      coordY = this.offsetHeight - this.heightFiltrWindow - 15;
    }
    this.coordinateY = !isNull(this.coordinateY) ? this.coordinateY : coordY;
  }

  getFilterSelect() {
    let filterSelect = '';
    for (let i = 0; i < this.sourceForFilter.length; i++) {
      if (this.sourceForFilter[i].selectId !== '') {
        let selectValue: any;
        switch (this.sourceForFilter[i].type) {
          case 'jqxComboBox':
            if (!isUndefined(this.sourceForFilter[i].source[0].code)) {
              selectValue = this.sourceForFilter[i].source.find(
                (one: any) => one.id === +this.sourceForFilter[i].selectId).code;
            } else {
              if (!isUndefined(this.sourceForFilter[i].source[0].name)) {
                selectValue = this.sourceForFilter[i].source.find(
                  (one: any) => one.id === +this.sourceForFilter[i].selectId).name;
              } else {
                selectValue = this.sourceForFilter[i].selectId;
              }
            }
            break;
          case 'jqxDateTimeInput':
            selectValue = this.sourceForFilter[i].defaultValue;
            break;
          case 'ngxSuggestionAddress':
            selectValue = this.sourceForFilter[i].defaultValue;
            break;
          default:
            break;
        }
        if (filterSelect !== '') {
          filterSelect = filterSelect + ' > ' + this.sourceForFilter[i].placeHolder + ' ' + selectValue;
        } else {
          filterSelect = this.sourceForFilter[i].placeHolder + ' ' + selectValue;
        }
      }
    }
    return filterSelect;
  }
}
