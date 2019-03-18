import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {
  CommandSpeedSwitchDflt,
  CommandStatus, CommandSwitchDflt,
  CommandType,
  Contract, FilterCommandSpeedSwitch, FilterCommandSwitch, FilterFixture, FilterFixtureGroup, Fixture, FixtureGroupOwner, FixtureGroupType,
  FixtureType,
  Geograph,
  HeightType,
  Installer,
  Owner_fixture, SpeedDirection,
  Substation
} from '../../../shared/interfaces';
import {FixturelistPageComponent} from '../fixture-masterdetails-page/fixturelist-page/fixturelist-page.component';
import {FixturecomlistPageComponent} from '../fixture-masterdetails-page/fixturecomlist-page/fixturecomlist-page.component';
import {FixturecomspeedlistPageComponent} from '../fixture-masterdetails-page/fixturecomspeedlist-page/fixturecomspeedlist-page.component';
import {FixtureGrlistPageComponent} from './fixture-grlist-page/fixture-grlist-page.component';
import {FixtureMasterdetailsPageComponent} from '../fixture-masterdetails-page/fixture-masterdetails-page.component';

@Component({
  selector: 'app-fixturegroup-md-page',
  templateUrl: './fixturegroup-md-page.component.html',
  styleUrls: ['./fixturegroup-md-page.component.css']
})
export class FixturegroupMdPageComponent implements OnInit {

  // variables from master component
  @Input() fixtureGroupTypes: FixtureGroupType[];
  @Input() fixtureGroupOwners: FixtureGroupOwner[];

  // node source
  @Input() geographs: Geograph[];

  // fixture source
  @Input() owner_fixtures: Owner_fixture[];
  @Input() fixtureTypes: FixtureType[];
  @Input() substations: Substation[];
  @Input() contract_fixtures: Contract[];
  @Input() installers: Installer[];
  @Input() heightTypes: HeightType[];

  // command source
  @Input() commandTypes: CommandType[];
  @Input() commandStatuses: CommandStatus[];
  @Input() speedDirectiones: SpeedDirection[];

  // determine the functions that need to be performed in the parent component

  // define variables - link to view objects
  @ViewChild('fixtureGroupId') fixtureGroupId: number;
  @ViewChild('fixtureGrlistPageComponent') fixtureGrlistPageComponent: FixtureGrlistPageComponent;
  @ViewChild('fixtureMasterdetailsPageComponentFgr') fixtureMasterdetailsPageComponentFgr: FixtureMasterdetailsPageComponent;

  // other variables
  fixtures: Fixture[] = [];
  // filterFixtureGroup: FilterFixtureGroup = {
  //   ownerId: 0,
  //   typeId: 0,
  // };

  constructor() {}

  ngOnInit() {

  }

  // refreshGrid() {
  //   this.fixtureGrlistPageComponent.applyFilter(this.filterFixtureGroup);
  //   this.refreshChildGrid(0);
  // }

  refreshChildGrid(fixtureGroupId: number) {
    // refresh child grid
    this.fixtureGroupId = fixtureGroupId;
    this.fixtureMasterdetailsPageComponentFgr.refreshMDGrid(fixtureGroupId);
  }

  refreshChild_ChildGrid() {
    if(this.fixtureMasterdetailsPageComponentFgr.id_fixture_select > 0) {
      this.fixtureMasterdetailsPageComponentFgr.refreshChildGrid(this.fixtureMasterdetailsPageComponentFgr.id_fixture_select);
    }
  }

  getFixtures(event) {
    this.fixtures = event;
  }
}
