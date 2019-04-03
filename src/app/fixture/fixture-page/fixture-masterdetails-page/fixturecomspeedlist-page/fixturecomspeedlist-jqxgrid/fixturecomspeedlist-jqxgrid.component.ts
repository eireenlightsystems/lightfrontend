import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {MaterialService} from '../../../../../shared/classes/material.service';
import {jqxGridComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid';
import {jqxListBoxComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxlistbox';
import {jqxButtonComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxbuttons';

import {CommandSpeedSwitch} from '../../../../../shared/models/command/commandSpeedSwitch';
import {EventWindowComponent} from '../../../../../shared/components/event-window/event-window.component';
import {FixturecomspeededitFormComponent} from '../fixturecomspeededit-form/fixturecomspeededit-form.component';
import {CommandSpeedSwitchService} from '../../../../../shared/services/command/commandSpeedSwitch.service';
import {SpeedDirection} from '../../../../../shared/interfaces';

@Component({
  selector: 'app-fixturecomspeedlist-jqxgrid',
  templateUrl: './fixturecomspeedlist-jqxgrid.component.html',
  styleUrls: ['./fixturecomspeedlist-jqxgrid.component.css']
})
export class FixturecomspeedlistJqxgridComponent implements OnInit, OnDestroy, AfterViewInit {

  // variables from master component
  @Input() commandSpeedSwitches: CommandSpeedSwitch[];
  @Input() speedDirectiones: SpeedDirection[];

  @Input() heightGrid: number;
  @Input() selectionmode: string;
  @Input() isMasterGrid: boolean;
  @Input() selectFixtureId: number;

  // determine the functions that need to be performed in the parent component
  @Output() onRefreshGrid = new EventEmitter();
  @Output() onRefreshChildGrid = new EventEmitter<number>();

  // define variables - link to view objects
  @ViewChild('myListBox') myListBox: jqxListBoxComponent;
  @ViewChild('myGrid') myGrid: jqxGridComponent;
  @ViewChild('editWindow') editWindow: FixturecomspeededitFormComponent;
  @ViewChild('eventWindow') eventWindow: EventWindowComponent;
  @ViewChild('warningEventWindow') warningEventWindow: string;
  @ViewChild('okButton') okButton: jqxButtonComponent;

  // other variables
  selectCommandSpeedSwitch: CommandSpeedSwitch = new CommandSpeedSwitch();
  oSub: Subscription;
  editrow: number;
  islistBoxVisible = false;
  commandIds: number[] = [];

  // define the data source for the table
  source_jqxgrid: any =
    {
      datatype: 'array',
      localdata: this.commandSpeedSwitches,
      id: 'commandId',

      sortcolumn: ['startDateTime'],
      sortdirection: 'desc'
    };
  dataAdapter_jqxgrid: any = new jqx.dataAdapter(this.source_jqxgrid);

  // define columns for table
  columns: any[] =
    [
      {text: 'commandId', datafield: 'commandId', width: 150, hidden: true},
      {text: 'Время начала', datafield: 'startDateTime', width: 150},

      {text: 'Скорость, сек', datafield: 'speed', width: 200},
      {text: 'Статус', datafield: 'statusName', width: 200},
      {text: 'Тип команды', datafield: 'speedDirectionName', width: 300},
    ];

  // define a data source for filtering table columns
  listBoxSource: any[] =
    [
      {label: 'commandId', value: 'commandId', checked: false},
      {label: 'Время начала', value: 'startDateTime', checked: true},

      {label: 'Скорость, сек', value: 'speed', checked: true},
      {label: 'Статус', value: 'statusName', checked: true},
      {label: 'Тип команды', value: 'speedDirectionName', checked: true},
    ];


  constructor(private commandSpeedSwitchService: CommandSpeedSwitchService) {
  }

  ngOnInit() {
    this.refreshGrid();
  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy() {
    if (this.oSub) {
      this.oSub.unsubscribe();
    }
    if (this.myListBox) {
      this.myListBox.destroy();
    }
    if (this.myGrid) {
      this.myGrid.destroy();
    }
    if (this.editWindow) {
      this.editWindow.destroyWindow();
    }
    if (this.eventWindow) {
      this.eventWindow.destroyEventWindow();
    }
  }

  // TABLE

  // refresh table
  refreshGrid() {
    this.source_jqxgrid.localdata = this.commandSpeedSwitches;
    this.myGrid.updatebounddata('data');
  }

  // define width of table
  getWidth(): any {
    if (document.body.offsetWidth > 1600) {
      if (this.islistBoxVisible) {
        return '85%';
      } else {
        return '99.8%';
      }
    } else if (document.body.offsetWidth > 1400) {
      if (this.islistBoxVisible) {
        return '85%';
      } else {
        return '99.8%';
      }
    } else if (document.body.offsetWidth > 1200) {
      if (this.islistBoxVisible) {
        return '80%';
      } else {
        return '99.8%';
      }
    } else if (document.body.offsetWidth > 1000) {
      if (this.islistBoxVisible) {
        return '75%';
      } else {
        return '99.8%';
      }
    } else if (document.body.offsetWidth > 800) {
      if (this.islistBoxVisible) {
        return '70%';
      } else {
        return '99.8%';
      }
    } else if (document.body.offsetWidth > 600) {
      if (this.islistBoxVisible) {
        return '65%';
      } else {
        return '99.8%';
      }
    } else {
      if (this.islistBoxVisible) {
        return '40%';
      } else {
        return '99.8%';
      }
    }
  }

  // table filtering
  myListBoxOnCheckChange(event: any) {
    this.myGrid.beginupdate();
    if (event.args.checked) {
      this.myGrid.showcolumn(event.args.value);
    } else {
      this.myGrid.hidecolumn(event.args.value);
    }
    this.myGrid.endupdate();
  };

  // functions-events when allocating a string
  onRowSelect(event: any) {
    if (event.args.row
    ) {
      this.selectCommandSpeedSwitch = event.args.row;
      this.editrow = this.selectCommandSpeedSwitch.commandId;

      // refresh child grid
      if (this.isMasterGrid) {
        this.onRefreshChildGrid.emit(this.selectCommandSpeedSwitch.commandId);
      }
    }
  };


// INSERT, UPDATE, DELETE

  // insert
  ins() {
    this.editWindow.positionWindow({x: 600, y: 90});
    this.editWindow.openWindow(this.selectFixtureId, 'ins');
  }

  // update
  upd() {
    this.editWindow.positionWindow({x: 600, y: 90});
    this.editWindow.openWindow(this.selectFixtureId, 'upd');
  }

  saveEditwinBtn() {
    // refresh table
    this.onRefreshGrid.emit();
  }

  saveEditSwitchOffwinBtn() {
    // refresh table
    this.onRefreshGrid.emit();
  }

  // delete
  del() {
    if (this.selectCommandSpeedSwitch.commandId) {

      this.commandIds = [];
      for (let i = 0; i < this.myGrid.widgetObject.selectedrowindexes.length; i++) {
        this.commandIds[i] = this.source_jqxgrid.localdata[this.myGrid.widgetObject.selectedrowindexes[i]].commandId;
      }

      this.eventWindow.okButtonDisabled(false);
      if (this.commandIds.length > 1) {
        this.warningEventWindow = `Удалить команды?`;
      } else {
        this.warningEventWindow = `Удалить команду id = "${this.selectCommandSpeedSwitch.commandId}"?`;
      }
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow = `Вам следует выбрать команду для удаления`;
    }
    this.eventWindow.openEventWindow();
  }

  okEvenwinBtn() {
    if (this.commandIds.length >= 0) {
      this.commandSpeedSwitchService.del(this.commandIds).subscribe(
        response => {
          MaterialService.toast('Комманды удалены!');
        },
        error => MaterialService.toast(error.error.message),
        () => {
          this.onRefreshGrid.emit();
        }
      );
    }
  }

}
