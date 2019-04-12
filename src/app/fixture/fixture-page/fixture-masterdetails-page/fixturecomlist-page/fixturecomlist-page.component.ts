import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs/index';

import {
  CommandSwitch,
  CommandType,
  CommandStatus,
  FilterCommandSwitch, CommandSwitchDflt, SourceForFilter, SettingButtonPanel
} from '../../../../shared/interfaces';
import {FixturecomlistJqxgridComponent} from './fixturecomlist-jqxgrid/fixturecomlist-jqxgrid.component';
import {CommandSwitchService} from '../../../../shared/services/command/commandSwitch.service';
import {DateTimeFormat} from '../../../../shared/classes/DateTimeFormat';


const STEP = 1000000000000;


@Component({
  selector: 'app-fixturecomlist-page',
  templateUrl: './fixturecomlist-page.component.html',
  styleUrls: ['./fixturecomlist-page.component.css']
})
export class FixturecomlistPageComponent implements OnInit, OnDestroy {

  // variables from master component
  @Input() commandTypes: CommandType[];
  @Input() commandStatuses: CommandStatus[];

  @Input() heightGrid: number;
  @Input() selectFixtureId: number;
  @Input() selectionmode: string;
  @Input() isMasterGrid: boolean;
  @Input() filterCommandSwitch: FilterCommandSwitch;

  @Input() settingButtonPanel: SettingButtonPanel;

  // determine the functions that need to be performed in the parent component

  // define variables - link to view objects
  @ViewChild('fixturecomlistJqxgridComponent') fixturecomlistJqxgridComponent: FixturecomlistJqxgridComponent;

  // other variables
  commandSwitches: CommandSwitch[] = [];
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
  commandSwitchDflt: CommandSwitchDflt;


  constructor(private commandSwitchService: CommandSwitchService) {
  }

  ngOnInit() {
    // if this.commandSwitch is child grid, then we need update this.filter.fixtureId
    if (!this.isMasterGrid) {
      this.filterCommandSwitch.fixtureId = this.selectFixtureId.toString();
    }

    // Definde filter
    this.commandSwitchDflt = this.commandSwitchService.dfltParams();
    this.sourceForFilter = [
      {
        name: 'commandStatuses',
        type: 'jqxComboBox',
        source: this.commandStatuses,
        theme: 'material',
        width: '200',
        height: '43',
        placeHolder: 'Статус комманды:',
        displayMember: 'name',
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
    this.commandSwitches = [];
    this.getAll();
    this.reloading = true;
  }

  getAll() {
    // Disabled/available buttons
    if (!this.isMasterGrid && +this.filterCommandSwitch.fixtureId <= 0) {
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
      this.filterCommandSwitch
    );
    this.oSub = this.commandSwitchService.getAll(params).subscribe(commandSwitches => {
      // Link statusName
      const commandSwitchesStatusName = commandSwitches;
      commandSwitchesStatusName.forEach(currentCommand => {
        currentCommand.statusName = this.commandStatuses.find((currentStatus: CommandStatus) => currentStatus.id === currentCommand.statusId).name;
      });

      this.commandSwitches = this.commandSwitches.concat(commandSwitchesStatusName);
      this.noMoreCommand_switches = commandSwitches.length < STEP;
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
    this.commandSwitches = [];
    this.offset = 0;
    this.reloading = true;
    for (let i = 0; i < event.length; i++) {
      switch (event[i].name) {
        case 'commandStatuses':
          this.filterCommandSwitch.statusId = event[i].id;
          break;
        case 'startDateTime':
          this.filterCommandSwitch.startDateTime = event[i].id;
          break;
        case 'endDateTime':
          this.filterCommandSwitch.endDateTime = event[i].id;
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
          this.sourceForFilter[i].defaultValue = this.commandStatuses.indexOf(this.commandStatuses.find((currentStatus: CommandStatus) => currentStatus.id === this.commandSwitchDflt.statusId)).toString();
          this.sourceForFilter[i].selectId = this.commandSwitchDflt.statusId.toString();
          break;
        default:
          break;
      }
    }
  }

  ins() {

  }

  upd() {
    this.fixturecomlistJqxgridComponent.upd();
  }

  del() {
    this.fixturecomlistJqxgridComponent.del();
  }

  refresh() {

  }

  filterNone() {
    this.fixturecomlistJqxgridComponent.islistBoxVisible = !this.fixturecomlistJqxgridComponent.islistBoxVisible;
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
    this.fixturecomlistJqxgridComponent.ins();
  }

  switchOff() {
    this.fixturecomlistJqxgridComponent.switchOff();
  }
}
