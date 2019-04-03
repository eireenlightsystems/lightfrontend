import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs/index';

import {
  CommandSwitch,
  CommandType,
  CommandStatus,
  FilterCommandSwitch
} from '../../../../shared/interfaces';
import {FixturecomlistJqxgridComponent} from './fixturecomlist-jqxgrid/fixturecomlist-jqxgrid.component';
import {CommandSwitchService} from '../../../../shared/services/command/commandSwitch.service';


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

  @Input() isAdd: boolean;
  @Input() isSwitchOff: boolean;
  @Input() isUpdate: boolean;
  @Input() isDelete: boolean;
  @Input() isRefresh: boolean;
  @Input() isFilter_none: boolean;
  @Input() isFilter_list: boolean;

  // determine the functions that need to be performed in the parent component
  // @Output() onRefreshChildGrid = new EventEmitter<number>()
  // @Output() onRefreshMap = new EventEmitter()

  // define variables - link to view objects
  @ViewChild('fixturecomlistJqxgridComponent') fixturecomlistJqxgridComponent: FixturecomlistJqxgridComponent;

  // other variables
  commandSwitches: CommandSwitch[] = [];
  oSub: Subscription;
  isFilterVisible = false;
  //
  offset = 0;
  limit = STEP;
  //
  loading = false;
  reloading = false;
  noMoreCommand_switches = false;
  //
  // selectCommandSpeedId: number = 0;
  //
  isAddBtnDisabled: boolean;
  isRemoveBtnDisabled: boolean;
  isEditBtnDisabled: boolean;
  isDeleteBtnDisabled: boolean;
  isRefreshBtnDisabled: boolean;
  isFilter_noneBtnDisabled: boolean;
  isFilter_listBtnDisabled: boolean;

  constructor(private fixturecommandService: CommandSwitchService) {
  }

  ngOnInit() {
    // if this.commandSwitch is child grid, then we need update this.filter.fixtureId
    if (!this.isMasterGrid) {
      this.filterCommandSwitch.fixtureId = this.selectFixtureId.toString();
    }
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
    // this.selectCommandSpeedId = 0

    // if this.nodes id master grid, then we need refresh child grid
    // if (this.isMasterGrid) this.refreshChildGrid(this.selectCommandSpeedId)

    // refresh map
    // this.onRefreshMap.emit()
  }

  refreshChildGrid(id_command_switch: number) {
    // this.selectCommandSpeedId = id_command_switch
    // refresh child grid
    // this.onRefreshChildGrid.emit(id_command_switch)
  }

  getAll() {

    // Disabled/available buttons
    if (!this.isMasterGrid && +this.filterCommandSwitch.fixtureId <= 0) {
      this.isAddBtnDisabled = true;
      this.isRemoveBtnDisabled = true;
      this.isEditBtnDisabled = true;
      this.isDeleteBtnDisabled = true;
      this.isRefreshBtnDisabled = true;
      this.isFilter_noneBtnDisabled = true;
      this.isFilter_listBtnDisabled = true;
    } else {
      this.isAddBtnDisabled = false;
      this.isRemoveBtnDisabled = false;
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
      this.filterCommandSwitch
    );
    this.oSub = this.fixturecommandService.getAll(params).subscribe(commandSwitches => {
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

  applyFilter(filter: FilterCommandSwitch) {
    this.commandSwitches = [];
    this.offset = 0;
    this.filterCommandSwitch = filter;
    this.reloading = true;
    this.getAll();
  }

  ins() {
    this.fixturecomlistJqxgridComponent.ins();
  }

  switchOff() {
    this.fixturecomlistJqxgridComponent.switchOff();
  }

  upd() {
    this.fixturecomlistJqxgridComponent.upd();
  }

  del() {
    this.fixturecomlistJqxgridComponent.del();
  }

}
