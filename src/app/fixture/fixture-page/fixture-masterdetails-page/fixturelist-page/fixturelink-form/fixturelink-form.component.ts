import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {MaterialService} from '../../../../../shared/classes/material.service';

import {jqxWindowComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxwindow';
import {jqxGridComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid';

import {FixtureService} from '../../../../../shared/services/fixture/fixture.service';
import {Fixture} from '../../../../../shared/interfaces';


const STEP = 1000000000000;


@Component({
  selector: 'app-fixturelink-form',
  templateUrl: './fixturelink-form.component.html',
  styleUrls: ['./fixturelink-form.component.css']
})
export class FixturelinkFormComponent implements OnInit, OnDestroy {

  // variables from master component
  @Input() columns: any[];
  @Input() selectNodeId: number;

  // determine the functions that need to be performed in the parent component
  @Output() onSaveLinkwinBtn = new EventEmitter();

  // define variables - link to view objects
  @ViewChild('linkWindow') linkWindow: jqxWindowComponent;
  @ViewChild('myGrid') myGrid: jqxGridComponent;

  // other variables
  fixtures: Fixture[] = [];
  oSub: Subscription;
  offset = 0;
  limit = STEP;

  // define the data source for the table
  source_jqxgrid: any =
    {
      datatype: 'array',
      localdata: this.fixtures,
      id: 'fixtureId',

      sortcolumn: ['fixtureId'],
      sortdirection: 'desc'
    };
  dataAdapter_jqxgrid: any = new jqx.dataAdapter(this.source_jqxgrid);


  constructor(private fixtureService: FixtureService) {
  }

  ngOnInit() {
    // this.getAll();
    this.myGrid.selectedrowindexes([]);
  }

  ngOnDestroy(): void {
    if (this.oSub) {
      this.oSub.unsubscribe();
    }
  }

  // refresh table
  refreshGrid() {
    this.source_jqxgrid.localdata = this.fixtures;
    this.myGrid.selectedrowindexes([]);
    this.myGrid.updatebounddata('data');

    this.linkWindow.open();
  }

  getAll() {
    this.oSub = this.fixtureService.getAll({nodeId: 1}).subscribe(fixtures => {
      this.fixtures = fixtures;
      this.refreshGrid();
    });
  }

  saveBtn() {
    const fixtureIds = [];
    for (let i = 0; i < this.myGrid.widgetObject.selectedrowindexes.length; i++) {
      fixtureIds[i] = this.source_jqxgrid.localdata[this.myGrid.widgetObject.selectedrowindexes[i]].fixtureId;
    }

    this.oSub = this.fixtureService.setNodeId(this.selectNodeId, fixtureIds).subscribe(
      response => {
        MaterialService.toast('Светильники привязаны к столбу!');
      },
      error => {
        MaterialService.toast(error.error.message);
      },
      () => {
        // refresh table
        this.onSaveLinkwinBtn.emit();

        this.hideWindow();
      }
    );
  }

  cancelBtn() {
    this.hideWindow();
  }

  openWindow() {
    this.getAll();
  }

  destroyWindow() {
    this.linkWindow.destroy();
  }

  hideWindow() {
    this.linkWindow.hide();
  }

  positionWindow(coord: any) {
    this.linkWindow.position({x: coord.x, y: coord.y});
  }
}
