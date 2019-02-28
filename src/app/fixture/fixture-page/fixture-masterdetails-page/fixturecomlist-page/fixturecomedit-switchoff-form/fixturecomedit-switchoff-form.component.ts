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
import {jqxDateTimeInputComponent} from "jqwidgets-scripts/jqwidgets-ts/angular_jqxdatetimeinput";

import {CommandSwitchService} from "../../../../../shared/services/command/commandSwitch.service";
import {CommandSwitch} from "../../../../../shared/models/command/commandSwitch";
import {DateTimeFormat} from "../../../../../shared/classes/DateTimeFormat";

@Component({
  selector: 'app-fixturecomedit-switchoff-form',
  templateUrl: './fixturecomedit-switchoff-form.component.html',
  styleUrls: ['./fixturecomedit-switchoff-form.component.css']
})
export class FixturecomeditSwitchoffFormComponent implements OnInit, OnDestroy, AfterViewInit {

  //variables from master component

  //determine the functions that need to be performed in the parent component
  @Output() onSaveEditSwitchOffwinBtn = new EventEmitter()

  //define variables - link to view objects
  @ViewChild('editWindow') editWindow: jqxWindowComponent
  @ViewChild('dateend') dateend: jqxDateTimeInputComponent

  //other variables
  fixtureId: number
  commandSwitchs: CommandSwitch[] = []
  // commandSwitch: CommandSwitch = new CommandSwitch
  oSub: Subscription
  typeWindow: string = ""

  constructor(private fixturecommandService: CommandSwitchService) {
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.dateend.value(new Date())
  }

  ngOnDestroy() {
    if (this.oSub) {
      this.oSub.unsubscribe()
    }
  }

  //perform insert/update fixture
  saveBtn() {
    //command switch off
    let commandSwitchOff: CommandSwitch = new CommandSwitch
    commandSwitchOff.fixtureId = this.fixtureId
    commandSwitchOff.startDateTime = new DateTimeFormat().fromDataPickerString(this.dateend.ngValue)
    commandSwitchOff.workLevel = 0
    commandSwitchOff.standbyLevel = 0
    this.commandSwitchs[0] = commandSwitchOff

    this.oSub = this.fixturecommandService.send(this.commandSwitchs).subscribe(
      response => {
        // MaterialService.toast(`Команда на выключение отправлена.`)
      },
      response => MaterialService.toast(response.error.message),
      () => {
        //close edit window
        this.hideWindow();
        //update data source
        this.onSaveEditSwitchOffwinBtn.emit()
      }
    )
  }

  cancelBtn() {
    this.hideWindow()
  }

  openWindow(fixtureId: number, typeWindow: string) {
    // this.saveFixture = saveFixture
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

}
