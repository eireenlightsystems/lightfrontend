import {AfterViewInit, Component, EventEmitter, Input, Output, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {MaterialService} from '../../../../../shared/classes/material.service'
import {jqxGridComponent} from "jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid";
import {jqxListBoxComponent} from "jqwidgets-scripts/jqwidgets-ts/angular_jqxlistbox";
import {jqxButtonComponent} from "jqwidgets-scripts/jqwidgets-ts/angular_jqxbuttons";

import {Fixture} from '../../../../../shared/models/fixture'
import {
  FixtureType,
  Geograph,
  Owner_fixture,
  Substation,
  Contract,
  Installer,
  HeightType
} from '../../../../../shared/interfaces'
import {FixtureService} from "../../../../../shared/services/fixture/fixture.service";
import {EventWindowComponent} from "../../../../../shared/components/event-window/event-window.component";
import {FixtureeditFormComponent} from "../fixtureedit-form/fixtureedit-form.component";
import {FixturelinkFormComponent} from "../fixturelink-form/fixturelink-form.component";


@Component({
  selector: 'app-fixturelist-jqxgrid',
  templateUrl: './fixturelist-jqxgrid.component.html',
  styleUrls: ['./fixturelist-jqxgrid.component.css']
})
export class FixturelistJqxgridComponent implements OnInit, OnDestroy, AfterViewInit {

  //variables from master component
  @Input() fixtures: Fixture[]
  @Input() geographs: Geograph[]
  @Input() owner_fixtures: Owner_fixture[]
  @Input() fixtureTypes: FixtureType[]
  @Input() substations: Substation[]
  @Input() contract_fixtures: Contract[]
  @Input() installers: Installer[]
  @Input() heightTypes: HeightType[]
  @Input() heightGrid: number
  @Input() selectionmode: string
  @Input() isMasterGrid: boolean
  //for filtering from master component
  @Input() id_contract_select: number
  @Input() id_node_select: number

  //determine the functions that need to be performed in the parent component
  @Output() onRefreshGrid = new EventEmitter()
  @Output() onRefreshChildGrid = new EventEmitter<number>()

  //define variables - link to view objects
  @ViewChild('myListBox') myListBox: jqxListBoxComponent
  @ViewChild('myGrid') myGrid: jqxGridComponent
  @ViewChild('editWindow') editWindow: FixtureeditFormComponent
  @ViewChild('eventWindow') eventWindow: EventWindowComponent
  @ViewChild('warningEventWindow') warningEventWindow: string
  @ViewChild('okButton') okButton: jqxButtonComponent
  @ViewChild('linkWindow') linkWindow: FixturelinkFormComponent

  //other variables
  selectFixture: Fixture = new Fixture()
  saveFixture: Fixture = new Fixture()
  oSub: Subscription
  editrow: number
  rowcount: number = 0
  islistBoxVisible: boolean = false
  actionEventWindow: string = ""

  constructor(private fixtureService: FixtureService) {
  }

  ngOnInit() {
    this.refreshGrid();
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
    if (this.linkWindow) {
      this.linkWindow.destroyWindow();
    }
    if (this.eventWindow) {
      this.eventWindow.destroyEventWindow();
    }
  }

  ngAfterViewInit(): void {
    this.refreshListBox()
  }

  //TABLE

  //refresh table
  refreshGrid() {
    if (this.fixtures && this.fixtures.length > 0 && this.rowcount !== this.fixtures.length) {
      this.source_jqxgrid.localdata = this.fixtures;
      this.rowcount = this.fixtures.length;
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
      localdata: this.fixtures,
      id: 'id_fixture',

      sortcolumn: ['id_fixture'],
      sortdirection: 'asc'
    };
  dataAdapter_jqxgrid: any = new jqx.dataAdapter(this.source_jqxgrid);

  //define columns for table
  columns: any[] =
    [
      {text: 'id_fixture', datafield: 'id_fixture', width: 150},

      {text: 'Географическое понятие', datafield: 'code_geograph', width: 150},
      {text: 'Договор', datafield: 'code_contract', width: 150},
      {text: 'Владелец', datafield: 'code_owner', width: 150},
      {text: 'Тип светильника', datafield: 'code_fixture_type', width: 150},
      {text: 'Подстанция', datafield: 'code_substation', width: 150},
      {text: 'Установщик', datafield: 'code_installer', width: 150},
      {text: 'Код высоты', datafield: 'code_height_type', width: 150},

      {text: 'Номер полосы', datafield: 'numline', width: 140},
      {text: 'Сторона', datafield: 'side', width: 140},
      {text: 'Признак главного светильника', datafield: 'flg_chief', width: 150},
      {text: 'Цена', datafield: 'price', width: 150},
      {text: 'Коментарий', datafield: 'comments', width: 150},

      {text: 'Режим', datafield: 'flg_light', width: 150},

      {text: 'Дата (редак.)', datafield: 'dateedit', width: 150},
      {text: 'Польз-ль (редак.)', datafield: 'useredit', width: 150},
    ];

  //define a data source for filtering table columns
  listBoxSource: any[] =
    [
      {label: 'id_fixture', value: 'id_fixture', checked: true},

      {label: 'Географическое понятие', value: 'code_geograph', checked: true},
      {label: 'Договор', value: 'code_contract', checked: false},
      {label: 'Владелец', value: 'id_owner', checked: true},
      {label: 'Тип светильника', value: 'code_fixture_type', checked: true},
      {label: 'Подстанция', value: 'code_substation', checked: true},
      {label: 'Установщик', value: 'code_installer', checked: false},
      {label: 'Код высоты', value: 'code_height_type', checked: true},

      {label: 'Номер полосы', value: 'numline', checked: true},
      {label: 'Сторона', value: 'side', checked: true},
      {label: 'Признак главного светильника', value: 'flg_chief', checked: true},
      {label: 'Цена', value: 'price', checked: true},
      {label: 'Коментарий', value: 'comments', checked: true},

      {label: 'Режим', value: 'flg_light', checked: false},

      {label: 'Дата (редак.)', value: 'dateedit', checked: false},
      {label: 'Польз-ль (редак.)', value: 'useredit', checked: false}
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
      this.selectFixture = event.args.row;
      this.editrow = this.selectFixture.id_fixture;

      //refresh child grid
      if (this.isMasterGrid) this.onRefreshChildGrid.emit(this.selectFixture.id_fixture)
    }
    // this.updateButtons('Select');
  };

  onRowUnselect(event: any) {
    // console.log("onRowUnselect")
    // this.updateButtons('Unselect');
  };

  onRowBeginEdit(event: any) {
    // this.updateButtons('Edit');
  };

  onRowEndEdit(event: any) {
    // this.updateButtons('End Edit');
  };


//INSERT, UPDATE, DELETE

  //insert fixture
  ins() {
    this.editWindow.positionWindow({x: 600, y: 90})
    this.editWindow.openWindow(null, this.id_node_select, "ins")
  }

  //update fixture
  upd() {
    this.editWindow.positionWindow({x: 600, y: 90})
    this.editWindow.openWindow(this.selectFixture, this.id_node_select, "upd")
  }

  saveEditwinBtn() {
    //refresh table
    this.onRefreshGrid.emit()
  }

  saveLinkwinBtn() {
    //refresh table
    this.onRefreshGrid.emit()
  }

  //delete fixture
  del() {
    if (this.selectFixture.id_fixture) {
      this.eventWindow.okButtonDisabled(false)
      this.actionEventWindow = "del"
      this.warningEventWindow = `Удалить светильник id = "${this.selectFixture.id_fixture}"?`
    } else {
      this.eventWindow.okButtonDisabled(true)
      this.warningEventWindow = `Вам следует выбрать светильник для удаления`
    }
    this.eventWindow.openEventWindow()
  }

  okEvenwinBtn() {
    if (this.actionEventWindow === "del") {
      let selectedrowindex = this.myGrid.getselectedrowindex();
      let id = this.myGrid.getrowid(selectedrowindex);

      if (+id >= 0) {
        this.fixtureService.del(+id).subscribe(
          response => {
            MaterialService.toast(response.message)
          },
          error => MaterialService.toast(error.message),
          () => {
            //update the table without contacting the database
            // this.fixtures.splice(selectedrowindex, 1)
            // this.refreshGrid();

            //refresh table
            this.onRefreshGrid.emit()
          }
        )
      }
    }

    if (this.actionEventWindow === "pin_drop") {
      for (var i = 0; i < this.myGrid.widgetObject.selectedrowindexes.length; i++) {
        this.saveFixture = this.source_jqxgrid.localdata[this.myGrid.widgetObject.selectedrowindexes[i]]
        this.saveFixture.id_node = 1
        this.oSub = this.fixtureService.set_id_node(this.saveFixture).subscribe(
          response => {
            // MaterialService.toast(`Светильник c id = ${response.id_fixture} был отвязан от столба.`)
          },
          error => MaterialService.toast(error.message),
          () => {
            //refresh table
            this.onRefreshGrid.emit()
          }
        )
      }
    }

  }

  place() {
    if (this.id_node_select > 1) {
      this.linkWindow.openWindow()
    } else {
      this.eventWindow.okButtonDisabled(true)
      this.warningEventWindow = `Вам следует выбрать узел для привязки светильников`
      this.eventWindow.openEventWindow()
    }
  }

  pin_drop() {
    if (this.selectFixture.id_fixture) {
      this.eventWindow.okButtonDisabled(false)
      this.actionEventWindow = "pin_drop"
      this.warningEventWindow = `Отвязать светильники от узла?`
    } else {
      this.eventWindow.okButtonDisabled(true)
      this.warningEventWindow = `Вам следует выбрать светильники для отвязки от узла`
    }
    this.eventWindow.openEventWindow()
  }
}
