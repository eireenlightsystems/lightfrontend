import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {isNull, isUndefined} from 'util';
import {Subscription} from 'rxjs';
import {MatSnackBar} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';

import {JqxgridComponent} from '../../../../shared/components/jqxgrid/jqxgrid.component';

import {
  ItemsLinkForm,
  NavItem,
  SettingButtonPanel,
  SettingWinForEditForm, SourceForEditForm,
  SourceForFilter,
  SourceForJqxGrid, SourceForLinkForm, FilterComponent, Components
} from '../../../../shared/interfaces';

import {ButtonPanelComponent} from '../../../../shared/components/button-panel/button-panel.component';
import {FilterTableComponent} from '../../../../shared/components/filter-table/filter-table.component';
import {EditFormComponent} from '../../../../shared/components/edit-form/edit-form.component';
import {LinkFormComponent} from '../../../../shared/components/link-form/link-form.component';
import {EventWindowComponent} from '../../../../shared/components/event-window/event-window.component';
import {ComponentService} from '../../../../shared/services/admin/component.service';


const STEP = 1000000000000;


@Component({
  selector: 'app-componentlist-page',
  templateUrl: './componentlist-page.component.html',
  styleUrls: ['./componentlist-page.component.css']
})
export class ComponentlistPageComponent implements OnInit, OnDestroy {

  // variables from master component
  @Input() siteMap: NavItem[];

  @Input() selectRoleId: number;

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
  @ViewChild('editWindow', {static: false}) editWindow: EditFormComponent;
  @ViewChild('linkWindow', {static: false}) linkWindow: LinkFormComponent;
  @ViewChild('eventWindow', {static: false}) eventWindow: EventWindowComponent;

  // other variables
  offset = 0;
  limit = STEP;
  loading = false;
  reloading = false;
  noMoreItems = false;
  columnsGrid: any[];
  listBoxSource: any[];
  // main
  items: Components[] = [];
  // grid
  oSub: Subscription;
  selectItemId = 0;
  sourceForJqxGrid: SourceForJqxGrid;
  // filter
  filter: FilterComponent = {
    roleId: '',
    userId: '',
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

  constructor(private _snackBar: MatSnackBar,
              // service
              public translate: TranslateService,
              private componentService: ComponentService) {
  }

  ngOnInit() {
    // mass load component from siteMap
    // for (let i = 0; i < this.siteMap.length; i++) {
    //   this.saveComponentsToDb(this.siteMap[i]);
    // }

    // COMPONENT
    // define columns for table
    if (this.isMasterGrid) {
      this.columnsGrid =
        [
          {text: 'componentId', datafield: 'componentId', width: 50},
          {text: 'Код', datafield: 'code', width: 250},
          {text: 'Наименование', datafield: 'name', width: 350},
          {text: 'Коментарий', datafield: 'comments', width: 350}
        ];
      // define a data source for filtering table columns
      this.listBoxSource =
        [
          {label: 'componentId', value: 'componentId', checked: true},
          {label: 'Код', value: 'code', checked: true},
          {label: 'Наименование', value: 'name', checked: true},
          {label: 'Коментарий', value: 'comments', checked: true}
        ];
    } else {
      this.columnsGrid =
        [
          {text: 'componentId', datafield: 'componentId', width: 50},
          {text: 'Код', datafield: 'code', width: 250},
          {text: 'Наименование', datafield: 'name', width: 350},
          {text: 'Коментарий', datafield: 'comments', width: 350}
        ];
      // define a data source for filtering table columns
      this.listBoxSource =
        [
          {label: 'componentId', value: 'componentId', checked: true},
          {label: 'Код', value: 'code', checked: true},
          {label: 'Наименование', value: 'name', checked: true},
          {label: 'Коментарий', value: 'comments', checked: true}
        ];
    }

    // definde filter
    this.sourceForFilter = [];

    // definde window edit form
    this.settingWinForEditForm = {
      code: 'editFormComponent',
      name: this.translate.instant('site.forms.editforms.edit'),
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
        nameField: 'code',
        type: 'jqxTextArea',
        source: [],
        theme: 'material',
        width: '280',
        height: '20',
        placeHolder: 'Код:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'name',
        type: 'jqxTextArea',
        source: [],
        theme: 'material',
        width: '280',
        height: '20',
        placeHolder: 'Наименование:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'comments',
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
        code: 'linkComponent',
        name: 'Выбрать компонент',
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

        valueMember: 'componentId',
        sortcolumn: ['componentId'],
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

        valueMember: 'componentId',
        sortcolumn: ['componentId'],
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
    if (this.editWindow) {
      this.editWindow.destroy();
    }
    if (this.linkWindow) {
      this.linkWindow.destroy();
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
    this.selectItemId = selectRow.componentId;
    // refresh child grid
    this.onRefreshChildGrid.emit(selectRow.componentId);
  }

  getAll() {
    const params = Object.assign({}, {
        offset: this.offset,
        limit: this.limit
      },
      this.filter);

    this.oSub = this.componentService.getAll(params).subscribe(components => {
      if (this.filter.roleId === '' && this.filter.userId === '') {
        this.items = this.items.concat(components);
      } else {
        this.items = components.filter((one: Components) => one.rights === 'true');
      }
      this.noMoreItems = components.length < STEP;
      this.loading = false;
      this.reloading = false;
    });
  }

  getAvailabilityButtons() {
    if (!this.isMasterGrid && +this.filter.roleId === 0 && +this.filter.userId === 0) {
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
    this.isEditFormVisible = !this.isEditFormVisible;
  }

  upd() {
    if (!isUndefined(this.jqxgridComponent.selectRow)) {
      this.typeEditWindow = 'upd';
      this.getSourceForEditForm();
      this.isEditFormVisible = !this.isEditFormVisible;
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow = `Вам следует выбрать компонент для редактирования`;
      this.eventWindow.openEventWindow();
    }
  }

  del() {
    if (!isUndefined(this.jqxgridComponent.selectRow)) {
      this.eventWindow.okButtonDisabled(false);
      this.actionEventWindow = 'del';
      this.warningEventWindow = `Удалить компонент id = "${this.jqxgridComponent.selectRow.componentId}"?`;
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow = `Вам следует выбрать компонент для удаления`;
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

  switchOn() {

  }

  switchOff() {

  }

  // FILTER

  applyFilter(filter: FilterComponent) {
    this.filter = filter;
    this.refreshGrid();
  }

  applyFilterFromFilter(event: any) {
    for (let i = 0; i < event.length; i++) {
      switch (event[i].name) {
        default:
          break;
      }
    }
    this.refreshGrid();
  }

  initSourceFilter() {

  }

  // EDIT FORM

  saveEditwinBtn() {
    const selectObject: Components = new Components();

    for (let i = 0; i < this.sourceForEditForm.length; i++) {
      switch (this.sourceForEditForm[i].nameField) {
        case 'code':
          selectObject.code = this.sourceForEditForm[i].selectCode;
          break;
        case 'name':
          selectObject.name = this.sourceForEditForm[i].selectCode;
          break;
        case 'comments':
          selectObject.comments = this.sourceForEditForm[i].selectCode;
          break;
        default:
          break;
      }
    }
    if (!isUndefined(selectObject.code) && selectObject.code !== '') {
      if (this.typeEditWindow === 'ins') {
        // ins
        this.oSub = this.componentService.ins(selectObject).subscribe(
          response => {
            selectObject.componentId = +response;
            this.openSnackBar('Компонент был добавлен, id = ' + selectObject.componentId, 'OK');
          },
          error =>
            this.openSnackBar(error.error.message, 'OK'),
          () => {
            // close edit window
            this.editWindow.closeDestroy();
            // update data source
            this.jqxgridComponent.refresh_ins(
              selectObject.componentId, selectObject);
          }
        );
      }
      if (this.typeEditWindow === 'upd') {
        // definde param befor upd
        this.jqxgridComponent.selectRow.code = selectObject.code;
        this.jqxgridComponent.selectRow.name = selectObject.name;
        this.jqxgridComponent.selectRow.comments = selectObject.comments;

        // upd
        this.oSub = this.componentService.upd(this.jqxgridComponent.selectRow).subscribe(
          response => {
            this.openSnackBar('Компонент был обновлен, id = ' + this.jqxgridComponent.selectRow.componentId, 'OK');
          },
          error =>
            this.openSnackBar(error.error.message, 'OK'),
          () => {
            // close edit window
            this.editWindow.closeDestroy();
            // update data source
            this.jqxgridComponent.refresh_upd(
              this.jqxgridComponent.selectRow.componentId, this.jqxgridComponent.selectRow);
          }
        );
      }
    } else {
      this.openSnackBar('Заполните код компонента', 'OK');
    }
  }

  getSourceForEditForm() {
    for (let i = 0; i < this.sourceForEditForm.length; i++) {
      if (this.typeEditWindow === 'ins') {
        this.sourceForEditForm[i].selectedIndex = 0;
        this.sourceForEditForm[i].selectId = '1';
        this.sourceForEditForm[i].selectCode = this.translate.instant('site.forms.editforms.empty');
      }
      switch (this.sourceForEditForm[i].nameField) {
        case 'code':
          if (this.typeEditWindow === 'upd') {
            this.sourceForEditForm[i].selectCode = this.jqxgridComponent.selectRow.code;
          }
          break;
        case 'name':
          if (this.typeEditWindow === 'upd') {
            this.sourceForEditForm[i].selectCode = this.jqxgridComponent.selectRow.name;
          }
          break;
        case 'comments':
          if (this.typeEditWindow === 'upd') {
            this.sourceForEditForm[i].selectCode = this.jqxgridComponent.selectRow.comments;
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

  }

  getSourceForLinkForm() {

  }

  // EVENT FORM

  okEvenwinBtn() {
    if (this.actionEventWindow === 'del') {
      const selectedrowindex = this.jqxgridComponent.myGrid.getselectedrowindex();
      const id = this.jqxgridComponent.myGrid.getrowid(selectedrowindex);

      if (+id >= 0) {
        this.componentService.del(+id).subscribe(
          response => {
            this.openSnackBar('Компонент был удален!', 'OK');
          },
          error =>
            this.openSnackBar(error.error.message, 'OK'),
          () => {
            this.jqxgridComponent.refresh_del([+id]);
          }
        );
      }
    }
  }

  // mass load component from siteMap
  saveComponentsToDb(node: NavItem) {
    this.insComponentToDb(node);
    for (let i = 0; i < node.children.length; i++) {
      this.saveComponentsToDb(node.children[i]);
    }
  }

  // OTHER FUNC

  // insert component to Db
  insComponentToDb(node: NavItem) {
    const selectObject: Components = new Components();
    selectObject.code = node.componentName;
    selectObject.name = this.translate.instant(node.displayName);
    selectObject.comments = node.route;

    this.oSub = this.componentService.ins(selectObject).subscribe(
      response => {
        selectObject.componentId = +response;
        this.openSnackBar('Компонент был добавлен, id = ' + selectObject.componentId, 'OK');
      },
      error =>
        this.openSnackBar(error.error.message, 'OK'),
      () => {

      }
    );
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

}
