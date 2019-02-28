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

import {CommandSwitchService} from "../../../../../shared/services/command/commandSwitch.service";
import {CommandSwitch} from "../../../../../shared/models/command/commandSwitch";
import {DateTimeFormat} from "../../../../../shared/classes/DateTimeFormat";


@Component({
  selector: 'app-fixturecom-form',
  templateUrl: './fixturecomedit-form.component.html',
  styleUrls: ['./fixturecomedit-form.component.css']
})
export class FixturecomeditFormComponent implements OnInit, OnDestroy, AfterViewInit {

  //variables from master component

  //determine the functions that need to be performed in the parent component
  @Output() onSaveEditwinBtn = new EventEmitter()

  //define variables - link to view objects
  @ViewChild('editWindow') editWindow: jqxWindowComponent
  @ViewChild('datebeg') datebeg: jqxDateTimeInputComponent
  @ViewChild('dateend') dateend: jqxDateTimeInputComponent
  // @ViewChild('jqxSliderWorkLevel') jqxSliderWorkLevel: jqxSliderComponent
  // @ViewChild('jqxSliderStandbyLevel') jqxSliderStandbyLevel: jqxSliderComponent
  @ViewChild('workLevel') workLevel: ElementRef
  @ViewChild('standbyLevel') standbyLevel: ElementRef
  @ViewChild('standbyLevelOutput') standbyLevelOutput: ElementRef
  @ViewChild('workLevelOutput') workLevelOutput: ElementRef

  //other variables
  fixtureId: number
  commandSwitchs: CommandSwitch[] = []
  oSub: Subscription
  typeWindow: string = ""
  flg_dateend: boolean = false

  constructor(private fixturecommandService: CommandSwitchService) {
  }

  ngOnInit() {
    this.workLevelOutput.nativeElement.value = this.workLevel.nativeElement.value
    this.standbyLevelOutput.nativeElement.value = this.standbyLevel.nativeElement.value
  }

  ngAfterViewInit() {
    this.dateend.disabled(!this.flg_dateend)
    this.datebeg.value(new Date())
    this.dateend.value(new Date())
    // this.datebeg.culture('ru-RU')
    // this.dateend.culture('ru-RU')
  }

  ngOnDestroy() {
    if (this.oSub) {
      this.oSub.unsubscribe()
    }
  }

  //perform insert/update fixture
  saveBtn() {
    if (!this.flg_dateend) {
      if (+this.workLevel.nativeElement.value > +this.standbyLevel.nativeElement.value) {
        this.saveCommand()
      } else {
        MaterialService.toast('Установите уровень рабочего режима больше уровня дежурного режима.')
      }
    } else {
      if (this.datebeg.ngValue < this.dateend.ngValue) {
        if (+this.workLevel.nativeElement.value > +this.standbyLevel.nativeElement.value) {
          this.saveCommand()
        } else {
          MaterialService.toast('Установите уровень рабочего режима больше уровня дежурного режима.')
        }
      } else {
        console.log(this.datebeg.ngValue)
        MaterialService.toast('Установите время начала действия команды меньше времени завершения действия команды.')
      }
    }
  }

  saveCommand() {
    let commandSwitch: CommandSwitch = new CommandSwitch
    //command switch on
    commandSwitch.fixtureId = this.fixtureId
    commandSwitch.startDateTime = new DateTimeFormat().fromDataPickerString(this.datebeg.ngValue)
    commandSwitch.workLevel = +this.workLevel.nativeElement.value
    commandSwitch.standbyLevel = +this.standbyLevel.nativeElement.value
    this.commandSwitchs[0] = commandSwitch

    //command switch off
    if (this.flg_dateend) {
      let commandSwitchOff: CommandSwitch = new CommandSwitch
      commandSwitchOff.fixtureId = this.fixtureId
      commandSwitchOff.startDateTime = new DateTimeFormat().fromDataPickerString(this.dateend.ngValue)
      commandSwitchOff.workLevel = 0
      commandSwitchOff.standbyLevel = 0
      this.commandSwitchs[1] = commandSwitchOff
    }

    this.oSub = this.fixturecommandService.send(this.commandSwitchs).subscribe(
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

  openWindow(fixtureId
               :
               number, typeWindow
               :
               string
  ) {
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

  onClicCheckBox() {
    this.dateend.disabled(!this.flg_dateend)
  }

  getWorkLevel(event) {
    this.workLevelOutput.nativeElement.value = event.target.value
  }

  getStandbyLevel(event) {
    this.standbyLevelOutput.nativeElement.value = event.target.value
  }

}
