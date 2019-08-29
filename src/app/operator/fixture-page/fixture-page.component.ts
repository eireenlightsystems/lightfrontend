import {Component, OnInit, OnDestroy, Input} from '@angular/core';

import {
  CommandStatus,
  CommandType,
  Contract, Owner, FixtureGroupType, EquipmentType, HeightType, Installer, Substation, NavItem
} from '../../shared/interfaces';

@Component({
  selector: 'app-fixture-page',
  templateUrl: './fixture-page.component.html',
  styleUrls: ['./fixture-page.component.css']
})
export class FixturePageComponent implements OnInit, OnDestroy {

  // variables from master component
  @Input() siteMap: NavItem[];
  @Input() tabsWidth: number;
  // fixture source
  @Input() ownerFixtures: Owner[];
  @Input() fixtureTypes: EquipmentType[];
  @Input() substations: Substation[];
  @Input() contractFixtures: Contract[];
  @Input() installers: Installer[];
  @Input() heightTypes: HeightType[];

  // fixture group source
  @Input() fixtureGroupTypes: FixtureGroupType[];
  @Input() fixtureGroupOwners: Owner[];

  // command source
  @Input() commandTypes: CommandType[];
  @Input() commandStatuses: CommandStatus[];
  @Input() speedDirectiones: CommandType[];


  constructor() {
  }

  ngOnInit() {

  }

  ngOnDestroy(): void {

  }

}
