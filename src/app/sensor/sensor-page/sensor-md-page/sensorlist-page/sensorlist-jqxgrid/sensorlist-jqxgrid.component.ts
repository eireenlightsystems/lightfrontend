import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';

import {jqxGridComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid';
import {jqxListBoxComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxlistbox';

import {Sensor} from '../../../../../shared/interfaces';


@Component({
  selector: 'app-sensorlist-jqxgrid',
  templateUrl: './sensorlist-jqxgrid.component.html',
  styleUrls: ['./sensorlist-jqxgrid.component.css']
})
export class SensorlistJqxgridComponent implements OnInit, OnDestroy, AfterViewInit {

  // variables from master component
  @Input() sensors: Sensor[];
  @Input() columnsGrid: any[];
  @Input() listBoxSource: any[];

  @Input() heightGrid: number;
  @Input() isMasterGrid: number;
  @Input() selectionmode: string;

  // determine the functions that need to be performed in the parent component
  @Output() onRefreshChildGrid = new EventEmitter<any>();

  // define variables - link to view objects
  @ViewChild('myListBox') myListBox: jqxListBoxComponent;
  @ViewChild('myGrid') myGrid: jqxGridComponent;

  // other variables
  selectSensor: Sensor = new Sensor();
  islistBoxVisible = false;

  // define the data source for the table
  source_jqxgrid: any;
  dataAdapter_jqxgrid: any;

  constructor() {
  }

  ngOnInit() {
    // define the data source for the table
    this.source_jqxgrid =
      {
        datatype: 'array',
        localdata: this.sensors,
        id: 'sensorId',

        sortcolumn: ['sensorId'],
        sortdirection: 'desc'
      };
    this.dataAdapter_jqxgrid = new jqx.dataAdapter(this.source_jqxgrid);

    this.refresh_jqxgGrid();
  }

  ngAfterViewInit() {
    this.refreshListBox();
  }

  ngOnDestroy() {
    if (this.myListBox) {
      this.myListBox.destroy();
    }
    if (this.myGrid) {
      this.myGrid.destroy();
    }
  }

  // define width of table
  getWidth(): any {
    if (document.body.offsetWidth > 1600) {
      if (this.islistBoxVisible) {
        return '85%';
      } else {
        return '99.8%';
      }
    } else if (document.body.offsetWidth > 1400) {
      if (this.islistBoxVisible) {
        return '85%';
      } else {
        return '99.8%';
      }
    } else if (document.body.offsetWidth > 1200) {
      if (this.islistBoxVisible) {
        return '80%';
      } else {
        return '99.8%';
      }
    } else if (document.body.offsetWidth > 1000) {
      if (this.islistBoxVisible) {
        return '75%';
      } else {
        return '99.8%';
      }
    } else if (document.body.offsetWidth > 800) {
      if (this.islistBoxVisible) {
        return '70%';
      } else {
        return '99.8%';
      }
    } else if (document.body.offsetWidth > 600) {
      if (this.islistBoxVisible) {
        return '65%';
      } else {
        return '99.8%';
      }
    } else {
      if (this.islistBoxVisible) {
        return '40%';
      } else {
        return '99.8%';
      }
    }
  }

  // refresh table
  refresh_jqxgGrid() {
    this.source_jqxgrid.localdata = this.sensors;
    this.myGrid.updatebounddata('data');
  }

  refresh_del() {
    this.myGrid.deleterow(this.selectSensor.sensorId);
  }

  refresh_ins(id: any, row: any) {
    this.myGrid.addrow(id, row);
  }

  refresh_upd(id: any, row: any) {
    this.myGrid.updaterow(id, row);
  }

  onRowSelect(event: any) {
    if (event.args.row) {
      this.selectSensor = event.args.row;

      // refresh child grid
      if (this.isMasterGrid) {
        this.onRefreshChildGrid.emit(this.selectSensor);
      }
    }
  }

  // table field filtering
  myListBoxOnCheckChange(event: any) {
    this.myGrid.beginupdate();
    if (event.args.checked) {
      this.myGrid.showcolumn(event.args.value);
    } else {
      this.myGrid.hidecolumn(event.args.value);
    }
    this.myGrid.endupdate();
  };

  refreshListBox() {
    this.myGrid.beginupdate();
    for (let i = 0; i < this.myListBox.attrSource.length; i++) {
      if (this.myListBox.attrSource[i].checked) {
        this.myGrid.showcolumn(this.myListBox.attrSource[i].value);
      } else {
        this.myGrid.hidecolumn(this.myListBox.attrSource[i].value);
      }
    }
    this.myGrid.endupdate();
  }
}
