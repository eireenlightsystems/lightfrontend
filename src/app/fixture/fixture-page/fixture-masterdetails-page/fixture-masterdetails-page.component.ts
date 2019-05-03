import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {isUndefined} from 'util';

import {jqxSplitterComponent} from 'jqwidgets-scripts/jqwidgets-ng/jqxsplitter';

import {
  Fixture, Contract, EquipmentType, Geograph, HeightType, Installer, Owner, Substation, CommandType, CommandStatus,
  SettingButtonPanel
} from '../../../shared/interfaces';
import {FixturecomlistPageComponent} from './fixturecomlist-page/fixturecomlist-page.component';
import {FixturelistPageComponent} from './fixturelist-page/fixturelist-page.component';
import {FixturecomspeedlistPageComponent} from './fixturecomspeedlist-page/fixturecomspeedlist-page.component';


@Component({
  selector: 'app-fixture-masterdetails-page',
  templateUrl: './fixture-masterdetails-page.component.html',
  styleUrls: ['./fixture-masterdetails-page.component.css']
})
export class FixtureMasterdetailsPageComponent implements OnInit {

  // variables from master component
  @Input() widthGrid: number;
  @Input() fixtureGroupId: string;
  @Input() selectionmode: number;

  // node source
  @Input() geographs: Geograph[];

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

  @Input() settingFixtureButtonPanel: SettingButtonPanel;

  // determine the functions that need to be performed in the parent component
  @Output() onGetFixtures = new EventEmitter<Fixture[]>();

  // define variables - link to view objects
  @ViewChild('fixturelistPageComponent') fixturelistPageComponent: FixturelistPageComponent;
  @ViewChild('fixturecomlistPageComponent') fixturecomlistPageComponent: FixturecomlistPageComponent;
  @ViewChild('fixturecomspeedlistPageComponent') fixturecomspeedlistPageComponent: FixturecomspeedlistPageComponent;
  @ViewChild('mainSplitter') mainSplitter: jqxSplitterComponent;

  // other variables
  selectFixtureId: number;
  isTabCommandSwitchOn = false;
  isTabCommandSpeed = false;

  settingFixtureComButtonPanel: SettingButtonPanel;
  settingFixtureSpeedButtonPanel: SettingButtonPanel;

  heightDeltaParentGrid = 55;
  heightDeltaChildGrid = 103;
  sizeParentSplitter: any;
  sizeChildSplitter: any;

  constructor() {
  }

  ngOnInit() {
    this.selectFixtureId = 0;
    this.isTabCommandSwitchOn = true;
    this.isTabCommandSpeed = false;

    // init fixture button panel
    if (isUndefined(this.settingFixtureButtonPanel)) {
      this.settingFixtureButtonPanel = {
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
        filterNone: {
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
          visible: false,
          disabled: false,
        },
        switchOff: {
          visible: false,
          disabled: false,
        }
      };
    }
    this.settingFixtureComButtonPanel = {
      add: {
        visible: false,
        disabled: false,
      },
      upd: {
        visible: false,
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
      filterNone: {
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
    this.settingFixtureSpeedButtonPanel = {
      add: {
        visible: true,
        disabled: false,
      },
      upd: {
        visible: false,
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
      filterNone: {
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
        visible: false,
        disabled: false,
      },
      switchOff: {
        visible: false,
        disabled: false,
      }
    };
  }

  refreshChildGrid(fixtureId: number) {
    // refresh child grid
    this.selectFixtureId = fixtureId;

    if (this.isTabCommandSwitchOn === true) {
      // command_switchon
      this.fixturecomlistPageComponent.filter.fixtureId = fixtureId.toString();
      if (this.isTabCommandSwitchOn && this.fixturecomlistPageComponent) {
        this.fixturecomlistPageComponent.applyFilter(this.fixturecomlistPageComponent.filter);
      }
    }
    if (this.isTabCommandSpeed === true) {
      // command_speed_switchon
      this.fixturecomspeedlistPageComponent.filter.fixtureId = fixtureId.toString();
      if (this.isTabCommandSpeed && this.fixturecomspeedlistPageComponent) {
        this.fixturecomspeedlistPageComponent.applyFilter(this.fixturecomspeedlistPageComponent.filter);
      }
    }
  }

  selected(event: any): void {
    if (event.args.item === 0) {
      this.isTabCommandSwitchOn = true;
      this.isTabCommandSpeed = false;
    }
    if (event.args.item === 1) {
      this.isTabCommandSwitchOn = false;
      this.isTabCommandSpeed = true;
    }
  }

  resize(sizeParent: any, sizeChild: any) {

    // console.log('resize = ' + sizeParent);

    const sizeParentGrid = sizeParent - this.heightDeltaParentGrid;
    const sizeChildGrid = sizeChild - this.heightDeltaChildGrid;

    this.fixturelistPageComponent.jqxgridComponent.myGrid.height(sizeParentGrid);
    this.fixturelistPageComponent.sourceForJqxGrid.grid.height = sizeParentGrid;

    if (!isUndefined(this.fixturecomlistPageComponent)) {
      this.fixturecomlistPageComponent.jqxgridComponent.myGrid.height(sizeChildGrid);
      this.fixturecomlistPageComponent.sourceForJqxGrid.grid.height = sizeChildGrid;
    }

    if (!isUndefined(this.fixturecomspeedlistPageComponent)) {
      this.fixturecomspeedlistPageComponent.jqxgridComponent.myGrid.height(sizeChildGrid);
      this.fixturecomspeedlistPageComponent.sourceForJqxGrid.grid.height = sizeChildGrid;
    }
  }

  collapsed(sizeParent: any, sizeChild: any) {

    // console.log('collapsed = ' + sizeParent);

    this.sizeParentSplitter = sizeParent;
    this.sizeChildSplitter = sizeChild;

    this.mainSplitter.attrPanels[0].size = this.getHeightSplitter();
  }

  expanded() {

    // console.log('expanded = ' + this.sizeParentSplitter);

    this.mainSplitter.attrPanels[0].size = this.sizeParentSplitter;
    this.mainSplitter.attrPanels[1].size = this.sizeChildSplitter;
  }

  getHeightSplitter() {
    return 775;
  }

}
