import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core'
import {Subscription} from 'rxjs/index'

import {
  CommandType,
  CommandStatus,
  SpeedDirection, CommandSpeedSwitch, FilterCommandSpeedSwitch
} from '../../../../shared/interfaces'
import {FixturecomspeedlistJqxgridComponent} from "./fixturecomspeedlist-jqxgrid/fixturecomspeedlist-jqxgrid.component";
import {CommandSpeedSwitchService} from "../../../../shared/services/command/commandSpeedSwitch.service";


const STEP = 1000000000000


@Component({
  selector: 'app-fixturecomspeedlist-page',
  templateUrl: './fixturecomspeedlist-page.component.html',
  styleUrls: ['./fixturecomspeedlist-page.component.css']
})
export class FixturecomspeedlistPageComponent implements OnInit, OnDestroy {

  //variables from master component
  @Input() commandTypes: CommandType[]
  @Input() commandStatuses: CommandStatus[]
  @Input() speedDirectiones: SpeedDirection[]

  @Input() heightGrid: number
  @Input() id_fixture_select: number
  @Input() selectionmode: string
  @Input() isMasterGrid: any
  @Input() filterCommandSpeedSwitch: FilterCommandSpeedSwitch

  @Input() isAdd: boolean
  @Input() isUpdate: boolean
  @Input() isDelete: boolean
  @Input() isRefresh: boolean
  @Input() isFilter_none: boolean
  @Input() isFilter_list: boolean

  //determine the functions that need to be performed in the parent component
  // @Output() onRefreshChildGrid = new EventEmitter<number>()
  // @Output() onRefreshMap = new EventEmitter()

  //define variables - link to view objects
  @ViewChild("fixturecomspeedlistJqxgridComponent") fixturecomspeedlistJqxgridComponent: FixturecomspeedlistJqxgridComponent;

  //other variables
  commandSpeedSwitches: CommandSpeedSwitch[] = []
  oSub: Subscription
  isFilterVisible = false
  //
  offset = 0
  limit = STEP
  //
  loading = false
  reloading = false
  noMoreCommand_switches = false
  //
  id_command_switch_select: number = 0;
  //
  isAddBtnDisabled: boolean
  isEditBtnDisabled: boolean
  isDeleteBtnDisabled: boolean
  isRefreshBtnDisabled: boolean
  isFilter_noneBtnDisabled: boolean
  isFilter_listBtnDisabled: boolean

  constructor(private commandSpeedSwitchService: CommandSpeedSwitchService) {
  }

  ngOnInit() {
    //if this.node is child grid, then we need update this.filter.id_fixture
    if (!this.isMasterGrid) {
      // this.filter.id_fixture = this.id_fixture_select
      this.filterCommandSpeedSwitch.fixtureId = this.id_fixture_select
    }
    this.getAll()
    this.reloading = true
  }

  ngOnDestroy() {
    this.oSub.unsubscribe()
  }

  refreshGrid() {
    this.commandSpeedSwitches = []
    this.getAll()
    this.reloading = true
    this.id_command_switch_select = 0

    //if this.nodes id master grid, then we need refresh child grid
    if (this.isMasterGrid) this.refreshChildGrid(this.id_command_switch_select)

    //refresh map
    // this.onRefreshMap.emit()
  }

  refreshChildGrid(id_command_switch: number) {
    // this.id_command_switch_select = id_command_switch
    //refresh child grid
    // this.onRefreshChildGrid.emit(id_command_switch)
  }

  getAll() {

    //Disabled/available buttons
    if (!this.isMasterGrid && this.filterCommandSpeedSwitch.fixtureId <= 0) {
      this.isAddBtnDisabled = true
      this.isEditBtnDisabled = true
      this.isDeleteBtnDisabled = true
      this.isRefreshBtnDisabled = true
      this.isFilter_noneBtnDisabled = true
      this.isFilter_listBtnDisabled = true
    }else {
      this.isAddBtnDisabled = false
      this.isEditBtnDisabled = false
      this.isDeleteBtnDisabled = false
      this.isRefreshBtnDisabled = false
      this.isFilter_noneBtnDisabled = false
      this.isFilter_listBtnDisabled = false
    }

    const params = Object.assign({}, {
        offset: this.offset,
        limit: this.limit
      },
      this.filterCommandSpeedSwitch
    )
    this.oSub = this.commandSpeedSwitchService.getAll(params).subscribe(commandSpeedSwitches => {

      //Link statusName
      let commandSwitchesName = commandSpeedSwitches;
      commandSwitchesName.forEach(currentCommand => {
        currentCommand.statusName = this.commandStatuses.find((currentStatus: CommandStatus) => currentStatus.id_command_status === currentCommand.statusId).name_command_status
      })
      //Link speedDirectionsName
      commandSwitchesName.forEach(currentCommand => {
        currentCommand.speedDirectionName = this.speedDirectiones.find((currentSpeedDirection: SpeedDirection) => currentSpeedDirection.id_speed_direction === currentCommand.speedDirectionId).name_speed_direction
      })

      this.commandSpeedSwitches = this.commandSpeedSwitches.concat(commandSwitchesName)
      this.noMoreCommand_switches = commandSpeedSwitches.length < STEP
      this.loading = false
      this.reloading = false
    })
  }

  loadMore() {
    this.offset += STEP
    this.loading = true
    this.getAll()
  }

  applyFilter(filter: FilterCommandSpeedSwitch) {
    this.commandSpeedSwitches = []
    this.offset = 0
    this.filterCommandSpeedSwitch = filter
    this.reloading = true
    this.getAll()
  }

  ins() {
    this.fixturecomspeedlistJqxgridComponent.ins()
  }

  upd() {
    this.fixturecomspeedlistJqxgridComponent.upd()
  }

  del() {
    this.fixturecomspeedlistJqxgridComponent.del()
  }


}
