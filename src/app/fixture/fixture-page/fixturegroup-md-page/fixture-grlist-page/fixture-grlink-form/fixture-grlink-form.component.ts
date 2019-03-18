import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {jqxWindowComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxwindow';
import {jqxGridComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid';

import {Fixture} from '../../../../../shared/interfaces';
import {FixtureService} from '../../../../../shared/services/fixture/fixture.service';
import {MaterialService} from '../../../../../shared/classes/material.service';


const STEP = 1000000000000;


@Component({
  selector: 'app-fixture-grlink-form',
  templateUrl: './fixture-grlink-form.component.html',
  styleUrls: ['./fixture-grlink-form.component.css']
})
export class FixtureGrlinkFormComponent implements OnInit, OnDestroy {

  // variables from master component
  @Input() columns: any[];
  @Input() fixtureGroupId: number;

  // determine the functions that need to be performed in the parent component
  @Output() onSaveLinkwinBtn = new EventEmitter();

  // define variables - link to view objects
  @ViewChild('linkWindow') linkWindow: jqxWindowComponent;
  @ViewChild('myGrid') myGrid: jqxGridComponent;

  // other variables
  rowcount = 0;
  fixtures: Fixture[] = [];
  oSub: Subscription;
  offset = 0;
  limit = STEP;

  // define the data source for the table
  source_jqxgrid: any =
    {
      datatype: 'array',
      localdata: this.fixtures,
      id: 'id_fixture',

      sortcolumn: ['id_fixture'],
      sortdirection: 'desc'
    };
  dataAdapter_jqxgrid: any = new jqx.dataAdapter(this.source_jqxgrid);


  constructor(private fixtureService: FixtureService) {
  }

  ngOnInit() {
    // this.getAll(this.fixtureGroupId);
  }

  ngOnDestroy(): void {
    if (this.oSub) {
      this.oSub.unsubscribe();
    }
    if (this.linkWindow) {
      this.linkWindow.destroy();
    }
    if (this.myGrid) {
      this.myGrid.destroy();
    }
  }

  // refresh table
  refreshGrid() {
    if (this.fixtures && this.fixtures.length > 0) {
      this.source_jqxgrid.localdata = this.fixtures;
      this.rowcount = this.fixtures.length;
      this.myGrid.selectedrowindexes([]);
      this.myGrid.updatebounddata('data');
    }
    this.openWindow();
  }

  getAll() {
    this.oSub = this.fixtureService.getFixtureNotInThisGroup({fixtureGroupId: this.fixtureGroupId}).subscribe(fixtures => {
      this.fixtures = fixtures;
      this.refreshGrid();
    });
  }

  saveBtn() {
    const fixtureIds = [];
    for (let i = 0; i < this.myGrid.widgetObject.selectedrowindexes.length; i++) {
      fixtureIds[i] = this.source_jqxgrid.localdata[this.myGrid.widgetObject.selectedrowindexes[i]].id_fixture;
    }
    this.oSub = this.fixtureService.setFixtureInGroup(this.fixtureGroupId, fixtureIds).subscribe(
      response => {
        MaterialService.toast('Светильники добавлены в группу!');
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
    this.linkWindow.open();
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
