import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

import {
  Fixture,
  Contract,
  EquipmentType,
  Geograph,
  HeightType,
  Installer,
  Owner,
  Substation,
  CommandType, FilterCommandSpeedSwitch, CommandSpeedSwitchDflt, CommandSwitchDflt, CommandStatus, FilterCommandSwitch, SettingButtonPanel
} from '../../../shared/interfaces';
import {FixturecomlistPageComponent} from './fixturecomlist-page/fixturecomlist-page.component';
import {FixturelistPageComponent} from './fixturelist-page/fixturelist-page.component';
import {DateTimeFormat} from '../../../shared/classes/DateTimeFormat';
import {FixturecomspeedlistPageComponent} from './fixturecomspeedlist-page/fixturecomspeedlist-page.component';
import {CommandSwitchService} from '../../../shared/services/command/commandSwitch.service';
import {CommandSpeedSwitchService} from '../../../shared/services/command/commandSpeedSwitch.service';


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

  // determine the functions that need to be performed in the parent component
  @Output() onGetFixtures = new EventEmitter<Fixture[]>();

  // define variables - link to view objects
  @ViewChild('selectFixtureId') selectFixtureId: number;
  @ViewChild('fixturelistPageComponent') fixturelistPageComponent: FixturelistPageComponent;
  @ViewChild('fixturecomlistPageComponent') fixturecomlistPageComponent: FixturecomlistPageComponent;
  @ViewChild('fixturecomspeedlistPageComponent') fixturecomspeedlistPageComponent: FixturecomspeedlistPageComponent;

  // other variables
  todayEndStart: any;
  filterCommandSwitch: FilterCommandSwitch;
  filterCommandSpeedSwitch: FilterCommandSpeedSwitch;
  isTabCommandSwitchOn = false;
  isTabCommandSpeed = false;
  commandSwitchDflt: CommandSwitchDflt;
  commandSpeedSwitchDflt: CommandSpeedSwitchDflt;

  settingFixtureButtonPanel: SettingButtonPanel;
  settingFixtureComButtonPanel: SettingButtonPanel;
  settingFixtureSpeedButtonPanel: SettingButtonPanel;

  constructor(private commandSwitchService: CommandSwitchService,
              private commandSpeedSwitchService: CommandSpeedSwitchService) {
  }

  ngOnInit() {
    this.selectFixtureId = 0;
    this.isTabCommandSwitchOn = true;
    this.isTabCommandSpeed = false;
    this.commandSwitchDflt = this.commandSwitchService.dfltParams();
    this.commandSpeedSwitchDflt = this.commandSpeedSwitchService.dfltParams();

    this.todayEndStart = {
      iso8601TZ: {
        start: () => new DateTimeFormat().toIso8601TZString(new Date(new Date().setHours(0, 0, 0, 0))),
        end: () => new DateTimeFormat().toIso8601TZString(new Date(new Date().setHours(23, 59, 59, 999)))
      }
    };

    this.filterCommandSwitch = {
      startDateTime: this.todayEndStart.iso8601TZ.start(),
      endDateTime: this.todayEndStart.iso8601TZ.end(),
      fixtureId: '',
      statusId: this.commandSwitchDflt.statusId.toString() // значение получать из интерфейсного пакета (из таблицы значений по умолчанию) из БД
    };

    this.filterCommandSpeedSwitch = {
      startDateTime: this.todayEndStart.iso8601TZ.start(),
      endDateTime: this.todayEndStart.iso8601TZ.end(),
      fixtureId: '',
      statusId: this.commandSpeedSwitchDflt.statusId.toString(), // значение получать из интерфейсного пакета (из таблицы значений по умолчанию) из БД
      speedDirectionId: ''
    };

    // init fixture button panel
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
    // command_switchon
    this.filterCommandSwitch.fixtureId = fixtureId.toString();
    if (this.isTabCommandSwitchOn && this.fixturecomlistPageComponent) {
      this.fixturecomlistPageComponent.applyFilter(this.filterCommandSwitch);
    }
    // command_speed_switchon
    this.filterCommandSpeedSwitch.fixtureId = fixtureId.toString();
    if (this.isTabCommandSpeed && this.fixturecomspeedlistPageComponent) {
      this.fixturecomspeedlistPageComponent.applyFilter(this.filterCommandSpeedSwitch);
    }
  }

  refreshMDGrid(fixtureGroupId: string) {
    if (+fixtureGroupId > 0) {
      this.fixtureGroupId = fixtureGroupId;
      this.fixturelistPageComponent.applyFilterFixtureInGroup(this.fixtureGroupId);
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

  // Send array fixtures for the command switchOn/Off
  getFixtures(event: Fixture[]) {
    this.onGetFixtures.emit(event);
  }
}
