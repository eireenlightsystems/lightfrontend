import {Component, Input, OnInit, OnDestroy, ViewChild, EventEmitter, Output} from '@angular/core';
import {Subscription} from 'rxjs/index';
import {isUndefined} from 'util';

import {FixtureService} from '../../../../shared/services/fixture/fixture.service';
import {
  Fixture, EquipmentType, Geograph, Owner, Substation, Contract, Installer, HeightType,
  FilterFixture, SourceForFilter,
  SettingButtonPanel,
  SourceForJqxGrid,
  SettingWinForEditForm, SourceForEditForm,
  SourceForLinkForm, ItemsLinkForm
} from '../../../../shared/interfaces';
import {JqxgridComponent} from '../../../../shared/components/jqxgrid/jqxgrid.component';
import {ButtonPanelComponent} from '../../../../shared/components/button-panel/button-panel.component';
import {FilterTableComponent} from '../../../../shared/components/filter-table/filter-table.component';
import {EditFormComponent} from '../../../../shared/components/edit-form/edit-form.component';
import {LinkFormComponent} from '../../../../shared/components/link-form/link-form.component';
import {EventWindowComponent} from '../../../../shared/components/event-window/event-window.component';
import {MaterialService} from '../../../../shared/classes/material.service';


const STEP = 1000000000000;


@Component({
  selector: 'app-fixturelist-page',
  templateUrl: './fixturelist-page.component.html',
  styleUrls: ['./fixturelist-page.component.css']
})
export class FixturelistPageComponent implements OnInit, OnDestroy {

  // variables from master component
  @Input() geographs: Geograph[];
  @Input() ownerFixtures: Owner[];
  @Input() fixtureTypes: EquipmentType[];
  @Input() substations: Substation[];
  @Input() contractFixtures: Contract[];
  @Input() installers: Installer[];
  @Input() heightTypes: HeightType[];

  @Input() selectContractId: string;
  @Input() selectNodeId: string;
  @Input() fixtureGroupId: string;

  @Input() heightGrid: number;
  @Input() isMasterGrid: boolean;
  @Input() selectionmode: string;

  @Input() settingButtonPanel: SettingButtonPanel;

  // determine the functions that need to be performed in the parent component
  @Output() onRefreshChildGrid = new EventEmitter<number>();
  @Output() onGetFixtures = new EventEmitter<Fixture[]>();

  // define variables - link to view objects
  @ViewChild('jqxgridComponent') jqxgridComponent: JqxgridComponent;
  @ViewChild('buttonPanel') buttonPanel: ButtonPanelComponent;
  @ViewChild('filterTable') filterTable: FilterTableComponent;
  @ViewChild('editWindow') editWindow: EditFormComponent;
  @ViewChild('linkWindow') linkWindow: LinkFormComponent;
  @ViewChild('linkGrFixWindow') linkGrFixWindow: LinkFormComponent;
  @ViewChild('eventWindow') eventWindow: EventWindowComponent;

  // other variables
  offset = 0;
  limit = STEP;
  loading = false;
  reloading = false;
  noMoreItems = false;
  columnsGrid: any[];
  listBoxSource: any[];
  // main
  items: Fixture[] = [];
  filter: FilterFixture = {
    geographId: '',
    ownerId: '',
    fixtureTypeId: '',
    substationId: '',
    modeId: '',

    contractId: '',
    nodeId: ''
  };
  // grid
  oSub: Subscription;
  selectItemId = 0;
  sourceForJqxGrid: SourceForJqxGrid;
  // filter
  sourceForFilter: SourceForFilter[];
  isFilterVisible = false;
  modes = [
    {
      id: 0,
      code: 'Выкл.'
    },
    {
      id: 1,
      code: 'Вкл.'
    }
  ];
  // edit form
  settingWinForEditForm: SettingWinForEditForm;
  sourceForEditForm: SourceForEditForm[];
  isEditFormVisible = false;
  typeEditWindow = '';
  // link form
  oSubForLinkWin: Subscription;
  oSubLink: Subscription;
  sourceForLinkForm: SourceForLinkForm;
  sourceGrFixForLinkForm: SourceForLinkForm;
  // event form
  warningEventWindow = '';
  actionEventWindow = '';


  constructor(private fixtureService: FixtureService) {
  }

  ngOnInit() {
    // define columns for table
    if (this.isMasterGrid) {
      this.columnsGrid =
        [
          {text: 'fixtureId', datafield: 'fixtureId', width: 150},

          {text: 'Географическое понятие', datafield: 'geographCode', width: 150},
          {text: 'Договор', datafield: 'contractCode', width: 150, hidden: true},
          {text: 'Владелец', datafield: 'ownerCode', width: 150},
          {text: 'Тип светильника', datafield: 'fixtureTypeCode', width: 150},
          {text: 'Подстанция', datafield: 'substationCode', width: 150},
          {text: 'Установщик', datafield: 'installerCode', width: 150, hidden: true},
          {text: 'Код высоты', datafield: 'heightTypeCode', width: 150},

          {text: 'Серийный номер', datafield: 'serialNumber', width: 150},
          {text: 'Коментарий', datafield: 'comment', width: 150},

          {text: 'Режим', datafield: 'flgLight', width: 150, hidden: true},
        ];
      // define a data source for filtering table columns
      this.listBoxSource =
        [
          {label: 'fixtureId', value: 'fixtureId', checked: true},

          {label: 'Географическое понятие', value: 'geographCode', checked: true},
          {label: 'Договор', value: 'contractCode', checked: false},
          {label: 'Владелец', value: 'ownerCode', checked: true},
          {label: 'Тип светильника', value: 'fixtureTypeCode', checked: true},
          {label: 'Подстанция', value: 'substationCode', checked: true},
          {label: 'Установщик', value: 'installerCode', checked: false},
          {label: 'Код высоты', value: 'heightTypeCode', checked: true},

          {label: 'Серийный номер', value: 'serialNumber', checked: true},
          {label: 'Коментарий', value: 'comment', checked: true},

          {label: 'Режим', value: 'flgLight', checked: false},
        ];
    } else {
      this.columnsGrid =
        [
          {text: 'fixtureId', datafield: 'fixtureId', width: 150},

          {text: 'Договор', datafield: 'contractCode', width: 150, hidden: true},
          {text: 'Тип светильника', datafield: 'fixtureTypeCode', width: 150},
          {text: 'Подстанция', datafield: 'substationCode', width: 150},
          {text: 'Установщик', datafield: 'installerCode', width: 150, hidden: true},
          {text: 'Код высоты', datafield: 'heightTypeCode', width: 150},

          {text: 'Серийный номер', datafield: 'serialNumber', width: 150},
          {text: 'Коментарий', datafield: 'comment', width: 150},

          {text: 'Режим', datafield: 'flgLight', width: 150, hidden: true},
        ];
      // define a data source for filtering table columns
      this.listBoxSource =
        [
          {label: 'fixtureId', value: 'fixtureId', checked: true},

          {label: 'Договор', value: 'contractCode', checked: false},
          {label: 'Тип светильника', value: 'fixtureTypeCode', checked: true},
          {label: 'Подстанция', value: 'substationCode', checked: true},
          {label: 'Установщик', value: 'installerCode', checked: false},
          {label: 'Код высоты', value: 'heightTypeCode', checked: true},

          {label: 'Серийный номер', value: 'serialNumber', checked: true},
          {label: 'Коментарий', value: 'comment', checked: true},

          {label: 'Режим', value: 'flgLight', checked: false},
        ];
    }

    // definde filter
    this.sourceForFilter = [
      {
        name: 'geographs',
        type: 'jqxComboBox',
        source: this.geographs,
        theme: 'material',
        width: '200',
        height: '43',
        placeHolder: 'Геогр. понятие:',
        displayMember: 'code',
        valueMember: 'id',
        defaultValue: '',
        selectId: ''
      },
      {
        name: 'ownerFixtures',
        type: 'jqxComboBox',
        source: this.ownerFixtures,
        theme: 'material',
        width: '200',
        height: '43',
        placeHolder: 'Владелец:',
        displayMember: 'code',
        valueMember: 'id',
        defaultValue: '',
        selectId: ''
      },
      {
        name: 'fixtureTypes',
        type: 'jqxComboBox',
        source: this.fixtureTypes,
        theme: 'material',
        width: '200',
        height: '43',
        placeHolder: 'Тип светильника:',
        displayMember: 'code',
        valueMember: 'id',
        defaultValue: '',
        selectId: ''
      },
      {
        name: 'substations',
        type: 'jqxComboBox',
        source: this.substations,
        theme: 'material',
        width: '200',
        height: '43',
        placeHolder: 'Подстанция:',
        displayMember: 'code',
        valueMember: 'id',
        defaultValue: '',
        selectId: ''
      },
      {
        name: 'modes',
        type: 'jqxComboBox',
        source: this.modes,
        theme: 'material',
        width: '200',
        height: '43',
        placeHolder: 'Вкл./выкл.:',
        displayMember: 'code',
        valueMember: 'id',
        defaultValue: '',
        selectId: ''
      }
    ];

    // definde window edit form
    this.settingWinForEditForm = {
      code: 'editFormFixture',
      name: 'Добавить/редактировать светильники',
      theme: 'material',
      isModal: true,
      modalOpacity: 0.3,
      width: 450,
      maxWidth: 500,
      minWidth: 460,
      height: 550,
      maxHeight: 550,
      minHeight: 550,
      coordX: 500,
      coordY: 65
    };

    // definde edit form
    this.sourceForEditForm = [
      {
        nameField: 'contractFixtures',
        type: 'jqxComboBox',
        source: this.contractFixtures,
        theme: 'material',
        width: '285',
        height: '20',
        placeHolder: 'Договор:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'fixtureTypes',
        type: 'jqxComboBox',
        source: this.fixtureTypes,
        theme: 'material',
        width: '285',
        height: '20',
        placeHolder: 'Тип светильника:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'substations',
        type: 'jqxComboBox',
        source: this.substations,
        theme: 'material',
        width: '285',
        height: '20',
        placeHolder: 'Подстанция:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'installers',
        type: 'jqxComboBox',
        source: this.installers,
        theme: 'material',
        width: '285',
        height: '20',
        placeHolder: 'Установщик:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'heightTypes',
        type: 'jqxComboBox',
        source: this.heightTypes,
        theme: 'material',
        width: '285',
        height: '20',
        placeHolder: 'Тип высоты:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'serialNumber',
        type: 'jqxTextArea',
        source: [],
        theme: 'material',
        width: '280',
        height: '20',
        placeHolder: 'Серийный номер:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'comment',
        type: 'jqxTextArea',
        source: [],
        theme: 'material',
        width: '280',
        height: '100',
        placeHolder: 'Комментарий:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      }
    ];

    // definde link form
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
        columns: this.columnsGrid,
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
        columns: this.columnsGrid,
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

    // jqxgrid
    this.sourceForJqxGrid = {
      listbox: {
        source: this.listBoxSource,
        theme: 'material',
        width: 150,
        height: this.heightGrid,
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

        valueMember: 'fixtureId',
        sortcolumn: ['fixtureId'],
        sortdirection: 'desc',
        selectId: []
      }
    };

    // if this.node is child grid, then we need update this.filter.nodeId
    if (!this.isMasterGrid) {
      this.filter.nodeId = this.selectNodeId;
    }

    this.getAll();
    this.reloading = true;
  }

  ngOnDestroy() {
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
    if (this.isMasterGrid && !isUndefined(this.jqxgridComponent.selectRow)) {
      this.refreshChildGrid(this.jqxgridComponent.selectRow);
    }
  }

  refreshChildGrid(selectRow: any) {
    this.selectItemId = selectRow.fixtureId;
    // refresh child grid
    this.onRefreshChildGrid.emit(selectRow.fixtureId);
  }

  getAll() {
    // Disabled/available buttons
    if (!this.isMasterGrid && +this.filter.nodeId <= 0) {
      this.settingButtonPanel.add.disabled = true;
      this.settingButtonPanel.upd.disabled = true;
      this.settingButtonPanel.del.disabled = true;
      this.settingButtonPanel.refresh.disabled = true;
      this.settingButtonPanel.filterNone.disabled = true;
      this.settingButtonPanel.filterList.disabled = true;
      this.settingButtonPanel.place.disabled = true;
      this.settingButtonPanel.pinDrop.disabled = true;
      this.settingButtonPanel.groupIn.disabled = true;
      this.settingButtonPanel.groupOut.disabled = true;
      this.settingButtonPanel.switchOn.disabled = true;
      this.settingButtonPanel.switchOff.disabled = true;
    } else {
      this.settingButtonPanel.add.disabled = false;
      this.settingButtonPanel.upd.disabled = false;
      this.settingButtonPanel.del.disabled = false;
      this.settingButtonPanel.refresh.disabled = false;
      this.settingButtonPanel.filterNone.disabled = false;
      this.settingButtonPanel.filterList.disabled = false;
      this.settingButtonPanel.place.disabled = false;
      this.settingButtonPanel.pinDrop.disabled = false;
      this.settingButtonPanel.groupIn.disabled = false;
      this.settingButtonPanel.groupOut.disabled = false;
      this.settingButtonPanel.switchOn.disabled = false;
      this.settingButtonPanel.switchOff.disabled = false;
    }

    if (isUndefined(this.fixtureGroupId) || +this.fixtureGroupId === 0) {
      const params = Object.assign({}, {
          offset: this.offset,
          limit: this.limit
        },
        this.filter);

      this.oSub = this.fixtureService.getAll(params).subscribe(fixtures => {
        this.items = this.items.concat(fixtures);
        this.noMoreItems = fixtures.length < STEP;
        this.loading = false;
        this.reloading = false;
      });
    } else {
      this.oSub = this.fixtureService.getFixtureInGroup(this.fixtureGroupId).subscribe(fixtures => {
        this.items = fixtures;
        this.loading = false;
        this.reloading = false;
        // Send array fixtures for the command switchOn/Off
        this.onGetFixtures.emit(this.items);
      });
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
    this.isEditFormVisible = !this.isEditFormVisible;
  }

  upd() {
    if (!isUndefined(this.jqxgridComponent.selectRow)) {
      this.typeEditWindow = 'upd';
      this.getSourceForEditForm();
      this.isEditFormVisible = !this.isEditFormVisible;
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow = `Вам следует выбрать светильник для редактирования`;
      this.eventWindow.openEventWindow();
    }
  }

  del() {
    if (!isUndefined(this.jqxgridComponent.selectRow)) {
      this.eventWindow.okButtonDisabled(false);
      this.actionEventWindow = 'del';
      this.warningEventWindow = `Удалить светильник id = "${this.jqxgridComponent.selectRow.fixtureId}"?`;
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow = `Вам следует выбрать светильник для удаления`;
    }
    this.eventWindow.openEventWindow();
  }

  refresh() {
    this.refreshGrid();
  }

  filterNone() {
    this.jqxgridComponent.islistBoxVisible = !this.jqxgridComponent.islistBoxVisible;
  }

  filterList() {
    this.isFilterVisible = !this.isFilterVisible;
  }

  place() {
    if (+this.selectNodeId > 1) {
      this.linkWindow.openWindow();
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow = `Вам следует выбрать узел для привязки светильников`;
      this.eventWindow.openEventWindow();
    }
  }

  pinDrop() {
    if (!isUndefined(this.jqxgridComponent.selectRow)) {
      this.eventWindow.okButtonDisabled(false);
      this.actionEventWindow = 'pinDrop';
      this.warningEventWindow = `Отвязать светильники от узла?`;
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow = `Вам следует выбрать светильники для отвязки от узла`;
    }
    this.eventWindow.openEventWindow();
  }

  groupIn() {
    if (+this.fixtureGroupId > 1) {
      this.linkGrFixWindow.openWindow();
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow = `Вам следует выбрать ГРУППУ для привязки светильников`;
      this.eventWindow.openEventWindow();
    }
  }

  groupOut() {
    if (!isUndefined(this.jqxgridComponent.selectRow)) {
      this.eventWindow.okButtonDisabled(false);
      this.actionEventWindow = 'groupOut';
      this.warningEventWindow = `Исключить светильники из группы?`;
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow = `Вам следует выбрать светильники для исключения из группы`;
    }
    this.eventWindow.openEventWindow();
  }

  switchOn() {

  }

  switchOff() {

  }

  // FILTER

  applyFilter(event: any) {
    this.items = [];
    this.offset = 0;
    this.reloading = true;
    this.filter = event;
    this.refreshGrid();
  }

  applyFilterFromFilter(event: any) {
    this.items = [];
    this.offset = 0;
    this.reloading = true;
    for (let i = 0; i < event.length; i++) {
      switch (event[i].name) {
        case 'geographs':
          this.filter.geographId = event[i].id;
          break;
        case 'ownerFixtures':
          this.filter.ownerId = event[i].id;
          break;
        case 'fixtureTypes':
          this.filter.fixtureTypeId = event[i].id;
          break;
        case 'substations':
          this.filter.substationId = event[i].id;
          break;
        case 'modes':
          this.filter.modeId = event[i].id;
          break;
        default:
          break;
      }
    }
    this.refreshGrid();
  }

  initSourceFilter() {
    for (let i = 0; i < this.sourceForFilter.length; i++) {
      switch (this.sourceForFilter[i].name) {
        case 'geographs':
          this.sourceForFilter[i].source = this.geographs;
          break;
        case 'ownerFixtures':
          this.sourceForFilter[i].source = this.ownerFixtures;
          break;
        case 'fixtureTypes':
          this.sourceForFilter[i].source = this.fixtureTypes;
          break;
        case 'substations':
          this.sourceForFilter[i].source = this.substations;
          break;
        default:
          break;
      }
    }
  }

  applyFilterFixtureInGroup(fixtureGroupId: string) {
    this.items = [];
    this.fixtureGroupId = fixtureGroupId;
    this.reloading = true;
    this.refreshGrid();
  }

  // EDIT FORM

  saveEditwinBtn() {
    const selectObject: Fixture = new Fixture();

    for (let i = 0; i < this.sourceForEditForm.length; i++) {
      switch (this.sourceForEditForm[i].nameField) {
        case 'contractFixtures':
          selectObject.contractId = +this.sourceForEditForm[i].selectId;
          selectObject.contractCode = this.sourceForEditForm[i].selectCode;
          break;
        case 'fixtureTypes':
          selectObject.fixtureTypeId = +this.sourceForEditForm[i].selectId;
          selectObject.fixtureTypeCode = this.sourceForEditForm[i].selectCode;
          break;
        case 'substations':
          selectObject.substationId = +this.sourceForEditForm[i].selectId;
          selectObject.substationCode = this.sourceForEditForm[i].selectCode;
          break;
        case 'installers':
          selectObject.installerId = +this.sourceForEditForm[i].selectId;
          selectObject.installerCode = this.sourceForEditForm[i].selectCode;
          break;
        case 'heightTypes':
          selectObject.heightTypeId = +this.sourceForEditForm[i].selectId;
          selectObject.heightTypeCode = this.sourceForEditForm[i].selectCode;
          break;
        case 'serialNumber':
          selectObject.serialNumber = this.sourceForEditForm[i].selectCode;
          break;
        case 'comment':
          selectObject.comment = this.sourceForEditForm[i].selectCode;
          break;
        default:
          break;
      }
    }

    if (this.typeEditWindow === 'ins') {
      // definde param befor ins
      selectObject.nodeId = !isUndefined(this.selectNodeId) ? +this.selectNodeId : 1;

      if (selectObject.nodeId === 1) {
        selectObject.e_coordinate = 0;
        selectObject.n_coordinate = 0;
        selectObject.geographCode = 'пусто';
      }
      // ins
      this.oSub = this.fixtureService.ins(selectObject).subscribe(
        response => {
          selectObject.fixtureId = +response;
          MaterialService.toast(`Светильник c id = ${selectObject.fixtureId} был добавлен.`);
        },
        error => MaterialService.toast(error.error.message),
        () => {
          // close edit window
          this.editWindow.closeDestroyWindow();
          // update data source
          this.jqxgridComponent.refresh_ins(
            selectObject.fixtureId, selectObject);
        }
      );
    }
    if (this.typeEditWindow === 'upd') {
      // definde param befor upd
      this.jqxgridComponent.selectRow.contractId = selectObject.contractId;
      this.jqxgridComponent.selectRow.contractCode = selectObject.contractCode;
      this.jqxgridComponent.selectRow.fixtureTypeId = selectObject.fixtureTypeId;
      this.jqxgridComponent.selectRow.fixtureTypeCode = selectObject.fixtureTypeCode;
      this.jqxgridComponent.selectRow.substationId = selectObject.substationId;
      this.jqxgridComponent.selectRow.substationCode = selectObject.substationCode;
      this.jqxgridComponent.selectRow.installerId = selectObject.installerId;
      this.jqxgridComponent.selectRow.installerCode = selectObject.installerCode;
      this.jqxgridComponent.selectRow.heightTypeId = selectObject.heightTypeId;
      this.jqxgridComponent.selectRow.heightTypeCode = selectObject.heightTypeCode;
      this.jqxgridComponent.selectRow.serialNumber = selectObject.serialNumber;
      this.jqxgridComponent.selectRow.comment = selectObject.comment;

      // upd
      this.oSub = this.fixtureService.upd(this.jqxgridComponent.selectRow).subscribe(
        response => {
          MaterialService.toast(`Светильник c id = ${this.jqxgridComponent.selectRow.fixtureId} был обновлен.`);
        },
        error => MaterialService.toast(error.error.message),
        () => {
          // close edit window
          this.editWindow.closeDestroyWindow();
          // update data source
          this.jqxgridComponent.refresh_upd(
            this.jqxgridComponent.selectRow.fixtureId, this.jqxgridComponent.selectRow);
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
      }
      switch (this.sourceForEditForm[i].nameField) {
        case 'contractFixtures':
          this.sourceForEditForm[i].source = this.contractFixtures;
          if (this.typeEditWindow === 'upd') {
            this.sourceForEditForm[i].selectId = this.jqxgridComponent.selectRow.contractId.toString();
            this.sourceForEditForm[i].selectCode = this.contractFixtures.find(
              (contractOne: Contract) => contractOne.id === +this.jqxgridComponent.selectRow.contractId).code;
            this.sourceForEditForm[i].selectName = this.contractFixtures.find(
              (contractOne: Contract) => contractOne.id === +this.jqxgridComponent.selectRow.contractId).name;
            for (let j = 0; j < this.contractFixtures.length; j++) {
              if (+this.contractFixtures[j].id === +this.jqxgridComponent.selectRow.contractId) {
                this.sourceForEditForm[i].selectedIndex = j;
                break;
              }
            }
          }
          break;
        case 'fixtureTypes':
          this.sourceForEditForm[i].source = this.fixtureTypes;
          if (this.typeEditWindow === 'upd') {
            this.sourceForEditForm[i].selectId = this.jqxgridComponent.selectRow.fixtureTypeId.toString();
            this.sourceForEditForm[i].selectCode = this.fixtureTypes.find(
              (sensorType: EquipmentType) => sensorType.id === +this.jqxgridComponent.selectRow.fixtureTypeId).code;
            this.sourceForEditForm[i].selectName = this.fixtureTypes.find(
              (sensorType: EquipmentType) => sensorType.id === +this.jqxgridComponent.selectRow.fixtureTypeId).name;
            for (let j = 0; j < this.fixtureTypes.length; j++) {
              if (+this.fixtureTypes[j].id === +this.jqxgridComponent.selectRow.fixtureTypeId) {
                this.sourceForEditForm[i].selectedIndex = j;
                break;
              }
            }
          }
          break;
        case 'substations':
          this.sourceForEditForm[i].source = this.substations;
          if (this.typeEditWindow === 'upd') {
            this.sourceForEditForm[i].selectId = this.jqxgridComponent.selectRow.substationId.toString();
            this.sourceForEditForm[i].selectCode = this.substations.find(
              (substation: Substation) => substation.id === +this.jqxgridComponent.selectRow.substationId).code;
            this.sourceForEditForm[i].selectName = this.substations.find(
              (substation: Substation) => substation.id === +this.jqxgridComponent.selectRow.substationId).name;
            for (let j = 0; j < this.substations.length; j++) {
              if (+this.substations[j].id === +this.jqxgridComponent.selectRow.substationId) {
                this.sourceForEditForm[i].selectedIndex = j;
                break;
              }
            }
          }
          break;
        case 'installers':
          this.sourceForEditForm[i].source = this.installers;
          if (this.typeEditWindow === 'upd') {
            this.sourceForEditForm[i].selectId = this.jqxgridComponent.selectRow.installerId.toString();
            this.sourceForEditForm[i].selectCode = this.installers.find(
              (installer: Installer) => installer.id === +this.jqxgridComponent.selectRow.installerId).code;
            this.sourceForEditForm[i].selectName = this.installers.find(
              (installer: Installer) => installer.id === +this.jqxgridComponent.selectRow.installerId).name;
            for (let j = 0; j < this.installers.length; j++) {
              if (+this.installers[j].id === +this.jqxgridComponent.selectRow.installerId) {
                this.sourceForEditForm[i].selectedIndex = j;
                break;
              }
            }
          }
          break;
        case 'heightTypes':
          this.sourceForEditForm[i].source = this.heightTypes;
          if (this.typeEditWindow === 'upd') {
            this.sourceForEditForm[i].selectId = this.jqxgridComponent.selectRow.heightTypeId.toString();
            this.sourceForEditForm[i].selectCode = this.heightTypes.find(
              (heightType: HeightType) => heightType.id === +this.jqxgridComponent.selectRow.heightTypeId).code;
            this.sourceForEditForm[i].selectName = this.heightTypes.find(
              (heightType: HeightType) => heightType.id === +this.jqxgridComponent.selectRow.heightTypeId).name;
            for (let j = 0; j < this.heightTypes.length; j++) {
              if (+this.heightTypes[j].id === +this.jqxgridComponent.selectRow.heightTypeId) {
                this.sourceForEditForm[i].selectedIndex = j;
                break;
              }
            }
          }
          break;
        case 'serialNumber':
          if (this.typeEditWindow === 'upd') {
            this.sourceForEditForm[i].selectCode = this.jqxgridComponent.selectRow.serialNumber;
          }
          break;
        case 'comment':
          if (this.typeEditWindow === 'upd') {
            this.sourceForEditForm[i].selectCode = this.jqxgridComponent.selectRow.comment;
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

  // LINK FORM

  saveLinkwinBtn(event: ItemsLinkForm) {
    if (event.code === this.sourceForLinkForm.window.code) {
      this.oSubLink = this.fixtureService.setNodeId(+this.selectNodeId, event.Ids).subscribe(
        response => {
          MaterialService.toast('Выбранные елементы привязаны!');
        },
        error => {
          MaterialService.toast(error.error.message);
        },
        () => {
          this.linkWindow.hideWindow();
          // refresh table
          this.refreshGrid();
        }
      );
    }
    if (event.code === this.sourceGrFixForLinkForm.window.code) {
      this.oSubLink = this.fixtureService.setFixtureInGroup(+this.fixtureGroupId, event.Ids).subscribe(
        response => {
          MaterialService.toast('Светильники добавлены в группу!');
        },
        error => {
          MaterialService.toast(error.error.message);
        },
        () => {
          this.linkGrFixWindow.hideWindow();
          // refresh table
          this.refreshGrid();
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

  // EVENT FORM

  okEvenwinBtn() {
    const fixtureIds = [];
    for (let i = 0; i < this.jqxgridComponent.myGrid.widgetObject.selectedrowindexes.length; i++) {
      fixtureIds[i] = this.jqxgridComponent.source_jqxgrid.localdata[
        this.jqxgridComponent.myGrid.widgetObject.selectedrowindexes[i]].fixtureId;
    }

    if (this.actionEventWindow === 'del') {
      const selectedrowindex = this.jqxgridComponent.myGrid.getselectedrowindex();
      const id = this.jqxgridComponent.myGrid.getrowid(selectedrowindex);

      if (+id >= 0) {
        this.fixtureService.del(+id).subscribe(
          response => {
            MaterialService.toast('Светильник был удален!');
          },
          error => MaterialService.toast(error.error.message),
          () => {
            this.jqxgridComponent.refresh_del([+id]);
          }
        );
      }
    }

    if (this.actionEventWindow === 'pinDrop') {
      this.oSub = this.fixtureService.delNodeId(+this.selectNodeId, fixtureIds).subscribe(
        response => {
          MaterialService.toast('Светильники отвязаны от столба!');
        },
        error => {
          MaterialService.toast(error.error.message);
        },
        () => {
          // refresh table
          this.refreshGrid();
        }
      );
    }

    if (this.actionEventWindow === 'groupOut') {
      this.oSub = this.fixtureService.delFixtureInGroup(+this.fixtureGroupId, fixtureIds).subscribe(
        response => {
          MaterialService.toast('Светильники удалены из группы!');
        },
        error => {
          MaterialService.toast(error.error.message);
        },
        () => {
          // refresh table
          this.refreshGrid();
        }
      );
    }
  }
}



