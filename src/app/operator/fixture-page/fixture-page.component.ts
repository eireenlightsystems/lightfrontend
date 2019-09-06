// angular lib
import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {MatSnackBar} from '@angular/material/snack-bar';
// jqwidgets
// app interfaces
import {
  CommandStatus,
  CommandType,
  Contract, Owner, FixtureGroupType, EquipmentType, HeightType, Installer, Substation, NavItem, FixtureType
} from '../../shared/interfaces';
// app services
// app components


@Component({
  selector: 'app-fixture-page',
  templateUrl: './fixture-page.component.html',
  styleUrls: ['./fixture-page.component.css']
})
export class FixturePageComponent implements OnInit, OnDestroy {

  // variables from parent component
  @Input() siteMap: NavItem[];
  @Input() tabsWidth: number;
  // fixture source
  @Input() ownerFixtures: Owner[];
  @Input() fixtureTypes: FixtureType[];
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
  // determine the functions that need to be performed in the parent component

  // define variables - link to view objects

  // other variables


  constructor(private _snackBar: MatSnackBar,
              // service
              public translate: TranslateService) {
  }

  ngOnInit() {

  }

  ngOnDestroy(): void {

  }
}
