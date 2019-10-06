// angular lib
import {Component, EventEmitter, Input, OnInit, OnDestroy, Output, ViewChild, AfterViewInit, ElementRef} from '@angular/core';
import {Subscription} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {MatSnackBar} from '@angular/material/snack-bar';
// jqwidgets
import {jqxWindowComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxwindow';
import {jqxDateTimeInputComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxdatetimeinput';
import {jqxDropDownListComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxdropdownlist';
// app interfaces
import {CommandSpeedSwitch, CommandType} from '../../../../../shared/interfaces';
// app services
import {CommandSpeedSwitchService} from '../../../../../shared/services/command/commandSpeedSwitch.service';
// app components
import {DateTimeFormat} from '../../../../../shared/classes/DateTimeFormat';


@Component({
  selector: 'app-fixturecomspeededit-form',
  templateUrl: './fixturecomspeededit-form.component.html',
  styleUrls: ['./fixturecomspeededit-form.component.css']
})
export class FixturecomspeededitFormComponent implements OnInit, AfterViewInit, OnDestroy {

  // variables from parent component
  @Input() fixtureIds: number[];
  @Input() speedDirectiones: CommandType[];

  // determine the functions that need to be performed in the parent component
  @Output() onSaveEditFormSpeedBtn = new EventEmitter();
  @Output() onDestroyEditFormSpeed = new EventEmitter();

  // define variables - link to view objects
  @ViewChild('editWindow', {static: false}) editWindow: jqxWindowComponent;
  @ViewChild('datebeg', {static: false}) datebeg: jqxDateTimeInputComponent;
  @ViewChild('speedDirectionId', {static: false}) id_speed_direction: jqxDropDownListComponent;

  // other variables
  commandSpeedSwitches: CommandSpeedSwitch[] = [];
  oSub: Subscription;
  speedLevelSec = 10;

  // define variables for drop-down lists in the edit form
  source_speedDirection: any;
  dataAdapter_speedDirection: any;
  speedDirectionId_index: number;


  constructor(private _snackBar: MatSnackBar,
              // service
              public translate: TranslateService,
              private fixturecommandService: CommandSpeedSwitchService) {
  }

  ngOnInit() {
    this.refresh_refbook();
    this.define_defaultvalues();
  }

  ngAfterViewInit() {
    this.position({x: 600, y: 90});
    this.datebeg.value(new Date());
  }

  ngOnDestroy() {
    this.destroy();
  }

  destroy() {
    if (this.oSub) {
      this.oSub.unsubscribe();
    }
    if (this.editWindow) {
      this.editWindow.destroy();
    }
  }

  closeDestroy() {
    this.onDestroyEditFormSpeed.emit();
  }

  position(coord: any) {
    this.editWindow.position({x: coord.x, y: coord.y});
  }

  saveBtn() {
    const commandSpeedSwitch: CommandSpeedSwitch = new CommandSpeedSwitch;
    // command switch on
    commandSpeedSwitch.fixtureId = this.fixtureIds[0];
    commandSpeedSwitch.startDateTime = new DateTimeFormat().fromDataPickerString(this.datebeg.ngValue);
    commandSpeedSwitch.speed = this.speedLevelSec;
    commandSpeedSwitch.speedDirectionId = +this.id_speed_direction.val();
    this.commandSpeedSwitches[0] = commandSpeedSwitch;

    this.oSub = this.fixturecommandService.send(this.commandSpeedSwitches).subscribe(
      response => {

      },
      error =>
        this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok')),
      () => {
        // close edit window
        this.closeDestroy();
        // update data source
        this.onSaveEditFormSpeedBtn.emit();
      }
    );
  }

  cancelBtn() {
    this.closeDestroy();
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
    this.speedDirectionId_index = 0;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }
}
