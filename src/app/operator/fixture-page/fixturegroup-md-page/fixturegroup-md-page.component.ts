// @ts-ignore
import {Component, Input, OnInit, ViewChild} from '@angular/core';

import {jqxSplitterComponent} from 'jqwidgets-scripts/jqwidgets-ng/jqxsplitter';

import {
  Fixture, Geograph, Contract, Owner, EquipmentType, HeightType, Installer, Substation,
  CommandStatus, CommandType,
  FixtureGroupType,
  SettingButtonPanel, NavItem
} from '../../../shared/interfaces';
import {FixtureGrlistPageComponent} from './fixture-grlist-page/fixture-grlist-page.component';
import {FixtureMasterdetailsPageComponent} from '../fixture-masterdetails-page/fixture-masterdetails-page.component';
import {isUndefined} from 'util';


@Component({
  selector: 'app-fixturegroup-md-page',
  templateUrl: './fixturegroup-md-page.component.html',
  styleUrls: ['./fixturegroup-md-page.component.css']
})
export class FixturegroupMdPageComponent implements OnInit {

  // variables from master component
  @Input() siteMap: NavItem[];
  @Input() fixtureGroupTypes: FixtureGroupType[];
  @Input() fixtureGroupOwners: Owner[];

  // node source

  // fixture source
  @Input() ownerFixtures: Owner[];
  @Input() fixtureTypes: EquipmentType[];
  @Input() substations: Substation[];
  @Input() contractFixtures: Contract[];
  @Input() installers: Installer[];
  @Input() heightTypes: HeightType[];

  // command source
  @Input() commandTypes: CommandType[];
  @Input() commandStatuses: CommandStatus[];
  @Input() speedDirectiones: CommandType[];

  // determine the functions that need to be performed in the parent component

  // define variables - link to view objects
  @ViewChild('fixtureGrlistPageComponent', {static: false}) fixtureGrlistPageComponent: FixtureGrlistPageComponent;
  @ViewChild('fixtureMasterdetailsPageComponentFgr', {static: false}) fixtureMasterdetailsPageComponentFgr: FixtureMasterdetailsPageComponent;
  @ViewChild('mainSplitter', {static: false}) mainSplitter: jqxSplitterComponent;

  // other variables
  fixtures: Fixture[] = [];
  settingFixtureGrButtonPanel: SettingButtonPanel;
  settingFixtureButtonPanel: SettingButtonPanel;
  isButtonPanelVisible = false;
  heightDeltaGrid = 55;


  constructor() {
  }

  ngOnInit() {
    // init fixture group button panel
    this.settingFixtureGrButtonPanel = {
      add: {
        visible: true,
        disabled: false,
      },
      upd: {
        visible: true,
        disabled: false,
      },
      del: {
        visible: true,
        disabled: false,
      },
      refresh: {
        visible: true,
        disabled: false,
      },
      setting: {
        visible: true,
        disabled: false,
      },
      filterList: {
        visible: true,
        disabled: false,
      },
      place: {
        visible: false,
        disabled: false,
      },
      pinDrop: {
        visible: false,
        disabled: false,
      },
      groupIn: {
        visible: false,
        disabled: false,
      },
      groupOut: {
        visible: false,
        disabled: false,
      },
      switchOn: {
        visible: true,
        disabled: false,
      },
      switchOff: {
        visible: true,
        disabled: false,
      }
    };
    this.settingFixtureButtonPanel = {
      add: {
        visible: false,
        disabled: false,
      },
      upd: {
        visible: true,
        disabled: false,
      },
      del: {
        visible: false,
        disabled: false,
      },
      refresh: {
        visible: true,
        disabled: false,
      },
      setting: {
        visible: true,
        disabled: false,
      },
      filterList: {
        visible: false,
        disabled: false,
      },
      place: {
        visible: false,
        disabled: false,
      },
      pinDrop: {
        visible: false,
        disabled: false,
      },
      groupIn: {
        visible: true,
        disabled: false,
      },
      groupOut: {
        visible: true,
        disabled: false,
      },
      switchOn: {
        visible: false,
        disabled: false,
      },
      switchOff: {
        visible: false,
        disabled: false,
      }
    };
  }

  refreshChildGrid(fixtureGroupId: number) {
    if (!isUndefined(this.fixtureMasterdetailsPageComponentFgr) && !isUndefined(this.fixtureMasterdetailsPageComponentFgr.fixturelistPageComponent)) {
      if (fixtureGroupId === 0) {
        this.fixtureMasterdetailsPageComponentFgr.fixturelistPageComponent.items = [];
        if (!isUndefined(this.fixtureMasterdetailsPageComponentFgr.fixturelistPageComponent.jqxgridComponent)) {
          this.fixtureMasterdetailsPageComponentFgr.fixturelistPageComponent.jqxgridComponent.empty_jqxgGrid();
          this.fixtureMasterdetailsPageComponentFgr.fixturelistPageComponent.getDisabledButtons();
          this.fixtureMasterdetailsPageComponentFgr.fixturelistPageComponent.refreshChildGrid({fixtureId: 0});
        }
      } else {
        this.fixtureMasterdetailsPageComponentFgr.fixturelistPageComponent.applyFilterFixtureInGroup(fixtureGroupId.toString());
      }
    }
  }

  ins() {
    this.fixtureGrlistPageComponent.ins();
  }

  upd() {
    this.fixtureGrlistPageComponent.upd();
  }

  del() {
    this.fixtureGrlistPageComponent.del();
  }

  refresh() {
    this.fixtureGrlistPageComponent.refresh();
  }

  filterNone() {
    this.fixtureGrlistPageComponent.filterNone();
  }

  filterList() {
    this.fixtureGrlistPageComponent.filterList();
  }

  switchOn() {
    this.fixtureGrlistPageComponent.switchOn(this.fixtureMasterdetailsPageComponentFgr.fixturelistPageComponent.items);
  }

  switchOff() {
    this.fixtureGrlistPageComponent.switchOff(this.fixtureMasterdetailsPageComponentFgr.fixturelistPageComponent.items);
  }

  feedback(event: any) {
    switch (event) {
      case 'SwitchOn':
        this.fixtureMasterdetailsPageComponentFgr.fixturecomlistPageComponent.refreshGrid();
        break;
      case 'SwitchOff':
        this.fixtureMasterdetailsPageComponentFgr.fixturecomlistPageComponent.refreshGrid();
        break;
      default:
        break;
    }
  }

  getHeightSplitter() {
    return 775;
  }
}
