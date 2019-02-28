import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnDestroy,
  Output,
  ViewChild,
  AfterViewInit, ElementRef
} from '@angular/core';
import {Subscription} from "rxjs";
import {MaterialService} from "../../../../../shared/classes/material.service";
import {jqxWindowComponent} from "jqwidgets-scripts/jqwidgets-ts/angular_jqxwindow";
import {jqxSliderComponent} from "jqwidgets-scripts/jqwidgets-ts/angular_jqxslider";
import {jqxDateTimeInputComponent} from "jqwidgets-scripts/jqwidgets-ts/angular_jqxdatetimeinput";

import {DateTimeFormat} from "../../../../../shared/classes/DateTimeFormat";
import {SpeedDirection} from "../../../../../shared/interfaces";
import {CommandSpeedSwitch} from 'src/app/shared/models/command/commandSpeedSwitch';
import {CommandSpeedSwitchService} from "../../../../../shared/services/command/commandSpeedSwitch.service";
import {jqxDropDownListComponent} from "jqwidgets-scripts/jqwidgets-ts/angular_jqxdropdownlist";

@Component({
  selector: 'app-fixturecomspeededit-form',
  templateUrl: './fixturecomspeededit-form.component.html',
  styleUrls: ['./fixturecomspeededit-form.component.css']
})
export class FixturecomspeededitFormComponent implements OnInit, OnDestroy {

  //variables from master component
  @Input() speedDirectiones: SpeedDirection[]

  //determine the functions that need to be performed in the parent component
  @Output() onSaveEditwinBtn = new EventEmitter()

  //define variables - link to view objects
  @ViewChild('editWindow') editWindow: jqxWindowComponent
  @ViewChild('datebeg') datebeg: jqxDateTimeInputComponent
  @ViewChild('speedLevel') speedLevel: ElementRef
  @ViewChild('speedLevelOutput') speedLevelOutput: ElementRef
  @ViewChild('id_speed_direction') id_speed_direction: jqxDropDownListComponent

  //other variables
  fixtureId: number
  commandSpeedSwitches: CommandSpeedSwitch[] = []
  oSub: Subscription
  typeWindow: string = ""

  //define variables for drop-down lists in the edit form
  source_speedDirection: any
  dataAdapter_speedDirection: any
  id_speed_direction_index: number

  constructor(private fixturecommandService: CommandSpeedSwitchService) {
  }

  ngOnInit() {
    this.speedLevel.nativeElement.value = 10
    this.speedLevelOutput.nativeElement.value = this.speedLevel.nativeElement.value
  }

  ngOnDestroy() {
    if (this.oSub) {
      this.oSub.unsubscribe()
    }
  }

  //updating data sources for drop-down lists in the form
  refresh_refbook() {
    this.source_speedDirection =
      {
        datatype: 'array',
        localdata: this.speedDirectiones,
        id: 'id_speed_direction',
      };
    this.dataAdapter_speedDirection = new jqx.dataAdapter(this.source_speedDirection);
  }

  //define default values for the form
  define_defaultvalues() {
    if (this.typeWindow === "ins") {
      this.id_speed_direction_index = 0
    }
  }

  //perform insert/update fixture
  saveBtn() {
    let commandSpeedSwitch: CommandSpeedSwitch = new CommandSpeedSwitch
    //command switch on
    commandSpeedSwitch.fixtureId = this.fixtureId
    commandSpeedSwitch.startDateTime = new DateTimeFormat().fromDataPickerString(this.datebeg.ngValue)
    commandSpeedSwitch.speed = +this.speedLevel.nativeElement.value
    commandSpeedSwitch.speedDirectionId = +this.id_speed_direction.val();
    this.commandSpeedSwitches[0] = commandSpeedSwitch

    this.oSub = this.fixturecommandService.send(this.commandSpeedSwitches).subscribe(
      response => {
        // MaterialService.toast(`Команда на включение отправлена.`)
      },
      response => MaterialService.toast(response.error.message),
      () => {
        //close edit window
        this.hideWindow();
        //update data source
        this.onSaveEditwinBtn.emit()
      }
    )
  }

  cancelBtn() {
    this.hideWindow()
  }

  openWindow(fixtureId: number, typeWindow: string) {
    this.refresh_refbook()
    this.define_defaultvalues()
    this.fixtureId = fixtureId
    this.typeWindow = typeWindow
    this.editWindow.open()
  }

  destroyWindow() {
    this.editWindow.destroy()
  }

  hideWindow() {
    this.editWindow.hide();
  }

  positionWindow(coord: any) {
    this.editWindow.position({x: coord.x, y: coord.y})
  }

  getSpeedLevel(event) {
    this.speedLevelOutput.nativeElement.value = event.target.value
  }
}
