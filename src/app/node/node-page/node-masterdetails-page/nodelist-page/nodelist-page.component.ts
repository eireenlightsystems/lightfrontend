import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs/index';
import {isUndefined} from 'util';
import {MaterialService} from '../../../../shared/classes/material.service';

import {NodeService} from '../../../../shared/services/node/node.service';
import {
  Node, Geograph, Contract, EquipmentType, Owner,
  FilterNode, SourceForFilter,
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


const STEP = 1000000000000;


@Component({
  selector: 'app-nodelist-page',
  templateUrl: './nodelist-page.component.html',
  styleUrls: ['./nodelist-page.component.css']
})

export class NodelistPageComponent implements OnInit, OnDestroy {

  // variables from master component
  @Input() geographs: Geograph[];
  @Input() ownerNodes: Owner[];
  @Input() nodeTypes: EquipmentType[];
  @Input() contractNodes: Contract[];

  @Input() selectGatewayId: number;

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
  items: Node[] = [];
  // grid
  oSub: Subscription;
  selectItemId = 0;
  sourceForJqxGrid: SourceForJqxGrid;
  // filter
  filter: FilterNode = {
    geographId: '',
    ownerId: '',
    nodeTypeId: '',
    contractId: '',
    gatewayId: ''
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

  constructor(private nodeService: NodeService) {
  }

  ngOnInit() {
    // define columns for table
    if (this.isMasterGrid) {
      this.columnsGrid =
        [
          {text: 'nodeId', datafield: 'nodeId', width: 150},
          {text: 'Договор', datafield: 'contractCode', width: 150},
          {text: 'Географическое понятие', datafield: 'geographCode', width: 150},
          {text: 'Тип узла', datafield: 'nodeTypeCode', width: 150},
          {text: 'Владелец', datafield: 'ownerCode', width: 150},

          {text: 'Широта', datafield: 'n_coordinate', width: 150},
          {text: 'Долгота', datafield: 'e_coordinate', width: 150},

          {text: 'Серийный номер', datafield: 'serialNumber', width: 150},
          {text: 'Коментарий', datafield: 'comment', width: 150},
        ];
      // define a data source for filtering table columns
      this.listBoxSource =
        [
          {label: 'nodeId', value: 'nodeId', checked: true},
          {label: 'Договор', value: 'contractCode', checked: true},
          {label: 'Географическое понятие', value: 'geographCode', checked: true},
          {label: 'Тип узла', value: 'nodeTypeCode', checked: true},
          {label: 'Владелец', value: 'ownerCode', checked: true},

          {label: 'Широта', value: 'n_coordinate', checked: true},
          {label: 'Долгота', value: 'e_coordinate', checked: true},

          {label: 'Серийный номер', value: 'serialNumber', checked: true},
          {label: 'Коментарий', value: 'comment', checked: true},
        ];
    } else {
      this.columnsGrid =
        [
          {text: 'nodeId', datafield: 'nodeId', width: 150},
          {text: 'Договор', datafield: 'contractCode', width: 150},
          {text: 'Географическое понятие', datafield: 'geographCode', width: 150},
          {text: 'Тип узла', datafield: 'nodeTypeCode', width: 150},

          {text: 'Широта', datafield: 'n_coordinate', width: 150},
          {text: 'Долгота', datafield: 'e_coordinate', width: 150},

          {text: 'Серийный номер', datafield: 'serialNumber', width: 150},
          {text: 'Коментарий', datafield: 'comment', width: 150},
        ];
      // define a data source for filtering table columns
      this.listBoxSource =
        [
          {label: 'nodeId', value: 'nodeId', checked: true},
          {label: 'Договор', value: 'contractCode', checked: true},
          {label: 'Географическое понятие', value: 'geographCode', checked: true},
          {label: 'Тип узла', value: 'nodeTypeCode', checked: true},

          {label: 'Широта', value: 'n_coordinate', checked: true},
          {label: 'Долгота', value: 'e_coordinate', checked: true},

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
        name: 'ownerNodes',
        type: 'jqxComboBox',
        source: this.ownerNodes,
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
        name: 'nodeTypes',
        type: 'jqxComboBox',
        source: this.nodeTypes,
        theme: 'material',
        width: '380',
        height: '45',
        placeHolder: 'Тип узла/столба:',
        displayMember: 'code',
        valueMember: 'id',
        defaultValue: '',
        selectId: ''
      }
    ];

    // definde window edit form
    this.settingWinForEditForm = {
      code: 'editFormNode',
      name: 'Добавить/редактировать узел',
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
        nameField: 'geographs',
        type: 'jqxComboBox',
        source: this.geographs,
        theme: 'material',
        width: '285',
        height: '20',
        placeHolder: 'Геогр. понятие:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'contractNodes',
        type: 'jqxComboBox',
        source: this.contractNodes,
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
        nameField: 'nodeTypes',
        type: 'jqxComboBox',
        source: this.nodeTypes,
        theme: 'material',
        width: '285',
        height: '20',
        placeHolder: 'Тип узла:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'n_coordinate',
        type: 'jqxTextArea',
        source: [],
        theme: 'material',
        width: '280',
        height: '20',
        placeHolder: 'Координата север:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '0',
        selectName: ''
      },
      {
        nameField: 'e_coordinate',
        type: 'jqxTextArea',
        source: [],
        theme: 'material',
        width: '280',
        height: '20',
        placeHolder: 'Координата восток:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '0',
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
        code: 'linkGatewayNodes',
        name: 'Выбрать узлы',
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

        valueMember: 'nodeId',
        sortcolumn: ['nodeId'],
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

        valueMember: 'nodeId',
        sortcolumn: ['nodeId'],
        sortdirection: 'asc',
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
    this.selectItemId = selectRow.nodeId;
    // refresh child grid
    this.onRefreshChildGrid.emit(selectRow.nodeId);
  }

  getAll() {
    const params = Object.assign({}, {
        offset: this.offset,
        limit: this.limit
      },
      this.filter);

    this.oSub = this.nodeService.getAll(params).subscribe(nodes => {
      this.items = this.items.concat(nodes);
      this.noMoreItems = nodes.length < STEP;
      this.loading = false;
      this.reloading = false;
    });
  }

  getAvailabilityButtons() {
    if (!this.isMasterGrid && +this.filter.gatewayId === 0) {
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
      this.settingButtonPanel.filterNone.disabled = true;
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
      this.settingButtonPanel.filterNone.disabled = false;
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
    this.isEditFormVisible = !this.isEditFormVisible;
  }

  upd() {
    if (!isUndefined(this.jqxgridComponent.selectRow)) {
      this.typeEditWindow = 'upd';
      this.getSourceForEditForm();
      this.isEditFormVisible = !this.isEditFormVisible;
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow = `Вам следует выбрать узел для редактирования`;
      this.eventWindow.openEventWindow();
    }
  }

  del() {
    if (!isUndefined(this.jqxgridComponent.selectRow)) {
      this.eventWindow.okButtonDisabled(false);
      this.actionEventWindow = 'del';
      this.warningEventWindow = `Удалить узел/столб id = "${this.jqxgridComponent.selectRow.nodeId}"?`;
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow = `Вам следует выбрать узел/столб для удаления`;
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

  }

  pinDrop() {

  }

  groupIn() {
    if (this.selectGatewayId > 1) {
      this.linkWindow.openWindow();
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow = `Вам следует выбрать шлюз для привязки узлов`;
      this.eventWindow.openEventWindow();
    }
  }

  groupOut() {
    if (!isUndefined(this.jqxgridComponent.selectRow)) {
      this.eventWindow.okButtonDisabled(false);
      this.actionEventWindow = 'groupOut';
      this.warningEventWindow = `Отвязать узлы от шлюза?`;
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow = `Вам следует выбрать узлы для отвязки от шлюза`;
    }
    this.eventWindow.openEventWindow();
  }

  switchOn() {

  }

  switchOff() {

  }

  // FILTER

  applyFilter(event: any) {
    this.filter = event;
    this.refreshGrid();
  }

  applyFilterFromFilter(event: any) {
    for (let i = 0; i < event.length; i++) {
      switch (event[i].name) {
        case 'geographs':
          this.filter.geographId = event[i].id;
          break;
        case 'ownerNodes':
          this.filter.ownerId = event[i].id;
          break;
        case 'nodeTypes':
          this.filter.nodeTypeId = event[i].id;
          break;
        default:
          break;
      }
    }
    this.refreshGrid();
  }

  initSourceFilter() {
    if (this.isFilterVisible === false
      && !isUndefined(this.geographs)
      && !isUndefined(this.ownerNodes)
      && !isUndefined(this.nodeTypes)) {
      this.isFilterVisible = true;
      for (let i = 0; i < this.sourceForFilter.length; i++) {
        switch (this.sourceForFilter[i].name) {
          case 'geographs':
            this.sourceForFilter[i].source = this.geographs;
            break;
          case 'ownerNodes':
            this.sourceForFilter[i].source = this.ownerNodes;
            break;
          case 'nodeTypes':
            this.sourceForFilter[i].source = this.nodeTypes;
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

  saveEditwinBtn() {
    const selectObject: Node = new Node();

    for (let i = 0; i < this.sourceForEditForm.length; i++) {
      switch (this.sourceForEditForm[i].nameField) {
        case 'geographs':
          selectObject.geographId = +this.sourceForEditForm[i].selectId;
          selectObject.geographCode = this.sourceForEditForm[i].selectCode;
          break;
        case 'contractNodes':
          selectObject.contractId = +this.sourceForEditForm[i].selectId;
          selectObject.contractCode = this.sourceForEditForm[i].selectCode;
          break;
        case 'nodeTypes':
          selectObject.nodeTypeId = +this.sourceForEditForm[i].selectId;
          selectObject.nodeTypeCode = this.sourceForEditForm[i].selectCode;
          break;
        case 'n_coordinate':
          selectObject.n_coordinate = +this.sourceForEditForm[i].selectCode;
          break;
        case 'e_coordinate':
          selectObject.e_coordinate = +this.sourceForEditForm[i].selectCode;
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
      selectObject.gatewayId = !isUndefined(this.selectGatewayId) ? this.selectGatewayId : 1;
      // ins
      this.oSub = this.nodeService.ins(selectObject).subscribe(
        response => {
          selectObject.nodeId = +response;
          MaterialService.toast(`Узел/столб c id = ${selectObject.nodeId} был добавлен.`);
        },
        error => MaterialService.toast(error.error.message),
        () => {
          // close edit window
          this.editWindow.closeDestroyWindow();
          // update data source
          this.jqxgridComponent.refresh_ins(
            selectObject.nodeId, selectObject);
        }
      );
    }
    if (this.typeEditWindow === 'upd') {
      // definde param befor upd
      this.jqxgridComponent.selectRow.geographId = selectObject.geographId;
      this.jqxgridComponent.selectRow.geographCode = selectObject.geographCode;
      this.jqxgridComponent.selectRow.contractId = selectObject.contractId;
      this.jqxgridComponent.selectRow.contractCode = selectObject.contractCode;
      this.jqxgridComponent.selectRow.nodeTypeId = selectObject.nodeTypeId;
      this.jqxgridComponent.selectRow.nodeTypeCode = selectObject.nodeTypeCode;
      this.jqxgridComponent.selectRow.n_coordinate = selectObject.n_coordinate;
      this.jqxgridComponent.selectRow.e_coordinate = selectObject.e_coordinate;
      this.jqxgridComponent.selectRow.serialNumber = selectObject.serialNumber;
      this.jqxgridComponent.selectRow.comment = selectObject.comment;

      // upd
      this.oSub = this.nodeService.upd(this.jqxgridComponent.selectRow).subscribe(
        response => {
          MaterialService.toast(`Узел/столб c id = ${this.jqxgridComponent.selectRow.nodeId} был обновлен.`);
        },
        error => MaterialService.toast(error.error.message),
        () => {
          // close edit window
          this.editWindow.closeDestroyWindow();
          // update data source
          this.jqxgridComponent.refresh_upd(
            this.jqxgridComponent.selectRow.nodeId, this.jqxgridComponent.selectRow);
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
        case 'geographs':
          this.sourceForEditForm[i].source = this.geographs;
          if (this.typeEditWindow === 'ins') {
            this.sourceForEditForm[i].selectId = this.geographs[0].id.toString();
            this.sourceForEditForm[i].selectCode = this.geographs.find(
              (one: Geograph) => one.id === +this.sourceForEditForm[i].selectId).code;
            this.sourceForEditForm[i].selectName = this.geographs.find(
              (one: Geograph) => one.id === +this.sourceForEditForm[i].selectId).fullName;
          }
          if (this.typeEditWindow === 'upd') {
            this.sourceForEditForm[i].selectId = this.jqxgridComponent.selectRow.geographId.toString();
            this.sourceForEditForm[i].selectCode = this.geographs.find(
              (geographOne: Geograph) => geographOne.id === +this.jqxgridComponent.selectRow.geographId).code;
            this.sourceForEditForm[i].selectName = this.geographs.find(
              (geographOne: Geograph) => geographOne.id === +this.jqxgridComponent.selectRow.geographId).fullName;
            for (let j = 0; j < this.geographs.length; j++) {
              if (+this.geographs[j].id === +this.jqxgridComponent.selectRow.geographId) {
                this.sourceForEditForm[i].selectedIndex = j;
                break;
              }
            }
          }
          break;
        case 'contractNodes':
          this.sourceForEditForm[i].source = this.contractNodes;
          if (this.typeEditWindow === 'ins') {
            this.sourceForEditForm[i].selectId = this.contractNodes[0].id.toString();
            this.sourceForEditForm[i].selectCode = this.contractNodes.find(
              (one: Contract) => one.id === +this.sourceForEditForm[i].selectId).code;
            this.sourceForEditForm[i].selectName = this.contractNodes.find(
              (one: Contract) => one.id === +this.sourceForEditForm[i].selectId).name;
          }
          if (this.typeEditWindow === 'upd') {
            this.sourceForEditForm[i].selectId = this.jqxgridComponent.selectRow.contractId.toString();
            this.sourceForEditForm[i].selectCode = this.contractNodes.find(
              (contractOne: Contract) => contractOne.id === +this.jqxgridComponent.selectRow.contractId).code;
            this.sourceForEditForm[i].selectName = this.contractNodes.find(
              (contractOne: Contract) => contractOne.id === +this.jqxgridComponent.selectRow.contractId).name;
            for (let j = 0; j < this.contractNodes.length; j++) {
              if (+this.contractNodes[j].id === +this.jqxgridComponent.selectRow.contractId) {
                this.sourceForEditForm[i].selectedIndex = j;
                break;
              }
            }
          }
          break;
        case 'nodeTypes':
          this.sourceForEditForm[i].source = this.nodeTypes;
          if (this.typeEditWindow === 'ins') {
            this.sourceForEditForm[i].selectId = this.nodeTypes[0].id.toString();
            this.sourceForEditForm[i].selectCode = this.nodeTypes.find(
              (one: EquipmentType) => one.id === +this.sourceForEditForm[i].selectId).code;
            this.sourceForEditForm[i].selectName = this.nodeTypes.find(
              (one: EquipmentType) => one.id === +this.sourceForEditForm[i].selectId).name;
          }
          if (this.typeEditWindow === 'upd') {
            this.sourceForEditForm[i].selectId = this.jqxgridComponent.selectRow.nodeTypeId.toString();
            this.sourceForEditForm[i].selectCode = this.nodeTypes.find(
              (oneType: EquipmentType) => oneType.id === +this.jqxgridComponent.selectRow.nodeTypeId).code;
            this.sourceForEditForm[i].selectName = this.nodeTypes.find(
              (oneType: EquipmentType) => oneType.id === +this.jqxgridComponent.selectRow.nodeTypeId).name;
            for (let j = 0; j < this.nodeTypes.length; j++) {
              if (+this.nodeTypes[j].id === +this.jqxgridComponent.selectRow.nodeTypeId) {
                this.sourceForEditForm[i].selectedIndex = j;
                break;
              }
            }
          }
          break;
        case 'n_coordinate':
          if (this.typeEditWindow === 'upd') {
            this.sourceForEditForm[i].selectCode = this.jqxgridComponent.selectRow.n_coordinate;
          } else {
            this.sourceForEditForm[i].selectCode = '0';
          }
          break;
        case 'e_coordinate':
          if (this.typeEditWindow === 'upd') {
            this.sourceForEditForm[i].selectCode = this.jqxgridComponent.selectRow.e_coordinate;
          } else {
            this.sourceForEditForm[i].selectCode = '0';
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
      this.oSubLink = this.nodeService.setNodeInGatewayGr(this.selectGatewayId, event.Ids).subscribe(
        response => {
          MaterialService.toast('Узлы добавлены в группу!');
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
    this.oSubForLinkWin = this.nodeService.getNodeInGroup(1).subscribe(
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
    const nodeIds = [];
    for (let i = 0; i < this.jqxgridComponent.myGrid.widgetObject.selectedrowindexes.length; i++) {
      nodeIds[i] = this.jqxgridComponent.source_jqxgrid.localdata[this.jqxgridComponent.myGrid.widgetObject.selectedrowindexes[i]].nodeId;
    }

    if (this.actionEventWindow === 'del') {
      const selectedrowindex = this.jqxgridComponent.myGrid.getselectedrowindex();
      const id = this.jqxgridComponent.myGrid.getrowid(selectedrowindex);

      if (+id >= 0) {
        this.nodeService.del(+id).subscribe(
          response => {
            MaterialService.toast('Узел/столб был удален!');
          },
          error => MaterialService.toast(error.error.message),
          () => {
            this.jqxgridComponent.refresh_del([+id]);
          }
        );
      }
    }
    if (this.actionEventWindow === 'groupOut') {
      this.oSub = this.nodeService.delNodeInGatewayGr(this.selectGatewayId, nodeIds).subscribe(
        response => {
          MaterialService.toast('Узлы удалены из группы!');
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
