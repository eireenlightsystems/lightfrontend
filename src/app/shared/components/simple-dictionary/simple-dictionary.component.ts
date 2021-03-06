// angular lib
import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {isNull, isUndefined} from 'util';
import {TranslateService} from '@ngx-translate/core';
// jqwidgets
// app interfaces
import {
  CompanyDepartment, ContractType,
  OrgForm,
  SettingButtonPanel,
  SettingWinForEditForm,
  SourceForEditForm,
  SourceForJqxGrid
} from '../../interfaces';
// app services
// app components
import {EventWindowComponent} from '../event-window/event-window.component';
import {EditFormComponent} from '../edit-form/edit-form.component';
import {ButtonPanelComponent} from '../button-panel/button-panel.component';
import {JqxgridComponent} from '../jqxgrid/jqxgrid.component';


@Component({
  selector: 'app-simple-dictionary',
  templateUrl: './simple-dictionary.component.html',
  styleUrls: ['./simple-dictionary.component.css']
})
export class SimpleDictionaryComponent implements OnInit, AfterViewInit, OnDestroy {

  // variables from parent component
  @Input() typeDictionary: string;
  @Input() columnsGrid: any[];
  @Input() listBoxSource: any[];
  @Input() sourceForJqxGrid: SourceForJqxGrid;
  @Input() settingWinForEditForm: SettingWinForEditForm;
  @Input() sourceForEditForm: SourceForEditForm[];
  @Input() orgForms: OrgForm[];
  @Input() companies: CompanyDepartment[];
  @Input() contractTypes: ContractType[];

  // determine the functions that need to be performed in the parent component
  @Output() onGetSourceForJqxGrid = new EventEmitter<any>();
  @Output() onSaveEditFormBtn = new EventEmitter<any>();
  @Output() onOkEvenwinBtn = new EventEmitter<any>();

  // define variables - link to view objects
  @ViewChild('jqxgridComponent', {static: false}) jqxgridComponent: JqxgridComponent;
  @ViewChild('buttonPanel', {static: false}) buttonPanel: ButtonPanelComponent;
  @ViewChild('editForm', {static: false}) editForm: EditFormComponent;
  @ViewChild('eventWindow', {static: false}) eventWindow: EventWindowComponent;

  // other variables
  settingButtonPanel: SettingButtonPanel;
  loading = false;
  reloading = false;
  // main
  // grid
  selectItemId = 0;
  // filter
  // edit form
  isEditFormInit = false;
  typeEditWindow = '';
  // link form
  // event form
  warningEventWindow = '';
  actionEventWindow = '';

  constructor(
    // service
    public translate: TranslateService) {
  }

  ngOnInit() {
    // init button panel
    this.settingButtonPanel = {
      add: {
        visible: true,
        disabled: false,
      },
      upd: {
        visible: true,
        disabled: false,
      },
      del: {
        visible: true,
        disabled: false,
      },
      refresh: {
        visible: true,
        disabled: false,
      },
      setting: {
        visible: false,
        disabled: false,
      },
      filterList: {
        visible: false,
        disabled: false,
      },
      place: {
        visible: false,
        disabled: false,
      },
      pinDrop: {
        visible: false,
        disabled: false,
      },
      groupIn: {
        visible: false,
        disabled: false,
      },
      groupOut: {
        visible: false,
        disabled: false,
      },
      switchOn: {
        visible: false,
        disabled: false,
      },
      switchOff: {
        visible: false,
        disabled: false,
      }
    };
  }

  ngAfterViewInit() {

  }

  ngOnDestroy() {
    if (this.buttonPanel) {
      this.buttonPanel.destroy();
    }
    if (this.jqxgridComponent) {
      this.jqxgridComponent.destroyGrid();
    }
    if (this.editForm) {
      this.editForm.destroy();
    }
  }

  // GRID

  getSourceForJqxGrid() {

  }

  refreshGrid() {
    this.reloading = true;
    this.getAll();
    this.selectItemId = 0;
  }

  getAll() {
    this.onGetSourceForJqxGrid.emit(this.typeDictionary);
    this.jqxgridComponent.refresh_jqxgGrid();
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
      this.warningEventWindow = this.translate.instant('site.menu.dictionarys.upd-warning');
      this.eventWindow.openEventWindow();
    }
  }

  del() {
    if (!isUndefined(this.jqxgridComponent.selectRow)) {
      this.eventWindow.okButtonDisabled(false);
      this.actionEventWindow = 'del';
      this.warningEventWindow = this.translate.instant('site.menu.dictionarys.del-question')
        + this.jqxgridComponent.myGrid.getrowid(this.jqxgridComponent.myGrid.getselectedrowindex()) + '?';
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow = this.translate.instant('site.menu.dictionarys.del-warning');
    }
    this.eventWindow.openEventWindow();
  }

  refresh() {
    this.refreshGrid();
  }

  // FILTER

  // EDIT FORM

  saveEditFormBtn() {
    const saveEditwinObject = new Object();
    const selectObject = new Object();
    for (let i = 0; i < this.sourceForEditForm.length; i++) {
      selectObject[this.sourceForEditForm[i].nameField] =
        isNull(this.sourceForEditForm[i].selectCode) ? 0 : this.sourceForEditForm[i].selectCode;
    }
    if (this.typeEditWindow === 'upd') {
      selectObject['id'] = this.jqxgridComponent.selectRow.id;
    }
    saveEditwinObject['dictionaryType'] = this.typeDictionary;
    saveEditwinObject['typeEditWindow'] = this.typeEditWindow;
    saveEditwinObject['selectObject'] = selectObject;
    this.onSaveEditFormBtn.emit(saveEditwinObject);
  }

  getSourceForEditForm() {
    for (let i = 0; i < this.sourceForEditForm.length; i++) {
      if (this.typeEditWindow === 'ins') {
        this.sourceForEditForm[i].selectedIndex = 0;
        this.sourceForEditForm[i].selectId = '1';
        switch (this.sourceForEditForm[i].type) {
          case 'jqxTextArea':
            this.sourceForEditForm[i].selectCode = this.translate.instant('site.forms.editforms.empty');
            break;
          case 'jqxNumberInput':
            this.sourceForEditForm[i].selectCode = '0';
            break;
          default:
            this.sourceForEditForm[i].selectCode = '';
        }
      }

      if (this.typeEditWindow === 'upd') {
        this.sourceForEditForm[i].selectCode = this.jqxgridComponent.selectRow[this.sourceForEditForm[i].nameField];
      }

      switch (this.sourceForEditForm[i].nameField) {
        case 'geographs':
          if (this.typeEditWindow === 'ins') {
            this.sourceForEditForm[i].selectId = '1';
            this.sourceForEditForm[i].selectName = this.translate.instant('site.forms.editforms.withoutAddress');
          }
          if (this.typeEditWindow === 'upd') {
            this.sourceForEditForm[i].selectId = this.jqxgridComponent.selectRow.geographId.toString();
            this.sourceForEditForm[i].selectName = this.jqxgridComponent.selectRow.geographFullName;
          }
          break;
        case 'orgForms':
          this.sourceForEditForm[i].source = this.orgForms;
          if (this.typeEditWindow === 'ins') {
            this.sourceForEditForm[i].selectId = this.orgForms[0].id.toString();
            this.sourceForEditForm[i].selectCode = this.orgForms.find(
              (one: OrgForm) => one.id === +this.sourceForEditForm[i].selectId).code;
            this.sourceForEditForm[i].selectName = this.orgForms.find(
              (one: OrgForm) => one.id === +this.sourceForEditForm[i].selectId).name;
          }
          if (this.typeEditWindow === 'upd') {
            this.sourceForEditForm[i].selectId = this.jqxgridComponent.selectRow.orgFormId.toString();
            this.sourceForEditForm[i].selectCode = this.orgForms.find(
              (one: OrgForm) => one.id === +this.jqxgridComponent.selectRow.orgFormId).code;
            this.sourceForEditForm[i].selectName = this.orgForms.find(
              (one: OrgForm) => one.id === +this.jqxgridComponent.selectRow.orgFormId).name;
            for (let j = 0; j < this.orgForms.length; j++) {
              if (+this.orgForms[j].id === +this.jqxgridComponent.selectRow.orgFormId) {
                this.sourceForEditForm[i].selectedIndex = j;
                break;
              }
            }
          }
          break;
        case 'senders':
          this.sourceForEditForm[i].source = this.companies;
          if (this.typeEditWindow === 'ins') {
            this.sourceForEditForm[i].selectId = this.companies[0].id.toString();
            this.sourceForEditForm[i].selectCode = this.companies.find(
              (one: CompanyDepartment) => one.id === +this.sourceForEditForm[i].selectId).code;
            this.sourceForEditForm[i].selectName = this.companies.find(
              (one: CompanyDepartment) => one.id === +this.sourceForEditForm[i].selectId).name;
          }
          if (this.typeEditWindow === 'upd') {
            this.sourceForEditForm[i].selectId = this.jqxgridComponent.selectRow.senderId.toString();
            this.sourceForEditForm[i].selectCode = this.companies.find(
              (one: CompanyDepartment) => one.id === +this.jqxgridComponent.selectRow.senderId).code;
            this.sourceForEditForm[i].selectName = this.companies.find(
              (one: CompanyDepartment) => one.id === +this.jqxgridComponent.selectRow.senderId).name;
            for (let j = 0; j < this.companies.length; j++) {
              if (+this.companies[j].id === +this.jqxgridComponent.selectRow.senderId) {
                this.sourceForEditForm[i].selectedIndex = j;
                break;
              }
            }
          }
          break;
        case 'recipients':
          this.sourceForEditForm[i].source = this.companies;
          if (this.typeEditWindow === 'ins') {
            this.sourceForEditForm[i].selectId = this.companies[0].id.toString();
            this.sourceForEditForm[i].selectCode = this.companies.find(
              (one: CompanyDepartment) => one.id === +this.sourceForEditForm[i].selectId).code;
            this.sourceForEditForm[i].selectName = this.companies.find(
              (one: CompanyDepartment) => one.id === +this.sourceForEditForm[i].selectId).name;
          }
          if (this.typeEditWindow === 'upd') {
            this.sourceForEditForm[i].selectId = this.jqxgridComponent.selectRow.recipientId.toString();
            this.sourceForEditForm[i].selectCode = this.companies.find(
              (one: CompanyDepartment) => one.id === +this.jqxgridComponent.selectRow.recipientId).code;
            this.sourceForEditForm[i].selectName = this.companies.find(
              (one: CompanyDepartment) => one.id === +this.jqxgridComponent.selectRow.recipientId).name;
            for (let j = 0; j < this.companies.length; j++) {
              if (+this.companies[j].id === +this.jqxgridComponent.selectRow.recipientId) {
                this.sourceForEditForm[i].selectedIndex = j;
                break;
              }
            }
          }
          break;
        case 'contractTypes':
          this.sourceForEditForm[i].source = this.contractTypes;
          if (this.typeEditWindow === 'ins') {
            this.sourceForEditForm[i].selectId = this.contractTypes[0].id.toString();
            this.sourceForEditForm[i].selectCode = this.contractTypes.find(
              (one: CompanyDepartment) => one.id === +this.sourceForEditForm[i].selectId).code;
            this.sourceForEditForm[i].selectName = this.contractTypes.find(
              (one: CompanyDepartment) => one.id === +this.sourceForEditForm[i].selectId).name;
          }
          if (this.typeEditWindow === 'upd') {
            this.sourceForEditForm[i].selectId = this.jqxgridComponent.selectRow.contractTypeId.toString();
            this.sourceForEditForm[i].selectCode = this.contractTypes.find(
              (one: CompanyDepartment) => one.id === +this.jqxgridComponent.selectRow.contractTypeId).code;
            this.sourceForEditForm[i].selectName = this.contractTypes.find(
              (one: CompanyDepartment) => one.id === +this.jqxgridComponent.selectRow.contractTypeId).name;
            for (let j = 0; j < this.contractTypes.length; j++) {
              if (+this.contractTypes[j].id === +this.jqxgridComponent.selectRow.contractTypeId) {
                this.sourceForEditForm[i].selectedIndex = j;
                break;
              }
            }
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

  // EVENT FORM

  okEvenwinBtn() {
    const okEvenwinObject = new Object();
    const selectedrowindex = this.jqxgridComponent.myGrid.getselectedrowindex();
    const id = this.jqxgridComponent.myGrid.getrowid(selectedrowindex);
    okEvenwinObject['dictionaryType'] = this.typeDictionary;
    okEvenwinObject['actionEventWindow'] = 'del';
    okEvenwinObject['id'] = id;
    this.onOkEvenwinBtn.emit(okEvenwinObject);
  }

}
