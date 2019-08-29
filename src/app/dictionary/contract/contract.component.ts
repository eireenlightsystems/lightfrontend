// @ts-ignore
import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  CompanyDepartment,
  SettingWinForEditForm,
  SourceForEditForm,
  SourceForJqxGrid
} from '../../shared/interfaces';
import {Subscription} from 'rxjs';
import {SimpleDictionaryComponent} from '../../shared/components/simple-dictionary/simple-dictionary.component';
import {MaterializeService} from '../../shared/classes/materialize.service';
import {TranslateService} from '@ngx-translate/core';
import {CompanyService} from '../../shared/services/contragent/company.service';
import {ContractService} from '../../shared/services/contract/contract.service';
import {ContractTypeService} from '../../shared/services/contract/contractType.service';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.css']
})
export class ContractComponent implements OnInit, OnDestroy {

  // variables from master component
  @Input() heightGrid: number;

  // determine the functions that need to be performed in the parent component

  // define variables - link to view objects
  @ViewChild('contract', {static: false}) contracts: SimpleDictionaryComponent;
  @ViewChild('contractType', {static: false}) contractTypes: SimpleDictionaryComponent;

  // other variables
  dictionaryContracts = 'contracts';
  dictionaryContractTypes = 'contractTypes';

  companies: CompanyDepartment[];
  oSubСompanies: Subscription;

  // main

  // grid
  oSubContracts: Subscription;
  oSubContractTypes: Subscription;
  sourceForJqxGridContracts: SourceForJqxGrid;
  sourceForJqxGridContractTypes: SourceForJqxGrid;
  // filter

  // edit form
  settingWinForEditFormContracts: SettingWinForEditForm;
  settingWinForEditFormContractTypes: SettingWinForEditForm;
  sourceForEditFormContracts: SourceForEditForm[];
  sourceForEditFormContractTypes: SourceForEditForm[];

  // link form

  // event form

  constructor(private route: ActivatedRoute,
              private router: Router,
              // service
              public translate: TranslateService,
              private companyService: CompanyService,
              private contractTypeService: ContractTypeService,
              private contractService: ContractService) {
  }

  ngOnInit() {
    // CONTRACT

    // jqxgrid
    this.sourceForJqxGridContracts = {
      listbox: {
        source: [
          {label: 'Id', value: 'id', checked: true},
          {label: 'contractTypeId', value: 'contractTypeId', checked: false},
          {label: 'senderId', value: 'senderId', checked: false},
          {label: 'recipientId', value: 'recipientId', checked: false},
          {label: 'Тип контракта', value: 'contractTypeCode', checked: true},
          {label: 'Отправитель', value: 'senderCode', checked: true},
          {label: 'Получатель', value: 'recipientCode', checked: true},
          {label: 'Код', value: 'code', checked: true},
          {label: 'Наименование', value: 'name', checked: true},
          {label: 'Коментарий', value: 'comments', checked: true}
        ],
        theme: 'material',
        width: 150,
        height: this.heightGrid,
        checkboxes: true,
        filterable: true,
        allowDrag: true
      },
      grid: {
        source: [],
        columns: [
          {text: 'Id', datafield: 'id', width: 50},
          {text: 'contractTypeId', datafield: 'contractTypeId', width: 150, hidden: true},
          {text: 'senderId', datafield: 'senderId', width: 150, hidden: true},
          {text: 'recipientId', datafield: 'recipientId', width: 150, hidden: true},
          {text: 'Тип контракта', datafield: 'contractTypeCode', width: 150},
          {text: 'Отправитель', datafield: 'senderCode', width: 150},
          {text: 'Получатель', datafield: 'recipientCode', width: 150},
          {text: 'Код', datafield: 'code', width: 150},
          {text: 'Наименование', datafield: 'name', width: 150},
          {text: 'Коментарий', datafield: 'comments', width: 150}
        ],
        theme: 'material',
        width: null,
        height: this.heightGrid,
        columnsresize: true,
        sortable: true,
        filterable: true,
        altrows: true,
        selectionmode: 'singlerow',
        isMasterGrid: false,

        valueMember: 'id',
        sortcolumn: ['id'],
        sortdirection: 'asc',
        selectId: []
      }
    };

    // definde filter

    // definde window edit form
    this.settingWinForEditFormContracts = {
      code: 'editFormContract',
      name: this.translate.instant('site.forms.editforms.edit'),
      theme: 'material',
      isModal: true,
      modalOpacity: 0.3,
      width: 450,
      maxWidth: 450,
      minWidth: 450,
      height: 500,
      maxHeight: 500,
      minHeight: 500,
      coordX: 500,
      coordY: 65
    };

    // definde edit form
    this.sourceForEditFormContracts = [
      {
        nameField: 'contractTypes',
        type: 'jqxComboBox',
        source: [],
        theme: 'material',
        width: '285',
        height: '20',
        placeHolder: 'Тип контракта:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'senders',
        type: 'jqxComboBox',
        source: this.companies,
        theme: 'material',
        width: '285',
        height: '20',
        placeHolder: 'Отправитель:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'recipients',
        type: 'jqxComboBox',
        source: this.companies,
        theme: 'material',
        width: '285',
        height: '20',
        placeHolder: 'Получатель:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
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
        placeHolder: 'Наименоваие:',
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

    // CONTRACTTYPE

    // jqxgrid
    this.sourceForJqxGridContractTypes = {
      listbox: {
        source: [
          {label: 'Id', value: 'id', checked: true},
          {label: 'Код', value: 'code', checked: true},
          {label: 'Наименование', value: 'name', checked: true},
          {label: 'Коментарий', value: 'comments', checked: true}
        ],
        theme: 'material',
        width: 150,
        height: this.heightGrid,
        checkboxes: true,
        filterable: true,
        allowDrag: true
      },
      grid: {
        source: [],
        columns: [
          {text: 'Id', datafield: 'id', width: 50},
          {text: 'Код', datafield: 'code', width: 150},
          {text: 'Наименование', datafield: 'name', width: 150},
          {text: 'Коментарий', datafield: 'comments', width: 150}
        ],
        theme: 'material',
        width: null,
        height: this.heightGrid,
        columnsresize: true,
        sortable: true,
        filterable: true,
        altrows: true,
        selectionmode: 'singlerow',
        isMasterGrid: false,

        valueMember: 'id',
        sortcolumn: ['id'],
        sortdirection: 'asc',
        selectId: []
      }
    };

    // definde filter

    // definde window edit form
    this.settingWinForEditFormContractTypes = {
      code: 'editFormContractType',
      name: this.translate.instant('site.forms.editforms.edit'),
      theme: 'material',
      isModal: true,
      modalOpacity: 0.3,
      width: 450,
      maxWidth: 450,
      minWidth: 450,
      height: 340,
      maxHeight: 340,
      minHeight: 340,
      coordX: 500,
      coordY: 65
    };

    // definde edit form
    this.sourceForEditFormContractTypes = [
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
        placeHolder: 'Наименоваие:',
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

    this.getAll();

    this.fetch_refbook();
  }

  ngOnDestroy() {
    if (this.oSubContracts) {
      this.oSubContracts.unsubscribe();
    }
    if (this.oSubContractTypes) {
      this.oSubContractTypes.unsubscribe();
    }
    if (this.oSubСompanies) {
      this.oSubСompanies.unsubscribe();
    }
  }

  // GRID

  getAll() {
    this.oSubContracts = this.contractService.getAll().subscribe(items => {
      this.sourceForJqxGridContracts.grid.source = items;
    });
    this.oSubContractTypes = this.contractTypeService.getAll().subscribe(items => {
      this.sourceForJqxGridContractTypes.grid.source = items;
    });
  }

  fetch_refbook() {
    // refbook
    this.oSubСompanies = this.companyService.getAll().subscribe(companies => this.companies = companies);
  }

  getSourceForJqxGrid(dictionaryType: any) {
    switch (dictionaryType) {
      case 'contracts':
        this.oSubContracts = this.contractService.getAll().subscribe(items => {
          this.sourceForJqxGridContracts.grid.source = items;
          this.contracts.loading = false;
          this.contracts.reloading = false;
        });
        break;
      case 'contractTypes':
        this.oSubContractTypes = this.contractTypeService.getAll().subscribe(items => {
          this.sourceForJqxGridContractTypes.grid.source = items;
          this.contractTypes.loading = false;
          this.contractTypes.reloading = false;
        });
        break;
      default:
        break;
    }
  }

  getHeadline() {
    let headline: any;
    switch (this.router.url) {
      case '/dictionary/contract/contracts':
        headline = this.translate.instant('site.menu.dictionarys.contract-page.contract.contracts-headline');
        break;
      case '/dictionary/contract/contracts-types':
        headline = this.translate.instant('site.menu.dictionarys.contract-page.contracttype.contracttypes-headline');
        break;
      default:
        headline = this.translate.instant('site.menu.dictionarys.dictionarys-headline');
    }
    return headline;
  }

  saveEditwinBtn(saveEditwinObject: any) {
    let selectObject: any;
    switch (saveEditwinObject.dictionaryType) {
      case 'contracts':
        selectObject = saveEditwinObject.selectObject;
        for (let i = 0; i < this.sourceForEditFormContracts.length; i++) {
          switch (this.sourceForEditFormContracts[i].nameField) {
            case 'contractTypes':
              selectObject.contractTypeId = +this.sourceForEditFormContracts[i].selectId;
              selectObject.contractTypeCode = this.sourceForEditFormContracts[i].selectCode;
              break;
            case 'senders':
              selectObject.senderId = +this.sourceForEditFormContracts[i].selectId;
              selectObject.senderCode = this.sourceForEditFormContracts[i].selectCode;
              break;
            case 'recipients':
              selectObject.recipientId = +this.sourceForEditFormContracts[i].selectId;
              selectObject.recipientCode = this.sourceForEditFormContracts[i].selectCode;
              break;
            default:
              break;
          }
        }

        if (saveEditwinObject.typeEditWindow === 'ins') {
          // definde param before ins

          // ins
          this.oSubContracts = this.contractService.ins(selectObject).subscribe(
            response => {
              selectObject.id = +response;
              MaterializeService.toast(`Контракт c id = ${selectObject.id} был добавлен.`);
            },
            error => MaterializeService.toast(error.error.message),
            () => {
              // close edit window
              this.contracts.editWindow.closeDestroy();
              // update data source
              this.contracts.jqxgridComponent.refresh_ins(selectObject.id, selectObject);
              // refresh temp
              this.getSourceForJqxGrid(saveEditwinObject.dictionaryType);
            }
          );
        }
        if (saveEditwinObject.typeEditWindow === 'upd') {
          // definde param befor upd
          this.contracts.jqxgridComponent.selectRow.contractTypeId = selectObject.contractTypeId;
          this.contracts.jqxgridComponent.selectRow.contractTypeCode = selectObject.contractTypeCode;
          this.contracts.jqxgridComponent.selectRow.senderId = selectObject.senderId;
          this.contracts.jqxgridComponent.selectRow.senderCode = selectObject.senderCode;
          this.contracts.jqxgridComponent.selectRow.recipientId = selectObject.recipientId;
          this.contracts.jqxgridComponent.selectRow.recipientCode = selectObject.recipientCode;
          this.contracts.jqxgridComponent.selectRow.code = selectObject.code;
          this.contracts.jqxgridComponent.selectRow.name = selectObject.name;
          this.contracts.jqxgridComponent.selectRow.comments = selectObject.comments;

          // upd
          this.oSubContracts = this.contractService.upd(selectObject).subscribe(
            response => {
              MaterializeService.toast(`Контракт c id = ${selectObject.id} был обновлен.`);
            },
            error => MaterializeService.toast(error.error.message),
            () => {
              // close edit window
              this.contracts.editWindow.closeDestroy();
              // update data source
              this.contracts.jqxgridComponent.refresh_upd(selectObject.id, this.contracts.jqxgridComponent.selectRow);
            }
          );
        }
        break;
      case 'contractTypes':
        selectObject = saveEditwinObject.selectObject;
        if (saveEditwinObject.typeEditWindow === 'ins') {
          // definde param before ins

          // ins
          this.oSubContractTypes = this.contractTypeService.ins(selectObject).subscribe(
            response => {
              selectObject.id = +response;
              MaterializeService.toast(`Тип контракта c id = ${selectObject.id} был добавлен.`);
            },
            error => MaterializeService.toast(error.error.message),
            () => {
              // close edit window
              this.contractTypes.editWindow.closeDestroy();
              // update data source
              this.contractTypes.jqxgridComponent.refresh_ins(selectObject.id, selectObject);
              // refresh temp
              this.getSourceForJqxGrid(saveEditwinObject.dictionaryType);
            }
          );
        }
        if (saveEditwinObject.typeEditWindow === 'upd') {
          // definde param befor upd
          this.contractTypes.jqxgridComponent.selectRow.code = selectObject.code;
          this.contractTypes.jqxgridComponent.selectRow.name = selectObject.name;
          this.contractTypes.jqxgridComponent.selectRow.comments = selectObject.comments;

          // upd
          this.oSubContractTypes = this.contractTypeService.upd(selectObject).subscribe(
            response => {
              MaterializeService.toast(`Тип контракта c id = ${this.contractTypes.jqxgridComponent.selectRow.id} был обновлен.`);
            },
            error => MaterializeService.toast(error.error.message),
            () => {
              // close edit window
              this.contractTypes.editWindow.closeDestroy();
              // update data source
              this.contractTypes.jqxgridComponent.refresh_upd(
                this.contractTypes.jqxgridComponent.selectRow.id, this.contractTypes.jqxgridComponent.selectRow);
            }
          );
        }
        break;
      default:
        break;
    }
  }

  okEvenwinBtn(okEvenwinObject: any) {
    switch (okEvenwinObject.dictionaryType) {
      case 'contracts':
        if (okEvenwinObject.actionEventWindow === 'del') {
          if (+okEvenwinObject.id >= 0) {
            this.contractService.del(+okEvenwinObject.id).subscribe(
              response => {
                MaterializeService.toast('Контракт был удален!');
              },
              error => MaterializeService.toast(error.error.message),
              () => {
                this.contracts.jqxgridComponent.refresh_del([+okEvenwinObject.id]);
                // refresh temp
                this.getSourceForJqxGrid(okEvenwinObject.dictionaryType);
              }
            );
          }
        }
        break;
      case 'contractTypes':
        if (okEvenwinObject.actionEventWindow === 'del') {
          if (+okEvenwinObject.id >= 0) {
            this.contractTypeService.del(+okEvenwinObject.id).subscribe(
              response => {
                MaterializeService.toast('Тип контракта был удален!');
              },
              error => MaterializeService.toast(error.error.message),
              () => {
                this.contractTypes.jqxgridComponent.refresh_del([+okEvenwinObject.id]);
                // refresh temp
                this.getSourceForJqxGrid(okEvenwinObject.dictionaryType);
              }
            );
          }
        }
        break;
      default:
        break;
    }
  }

}
