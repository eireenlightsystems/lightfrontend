import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

import {
  CommandStatus, FilterCommandSwitch, CommandType,
  Contract, FilterFixture,
  FixtureType,
  Geograph,
  HeightType,
  Installer,
  OwnerFixture,
  Substation, SpeedDirection, FilterCommandSpeedSwitch, CommandSpeedSwitchDflt, CommandSwitchDflt, Fixture
} from '../../../shared/interfaces';
import {FixturecomlistPageComponent} from './fixturecomlist-page/fixturecomlist-page.component';
import {FixturelistPageComponent} from './fixturelist-page/fixturelist-page.component';
import {DateTimeFormat} from '../../../shared/classes/DateTimeFormat';
import {FixturecomspeedlistPageComponent} from './fixturecomspeedlist-page/fixturecomspeedlist-page.component';
import {CommandSwitchService} from '../../../shared/services/command/commandSwitch.service';
import {CommandSpeedSwitchService} from '../../../shared/services/command/commandSpeedSwitch.service';
import {isUndefined} from 'util';

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

  @Input() isAdd: boolean;
  @Input() isUpdate: boolean;
  @Input() isDelete: boolean;
  @Input() isRefresh: boolean;
  @Input() isFilter_none: boolean;
  @Input() isFilter_list: boolean;
  @Input() isPlace: boolean;
  @Input() isPin_drop: boolean;
  @Input() isGroup_in: boolean;
  @Input() isGroup_out: boolean;

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
