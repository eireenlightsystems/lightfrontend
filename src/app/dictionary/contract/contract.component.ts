// angular lib
import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {MatSnackBar} from '@angular/material/snack-bar';
// jqwidgets
// app interfaces
import {
  CompanyDepartment,
  SettingWinForEditForm,
  SourceForEditForm,
  SourceForJqxGrid
} from '../../shared/interfaces';
// app services
import {CompanyService} from '../../shared/services/contragent/company.service';
import {ContractService} from '../../shared/services/contract/contract.service';
import {ContractTypeService} from '../../shared/services/contract/contractType.service';
// app components
import {SimpleDictionaryComponent} from '../../shared/components/simple-dictionary/simple-dictionary.component';


@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.css']
})
export class ContractComponent implements OnInit, OnDestroy {

  // variables from parent component
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
  columnsGridContracts: any[];
  listBoxSourceContracts: any[];
  columnsGridContractsEng: any[];
  listBoxSourceContractsEng: any[];
  columnsGridContractTypes: any[];
  listBoxSourceContractTypes: any[];
  columnsGridContractTypesEng: any[];
  listBoxSourceContractTypesEng: any[];
  // filter
  // edit form
  settingWinForEditFormContracts: SettingWinForEditForm;
  settingWinForEditFormContractTypes: SettingWinForEditForm;
  sourceForEditFormContracts: SourceForEditForm[];
  sourceForEditFormContractTypes: SourceForEditForm[];
  sourceForEditFormContractsEng: SourceForEditForm[];
  sourceForEditFormContractTypesEng: SourceForEditForm[];
  // link form
  // event form

  constructor(private route: ActivatedRoute,
              private router: Router,
              private _snackBar: MatSnackBar,
              // service
              public translate: TranslateService,
              private companyService: CompanyService,
              private contractTypeService: ContractTypeService,
              private contractService: ContractService) {
  }

  ngOnInit() {
    // CONTRACT
    // definde columns
    this.columnsGridContracts =
      [
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
      ];
    this.listBoxSourceContracts =
      [
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
      ];
    this.columnsGridContractsEng =
      [
        {text: 'Id', datafield: 'id', width: 50},
        {text: 'contractTypeId', datafield: 'contractTypeId', width: 150, hidden: true},
        {text: 'senderId', datafield: 'senderId', width: 150, hidden: true},
        {text: 'recipientId', datafield: 'recipientId', width: 150, hidden: true},
        {text: 'Contract type', datafield: 'contractTypeCode', width: 150},
        {text: 'Sender', datafield: 'senderCode', width: 150},
        {text: 'Recipient', datafield: 'recipientCode', width: 150},
        {text: 'Code', datafield: 'code', width: 150},
        {text: 'Name', datafield: 'name', width: 150},
        {text: 'Comments', datafield: 'comments', width: 150}
      ];
    this.listBoxSourceContractsEng =
      [
        {label: 'Id', value: 'id', checked: true},
        {label: 'contractTypeId', value: 'contractTypeId', checked: false},
        {label: 'senderId', value: 'senderId', checked: false},
        {label: 'recipientId', value: 'recipientId', checked: false},
        {label: 'Contract type', value: 'contractTypeCode', checked: true},
        {label: 'Sender', value: 'senderCode', checked: true},
        {label: 'Recipient', value: 'recipientCode', checked: true},
        {label: 'Code', value: 'code', checked: true},
        {label: 'Name', value: 'name', checked: true},
        {label: 'Comments', value: 'comments', checked: true}
      ];

    // jqxgrid
    this.sourceForJqxGridContracts = {
      listbox: {
        theme: 'material',
        width: 150,
        height: this.heightGrid,
        checkboxes: true,
        filterable: true,
        allowDrag: true
      },
      grid: {
        source: [],
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

    // definde edit form
    this.settingWinForEditFormContracts = {
      code: 'editFormContract',
      name: this.translate.instant('site.forms.editforms.edit'),
      theme: 'material',
      isModal: true,
      modalOpacity: 0.3,
      width: 450,
      maxWidth: 450,
      minWidth: 450,
      height: 510,
      maxHeight: 510,
      minHeight: 510,
      coordX: 500,
      coordY: 65
    };
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
    this.sourceForEditFormContractsEng = [
      {
        nameField: 'contractTypes',
        type: 'jqxComboBox',
        source: [],
        theme: 'material',
        width: '285',
        height: '20',
        placeHolder: 'Contract type:',
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
        placeHolder: 'Sender:',
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
        placeHolder: 'Recipient:',
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
        placeHolder: 'Code:',
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
        placeHolder: 'Name:',
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

    // definde link form

    // CONTRACTTYPE
    // definde columns
    this.columnsGridContractTypes =
      [
        {text: 'Id', datafield: 'id', width: 50},
        {text: 'Код', datafield: 'code', width: 150},
        {text: 'Наименование', datafield: 'name', width: 150},
        {text: 'Коментарий', datafield: 'comments', width: 150}
      ];
    this.listBoxSourceContractTypes =
      [
        {label: 'Id', value: 'id', checked: true},
        {label: 'Код', value: 'code', checked: true},
        {label: 'Наименование', value: 'name', checked: true},
        {label: 'Коментарий', value: 'comments', checked: true}
      ];
    this.columnsGridContractTypesEng =
      [
        {text: 'Id', datafield: 'id', width: 50},
        {text: 'Code', datafield: 'code', width: 150},
        {text: 'Name', datafield: 'name', width: 150},
        {text: 'Comments', datafield: 'comments', width: 150}
      ];
    this.listBoxSourceContractTypesEng =
      [
        {label: 'Id', value: 'id', checked: true},
        {label: 'Code', value: 'code', checked: true},
        {label: 'Name', value: 'name', checked: true},
        {label: 'Comments', value: 'comments', checked: true}
      ];

    // jqxgrid
    this.sourceForJqxGridContractTypes = {
      listbox: {
        theme: 'material',
        width: 150,
        height: this.heightGrid,
        checkboxes: true,
        filterable: true,
        allowDrag: true
      },
      grid: {
        source: [],
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

    // definde edit form
    this.settingWinForEditFormContractTypes = {
      code: 'editFormContractType',
      name: this.translate.instant('site.forms.editforms.edit'),
      theme: 'material',
      isModal: true,
      modalOpacity: 0.3,
      width: 450,
      maxWidth: 450,
      minWidth: 450,
      height: 350,
      maxHeight: 350,
      minHeight: 350,
      coordX: 500,
      coordY: 65
    };
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
    this.sourceForEditFormContractTypesEng = [
      {
        nameField: 'code',
        type: 'jqxTextArea',
        source: [],
        theme: 'material',
        width: '280',
        height: '20',
        placeHolder: 'Code:',
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
        placeHolder: 'Name:',
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
        break;
    }
    return headline;
  }

  // EDIT FORM

  saveEditFormBtn(saveEditwinObject: any) {
    let selectObject: any;
    switch (saveEditwinObject.dictionaryType) {
      case 'contracts':
        selectObject = saveEditwinObject.selectObject;
        for (let i = 0; i < this.contracts.editForm.sourceForEditForm.length; i++) {
          switch (this.contracts.editForm.sourceForEditForm[i].nameField) {
            case 'contractTypes':
              selectObject.contractTypeId = +this.contracts.editForm.sourceForEditForm[i].selectId;
              selectObject.contractTypeCode = this.contracts.editForm.sourceForEditForm[i].selectCode;
              break;
            case 'senders':
              selectObject.senderId = +this.contracts.editForm.sourceForEditForm[i].selectId;
              selectObject.senderCode = this.contracts.editForm.sourceForEditForm[i].selectCode;
              break;
            case 'recipients':
              selectObject.recipientId = +this.contracts.editForm.sourceForEditForm[i].selectId;
              selectObject.recipientCode = this.contracts.editForm.sourceForEditForm[i].selectCode;
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
              this.openSnackBar(this.translate.instant('site.menu.dictionarys.contract-page.contract.ins')
                + selectObject.id, this.translate.instant('site.forms.editforms.ok'));
            },
            error =>
              this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok')),
            () => {
              // close edit window
              this.contracts.editForm.closeDestroy();
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
              this.openSnackBar(this.translate.instant('site.menu.dictionarys.contract-page.contract.upd')
                + this.contracts.jqxgridComponent.selectRow.id, this.translate.instant('site.forms.editforms.ok'));
            },
            error =>
              this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok')),
            () => {
              // close edit window
              this.contracts.editForm.closeDestroy();
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
              this.openSnackBar(this.translate.instant('site.menu.dictionarys.contract-page.contracttype.ins')
                + selectObject.id, this.translate.instant('site.forms.editforms.ok'));
            },
            error =>
              this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok')),
            () => {
              // close edit window
              this.contractTypes.editForm.closeDestroy();
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
              this.openSnackBar(this.translate.instant('site.menu.dictionarys.contract-page.contracttype.upd')
                + this.contractTypes.jqxgridComponent.selectRow.id, this.translate.instant('site.forms.editforms.ok'));
            },
            error =>
              this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok')),
            () => {
              // close edit window
              this.contractTypes.editForm.closeDestroy();
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

  // LINK FORM

  // EVENT FORM

  okEvenwinBtn(okEvenwinObject: any) {
    switch (okEvenwinObject.dictionaryType) {
      case 'contracts':
        if (okEvenwinObject.actionEventWindow === 'del') {
          if (+okEvenwinObject.id >= 0) {
            this.contractService.del(+okEvenwinObject.id).subscribe(
              response => {
                this.openSnackBar(this.translate.instant('site.menu.dictionarys.contract-page.contract.del'),
                  this.translate.instant('site.forms.editforms.ok'));
              },
              error =>
                this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok')),
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
                this.openSnackBar(this.translate.instant('site.menu.dictionarys.contract-page.contracttype.del'),
                  this.translate.instant('site.forms.editforms.ok'));
              },
              error =>
                this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok')),
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

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }
}