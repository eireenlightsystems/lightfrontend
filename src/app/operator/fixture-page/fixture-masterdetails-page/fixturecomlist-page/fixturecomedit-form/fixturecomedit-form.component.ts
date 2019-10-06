// angular lib
import {Component, EventEmitter, OnInit, OnDestroy, Output, ViewChild, AfterViewInit, ElementRef, Input, HostListener} from '@angular/core';
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
  selector: 'app-fixturecom-form',
  templateUrl: './fixturecomedit-form.component.html',
  styleUrls: ['./fixturecomedit-form.component.css']
})
export class FixturecomeditFormComponent implements OnInit, OnDestroy, AfterViewInit {

  // variables from parent component
  @Input() fixtureIds: number[];

  // determine the functions that need to be performed in the parent component
  @Output() onSaveEditFormSwitchOnBtn = new EventEmitter();
  @Output() onDestroyEditFormSwitchOn = new EventEmitter();

  // define variables - link to view objects
  @ViewChild('editWindow', {static: false}) editWindow: jqxWindowComponent;
  @ViewChild('datebeg', {static: false}) datebeg: jqxDateTimeInputComponent;
  @ViewChild('dateend', {static: false}) dateend: jqxDateTimeInputComponent;

  // other variables
  oSub: Subscription;
  flg_dateend = false;
  workLevelProc = 100;
  standbyLevelProc = 70;
  screenHeight: number;
  screenWidth: number;
  coordinateX: number;
  coordinateY: number;
  widthEditWindow = 500;
  heightEditWindow = 465;


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
    this.dateend.disabled(!this.flg_dateend);
    this.datebeg.value(new Date());
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
    this.onDestroyEditFormSwitchOn.emit();
  }

  position(coord: any) {
    this.editWindow.position({x: coord.x, y: coord.y});
  }

  saveBtn() {
    if (!this.flg_dateend) {
      if (+this.workLevelProc > +this.standbyLevelProc) {
        this.saveCommand();
      } else {
        this.openSnackBar(
          this.translate.instant('site.menu.operator.fixture-page.fixture-masterdetails-page.fixturecomlist-page.warning1-mode'),
          this.translate.instant('site.forms.editforms.ok'));
      }
    } else {
      if (this.datebeg.ngValue < this.dateend.ngValue) {
        if (+this.workLevelProc > +this.standbyLevelProc) {
          this.saveCommand();
        } else {
          this.openSnackBar(
            this.translate.instant('site.menu.operator.fixture-page.fixture-masterdetails-page.fixturecomlist-page.warning1-mode'),
            this.translate.instant('site.forms.editforms.ok'));
        }
      } else {
        this.openSnackBar(
          this.translate.instant('site.menu.operator.fixture-page.fixture-masterdetails-page.fixturecomlist-page.warning2-mode'),
          this.translate.instant('site.forms.editforms.ok'));
      }
    }
  }

  cancelBtn() {
    this.closeDestroy();
  }

  saveCommand() {
    const commandSwitchs = [];
    // command switch on
    for (let i = 0; i < this.fixtureIds.length; i++) {
      const commandSwitch: CommandSwitch = new CommandSwitch();
      commandSwitch.fixtureId = this.fixtureIds[i];
      commandSwitch.startDateTime = new DateTimeFormat().fromDataPickerString(this.datebeg.ngValue);
      commandSwitch.workLevel = this.workLevelProc;
      commandSwitch.standbyLevel = this.standbyLevelProc;
      commandSwitchs[i] = commandSwitch;
    }
    // command switch off
    if (this.flg_dateend) {
      for (let i = 0; i < this.fixtureIds.length; i++) {
        const commandSwitchOff: CommandSwitch = new CommandSwitch();
        commandSwitchOff.fixtureId = this.fixtureIds[i];
        commandSwitchOff.startDateTime = new DateTimeFormat().fromDataPickerString(this.dateend.ngValue);
        commandSwitchOff.workLevel = 0;
        commandSwitchOff.standbyLevel = 0;
        commandSwitchs[this.fixtureIds.length + i] = commandSwitchOff;
      }
    }
    this.oSub = this.fixturecommandService.send(commandSwitchs).subscribe(
      response => {
      },
      error =>
        this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok')),
      () => {
        // close edit window
        this.closeDestroy();
        // update data source
        this.onSaveEditFormSwitchOnBtn.emit();
      }
    );
  }

  onClicCheckBox() {
    this.dateend.disabled(!this.flg_dateend);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }
}
