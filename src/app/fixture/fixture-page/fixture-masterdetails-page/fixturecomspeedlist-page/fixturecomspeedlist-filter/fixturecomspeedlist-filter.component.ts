import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {jqxDateTimeInputComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxdatetimeinput';

import {
  CommandSpeedSwitchDflt,
  CommandStatus,
  FilterCommandSpeedSwitch,
  SpeedDirection,
} from '../../../../../shared/interfaces';
import {DateTimeFormat} from '../../../../../shared/classes/DateTimeFormat';
import {CommandSpeedSwitchService} from '../../../../../shared/services/command/commandSpeedSwitch.service';


@Component({
  selector: 'app-fixturecomspeedlist-filter',
  templateUrl: './fixturecomspeedlist-filter.component.html',
  styleUrls: ['./fixturecomspeedlist-filter.component.css']
})
export class FixturecomspeedlistFilterComponent implements OnInit {

  // variables from master component
  @Input() selectFixtureId: number;
  @Input() filterCommandSpeedSwitch: FilterCommandSpeedSwitch;
  @Input() commandStatuses: CommandStatus[];
  @Input() speedDirectiones: SpeedDirection[];

  // determine the functions that need to be performed in the parent component
  @Output() onFilter = new EventEmitter<FilterCommandSpeedSwitch>();

  // define variables - link to view objects
  @ViewChild('startDateTime') startDateTime: jqxDateTimeInputComponent;
  @ViewChild('endDateTime') endDateTime: jqxDateTimeInputComponent;

  // other variables
  isValid = true;
  statusId: number;
  speedDirectionId: number;
  nullVar = '';
  todayEndStart: any = {
    dataPicker: {
      start: () => new DateTimeFormat().toDataPickerString(new Date(new Date().setHours(0, 0, 0, 0))),
      end: () => new DateTimeFormat().toDataPickerString(new Date(new Date().setHours(23, 59, 59, 999)))
    }
  };
  commandSpeedSwitchDflt: CommandSpeedSwitchDflt;

  constructor(private commandSpeedSwitchService: CommandSpeedSwitchService) {
  }

  ngOnInit() {
    setTimeout(_ => this.startDateTime.setDate(this.todayEndStart.dataPicker.start()));
    setTimeout(_ => this.endDateTime.setDate(this.todayEndStart.dataPicker.end()));
    this.commandSpeedSwitchDflt = this.commandSpeedSwitchService.dfltParams();
    this.statusId = this.commandSpeedSwitchDflt.statusId; // значение получать из интерфейсного пакета (из таблицы значений по умолчанию) из БД
  }

  validate() {
    if (!(this.startDateTime.ngValue && this.endDateTime.ngValue && this.selectFixtureId && this.speedDirectionId)) {
      this.isValid = false;
      return;
    }
  }

  submitFilter() {
    if (this.startDateTime) {
      this.filterCommandSpeedSwitch.startDateTime = new DateTimeFormat().fromDataPickerString(this.startDateTime.ngValue);
    }
    if (this.endDateTime) {
      this.filterCommandSpeedSwitch.endDateTime = new DateTimeFormat().fromDataPickerString(this.endDateTime.ngValue);
    }
    this.filterCommandSpeedSwitch.statusId = this.statusId.toString();
    this.filterCommandSpeedSwitch.speedDirectionId = this.speedDirectionId.toString();

    this.onFilter.emit(this.filterCommandSpeedSwitch);
  }
}
