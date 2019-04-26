import {Component, Input, OnInit, OnDestroy, ViewChild, EventEmitter, Output} from '@angular/core';
import {Subscription} from 'rxjs/index';
import {isUndefined} from 'util';
import {MaterialService} from '../../../../shared/classes/material.service';

import {
  Fixture, FixtureGroup, Owner, FixtureGroupType,
  FilterFixtureGroup, SourceForFilter,
  SettingButtonPanel,
  SourceForJqxGrid,
  SettingWinForEditForm, SourceForEditForm,
  SourceForLinkForm
} from '../../../../shared/interfaces';
import {FixtureGroupService} from '../../../../shared/services/fixture/fixtureGroup.service';
import {FixturecomeditFormComponent} from '../../fixture-masterdetails-page/fixturecomlist-page/fixturecomedit-form/fixturecomedit-form.component';
import {FixturecomeditSwitchoffFormComponent} from '../../fixture-masterdetails-page/fixturecomlist-page/fixturecomedit-switchoff-form/fixturecomedit-switchoff-form.component';
import {JqxgridComponent} from '../../../../shared/components/jqxgrid/jqxgrid.component';
import {ButtonPanelComponent} from '../../../../shared/components/button-panel/button-panel.component';
import {FilterTableComponent} from '../../../../shared/components/filter-table/filter-table.component';
import {EditFormComponent} from '../../../../shared/components/edit-form/edit-form.component';
import {LinkFormComponent} from '../../../../shared/components/link-form/link-form.component';
import {EventWindowComponent} from '../../../../shared/components/event-window/event-window.component';


const STEP = 1000000000000;


@Component({
  selector: 'app-fixture-grlist-page',
  templateUrl: './fixture-grlist-page.component.html',
  styleUrls: ['./fixture-grlist-page.component.css']
})
export class FixtureGrlistPageComponent implements OnInit, OnDestroy {

  // variables from master component
  @Input() fixtures: Fixture[];
  @Input() fixtureGroupTypes: FixtureGroupType[];
  @Input() fixtureGroupOwners: Owner[];

  @Input() widthGrid: number;
  @Input() heightGrid: number;
  @Input() selectionmode: string;
  @Input() isMasterGrid: boolean;

  @Input() isButtonPanelVisible: boolean;
  @Input() settingButtonPanel: SettingButtonPanel;

  // determine the functions that need to be performed in the parent component
  @Output() onRefreshChildGrid = new EventEmitter<number>();
  @Output() onFeedback = new EventEmitter<any>();

  // define variables - link to view objects
  @ViewChild('jqxgridComponent') jqxgridComponent: JqxgridComponent;
  @ViewChild('buttonPanel') buttonPanel: ButtonPanelComponent;
  @ViewChild('filterTable') filterTable: FilterTableComponent;
  @ViewChild('editWindow') editWindow: EditFormComponent;
  @ViewChild('linkWindow') linkWindow: LinkFormComponent;
  @ViewChild('eventWindow') eventWindow: EventWindowComponent;

  @ViewChild('editSwitchOnWindow') editSwitchOnWindow: FixturecomeditFormComponent;
  @ViewChild('editSwitchOffWindow') editSwitchOffWindow: FixturecomeditSwitchoffFormComponent;

  // other variables
  offset = 0;
  limit = STEP;
  loading = false;
  reloading = false;
  noMoreItems = false;
  columnsGrid: any[];
  listBoxSource: any[];
  // main
  items: FixtureGroup[] = [];
  filter: FilterFixtureGroup = {
    ownerId: '',
    fixtureGroupTypeId: '',
  };
  // grid
  oSub: Subscription;
  selectItemId = 0;
  sourceForJqxGrid: SourceForJqxGrid;
  // filter
  sourceForFilter: SourceForFilter[];
  isFilterVisible = false;
  // edit form
  settingWinForEditForm: SettingWinForEditForm;
  sourceForEditForm: SourceForEditForm[];
  isEditFormVisible = false;
  typeEditWindow = '';
  // link form
  oSubForLinkWin: Subscription;
  oSubLink: Subscription;
  sourceForLinkForm: SourceForLinkForm;
  // event form
  warningEventWindow = '';
  actionEventWindow = '';


  constructor(private fixtureGroupService: FixtureGroupService) {
  }

  ngOnInit() {
    // define columns for table
    this.columnsGrid =
      [
        {text: 'fixtureGroupId', datafield: 'fixtureGroupId', width: 150},

        {text: 'Название', datafield: 'fixtureGroupName', width: 200},
        {text: 'Географическое понятие', datafield: 'geographCode', width: 200},
        {text: 'Тип групы', datafield: 'fixtureGroupTypeName', width: 200},
        {text: 'Владелец', datafield: 'ownerCode', width: 200},
      ];
    this.listBoxSource =
      [
        {label: 'fixtureGroupId', value: 'fixtureGroupId', checked: true},

        {label: 'Название', value: 'fixtureGroupName', checked: true},
        {label: 'Географическое понятие', value: 'geographCode', checked: true},
        {label: 'Тип групы', value: 'fixtureGroupTypeName', checked: true},
        {label: 'Владелец', value: 'ownerCode', checked: true},
      ];

    // define filter
    this.sourceForFilter = [
      {
        name: 'fixtureGroupOwners',
        type: 'jqxComboBox',
        source: this.fixtureGroupOwners,
        theme: 'material',
        width: '250',
        height: '43',
        placeHolder: 'Владелец:',
        displayMember: 'code',
        valueMember: 'id',
        defaultValue: '',
        selectId: ''
      },
      {
        name: 'fixtureGroupTypes',
        type: 'jqxComboBox',
        source: this.fixtureGroupTypes,
        theme: 'material',
        width: '250',
        height: '43',
        placeHolder: 'Тип группы:',
        displayMember: 'name',
        valueMember: 'id',
        defaultValue: '',
        selectId: ''
      }
    ];

    // definde window edit form
    this.settingWinForEditForm = {
      code: 'editFormFixtureGr',
      name: 'Добавить/редактировать группы светильников',
      theme: 'material',
      isModal: true,
      modalOpacity: 0.3,
      width: 450,
      maxWidth: 500,
      minWidth: 460,
      height: 350,
      maxHeight: 350,
      minHeight: 350,
      coordX: 500,
      coordY: 65
    };

    // definde edit form
    this.sourceForEditForm = [
      {
        nameField: 'fixtureGroupOwners',
        type: 'jqxComboBox',
        source: this.fixtureGroupOwners,
        theme: 'material',
        width: '285',
        height: '20',
        placeHolder: 'Владелец:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'fixtureGroupTypes',
        type: 'jqxComboBox',
        source: this.fixtureGroupTypes,
        theme: 'material',
        width: '285',
        height: '20',
        placeHolder: 'Тип группы:',
        displayMember: 'name',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'fixtureGroupName',
        type: 'jqxTextArea',
        source: [],
        theme: 'material',
        width: '280',
        height: '100',
        placeHolder: 'Наименование:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      }
    ];

    // definde link form

    // jqxgrid
    this.sourceForJqxGrid = {
      listbox: {
        source: this.listBoxSource,
        theme: 'material',
        width: 150,
        height: this.heightGrid / 3,
        checkboxes: true,
        filterable: true,
        allowDrag: true
      },
      grid: {
        source: this.items,
        columns: this.columnsGrid,
        theme: 'material',
        width: 0,
        height: this.heightGrid,
        columnsresize: true,
        sortable: true,
        filterable: true,
        altrows: true,
        selectionmode: this.selectionmode,
        isMasterGrid: this.isMasterGrid,

        valueMember: 'fixtureGroupId',
        sortcolumn: ['fixtureGroupId'],
        sortdirection: 'desc',
        selectId: []
      }
    };

    this.getAll();
    this.reloading = true;
  }

  ngOnDestroy(): void {
    if (this.oSub) {
      this.oSub.unsubscribe();
    }
    if (this.jqxgridComponent) {
      this.jqxgridComponent.destroyGrid();
    }
    // if (this.filterTable) {
    //   this.filterTable.destroy();
    // }
    if (this.buttonPanel) {
      this.buttonPanel.destroy();
    }
    if (this.editWindow) {
      this.editWindow.destroyWindow();
    }
    if (this.editSwitchOnWindow) {
      this.editSwitchOnWindow.destroyWindow();
    }
    if (this.editSwitchOffWindow) {
      this.editSwitchOffWindow.destroyWindow();
    }
    if (this.linkWindow) {
      this.linkWindow.destroyWindow();
    }
    if (this.oSubForLinkWin) {
      this.oSubForLinkWin.unsubscribe();
    }
    if (this.oSubLink) {
      this.oSubLink.unsubscribe();
    }
  }

  // GRID

  getSourceForJqxGrid() {
    this.sourceForJqxGrid.grid.source = this.items;
  }

  refreshGrid() {
    this.items = [];
    this.getAll();
    this.reloading = true;
    this.selectItemId = 0;

    // if this.nodes id master grid, then we need refresh child grid
    if (this.isMasterGrid) {
      this.onRefreshChildGrid.emit(this.selectItemId);
    }
  }

  refreshChildGrid(selectRow: any) {
    this.selectItemId = selectRow.fixtureGroupId;
    // refresh child grid
    this.onRefreshChildGrid.emit(selectRow.fixtureGroupId);
  }

  getAll() {
    // Disabled/available buttons

    const params = Object.assign({}, {
        offset: this.offset,
        limit: this.limit
      },
      this.filter);

    this.oSub = this.fixtureGroupService.getAll(params).subscribe(fixtureGroups => {
      this.items = this.items.concat(fixtureGroups);
      this.noMoreItems = fixtureGroups.length < STEP;
      this.loading = false;
      this.reloading = false;
    });
  }

  loadMore() {
    this.offset += STEP;
    this.loading = true;
    this.getAll();
  }

  ins() {
    this.typeEditWindow = 'ins';
    this.getSourceForEditForm();
    this.isEditFormVisible = !this.isEditFormVisible;
  }

  upd() {
    if (!isUndefined(this.jqxgridComponent.selectRow)) {
      this.typeEditWindow = 'upd';
      this.getSourceForEditForm();
      this.isEditFormVisible = !this.isEditFormVisible;
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow = `Вам следует выбрать группу для редактирования`;
      this.eventWindow.openEventWindow();
    }
  }

  del() {
    if (!isUndefined(this.jqxgridComponent.selectRow)) {
      this.eventWindow.okButtonDisabled(false);
      this.actionEventWindow = 'del';
      this.warningEventWindow = `Удалить группу id = "${this.jqxgridComponent.selectRow.fixtureGroupId}"?`;
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow = `Вам следует выбрать группу для удаления`;
    }
    this.eventWindow.openEventWindow();
  }

  refresh() {
    this.refreshGrid();
  }

  filterNone() {
    // this.jqxgridComponent.islistBoxVisible = !this.jqxgridComponent.islistBoxVisible;
    this.jqxgridComponent.openSettinWin();
  }

  filterList() {
    this.isFilterVisible = !this.isFilterVisible;
  }

  place() {

  }

  pinDrop() {

  }

  groupIn() {

  }

  groupOut() {

  }

  switchOn(fixtures: Fixture[]) {
    const fixtureIds: number[] = [];
    for (let i = 0; i < fixtures.length; i++) {
      fixtureIds[i] = +fixtures[i].fixtureId;
    }
    this.editSwitchOnWindow.positionWindow({x: 600, y: 90});
    this.editSwitchOnWindow.openWindow(fixtureIds, 'ins');
  }

  switchOff(fixtures: Fixture[]) {
    const fixtureIds: number[] = [];
    for (let i = 0; i < fixtures.length; i++) {
      fixtureIds[i] = +fixtures[i].fixtureId;
    }
    this.editSwitchOffWindow.positionWindow({x: 600, y: 90});
    this.editSwitchOffWindow.openWindow(fixtureIds, 'ins');
  }

  // FILTER

  applyFilter(filter: FilterFixtureGroup) {
    this.items = [];
    this.offset = 0;
    this.filter = filter;
    this.reloading = true;
    this.getAll();
  }

  applyFilterFromFilter(event: any) {
    this.items = [];
    this.offset = 0;
    this.reloading = true;
    for (let i = 0; i < event.length; i++) {
      switch (event[i].name) {
        case 'fixtureGroupOwners':
          this.filter.ownerId = event[i].id;
          break;
        case 'fixtureGroupTypes':
          this.filter.fixtureGroupTypeId = event[i].id;
          break;
        default:
          break;
      }
    }
    this.getAll();
  }

  initSourceFilter() {
    for (let i = 0; i < this.sourceForFilter.length; i++) {
      switch (this.sourceForFilter[i].name) {
        case 'fixtureGroupOwners':
          this.sourceForFilter[i].source = this.fixtureGroupOwners;
          break;
        case 'fixtureGroupTypes':
          this.sourceForFilter[i].source = this.fixtureGroupTypes;
          break;
        default:
          break;
      }
    }
  }

  // EDIT FORM

  saveEditwinBtn() {
    const selectObject: FixtureGroup = new FixtureGroup();

    for (let i = 0; i < this.sourceForEditForm.length; i++) {
      switch (this.sourceForEditForm[i].nameField) {
        case 'fixtureGroupOwners':
          selectObject.ownerId = +this.sourceForEditForm[i].selectId;
          selectObject.ownerCode = this.sourceForEditForm[i].selectCode;
          break;
        case 'fixtureGroupTypes':
          selectObject.fixtureGroupTypeId = +this.sourceForEditForm[i].selectId;
          selectObject.fixtureGroupTypeName = this.sourceForEditForm[i].selectName;
          break;
        case 'fixtureGroupName':
          selectObject.fixtureGroupName = this.sourceForEditForm[i].selectCode;
          break;
        default:
          break;
      }
    }

    if (this.typeEditWindow === 'ins') {
      // definde param befor ins

      // ins
      this.oSub = this.fixtureGroupService.ins(selectObject).subscribe(
        response => {
          selectObject.fixtureGroupId = +response;
          MaterialService.toast(`Группа светильников c id = ${selectObject.fixtureGroupId} была добавлена.`);
        },
        error => MaterialService.toast(error.error.message),
        () => {
          // close edit window
          this.editWindow.closeDestroyWindow();
          // update data source
          this.jqxgridComponent.refresh_ins(
            selectObject.fixtureGroupId, selectObject);
        }
      );
    }
    if (this.typeEditWindow === 'upd') {
      // definde param befor upd
      this.jqxgridComponent.selectRow.ownerId = selectObject.ownerId;
      this.jqxgridComponent.selectRow.ownerCode = selectObject.ownerCode;
      this.jqxgridComponent.selectRow.fixtureGroupTypeId = selectObject.fixtureGroupTypeId;
      this.jqxgridComponent.selectRow.fixtureGroupTypeName = selectObject.fixtureGroupTypeName;
      this.jqxgridComponent.selectRow.fixtureGroupName = selectObject.fixtureGroupName;

      // upd
      this.oSub = this.fixtureGroupService.upd(this.jqxgridComponent.selectRow).subscribe(
        response => {
          MaterialService.toast(`Группа c id = ${this.jqxgridComponent.selectRow.fixtureGroupId} была обновлена.`);
        },
        error => MaterialService.toast(error.error.message),
        () => {
          // close edit window
          this.editWindow.closeDestroyWindow();
          // update data source
          this.jqxgridComponent.refresh_upd(
            this.jqxgridComponent.selectRow.fixtureGroupId, this.jqxgridComponent.selectRow);
        }
      );
    }
  }

  getSourceForEditForm() {
    for (let i = 0; i < this.sourceForEditForm.length; i++) {
      if (this.typeEditWindow === 'ins') {
        this.sourceForEditForm[i].selectedIndex = 0;
        this.sourceForEditForm[i].selectId = '1';
        this.sourceForEditForm[i].selectCode = 'пусто';
        this.sourceForEditForm[i].selectName = 'пусто';
      }
      switch (this.sourceForEditForm[i].nameField) {
        case 'fixtureGroupOwners':
          this.sourceForEditForm[i].source = this.fixtureGroupOwners;
          if (this.typeEditWindow === 'ins') {
            this.sourceForEditForm[i].selectId = this.fixtureGroupOwners[0].id.toString();
            this.sourceForEditForm[i].selectCode = this.fixtureGroupOwners.find(
              (one: Owner) => one.id === +this.sourceForEditForm[i].selectId).code;
            this.sourceForEditForm[i].selectName = this.fixtureGroupOwners.find(
              (one: Owner) => one.id === +this.sourceForEditForm[i].selectId).name;
          }
          if (this.typeEditWindow === 'upd') {
            this.sourceForEditForm[i].selectId = this.jqxgridComponent.selectRow.ownerId.toString();
            this.sourceForEditForm[i].selectCode = this.fixtureGroupOwners.find(
              (ownerOne: Owner) => ownerOne.id === +this.jqxgridComponent.selectRow.ownerId).code;
            this.sourceForEditForm[i].selectName = this.fixtureGroupOwners.find(
              (ownerOne: Owner) => ownerOne.id === +this.jqxgridComponent.selectRow.ownerId).name;
            for (let j = 0; j < this.fixtureGroupOwners.length; j++) {
              if (+this.fixtureGroupOwners[j].id === +this.jqxgridComponent.selectRow.ownerId) {
                this.sourceForEditForm[i].selectedIndex = j;
                break;
              }
            }
          }
          break;
        case 'fixtureGroupTypes':
          this.sourceForEditForm[i].source = this.fixtureGroupTypes;
          if (this.typeEditWindow === 'ins') {
            this.sourceForEditForm[i].selectId = this.fixtureGroupTypes[0].id.toString();
            this.sourceForEditForm[i].selectName = this.fixtureGroupTypes.find(
              (one: FixtureGroupType) => one.id === +this.sourceForEditForm[i].selectId).name;
          }
          if (this.typeEditWindow === 'upd') {
            this.sourceForEditForm[i].selectId = this.jqxgridComponent.selectRow.fixtureGroupTypeId.toString();
            this.sourceForEditForm[i].selectName = this.fixtureGroupTypes.find(
              (fixtureGroupType: FixtureGroupType) => fixtureGroupType.id === +this.jqxgridComponent.selectRow.fixtureGroupTypeId).name;
            for (let j = 0; j < this.fixtureGroupTypes.length; j++) {
              if (+this.fixtureGroupTypes[j].id === +this.jqxgridComponent.selectRow.fixtureGroupTypeId) {
                this.sourceForEditForm[i].selectedIndex = j;
                break;
              }
            }
          }
          break;
        case 'fixtureGroupName':
          if (this.typeEditWindow === 'upd') {
            this.sourceForEditForm[i].selectCode = this.jqxgridComponent.selectRow.fixtureGroupName;
          }
          break;
        default:
          break;
      }
    }
  }

  setEditFormVisible() {
    this.isEditFormVisible = !this.isEditFormVisible;
  }

  saveSwitchOnEditwinBtn() {
    // refresh child child table
    this.onFeedback.emit('SwitchOn');
  }

  saveEditSwitchOffwinBtn() {
    // refresh child child table
    this.onFeedback.emit('SwitchOff');
  }

  // EVENT FORM

  okEvenwinBtn() {
    if (this.actionEventWindow === 'del') {
      const selectedrowindex = this.jqxgridComponent.myGrid.getselectedrowindex();
      const id = this.jqxgridComponent.myGrid.getrowid(selectedrowindex);

      if (+id >= 0) {
        this.fixtureGroupService.del(+id).subscribe(
          response => {
            MaterialService.toast('Группа светильников была удалена!');
          },
          error => MaterialService.toast(error.error.message),
          () => {
            this.jqxgridComponent.refresh_del([+id]);
          }
        );
      }
    }
  }
}
