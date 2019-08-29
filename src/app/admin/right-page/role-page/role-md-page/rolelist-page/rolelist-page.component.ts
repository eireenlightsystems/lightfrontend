// angular lib
import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {isUndefined} from 'util';
import {Subscription} from 'rxjs';
import {MatSnackBar} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
// jqwidgets
import {JqxgridComponent} from '../../../../../shared/components/jqxgrid/jqxgrid.component';
// app interfaces
import {
  FilterRole,
  ItemsLinkForm,
  NavItem,
  SettingButtonPanel,
  SettingWinForEditForm, SourceForEditForm,
  SourceForFilter,
  SourceForJqxGrid, SourceForLinkForm, Role, CompanyDepartment
} from '../../../../../shared/interfaces';
// app services
import {RoleService} from '../../../../../shared/services/admin/role.service';
// app components
import {ButtonPanelComponent} from '../../../../../shared/components/button-panel/button-panel.component';
import {FilterTableComponent} from '../../../../../shared/components/filter-table/filter-table.component';
import {EditFormComponent} from '../../../../../shared/components/edit-form/edit-form.component';
import {LinkFormComponent} from '../../../../../shared/components/link-form/link-form.component';
import {EventWindowComponent} from '../../../../../shared/components/event-window/event-window.component';


const STEP = 1000000000000;


@Component({
  selector: 'app-rolelist-page',
  templateUrl: './rolelist-page.component.html',
  styleUrls: ['./rolelist-page.component.css']
})
export class RolelistPageComponent implements OnInit, OnDestroy {

  // variables from parent component
  @Input() siteMap: NavItem[];
  @Input() companies: CompanyDepartment[];
  @Input() selectUserId: number;
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
  columnsGridEng: any[];
  listBoxSourceEng: any[];
  // main
  items: Role[] = [];
  // grid
  oSub: Subscription;
  selectItemId = 0;
  sourceForJqxGrid: SourceForJqxGrid;
  // filter
  filter: FilterRole = {
    userId: '',
    notUserId: ''
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
              private roleService: RoleService) {
  }

  ngOnInit() {
    // ROLE

    // definde columns
    this.columnsGrid =
      [
        {text: 'roleId', datafield: 'roleId', width: 50},
        {text: 'contragentId', datafield: 'contragentId', width: 150, hidden: true},
        {text: 'Наименование', datafield: 'name', width: 200},
        {text: 'Код контрагента', datafield: 'contragentCode', width: 150},
        {text: 'Наименование контрагента', datafield: 'contragentName', width: 150, hidden: true},
        {text: 'ИНН контрагента', datafield: 'contragentInn', width: 150, hidden: true},
        {text: 'Адрес контрагента', datafield: 'contragentAdres', width: 250, hidden: true},
        {text: 'Коментарий', datafield: 'comments', width: 350}
      ];
    this.listBoxSource =
      [
        {label: 'roleId', value: 'roleId', checked: true},
        {label: 'contragentId', value: 'contragentId', checked: false},
        {label: 'Name', value: 'name', checked: true},
        {label: 'Contractor code', value: 'contragentCode', checked: true},
        {label: 'Contractor name', value: 'contragentName', checked: false},
        {label: 'Contractor Inn', value: 'contragentInn', checked: false},
        {label: 'Contractor adres', value: 'contragentAdres', checked: false},
        {label: 'Comments', value: 'comments', checked: true}
      ];
    this.columnsGridEng =
      [
        {text: 'roleId', datafield: 'roleId', width: 50},
        {text: 'contragentId', datafield: 'contragentId', width: 150, hidden: true},
        {text: 'Name', datafield: 'name', width: 200},
        {text: 'Contractor code', datafield: 'contragentCode', width: 150},
        {text: 'Contractor name', datafield: 'contragentName', width: 150, hidden: true},
        {text: 'Contractor Inn', datafield: 'contragentInn', width: 150, hidden: true},
        {text: 'Contractor adres', datafield: 'contragentAdres', width: 250, hidden: true},
        {text: 'Comments', datafield: 'comments', width: 350}
      ];
    this.listBoxSourceEng =
      [
        {label: 'roleId', value: 'roleId', checked: true},
        {label: 'contragentId', value: 'contragentId', checked: false},
        {label: 'Наименование', value: 'name', checked: true},
        {label: 'Код контрагента', value: 'contragentCode', checked: true},
        {label: 'Наименование контрагента', value: 'contragentName', checked: false},
        {label: 'ИНН контрагента', value: 'contragentInn', checked: false},
        {label: 'Адрес контрагента', value: 'contragentAdres', checked: false},
        {label: 'Коментарий', value: 'comments', checked: true}
      ];

    // definde filter
    this.sourceForFilter = [];

    // definde window edit form
    this.settingWinForEditForm = {
      code: 'editFormRole',
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
        nameField: 'companies',
        type: 'jqxComboBox',
        source: this.companies,
        theme: 'material',
        width: '285',
        height: '20',
        placeHolder: 'Контрагент:',
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
        code: 'linkRole',
        name: 'Выбрать роль',
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

        valueMember: 'roleId',
        sortcolumn: ['roleId'],
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

        valueMember: 'roleId',
        sortcolumn: ['roleId'],
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
    this.selectItemId = selectRow.roleId;
    // refresh child grid
    this.onRefreshChildGrid.emit(selectRow.roleId);
  }

  getAll() {
    const params = Object.assign({}, {
        offset: this.offset,
        limit: this.limit
      },
      this.filter);

    this.oSub = this.roleService.getAll(params).subscribe(roles => {
      this.items = this.items.concat(roles);
      this.noMoreItems = roles.length < STEP;
      this.loading = false;
      this.reloading = false;
    });
  }

  getAvailabilityButtons() {
    if (!this.isMasterGrid && +this.filter.userId === 0) {
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
      this.warningEventWindow = `Вам следует выбрать роль для редактирования`;
      this.eventWindow.openEventWindow();
    }
  }

  del() {
    if (!isUndefined(this.jqxgridComponent.selectRow)) {
      this.eventWindow.okButtonDisabled(false);
      this.actionEventWindow = 'del';
      this.warningEventWindow = `Удалить роль id = "${this.jqxgridComponent.selectRow.roleId}"?`;
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow = `Вам следует выбрать роль для удаления`;
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
    if (this.selectUserId > 1) {
      this.linkWindow.open();
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow = `Вам следует выбрать пользователя для привязки к ролям`;
      this.eventWindow.openEventWindow();
    }
  }

  groupOut() {
    if (!isUndefined(this.jqxgridComponent.selectRow)) {
      this.eventWindow.okButtonDisabled(false);
      this.actionEventWindow = 'groupOut';
      this.warningEventWindow = `Отвязать роль от пользователя?`;
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow = `Вам следует выбрать роль для отвязки от пользователя`;
    }
    this.eventWindow.openEventWindow();
  }

  switchOn() {

  }

  switchOff() {

  }

  // FILTER

  applyFilter(filter: FilterRole) {
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
    const selectObject: Role = new Role();

    for (let i = 0; i < this.sourceForEditForm.length; i++) {
      switch (this.sourceForEditForm[i].nameField) {
        case 'companies':
          selectObject.contragentId = +this.sourceForEditForm[i].selectId;
          selectObject.contragentCode = this.sourceForEditForm[i].selectCode;
          selectObject.contragentName = this.sourceForEditForm[i].selectName;
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

    if (this.typeEditWindow === 'ins') {
      // ins
      this.oSub = this.roleService.ins(selectObject).subscribe(
        response => {
          selectObject.roleId = +response;
          this.openSnackBar('Роль была добавлена, id = ' + selectObject.roleId, 'OK');
        },
        error =>
          this.openSnackBar(error.error.message, 'OK'),
        () => {
          // close edit window
          this.editWindow.closeDestroy();
          // update data source
          this.jqxgridComponent.refresh_ins(
            selectObject.roleId, selectObject);
        }
      );
    }
    if (this.typeEditWindow === 'upd') {
      // definde param befor upd
      this.jqxgridComponent.selectRow.contragentId = selectObject.contragentId;
      this.jqxgridComponent.selectRow.contragentCode = selectObject.contragentCode;
      this.jqxgridComponent.selectRow.contragentName = selectObject.contragentName;
      this.jqxgridComponent.selectRow.name = selectObject.name;
      this.jqxgridComponent.selectRow.comments = selectObject.comments;

      // upd
      this.oSub = this.roleService.upd(this.jqxgridComponent.selectRow).subscribe(
        response => {
          this.openSnackBar('Роль была обновлена, id = ' + this.jqxgridComponent.selectRow.roleId, 'OK');
        },
        error =>
          this.openSnackBar(error.error.message, 'OK'),
        () => {
          // close edit window
          this.editWindow.closeDestroy();
          // update data source
          this.jqxgridComponent.refresh_upd(
            this.jqxgridComponent.selectRow.roleId, this.jqxgridComponent.selectRow);
        }
      );
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
        case 'companies':
          this.sourceForEditForm[i].source = this.companies;
          if (this.typeEditWindow === 'ins') {
            this.sourceForEditForm[i].selectId = this.companies[0].id.toString();
            this.sourceForEditForm[i].selectCode = this.companies.find(
              (one: CompanyDepartment) => one.id === +this.sourceForEditForm[i].selectId).code;
            this.sourceForEditForm[i].selectName = this.companies.find(
              (one: CompanyDepartment) => one.id === +this.sourceForEditForm[i].selectId).name;
          }
          if (this.typeEditWindow === 'upd') {
            this.sourceForEditForm[i].selectId = this.jqxgridComponent.selectRow.contragentId.toString();
            this.sourceForEditForm[i].selectCode = this.companies.find(
              (one: CompanyDepartment) => one.id === +this.jqxgridComponent.selectRow.contragentId).code;
            this.sourceForEditForm[i].selectName = this.companies.find(
              (one: CompanyDepartment) => one.id === +this.jqxgridComponent.selectRow.contragentId).name;
            for (let j = 0; j < this.companies.length; j++) {
              if (+this.companies[j].id === +this.jqxgridComponent.selectRow.contragentId) {
                this.sourceForEditForm[i].selectedIndex = j;
                break;
              }
            }
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
    if (event.code === this.sourceForLinkForm.window.code) {
      for (let i = 0; i < event.Ids.length; i++) {
        this.oSubLink = this.roleService.setUserInRole(event.Ids[i], [+this.selectUserId]).subscribe(
          response => {
            this.openSnackBar('Пользователь включен в роли!', 'OK');
          },
          error => {
            this.openSnackBar(error.error.message, 'OK');
          },
          () => {
            this.linkWindow.hide();
            // refresh table
            this.refreshGrid();
          }
        );
      }
    }
  }

  getSourceForLinkForm() {
    if (this.selectUserId > 1) {
      const params = Object.assign({}, {
          offset: this.offset,
          limit: this.limit
        },
        {
          userId: '',
          notUserId: this.selectUserId.toString()
        });

      this.oSubForLinkWin = this.roleService.getAll(params).subscribe(
        response => {
          this.sourceForLinkForm.grid.source = response;
          this.linkWindow.refreshGrid();
        },
        error => {
          this.openSnackBar(error.error.message, 'OK');
        }
      );
    }
  }

  // EVENT FORM

  okEvenwinBtn() {
    const roleIds = [];
    for (let i = 0; i < this.jqxgridComponent.myGrid.widgetObject.selectedrowindexes.length; i++) {
      roleIds[i] = this.jqxgridComponent.source_jqxgrid.localdata[
        this.jqxgridComponent.myGrid.widgetObject.selectedrowindexes[i]].roleId;
    }

    if (this.actionEventWindow === 'del') {
      const selectedrowindex = this.jqxgridComponent.myGrid.getselectedrowindex();
      const id = this.jqxgridComponent.myGrid.getrowid(selectedrowindex);

      if (+id >= 0) {
        this.roleService.del(+id).subscribe(
          response => {
            this.openSnackBar('Роль была удалена!', 'OK');
          },
          error =>
            this.openSnackBar(error.error.message, 'OK'),
          () => {
            this.jqxgridComponent.refresh_del([+id]);
          }
        );
      }
    }
    if (this.actionEventWindow === 'groupOut') {
      for (let i = 0; i < roleIds.length; i++) {
        this.oSub = this.roleService.delUserInRole(roleIds[i], [+this.selectUserId]).subscribe(
          response => {
            this.openSnackBar('Роли отвязаны от пользователя!', 'OK');
          },
          error => {
            this.openSnackBar(error.error.message, 'OK');
          },
          () => {
            // refresh table
            this.refreshGrid();
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
