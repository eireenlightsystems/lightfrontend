// angular lib
import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {isUndefined} from 'util';
import {TranslateService} from '@ngx-translate/core';
// jqwidgets
import {jqxPivotGridComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxpivotgrid';
import {jqxPivotDesignerComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxpivotdesigner';
// app interfaces
// app services
// app components

@Component({
  selector: 'app-jqxpivotgrid',
  templateUrl: './jqxpivotgrid.component.html',
  styleUrls: ['./jqxpivotgrid.component.css']
})
export class JqxpivotgridComponent implements OnInit, AfterViewInit, OnDestroy {

  // variables from parent component

  // determine the functions that need to be performed in the parent component

  // define variables - link to view objects
  @ViewChild('pivotGrid', {static: false}) pivotGrid: jqxPivotGridComponent;
  @ViewChild('pivotDesigner', {static: false}) pivotDesigner: jqxPivotDesignerComponent;

  // other variables
  pivotDataSource: null;


  constructor(
    // service
    public translate: TranslateService,
  ) {
    this.pivotDataSource = this.createPivotDataSource();
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    let pivotGridComponent = this.pivotGrid;
    let pivotGridInstance = pivotGridComponent.getInstance();

    // pivotDesigner
    // this.pivotDesigner.setOptions({
    //   theme: 'material'
    // });
    this.pivotDesigner.target(pivotGridInstance);
    this.pivotDesigner.refresh();

    // pivotGrid
    this.pivotGrid.setOptions({
      theme: 'material'
    });
  }

  ngOnDestroy(): void {

  }

  getWidth(): any {
    if (document.body.offsetWidth < 400) {
      return '50%';
    }
    return '100%';
  }

  createPivotDataSource(
    reportSource: any = [],
    currDatafields: any = [],
    currRows: any = [],
    currColumns: any = [],
    currFilters: any = [],
    currValues: any = [],
  ): any {
    // create a data source and data adapter
    let source =
      {
        localdata: reportSource,
        datatype: 'array',
        datafields: currDatafields
      };
    let dataAdapter = new jqx.dataAdapter(source);
    dataAdapter.dataBind();

    // create a pivot data source from the dataAdapter
    let pivotDataSource = new jqx.pivot(
      dataAdapter,
      {
        pivotValuesOnRows: true,
        rows: currRows,
        columns: currColumns,
        filters: currFilters,
        values: currValues
      }
    );
    return pivotDataSource;
  }

  expandRow() {
    for (let i = 0; i < this.pivotGrid.getPivotRows().items.length; i++) {
      this.pivotGrid.getPivotRows().items[i].expand();
    }
    this.pivotGrid.refresh();
  }

  collapseRow() {
    for (let i = 0; i < this.pivotGrid.getPivotRows().items.length; i++) {
      this.pivotGrid.getPivotRows().items[i].collapse();
    }
    this.pivotGrid.refresh();
  }
}
