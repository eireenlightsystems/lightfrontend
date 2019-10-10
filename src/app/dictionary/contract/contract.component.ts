// angular lib
import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {MatSnackBar} from '@angular/material/snack-bar';
// jqwidgets
// app interfaces
import {
  CompanyDepartment, Contract, ContractType, NavItem,
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
export class ContractComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  // variables from parent component
  @Input() siteMap: NavItem[];
  @Input() heightGrid: number;
  @Input() contracts: Contract[];
  @Input() contractTypes: ContractType[];
  @Input() companies: CompanyDepartment[];
  @Input() currentLang: string;

  // determine the functions that need to be performed in the parent component
  @Output() onGetContracts = new EventEmitter();
  @Output() onGetContractTypes = new EventEmitter();

  // define variables - link to view objects
  @ViewChild('contractSimpleDictionary', {static: false}) contractSimpleDictionary: SimpleDictionaryComponent;
  @ViewChild('contractTypeSimpleDictionary', {static: false}) contractTypeSimpleDictionary: SimpleDictionaryComponent;

  // other variables
  dictionaryContracts = 'contracts';
  dictionaryContractTypes = 'contractTypes';
  // main
  // grid
  oSubContracts: Subscription;
  oSubContractTypes: Subscription;
  sourceForJqxGridContracts: SourceForJqxGrid;
  sourceForJqxGridContractTypes: SourceForJqxGrid;
  columnsGridContracts: any[];
  listBoxSourceContracts: any[];
  columnsGridContractTypes: any[];
  listBoxSourceContractTypes: any[];
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
              private _snackBar: MatSnackBar,
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
    // CONTRACTTYPE
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
  }

  ngAfterViewInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.currentLang) {
      if (changes.currentLang.currentValue === 'ru') {
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
        // definde filter

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

      } else {
        // definde columns
        this.columnsGridContracts =
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
        this.listBoxSourceContracts =
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
        this.columnsGridContractTypes =
          [
            {text: 'Id', datafield: 'id', width: 50},
            {text: 'Code', datafield: 'code', width: 150},
            {text: 'Name', datafield: 'name', width: 150},
            {text: 'Comments', datafield: 'comments', width: 150}
          ];
        this.listBoxSourceContractTypes =
          [
            {label: 'Id', value: 'id', checked: true},
            {label: 'Code', value: 'code', checked: true},
            {label: 'Name', value: 'name', checked: true},
            {label: 'Comments', value: 'comments', checked: true}
          ];
        // definde filter

        // definde edit form
        this.sourceForEditFormContracts = [
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
        this.sourceForEditFormContractTypes = [
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

      }
    }
  }

  ngOnDestroy() {
    if (this.oSubContracts) {
      this.oSubContracts.unsubscribe();
    }
    if (this.oSubContractTypes) {
      this.oSubContractTypes.unsubscribe();
    }
  }

  // GRID

  getSourceForJqxGrid(dictionaryType: any) {
    switch (dictionaryType) {
      case 'contracts':
        this.onGetContracts.emit();
        this.contractSimpleDictionary.loading = false;
        this.contractSimpleDictionary.reloading = false;
        break;
      case 'contractTypes':
        this.onGetContractTypes.emit();
        this.contractTypeSimpleDictionary.loading = false;
        this.contractTypeSimpleDictionary.reloading = false;
        break;
      default:
        break;
    }
  }

  getHeadline() {
    let headline: any;
    switch (this.router.url) {
      case '/dictionary/contract/contracts':
        if (this.siteMap[1].children[2].children[0].disabled !== false) {
          headline = this.translate.instant('site.menu.administration.right-page.not-right');
        } else {
          headline = this.translate.instant('site.menu.dictionarys.contract-page.contract.contracts-headline');
        }
        break;
      case '/dictionary/contract/contracts-types':
        if (this.siteMap[1].children[2].children[1].disabled !== false) {
          headline = this.translate.instant('site.menu.administration.right-page.not-right');
        } else {
          headline = this.translate.instant('site.menu.dictionarys.contract-page.contracttype.contracttypes-headline');
        }
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
        for (let i = 0; i < this.contractSimpleDictionary.editForm.sourceForEditForm.length; i++) {
          switch (this.contractSimpleDictionary.editForm.sourceForEditForm[i].nameField) {
            case 'contractTypes':
              selectObject.contractTypeId = +this.contractSimpleDictionary.editForm.sourceForEditForm[i].selectId;
              selectObject.contractTypeCode = this.contractSimpleDictionary.editForm.sourceForEditForm[i].selectCode;
              break;
            case 'senders':
              selectObject.senderId = +this.contractSimpleDictionary.editForm.sourceForEditForm[i].selectId;
              selectObject.senderCode = this.contractSimpleDictionary.editForm.sourceForEditForm[i].selectCode;
              break;
            case 'recipients':
              selectObject.recipientId = +this.contractSimpleDictionary.editForm.sourceForEditForm[i].selectId;
              selectObject.recipientCode = this.contractSimpleDictionary.editForm.sourceForEditForm[i].selectCode;
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
            error => {
              this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok'));
              console.log(error.error.message);
            },
            () => {
              // close edit window
              this.contractSimpleDictionary.editForm.closeDestroy();
              // update data source
              this.contractSimpleDictionary.jqxgridComponent.refresh_ins(selectObject.id, selectObject);
              // refresh temp
              this.getSourceForJqxGrid(saveEditwinObject.dictionaryType);
            }
          );
        }
        if (saveEditwinObject.typeEditWindow === 'upd') {
          // definde param befor upd
          this.contractSimpleDictionary.jqxgridComponent.selectRow.contractTypeId = selectObject.contractTypeId;
          this.contractSimpleDictionary.jqxgridComponent.selectRow.contractTypeCode = selectObject.contractTypeCode;
          this.contractSimpleDictionary.jqxgridComponent.selectRow.senderId = selectObject.senderId;
          this.contractSimpleDictionary.jqxgridComponent.selectRow.senderCode = selectObject.senderCode;
          this.contractSimpleDictionary.jqxgridComponent.selectRow.recipientId = selectObject.recipientId;
          this.contractSimpleDictionary.jqxgridComponent.selectRow.recipientCode = selectObject.recipientCode;
          this.contractSimpleDictionary.jqxgridComponent.selectRow.code = selectObject.code;
          this.contractSimpleDictionary.jqxgridComponent.selectRow.name = selectObject.name;
          this.contractSimpleDictionary.jqxgridComponent.selectRow.comments = selectObject.comments;

          // upd
          this.oSubContracts = this.contractService.upd(selectObject).subscribe(
            response => {
              this.openSnackBar(this.translate.instant('site.menu.dictionarys.contract-page.contract.upd')
                + this.contractSimpleDictionary.jqxgridComponent.selectRow.id, this.translate.instant('site.forms.editforms.ok'));
            },
            error => {
              this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok'));
              console.log(error.error.message);
            },
            () => {
              // close edit window
              this.contractSimpleDictionary.editForm.closeDestroy();
              // update data source
              this.contractSimpleDictionary.jqxgridComponent.refresh_upd(selectObject.id,
                this.contractSimpleDictionary.jqxgridComponent.selectRow);
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
            error => {
              this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok'));
              console.log(error.error.message);
            },
            () => {
              // close edit window
              this.contractTypeSimpleDictionary.editForm.closeDestroy();
              // update data source
              this.contractTypeSimpleDictionary.jqxgridComponent.refresh_ins(selectObject.id, selectObject);
              // refresh temp
              this.getSourceForJqxGrid(saveEditwinObject.dictionaryType);
            }
          );
        }
        if (saveEditwinObject.typeEditWindow === 'upd') {
          // definde param befor upd
          this.contractTypeSimpleDictionary.jqxgridComponent.selectRow.code = selectObject.code;
          this.contractTypeSimpleDictionary.jqxgridComponent.selectRow.name = selectObject.name;
          this.contractTypeSimpleDictionary.jqxgridComponent.selectRow.comments = selectObject.comments;

          // upd
          this.oSubContractTypes = this.contractTypeService.upd(selectObject).subscribe(
            response => {
              this.openSnackBar(this.translate.instant('site.menu.dictionarys.contract-page.contracttype.upd')
                + this.contractTypeSimpleDictionary.jqxgridComponent.selectRow.id, this.translate.instant('site.forms.editforms.ok'));
            },
            error => {
              this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok'));
              console.log(error.error.message);
            },
            () => {
              // close edit window
              this.contractTypeSimpleDictionary.editForm.closeDestroy();
              // update data source
              this.contractTypeSimpleDictionary.jqxgridComponent.refresh_upd(
                this.contractTypeSimpleDictionary.jqxgridComponent.selectRow.id,
                this.contractTypeSimpleDictionary.jqxgridComponent.selectRow);
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
              error => {
                this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok'));
                console.log(error.error.message);
              },
              () => {
                this.contractSimpleDictionary.jqxgridComponent.refresh_del([+okEvenwinObject.id]);
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
              error => {
                this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok'));
                console.log(error.error.message);
              },
              () => {
                this.contractTypeSimpleDictionary.jqxgridComponent.refresh_del([+okEvenwinObject.id]);
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
