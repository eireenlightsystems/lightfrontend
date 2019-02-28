import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {jqxDateTimeInputComponent} from "jqwidgets-scripts/jqwidgets-ts/angular_jqxdatetimeinput";

import {CommandStatus, CommandSwitchDflt, FilterCommandSwitch,} from "../../../../../shared/interfaces";
import {DateTimeFormat} from "../../../../../shared/classes/DateTimeFormat";
import {CommandSwitchService} from "../../../../../shared/services/command/commandSwitch.service";


@Component({
  selector: 'app-fixturecomlist-filter',
  templateUrl: './fixturecomlist-filter.component.html',
  styleUrls: ['./fixturecomlist-filter.component.css']
})
export class FixturecomlistFilterComponent implements OnInit {

  //variables from master component
  @Input() id_fixture_select: number
  @Input() filterCommandSwitch: FilterCommandSwitch
  @Input() commandStatuses: CommandStatus[]

  //determine the functions that need to be performed in the parent component
  @Output() onFilter = new EventEmitter<FilterCommandSwitch>()

  //define variables - link to view objects
  @ViewChild('startDateTime') startDateTime: jqxDateTimeInputComponent
  @ViewChild('endDateTime') endDateTime: jqxDateTimeInputComponent

  //other variables
  isValid = true
  statusId: number
  todayEndStart: any = {
    dataPicker: {
      start: () => new DateTimeFormat().toDataPickerString(new Date(new Date().setHours(0, 0, 0, 0))),
      end: () => new DateTimeFormat().toDataPickerString(new Date(new Date().setHours(23, 59, 59, 999)))
    }
  }
  commandSwitchDflt: CommandSwitchDflt

  constructor(private commandSwitchService: CommandSwitchService) {
  }

  ngOnInit() {
    setTimeout(_=> this.startDateTime.setDate(this.todayEndStart.dataPicker.start()))
    setTimeout(_=> this.endDateTime.setDate(this.todayEndStart.dataPicker.end()))
    this.commandSwitchDflt = this.commandSwitchService.dfltParams()
    this.statusId = this.commandSwitchDflt.statusId // значение получать из интерфейсного пакета (из таблицы значений по умолчанию) из БД
  }

  validate() {
    if (!(this.startDateTime.ngValue && this.endDateTime.ngValue && this.id_fixture_select)) {
      this.isValid = false
      return
    }
  }

  submitFilter() {
    // const filter: FilterCommandSwitch = {
    //   startDateTime: "",
    //   endDateTime: "",
    //   fixtureId: this.id_fixture_select
    // }

    if (this.startDateTime) {
      this.filterCommandSwitch.startDateTime = new DateTimeFormat().fromDataPickerString(this.startDateTime.ngValue)
    }
    if (this.endDateTime) {
      this.filterCommandSwitch.endDateTime = new DateTimeFormat().fromDataPickerString(this.endDateTime.ngValue)
    }
    if (this.statusId) {
      this.filterCommandSwitch.statusId = this.statusId
    }

    this.onFilter.emit(this.filterCommandSwitch)
  }
}
