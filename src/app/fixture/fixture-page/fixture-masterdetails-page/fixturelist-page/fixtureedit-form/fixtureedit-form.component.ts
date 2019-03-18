import {Component, EventEmitter, Input, OnInit, OnDestroy, Output, ViewChild} from '@angular/core';
import {jqxWindowComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxwindow';
import {jqxInputComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxinput';
import {jqxDropDownListComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxdropdownlist';
import {Subscription} from 'rxjs';
import {MaterialService} from '../../../../../shared/classes/material.service';

import {
  Contract,
  FixtureType,
  Geograph,
  HeightType,
  Installer,
  Owner_fixture,
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
  @Input() geographs: Geograph[];
  @Input() owner_fixtures: Owner_fixture[];
  @Input() fixtureTypes: FixtureType[];
  @Input() substations: Substation[];
  @Input() contract_fixtures: Contract[];
  @Input() installers: Installer[];
  @Input() heightTypes: HeightType[];

  // determine the functions that need to be performed in the parent component
  @Output() onSaveEditwinBtn = new EventEmitter();

  // define variables - link to view objects
  @ViewChild('editWindow') editWindow: jqxWindowComponent;
  @ViewChild('id_contract') id_contract: jqxInputComponent;
  @ViewChild('id_geograph') id_geograph: jqxInputComponent;
  @ViewChild('id_fixture_type') id_fixtureType: jqxInputComponent;
  @ViewChild('id_owner') id_owner: jqxInputComponent;
  @ViewChild('id_installer') id_installer: jqxInputComponent;
  @ViewChild('id_substation') id_substation: jqxInputComponent;
  @ViewChild('id_height_type') id_heightType: jqxDropDownListComponent;
  @ViewChild('numline') numline: any;
  @ViewChild('side') side: any;

  // define variables for drop-down lists in the edit form
  source_geogr: any;
  dataAdapter_geogr: any;
  source_owner: any;
  dataAdapter_owner: any;
  source_fixtureType: any;
  dataAdapter_fixtureType: any;
  source_substation: any;
  dataAdapter_substation: any;
  source_contract: any;
  dataAdapter_contract: any;
  source_installer: any;
  dataAdapter_installer: any;
  source_heightType: any;
  dataAdapter_heightType: any;
  source_numline: any;
  dataAdapter_numline: any;
  source_side: any;
  dataAdapter_side: any;

  id_contract_index = 0;
  id_geograph_index = 0;
  id_fixture_type_index = 0;
  id_owner_index = 0;
  id_installer_index = 0;
  id_substation_index = 0;
  id_height_type_index = 0;
  id_numline_index = 0;
  id_side_index = 0;

  // other variables
  saveFixture: Fixture = new Fixture();
  oSub: Subscription;
  typeEditWindow = '';
  id_node_select: number;


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
        localdata: this.contract_fixtures,
        id: 'id_contract',
      };
    this.dataAdapter_contract = new jqx.dataAdapter(this.source_contract);

    this.source_geogr =
      {
        datatype: 'array',
        localdata: this.geographs,
        id: 'id_geograph',
      };
    this.dataAdapter_geogr = new jqx.dataAdapter(this.source_geogr);

    this.source_fixtureType =
      {
        datatype: 'array',
        localdata: this.fixtureTypes,
        id: 'id_fixture_type',
      };
    this.dataAdapter_fixtureType = new jqx.dataAdapter(this.source_fixtureType);

    this.source_owner =
      {
        datatype: 'array',
        localdata: this.owner_fixtures,
        id: 'id_owner',
      };
    this.dataAdapter_owner = new jqx.dataAdapter(this.source_owner);

    this.source_installer =
      {
        datatype: 'array',
        localdata: this.installers,
        id: 'id_installer',
      };
    this.dataAdapter_installer = new jqx.dataAdapter(this.source_installer);

    this.source_substation =
      {
        datatype: 'array',
        localdata: this.substations,
        id: 'id_substation',
      };
    this.dataAdapter_substation = new jqx.dataAdapter(this.source_substation);

    this.source_heightType =
      {
        datatype: 'array',
        localdata: this.heightTypes,
        id: 'id_height_type',
      };
    this.dataAdapter_heightType = new jqx.dataAdapter(this.source_heightType);

    this.source_numline =
      {
        datatype: 'array',
        localdata: [
          {
            numline: 1
          },
          {
            numline: 2
          }
        ],
        id: 'numline',
      };
    this.dataAdapter_numline = new jqx.dataAdapter(this.source_numline);

    this.source_side =
      {
        datatype: 'array',
        localdata: [
          {
            side: 'r'
          },
          {
            side: 'l'
          }
        ],
        id: 'side',
      };
    this.dataAdapter_side = new jqx.dataAdapter(this.source_side);

  }

  // define default values for the form
  define_defaultvalues(saveFixture: Fixture) {
    if (this.typeEditWindow === 'upd') {
      this.saveFixture = saveFixture;
      // determine the desired positions in the drop-down lists
      for (let i = 0; i < this.contract_fixtures.length; i++) {
        if (this.contract_fixtures[i].id_contract === this.saveFixture.id_contract) {
          this.id_contract_index = i;
          break;
        }
      }
      for (let i = 0; i < this.fixtureTypes.length; i++) {
        if (this.fixtureTypes[i].id_fixture_type === this.saveFixture.id_fixture_type) {
          this.id_fixture_type_index = i;
          break;
        }
      }
      for (let i = 0; i < this.geographs.length; i++) {
        if (this.geographs[i].id_geograph === this.saveFixture.id_geograph) {
          this.id_geograph_index = i;
          break;
        }
      }
      for (let i = 0; i < this.installers.length; i++) {
        if (this.installers[i].id_installer === this.saveFixture.id_installer) {
          this.id_installer_index = i;
          break;
        }
      }
      for (let i = 0; i < this.substations.length; i++) {
        if (this.substations[i].id_substation === this.saveFixture.id_substation) {
          this.id_substation_index = i;
          break;
        }
      }
      for (let i = 0; i < this.heightTypes.length; i++) {
        if (this.heightTypes[i].id_height_type === this.saveFixture.id_height_type) {
          this.id_height_type_index = i;
          break;
        }
      }
      for (let i = 0; i < this.numline.length; i++) {
        if (this.numline[i].numline === this.saveFixture.numline) {
          this.id_numline_index = i;
          break;
        }
      }
      for (let i = 0; i < this.side.length; i++) {
        if (this.side[i].side === this.saveFixture.side) {
          this.id_side_index = i;
          break;
        }
      }
    }
    if (this.typeEditWindow === 'ins') {
      this.id_contract_index = 0;
      this.id_geograph_index = 0;
      this.id_fixture_type_index = 0;
      this.id_owner_index = 0;
      this.id_installer_index = 0;
      this.id_substation_index = 0;
      this.id_height_type_index = 0;
      this.id_numline_index = 0;
      this.id_side_index = 0;

      this.saveFixture.id_fixture = 0;
      this.saveFixture.flg_chief = false;
      this.saveFixture.price = 0;
      this.saveFixture.comments = 'пусто';
    }
  }

  // perform insert/update fixture
  saveBtn() {
    this.saveFixture.id_contract = this.id_contract.val();
    this.saveFixture.id_fixture_type = this.id_fixtureType.val();
    this.saveFixture.id_geograph = this.id_geograph.val();
    this.saveFixture.id_installer = this.id_installer.val();
    this.saveFixture.id_substation = this.id_substation.val();
    this.saveFixture.id_height_type = this.id_heightType.val();
    this.saveFixture.numline = this.numline.val();
    this.saveFixture.side = this.side.val();

    if (this.typeEditWindow === 'ins') {

      this.saveFixture.id_node = this.id_node_select <= 0 ? 1 : this.id_node_select;
      // if (!this.saveFixture.flg_chief) this.saveFixture.flg_chief = false;

      this.oSub = this.fixtureService.ins(this.saveFixture).subscribe(
        response => {
          this.saveFixture.id_fixture = response.id_fixture;
          MaterialService.toast(`Светильник c id = ${response.id_fixture} был добавлен.`);
        },
        error => MaterialService.toast(error.message),
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
          MaterialService.toast(`Светильник c id = ${response.id_fixture} был обновлен.`);
        },
        response => MaterialService.toast(response.error.message),
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

  openWindow(saveFixture: Fixture, id_node_select: number, typeEditWindow: string) {
    this.typeEditWindow = typeEditWindow;
    this.id_node_select = id_node_select;
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
