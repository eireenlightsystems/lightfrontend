// angular lib
import {Component, Input, OnInit, OnDestroy, ViewChild, EventEmitter, Output} from '@angular/core';
import {Subscription} from 'rxjs/index';
import {isUndefined} from 'util';
import {TranslateService} from '@ngx-translate/core';
import {MatSnackBar} from '@angular/material/snack-bar';
// jqwidgets
// app interfaces
import {
  Fixture, FixtureGroup, Owner, FixtureGroupType,
  FilterFixtureGroup, SourceForFilter,
  SettingButtonPanel,
  SourceForJqxGrid,
  SettingWinForEditForm, SourceForEditForm, NavItem
} from '../../../../shared/interfaces';
// app services
import {FixtureGroupService} from '../../../../shared/services/fixture/fixtureGroup.service';
// app components
import {FixturecomeditFormComponent}
  from '../../fixture-masterdetails-page/fixturecomlist-page/fixturecomedit-form/fixturecomedit-form.component';
import {FixturecomeditSwitchoffFormComponent}
  from '../../fixture-masterdetails-page/fixturecomlist-page/fixturecomedit-switchoff-form/fixturecomedit-switchoff-form.component';
import {JqxgridComponent} from '../../../../shared/components/jqxgrid/jqxgrid.component';
import {ButtonPanelComponent} from '../../../../shared/components/button-panel/button-panel.component';
import {FilterTableComponent} from '../../../../shared/components/filter-table/filter-table.component';
import {EditFormComponent} from '../../../../shared/components/edit-form/edit-form.component';
import {EventWindowComponent} from '../../../../shared/components/event-window/event-window.component';


const STEP = 1000000000000;


@Component({
  selector: 'app-fixture-grlist-page',
  templateUrl: './fixture-grlist-page.component.html',
  styleUrls: ['./fixture-grlist-page.component.css']
})
export class FixtureGrlistPageComponent implements OnInit, OnDestroy {

  // variables from parent component
  @Input() siteMap: NavItem[];
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
  @ViewChild('jqxgridComponent', {static: false}) jqxgridComponent: JqxgridComponent;
  @ViewChild('buttonPanel', {static: false}) buttonPanel: ButtonPanelComponent;
  @ViewChild('filterTable', {static: false}) filterTable: FilterTableComponent;
  @ViewChild('editForm', {static: false}) editForm: EditFormComponent;
  @ViewChild('editFormSwitchOn', {static: false}) editFormSwitchOn: FixturecomeditFormComponent;
  @ViewChild('editFormSwitchOff', {static: false}) editFormSwitchOff: FixturecomeditSwitchoffFormComponent;
  @ViewChild('eventWindow', {static: false}) eventWindow: EventWindowComponent;

  // other variables
  offset = 0;
  limit = STEP;
  loading = false;
  reloading = false;
  noMoreItems = false;
  columnsGrid: any[];
  listBoxSource: any[];
  columnsGridEng: any[];
  listBoxSourceEng: any[];
  // main
  items: FixtureGroup[] = [];
  // grid
  oSub: Subscription;
  selectItemId = 0;
  sourceForJqxGrid: SourceForJqxGrid;
  // filter
  filter: FilterFixtureGroup = {
    ownerId: '',
    fixtureGroupTypeId: '',
  };
  sourceForFilter: SourceForFilter[];
  sourceForFilterEng: SourceForFilter[];
  isFilterVisible = false;
  filterSelect = '';
  // edit form
  settingWinForEditForm: SettingWinForEditForm;
  sourceForEditForm: SourceForEditForm[];
  sourceForEditFormEng: SourceForEditForm[];
  isEditFormInit = false;
  isEditFormSwitchOnInit = false;
  isEditFormSwitchOffInit = false;
  fixtureIds: number[] = [];
  typeEditWindow = '';
  // link form
  // event form
  warningEventWindow = '';
  actionEventWindow = '';


  constructor(private _snackBar: MatSnackBar,
              // service
              public translate: TranslateService,
              private fixtureGroupService: FixtureGroupService) {
  }

  ngOnInit() {
    // define columns for table
    this.columnsGrid =
      [
        {text: 'fixtureGroupId', datafield: 'fixtureGroupId', width: 150},
        {text: 'Название', datafield: 'fixtureGroupName', width: 200},
        {text: 'Адрес', datafield: 'geographFullName', width: 400},
        {text: 'Тип групы', datafield: 'fixtureGroupTypeName', width: 200},
        {text: 'Владелец', datafield: 'ownerCode', width: 200},
      ];
    this.listBoxSource =
      [
        {label: 'fixtureGroupId', value: 'fixtureGroupId', checked: true},
        {label: 'Название', value: 'fixtureGroupName', checked: true},
        {label: 'Адрес', value: 'geographFullName', checked: true},
        {label: 'Тип групы', value: 'fixtureGroupTypeName', checked: true},
        {label: 'Владелец', value: 'ownerCode', checked: true},
      ];
    this.columnsGridEng =
      [
        {text: 'fixtureGroupId', datafield: 'fixtureGroupId', width: 150},
        {text: 'Name', datafield: 'fixtureGroupName', width: 200},
        {text: 'Address', datafield: 'geographFullName', width: 400},
        {text: 'Group type', datafield: 'fixtureGroupTypeName', width: 200},
        {text: 'Owner', datafield: 'ownerCode', width: 200},
      ];
    this.listBoxSourceEng =
      [
        {label: 'fixtureGroupId', value: 'fixtureGroupId', checked: true},
        {label: 'Name', value: 'fixtureGroupName', checked: true},
        {label: 'Address', value: 'geographFullName', checked: true},
        {label: 'Group type', value: 'fixtureGroupTypeName', checked: true},
        {label: 'Owner', value: 'ownerCode', checked: true},
      ];

    // jqxgrid
    this.sourceForJqxGrid = {
      listbox: {
        theme: 'material',
        width: 150,
        height: this.heightGrid / 3,
        checkboxes: true,
        filterable: true,
        allowDrag: true
      },
      grid: {
        source: this.items,
        theme: 'material',
        width: null,
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

    // define filter
    this.sourceForFilter = [
      {
        name: 'fixtureGroupOwners',
        type: 'jqxComboBox',
        source: this.fixtureGroupOwners,
        theme: 'material',
        width: '380',
        height: '45',
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
        width: '380',
        height: '45',
        placeHolder: 'Тип группы:',
        displayMember: 'name',
        valueMember: 'id',
        defaultValue: '',
        selectId: ''
      }
    ];
    this.sourceForFilterEng = [
      {
        name: 'fixtureGroupOwners',
        type: 'jqxComboBox',
        source: this.fixtureGroupOwners,
        theme: 'material',
        width: '380',
        height: '45',
        placeHolder: 'Owner:',
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
        width: '380',
        height: '45',
        placeHolder: 'Group type:',
        displayMember: 'name',
        valueMember: 'id',
        defaultValue: '',
        selectId: ''
      }
    ];

    // definde edit form
    this.settingWinForEditForm = {
      code: 'editFormFixtureGr',
      name: 'Add/edit fixture groups',
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
    this.sourceForEditFormEng = [
      {
        nameField: 'fixtureGroupOwners',
        type: 'jqxComboBox',
        source: this.fixtureGroupOwners,
        theme: 'material',
        width: '285',
        height: '20',
        placeHolder: 'Owner:',
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
        placeHolder: 'Group type:',
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
        placeHolder: 'Name:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      }
    ];

    // definde link form

    if (this.isMasterGrid) {
      this.refreshGrid();
    } else {
      // disabled/available buttons
      this.getAvailabilityButtons();
    }
  }

  ngOnDestroy(): void {
    if (this.oSub) {
      this.oSub.unsubscribe();
    }
    if (this.jqxgridComponent) {
      this.jqxgridComponent.destroyGrid();
    }
    if (this.filterTable) {
      this.filterTable.destroy();
    }
    if (this.buttonPanel) {
      this.buttonPanel.destroy();
    }
    if (this.editForm) {
      this.editForm.destroy();
    }
    if (this.editFormSwitchOn) {
      this.editFormSwitchOn.destroy();
    }
    if (this.editFormSwitchOff) {
      this.editFormSwitchOff.destroy();
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

    // initialization source for filter
    setTimeout(() => {
      this.initSourceFilter();
    }, 1000);

    // disabled/available buttons
    this.getAvailabilityButtons();

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

  getAvailabilityButtons() {
    if (!this.isMasterGrid) {
      this.getDisabledButtons();
    } else {
      this.getEnabledButtons();
    }
  }

  getDisabledButtons() {
    if (!isUndefined(this.settingButtonPanel)) {
      this.settingButtonPanel.add.disabled = true;
      this.settingButtonPanel.upd.disabled = true;
      this.settingButtonPanel.del.disabled = true;
      this.settingButtonPanel.refresh.disabled = true;
      this.settingButtonPanel.setting.disabled = true;
      this.settingButtonPanel.filterList.disabled = true;
      this.settingButtonPanel.place.disabled = true;
      this.settingButtonPanel.pinDrop.disabled = true;
      this.settingButtonPanel.groupIn.disabled = true;
      this.settingButtonPanel.groupOut.disabled = true;
      this.settingButtonPanel.switchOn.disabled = true;
      this.settingButtonPanel.switchOff.disabled = true;
    }
  }

  getEnabledButtons() {
    if (!isUndefined(this.settingButtonPanel)) {
      this.settingButtonPanel.add.disabled = false;
      this.settingButtonPanel.upd.disabled = false;
      this.settingButtonPanel.del.disabled = false;
      this.settingButtonPanel.refresh.disabled = false;
      this.settingButtonPanel.setting.disabled = false;
      this.settingButtonPanel.filterList.disabled = false;
      this.settingButtonPanel.place.disabled = false;
      this.settingButtonPanel.pinDrop.disabled = false;
      this.settingButtonPanel.groupIn.disabled = false;
      this.settingButtonPanel.groupOut.disabled = false;
      this.settingButtonPanel.switchOn.disabled = false;
      this.settingButtonPanel.switchOff.disabled = false;
    }
  }

  loadMore() {
    this.offset += STEP;
    this.loading = true;
    this.getAll();
  }

  ins() {
    this.typeEditWindow = 'ins';
    this.getSourceForEditForm();
    this.isEditFormInit = true;
  }

  upd() {
    if (!isUndefined(this.jqxgridComponent.selectRow)) {
      this.typeEditWindow = 'upd';
      this.getSourceForEditForm();
      this.isEditFormInit = true;
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow =
        this.translate.instant('site.menu.operator.fixture-page.fixturegroup-md-page.fixture-grlist-page.upd-warning');
      this.eventWindow.openEventWindow();
    }
  }

  del() {
    if (!isUndefined(this.jqxgridComponent.selectRow)) {
      this.eventWindow.okButtonDisabled(false);
      this.actionEventWindow = 'del';
      this.warningEventWindow = this.translate.instant(
        'site.menu.operator.fixture-page.fixturegroup-md-page.fixture-grlist-page.del-question')
        + this.jqxgridComponent.selectRow.fixtureGroupId + '?';
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow = this.translate.instant(
        'site.menu.operator.fixture-page.fixturegroup-md-page.fixture-grlist-page.del-warning');
    }
    this.eventWindow.openEventWindow();
  }

  refresh() {
    this.refreshGrid();
  }

  setting() {
    this.jqxgridComponent.openSettinWin();
  }

  filterList() {
    if (this.filterTable.filtrWindow.isOpen()) {
      this.filterTable.close();
    } else {
      this.initSourceFilter();
      this.filterTable.open();
    }
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
    this.fixtureIds = [];
    for (let i = 0; i < fixtures.length; i++) {
      this.fixtureIds[i] = +fixtures[i].fixtureId;
    }
    this.isEditFormSwitchOnInit = true;
  }

  switchOff(fixtures: Fixture[]) {
    this.fixtureIds = [];
    for (let i = 0; i < fixtures.length; i++) {
      this.fixtureIds[i] = +fixtures[i].fixtureId;
    }
    this.isEditFormSwitchOffInit = true;
  }

  // FILTER

  applyFilter(filter: FilterFixtureGroup) {
    this.filter = filter;
    this.refreshGrid();
  }

  applyFilterFromFilter(event: any) {
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
    this.refreshGrid();
  }

  initSourceFilter() {
    if (this.isFilterVisible === false
      && !isUndefined(this.fixtureGroupOwners)
      && !isUndefined(this.fixtureGroupTypes)) {
      this.isFilterVisible = true;
      if (this.translate.currentLang === 'ru') {
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
      if (this.translate.currentLang === 'en') {
        for (let i = 0; i < this.sourceForFilterEng.length; i++) {
          switch (this.sourceForFilterEng[i].name) {
            case 'fixtureGroupOwners':
              this.sourceForFilterEng[i].source = this.fixtureGroupOwners;
              break;
            case 'fixtureGroupTypes':
              this.sourceForFilterEng[i].source = this.fixtureGroupTypes;
              break;
            default:
              break;
          }
        }
      }
    }
    // view select filter for user
    if (this.isFilterVisible === true) {
      this.filterSelect = this.filterTable.getFilterSelect();
    }
  }

  // EDIT FORM

  saveEditFormBtn() {
    const selectObject: FixtureGroup = new FixtureGroup();

    for (let i = 0; i < this.editForm.sourceForEditForm.length; i++) {
      switch (this.editForm.sourceForEditForm[i].nameField) {
        case 'fixtureGroupOwners':
          selectObject.ownerId = +this.editForm.sourceForEditForm[i].selectId;
          selectObject.ownerCode = this.editForm.sourceForEditForm[i].selectCode;
          break;
        case 'fixtureGroupTypes':
          selectObject.fixtureGroupTypeId = +this.editForm.sourceForEditForm[i].selectId;
          selectObject.fixtureGroupTypeName = this.editForm.sourceForEditForm[i].selectName;
          break;
        case 'fixtureGroupName':
          selectObject.fixtureGroupName = this.editForm.sourceForEditForm[i].selectCode;
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
          this.openSnackBar(this.translate.instant('site.menu.operator.fixture-page.fixturegroup-md-page.fixture-grlist-page.ins')
            + selectObject.fixtureGroupId, this.translate.instant('site.forms.editforms.ok'));
        },
        error =>
          this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok')),
        () => {
          // close edit window
          this.editForm.closeDestroy();
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
          this.openSnackBar(this.translate.instant('site.menu.operator.fixture-page.fixturegroup-md-page.fixture-grlist-page.upd')
            + this.jqxgridComponent.selectRow.fixtureGroupId, this.translate.instant('site.forms.editforms.ok'));
        },
        error =>
          this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok')),
        () => {
          // close edit window
          this.editForm.closeDestroy();
          // update data source
          this.jqxgridComponent.refresh_upd(
            this.jqxgridComponent.selectRow.fixtureGroupId, this.jqxgridComponent.selectRow);
        }
      );
    }
  }

  getSourceForEditForm() {
    let sourceForEditForm: any[];
    if (this.translate.currentLang === 'ru') {
      sourceForEditForm = this.sourceForEditForm;
    }
    if (this.translate.currentLang === 'en') {
      sourceForEditForm = this.sourceForEditFormEng;
    }

    for (let i = 0; i < sourceForEditForm.length; i++) {
      if (this.typeEditWindow === 'ins') {
        sourceForEditForm[i].selectedIndex = 0;
        sourceForEditForm[i].selectId = '1';
        sourceForEditForm[i].selectCode = this.translate.instant('site.forms.editforms.empty');
        sourceForEditForm[i].selectName = this.translate.instant('site.forms.editforms.empty');
      }
      switch (sourceForEditForm[i].nameField) {
        case 'fixtureGroupOwners':
          sourceForEditForm[i].source = this.fixtureGroupOwners;
          if (this.typeEditWindow === 'ins') {
            sourceForEditForm[i].selectId = this.fixtureGroupOwners[0].id.toString();
            sourceForEditForm[i].selectCode = this.fixtureGroupOwners.find(
              (one: Owner) => one.id === +sourceForEditForm[i].selectId).code;
            sourceForEditForm[i].selectName = this.fixtureGroupOwners.find(
              (one: Owner) => one.id === +sourceForEditForm[i].selectId).name;
          }
          if (this.typeEditWindow === 'upd') {
            sourceForEditForm[i].selectId = this.jqxgridComponent.selectRow.ownerId.toString();
            sourceForEditForm[i].selectCode = this.fixtureGroupOwners.find(
              (ownerOne: Owner) => ownerOne.id === +this.jqxgridComponent.selectRow.ownerId).code;
            sourceForEditForm[i].selectName = this.fixtureGroupOwners.find(
              (ownerOne: Owner) => ownerOne.id === +this.jqxgridComponent.selectRow.ownerId).name;
            for (let j = 0; j < this.fixtureGroupOwners.length; j++) {
              if (+this.fixtureGroupOwners[j].id === +this.jqxgridComponent.selectRow.ownerId) {
                sourceForEditForm[i].selectedIndex = j;
                break;
              }
            }
          }
          break;
        case 'fixtureGroupTypes':
          sourceForEditForm[i].source = this.fixtureGroupTypes;
          if (this.typeEditWindow === 'ins') {
            sourceForEditForm[i].selectId = this.fixtureGroupTypes[0].id.toString();
            sourceForEditForm[i].selectName = this.fixtureGroupTypes.find(
              (one: FixtureGroupType) => one.id === +sourceForEditForm[i].selectId).name;
          }
          if (this.typeEditWindow === 'upd') {
            sourceForEditForm[i].selectId = this.jqxgridComponent.selectRow.fixtureGroupTypeId.toString();
            sourceForEditForm[i].selectName = this.fixtureGroupTypes.find(
              (fixtureGroupType: FixtureGroupType) => fixtureGroupType.id === +this.jqxgridComponent.selectRow.fixtureGroupTypeId).name;
            for (let j = 0; j < this.fixtureGroupTypes.length; j++) {
              if (+this.fixtureGroupTypes[j].id === +this.jqxgridComponent.selectRow.fixtureGroupTypeId) {
                sourceForEditForm[i].selectedIndex = j;
                break;
              }
            }
          }
          break;
        case 'fixtureGroupName':
          if (this.typeEditWindow === 'upd') {
            sourceForEditForm[i].selectCode = this.jqxgridComponent.selectRow.fixtureGroupName;
          }
          break;
        default:
          break;
      }
    }
  }

  destroyEditForm() {
    this.isEditFormInit = false;
  }

  saveEditFormSwitchOnBtn() {
    // refresh child child table
    this.onFeedback.emit('SwitchOn');
  }

  saveEditFormSwitchOffBtn() {
    // refresh child child table
    this.onFeedback.emit('SwitchOff');
  }

  destroyEditFormSwitchOn() {
    this.isEditFormSwitchOnInit = false;
  }

  destroyEditFormSwitchOff() {
    this.isEditFormSwitchOffInit = false;
  }

  // EVENT FORM

  okEvenwinBtn() {
    if (this.actionEventWindow === 'del') {
      const selectedrowindex = this.jqxgridComponent.myGrid.getselectedrowindex();
      const id = this.jqxgridComponent.myGrid.getrowid(selectedrowindex);

      if (+id >= 0) {
        this.fixtureGroupService.del(+id).subscribe(
          response => {
            this.openSnackBar(this.translate.instant('site.menu.operator.fixture-page.fixturegroup-md-page.fixture-grlist-page.del'),
              this.translate.instant('site.forms.editforms.ok'));
          },
          error =>
            this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok')),
          () => {
            this.jqxgridComponent.refresh_del([+id]);
          }
        );
      }
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }
}
