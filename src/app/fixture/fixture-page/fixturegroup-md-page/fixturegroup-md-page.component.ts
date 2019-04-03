import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {
  CommandStatus,
  CommandType,
  Contract, Fixture, FixtureGroupOwner, FixtureGroupType,
  FixtureType,
  Geograph,
  HeightType,
  Installer,
  OwnerFixture, SpeedDirection,
  Substation
} from '../../../shared/interfaces';
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
  @Input() ownerFixtures: OwnerFixture[];
  @Input() fixtureTypes: FixtureType[];
  @Input() substations: Substation[];
  @Input() contractFixtures: Contract[];
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

  constructor() {
  }

  ngOnInit() {

  }

  // refreshGrid() {
  //   this.fixtureGrlistPageComponent.applyFilter(this.filterFixtureGroup);
  //   this.refreshChildGrid(0);
  // }

  refreshChildGrid(fixtureGroupId: number) {
    // refresh child grid
    this.fixtureGroupId = fixtureGroupId;
    this.fixtureMasterdetailsPageComponentFgr.refreshMDGrid(fixtureGroupId.toString());
  }

  refreshChild_ChildGrid() {
    if (this.fixtureMasterdetailsPageComponentFgr.selectFixtureId > 0) {
      this.fixtureMasterdetailsPageComponentFgr.refreshChildGrid(this.fixtureMasterdetailsPageComponentFgr.selectFixtureId);
    }
  }

  getFixtures(event) {
    this.fixtures = event;
  }
}
