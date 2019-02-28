import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {MaterialService} from '../../../../../shared/classes/material.service'
import {jqxGridComponent} from "jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid";
import {jqxListBoxComponent} from "jqwidgets-scripts/jqwidgets-ts/angular_jqxlistbox";
import {jqxButtonComponent} from "jqwidgets-scripts/jqwidgets-ts/angular_jqxbuttons";

import {CommandSpeedSwitch} from '../../../../../shared/models/command/commandSpeedSwitch'
import {EventWindowComponent} from "../../../../../shared/components/event-window/event-window.component";
import {FixturecomspeededitFormComponent} from "../fixturecomspeededit-form/fixturecomspeededit-form.component";
import {CommandSpeedSwitchService} from "../../../../../shared/services/command/commandSpeedSwitch.service";
import {SpeedDirection} from "../../../../../shared/interfaces";

@Component({
  selector: 'app-fixturecomspeedlist-jqxgrid',
  templateUrl: './fixturecomspeedlist-jqxgrid.component.html',
  styleUrls: ['./fixturecomspeedlist-jqxgrid.component.css']
})
export class FixturecomspeedlistJqxgridComponent implements OnInit {

  //variables from master component
  @Input() commandSpeedSwitches: CommandSpeedSwitch[]
  @Input() speedDirectiones: SpeedDirection[]

  @Input() heightGrid: number
  @Input() selectionmode: string
  @Input() isMasterGrid: boolean
  @Input() id_fixture_select: number

  //determine the functions that need to be performed in the parent component
  @Output() onRefreshGrid = new EventEmitter()
  @Output() onRefreshChildGrid = new EventEmitter<number>()

  //define variables - link to view objects
  @ViewChild('myListBox') myListBox: jqxListBoxComponent
  @ViewChild('myGrid') myGrid: jqxGridComponent
  @ViewChild('editWindow') editWindow: FixturecomspeededitFormComponent
  @ViewChild('eventWindow') eventWindow: EventWindowComponent
  @ViewChild('warningEventWindow') warningEventWindow: string
  @ViewChild('okButton') okButton: jqxButtonComponent

  //other variables
  selectCommandSpeedSwitch: CommandSpeedSwitch = new CommandSpeedSwitch()
  oSub: Subscription
  editrow: number
  rowcount: number = 0
  islistBoxVisible: boolean = false
  // actionEventWindow: string = ""
  commandIds: number[] = []

  constructor(private commandSpeedSwitchService: CommandSpeedSwitchService) {
  }

  ngOnInit() {
    this.refreshGrid();
  }

  ngAfterViewInit(): void {
    this.refreshListBox()
  }

  ngOnDestroy() {
    if (this.oSub) {
      this.oSub.unsubscribe()
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

  //TABLE

  //refresh table
  refreshGrid() {
    if (this.commandSpeedSwitches && this.commandSpeedSwitches.length > 0 && this.rowcount !== this.commandSpeedSwitches.length) {
      this.source_jqxgrid.localdata = this.commandSpeedSwitches;
      this.rowcount = this.commandSpeedSwitches.length;
      // this.myGrid.refresh();
      // this.myGrid.refreshdata();
      this.myGrid.updatebounddata('data');
      // this.myGrid.updatebounddata('cells');// passing `cells` to the `updatebounddata` method will refresh only the cells values when the new rows count is equal to the previous rows count.
    }
  }

  //define width of table
  getWidth(): any {
    if (document.body.offsetWidth > 1600) {
      if (this.islistBoxVisible) return '85%';
      else return '99.8%';
    } else if (document.body.offsetWidth > 1400) {
      if (this.islistBoxVisible) return '85%';
      else return '99.8%';
    } else if (document.body.offsetWidth > 1200) {
      if (this.islistBoxVisible) return '80%';
      else return '99.8%';
    } else if (document.body.offsetWidth > 1000) {
      if (this.islistBoxVisible) return '75%';
      else return '99.8%';
    } else if (document.body.offsetWidth > 800) {
      if (this.islistBoxVisible) return '70%';
      else return '99.8%';
    } else if (document.body.offsetWidth > 600) {
      if (this.islistBoxVisible) return '65%';
      else return '99.8%';
    } else {
      if (this.islistBoxVisible) return '40%';
      else return '99.8%';
    }
  }

  //define the data source for the table
  source_jqxgrid: any =
    {
      datatype: 'array',
      localdata: this.commandSpeedSwitches,
      id: 'commandId',

      sortcolumn: ['startDateTime'],
      sortdirection: 'desc'
    };
  dataAdapter_jqxgrid: any = new jqx.dataAdapter(this.source_jqxgrid);

  //define columns for table
  columns: any[] =
    [
      {text: 'commandId', datafield: 'commandId', width: 150},
      {text: 'Время начала', datafield: 'startDateTime', width: 150},

      {text: 'Скорость, сек', datafield: 'speed', width: 200},
      {text: 'Статус', datafield: 'statusName', width: 200},
      {text: 'Тип команды', datafield: 'speedDirectionName', width: 300},
    ];

  //define a data source for filtering table columns
  listBoxSource: any[] =
    [
      {label: 'commandId', value: 'commandId', checked: false},
      {label: 'Время начала', value: 'startDateTime', checked: true},

      {label: 'Скорость, сек', value: 'speed', checked: true},
      {label: 'Статус', value: 'statusName', checked: true},
      {label: 'Тип команды', value: 'speedDirectionName', checked: true},
    ];

  //table filtering
  myListBoxOnCheckChange(event: any) {
    this.myGrid.beginupdate();
    if (event.args.checked) {
      this.myGrid.showcolumn(event.args.value);
    } else {
      this.myGrid.hidecolumn(event.args.value);
    }
    this.myGrid.endupdate();
  };

  refreshListBox() {
    this.myGrid.beginupdate();
    for (var i = 0; i < this.myListBox.attrSource.length; i++) {
      if (this.myListBox.attrSource[i].checked) {
        this.myGrid.showcolumn(this.myListBox.attrSource[i].value);
      } else {
        this.myGrid.hidecolumn(this.myListBox.attrSource[i].value);
      }
    }
    this.myGrid.endupdate();
  };

  //functions-events when allocating a string
  onRowclick(event: any) {
  };

  onRowSelect(event: any) {
    // console.log("onRowSelect")
    if (event.args.row
    ) {
      this.selectCommandSpeedSwitch = event.args.row;
      this.editrow = this.selectCommandSpeedSwitch.commandId;

      //refresh child grid
      if (this.isMasterGrid) this.onRefreshChildGrid.emit(this.selectCommandSpeedSwitch.commandId)
    }
    // this.updateButtons('Select');
  };

  onRowUnselect(event: any) {
    // console.log("onRowUnselect")
    // this.updateButtons('Unselect');
  };

  onRowBeginEdit(event: any) {
    // console.log("onRowBeginEdit")
    // this.updateButtons('Edit');
  };

  onRowEndEdit(event: any) {
    // console.log("onRowEndEdit")
    // this.updateButtons('End Edit');
  };


//INSERT, UPDATE, DELETE

  //insert
  ins() {
    this.editWindow.positionWindow({x: 600, y: 90})
    this.editWindow.openWindow(this.id_fixture_select, "ins")
  }

  //update
  upd() {
    this.editWindow.positionWindow({x: 600, y: 90})
    this.editWindow.openWindow(this.id_fixture_select, "upd")
  }

  saveEditwinBtn() {
    //refresh table
    this.onRefreshGrid.emit()
  }

  saveEditSwitchOffwinBtn() {
    //refresh table
    this.onRefreshGrid.emit()
  }

  //delete
  del() {
    if (this.selectCommandSpeedSwitch.commandId) {

      this.commandIds = []
      for (var i = 0; i < this.myGrid.widgetObject.selectedrowindexes.length; i++) {
        this.commandIds[i] = this.source_jqxgrid.localdata[this.myGrid.widgetObject.selectedrowindexes[i]].commandId
      }

      this.eventWindow.okButtonDisabled(false)
      if (this.commandIds.length > 1) {
        this.warningEventWindow = `Удалить команды?`
      } else {
        this.warningEventWindow = `Удалить команду id = "${this.selectCommandSpeedSwitch.commandId}"?`
      }
    } else {
      this.eventWindow.okButtonDisabled(true)
      this.warningEventWindow = `Вам следует выбрать команду для удаления`
    }
    this.eventWindow.openEventWindow()
  }

  okEvenwinBtn() {
    if (this.commandIds.length >= 0) {
      this.commandSpeedSwitchService.del(this.commandIds).subscribe(
        response => {
          // MaterialService.toast(response.message)
        },
        response => MaterialService.toast(response.error.message),
        () => {
          //update the table without contacting the database
          // this.nodes.splice(selectedrowindex, 1)
          // this.refreshGrid();
          this.onRefreshGrid.emit()
        }
      )
    }
  }


}
