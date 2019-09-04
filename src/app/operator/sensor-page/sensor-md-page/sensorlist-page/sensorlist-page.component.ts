// angular lib
import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs/index';
import {MaterializeService} from '../../../../shared/classes/materialize.service';
import {isUndefined} from 'util';
import {TranslateService} from '@ngx-translate/core';
import {MatSnackBar} from '@angular/material/snack-bar';
// jqwidgets
// app interfaces
import {
  Contract, Owner, FilterSensor, EquipmentType, Sensor,
  SourceForFilter, SettingButtonPanel, SettingWinForEditForm, SourceForEditForm, SourceForLinkForm, ItemsLinkForm, SourceForJqxGrid, NavItem
} from '../../../../shared/interfaces';
// app services
import {SensorService} from '../../../../shared/services/sensor/sensor.service';
// app components
import {EditFormComponent} from '../../../../shared/components/edit-form/edit-form.component';
import {ButtonPanelComponent} from '../../../../shared/components/button-panel/button-panel.component';
import {FilterTableComponent} from '../../../../shared/components/filter-table/filter-table.component';
import {EventWindowComponent} from '../../../../shared/components/event-window/event-window.component';
import {LinkFormComponent} from '../../../../shared/components/link-form/link-form.component';
import {JqxgridComponent} from '../../../../shared/components/jqxgrid/jqxgrid.component';


const STEP = 1000000000000;


@Component({
  selector: 'app-sensorlist-page',
  templateUrl: './sensorlist-page.component.html',
  styleUrls: ['./sensorlist-page.component.css']
})
export class SensorlistPageComponent implements OnInit, OnDestroy {

  // variables from parent component
  @Input() siteMap: NavItem[];
  @Input() ownerSensors: Owner[];
  @Input() sensorTypes: EquipmentType[];
  @Input() contractSensors: Contract[];
  @Input() selectNodeId: number;
  @Input() heightGrid: number;
  @Input() isMasterGrid: boolean;
  @Input() selectionmode: string;
  @Input() settingButtonPanel: SettingButtonPanel;

  // determine the functions that need to be performed in the parent component
  @Output() onRefreshChildGrid = new EventEmitter<number>();

  // define variables - link to view objects
  @ViewChild('jqxgridComponent', {static: false}) jqxgridComponent: JqxgridComponent;
  @ViewChild('buttonPanel', {static: false}) buttonPanel: ButtonPanelComponent;
  @ViewChild('filterTable', {static: false}) filterTable: FilterTableComponent;
  @ViewChild('editForm', {static: false}) editForm: EditFormComponent;
  @ViewChild('linkForm', {static: false}) linkForm: LinkFormComponent;
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
  items: Sensor[] = [];
  // grid
  oSub: Subscription;
  selectItemId = 0;
  sourceForJqxGrid: SourceForJqxGrid;
  // filter
  filter: FilterSensor = {
    geographId: '',
    ownerId: '',
    sensorTypeId: '',
    contractId: '',
    nodeId: ''
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
  typeEditWindow = '';
  // link form
  oSubForLinkWin: Subscription;
  oSubLink: Subscription;
  sourceForLinkForm: SourceForLinkForm;
  sourceForLinkFormEng: SourceForLinkForm;
  isLinkFormInit = false;
  // event form
  warningEventWindow = '';
  actionEventWindow = '';


  constructor(private _snackBar: MatSnackBar,
              // service
              public translate: TranslateService,
              private sensorService: SensorService) {
  }

  ngOnInit() {
    // define columns
    if (this.isMasterGrid) {
      this.columnsGrid =
        [
          {text: 'sensorId', datafield: 'sensorId', width: 150},
          {text: 'Договор', datafield: 'contractCode', width: 150},
          {text: 'Адрес', datafield: 'geographFullName', width: 400},
          {text: 'Тип сенсора', datafield: 'sensorTypeCode', width: 150},
          {text: 'Владелец', datafield: 'ownerCode', width: 150},
          {text: 'Широта', datafield: 'n_coordinate', width: 150},
          {text: 'Долгота', datafield: 'e_coordinate', width: 150},
          {text: 'Серийный номер', datafield: 'serialNumber', width: 150},
          {text: 'Коментарий', datafield: 'comment', width: 150},
        ];
      this.listBoxSource =
        [
          {label: 'sensorId', value: 'sensorId', checked: true},
          {label: 'Договор', value: 'contractCode', checked: true},
          {label: 'Адрес', value: 'geographFullName', checked: true},
          {label: 'Тип сенсора', value: 'sensorTypeCode', checked: true},
          {label: 'Владелец', value: 'ownerCode', checked: true},
          {label: 'Широта', value: 'n_coordinate', checked: true},
          {label: 'Долгота', value: 'e_coordinate', checked: true},
          {label: 'Серийный номер', value: 'serialNumber', checked: true},
          {label: 'Коментарий', value: 'comment', checked: true},
        ];
      this.columnsGridEng =
        [
          {text: 'sensorId', datafield: 'sensorId', width: 150},
          {text: 'Contract', datafield: 'contractCode', width: 150},
          {text: 'Address', datafield: 'geographFullName', width: 400},
          {text: 'Sensor type', datafield: 'sensorTypeCode', width: 150},
          {text: 'Owner', datafield: 'ownerCode', width: 150},
          {text: 'Latitude', datafield: 'n_coordinate', width: 150},
          {text: 'Longitude', datafield: 'e_coordinate', width: 150},
          {text: 'Serial number', datafield: 'serialNumber', width: 150},
          {text: 'Comments', datafield: 'comment', width: 150},
        ];
      this.listBoxSourceEng =
        [
          {label: 'sensorId', value: 'sensorId', checked: true},
          {label: 'Contract', value: 'contractCode', checked: true},
          {label: 'Address', value: 'geographFullName', checked: true},
          {label: 'Sensor type', value: 'sensorTypeCode', checked: true},
          {label: 'Owner', value: 'ownerCode', checked: true},
          {label: 'Latitude', value: 'n_coordinate', checked: true},
          {label: 'Longitude', value: 'e_coordinate', checked: true},
          {label: 'Serial number', value: 'serialNumber', checked: true},
          {label: 'Comments', value: 'comment', checked: true},
        ];
    } else {
      this.columnsGrid =
        [
          {text: 'sensorId', datafield: 'sensorId', width: 150},
          {text: 'Договор', datafield: 'contractCode', width: 150},
          {text: 'Тип сенсора', datafield: 'sensorTypeCode', width: 150},
          {text: 'Серийный номер', datafield: 'serialNumber', width: 150},
          {text: 'Коментарий', datafield: 'comment', width: 150},
        ];
      this.listBoxSource =
        [
          {label: 'sensorId', value: 'sensorId', checked: true},
          {label: 'Договор', value: 'contractCode', checked: true},
          {label: 'Тип сенсора', value: 'sensorTypeCode', checked: true},
          {label: 'Серийный номер', value: 'serialNumber', checked: true},
          {label: 'Коментарий', value: 'comment', checked: true},
        ];
      this.columnsGridEng =
        [
          {text: 'sensorId', datafield: 'sensorId', width: 150},
          {text: 'Contract', datafield: 'contractCode', width: 150},
          {text: 'Sensor type', datafield: 'sensorTypeCode', width: 150},
          {text: 'Serial number', datafield: 'serialNumber', width: 150},
          {text: 'Comments', datafield: 'comment', width: 150},
        ];
      this.listBoxSourceEng =
        [
          {label: 'sensorId', value: 'sensorId', checked: true},
          {label: 'Contract', value: 'contractCode', checked: true},
          {label: 'Sensor type', value: 'sensorTypeCode', checked: true},
          {label: 'Serial number', value: 'serialNumber', checked: true},
          {label: 'Comments', value: 'comment', checked: true},
        ];
    }

    // jqxgrid
    this.sourceForJqxGrid = {
      listbox: {
        theme: 'material',
        width: 150,
        height: this.heightGrid,
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
        valueMember: 'sensorId',
        sortcolumn: ['sensorId'],
        sortdirection: 'desc',
        selectId: []
      }
    };

    // definde filter
    this.sourceForFilter = [
      {
        name: 'geographs',
        type: 'ngxSuggestionAddress',
        source: [],
        theme: 'material',
        width: '380',
        height: '45',
        placeHolder: 'Адрес:',
        displayMember: 'code',
        valueMember: 'id',
        defaultValue: '',
        selectId: ''
      },
      {
        name: 'ownerSensors',
        type: 'jqxComboBox',
        source: this.ownerSensors,
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
        name: 'sensorTypes',
        type: 'jqxComboBox',
        source: this.sensorTypes,
        theme: 'material',
        width: '380',
        height: '45',
        placeHolder: 'Тип датчика:',
        displayMember: 'code',
        valueMember: 'id',
        defaultValue: '',
        selectId: ''
      }
    ];
    this.sourceForFilterEng = [
      {
        name: 'geographs',
        type: 'ngxSuggestionAddress',
        source: [],
        theme: 'material',
        width: '380',
        height: '45',
        placeHolder: 'Address:',
        displayMember: 'code',
        valueMember: 'id',
        defaultValue: '',
        selectId: ''
      },
      {
        name: 'ownerSensors',
        type: 'jqxComboBox',
        source: this.ownerSensors,
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
        name: 'sensorTypes',
        type: 'jqxComboBox',
        source: this.sensorTypes,
        theme: 'material',
        width: '380',
        height: '45',
        placeHolder: 'Sensor type:',
        displayMember: 'code',
        valueMember: 'id',
        defaultValue: '',
        selectId: ''
      }
    ];

    // definde edit form
    this.settingWinForEditForm = {
      code: 'editFormSensor',
      name: 'Add/edit sensor',
      theme: 'material',
      isModal: true,
      modalOpacity: 0.3,
      width: 450,
      maxWidth: 500,
      minWidth: 460,
      height: 380,
      maxHeight: 450,
      minHeight: 400,
      coordX: 500,
      coordY: 65
    };
    this.sourceForEditForm = [
      {
        nameField: 'contractSensors',
        type: 'jqxComboBox',
        source: this.contractSensors,
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
        nameField: 'sensorTypes',
        type: 'jqxComboBox',
        source: this.sensorTypes,
        theme: 'material',
        width: '285',
        height: '20',
        placeHolder: 'Тип датчика:',
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
    this.sourceForEditFormEng = [
      {
        nameField: 'contractSensors',
        type: 'jqxComboBox',
        source: this.contractSensors,
        theme: 'material',
        width: '285',
        height: '20',
        placeHolder: 'Contract:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'sensorTypes',
        type: 'jqxComboBox',
        source: this.sensorTypes,
        theme: 'material',
        width: '285',
        height: '20',
        placeHolder: 'Sensor type:',
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
        placeHolder: 'Serial number:',
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
        placeHolder: 'Comments:',
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
        code: 'linkSensor',
        name: 'Выбрать датчик',
        theme: 'material',
        autoOpen: true,
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
        valueMember: 'sensorId',
        sortcolumn: ['sensorId'],
        sortdirection: 'desc',
        selectId: []
      }
    };
    this.sourceForLinkFormEng = {
      window: {
        code: 'linkSensor',
        name: 'Choose sensors',
        theme: 'material',
        autoOpen: true,
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
        columns: this.columnsGridEng,
        theme: 'material',
        width: 1186,
        height: 485,
        columnsresize: true,
        sortable: true,
        filterable: true,
        altrows: true,
        selectionmode: 'checkbox',
        valueMember: 'sensorId',
        sortcolumn: ['sensorId'],
        sortdirection: 'desc',
        selectId: []
      }
    };

    if (this.isMasterGrid) {
      this.refreshGrid();
    } else {
      // disabled/available buttons
      this.getAvailabilityButtons();
    }
  }

  ngOnDestroy() {
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
    if (this.linkForm) {
      this.linkForm.destroy();
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
    this.reloading = true;
    this.getAll();
    this.selectItemId = 0;

    // initialization source for filter
    setTimeout(() => {
      this.initSourceFilter();
    }, 1000);

    // disabled/available buttons
    this.getAvailabilityButtons();

    // if it is master grid, then we need refresh child grid
    if (this.isMasterGrid) {
      this.onRefreshChildGrid.emit(this.selectItemId);
    }
  }

  refreshChildGrid(selectRow: any) {
    this.selectItemId = selectRow.sensorId;
    // refresh child grid
    this.onRefreshChildGrid.emit(selectRow.sensorId);
  }

  getAll() {
    const params = Object.assign({}, {
        offset: this.offset,
        limit: this.limit
      },
      this.filter);

    this.oSub = this.sensorService.getAll(params).subscribe(sensors => {
      this.items = this.items.concat(sensors);
      this.noMoreItems = sensors.length < STEP;
      this.loading = false;
      this.reloading = false;
    });
  }

  getAvailabilityButtons() {
    if (!this.isMasterGrid && +this.filter.nodeId === 0) {
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
        this.translate.instant('site.menu.operator.sensor-page.sensor-md-page.sensorlist-page.upd-warning');
      this.eventWindow.openEventWindow();
    }
  }

  del() {
    if (!isUndefined(this.jqxgridComponent.selectRow)) {
      this.eventWindow.okButtonDisabled(false);
      this.actionEventWindow = 'del';
      this.warningEventWindow =
        this.translate.instant('site.menu.operator.sensor-page.sensor-md-page.sensorlist-page.del-question')
        + this.jqxgridComponent.selectRow.sensorId + '?';
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow =
        this.translate.instant('site.menu.operator.sensor-page.sensor-md-page.sensorlist-page.del-warning');
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
    if (this.selectNodeId > 1) {
      this.isLinkFormInit = true;
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow =
        this.translate.instant('site.menu.operator.sensor-page.sensor-md-page.sensorlist-page.place-warning');
      this.eventWindow.openEventWindow();
    }
  }

  pinDrop() {
    if (!isUndefined(this.jqxgridComponent.selectRow)) {
      this.eventWindow.okButtonDisabled(false);
      this.actionEventWindow = 'pin_drop';
      this.warningEventWindow =
        this.translate.instant('site.menu.operator.sensor-page.sensor-md-page.sensorlist-page.pinDrop-question');
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow =
        this.translate.instant('site.menu.operator.sensor-page.sensor-md-page.sensorlist-page.pinDrop-warning');
    }
    this.eventWindow.openEventWindow();
  }

  groupIn() {

  }

  groupOut() {

  }

  switchOn() {

  }

  switchOff() {

  }

  // FILTER

  applyFilter(filter: FilterSensor) {
    this.filter = filter;
    this.refreshGrid();
  }

  applyFilterFromFilter(event: any) {
    for (let i = 0; i < event.length; i++) {
      switch (event[i].name) {
        case 'geographs':
          this.filter.geographId = event[i].id;
          break;
        case 'ownerSensors':
          this.filter.ownerId = event[i].id;
          break;
        case 'sensorTypes':
          this.filter.sensorTypeId = event[i].id;
          break;
        default:
          break;
      }
    }
    this.refreshGrid();
  }

  initSourceFilter() {
    if (this.isFilterVisible === false
      && !isUndefined(this.ownerSensors)
      && !isUndefined(this.sensorTypes)) {
      this.isFilterVisible = true;
      for (let i = 0; i < this.sourceForFilter.length; i++) {
        switch (this.sourceForFilter[i].name) {
          case 'geographs':
            break;
          case 'ownerSensors':
            this.sourceForFilter[i].source = this.ownerSensors;
            this.sourceForFilterEng[i].source = this.ownerSensors;
            break;
          case 'sensorTypes':
            this.sourceForFilter[i].source = this.sensorTypes;
            this.sourceForFilterEng[i].source = this.sensorTypes;
            break;
          default:
            break;
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
    const selectObject: Sensor = new Sensor();
    for (let i = 0; i < this.editForm.sourceForEditForm.length; i++) {
      switch (this.editForm.sourceForEditForm[i].nameField) {
        case 'contractSensors':
          selectObject.contractId = +this.editForm.sourceForEditForm[i].selectId;
          selectObject.contractCode = this.editForm.sourceForEditForm[i].selectCode;
          break;
        case 'sensorTypes':
          selectObject.sensorTypeId = +this.editForm.sourceForEditForm[i].selectId;
          selectObject.sensorTypeCode = this.editForm.sourceForEditForm[i].selectCode;
          break;
        case 'serialNumber':
          selectObject.serialNumber = this.editForm.sourceForEditForm[i].selectCode;
          break;
        case 'comment':
          selectObject.comment = this.editForm.sourceForEditForm[i].selectCode;
          break;
        default:
          break;
      }
    }

    if (this.typeEditWindow === 'ins') {
      // definde param befor ins
      selectObject.nodeId = !isUndefined(this.selectNodeId) ? this.selectNodeId : 1;
      if (selectObject.nodeId === 1) {
        selectObject.e_coordinate = 0;
        selectObject.n_coordinate = 0;
        selectObject.geographCode = this.translate.instant('site.forms.editforms.withoutAddress');
      }
      // ins
      this.oSub = this.sensorService.ins(selectObject).subscribe(
        response => {
          selectObject.sensorId = +response;
          this.openSnackBar(this.translate.instant('site.menu.operator.sensor-page.sensor-md-page.sensorlist-page.ins')
            + selectObject.sensorId, this.translate.instant('site.forms.editforms.ok'));
        },
        error =>
          this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok')),
        () => {
          // close edit window
          this.editForm.closeDestroy();
          // update data source
          this.jqxgridComponent.refresh_ins(
            selectObject.sensorId, selectObject);
        }
      );
    }
    if (this.typeEditWindow === 'upd') {
      // definde param befor upd
      this.jqxgridComponent.selectRow.contractId = selectObject.contractId;
      this.jqxgridComponent.selectRow.contractCode = selectObject.contractCode;
      this.jqxgridComponent.selectRow.sensorTypeId = selectObject.sensorTypeId;
      this.jqxgridComponent.selectRow.sensorTypeCode = selectObject.sensorTypeCode;
      this.jqxgridComponent.selectRow.serialNumber = selectObject.serialNumber;
      this.jqxgridComponent.selectRow.comment = selectObject.comment;

      // upd
      this.oSub = this.sensorService.upd(this.jqxgridComponent.selectRow).subscribe(
        response => {
          this.openSnackBar(this.translate.instant('site.menu.operator.sensor-page.sensor-md-page.sensorlist-page.upd')
            + this.jqxgridComponent.selectRow.sensorId, this.translate.instant('site.forms.editforms.ok'));
        },
        error =>
          this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok')),
        () => {
          // close edit window
          this.editForm.closeDestroy();
          // update data source
          this.jqxgridComponent.refresh_upd(
            this.jqxgridComponent.selectRow.sensorId, this.jqxgridComponent.selectRow);
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
      }
      switch (sourceForEditForm[i].nameField) {
        case 'contractSensors':
          sourceForEditForm[i].source = this.contractSensors;
          if (this.typeEditWindow === 'ins') {
            sourceForEditForm[i].selectId = this.contractSensors[0].id.toString();
            sourceForEditForm[i].selectCode = this.contractSensors.find(
              (one: Contract) => one.id === +sourceForEditForm[i].selectId).code;
            sourceForEditForm[i].selectName = this.contractSensors.find(
              (one: Contract) => one.id === +sourceForEditForm[i].selectId).name;
          }
          if (this.typeEditWindow === 'upd') {
            sourceForEditForm[i].selectId = this.jqxgridComponent.selectRow.contractId.toString();
            sourceForEditForm[i].selectCode = this.contractSensors.find(
              (contractOne: Contract) => contractOne.id === +this.jqxgridComponent.selectRow.contractId).code;
            sourceForEditForm[i].selectName = this.contractSensors.find(
              (contractOne: Contract) => contractOne.id === +this.jqxgridComponent.selectRow.contractId).name;
            for (let j = 0; j < this.contractSensors.length; j++) {
              if (+this.contractSensors[j].id === +this.jqxgridComponent.selectRow.contractId) {
                sourceForEditForm[i].selectedIndex = j;
                break;
              }
            }
          }
          break;
        case 'sensorTypes':
          sourceForEditForm[i].source = this.sensorTypes;
          if (this.typeEditWindow === 'ins') {
            sourceForEditForm[i].selectId = this.sensorTypes[0].id.toString();
            sourceForEditForm[i].selectCode = this.sensorTypes.find(
              (one: EquipmentType) => one.id === +sourceForEditForm[i].selectId).code;
            sourceForEditForm[i].selectName = this.sensorTypes.find(
              (one: EquipmentType) => one.id === +sourceForEditForm[i].selectId).name;
          }
          if (this.typeEditWindow === 'upd') {
            sourceForEditForm[i].selectId = this.jqxgridComponent.selectRow.sensorTypeId.toString();
            sourceForEditForm[i].selectCode = this.sensorTypes.find(
              (sensorType: EquipmentType) => sensorType.id === +this.jqxgridComponent.selectRow.sensorTypeId).code;
            sourceForEditForm[i].selectName = this.sensorTypes.find(
              (sensorType: EquipmentType) => sensorType.id === +this.jqxgridComponent.selectRow.sensorTypeId).name;
            for (let j = 0; j < this.sensorTypes.length; j++) {
              if (+this.sensorTypes[j].id === +this.jqxgridComponent.selectRow.sensorTypeId) {
                sourceForEditForm[i].selectedIndex = j;
                break;
              }
            }
          }
          break;
        case 'serialNumber':
          if (this.typeEditWindow === 'upd') {
            sourceForEditForm[i].selectCode = this.jqxgridComponent.selectRow.serialNumber;
          }
          break;
        case 'comment':
          if (this.typeEditWindow === 'upd') {
            sourceForEditForm[i].selectCode = this.jqxgridComponent.selectRow.comment;
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

  // LINK FORM

  saveLinkFormBtn(event: ItemsLinkForm) {
    if (event.code === this.sourceForLinkForm.window.code) {
      this.oSubLink = this.sensorService.setNodeId(this.selectNodeId, event.Ids).subscribe(
        response => {

        },
        error => {
          this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok'));
        },
        () => {
          this.linkForm.closeDestroy();
          // refresh table
          this.refreshGrid();
        }
      );
    }
  }

  getSourceForLinkForm() {
    this.oSubForLinkWin = this.sensorService.getSensorNotInGroup().subscribe(
      response => {
        this.sourceForLinkForm.grid.source = response;
        this.sourceForLinkFormEng.grid.source = response;
        this.linkForm.refreshGrid();
      },
      error => {
        this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok'));
      }
    );
  }

  destroyLinkForm() {
    this.isLinkFormInit = false;
  }

  // EVENT FORM

  okEvenwinBtn() {
    if (this.actionEventWindow === 'del') {
      const selectedrowindex = this.jqxgridComponent.myGrid.getselectedrowindex();
      const id = this.jqxgridComponent.myGrid.getrowid(selectedrowindex);
      if (+id >= 0) {
        this.sensorService.del(+id).subscribe(
          response => {
            this.openSnackBar(this.translate.instant('site.menu.operator.sensor-page.sensor-md-page.sensorlist-page.del'),
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
    if (this.actionEventWindow === 'pin_drop') {
      const sensorIds = [];
      for (let i = 0; i < this.jqxgridComponent.myGrid.widgetObject.selectedrowindexes.length; i++) {
        sensorIds[i] = this.jqxgridComponent.source_jqxgrid.localdata[
          this.jqxgridComponent.myGrid.widgetObject.selectedrowindexes[i]].sensorId;
      }
      this.oSub = this.sensorService.delNodeId(this.selectNodeId, sensorIds).subscribe(
        response => {
          this.openSnackBar(this.translate.instant('site.menu.operator.sensor-page.sensor-md-page.sensorlist-page.pinDrop'),
            this.translate.instant('site.forms.editforms.ok'));
        },
        error => {
          this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok'));
        },
        () => {
          // refresh table
          this.refreshGrid();
        }
      );
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }
}