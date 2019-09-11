// angular lib
import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs/index';
import {isUndefined} from 'util';
import {TranslateService} from '@ngx-translate/core';
import {MatSnackBar} from '@angular/material/snack-bar';
// jqwidgets
// app interfaces
import {
  Node, Contract, EquipmentType, Owner,
  FilterNode, SourceForFilter,
  SettingButtonPanel,
  SourceForJqxGrid,
  SettingWinForEditForm, SourceForEditForm,
  SourceForLinkForm, ItemsLinkForm, NavItem, NodeType
} from '../../../../shared/interfaces';
// app services
import {NodeService} from '../../../../shared/services/node/node.service';
// app components
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

  // variables from parent component
  @Input() siteMap: NavItem[];
  @Input() ownerNodes: Owner[];
  @Input() nodeTypes: NodeType[];
  @Input() contractNodes: Contract[];
  @Input() selectGatewayId: number;
  @Input() heightGrid: number;
  @Input() isMasterGrid: boolean;
  @Input() selectionmode: string;
  @Input() settingButtonPanel: SettingButtonPanel;

  // determine the functions that need to be performed in the parent component
  @Output() onRefreshChildGrid = new EventEmitter<number>();

  // define variables - link to view objects
  @ViewChild('jqxgridComponent', {static: false}) jqxgridComponent: JqxgridComponent;
  @ViewChild('buttonPanel', {static: false}) buttonPanel: ButtonPanelComponent;
  @ViewChild('filterForm', {static: false}) filterForm: FilterTableComponent;
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
  sourceForFilterEng: SourceForFilter[];
  isFilterFormInit = false;
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
              private nodeService: NodeService) {
  }

  ngOnInit() {
    // define columns for table
    this.columnsGrid =
      [
        {text: 'nodeId', datafield: 'nodeId', width: 150},
        {text: 'Договор', datafield: 'contractCode', width: 150},
        {text: 'Адрес', datafield: 'geographFullName', width: 400},
        {text: 'Тип узла', datafield: 'nodeTypeCode', width: 150},
        {text: 'Широта', datafield: 'n_coordinate', width: 150},
        {text: 'Долгота', datafield: 'e_coordinate', width: 150},
        {text: 'Серийный номер', datafield: 'serialNumber', width: 150},
        {text: 'Коментарий', datafield: 'comment', width: 150},
      ];
    this.listBoxSource =
      [
        {label: 'nodeId', value: 'nodeId', checked: true},
        {label: 'Договор', value: 'contractCode', checked: true},
        {label: 'Адрес', value: 'geographFullName', checked: true},
        {label: 'Тип узла', value: 'nodeTypeCode', checked: true},
        {label: 'Широта', value: 'n_coordinate', checked: true},
        {label: 'Долгота', value: 'e_coordinate', checked: true},
        {label: 'Серийный номер', value: 'serialNumber', checked: true},
        {label: 'Коментарий', value: 'comment', checked: true},
      ];
    this.columnsGridEng =
      [
        {text: 'nodeId', datafield: 'nodeId', width: 150},
        {text: 'Contract', datafield: 'contractCode', width: 150},
        {text: 'Address', datafield: 'geographFullName', width: 400},
        {text: 'Node type', datafield: 'nodeTypeCode', width: 150},
        {text: 'Latitude', datafield: 'n_coordinate', width: 150},
        {text: 'Longitude', datafield: 'e_coordinate', width: 150},
        {text: 'Serial number', datafield: 'serialNumber', width: 150},
        {text: 'Comments', datafield: 'comment', width: 150},
      ];
    this.listBoxSourceEng =
      [
        {label: 'nodeId', value: 'nodeId', checked: true},
        {label: 'Contract', value: 'contractCode', checked: true},
        {label: 'Address', value: 'geographFullName', checked: true},
        {label: 'Node type', value: 'nodeTypeCode', checked: true},
        {label: 'Latitude', value: 'n_coordinate', checked: true},
        {label: 'Longitude', value: 'e_coordinate', checked: true},
        {label: 'Serial number', value: 'serialNumber', checked: true},
        {label: 'Comments', value: 'comment', checked: true},
      ];

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
        valueMember: 'nodeId',
        sortcolumn: ['nodeId'],
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
        name: 'ownerNodes',
        type: 'jqxComboBox',
        source: this.ownerNodes,
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
        name: 'nodeTypes',
        type: 'jqxComboBox',
        source: this.nodeTypes,
        theme: 'material',
        width: '380',
        height: '45',
        placeHolder: 'Node type:',
        displayMember: 'code',
        valueMember: 'id',
        defaultValue: '',
        selectId: ''
      }
    ];

    // definde edit form
    this.settingWinForEditForm = {
      code: 'editFormNode',
      name: 'Add/edit nodes',
      theme: 'material',
      isModal: true,
      modalOpacity: 0.3,
      width: 450,
      maxWidth: 450,
      minWidth: 450,
      height: 600,
      maxHeight: 600,
      minHeight: 600,
      coordX: 500,
      coordY: 65
    };
    this.sourceForEditForm = [
      {
        nameField: 'geographs',
        type: 'ngxSuggestionAddress',
        source: [],
        theme: 'material',
        width: '300',
        height: '20',
        placeHolder: 'Адрес:',
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
    this.sourceForEditFormEng = [
      {
        nameField: 'geographs',
        type: 'ngxSuggestionAddress',
        source: [],
        theme: 'material',
        width: '300',
        height: '20',
        placeHolder: 'Address:',
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
        placeHolder: 'Contract:',
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
        placeHolder: 'Node type:',
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
        placeHolder: 'Latitude:',
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
        placeHolder: 'Longitude:',
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
        code: 'linkGatewayNodes',
        name: 'Выбрать узлы',
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
        valueMember: 'nodeId',
        sortcolumn: ['nodeId'],
        sortdirection: 'desc',
        selectId: []
      }
    };
    this.sourceForLinkFormEng = {
      window: {
        code: 'linkGatewayNodes',
        name: 'Choose nodes',
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
        valueMember: 'nodeId',
        sortcolumn: ['nodeId'],
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
    if (this.filterForm) {
      this.filterForm.destroy();
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
      this.getSourceForFilter();
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
        this.translate.instant('site.menu.operator.node-page.node-masterdetails-page.nodelist-page.upd-warning');
      this.eventWindow.openEventWindow();
    }
  }

  del() {
    if (!isUndefined(this.jqxgridComponent.selectRow)) {
      this.eventWindow.okButtonDisabled(false);
      this.actionEventWindow = 'del';
      this.warningEventWindow =
        this.translate.instant('site.menu.operator.node-page.node-masterdetails-page.nodelist-page.del-question')
        + this.jqxgridComponent.selectRow.nodeId + '?';
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow =
        this.translate.instant('site.menu.operator.node-page.node-masterdetails-page.nodelist-page.del-warning');
    }
    this.eventWindow.openEventWindow();
  }

  refresh() {
    this.refreshGrid();
  }

  setting() {
    this.jqxgridComponent.initSettingForm();
  }

  filterList() {
    this.isFilterFormInit = true;
    this.getSourceForFilter();
  }

  place() {

  }

  pinDrop() {

  }

  groupIn() {
    if (this.selectGatewayId > 1) {
      this.isLinkFormInit = true;
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow =
        this.translate.instant('site.menu.operator.node-page.node-masterdetails-page.nodelist-page.groupIn-warning');
      this.eventWindow.openEventWindow();
    }
  }

  groupOut() {
    if (!isUndefined(this.jqxgridComponent.selectRow)) {
      this.eventWindow.okButtonDisabled(false);
      this.actionEventWindow = 'groupOut';
      this.warningEventWindow =
        this.translate.instant('site.menu.operator.node-page.node-masterdetails-page.nodelist-page.groupOut-question');
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow =
        this.translate.instant('site.menu.operator.node-page.node-masterdetails-page.nodelist-page.groupOut-warning');
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
    this.filterSelect = this.filterForm.getFilterSelect();
    this.refreshGrid();
  }

  getSourceForFilter() {
    if (!isUndefined(this.ownerNodes)
      && !isUndefined(this.nodeTypes)) {
      let sourceForFilter: any[];
      if (this.translate.currentLang === 'ru') {
        sourceForFilter = this.sourceForFilter;
      }
      if (this.translate.currentLang === 'en') {
        sourceForFilter = this.sourceForFilterEng;
      }
      for (let i = 0; i < sourceForFilter.length; i++) {
        switch (sourceForFilter[i].name) {
          case 'geographs':
            break;
          case 'ownerNodes':
            sourceForFilter[i].source = this.ownerNodes;
            break;
          case 'nodeTypes':
            sourceForFilter[i].source = this.nodeTypes;
            break;
          default:
            break;
        }
      }
    }
  }

  destroyFilterForm() {
    this.isFilterFormInit = false;
  }

  // EDIT FORM

  saveEditFormBtn() {
    const selectObject: Node = new Node();
    for (let i = 0; i < this.editForm.sourceForEditForm.length; i++) {
      switch (this.editForm.sourceForEditForm[i].nameField) {
        case 'geographs':
          selectObject.geographId = +this.editForm.sourceForEditForm[i].selectId;
          selectObject.geographFullName = this.editForm.sourceForEditForm[i].selectName;
          break;
        case 'contractNodes':
          selectObject.contractId = +this.editForm.sourceForEditForm[i].selectId;
          selectObject.contractCode = this.editForm.sourceForEditForm[i].selectCode;
          break;
        case 'nodeTypes':
          selectObject.nodeTypeId = +this.editForm.sourceForEditForm[i].selectId;
          selectObject.nodeTypeCode = this.editForm.sourceForEditForm[i].selectCode;
          break;
        case 'n_coordinate':
          selectObject.n_coordinate = +this.editForm.sourceForEditForm[i].selectCode;
          break;
        case 'e_coordinate':
          selectObject.e_coordinate = +this.editForm.sourceForEditForm[i].selectCode;
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
      selectObject.gatewayId = !isUndefined(this.selectGatewayId) ? this.selectGatewayId : 1;
      // ins
      this.oSub = this.nodeService.ins(selectObject).subscribe(
        response => {
          selectObject.nodeId = +response;
          this.openSnackBar(this.translate.instant('site.menu.operator.node-page.node-masterdetails-page.nodelist-page.ins')
            + selectObject.nodeId, this.translate.instant('site.forms.editforms.ok'));
        },
        error =>
          this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok')),
        () => {
          // close edit window
          this.editForm.closeDestroy();
          // update data source
          this.jqxgridComponent.refresh_ins(selectObject.nodeId, selectObject);
        }
      );
    }
    if (this.typeEditWindow === 'upd') {
      // definde param befor upd
      this.jqxgridComponent.selectRow.geographId = selectObject.geographId;
      this.jqxgridComponent.selectRow.geographFullName = selectObject.geographFullName;
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
          this.openSnackBar(this.translate.instant('site.menu.operator.node-page.node-masterdetails-page.nodelist-page.upd')
            + this.jqxgridComponent.selectRow.nodeId, this.translate.instant('site.forms.editforms.ok'));
        },
        error =>
          this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok')),
        () => {
          // close edit window
          this.editForm.closeDestroy();
          // update data source
          this.jqxgridComponent.refresh_upd(this.jqxgridComponent.selectRow.nodeId, this.jqxgridComponent.selectRow);
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
        case 'geographs':
          if (this.typeEditWindow === 'ins') {
            sourceForEditForm[i].selectId = '1';
            sourceForEditForm[i].selectName = this.translate.instant('site.forms.editforms.withoutAddress');
          }
          if (this.typeEditWindow === 'upd') {
            sourceForEditForm[i].selectId = this.jqxgridComponent.selectRow.geographId.toString();
            sourceForEditForm[i].selectName = this.jqxgridComponent.selectRow.geographFullName;
          }
          break;
        case 'contractNodes':
          sourceForEditForm[i].source = this.contractNodes;
          if (this.typeEditWindow === 'ins') {
            sourceForEditForm[i].selectId = this.contractNodes[0].id.toString();
            sourceForEditForm[i].selectCode = this.contractNodes.find(
              (one: Contract) => one.id === +sourceForEditForm[i].selectId).code;
            sourceForEditForm[i].selectName = this.contractNodes.find(
              (one: Contract) => one.id === +sourceForEditForm[i].selectId).name;
          }
          if (this.typeEditWindow === 'upd') {
            sourceForEditForm[i].selectId = this.jqxgridComponent.selectRow.contractId.toString();
            sourceForEditForm[i].selectCode = this.contractNodes.find(
              (contractOne: Contract) => contractOne.id === +this.jqxgridComponent.selectRow.contractId).code;
            sourceForEditForm[i].selectName = this.contractNodes.find(
              (contractOne: Contract) => contractOne.id === +this.jqxgridComponent.selectRow.contractId).name;
            for (let j = 0; j < this.contractNodes.length; j++) {
              if (+this.contractNodes[j].id === +this.jqxgridComponent.selectRow.contractId) {
                sourceForEditForm[i].selectedIndex = j;
                break;
              }
            }
          }
          break;
        case 'nodeTypes':
          sourceForEditForm[i].source = this.nodeTypes;
          if (this.typeEditWindow === 'ins') {
            sourceForEditForm[i].selectId = this.nodeTypes[0].id.toString();
            sourceForEditForm[i].selectCode = this.nodeTypes.find(
              (one: NodeType) => one.id === +sourceForEditForm[i].selectId).code;
            sourceForEditForm[i].selectName = this.nodeTypes.find(
              (one: NodeType) => one.id === +sourceForEditForm[i].selectId).name;
          }
          if (this.typeEditWindow === 'upd') {
            sourceForEditForm[i].selectId = this.jqxgridComponent.selectRow.nodeTypeId.toString();
            sourceForEditForm[i].selectCode = this.nodeTypes.find(
              (oneType: NodeType) => oneType.id === +this.jqxgridComponent.selectRow.nodeTypeId).code;
            sourceForEditForm[i].selectName = this.nodeTypes.find(
              (oneType: NodeType) => oneType.id === +this.jqxgridComponent.selectRow.nodeTypeId).name;
            for (let j = 0; j < this.nodeTypes.length; j++) {
              if (+this.nodeTypes[j].id === +this.jqxgridComponent.selectRow.nodeTypeId) {
                sourceForEditForm[i].selectedIndex = j;
                break;
              }
            }
          }
          break;
        case 'n_coordinate':
          if (this.typeEditWindow === 'upd') {
            sourceForEditForm[i].selectCode = this.jqxgridComponent.selectRow.n_coordinate;
          } else {
            sourceForEditForm[i].selectCode = '0';
          }
          break;
        case 'e_coordinate':
          if (this.typeEditWindow === 'upd') {
            sourceForEditForm[i].selectCode = this.jqxgridComponent.selectRow.e_coordinate;
          } else {
            sourceForEditForm[i].selectCode = '0';
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
    if (event.Ids.length > 0) {
      if (event.code === this.sourceForLinkForm.window.code) {
        this.oSubLink = this.nodeService.setNodeInGatewayGr(this.selectGatewayId, event.Ids).subscribe(
          response => {
            this.openSnackBar(this.translate.instant('site.menu.operator.node-page.node-masterdetails-page.nodelist-page.groupIn'),
              this.translate.instant('site.forms.editforms.ok'));
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
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow =
        this.translate.instant('site.menu.operator.node-page.node-masterdetails-page.nodelist-page.groupIn-warning2');
      this.eventWindow.openEventWindow();
    }
  }

  getSourceForLinkForm() {
    this.oSubForLinkWin = this.nodeService.getNodeInGroup(1).subscribe(
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
            this.openSnackBar(this.translate.instant('site.menu.operator.node-page.node-masterdetails-page.nodelist-page.del'),
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
    if (this.actionEventWindow === 'groupOut') {
      this.oSub = this.nodeService.delNodeInGatewayGr(this.selectGatewayId, nodeIds).subscribe(
        response => {
          this.openSnackBar(this.translate.instant('site.menu.operator.node-page.node-masterdetails-page.nodelist-page.groupOut'),
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
