// angular lib
import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {isUndefined} from 'util';
// jqwidgets
import {jqxSplitterComponent} from 'jqwidgets-scripts/jqwidgets-ng/jqxsplitter';
// app interfaces
import {
  Fixture, Contract, EquipmentType, HeightType, Installer, Owner, Substation, CommandType, CommandStatus,
  SettingButtonPanel, NavItem
} from '../../../shared/interfaces';
// app services
// app components
import {FixturecomlistPageComponent} from './fixturecomlist-page/fixturecomlist-page.component';
import {FixturelistPageComponent} from './fixturelist-page/fixturelist-page.component';
import {FixturecomspeedlistPageComponent} from './fixturecomspeedlist-page/fixturecomspeedlist-page.component';


@Component({
  selector: 'app-fixture-masterdetails-page',
  templateUrl: './fixture-masterdetails-page.component.html',
  styleUrls: ['./fixture-masterdetails-page.component.css']
})
export class FixtureMasterdetailsPageComponent implements OnInit {

  // variables from parent component
  @Input() siteMap: NavItem[];
  @Input() widthGrid: number;
  @Input() fixtureGroupId: string;
  @Input() selectionmode: number;
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
  @ViewChild('fixturelistPageComponent', {static: false}) fixturelistPageComponent: FixturelistPageComponent;
  @ViewChild('fixturecomlistPageComponent', {static: false}) fixturecomlistPageComponent: FixturecomlistPageComponent;
  @ViewChild('fixturecomspeedlistPageComponent', {static: false}) fixturecomspeedlistPageComponent: FixturecomspeedlistPageComponent;
  @ViewChild('mainSplitter', {static: false}) mainSplitter: jqxSplitterComponent;

  // other variables
  selectFixtureId = 0;
  settingFixtureComButtonPanel: SettingButtonPanel;
  settingFixtureSpeedButtonPanel: SettingButtonPanel;
  heightDeltaParentGrid = 55;
  heightDeltaChildGrid = 103;
  sizeParentSplitter: any;
  sizeChildSplitter: any;

  constructor() {
  }

  ngOnInit() {
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
          visible: false,
          disabled: false,
        },
        switchOff: {
          visible: false,
          disabled: false,
        }
      };
    }
    // init fixturecom button panel
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
    // init fixturespeed button panel
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
    this.selectFixtureId = fixtureId;

    if (!isUndefined(this.fixturecomlistPageComponent)) {
      this.fixturecomlistPageComponent.filter.fixtureId = fixtureId.toString();
    }
    if (!isUndefined(this.fixturecomspeedlistPageComponent)) {
      this.fixturecomspeedlistPageComponent.filter.fixtureId = fixtureId.toString();
    }

    if (fixtureId === 0) {
      // command_switchon
      if (!isUndefined(this.fixturecomlistPageComponent)) {
        this.fixturecomlistPageComponent.items = [];
        if (!isUndefined(this.fixturecomlistPageComponent.jqxgridComponent)) {
          this.fixturecomlistPageComponent.jqxgridComponent.empty_jqxgGrid();
        }
        this.fixturecomlistPageComponent.getDisabledButtons();
      }
      // command_speed_switchon
      if (!isUndefined(this.fixturecomspeedlistPageComponent)) {
        this.fixturecomspeedlistPageComponent.items = [];
        if (!isUndefined(this.fixturecomspeedlistPageComponent.jqxgridComponent)) {
          this.fixturecomspeedlistPageComponent.jqxgridComponent.empty_jqxgGrid();
        }
        this.fixturecomspeedlistPageComponent.getDisabledButtons();
      }
    } else {
      // command_switchon
      if (!isUndefined(this.fixturecomlistPageComponent)) {
        this.fixturecomlistPageComponent.applyFilter(this.fixturecomlistPageComponent.filter);
      }
      // command_speed_switchon
      if (!isUndefined(this.fixturecomspeedlistPageComponent)) {
        this.fixturecomspeedlistPageComponent.applyFilter(this.fixturecomspeedlistPageComponent.filter);
      }
    }
  }

  resize(sizeParent: any, sizeChild: any) {
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
    this.sizeParentSplitter = sizeParent;
    this.sizeChildSplitter = sizeChild;
    this.mainSplitter.attrPanels[0].size = this.getHeightSplitter();
  }

  expanded() {
    this.mainSplitter.attrPanels[0].size = this.sizeParentSplitter;
    this.mainSplitter.attrPanels[1].size = this.sizeChildSplitter;
  }

  getHeightSplitter() {
    return 775;
  }

}
