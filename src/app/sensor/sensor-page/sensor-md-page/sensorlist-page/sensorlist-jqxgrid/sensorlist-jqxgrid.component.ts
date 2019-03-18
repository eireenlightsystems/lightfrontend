import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {MaterialService} from '../../../../../shared/classes/material.service';
import {jqxGridComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid';
import {jqxListBoxComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxlistbox';
import {jqxButtonComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxbuttons';

import {Sensor} from '../../../../../shared/models/sensor';
import {Geograph, Contract, OwnerSensor, SensorType, FixtureGroupType, FixtureGroupOwner} from '../../../../../shared/interfaces';

import {SensorService} from '../../../../../shared/services/sensor/sensor.service';
import {EventWindowComponent} from '../../../../../shared/components/event-window/event-window.component';
import {SensoreditFormComponent} from '../sensoredit-form/sensoredit-form.component';

@Component({
  selector: 'app-sensorlist-jqxgrid',
  templateUrl: './sensorlist-jqxgrid.component.html',
  styleUrls: ['./sensorlist-jqxgrid.component.css']
})
export class SensorlistJqxgridComponent implements OnInit, OnDestroy, AfterViewInit {

// variables from master component
  @Input() sensors: Sensor[];
  @Input() geographs: Geograph[];
  @Input() ownerSensors: OwnerSensor[];
  @Input() sensorTypes: SensorType[];
  @Input() contractSensors: Contract[];

  @Input() nodeSelectId: number;

  @Input() heightGrid: number;
  @Input() isMasterGrid: number;
  @Input() selectionmode: string;

  // determine the functions that need to be performed in the parent component
  @Output() onRefreshGrid = new EventEmitter();
  @Output() onRefreshChildGrid = new EventEmitter<number>();

  // define variables - link to view objects
  @ViewChild('myListBox') myListBox: jqxListBoxComponent;
  @ViewChild('myGrid') myGrid: jqxGridComponent;
  @ViewChild('editWindow') editWindow: SensoreditFormComponent;
  @ViewChild('eventWindow') eventWindow: EventWindowComponent;
  @ViewChild('warningEventWindow') warningEventWindow: string;
  @ViewChild('okButton') okButton: jqxButtonComponent;

  // other variables
  selectSensor: Sensor = new Sensor();
  // saveNodeSensor: NodeSensor = new NodeSensor();
  oSub: Subscription;
  editrow: number;
  rowcount = 0;
  islistBoxVisible = false;
  actionEventWindow = '';

  // define the data source for the table
  source_jqxgrid: any =
    {
      datatype: 'array',
      localdata: this.sensors,
      id: 'id_sensor',

      sortcolumn: ['id_sensor'],
      sortdirection: 'desc'
    };
  dataAdapter_jqxgrid: any = new jqx.dataAdapter(this.source_jqxgrid);

  // define columns for table
  columns: any[] =
    [
      {text: 'id_sensor', datafield: 'id_sensor', width: 150},
      {text: 'Договор', datafield: 'code_contract', width: 150},
      {text: 'Географическое понятие', datafield: 'code_geograph', width: 150},
      {text: 'Тип сенсора', datafield: 'code_sensor_type', width: 150},
      {text: 'Владелец', datafield: 'code_owner', width: 150},

      {text: 'Широта', datafield: 'n_coordinate', width: 150},
      {text: 'Долгота', datafield: 'e_coordinate', width: 150},

      {text: 'Серийный номер', datafield: 'serial_number', width: 150},
      {text: 'Коментарий', datafield: 'comments', width: 150},
      {text: 'Дата (редак.)', datafield: 'dateedit', width: 150},
      {text: 'Польз-ль (редак.)', datafield: 'useredit', width: 150}
    ];

  // define a data source for filtering table columns
  listBoxSource: any[] =
    [
      {label: 'id_sensor', value: 'id_sensor', checked: true},
      {label: 'Договор', value: 'code_contract', checked: true},
      {label: 'Географическое понятие', value: 'code_geograph', checked: true},
      {label: 'Тип сенсора', value: 'code_sensor_type', checked: true},
      {label: 'Владелец', value: 'code_owner', checked: true},

      {label: 'Широта', value: 'n_coordinate', checked: true},
      {label: 'Долгота', value: 'e_coordinate', checked: true},

      {label: 'Серийный номер', value: 'serial_number', checked: true},
      {label: 'Коментарий', value: 'comments', checked: true},
      {label: 'Дата (редак.)', value: 'dateedit', checked: false},
      {label: 'Польз-ль (редак.)', value: 'useredit', checked: false}
    ];


  constructor(private sensorService: SensorService) {
  }

  ngOnInit() {
    this.refresh_jqxgGrid();

  }

  ngAfterViewInit() {
    this.refreshListBox();
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
    // if (this.editWindow) {
    //   this.editWindow.destroyWindow();
    // }
    if (this.eventWindow) {
      this.eventWindow.destroyEventWindow();
    }
  }

  // TABLE

  // refresh table
  refresh_jqxgGrid() {
    if (this.sensors && this.sensors.length > 0 && this.rowcount !== this.sensors.length) {
      this.source_jqxgrid.localdata = this.sensors;
      this.rowcount = this.sensors.length;
      this.myGrid.updatebounddata('data');
    }
  }

  // refresh_ins(event: any) {
  //   if (event.id_sensor > 0) {
  //     const row =
  //       {
  //         serial_number: event.serial_number,
  //         comments: event.comments,
  //
  //         id_sensor_type: event.id_sensor_type,
  //         code_sensor_type: this.sensorTypes.find((sensorType: SensorType) => sensorType.id_sensor_type === +event.id_sensor_type).code_sensor_type,
  //
  //         id_contract: this.event.id_contract
  //         ownerCode: this.fixtureGroupOwners.find((fixtureGroupOwner: FixtureGroupOwner) => fixtureGroupOwner.id === +event.ownerId).name,
  //
  //       };
  //     this.myGrid.addrow(event.fixtureGroupId, row);
  //   }
  // }
  //
  // refresh_upd() {
  //   if (this.selectFixtureGroup.fixtureGroupId > 0) {
  //     const row =
  //       {
  //         fixtureGroupName: this.selectFixtureGroup.fixtureGroupName,
  //         fixtureGroupTypeId: this.selectFixtureGroup.fixtureGroupTypeId,
  //         fixtureGroupTypeName: this.fixtureGroupTypes.find((fixtureGroupType: FixtureGroupType) => fixtureGroupType.id === +this.selectFixtureGroup.fixtureGroupTypeId).name,
  //         ownerCode: this.fixtureGroupOwners.find((fixtureGroupOwner: FixtureGroupOwner) => fixtureGroupOwner.id === +this.selectFixtureGroup.ownerId).name,
  //         ownerId: this.selectFixtureGroup.ownerId
  //       };
  //     this.myGrid.updaterow(this.selectFixtureGroup.fixtureGroupId, row);
  //   }
  // }

  refresh_del() {
    this.myGrid.deleterow(this.selectSensor.id_sensor);
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

  refreshListBox() {
    this.myGrid.beginupdate();
    for (let i = 0; i < this.myListBox.attrSource.length; i++) {
      if (this.myListBox.attrSource[i].checked) {
        this.myGrid.showcolumn(this.myListBox.attrSource[i].value);
      } else {
        this.myGrid.hidecolumn(this.myListBox.attrSource[i].value);
      }
    }
    this.myGrid.endupdate();
  };

  onRowSelect(event: any) {
    // console.log("onRowSelect")
    if (event.args.row
    ) {
      this.selectSensor = event.args.row;
      this.editrow = this.selectSensor.id_sensor;

      // refresh child grid
      if (this.isMasterGrid) {
        this.onRefreshChildGrid.emit(this.selectSensor.id_sensor);
      }
    }
    // this.updateButtons('Select');
  };


// INSERT, UPDATE, DELETE

  // insert node
  ins() {
    const selectSensor: Sensor = new Sensor();
    selectSensor.id_node = this.nodeSelectId;

    this.editWindow.positionWindow({x: 600, y: 90});
    this.editWindow.openWindow(selectSensor, 'ins');
  }

  // update node
  upd() {
    this.editWindow.positionWindow({x: 600, y: 90});
    this.editWindow.openWindow(this.selectSensor, 'upd');
  }

  saveEditwinBtn() {
    // refresh table
    this.onRefreshGrid.emit();
  }

  // insEditwinBtn(event: any) {
  //   // this.refresh_ins(event);
  //     // refresh table
  //     this.onRefreshGrid.emit();
  // }
  //
  // updEditwinBtn() {
  //   // this.refresh_upd();
  //   // refresh table
  //   this.onRefreshGrid.emit();
  // }

  // delete node
  del() {
    if (this.selectSensor.id_sensor) {
      this.eventWindow.okButtonDisabled(false);
      this.actionEventWindow = 'del';
      this.warningEventWindow = `Удалить сенсор id = "${this.selectSensor.id_sensor}"?`;
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow = `Вам следует выбрать сенсор для удаления`;
    }
    this.eventWindow.openEventWindow();
  }

  okEvenwinBtn() {
    if (this.actionEventWindow === 'del') {
      const selectedrowindex = this.myGrid.getselectedrowindex();
      const id = this.myGrid.getrowid(selectedrowindex);

      if (+id >= 0) {
        this.sensorService.del(+id).subscribe(
          response => {
            MaterialService.toast(response.message);
          },
          error => MaterialService.toast(error.message),
          () => {
            this.refresh_del();
          }
        );
      }
    }

    // if (this.actionEventWindow === 'pin_drop') {
    //   for (var i = 0; i < this.myGrid.widgetObject.selectedrowindexes.length; i++) {
    //     this.saveNodesensor.sensorId = this.source_jqxgrid.localdata[this.myGrid.widgetObject.selectedrowindexes[i]].id_sensor;
    //     this.saveNodesensor.nodeId = 1;
    //     this.oSub = this.sensorService.set_id_node(this.saveNodesensor).subscribe(
    //       response => {
    //         // MaterialService.toast(`Светильник c id = ${response.id_fixture} был отвязан от столба.`)
    //       },
    //       error => MaterialService.toast(error.message),
    //       () => {
    //         // refresh table
    //         this.onRefreshGrid.emit();
    //       }
    //     );
    //   }
    // }
  }

  place() {
    // if (this.nodeSelectId > 1) {
    //   this.linkWindow.openWindow();
    // } else {
    //   this.eventWindow.okButtonDisabled(true);
    //   this.warningEventWindow = `Вам следует выбрать узел для привязки шлюзов`;
    //   this.eventWindow.openEventWindow();
    // }
  }

  pin_drop() {
    if (this.selectSensor.id_sensor) {
      this.eventWindow.okButtonDisabled(false);
      this.actionEventWindow = 'pin_drop';
      this.warningEventWindow = `Отвязать шлюз от узла?`;
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow = `Вам следует выбрать шлюз для отвязки от узла`;
    }
    this.eventWindow.openEventWindow();
  }
}
