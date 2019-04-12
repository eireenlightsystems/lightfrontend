import {AfterViewInit, Component, EventEmitter, Input, Output, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {MaterialService} from '../../../../../shared/classes/material.service';
import {jqxGridComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid';
import {jqxListBoxComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxlistbox';
import {jqxButtonComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxbuttons';

import {
  Fixture,
  Geograph,
  Owner,
  EquipmentType,
  Substation,
  Contract,
  Installer,
  HeightType,
  SourceForLinkForm, ItemsLinkForm
} from '../../../../../shared/interfaces';
import {FixtureService} from '../../../../../shared/services/fixture/fixture.service';
import {EventWindowComponent} from '../../../../../shared/components/event-window/event-window.component';
import {FixtureeditFormComponent} from '../fixtureedit-form/fixtureedit-form.component';
import {LinkFormComponent} from '../../../../../shared/components/link-form/link-form.component';


@Component({
  selector: 'app-fixturelist-jqxgrid',
  templateUrl: './fixturelist-jqxgrid.component.html',
  styleUrls: ['./fixturelist-jqxgrid.component.css']
})
export class FixturelistJqxgridComponent implements OnInit, OnDestroy, AfterViewInit {

  // variables from master component
  @Input() fixtures: Fixture[];
  @Input() columnsFixture: any;
  @Input() listBoxSourceFixture: any;

  @Input() geographs: Geograph[];
  @Input() ownerFixtures: Owner[];
  @Input() fixtureTypes: EquipmentType[];
  @Input() substations: Substation[];
  @Input() contractFixtures: Contract[];
  @Input() installers: Installer[];
  @Input() heightTypes: HeightType[];
  @Input() heightGrid: number;
  @Input() selectionmode: string;
  @Input() isMasterGrid: boolean;
  // for filtering from master component
  @Input() selectFixtureId: number;
  @Input() selectContractId: number;
  @Input() selectNodeId: number;
  @Input() fixtureGroupId: number;

  // determine the functions that need to be performed in the parent component
  @Output() onRefreshGrid = new EventEmitter();
  @Output() onRefreshChildGrid = new EventEmitter<number>();

  // define variables - link to view objects
  @ViewChild('myListBox') myListBox: jqxListBoxComponent;
  @ViewChild('myGrid') myGrid: jqxGridComponent;
  @ViewChild('editWindow') editWindow: FixtureeditFormComponent;
  @ViewChild('eventWindow') eventWindow: EventWindowComponent;
  // @ViewChild('warningEventWindow') warningEventWindow: string;
  // @ViewChild('okButton') okButton: jqxButtonComponent;
  @ViewChild('linkWindow') linkWindow: LinkFormComponent;
  @ViewChild('linkGrFixWindow') linkGrFixWindow: LinkFormComponent;

  // other variables
  selectFixture: Fixture = new Fixture();
  // saveFixture: Fixture = new Fixture();
  oSub: Subscription;
  oSubForLinkWin: Subscription;
  oSubLink: Subscription;
  rowcount = 0;
  islistBoxVisible = false;
  actionEventWindow = '';
  warningEventWindow = '';
  sourceForLinkForm: SourceForLinkForm;
  sourceGrFixForLinkForm: SourceForLinkForm;

  // define the data source for the table
  source_jqxgrid: any =
    {
      datatype: 'array',
      localdata: this.fixtures,
      id: 'fixtureId',

      sortcolumn: ['fixtureId'],
      sortdirection: 'asc'
    };
  dataAdapter_jqxgrid: any = new jqx.dataAdapter(this.source_jqxgrid);


  constructor(private fixtureService: FixtureService) {
  }

  ngOnInit() {
    this.refresh_jqxgGrid();

    // Definde filter
    this.sourceForLinkForm = {
      window: {
        code: 'linkNodeFixtures',
        name: 'Выбрать светильники',
        theme: 'material',
        autoOpen: false,
        isModal: true,
        modalOpacity: 0.3,
        width: 1200,
        maxWidth: 1200,
        minWidth: 500,
        height: 500,
        maxHeight: 800,
        minHeight: 600

      },
      grid: {
        source: [],
        columns: this.columnsFixture,
        theme: 'material',
        width: 1186,
        height: 485,
        columnsresize: true,
        sortable: true,
        filterable: true,
        altrows: true,
        selectionmode: 'checkbox',

        valueMember: 'fixtureId',
        sortcolumn: ['fixtureId'],
        sortdirection: 'desc',
        selectId: []
      }
    };
    this.sourceGrFixForLinkForm = {
      window: {
        code: 'linkGrFixFixtures',
        name: 'Выбрать светильники',
        theme: 'material',
        autoOpen: false,
        isModal: true,
        modalOpacity: 0.3,
        width: 1200,
        maxWidth: 1200,
        minWidth: 500,
        height: 500,
        maxHeight: 800,
        minHeight: 600

      },
      grid: {
        source: [],
        columns: this.columnsFixture,
        theme: 'material',
        width: 1186,
        height: 485,
        columnsresize: true,
        sortable: true,
        filterable: true,
        altrows: true,
        selectionmode: 'checkbox',

        valueMember: 'fixtureId',
        sortcolumn: ['fixtureId'],
        sortdirection: 'desc',
        selectId: []
      }
    };
  }

  ngOnDestroy() {
    if (this.oSub) {
      this.oSub.unsubscribe();
    }
    if (this.oSubForLinkWin) {
      this.oSubForLinkWin.unsubscribe();
    }
    if (this.oSubLink) {
      this.oSubLink.unsubscribe();
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

  }

  // TABLE

  // refresh table
  refresh_jqxgGrid() {
    if (this.fixtures && this.fixtures.length > 0 && this.rowcount !== this.fixtures.length) {
      this.source_jqxgrid.localdata = this.fixtures;
      this.rowcount = this.fixtures.length;
      this.myGrid.updatebounddata('data');
    }
  }

  refresh_del() {
    this.myGrid.deleterow(this.selectFixture.fixtureId);
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
      this.selectFixture = event.args.row;
      this.selectFixtureId = this.selectFixture.fixtureId;

      // refresh child grid
      if (this.isMasterGrid) {
        this.onRefreshChildGrid.emit(this.selectFixture.fixtureId);
      }
    }
  };


  // INSERT, UPDATE, DELETE

  // insert fixture
  ins() {
    this.editWindow.positionWindow({x: 600, y: 90});
    this.editWindow.openWindow(null, this.selectNodeId, 'ins');
  }

  // update fixture
  upd() {
    this.editWindow.positionWindow({x: 600, y: 90});
    this.editWindow.openWindow(this.selectFixture, this.selectNodeId, 'upd');
  }

  saveEditwinBtn() {
    // refresh table
    this.onRefreshGrid.emit();
  }

  saveLinkwinBtn(event: ItemsLinkForm) {
    if (event.code === this.sourceForLinkForm.window.code) {
      this.oSubLink = this.fixtureService.setNodeId(this.selectNodeId, event.Ids).subscribe(
        response => {
          MaterialService.toast('Выбранные елементы привязаны!');
        },
        error => {
          MaterialService.toast(error.error.message);
        },
        () => {
          this.linkWindow.hideWindow();
          // refresh table
          this.onRefreshGrid.emit();
        }
      );
    }
    if (event.code === this.sourceGrFixForLinkForm.window.code) {
      this.oSubLink = this.fixtureService.setFixtureInGroup(this.fixtureGroupId, event.Ids).subscribe(
        response => {
          MaterialService.toast('Светильники добавлены в группу!');
        },
        error => {
          MaterialService.toast(error.error.message);
        },
        () => {
          this.linkGrFixWindow.hideWindow();
          // refresh table
          this.onRefreshGrid.emit();
        }
      );
    }
  }

  getSourceForLinkForm() {
    this.oSubForLinkWin = this.fixtureService.getAll({nodeId: 1}).subscribe(
      response => {
        this.sourceForLinkForm.grid.source = response;
        this.linkWindow.refreshGrid();
      },
      error => {
        MaterialService.toast(error.error.message);
      }
    );
  }

  getSourceGrFixForLinkForm() {
    this.oSubForLinkWin = this.fixtureService.getFixtureInGroup('1').subscribe(
      response => {
        this.sourceGrFixForLinkForm.grid.source = response;
        this.linkGrFixWindow.refreshGrid();
      },
      error => {
        MaterialService.toast(error.error.message);
      }
    );
  }

  // delete fixture
  del() {
    if (this.selectFixture.fixtureId) {
      this.eventWindow.okButtonDisabled(false);
      this.actionEventWindow = 'del';
      this.warningEventWindow = `Удалить светильник id = "${this.selectFixture.fixtureId}"?`;
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow = `Вам следует выбрать светильник для удаления`;
    }
    this.eventWindow.openEventWindow();
  }

  okEvenwinBtn() {
    const fixtureIds = [];
    for (let i = 0; i < this.myGrid.widgetObject.selectedrowindexes.length; i++) {
      fixtureIds[i] = this.source_jqxgrid.localdata[this.myGrid.widgetObject.selectedrowindexes[i]].fixtureId;
    }

    if (this.actionEventWindow === 'del') {
      const selectedrowindex = this.myGrid.getselectedrowindex();
      const id = this.myGrid.getrowid(selectedrowindex);

      if (+id >= 0) {
        this.fixtureService.del(+id).subscribe(
          response => {
            MaterialService.toast('Светильник был удален!');
          },
          error => MaterialService.toast(error.error.message),
          () => {
            this.refresh_del();
          }
        );
      }
    }

    if (this.actionEventWindow === 'pin_drop') {
      this.oSub = this.fixtureService.delNodeId(this.selectNodeId, fixtureIds).subscribe(
        response => {
          MaterialService.toast('Светильники отвязаны от столба!');
        },
        error => {
          MaterialService.toast(error.error.message);
        },
        () => {
          // refresh table
          this.onRefreshGrid.emit();
        }
      );
    }

    if (this.actionEventWindow === 'group_out') {
      this.oSub = this.fixtureService.delFixtureInGroup(+this.fixtureGroupId, fixtureIds).subscribe(
        response => {
          MaterialService.toast('Светильники удалены из группы!');
        },
        error => {
          MaterialService.toast(error.error.message);
        },
        () => {
          // refresh table
          this.onRefreshGrid.emit();
        }
      );
    }
  }

  place() {
    if (this.selectNodeId > 1) {
      this.linkWindow.openWindow();
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow = `Вам следует выбрать узел для привязки светильников`;
      this.eventWindow.openEventWindow();
    }
  }

  pin_drop() {
    if (this.selectFixture.fixtureId) {
      this.eventWindow.okButtonDisabled(false);
      this.actionEventWindow = 'pin_drop';
      this.warningEventWindow = `Отвязать светильники от узла?`;
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow = `Вам следует выбрать светильники для отвязки от узла`;
    }
    this.eventWindow.openEventWindow();
  }

  group_in() {
    if (+this.fixtureGroupId > 1) {
      this.linkGrFixWindow.openWindow();
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow = `Вам следует выбрать ГРУППУ для привязки светильников`;
      this.eventWindow.openEventWindow();
    }
  }

  group_out() {
    if (this.selectFixture.fixtureId) {
      this.eventWindow.okButtonDisabled(false);
      this.actionEventWindow = 'group_out';
      this.warningEventWindow = `Исключить светильники из группы?`;
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow = `Вам следует выбрать светильники для исключения из группы`;
    }
    this.eventWindow.openEventWindow();
  }

}
