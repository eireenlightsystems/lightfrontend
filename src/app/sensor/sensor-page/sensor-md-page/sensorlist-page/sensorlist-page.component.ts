import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs/index';
import {MaterialService} from '../../../../shared/classes/material.service';
import {isUndefined} from 'util';

import {
  Geograph,
  Contract,
  Owner,
  FilterSensor,
  EquipmentType,
  Sensor,
  SourceForFilter, SettingButtonPanel, SettingWinForEditForm, SourceForEditForm, SourceForLinkForm, ItemsLinkForm, SourceForJqxGrid
} from '../../../../shared/interfaces';
import {SensorService} from '../../../../shared/services/sensor/sensor.service';
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

  // variables from master component
  @Input() geographs: Geograph[];
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
  @ViewChild('jqxgridComponent') jqxgridComponent: JqxgridComponent;
  @ViewChild('buttonPanel') buttonPanel: ButtonPanelComponent;
  @ViewChild('filterTable') filterTable: FilterTableComponent;
  @ViewChild('editWindow') editWindow: EditFormComponent;
  @ViewChild('linkWindow') linkWindow: LinkFormComponent;
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
  items: Sensor[] = [];
  filter: FilterSensor = {
    geographId: '',
    ownerId: '',
    sensorTypeId: '',
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


  constructor(private sensorService: SensorService) {
  }

  ngOnInit() {
    // define columns for table
    if (this.isMasterGrid) {
      this.columnsGrid =
        [
          {text: 'sensorId', datafield: 'sensorId', width: 150},
          {text: 'Договор', datafield: 'contractCode', width: 150},
          {text: 'Географическое понятие', datafield: 'geographCode', width: 150},
          {text: 'Тип сенсора', datafield: 'sensorTypeCode', width: 150},
          {text: 'Владелец', datafield: 'ownerCode', width: 150},

          {text: 'Широта', datafield: 'n_coordinate', width: 150},
          {text: 'Долгота', datafield: 'e_coordinate', width: 150},

          {text: 'Серийный номер', datafield: 'serialNumber', width: 150},
          {text: 'Коментарий', datafield: 'comment', width: 150},
        ];
      // define a data source for filtering table columns
      this.listBoxSource =
        [
          {label: 'sensorId', value: 'sensorId', checked: true},
          {label: 'Договор', value: 'contractCode', checked: true},
          {label: 'Географическое понятие', value: 'geographCode', checked: true},
          {label: 'Тип сенсора', value: 'sensorTypeCode', checked: true},
          {label: 'Владелец', value: 'ownerCode', checked: true},

          {label: 'Широта', value: 'n_coordinate', checked: true},
          {label: 'Долгота', value: 'e_coordinate', checked: true},

          {label: 'Серийный номер', value: 'serialNumber', checked: true},
          {label: 'Коментарий', value: 'comment', checked: true},
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
      // define a data source for filtering table columns
      this.listBoxSource =
        [
          {label: 'sensorId', value: 'sensorId', checked: true},
          {label: 'Договор', value: 'contractCode', checked: true},
          {label: 'Тип сенсора', value: 'sensorTypeCode', checked: true},
          {label: 'Серийный номер', value: 'serialNumber', checked: true},
          {label: 'Коментарий', value: 'comment', checked: true},
        ];
    }

    // definde filter
    this.sourceForFilter = [
      {
        name: 'geographs',
        type: 'jqxComboBox',
        source: this.geographs,
        theme: 'material',
        width: '300',
        height: '43',
        placeHolder: 'Геогр. понятие:',
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
        width: '300',
        height: '43',
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
        width: '300',
        height: '43',
        placeHolder: 'Тип датчика:',
        displayMember: 'code',
        valueMember: 'id',
        defaultValue: '',
        selectId: ''
      }
    ];

    // definde window edit form
    this.settingWinForEditForm = {
      code: 'editFormSensor',
      name: 'Добавить/редактировать датчик',
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

    // definde edit form
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

    // definde link form
    this.sourceForLinkForm = {
      window: {
        code: 'linkSensor',
        name: 'Выбрать датчик',
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

        valueMember: 'sensorId',
        sortcolumn: ['sensorId'],
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

        valueMember: 'sensorId',
        sortcolumn: ['sensorId'],
        sortdirection: 'desc',
        selectId: []
      }
    };

    // if this.node is child grid, then we need update this.filter.nodeId
    if (!this.isMasterGrid) {
      this.filter.nodeId = this.selectNodeId.toString();
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
      this.warningEventWindow = `Вам следует выбрать датчик для редактирования`;
      this.eventWindow.openEventWindow();
    }
  }

  del() {
    if (!isUndefined(this.jqxgridComponent.selectRow)) {
      this.eventWindow.okButtonDisabled(false);
      this.actionEventWindow = 'del';
      this.warningEventWindow = `Удалить датчик id = "${this.jqxgridComponent.selectRow.sensorId}"?`;
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow = `Вам следует выбрать датчик для удаления`;
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
    if (this.selectNodeId > 1) {
      this.linkWindow.openWindow();
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow = `Вам следует выбрать узел для привязки датчиков`;
      this.eventWindow.openEventWindow();
    }
  }

  pinDrop() {
    if (!isUndefined(this.jqxgridComponent.selectRow)) {
      this.eventWindow.okButtonDisabled(false);
      this.actionEventWindow = 'pin_drop';
      this.warningEventWindow = `Отвязать датчик от узла?`;
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow = `Вам следует выбрать датчик для отвязки от узла`;
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
    this.getAll();
  }

  initSourceFilter() {
    for (let i = 0; i < this.sourceForFilter.length; i++) {
      switch (this.sourceForFilter[i].name) {
        case 'geographs':
          this.sourceForFilter[i].source = this.geographs;
          break;
        case 'ownerSensors':
          this.sourceForFilter[i].source = this.ownerSensors;
          break;
        case 'sensorTypes':
          this.sourceForFilter[i].source = this.sensorTypes;
          break;
        default:
          break;
      }
    }
  }

  // EDIT FORM

  saveEditwinBtn() {
    const selectObject: Sensor = new Sensor();

    for (let i = 0; i < this.sourceForEditForm.length; i++) {
      switch (this.sourceForEditForm[i].nameField) {
        case 'contractSensors':
          selectObject.contractId = +this.sourceForEditForm[i].selectId;
          selectObject.contractCode = this.sourceForEditForm[i].selectCode;
          break;
        case 'sensorTypes':
          selectObject.sensorTypeId = +this.sourceForEditForm[i].selectId;
          selectObject.sensorTypeCode = this.sourceForEditForm[i].selectCode;
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
      selectObject.nodeId = !isUndefined(this.selectNodeId) ? this.selectNodeId : 1;
      if (selectObject.nodeId === 1) {
        selectObject.e_coordinate = 0;
        selectObject.n_coordinate = 0;
        selectObject.geographCode = 'без привязки к карте';
      }
      // ins
      this.oSub = this.sensorService.ins(selectObject).subscribe(
        response => {
          selectObject.sensorId = +response;
          MaterialService.toast(`Датчик c id = ${selectObject.sensorId} был добавлен.`);
        },
        error => MaterialService.toast(error.error.message),
        () => {
          // close edit window
          this.editWindow.closeDestroyWindow();
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
          MaterialService.toast(`Датчик c id = ${this.jqxgridComponent.selectRow.sensorId} был обновлен.`);
        },
        error => MaterialService.toast(error.error.message),
        () => {
          // close edit window
          this.editWindow.closeDestroyWindow();
          // update data source
          this.jqxgridComponent.refresh_upd(
            this.jqxgridComponent.selectRow.sensorId, this.jqxgridComponent.selectRow);
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
        case 'contractSensors':
          this.sourceForEditForm[i].source = this.contractSensors;
          if (this.typeEditWindow === 'ins') {
            this.sourceForEditForm[i].selectId = this.contractSensors[0].id.toString();
            this.sourceForEditForm[i].selectCode = this.contractSensors.find(
              (one: Contract) => one.id === +this.sourceForEditForm[i].selectId).code;
            this.sourceForEditForm[i].selectName = this.contractSensors.find(
              (one: Contract) => one.id === +this.sourceForEditForm[i].selectId).name;
          }
          if (this.typeEditWindow === 'upd') {
            this.sourceForEditForm[i].selectId = this.jqxgridComponent.selectRow.contractId.toString();
            this.sourceForEditForm[i].selectCode = this.contractSensors.find(
              (contractOne: Contract) => contractOne.id === +this.jqxgridComponent.selectRow.contractId).code;
            this.sourceForEditForm[i].selectName = this.contractSensors.find(
              (contractOne: Contract) => contractOne.id === +this.jqxgridComponent.selectRow.contractId).name;
            for (let j = 0; j < this.contractSensors.length; j++) {
              if (+this.contractSensors[j].id === +this.jqxgridComponent.selectRow.contractId) {
                this.sourceForEditForm[i].selectedIndex = j;
                break;
              }
            }
          }
          break;
        case 'sensorTypes':
          this.sourceForEditForm[i].source = this.sensorTypes;
          if (this.typeEditWindow === 'ins') {
            this.sourceForEditForm[i].selectId = this.sensorTypes[0].id.toString();
            this.sourceForEditForm[i].selectCode = this.sensorTypes.find(
              (one: EquipmentType) => one.id === +this.sourceForEditForm[i].selectId).code;
            this.sourceForEditForm[i].selectName = this.sensorTypes.find(
              (one: EquipmentType) => one.id === +this.sourceForEditForm[i].selectId).name;
          }
          if (this.typeEditWindow === 'upd') {
            this.sourceForEditForm[i].selectId = this.jqxgridComponent.selectRow.sensorTypeId.toString();
            this.sourceForEditForm[i].selectCode = this.sensorTypes.find(
              (sensorType: EquipmentType) => sensorType.id === +this.jqxgridComponent.selectRow.sensorTypeId).code;
            this.sourceForEditForm[i].selectName = this.sensorTypes.find(
              (sensorType: EquipmentType) => sensorType.id === +this.jqxgridComponent.selectRow.sensorTypeId).name;
            for (let j = 0; j < this.sensorTypes.length; j++) {
              if (+this.sensorTypes[j].id === +this.jqxgridComponent.selectRow.sensorTypeId) {
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
      this.oSubLink = this.sensorService.setNodeId(this.selectNodeId, event.Ids).subscribe(
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
  }

  getSourceForLinkForm() {
    this.oSubForLinkWin = this.sensorService.getSensorNotInGroup().subscribe(
      response => {
        this.sourceForLinkForm.grid.source = response;
        this.linkWindow.refreshGrid();
      },
      error => {
        MaterialService.toast(error.error.message);
      }
    );
  }

  // EVENT FORM

  okEvenwinBtn() {
    if (this.actionEventWindow === 'del') {
      const selectedrowindex = this.jqxgridComponent.myGrid.getselectedrowindex();
      const id = this.jqxgridComponent.myGrid.getrowid(selectedrowindex);

      if (+id >= 0) {
        this.sensorService.del(+id).subscribe(
          response => {
            MaterialService.toast('Датчик был удален!');
          },
          error => MaterialService.toast(error.error.message),
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
          MaterialService.toast('Датчики отвязаны от узла!');
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
