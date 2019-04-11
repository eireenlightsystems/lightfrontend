import {Component, EventEmitter, Input, OnInit, OnDestroy, Output, ViewChild} from '@angular/core';
import {jqxWindowComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxwindow';
import {jqxInputComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxinput';
import {jqxDropDownListComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxdropdownlist';
import {Subscription} from 'rxjs';
import {MaterialService} from '../../../../../shared/classes/material.service';

import {
  Contract,
  EquipmentType,
  HeightType,
  Installer,
  Substation
} from '../../../../../shared/interfaces';
import {Fixture} from '../../../../../shared/models/fixture';
import {FixtureService} from '../../../../../shared/services/fixture/fixture.service';

@Component({
  selector: 'app-fixtureedit-form',
  templateUrl: './fixtureedit-form.component.html',
  styleUrls: ['./fixtureedit-form.component.css']
})
export class FixtureeditFormComponent implements OnInit, OnDestroy {

  // variables from master component
  @Input() contractFixtures: Contract[];
  @Input() fixtureTypes: EquipmentType[];
  @Input() substations: Substation[];
  @Input() installers: Installer[];
  @Input() heightTypes: HeightType[];

  // determine the functions that need to be performed in the parent component
  @Output() onSaveEditwinBtn = new EventEmitter();

  // define variables - link to view objects
  @ViewChild('editWindow') editWindow: jqxWindowComponent;
  @ViewChild('contractId') contractId: jqxInputComponent;
  @ViewChild('fixtureTypeId') fixtureTypeId: jqxInputComponent;
  @ViewChild('installerId') installerId: jqxInputComponent;
  @ViewChild('substationId') substationId: jqxInputComponent;
  @ViewChild('heightTypeId') heightTypeId: jqxDropDownListComponent;

  // define variables for drop-down lists in the edit form
  source_contract: any;
  dataAdapter_contract: any;
  source_fixtureType: any;
  dataAdapter_fixtureType: any;
  source_substation: any;
  dataAdapter_substation: any;
  source_installer: any;
  dataAdapter_installer: any;
  source_heightType: any;
  dataAdapter_heightType: any;

  contractId_index = 0;
  fixtureTypeId_index = 0;
  installerId_index = 0;
  substationId_index = 0;
  heightTypeId_index = 0;

  // other variables
  saveFixture: Fixture = new Fixture();
  oSub: Subscription;
  typeEditWindow = '';
  selectNodeId: number;


  constructor(private fixtureService: FixtureService) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.oSub) {
      this.oSub.unsubscribe();
    }
  }

  // updating data sources for drop-down lists in the form
  refresh_refbook() {
    this.source_contract =
      {
        datatype: 'array',
        localdata: this.contractFixtures,
        id: 'id',
      };
    this.dataAdapter_contract = new jqx.dataAdapter(this.source_contract);

    this.source_fixtureType =
      {
        datatype: 'array',
        localdata: this.fixtureTypes,
        id: 'id',
      };
    this.dataAdapter_fixtureType = new jqx.dataAdapter(this.source_fixtureType);

    this.source_installer =
      {
        datatype: 'array',
        localdata: this.installers,
        id: 'id',
      };
    this.dataAdapter_installer = new jqx.dataAdapter(this.source_installer);

    this.source_substation =
      {
        datatype: 'array',
        localdata: this.substations,
        id: 'id',
      };
    this.dataAdapter_substation = new jqx.dataAdapter(this.source_substation);

    this.source_heightType =
      {
        datatype: 'array',
        localdata: this.heightTypes,
        id: 'id',
      };
    this.dataAdapter_heightType = new jqx.dataAdapter(this.source_heightType);
  }

  // define default values for the form
  define_defaultvalues(saveFixture: Fixture) {
    if (this.typeEditWindow === 'upd') {
      this.saveFixture = saveFixture;
      // determine the desired positions in the drop-down lists
      for (let i = 0; i < this.contractFixtures.length; i++) {
        if (this.contractFixtures[i].id === this.saveFixture.contractId) {
          this.contractId_index = i;
          break;
        }
      }
      for (let i = 0; i < this.fixtureTypes.length; i++) {
        if (this.fixtureTypes[i].id === this.saveFixture.fixtureTypeId) {
          this.fixtureTypeId_index = i;
          break;
        }
      }
      for (let i = 0; i < this.installers.length; i++) {
        if (this.installers[i].id === this.saveFixture.installerId) {
          this.installerId_index = i;
          break;
        }
      }
      for (let i = 0; i < this.substations.length; i++) {
        if (this.substations[i].id === this.saveFixture.substationId) {
          this.substationId_index = i;
          break;
        }
      }
      for (let i = 0; i < this.heightTypes.length; i++) {
        if (this.heightTypes[i].id === this.saveFixture.heightTypeId) {
          this.heightTypeId_index = i;
          break;
        }
      }
    }
    if (this.typeEditWindow === 'ins') {
      this.contractId_index = 0;
      this.fixtureTypeId_index = 0;
      this.installerId_index = 0;
      this.substationId_index = 0;
      this.heightTypeId_index = 0;
      this.saveFixture.fixtureId = 0;
      this.saveFixture.serialNumber = 'пусто';
      this.saveFixture.comment = 'пусто';
    }
  }

  // perform insert/update fixture
  saveBtn() {
    this.saveFixture.contractId = this.contractId.val();
    this.saveFixture.fixtureTypeId = this.fixtureTypeId.val();
    this.saveFixture.installerId = this.installerId.val();
    this.saveFixture.substationId = this.substationId.val();
    this.saveFixture.heightTypeId = this.heightTypeId.val();

    if (this.typeEditWindow === 'ins') {

      this.saveFixture.nodeId = this.selectNodeId <= 0 ? 1 : this.selectNodeId;

      this.oSub = this.fixtureService.ins(this.saveFixture).subscribe(
        response => {
          this.saveFixture.fixtureId = +response;
          MaterialService.toast(`Светильник c id = ${this.saveFixture.fixtureId} был добавлен.`);
        },
        error => MaterialService.toast(error.error.message),
        () => {
          // close edit window
          this.hideWindow();
          // update data source
          this.onSaveEditwinBtn.emit();
        }
      );
    }
    if (this.typeEditWindow === 'upd') {
      this.oSub = this.fixtureService.upd(this.saveFixture).subscribe(
        response => {
          MaterialService.toast(`Светильник c id = ${this.saveFixture.fixtureId} был обновлен.`);
        },
        error => MaterialService.toast(error.error.message),
        () => {
          // close edit window
          this.hideWindow();
          // update data source
          this.onSaveEditwinBtn.emit();
        }
      );
    }
  }

  cancelBtn() {
    this.hideWindow();
  }

  openWindow(saveFixture: Fixture, selectNodeId: number, typeEditWindow: string) {
    this.typeEditWindow = typeEditWindow;
    this.selectNodeId = selectNodeId;
    this.refresh_refbook();
    this.define_defaultvalues(saveFixture);
    this.editWindow.open();
  }

  destroyWindow() {
    this.editWindow.destroy();
  }

  hideWindow() {
    this.editWindow.hide();
  }

  positionWindow(coord: any) {
    this.editWindow.position({x: coord.x, y: coord.y});
  }

}
