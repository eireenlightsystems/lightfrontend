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
import {Subscription} from 'rxjs';
import {MaterialService} from '../../../../../shared/classes/material.service';

import {jqxWindowComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxwindow';
import {jqxDateTimeInputComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxdatetimeinput';
import {jqxDropDownListComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxdropdownlist';

import {DateTimeFormat} from '../../../../../shared/classes/DateTimeFormat';
import {CommandSpeedSwitch, CommandType} from '../../../../../shared/interfaces';
import {CommandSpeedSwitchService} from '../../../../../shared/services/command/commandSpeedSwitch.service';


@Component({
  selector: 'app-fixturecomspeededit-form',
  templateUrl: './fixturecomspeededit-form.component.html',
  styleUrls: ['./fixturecomspeededit-form.component.css']
})
export class FixturecomspeededitFormComponent implements OnInit, AfterViewInit, OnDestroy {

  // variables from master component
  @Input() speedDirectiones: CommandType[];

  // determine the functions that need to be performed in the parent component
  @Output() onSaveEditwinBtn = new EventEmitter();

  // define variables - link to view objects
  @ViewChild('editWindow') editWindow: jqxWindowComponent;
  @ViewChild('datebeg') datebeg: jqxDateTimeInputComponent;
  @ViewChild('speedLevel') speedLevel: ElementRef;
  @ViewChild('speedLevelOutput') speedLevelOutput: ElementRef;
  @ViewChild('speedDirectionId') id_speed_direction: jqxDropDownListComponent;

  // other variables
  fixtureId: number;
  commandSpeedSwitches: CommandSpeedSwitch[] = [];
  oSub: Subscription;
  typeWindow = '';

  // define variables for drop-down lists in the edit form
  source_speedDirection: any;
  dataAdapter_speedDirection: any;
  speedDirectionId_index: number;

  constructor(private fixturecommandService: CommandSpeedSwitchService) {
  }

  ngOnInit() {
    this.speedLevel.nativeElement.value = 10;
    this.speedLevelOutput.nativeElement.value = this.speedLevel.nativeElement.value;
  }

  ngAfterViewInit() {
    this.datebeg.value(new Date());
  }

  ngOnDestroy() {
    if (this.oSub) {
      this.oSub.unsubscribe();
    }
  }

  // updating data sources for drop-down lists in the form
  refresh_refbook() {
    this.source_speedDirection =
      {
        datatype: 'array',
        localdata: this.speedDirectiones,
        id: 'id',
      };
    this.dataAdapter_speedDirection = new jqx.dataAdapter(this.source_speedDirection);
  }

  // define default values for the form
  define_defaultvalues() {
    if (this.typeWindow === 'ins') {
      this.speedDirectionId_index = 0;
    }
  }

  // perform insert/update fixture
  saveBtn() {
    const commandSpeedSwitch: CommandSpeedSwitch = new CommandSpeedSwitch;
    // command switch on
    commandSpeedSwitch.fixtureId = this.fixtureId;
    commandSpeedSwitch.startDateTime = new DateTimeFormat().fromDataPickerString(this.datebeg.ngValue);
    commandSpeedSwitch.speed = +this.speedLevel.nativeElement.value;
    commandSpeedSwitch.speedDirectionId = +this.id_speed_direction.val();
    this.commandSpeedSwitches[0] = commandSpeedSwitch;

    this.oSub = this.fixturecommandService.send(this.commandSpeedSwitches).subscribe(
      response => {
        MaterialService.toast(`Команда отправлена.`);
      },
      error => MaterialService.toast(error.error.message),
      () => {
        // close edit window
        this.hideWindow();
        // update data source
        this.onSaveEditwinBtn.emit();
      }
    );
  }

  cancelBtn() {
    this.hideWindow();
  }

  openWindow(fixtureId: number, typeWindow: string) {
    this.typeWindow = typeWindow;
    this.refresh_refbook();
    this.define_defaultvalues();
    this.fixtureId = fixtureId;

    this.editWindow.open();
  }

  destroyWindow() {
    this.editWindow.destroy();
  }

  hideWindow() {
    this.editWindow.hide();
  }

  positionWindow(coord: any) {
    this.editWindow.position({x: coord.x, y: coord.y});
  }

  getSpeedLevel(event) {
    this.speedLevelOutput.nativeElement.value = event.target.value;
  }
}
