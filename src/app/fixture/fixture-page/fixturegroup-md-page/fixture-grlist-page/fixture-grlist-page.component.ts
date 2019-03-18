import {Component, Input, OnInit, OnDestroy, ViewChild, EventEmitter, Output, AfterViewInit} from '@angular/core';
import {Subscription} from 'rxjs/index';
import {MaterialService} from '../../../../shared/classes/material.service';

import {FilterFixtureGroup, Fixture, FixtureGroup, FixtureGroupOwner, FixtureGroupType} from '../../../../shared/interfaces';
import {FixtureGroupService} from '../../../../shared/services/fixture/fixtureGroup.service';
import {FixtureGrlistJqxgridComponent} from './fixture-grlist-jqxgrid/fixture-grlist-jqxgrid.component';
import {isUndefined} from 'util';
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
  @Input() fixtureGroupOwners: FixtureGroupOwner[];

  @Input() widthGrid: number;
  @Input() heightGrid: number;
  @Input() selectionmode: string;
  @Input() isMasterGrid: boolean;

  @Input() isAdd: boolean;
  @Input() isUpdate: boolean;
  @Input() isDelete: boolean;
  @Input() isRefresh: boolean;
  @Input() isFilter_none: boolean;
  @Input() isFilter_list: boolean;
  @Input() isPlace: boolean;
  @Input() isPin_drop: boolean;
  @Input() isSwitchOn: boolean;
  @Input() isSwitchOff: boolean;

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
  //
  isAddBtnDisabled = false;
  isEditBtnDisabled = false;
  isDeleteBtnDisabled = false;
  isRefreshBtnDisabled = false;
  isFilter_noneBtnDisabled = false;
  isFilter_listBtnDisabled = false;
  isPlaceBtnDisabled = false;
  isPin_dropBtnDisabled = false;
  isSwitchOnBtnDisabled = false;
  isSwitchOffBtnDisabled = false;


  constructor(private fixtureGroupService: FixtureGroupService) {
  }

  ngOnInit() {
    // this.getAll();
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
    this.fixtureGroupId = -2;
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

  applyFilter(filter: FilterFixtureGroup) {
    this.fixtureGroups = [];
    this.offset = 0;
    this.filter = filter;
    this.reloading = true;
    this.getAll();
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

  place() {
    this.fixtureGrlistJqxgridComponent.place();
  }

  pin_drop() {
    this.fixtureGrlistJqxgridComponent.pin_drop();
  }

  switchOn() {
    const fixtureIds: number[] = [];
    for (let i = 0; i < this.fixtures.length; i++) {
      fixtureIds[i] = +this.fixtures[i].id_fixture;
    }
    this.editSwitchOnWindow.positionWindow({x: 600, y: 90});
    this.editSwitchOnWindow.openWindow(fixtureIds, 'ins');
  }

  switchOff() {
    const fixtureIds: number[] = [];
    for (let i = 0; i < this.fixtures.length; i++) {
      fixtureIds[i] = +this.fixtures[i].id_fixture;
    }
    this.editSwitchOffWindow.positionWindow({x: 600, y: 90});
    this.editSwitchOffWindow.openWindow(fixtureIds, 'ins');
  }

  saveSwitchOnEditwinBtn() {
    // this.refreshGrid();
    // this.refreshChildGrid(this.fixtureGroupId);
    this.onRefreshChild_ChildGrid.emit();
  }

  saveEditSwitchOffwinBtn() {
    // this.refreshGrid();
    // this.refreshChildGrid(this.fixtureGroupId);
    this.onRefreshChild_ChildGrid.emit();
  }
}
