import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs/index';

import {
  Gateway, Geograph, Contract, Owner, EquipmentType,
  FilterGateway, SourceForFilter,
  SettingButtonPanel,
  SourceForJqxGrid,
  SettingWinForEditForm, SourceForEditForm,
  SourceForLinkForm, ItemsLinkForm
} from '../../../../shared/interfaces';
import {GatewayService} from '../../../../shared/services/gateway/gateway.service';
import {JqxgridComponent} from '../../../../shared/components/jqxgrid/jqxgrid.component';
import {ButtonPanelComponent} from '../../../../shared/components/button-panel/button-panel.component';
import {FilterTableComponent} from '../../../../shared/components/filter-table/filter-table.component';
import {EditFormComponent} from '../../../../shared/components/edit-form/edit-form.component';
import {LinkFormComponent} from '../../../../shared/components/link-form/link-form.component';
import {EventWindowComponent} from '../../../../shared/components/event-window/event-window.component';
import {MaterialService} from '../../../../shared/classes/material.service';
import {isUndefined} from 'util';


const STEP = 1000000000000;


@Component({
  selector: 'app-gatewaylist-page',
  templateUrl: './gatewaylist-page.component.html',
  styleUrls: ['./gatewaylist-page.component.css']
})
export class GatewaylistPageComponent implements OnInit, OnDestroy {

  // variables from master component
  @Input() geographs: Geograph[];
  @Input() ownerGateways: Owner[];
  @Input() gatewayTypes: EquipmentType[];
  @Input() contractGateways: Contract[];

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
  items: Gateway[] = [];
  // grid
  oSub: Subscription;
  selectItemId = 0;
  sourceForJqxGrid: SourceForJqxGrid;
  // filter
  filter: FilterGateway = {
    geographId: '',
    ownerId: '',
    gatewayTypeId: '',
    contractId: '',
    nodeId: ''
  };
  sourceForFilter: SourceForFilter[];
  isFilterVisible = false;
  filterSelect = '';
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

  constructor(private gatewayService: GatewayService) {
  }

  ngOnInit() {
    // define columns for table
    if (this.isMasterGrid) {
      this.columnsGrid =
        [
          {text: 'gatewayId', datafield: 'gatewayId', width: 150},
          {text: 'Наимен. гр. столбов', datafield: 'nodeGroupName', width: 150},
          {text: 'Договор', datafield: 'contractCode', width: 150},
          {text: 'Географическое понятие', datafield: 'geographCode', width: 150},
          {text: 'Тип узла', datafield: 'gatewayTypeCode', width: 150},
          {text: 'Владелец', datafield: 'ownerCode', width: 150},

          {text: 'Широта', datafield: 'n_coordinate', width: 150},
          {text: 'Долгота', datafield: 'e_coordinate', width: 150},

          {text: 'Серийный номер', datafield: 'serialNumber', width: 150},
          {text: 'Коментарий', datafield: 'comment', width: 150},
        ];
      // define a data source for filtering table columns
      this.listBoxSource =
        [
          {label: 'gatewayId', value: 'gatewayId', checked: true},
          {label: 'Наимен. гр. столбов', value: 'nodeGroupName', checked: true},
          {label: 'Договор', value: 'contractCode', checked: true},
          {label: 'Географическое понятие', value: 'geographCode', checked: true},
          {label: 'Тип узла', value: 'gatewayTypeCode', checked: true},
          {label: 'Владелец', value: 'ownerCode', checked: true},

          {label: 'Широта', value: 'n_coordinate', checked: true},
          {label: 'Долгота', value: 'e_coordinate', checked: true},

          {label: 'Серийный номер', value: 'serialNumber', checked: true},
          {label: 'Коментарий', value: 'comment', checked: true},
        ];
    } else {
      this.columnsGrid =
        [
          {text: 'gatewayId', datafield: 'gatewayId', width: 150},
          {text: 'Наимен. гр. столбов', datafield: 'nodeGroupName', width: 150},
          {text: 'Договор', datafield: 'contractCode', width: 150},
          {text: 'Тип узла', datafield: 'gatewayTypeCode', width: 150},
          {text: 'Серийный номер', datafield: 'serialNumber', width: 150},
          {text: 'Коментарий', datafield: 'comment', width: 150},
        ];
      // define a data source for filtering table columns
      this.listBoxSource =
        [
          {label: 'gatewayId', value: 'gatewayId', checked: true},
          {label: 'Наимен. гр. столбов', value: 'nodeGroupName', checked: true},
          {label: 'Договор', value: 'contractCode', checked: true},
          {label: 'Тип узла', value: 'gatewayTypeCode', checked: true},
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
        width: '380',
        height: '45',
        placeHolder: 'Геогр. понятие:',
        displayMember: 'code',
        valueMember: 'id',
        defaultValue: '',
        selectId: ''
      },
      {
        name: 'ownerGateways',
        type: 'jqxComboBox',
        source: this.ownerGateways,
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
        name: 'gatewayTypes',
        type: 'jqxComboBox',
        source: this.gatewayTypes,
        theme: 'material',
        width: '380',
        height: '45',
        placeHolder: 'Тип шлюза:',
        displayMember: 'code',
        valueMember: 'id',
        defaultValue: '',
        selectId: ''
      }
    ];

    // definde window edit form
    this.settingWinForEditForm = {
      code: 'editFormGateway',
      name: 'Добавить/редактировать шлюз',
      theme: 'material',
      isModal: true,
      modalOpacity: 0.3,
      width: 450,
      maxWidth: 500,
      minWidth: 460,
      height: 440,
      maxHeight: 500,
      minHeight: 440,
      coordX: 500,
      coordY: 65
    };

    // definde edit form
    this.sourceForEditForm = [
      {
        nameField: 'contractGateways',
        type: 'jqxComboBox',
        source: this.contractGateways,
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
        nameField: 'gatewayTypes',
        type: 'jqxComboBox',
        source: this.gatewayTypes,
        theme: 'material',
        width: '285',
        height: '20',
        placeHolder: 'Тип шлюза:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'nodeGroupName',
        type: 'jqxTextArea',
        source: [],
        theme: 'material',
        width: '280',
        height: '20',
        placeHolder: 'Наим-е гр. узлов:',
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
        code: 'linkGateway',
        name: 'Выбрать шлюз',
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

        valueMember: 'gatewayId',
        sortcolumn: ['gatewayId'],
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
        width: null,
        height: this.heightGrid,
        columnsresize: true,
        sortable: true,
        filterable: true,
        altrows: true,
        selectionmode: this.selectionmode,
        isMasterGrid: this.isMasterGrid,

        valueMember: 'gatewayId',
        sortcolumn: ['gatewayId'],
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
    if (this.filterTable) {
      this.filterTable.destroy();
    }
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
    this.initSourceFilter();

    // if it is master grid, then we need refresh child grid
    if (this.isMasterGrid) {
      this.onRefreshChildGrid.emit(this.selectItemId);
    }
  }

  refreshChildGrid(selectRow: any) {
    this.selectItemId = selectRow.gatewayId;
    // refresh child grid
    this.onRefreshChildGrid.emit(selectRow.gatewayId);
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

    this.oSub = this.gatewayService.getAll(params).subscribe(gateways => {
      this.items = this.items.concat(gateways);
      this.noMoreItems = gateways.length < STEP;
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
      this.warningEventWindow = `Вам следует выбрать шлюз для редактирования`;
      this.eventWindow.openEventWindow();
    }
  }

  del() {
    if (!isUndefined(this.jqxgridComponent.selectRow)) {
      this.eventWindow.okButtonDisabled(false);
      this.actionEventWindow = 'del';
      this.warningEventWindow = `Удалить шлюз id = "${this.jqxgridComponent.selectRow.gatewayId}"?`;
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow = `Вам следует выбрать шлюз для удаления`;
    }
    this.eventWindow.openEventWindow();
  }

  refresh() {
    this.refreshGrid();
  }

  filterNone() {
    this.jqxgridComponent.openSettinWin();
  }

  filterList() {
    if (this.filterTable.filtrWindow.isOpen()) {
      this.filterTable.closeWindow();
    } else {
      this.initSourceFilter();
      this.filterTable.openWindow();
    }
  }

  place() {
    if (this.selectNodeId > 1) {
      this.linkWindow.openWindow();
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow = `Вам следует выбрать узел для привязки шлюзов`;
      this.eventWindow.openEventWindow();
    }
  }

  pinDrop() {
    if (!isUndefined(this.jqxgridComponent.selectRow)) {
      this.eventWindow.okButtonDisabled(false);
      this.actionEventWindow = 'pin_drop';
      this.warningEventWindow = `Отвязать шлюз от узла?`;
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow = `Вам следует выбрать шлюз для отвязки от узла`;
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

  applyFilter(filter: FilterGateway) {
    this.filter = filter;
    this.refreshGrid();
  }

  applyFilterFromFilter(event: any) {
    for (let i = 0; i < event.length; i++) {
      switch (event[i].name) {
        case 'geographs':
          this.filter.geographId = event[i].id;
          break;
        case 'ownerGateways':
          this.filter.ownerId = event[i].id;
          break;
        case 'gatewayTypes':
          this.filter.gatewayTypeId = event[i].id;
          break;
        default:
          break;
      }
    }
    this.refreshGrid();
  }

  initSourceFilter() {
    if (!this.isFilterVisible) {
      this.isFilterVisible = true;
      for (let i = 0; i < this.sourceForFilter.length; i++) {
        switch (this.sourceForFilter[i].name) {
          case 'geographs':
            this.sourceForFilter[i].source = this.geographs;
            break;
          case 'ownerGateways':
            this.sourceForFilter[i].source = this.ownerGateways;
            break;
          case 'gatewayTypes':
            this.sourceForFilter[i].source = this.gatewayTypes;
            break;
          default:
            break;
        }
      }
    }
    // view select filter for user
    this.filterSelect = this.filterTable.getFilterSelect();
  }

  // EDIT FORM

  saveEditwinBtn() {
    const selectObject: Gateway = new Gateway();

    for (let i = 0; i < this.sourceForEditForm.length; i++) {
      switch (this.sourceForEditForm[i].nameField) {
        case 'contractGateways':
          selectObject.contractId = +this.sourceForEditForm[i].selectId;
          selectObject.contractCode = this.sourceForEditForm[i].selectCode;
          break;
        case 'gatewayTypes':
          selectObject.gatewayTypeId = +this.sourceForEditForm[i].selectId;
          selectObject.gatewayTypeCode = this.sourceForEditForm[i].selectCode;
          break;
        case 'nodeGroupName':
          selectObject.nodeGroupName = this.sourceForEditForm[i].selectCode;
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
      this.oSub = this.gatewayService.ins(selectObject).subscribe(
        response => {
          selectObject.gatewayId = +response;
          MaterialService.toast(`Датчик c id = ${selectObject.gatewayId} был добавлен.`);
        },
        error => MaterialService.toast(error.error.message),
        () => {
          // close edit window
          this.editWindow.closeDestroyWindow();
          // update data source
          this.jqxgridComponent.refresh_ins(
            selectObject.gatewayId, selectObject);
        }
      );
    }
    if (this.typeEditWindow === 'upd') {
      // definde param befor upd
      this.jqxgridComponent.selectRow.contractId = selectObject.contractId;
      this.jqxgridComponent.selectRow.contractCode = selectObject.contractCode;
      this.jqxgridComponent.selectRow.gatewayTypeId = selectObject.gatewayTypeId;
      this.jqxgridComponent.selectRow.gatewayTypeCode = selectObject.gatewayTypeCode;
      this.jqxgridComponent.selectRow.nodeGroupName = selectObject.nodeGroupName;
      this.jqxgridComponent.selectRow.serialNumber = selectObject.serialNumber;
      this.jqxgridComponent.selectRow.comment = selectObject.comment;

      // upd
      this.oSub = this.gatewayService.upd(this.jqxgridComponent.selectRow).subscribe(
        response => {
          MaterialService.toast(`Датчик c id = ${this.jqxgridComponent.selectRow.gatewayId} был обновлен.`);
        },
        error => MaterialService.toast(error.error.message),
        () => {
          // close edit window
          this.editWindow.closeDestroyWindow();
          // update data source
          this.jqxgridComponent.refresh_upd(
            this.jqxgridComponent.selectRow.gatewayId, this.jqxgridComponent.selectRow);
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
        case 'contractGateways':
          this.sourceForEditForm[i].source = this.contractGateways;
          if (this.typeEditWindow === 'ins') {
            this.sourceForEditForm[i].selectId = this.contractGateways[0].id.toString();
            this.sourceForEditForm[i].selectCode = this.contractGateways.find(
              (one: Contract) => one.id === +this.sourceForEditForm[i].selectId).code;
            this.sourceForEditForm[i].selectName = this.contractGateways.find(
              (one: Contract) => one.id === +this.sourceForEditForm[i].selectId).name;
          }
          if (this.typeEditWindow === 'upd') {
            this.sourceForEditForm[i].selectId = this.jqxgridComponent.selectRow.contractId.toString();
            this.sourceForEditForm[i].selectCode = this.contractGateways.find(
              (contractOne: Contract) => contractOne.id === +this.jqxgridComponent.selectRow.contractId).code;
            this.sourceForEditForm[i].selectName = this.contractGateways.find(
              (contractOne: Contract) => contractOne.id === +this.jqxgridComponent.selectRow.contractId).name;
            for (let j = 0; j < this.contractGateways.length; j++) {
              if (+this.contractGateways[j].id === +this.jqxgridComponent.selectRow.contractId) {
                this.sourceForEditForm[i].selectedIndex = j;
                break;
              }
            }
          }
          break;
        case 'gatewayTypes':
          this.sourceForEditForm[i].source = this.gatewayTypes;
          if (this.typeEditWindow === 'ins') {
            this.sourceForEditForm[i].selectId = this.gatewayTypes[0].id.toString();
            this.sourceForEditForm[i].selectCode = this.gatewayTypes.find(
              (one: EquipmentType) => one.id === +this.sourceForEditForm[i].selectId).code;
            this.sourceForEditForm[i].selectName = this.gatewayTypes.find(
              (one: EquipmentType) => one.id === +this.sourceForEditForm[i].selectId).name;
          }
          if (this.typeEditWindow === 'upd') {
            this.sourceForEditForm[i].selectId = this.jqxgridComponent.selectRow.gatewayTypeId.toString();
            this.sourceForEditForm[i].selectCode = this.gatewayTypes.find(
              (gatewayType: EquipmentType) => gatewayType.id === +this.jqxgridComponent.selectRow.gatewayTypeId).code;
            this.sourceForEditForm[i].selectName = this.gatewayTypes.find(
              (gatewayType: EquipmentType) => gatewayType.id === +this.jqxgridComponent.selectRow.gatewayTypeId).name;
            for (let j = 0; j < this.gatewayTypes.length; j++) {
              if (+this.gatewayTypes[j].id === +this.jqxgridComponent.selectRow.gatewayTypeId) {
                this.sourceForEditForm[i].selectedIndex = j;
                break;
              }
            }
          }
          break;
        case 'nodeGroupName':
          if (this.typeEditWindow === 'upd') {
            this.sourceForEditForm[i].selectCode = this.jqxgridComponent.selectRow.nodeGroupName;
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
      this.oSubLink = this.gatewayService.setNodeId(this.selectNodeId, event.Ids).subscribe(
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
    this.oSubForLinkWin = this.gatewayService.getGatewayNotInGroup().subscribe(
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
        this.gatewayService.del(+id).subscribe(
          response => {
            MaterialService.toast('Шлюз был удален!');
          },
          error => MaterialService.toast(error.error.message),
          () => {
            this.jqxgridComponent.refresh_del([+id]);
          }
        );
      }
    }
    if (this.actionEventWindow === 'pin_drop') {
      const gatewayIds = [];
      for (let i = 0; i < this.jqxgridComponent.myGrid.widgetObject.selectedrowindexes.length; i++) {
        gatewayIds[i] = this.jqxgridComponent.source_jqxgrid.localdata[
          this.jqxgridComponent.myGrid.widgetObject.selectedrowindexes[i]].gatewayId;
      }
      this.oSub = this.gatewayService.delNodeId(this.selectNodeId, gatewayIds).subscribe(
        response => {
          MaterialService.toast('Шлюз отвязаны от узла!');
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
