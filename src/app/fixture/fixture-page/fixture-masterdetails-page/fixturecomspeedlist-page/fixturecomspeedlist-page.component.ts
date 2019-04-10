import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs/index';

import {
  CommandType,
  CommandStatus,
  SpeedDirection, CommandSpeedSwitch, FilterCommandSpeedSwitch, SourceForFilter, CommandSpeedSwitchDflt
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
  @Input() speedDirectiones: SpeedDirection[];

  @Input() heightGrid: number;
  @Input() selectFixtureId: number;
  @Input() selectionmode: string;
  @Input() isMasterGrid: any;
  @Input() filterCommandSpeedSwitch: FilterCommandSpeedSwitch;

  @Input() isAdd: boolean;
  @Input() isUpdate: boolean;
  @Input() isDelete: boolean;
  @Input() isRefresh: boolean;
  @Input() isFilter_none: boolean;
  @Input() isFilter_list: boolean;

  // determine the functions that need to be performed in the parent component
  // @Output() onRefreshChildGrid = new EventEmitter<number>()
  // @Output() onRefreshMap = new EventEmitter()

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
  //
  isAddBtnDisabled: boolean;
  isEditBtnDisabled: boolean;
  isDeleteBtnDisabled: boolean;
  isRefreshBtnDisabled: boolean;
  isFilter_noneBtnDisabled: boolean;
  isFilter_listBtnDisabled: boolean;

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
        displayMember: 'name',
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
    this.commandSpeedSwitches = [];
    this.getAll();
    this.reloading = true;
    this.selectCommandSpeedId = 0;
  }

  getAll() {
    // Disabled/available buttons
    if (!this.isMasterGrid && +this.filterCommandSpeedSwitch.fixtureId <= 0) {
      this.isAddBtnDisabled = true;
      this.isEditBtnDisabled = true;
      this.isDeleteBtnDisabled = true;
      this.isRefreshBtnDisabled = true;
      this.isFilter_noneBtnDisabled = true;
      this.isFilter_listBtnDisabled = true;
    } else {
      this.isAddBtnDisabled = false;
      this.isEditBtnDisabled = false;
      this.isDeleteBtnDisabled = false;
      this.isRefreshBtnDisabled = false;
      this.isFilter_noneBtnDisabled = false;
      this.isFilter_listBtnDisabled = false;
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
        currentCommand.speedDirectionName = this.speedDirectiones.find((currentSpeedDirection: SpeedDirection) => currentSpeedDirection.id === currentCommand.speedDirectionId).name;
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
      switch (event[i].name) {
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


}
