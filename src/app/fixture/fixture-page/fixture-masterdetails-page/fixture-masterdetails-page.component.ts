import {Component, Input, OnInit, ViewChild} from '@angular/core';

import {
  CommandStatus, FilterCommandSwitch, CommandType,
  Contract, FilterFixture,
  FixtureType,
  Geograph,
  HeightType,
  Installer,
  Owner_fixture,
  Substation, SpeedDirection, FilterCommandSpeedSwitch, CommandSpeedSwitchDflt, CommandSwitchDflt
} from "../../../shared/interfaces";
import {FixturecomlistPageComponent} from "./fixturecomlist-page/fixturecomlist-page.component";
import {FixturelistPageComponent} from "./fixturelist-page/fixturelist-page.component";
import {DateTimeFormat} from "../../../shared/classes/DateTimeFormat";
import {FixturecomspeedlistPageComponent} from "./fixturecomspeedlist-page/fixturecomspeedlist-page.component";
import {CommandSwitchService} from "../../../shared/services/command/commandSwitch.service";
import {CommandSpeedSwitchService} from "../../../shared/services/command/commandSpeedSwitch.service";

@Component({
  selector: 'app-fixture-masterdetails-page',
  templateUrl: './fixture-masterdetails-page.component.html',
  styleUrls: ['./fixture-masterdetails-page.component.css']
})
export class FixtureMasterdetailsPageComponent implements OnInit {

  //variables from master component
  //node source
  @Input() geographs: Geograph[]

  //fixture source
  @Input() owner_fixtures: Owner_fixture[]
  @Input() fixtureTypes: FixtureType[]
  @Input() substations: Substation[]
  @Input() contract_fixtures: Contract[]
  @Input() installers: Installer[]
  @Input() heightTypes: HeightType[]

  //command source
  @Input() commandTypes: CommandType[]
  @Input() commandStatuses: CommandStatus[]
  @Input() speedDirectiones: SpeedDirection[]

  //determine the functions that need to be performed in the parent component
  // @Output() onRefreshMap = new EventEmitter()

  //define variables - link to view objects
  @ViewChild("id_fixture_select") id_fixture_select: number
  @ViewChild("fixturelistPageComponent") fixturelistPageComponent: FixturelistPageComponent
  @ViewChild("fixturecomlistPageComponent") fixturecomlistPageComponent: FixturecomlistPageComponent
  @ViewChild("fixturecomspeedlistPageComponent") fixturecomspeedlistPageComponent: FixturecomspeedlistPageComponent

  //other variables
  todayEndStart: any
  filterFixture: FilterFixture = {
    id_geograph: -1,
    id_owner: -1,
    id_fixture_type: -1,
    id_substation: -1,
    id_mode: -1,

    id_contract: -1,
    id_node: -1
  }
  filterCommandSwitch: FilterCommandSwitch
  filterCommandSpeedSwitch: FilterCommandSpeedSwitch
  isTabCommandSwitchOn: boolean = false
  isTabCommandSpeed: boolean = false
  commandSwitchDflt: CommandSwitchDflt
  commandSpeedSwitchDflt: CommandSpeedSwitchDflt

  constructor(private commandSwitchService: CommandSwitchService,
              private commandSpeedSwitchService: CommandSpeedSwitchService) {
  }

  ngOnInit() {
    this.id_fixture_select = 0
    this.isTabCommandSwitchOn = true
    this.isTabCommandSpeed = false
    this.commandSwitchDflt = this.commandSwitchService.dfltParams()
    this.commandSpeedSwitchDflt = this.commandSpeedSwitchService.dfltParams()

    this.todayEndStart = {
      iso8601TZ: {
        start: () => new DateTimeFormat().toIso8601TZString(new Date(new Date().setHours(0, 0, 0, 0))),
        end: () => new DateTimeFormat().toIso8601TZString(new Date(new Date().setHours(23, 59, 59, 999)))
      }
    }

    this.filterCommandSwitch = {
      startDateTime: this.todayEndStart.iso8601TZ.start(),
      endDateTime: this.todayEndStart.iso8601TZ.end(),
      fixtureId: 0,
      statusId: this.commandSwitchDflt.statusId // значение получать из интерфейсного пакета (из таблицы значений по умолчанию) из БД
    }

    this.filterCommandSpeedSwitch = {
      startDateTime: this.todayEndStart.iso8601TZ.start(),
      endDateTime: this.todayEndStart.iso8601TZ.end(),
      fixtureId: 0,
      statusId: this.commandSpeedSwitchDflt.statusId, // значение получать из интерфейсного пакета (из таблицы значений по умолчанию) из БД
      speedDirectionId: 0
    }
  }

  refreshGrid() {
    this.fixturelistPageComponent.applyFilter(this.filterFixture)
    this.refreshChildGrid(0)
  }

  // refreshMap() {
  //   //make flag to refresh map
  //   this.onRefreshMap.emit()
  // }

  refreshChildGrid(fixtureId: number) {
    //refresh child grid
    this.id_fixture_select = fixtureId
    //command_switchon
    this.filterCommandSwitch.fixtureId = fixtureId
    if (this.isTabCommandSwitchOn) this.fixturecomlistPageComponent.applyFilter(this.filterCommandSwitch)
    //command_speed_switchon
    this.filterCommandSpeedSwitch.fixtureId = fixtureId
    if (this.isTabCommandSpeed) this.fixturecomspeedlistPageComponent.applyFilter(this.filterCommandSpeedSwitch)
  }

  selected(event: any): void {
    if (event.args.item === 0) {
      this.isTabCommandSwitchOn = true
      this.isTabCommandSpeed = false
    }
    if (event.args.item === 1) {
      this.isTabCommandSwitchOn = false
      this.isTabCommandSpeed = true
    }
  }

}
