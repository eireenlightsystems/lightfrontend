// angular lib
import {Component, EventEmitter, OnInit, OnDestroy, Output, ViewChild, AfterViewInit, Input, HostListener} from '@angular/core';
import {Subscription} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {MatSnackBar} from '@angular/material/snack-bar';
// jqwidgets
import {jqxWindowComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxwindow';
import {jqxDateTimeInputComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxdatetimeinput';
// app interfaces
import {CommandSwitch} from '../../../../../shared/interfaces';
// app services
import {CommandSwitchService} from '../../../../../shared/services/command/commandSwitch.service';
// app components
import {DateTimeFormat} from '../../../../../shared/classes/DateTimeFormat';


@Component({
  selector: 'app-fixturecomedit-switchoff-form',
  templateUrl: './fixturecomedit-switchoff-form.component.html',
  styleUrls: ['./fixturecomedit-switchoff-form.component.css']
})
export class FixturecomeditSwitchoffFormComponent implements OnInit, OnDestroy, AfterViewInit {

  // variables from parent component
  @Input() fixtureIds: number[];

  // determine the functions that need to be performed in the parent component
  @Output() onSaveEditFormSwitchOffBtn = new EventEmitter();
  @Output() onDestroyEditFormSwitchOff = new EventEmitter();

  // define variables - link to view objects
  @ViewChild('editWindow', {static: false}) editWindow: jqxWindowComponent;
  @ViewChild('dateend', {static: false}) dateend: jqxDateTimeInputComponent;

  // other variables
  commandSwitchs: CommandSwitch[] = [];
  oSub: Subscription;
  screenHeight: number;
  screenWidth: number;
  coordinateX: number;
  coordinateY: number;
  widthEditWindow = 500;
  heightEditWindow = 175;

  constructor(private _snackBar: MatSnackBar,
              // service
              public translate: TranslateService,
              private fixturecommandService: CommandSwitchService) {
    this.getScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    this.getCoordinate();
  }

  getCoordinate() {
    if (this.widthEditWindow < this.screenWidth) {
      this.coordinateX = (this.screenWidth - this.widthEditWindow) / 2;
    } else {
      this.coordinateX = 20;
    }
    if (this.heightEditWindow < this.screenHeight) {
      this.coordinateY = (this.screenHeight - this.heightEditWindow) / 2;
    } else {
      this.coordinateY = 20;
    }
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // this.position({x: this.coordinateX, y: this.coordinateY});
    this.dateend.value(new Date());
  }

  ngOnDestroy() {
    this.destroy();
  }

  destroy() {
    if (this.editWindow) {
      this.editWindow.destroy();
    }
    if (this.oSub) {
      this.oSub.unsubscribe();
    }
  }

  closeDestroy() {
    this.onDestroyEditFormSwitchOff.emit();
  }

  position(coord: any) {
    this.editWindow.position({x: coord.x, y: coord.y});
  }

  // perform insert/update fixture
  saveBtn() {
    // command switch off
    for (let i = 0; i < this.fixtureIds.length; i++) {
      const commandSwitchOff: CommandSwitch = new CommandSwitch();
      commandSwitchOff.fixtureId = this.fixtureIds[i];
      commandSwitchOff.startDateTime = new DateTimeFormat().fromDataPickerString(this.dateend.ngValue);
      commandSwitchOff.workLevel = 0;
      commandSwitchOff.standbyLevel = 0;
      this.commandSwitchs[i] = commandSwitchOff;
    }

    this.oSub = this.fixturecommandService.send(this.commandSwitchs).subscribe(
      response => {

      },
      error =>
        this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok')),
      () => {
        // close edit window
        this.closeDestroy();
        // update data source
        this.onSaveEditFormSwitchOffBtn.emit();
      }
    );
  }

  cancelBtn() {
    this.closeDestroy();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }
}
