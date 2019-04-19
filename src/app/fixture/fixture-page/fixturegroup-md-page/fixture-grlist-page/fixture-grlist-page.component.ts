import {Component, Input, OnInit, OnDestroy, ViewChild, EventEmitter, Output, AfterViewInit} from '@angular/core';
import {Subscription} from 'rxjs/index';
import {isUndefined} from 'util';
import {MaterialService} from '../../../../shared/classes/material.service';

import {
  FilterFixtureGroup,
  Fixture,
  FixtureGroup,
  Owner,
  FixtureGroupType,
  SourceForFilter, SettingButtonPanel
} from '../../../../shared/interfaces';
import {FixtureGroupService} from '../../../../shared/services/fixture/fixtureGroup.service';
import {FixtureGrlistJqxgridComponent} from './fixture-grlist-jqxgrid/fixture-grlist-jqxgrid.component';
import {FixturecomeditFormComponent} from '../../fixture-masterdetails-page/fixturecomlist-page/fixturecomedit-form/fixturecomedit-form.component';
import {FixturecomeditSwitchoffFormComponent} from '../../fixture-masterdetails-page/fixturecomlist-page/fixturecomedit-switchoff-form/fixturecomedit-switchoff-form.component';


const STEP = 1000000000000;


@Component({
  selector: 'app-fixture-grlist-page',
  templateUrl: './fixture-grlist-page.component.html',
  styleUrls: ['./fixture-grlist-page.component.css']
})
export class FixtureGrlistPageComponent implements OnInit, OnDestroy, AfterViewInit {

  // variables from master component
  @Input() fixtures: Fixture[];
  @Input() fixtureGroupTypes: FixtureGroupType[];
  @Input() fixtureGroupOwners: Owner[];

  @Input() widthGrid: number;
  @Input() heightGrid: number;
  @Input() selectionmode: string;
  @Input() isMasterGrid: boolean;

  @Input() settingButtonPanel: SettingButtonPanel;

  // determine the functions that need to be performed in the parent component
  @Output() onRefreshChildGrid = new EventEmitter<number>();
  @Output() onRefreshChild_ChildGrid = new EventEmitter<number>();

  // define variables - link to view objects
  @ViewChild('fixtureGrlistJqxgridComponent') fixtureGrlistJqxgridComponent: FixtureGrlistJqxgridComponent;
  @ViewChild('editSwitchOnWindow') editSwitchOnWindow: FixturecomeditFormComponent;
  @ViewChild('editSwitchOffWindow') editSwitchOffWindow: FixturecomeditSwitchoffFormComponent;

  // other variables
  fixtureGroups: FixtureGroup[] = [];
  filter: FilterFixtureGroup = {
    ownerId: '',
    fixtureGroupTypeId: '',
  };
  sourceForFilter: SourceForFilter[];
  fixtureGroupId: number;
  oSub: Subscription;
  isFilterVisible = false;
  //
  offset = 0;
  limit = STEP;
  //
  loading = false;
  reloading = false;
  noMoreFixtures = false;


  constructor(private fixtureGroupService: FixtureGroupService) {
  }

  ngOnInit() {
    // Definde filter
    this.sourceForFilter = [
      {
        name: 'fixtureGroupOwners',
        type: 'jqxComboBox',
        source: this.fixtureGroupOwners,
        theme: 'material',
        width: '250',
        height: '43',
        placeHolder: 'Владелец:',
        displayMember: 'nameField',
        valueMember: 'id',
        defaultValue: '',
        selectId: ''
      },
      {
        name: 'fixtureGroupTypes',
        type: 'jqxComboBox',
        source: this.fixtureGroupTypes,
        theme: 'material',
        width: '250',
        height: '43',
        placeHolder: 'Тип группы:',
        displayMember: 'nameField',
        valueMember: 'id',
        defaultValue: '',
        selectId: ''
      }
    ];

    this.reloading = true;
  }

  ngAfterViewInit(): void {
    this.refreshGrid();
  }

  ngOnDestroy(): void {
    if (this.oSub) {
      this.oSub.unsubscribe();
    }
  }

  refreshGrid() {
    this.fixtureGroups = [];
    this.getAll();
    this.reloading = true;
    this.fixtureGroupId = 0;
    if (!isUndefined(this.fixtureGrlistJqxgridComponent)) {
      this.fixtureGrlistJqxgridComponent.refresh_jqxgGrid();
    }

    // if this.nodes id master grid, then we need refresh child grid
    if (this.isMasterGrid) {
      this.refreshChildGrid(this.fixtureGroupId);
    }
  }

  refreshChildGrid(fixtureGroupId: number) {
    this.fixtureGroupId = fixtureGroupId;
    // refresh child grid
    this.onRefreshChildGrid.emit(fixtureGroupId);
  }

  getAll() {

    // Disabled/available buttons

    const params = Object.assign({}, {
        // offset: this.offset,
        // limit: this.limit
      },
      this.filter);

    this.oSub = this.fixtureGroupService.getAll(params).subscribe(fixtureGroups => {
      this.fixtureGroups = this.fixtureGroups.concat(fixtureGroups);
      this.noMoreFixtures = fixtureGroups.length < STEP;
      this.loading = false;
      this.reloading = false;
    });
  }

  loadMore() {
    this.offset += STEP;
    this.loading = true;
    this.getAll();
  }

  applyFilter(event: any) {
    this.fixtureGroups = [];
    this.offset = 0;
    this.reloading = true;
    for (let i = 0; i < event.length; i++) {
      switch (event[i].nameField) {
        case 'fixtureGroupOwners':
          this.filter.ownerId = event[i].id;
          break;
        case 'fixtureGroupTypes':
          this.filter.fixtureGroupTypeId = event[i].id;
          break;
        default:
          break;
      }
    }
    this.getAll();
  }

  initSourceFilter() {
    for (let i = 0; i < this.sourceForFilter.length; i++) {
      switch (this.sourceForFilter[i].name) {
        case 'fixtureGroupOwners':
          this.sourceForFilter[i].source = this.fixtureGroupOwners;
          break;
        case 'fixtureGroupTypes':
          this.sourceForFilter[i].source = this.fixtureGroupTypes;
          break;
        default:
          break;
      }
    }
  }

  saveSwitchOnEditwinBtn() {
    this.onRefreshChild_ChildGrid.emit();
  }

  saveEditSwitchOffwinBtn() {
    this.onRefreshChild_ChildGrid.emit();
  }

  ins() {
    this.fixtureGrlistJqxgridComponent.ins();
  }

  upd() {
    this.fixtureGrlistJqxgridComponent.upd();
  }

  del() {
    this.fixtureGrlistJqxgridComponent.del();
  }

  refresh() {
    this.refreshGrid();
  }

  filterNone() {
    this.fixtureGrlistJqxgridComponent.islistBoxVisible = !this.fixtureGrlistJqxgridComponent.islistBoxVisible;
  }

  filterList() {
    this.isFilterVisible = !this.isFilterVisible;
  }

  place() {
    this.fixtureGrlistJqxgridComponent.place();
  }

  pinDrop() {
    this.fixtureGrlistJqxgridComponent.pin_drop();
  }

  groupIn() {

  }

  groupOut() {

  }

  switchOn() {
    const fixtureIds: number[] = [];
    for (let i = 0; i < this.fixtures.length; i++) {
      fixtureIds[i] = +this.fixtures[i].fixtureId;
    }
    this.editSwitchOnWindow.positionWindow({x: 600, y: 90});
    this.editSwitchOnWindow.openWindow(fixtureIds, 'ins');
  }

  switchOff() {
    const fixtureIds: number[] = [];
    for (let i = 0; i < this.fixtures.length; i++) {
      fixtureIds[i] = +this.fixtures[i].fixtureId;
    }
    this.editSwitchOffWindow.positionWindow({x: 600, y: 90});
    this.editSwitchOffWindow.openWindow(fixtureIds, 'ins');
  }
}
