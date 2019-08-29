// angular lib
import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {isUndefined} from 'util';
import {TranslateService} from '@ngx-translate/core';
import {MatSnackBar} from '@angular/material';
// jqwidgets
import {JqxgridComponent} from '../../../../../shared/components/jqxgrid/jqxgrid.component';
// app interfaces
import {
  FilterUser, ItemsLinkForm,
  Person,
  SettingButtonPanel,
  SettingWinForEditForm,
  SourceForEditForm, SourceForFilter,
  SourceForJqxGrid, SourceForLinkForm,
  User, NavItem
} from '../../../../../shared/interfaces';
// app services
import {UserService} from '../../../../../shared/services/admin/user.service';
import {RoleService} from '../../../../../shared/services/admin/role.service';
// app components
import {ButtonPanelComponent} from '../../../../../shared/components/button-panel/button-panel.component';
import {FilterTableComponent} from '../../../../../shared/components/filter-table/filter-table.component';
import {EditFormComponent} from '../../../../../shared/components/edit-form/edit-form.component';
import {LinkFormComponent} from '../../../../../shared/components/link-form/link-form.component';
import {EventWindowComponent} from '../../../../../shared/components/event-window/event-window.component';

// angular lib

// jqwidgets

// app interfaces

// app services

// app components

const STEP = 1000000000000;


@Component({
  selector: 'app-userlist-page',
  templateUrl: './userlist-page.component.html',
  styleUrls: ['./userlist-page.component.css']
})
export class UserlistPageComponent implements OnInit, OnDestroy {

  // variables from parent component

  // determine the functions that need to be performed in the parent component

  // define variables - link to view objects

  // other variables

  // variables from parent component
  @Input() siteMap: NavItem[];
  @Input() persons: Person[];
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
  columnsGridEng: any[];
  listBoxSourceEng: any[];
  // main
  items: User[] = [];
  // grid
  oSub: Subscription;
  selectItemId = 0;
  sourceForJqxGrid: SourceForJqxGrid;
  // filter
  filter: FilterUser = {
    roleId: '',
    contragentId: '',
    notRoleId: ''
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
  isLinkFormInit = false;
  typeEditWindow = '';
  // link form
  oSubForLinkWin: Subscription;
  oSubLink: Subscription;
  sourceForLinkForm: SourceForLinkForm;
  sourceForLinkFormEng: SourceForLinkForm;
  // event form
  warningEventWindow = '';
  actionEventWindow = '';

  constructor(private _snackBar: MatSnackBar,
              // service
              public translate: TranslateService,
              private roleService: RoleService,
              private userService: UserService) {
  }

  ngOnInit() {
    // USER

    // definde columns
    this.columnsGrid =
      [
        {text: 'userId', datafield: 'userId', width: 50},
        {text: 'contragentId', datafield: 'contragentId', width: 150, hidden: true},
        {text: 'Логин', datafield: 'login', width: 150},
        {text: 'Код контрагента', datafield: 'contragentCode', width: 150},
        {text: 'Наименование контрагента', datafield: 'contragentName', width: 150},
        {text: 'ИНН контрагента', datafield: 'contragentInn', width: 150},
        {text: 'Адрес контрагента', datafield: 'contragentAdres', width: 250},
        {text: 'Коментарий', datafield: 'comments', width: 250}
      ];
    this.listBoxSource =
      [
        {label: 'userId', value: 'userId', checked: true},
        {label: 'contragentId', value: 'contragentId', checked: false},
        {label: 'Логин', value: 'login', checked: true},
        {label: 'Код контрагента', value: 'contragentCode', checked: true},
        {label: 'Наименование контрагента', value: 'contragentName', checked: true},
        {label: 'ИНН контрагента', value: 'contragentInn', checked: true},
        {label: 'Адрес контрагента', value: 'contragentAdres', checked: true},
        {label: 'Коментарий', value: 'comments', checked: true}
      ];
    this.columnsGridEng =
      [
        {text: 'userId', datafield: 'userId', width: 50},
        {text: 'contragentId', datafield: 'contragentId', width: 150, hidden: true},
        {text: 'Login', datafield: 'login', width: 150},
        {text: 'Contractor code', datafield: 'contragentCode', width: 150},
        {text: 'Contractor name', datafield: 'contragentName', width: 150},
        {text: 'Contractor Inn', datafield: 'contragentInn', width: 150},
        {text: 'Contractor adres', datafield: 'contragentAdres', width: 250},
        {text: 'Comments', datafield: 'comments', width: 250}
      ];
    this.listBoxSourceEng =
      [
        {label: 'userId', value: 'userId', checked: true},
        {label: 'contragentId', value: 'contragentId', checked: false},
        {label: 'Login', value: 'login', checked: true},
        {label: 'Contractor code', value: 'contragentCode', checked: true},
        {label: 'Contractor name', value: 'contragentName', checked: true},
        {label: 'Contractor Inn', value: 'contragentInn', checked: true},
        {label: 'Contractor adres', value: 'contragentAdres', checked: true},
        {label: 'Comments', value: 'comments', checked: true}
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

        valueMember: 'userId',
        sortcolumn: ['userId'],
        sortdirection: 'desc',
        selectId: []
      }
    };

    // definde edit form
    this.settingWinForEditForm = {
      code: 'editFormUser',
      name: this.translate.instant('site.forms.editforms.edit'),
      theme: 'material',
      isModal: true,
      modalOpacity: 0.3,
      width: 450,
      maxWidth: 500,
      minWidth: 460,
      height: 400,
      maxHeight: 400,
      minHeight: 400,
      coordX: 500,
      coordY: 65
    };
    this.sourceForEditForm = [
      {
        nameField: 'persons',
        type: 'jqxComboBox',
        source: this.persons,
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
        nameField: 'login',
        type: 'jqxTextArea',
        source: [],
        theme: 'material',
        width: '280',
        height: '20',
        placeHolder: 'Логин:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'password',
        type: 'jqxTextArea',
        source: [],
        theme: 'material',
        width: '280',
        height: '20',
        placeHolder: 'Пароль:',
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
    this.sourceForEditFormEng = [
      {
        nameField: 'persons',
        type: 'jqxComboBox',
        source: this.persons,
        theme: 'material',
        width: '285',
        height: '20',
        placeHolder: 'Contractor:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'login',
        type: 'jqxTextArea',
        source: [],
        theme: 'material',
        width: '280',
        height: '20',
        placeHolder: 'Login:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'password',
        type: 'jqxTextArea',
        source: [],
        theme: 'material',
        width: '280',
        height: '20',
        placeHolder: 'Password:',
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
        placeHolder: 'Comments:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      }
    ];

    // definde filter
    this.sourceForFilter = [
      {
        name: 'persons',
        type: 'jqxComboBox',
        source: this.persons,
        theme: 'material',
        width: '380',
        height: '40',
        placeHolder: 'Контрагент:',
        displayMember: 'code',
        valueMember: 'id',
        defaultValue: '',
        selectId: ''
      }
    ];
    this.sourceForFilterEng = [
      {
        name: 'persons',
        type: 'jqxComboBox',
        source: this.persons,
        theme: 'material',
        width: '380',
        height: '40',
        placeHolder: 'Contractor:',
        displayMember: 'code',
        valueMember: 'id',
        defaultValue: '',
        selectId: ''
      }
    ];

    // definde link form
    this.sourceForLinkForm = {
      window: {
        code: 'linkUser',
        name: 'Выбрать пользователя',
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

        valueMember: 'userId',
        sortcolumn: ['userId'],
        sortdirection: 'desc',
        selectId: []
      }
    };
    this.sourceForLinkFormEng = {
      window: {
        code: 'linkUser',
        name: 'Select users',
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

        valueMember: 'userId',
        sortcolumn: ['userId'],
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
    this.selectItemId = selectRow.userId;
    // refresh child grid
    this.onRefreshChildGrid.emit(selectRow.userId);
  }

  getAll() {
    const params = Object.assign({}, {
        offset: this.offset,
        limit: this.limit
      },
      this.filter);

    this.oSub = this.userService.getAll(params).subscribe(users => {
      this.items = this.items.concat(users);
      this.noMoreItems = users.length < STEP;
      this.loading = false;
      this.reloading = false;
    });
  }

  getAvailabilityButtons() {
    if (!this.isMasterGrid && +this.filter.roleId === 0) {
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
    this.isEditFormInit = !this.isEditFormInit;
  }

  upd() {
    if (!isUndefined(this.jqxgridComponent.selectRow)) {
      this.typeEditWindow = 'upd';
      this.getSourceForEditForm();
      this.isEditFormInit = !this.isEditFormInit;
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow = this.translate.instant('site.menu.administration.right-page.user-page.upd-warning');
      this.eventWindow.openEventWindow();
    }
  }

  del() {
    if (!isUndefined(this.jqxgridComponent.selectRow)) {
      this.eventWindow.okButtonDisabled(false);
      this.actionEventWindow = 'del';
      this.warningEventWindow = this.translate.instant('site.menu.administration.right-page.user-page.del-question') + this.jqxgridComponent.selectRow.userId + '?';
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow = this.translate.instant('site.menu.administration.right-page.user-page.del-warning');
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
      this.getSourceForFilter();
      this.filterTable.open();
    }
  }

  place() {

  }

  pinDrop() {

  }

  groupIn() {
    if (this.selectRoleId > 1) {
      // this.linkWindow.open();
      this.isLinkFormInit = !this.isLinkFormInit;
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow = this.translate.instant('site.menu.administration.right-page.user-page.groupIn-warning');
      this.eventWindow.openEventWindow();
    }
  }

  groupOut() {
    if (!isUndefined(this.jqxgridComponent.selectRow)) {
      this.eventWindow.okButtonDisabled(false);
      this.actionEventWindow = 'groupOut';
      this.warningEventWindow = this.translate.instant('site.menu.administration.right-page.user-page.groupOut-question');
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow = this.translate.instant('site.menu.administration.right-page.user-page.groupOut-warning');
    }
    this.eventWindow.openEventWindow();
  }

  switchOn() {

  }

  switchOff() {

  }

  // FILTER

  applyFilter(filter: FilterUser) {
    this.filter = filter;
    this.refreshGrid();
  }

  applyFilterFromFilter(event: any) {
    for (let i = 0; i < event.length; i++) {
      switch (event[i].name) {
        case 'persons':
          this.filter.contragentId = event[i].id;
          break;
        default:
          break;
      }
    }
    this.refreshGrid();
  }

  getSourceForFilter() {
    if (this.isFilterVisible === false && !isUndefined(this.persons)) {
      this.isFilterVisible = true;
      for (let i = 0; i < this.sourceForFilter.length; i++) {
        switch (this.sourceForFilter[i].name) {
          case 'roles':
            break;
          case 'persons':
            this.sourceForFilter[i].source = this.persons;
            this.sourceForFilterEng[i].source = this.persons;
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
    const selectObject: User = new User();

    for (let i = 0; i < this.editWindow.sourceForEditForm.length; i++) {
      switch (this.editWindow.sourceForEditForm[i].nameField) {
        case 'persons':
          selectObject.contragentId = +this.editWindow.sourceForEditForm[i].selectId;
          selectObject.contragentCode = this.editWindow.sourceForEditForm[i].selectCode;
          selectObject.contragentName = this.editWindow.sourceForEditForm[i].selectName;
          break;
        case 'login':
          selectObject.login = this.editWindow.sourceForEditForm[i].selectCode;
          break;
        case 'password':
          selectObject.password = this.editWindow.sourceForEditForm[i].selectCode;
          break;
        case 'comments':
          selectObject.comments = this.editWindow.sourceForEditForm[i].selectCode;
          break;
        default:
          break;
      }
    }

    if (this.typeEditWindow === 'ins') {
      // ins
      this.oSub = this.userService.ins(selectObject).subscribe(
        response => {
          selectObject.userId = +response;
          this.openSnackBar(this.translate.instant('site.menu.administration.right-page.user-page.ins') + selectObject.userId, this.translate.instant('site.forms.editforms.ok'));
        },
        error =>
          this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok')),
        () => {
          // close edit window
          this.editWindow.closeDestroy();
          // update data source
          this.jqxgridComponent.refresh_ins(
            selectObject.userId, selectObject);
        }
      );
    }
    if (this.typeEditWindow === 'upd') {
      // definde param befor upd
      this.jqxgridComponent.selectRow.contragentId = selectObject.contragentId;
      this.jqxgridComponent.selectRow.contragentCode = selectObject.contragentCode;
      this.jqxgridComponent.selectRow.contragentName = selectObject.contragentName;
      this.jqxgridComponent.selectRow.password = selectObject.password;
      this.jqxgridComponent.selectRow.login = selectObject.login;
      this.jqxgridComponent.selectRow.comments = selectObject.comments;

      // upd
      this.oSub = this.userService.upd(this.jqxgridComponent.selectRow).subscribe(
        response => {
          this.openSnackBar(this.translate.instant('site.menu.administration.right-page.user-page.upd') + this.jqxgridComponent.selectRow.userId, this.translate.instant('site.forms.editforms.ok'));
        },
        error =>
          this.openSnackBar(error.error.message, 'OK'),
        () => {
          // close edit window
          this.editWindow.closeDestroy();
          // update data source
          this.jqxgridComponent.refresh_upd(
            this.jqxgridComponent.selectRow.userId, this.jqxgridComponent.selectRow);
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
        case 'persons':
          sourceForEditForm[i].source = this.persons;
          if (this.typeEditWindow === 'ins') {
            sourceForEditForm[i].selectId = this.persons[0].id.toString();
            sourceForEditForm[i].selectCode = this.persons.find(
              (one: Person) => one.id === +sourceForEditForm[i].selectId).code;
            sourceForEditForm[i].selectName = this.persons.find(
              (one: Person) => one.id === +sourceForEditForm[i].selectId).name;
          }
          if (this.typeEditWindow === 'upd') {
            sourceForEditForm[i].selectId = this.jqxgridComponent.selectRow.contragentId.toString();
            sourceForEditForm[i].selectCode = this.persons.find(
              (one: Person) => one.id === +this.jqxgridComponent.selectRow.contragentId).code;
            sourceForEditForm[i].selectName = this.persons.find(
              (one: Person) => one.id === +this.jqxgridComponent.selectRow.contragentId).name;
            for (let j = 0; j < this.persons.length; j++) {
              if (+this.persons[j].id === +this.jqxgridComponent.selectRow.contragentId) {
                sourceForEditForm[i].selectedIndex = j;
                break;
              }
            }
          }
          break;
        case 'login':
          if (this.typeEditWindow === 'upd') {
            sourceForEditForm[i].selectCode = this.jqxgridComponent.selectRow.login;
          }
          break;
        case 'comments':
          if (this.typeEditWindow === 'upd') {
            sourceForEditForm[i].selectCode = this.jqxgridComponent.selectRow.comments;
          }
          break;
        default:
          break;
      }
    }
  }

  initEditForm() {
    this.isEditFormInit = !this.isEditFormInit;
  }

  // LINK FORM

  saveLinkFormBtn(event: ItemsLinkForm) {
    if (event.Ids.length > 0) {
      if (event.code === this.sourceForLinkForm.window.code) {
        this.oSubLink = this.roleService.setUserInRole(+this.selectRoleId, event.Ids).subscribe(
          response => {
            this.openSnackBar(this.translate.instant('site.menu.administration.right-page.user-page.groupIn'), this.translate.instant('site.forms.editforms.ok'));
          },
          error => {
            this.openSnackBar(error.error.message, 'OK');
          },
          () => {
            // this.linkWindow.hide();
            this.linkWindow.closeDestroy();
            // refresh table
            this.refreshGrid();
          }
        );
      }
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow = this.translate.instant('site.menu.administration.right-page.user-page.groupIn-warning2');
      this.eventWindow.openEventWindow();
    }
  }

  getSourceForLinkForm() {
    if (this.selectRoleId > 1) {
      const params = Object.assign({}, {
          offset: this.offset,
          limit: this.limit
        },
        {
          roleId: '',
          contragentId: '',
          notRoleId: this.selectRoleId.toString()
        });

      this.oSubForLinkWin = this.userService.getAll(params).subscribe(
        response => {
          this.sourceForLinkForm.grid.source = response;
          this.sourceForLinkFormEng.grid.source = response;
          this.linkWindow.refreshGrid();
        },
        error => {
          this.openSnackBar(error.error.message, 'OK');
        }
      );
    }
  }

  initLinkForm() {
    this.isLinkFormInit = !this.isLinkFormInit;
  }

  // EVENT FORM

  okEvenwinBtn() {
    const userIds = [];
    for (let i = 0; i < this.jqxgridComponent.myGrid.widgetObject.selectedrowindexes.length; i++) {
      userIds[i] = this.jqxgridComponent.source_jqxgrid.localdata[
        this.jqxgridComponent.myGrid.widgetObject.selectedrowindexes[i]].userId;
    }

    if (this.actionEventWindow === 'del') {
      const selectedrowindex = this.jqxgridComponent.myGrid.getselectedrowindex();
      const id = this.jqxgridComponent.myGrid.getrowid(selectedrowindex);

      if (+id >= 0) {
        this.userService.del(+id).subscribe(
          response => {
            this.openSnackBar(this.translate.instant('site.menu.administration.right-page.user-page.del'), this.translate.instant('site.forms.editforms.ok'));
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
      this.oSub = this.roleService.delUserInRole(+this.selectRoleId, userIds).subscribe(
        response => {
          this.openSnackBar(this.translate.instant('site.menu.administration.right-page.user-page.groupOut'), this.translate.instant('site.forms.editforms.ok'));
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

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }
}
