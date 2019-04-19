import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs/index';

import {
  CommandStatus,
  CommandType,
  CommandSpeedSwitch,
  FilterCommandSpeedSwitch,
  SourceForFilter,
  CommandSpeedSwitchDflt, SettingButtonPanel
} from '../../../../shared/interfaces';
import {FixturecomspeedlistJqxgridComponent} from './fixturecomspeedlist-jqxgrid/fixturecomspeedlist-jqxgrid.component';
import {CommandSpeedSwitchService} from '../../../../shared/services/command/commandSpeedSwitch.service';
import {DateTimeFormat} from '../../../../shared/classes/DateTimeFormat';


const STEP = 1000000000000;


@Component({
  selector: 'app-fixturecomspeedlist-page',
  templateUrl: './fixturecomspeedlist-page.component.html',
  styleUrls: ['./fixturecomspeedlist-page.component.css']
})
export class FixturecomspeedlistPageComponent implements OnInit, OnDestroy {

  // variables from master component
  @Input() commandTypes: CommandType[];
  @Input() commandStatuses: CommandStatus[];
  @Input() speedDirectiones: CommandType[];

  @Input() heightGrid: number;
  @Input() selectFixtureId: number;
  @Input() selectionmode: string;
  @Input() isMasterGrid: any;
  @Input() filterCommandSpeedSwitch: FilterCommandSpeedSwitch;

  @Input() settingButtonPanel: SettingButtonPanel;

  // determine the functions that need to be performed in the parent component


  // define variables - link to view objects
  @ViewChild('fixturecomspeedlistJqxgridComponent') fixturecomspeedlistJqxgridComponent: FixturecomspeedlistJqxgridComponent;

  // other variables
  commandSpeedSwitches: CommandSpeedSwitch[] = [];
  oSub: Subscription;
  isFilterVisible = false;
  sourceForFilter: SourceForFilter[];
  //
  offset = 0;
  limit = STEP;
  //
  loading = false;
  reloading = false;
  noMoreCommand_switches = false;
  //
  selectCommandSpeedId = 0;
  commandSpeedSwitchDflt: CommandSpeedSwitchDflt;


  constructor(private commandSpeedSwitchService: CommandSpeedSwitchService) {
  }

  ngOnInit() {
    // if this.node is child grid, then we need update this.filter.fixtureId
    if (!this.isMasterGrid) {
      // this.filter.fixtureId = this.selectFixtureId
      this.filterCommandSpeedSwitch.fixtureId = this.selectFixtureId.toString();
    }

    // Definde filter
    this.commandSpeedSwitchDflt = this.commandSpeedSwitchService.dfltParams();
    this.sourceForFilter = [
      {
        name: 'commandStatuses',
        type: 'jqxComboBox',
        source: this.commandStatuses,
        theme: 'material',
        width: '200',
        height: '43',
        placeHolder: 'Статус комманды:',
        displayMember: 'nameField',
        valueMember: 'id',
        defaultValue: '',
        selectId: ''
      },
      {
        name: 'speedDirectiones',
        type: 'jqxComboBox',
        source: this.speedDirectiones,
        theme: 'material',
        width: '400',
        height: '43',
        placeHolder: 'Режим скорости:',
        displayMember: 'nameField',
        valueMember: 'id',
        defaultValue: '',
        selectId: ''
      },
      {
        name: 'startDateTime',
        type: 'jqxDateTimeInput',
        source: [],
        theme: 'material',
        width: '200',
        height: '43',
        placeHolder: 'Дата нач. интер.:',
        displayMember: 'code',
        valueMember: 'id',
        defaultValue: new DateTimeFormat().toDataPickerString(new Date(new Date().setHours(0, 0, 0, 0))),
        selectId: new DateTimeFormat().toIso8601TZString(new Date(new Date().setHours(0, 0, 0, 0)))
      },
      {
        name: 'endDateTime',
        type: 'jqxDateTimeInput',
        source: [],
        theme: 'material',
        width: '200',
        height: '43',
        placeHolder: 'Дата заве. интерв.:',
        displayMember: 'code',
        valueMember: 'id',
        defaultValue: new DateTimeFormat().toDataPickerString(new Date(new Date().setHours(23, 59, 59, 999))),
        selectId: new DateTimeFormat().toIso8601TZString(new Date(new Date().setHours(23, 59, 59, 999)))
      }
    ];

    this.getAll();
    this.reloading = true;
  }

  ngOnDestroy() {
    this.oSub.unsubscribe();
  }

  refreshGrid() {
    this.commandSpeedSwitches = [];
    this.getAll();
    this.reloading = true;
    this.selectCommandSpeedId = 0;
  }

  getAll() {
    // Disabled/available buttons
    if (!this.isMasterGrid && +this.filterCommandSpeedSwitch.fixtureId <= 0) {
      this.settingButtonPanel.add.disabled = true;
      this.settingButtonPanel.upd.disabled = true;
      this.settingButtonPanel.del.disabled = true;
      this.settingButtonPanel.refresh.disabled = true;
      this.settingButtonPanel.filterNone.disabled = true;
      this.settingButtonPanel.filterList.disabled = true;
      this.settingButtonPanel.place.disabled = true;
      this.settingButtonPanel.pinDrop.disabled = true;
      this.settingButtonPanel.groupIn.disabled = true;
      this.settingButtonPanel.groupOut.disabled = true;
      this.settingButtonPanel.switchOn.disabled = true;
      this.settingButtonPanel.switchOff.disabled = true;
    } else {
      this.settingButtonPanel.add.disabled = false;
      this.settingButtonPanel.upd.disabled = false;
      this.settingButtonPanel.del.disabled = false;
      this.settingButtonPanel.refresh.disabled = false;
      this.settingButtonPanel.filterNone.disabled = false;
      this.settingButtonPanel.filterList.disabled = false;
      this.settingButtonPanel.place.disabled = false;
      this.settingButtonPanel.pinDrop.disabled = false;
      this.settingButtonPanel.groupIn.disabled = false;
      this.settingButtonPanel.groupOut.disabled = false;
      this.settingButtonPanel.switchOn.disabled = false;
      this.settingButtonPanel.switchOff.disabled = false;
    }

    const params = Object.assign({}, {
        offset: this.offset,
        limit: this.limit
      },
      this.filterCommandSpeedSwitch
    );
    this.oSub = this.commandSpeedSwitchService.getAll(params).subscribe(commandSpeed => {
      // Link statusName
      const commandSpeedName = commandSpeed;
      commandSpeedName.forEach(currentCommand => {
        currentCommand.statusName = this.commandStatuses.find((currentStatus: CommandStatus) => currentStatus.id === currentCommand.statusId).name;
      });
      // Link speedDirectionsName
      commandSpeedName.forEach(currentCommand => {
        currentCommand.speedDirectionName = this.speedDirectiones.find((currentSpeedDirection: CommandType) => currentSpeedDirection.id === currentCommand.speedDirectionId).name;
      });
      this.commandSpeedSwitches = this.commandSpeedSwitches.concat(commandSpeedName);
      this.noMoreCommand_switches = commandSpeed.length < STEP;
      this.loading = false;
      this.reloading = false;
    });
  }

  loadMore() {
    this.offset += STEP;
    this.loading = true;
    this.getAll();
  }

  applyFilter(event: any) {
    this.commandSpeedSwitches = [];
    this.offset = 0;
    this.reloading = true;
    for (let i = 0; i < event.length; i++) {
      switch (event[i].nameField) {
        case 'commandStatuses':
          this.filterCommandSpeedSwitch.statusId = event[i].id;
          break;
        case 'speedDirectiones':
          this.filterCommandSpeedSwitch.speedDirectionId = event[i].id;
          break;
        case 'startDateTime':
          this.filterCommandSpeedSwitch.startDateTime = event[i].id;
          break;
        case 'endDateTime':
          this.filterCommandSpeedSwitch.endDateTime = event[i].id;
          break;
        default:
          break;
      }
    }
    this.getAll();
  }

  initSourceFilter() {
    for (let i = 0; i < this.sourceForFilter.length; i++) {
      switch (this.sourceForFilter[i].name) {
        case 'commandStatuses':
          this.sourceForFilter[i].source = this.commandStatuses;
          this.sourceForFilter[i].defaultValue = this.commandStatuses.indexOf(this.commandStatuses.find((currentStatus: CommandStatus) => currentStatus.id === this.commandSpeedSwitchDflt.statusId)).toString();
          this.sourceForFilter[i].selectId = this.commandSpeedSwitchDflt.statusId.toString();
          break;
        default:
          break;
      }
    }
  }

  ins() {
    this.fixturecomspeedlistJqxgridComponent.ins();
  }

  upd() {
    this.fixturecomspeedlistJqxgridComponent.upd();
  }

  del() {
    this.fixturecomspeedlistJqxgridComponent.del();
  }

  refresh() {
    this.refreshGrid();
  }

  filterNone() {
    this.fixturecomspeedlistJqxgridComponent.islistBoxVisible = !this.fixturecomspeedlistJqxgridComponent.islistBoxVisible;
  }

  filterList() {
    this.isFilterVisible = !this.isFilterVisible;
  }

  place() {

  }

  pinDrop() {

  }

  groupIn() {

  }

  groupOut() {

  }

  switchOn() {

  }

  switchOff() {

  }
}
