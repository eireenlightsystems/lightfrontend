import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnDestroy,
  ViewChild
} from '@angular/core';
import {Subscription} from 'rxjs';
import {MaterialService} from '../../../../../shared/classes/material.service';
import {jqxGridComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid';
import {jqxListBoxComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxlistbox';
import {jqxButtonComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxbuttons';

import {FixtureGroupType, Owner, FixtureGroup} from '../../../../../shared/interfaces';
import {FixtureGroupService} from '../../../../../shared/services/fixture/fixtureGroup.service';
import {EventWindowComponent} from '../../../../../shared/components/event-window/event-window.component';
import {FixtureGreditFormComponent} from '../fixture-gredit-form/fixture-gredit-form.component';


@Component({
  selector: 'app-fixture-grlist-jqxgrid',
  templateUrl: './fixture-grlist-jqxgrid.component.html',
  styleUrls: ['./fixture-grlist-jqxgrid.component.css']
})
export class FixtureGrlistJqxgridComponent implements OnInit, OnDestroy, AfterViewInit {

  private isVisible = false;
  // variables from master component
  @Input() fixtureGroupTypes: FixtureGroupType[];
  @Input() fixtureGroupOwners: Owner[];
  @Input() fixtureGroups: FixtureGroup[];

  @Input() widthGrid: number;
  @Input() heightGrid: number;
  @Input() selectionmode: string;
  @Input() isMasterGrid: boolean;
  // for filtering from master component

  // determine the functions that need to be performed in the parent component
  @Output() onRefreshGrid = new EventEmitter();
  @Output() onRefreshChildGrid = new EventEmitter<number>();

  // define variables - link to view objects
  @ViewChild('myListBox') myListBox: jqxListBoxComponent;
  @ViewChild('myGrid') myGrid: jqxGridComponent;
  @ViewChild('editWindow') editWindow: FixtureGreditFormComponent;
  @ViewChild('eventWindow') eventWindow: EventWindowComponent;
  @ViewChild('warningEventWindow') warningEventWindow: string;
  @ViewChild('okButton') okButton: jqxButtonComponent;

  // other variables
  selectFixtureGroup: FixtureGroup = new FixtureGroup();
  oSub: Subscription;
  selectedrowindex: number;
  islistBoxVisible = false;
  actionEventWindow = '';
  // define the data source for the table
  source_jqxgrid: any =
    {
      datatype: 'array',
      localdata: this.fixtureGroups,
      id: 'fixtureGroupId',

      sortcolumn: ['fixtureGroupId'],
      sortdirection: 'asc'
    };
  dataAdapter_jqxgrid: any = new jqx.dataAdapter(this.source_jqxgrid);

  // define columns for table
  columns: any[] =
    [
      {text: 'fixtureGroupId', datafield: 'fixtureGroupId', width: 150},

      {text: 'Название', datafield: 'fixtureGroupName', width: 200},
      {text: 'Географическое понятие', datafield: 'geographCode', width: 200},
      {text: 'Тип групы', datafield: 'fixtureGroupTypeName', width: 200},
      {text: 'Владелец', datafield: 'ownerCode', width: 200},
    ];

  // define a data source for filtering table columns
  listBoxSource: any[] =
    [
      {label: 'fixtureGroupId', value: 'fixtureGroupId', checked: true},

      {label: 'Название', value: 'fixtureGroupName', checked: true},
      {label: 'Географическое понятие', value: 'geographCode', checked: true},
      {label: 'Тип групы', value: 'fixtureGroupTypeName', checked: true},
      {label: 'Владелец', value: 'ownerCode', checked: true},
    ];

  constructor(private fixtureGroupService: FixtureGroupService) {
  }

  ngOnInit() {
    this.refresh_jqxgGrid();
  }

  ngAfterViewInit() {

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
  refresh_jqxgGrid() {
    this.source_jqxgrid.localdata = this.fixtureGroups;
    this.myGrid.updatebounddata('data');
  }

  refresh_ins(event: any) {
    if (event.fixtureGroupId > 0) {
      const row =
        {
          fixtureGroupName: event.fixtureGroupName,
          fixtureGroupTypeId: event.fixtureGroupTypeId,
          fixtureGroupTypeName: this.fixtureGroupTypes.find((fixtureGroupType: FixtureGroupType) => fixtureGroupType.id === +event.fixtureGroupTypeId).name,
          ownerCode: this.fixtureGroupOwners.find((fixtureGroupOwner: Owner) => fixtureGroupOwner.id === +event.ownerId).name,
          ownerId: this.selectFixtureGroup.ownerId
        };
      this.myGrid.addrow(event.fixtureGroupId, row);
    }
  }

  refresh_upd() {
    if (this.selectFixtureGroup.fixtureGroupId > 0) {
      const row =
        {
          fixtureGroupName: this.selectFixtureGroup.fixtureGroupName,
          fixtureGroupTypeId: this.selectFixtureGroup.fixtureGroupTypeId,
          fixtureGroupTypeName: this.fixtureGroupTypes.find((fixtureGroupType: FixtureGroupType) => fixtureGroupType.id === +this.selectFixtureGroup.fixtureGroupTypeId).name,
          ownerCode: this.fixtureGroupOwners.find((fixtureGroupOwner: Owner) => fixtureGroupOwner.id === +this.selectFixtureGroup.ownerId).name,
          ownerId: this.selectFixtureGroup.ownerId
        };
      this.myGrid.updaterow(this.selectFixtureGroup.fixtureGroupId, row);
    }
  }

  refresh_del() {
    this.myGrid.deleterow(this.selectFixtureGroup.fixtureGroupId);
  }

  // define width of table


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
    if (event.args.row) {
      this.selectFixtureGroup = event.args.row;
      this.selectedrowindex = this.myGrid.getselectedrowindex();

      // refresh child grid
      if (this.isMasterGrid) {
        this.onRefreshChildGrid.emit(this.selectFixtureGroup.fixtureGroupId);
      }
    }
  };

  // INSERT, UPDATE, DELETE

  // insert fixture
  ins() {
    this.editWindow.positionWindow({x: 600, y: 90});
    this.editWindow.openWindow(null, 'ins');
  }

  // update fixture
  upd() {
    this.editWindow.positionWindow({x: 600, y: 90});
    this.editWindow.openWindow(this.selectFixtureGroup, 'upd');
  }

  insEditwinBtn(event: any) {
    this.refresh_ins(event);
  }

  updEditwinBtn() {
    this.refresh_upd();
  }

  // delete fixture
  del() {
    if (this.selectFixtureGroup.fixtureGroupId) {
      this.eventWindow.okButtonDisabled(false);
      this.actionEventWindow = 'del';
      this.warningEventWindow = `Удалить группу id = "${this.selectFixtureGroup.fixtureGroupId}"?`;
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow = `Вам следует выбрать светильник для удаления`;
    }
    this.eventWindow.openEventWindow();
  }

  okEvenwinBtn() {
    if (this.actionEventWindow === 'del') {
      const selectedrowindex = this.myGrid.getselectedrowindex();
      const id = this.myGrid.getrowid(selectedrowindex);

      if (+id >= 0) {
        this.fixtureGroupService.del(+this.selectFixtureGroup.fixtureGroupId).subscribe(
          response => {
            MaterialService.toast('Группа светильников была удалена!');
          },
          error => MaterialService.toast(error.message),
          () => {
            this.refresh_del();
          }
        );
      }
    }
  }

  place() {

  }

  pin_drop() {

  }

}
