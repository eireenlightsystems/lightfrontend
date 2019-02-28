import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {MaterialService} from "../../../../../shared/classes/material.service";
import {jqxWindowComponent} from "jqwidgets-scripts/jqwidgets-ts/angular_jqxwindow";
import {jqxGridComponent} from "jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid";

import {Fixture} from "../../../../../shared/models/fixture";
import {FilterFixture} from "../../../../../shared/interfaces";
import {FixtureService} from "../../../../../shared/services/fixture/fixture.service";


const STEP = 1000000000000


@Component({
  selector: 'app-fixturelink-form',
  templateUrl: './fixturelink-form.component.html',
  styleUrls: ['./fixturelink-form.component.css']
})
export class FixturelinkFormComponent implements OnInit, OnDestroy {

  //variables from master component
  @Input() columns: any[]
  @Input() id_node_select: number

  //determine the functions that need to be performed in the parent component
  @Output() onSaveLinkwinBtn = new EventEmitter()

  //define variables - link to view objects
  @ViewChild('linkWindow') linkWindow: jqxWindowComponent
  @ViewChild('myGrid') myGrid: jqxGridComponent

  //other variables
  saveFixture: Fixture = new Fixture()
  rowcount: number = 0
  fixtures: Fixture[] = []
  // id_fixture: number = 0
  filter: FilterFixture = {
    id_geograph: -1,
    id_owner: -1,
    id_fixture_type: -1,
    id_substation: -1,
    id_mode: -1,

    id_contract: -1,
    id_node: 1
  }
  oSub: Subscription
  offset = 0
  limit = STEP

  constructor(private fixtureService: FixtureService) { }

  ngOnInit() {
    this.getAll()
  }

  ngOnDestroy(): void {
    this.oSub.unsubscribe()
  }

  //refresh table
  refreshGrid() {
    if (this.fixtures && this.fixtures.length > 0 && this.rowcount !== this.fixtures.length) {
      this.source_jqxgrid.localdata = this.fixtures;
      this.rowcount = this.fixtures.length;
      this.myGrid.updatebounddata('cells');// passing `cells` to the `updatebounddata` method will refresh only the cells values when the new rows count is equal to the previous rows count.
    }
  }

  getAll() {
    const params = Object.assign({}, {
        offset: this.offset,
        limit: this.limit
      },
      this.filter)

    this.oSub = this.fixtureService.getAll(params).subscribe(fixtures => {
      this.fixtures = this.fixtures.concat(fixtures)
      this.refreshGrid();
    })
  }

  //define the data source for the table
  source_jqxgrid: any =
    {
      datatype: 'array',
      localdata: this.fixtures,
      id: 'id_fixture',

      sortcolumn: ['id_fixture'],
      sortdirection: 'desc'
    };
  dataAdapter_jqxgrid: any = new jqx.dataAdapter(this.source_jqxgrid);

  saveBtn() {
    for(var i=0; i < this.myGrid.widgetObject.selectedrowindexes.length; i++){
      this.saveFixture = this.source_jqxgrid.localdata[this.myGrid.widgetObject.selectedrowindexes[i]]
      this.saveFixture.id_node = this.id_node_select
      this.oSub = this.fixtureService.set_id_node(this.saveFixture).subscribe(
        response => {
          // MaterialService.toast(`Светильник id = ${response.id_fixture} привязан к узлу id = ${this.id_node_select}.`)
        },
        error => MaterialService.toast(error.error.message),
        () => {
          //refresh table
          this.onSaveLinkwinBtn.emit()
        }
      )
    }
    this.hideWindow()
  }

  cancelBtn() {
    this.hideWindow()
  }

  openWindow() {
    this.linkWindow.open()
  }

  destroyWindow() {
    this.linkWindow.destroy()
  }

  hideWindow() {
    this.linkWindow.hide();
  }

  positionWindow(coord: any) {
    this.linkWindow.position({x: coord.x, y: coord.y})
  }
}
