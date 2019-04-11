import {Component, EventEmitter, Input, OnInit, OnDestroy, Output, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {MaterialService} from '../../../../../shared/classes/material.service';
import {jqxWindowComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxwindow';
import {jqxInputComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxinput';

import {Owner, FixtureGroupType, FixtureGroup} from '../../../../../shared/interfaces';
import {FixtureGroupService} from '../../../../../shared/services/fixture/fixtureGroup.service';

@Component({
  selector: 'app-fixture-gredit-form',
  templateUrl: './fixture-gredit-form.component.html',
  styleUrls: ['./fixture-gredit-form.component.css']
})
export class FixtureGreditFormComponent implements OnInit, OnDestroy {

  // variables from master component
  @Input() fixtureGroupTypes: FixtureGroupType[];
  @Input() fixtureGroupOwners: Owner[];

  // determine the functions that need to be performed in the parent component
  @Output() onInsEditwinBtn = new EventEmitter();
  @Output() onUpdEditwinBtn = new EventEmitter();

  // define variables - link to view objects
  @ViewChild('editWindow') editWindow: jqxWindowComponent;
  @ViewChild('fixtureGroupTypeId') fixtureGroupTypeId: jqxInputComponent;
  @ViewChild('fixtureGroupOwnerId') fixtureGroupOwnerId: jqxInputComponent;

  // define variables for drop-down lists in the edit form
  dataAdapter_fixtureGroupType: any;
  source_fixtureGroupType: any;
  dataAdapter_fixtureGroupOwner: any;
  source_fixtureGroupOwner: any;

  fixtureGroupTypeId_index = 0;
  fixtureGroupOwnerId_index = 0;

  // other variables
  saveFixtureGroup: FixtureGroup = new FixtureGroup();
  oSub: Subscription;
  typeEditWindow = '';


  constructor(private fixtureGroupService: FixtureGroupService) {
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
    this.source_fixtureGroupType =
      {
        datatype: 'array',
        localdata: this.fixtureGroupTypes,
        id: 'id',
      };
    this.dataAdapter_fixtureGroupType = new jqx.dataAdapter(this.source_fixtureGroupType);

    this.source_fixtureGroupOwner =
      {
        datatype: 'array',
        localdata: this.fixtureGroupOwners,
        id: 'id',
      };
    this.dataAdapter_fixtureGroupOwner = new jqx.dataAdapter(this.source_fixtureGroupOwner);
  }

  // define default values for the form
  define_defaultvalues(saveFixtureGroup: FixtureGroup) {
    if (this.typeEditWindow === 'upd') {
      this.saveFixtureGroup = saveFixtureGroup;
      // determine the desired positions in the drop-down lists
      for (let i = 0; i < this.fixtureGroupTypes.length; i++) {
        if (this.fixtureGroupTypes[i].id === this.saveFixtureGroup.fixtureGroupTypeId) {
          this.fixtureGroupTypeId_index = i;
          break;
        }
      }
      for (let i = 0; i < this.fixtureGroupOwners.length; i++) {
        if (this.fixtureGroupOwners[i].id === this.saveFixtureGroup.ownerId) {
          this.fixtureGroupOwnerId_index = i;
          break;
        }
      }
    }
    if (this.typeEditWindow === 'ins') {
      this.fixtureGroupTypeId_index = 0;
      this.fixtureGroupOwnerId_index = 0;

      this.saveFixtureGroup.fixtureGroupId = 0;
      this.saveFixtureGroup.fixtureGroupName = 'пусто';
    }
  }

  // perform insert/update fixture
  saveBtn() {
    this.saveFixtureGroup.fixtureGroupTypeId = this.fixtureGroupTypeId.val();
    this.saveFixtureGroup.ownerId = this.fixtureGroupOwnerId.val();

    if (this.typeEditWindow === 'ins') {
      this.oSub = this.fixtureGroupService.ins(this.saveFixtureGroup).subscribe(
        response => {
          this.saveFixtureGroup.fixtureGroupId = +response;
          MaterialService.toast(`Группа светильников c id = ${response} была добавлена.`);
        },
        error => MaterialService.toast(error.error.message),
        () => {
          // close edit window
          this.hideWindow();
          // update data source
          this.onInsEditwinBtn.emit(this.saveFixtureGroup);
        }
      );
    }
    if (this.typeEditWindow === 'upd') {
      this.oSub = this.fixtureGroupService.upd(this.saveFixtureGroup).subscribe(
        response => {
          MaterialService.toast(`Группа светильников c id = ${this.saveFixtureGroup.fixtureGroupId} была обновлена.`);
        },
        response => MaterialService.toast(response.error.message),
        () => {
          // close edit window
          this.hideWindow();
          // update data source
          this.onUpdEditwinBtn.emit();
        }
      );
    }
  }

  cancelBtn() {
    this.hideWindow();
  }

  openWindow(saveFixtureGroup: FixtureGroup, typeEditWindow: string) {
    this.typeEditWindow = typeEditWindow;
    this.refresh_refbook();
    this.define_defaultvalues(saveFixtureGroup);
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
