// angular lib
import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {MatSnackBar} from '@angular/material/snack-bar';
// jqwidgets
// app interfaces
import {
  CompanyDepartment, NavItem, Person,
  SettingWinForEditForm,
  SourceForEditForm,
  SourceForJqxGrid, Substation
} from '../../shared/interfaces';
// app services
import {PersonService} from '../../shared/services/contragent/person.service';
import {CompanyService} from '../../shared/services/contragent/company.service';
import {SubstationService} from '../../shared/services/contragent/substation.service';
import {GeographService} from '../../shared/services/geograph/geograph.service';
// app components
import {SimpleDictionaryComponent} from '../../shared/components/simple-dictionary/simple-dictionary.component';


@Component({
  selector: 'app-contragent',
  templateUrl: './contragent.component.html',
  styleUrls: ['./contragent.component.css']
})
export class ContragentComponent implements OnInit, OnDestroy {

  // variables from parent component
  @Input() siteMap: NavItem[];
  @Input() heightGrid: number;
  @Input() companies: CompanyDepartment[];
  @Input() persons: Person[];
  @Input() substations: Substation[];

  // determine the functions that need to be performed in the parent component
  @Output() onGetCompanies = new EventEmitter();
  @Output() onGetPersons = new EventEmitter();
  @Output() onGetSubstations = new EventEmitter();

  // define variables - link to view objects
  @ViewChild('companiesSimpleDictionary', {static: false}) companiesSimpleDictionary: SimpleDictionaryComponent;
  @ViewChild('personsSimpleDictionary', {static: false}) personsSimpleDictionary: SimpleDictionaryComponent;
  @ViewChild('substationsSimpleDictionary', {static: false}) substationsSimpleDictionary: SimpleDictionaryComponent;

  // other variables
  dictionaryCompanies = 'companies';
  dictionaryPersons = 'persons';
  dictionarySubstations = 'substations';
  orgForms: any;
  // main
  // grid
  oSubCompanies: Subscription;
  oSubPersons: Subscription;
  oSubSubstations: Subscription;
  sourceForJqxGridCompanies: SourceForJqxGrid;
  sourceForJqxGridPersons: SourceForJqxGrid;
  sourceForJqxGridSubstations: SourceForJqxGrid;
  columnsGridCompanies: any[];
  listBoxSourceCompanies: any[];
  columnsGridCompaniesEng: any[];
  listBoxSourceCompaniesEng: any[];
  columnsGridPersons: any[];
  listBoxSourcePersons: any[];
  columnsGridPersonsEng: any[];
  listBoxSourcePersonsEng: any[];
  columnsGridSubstations: any[];
  listBoxSourceSubstations: any[];
  columnsGridSubstationsEng: any[];
  listBoxSourceSubstationsEng: any[];
  // filter
  // edit form
  settingWinForEditFormCompanies: SettingWinForEditForm;
  settingWinForEditFormPersons: SettingWinForEditForm;
  settingWinForEditFormSubstations: SettingWinForEditForm;
  sourceForEditFormCompanies: SourceForEditForm[];
  sourceForEditFormPersons: SourceForEditForm[];
  sourceForEditFormSubstations: SourceForEditForm[];
  sourceForEditFormCompaniesEng: SourceForEditForm[];
  sourceForEditFormPersonsEng: SourceForEditForm[];
  sourceForEditFormSubstationsEng: SourceForEditForm[];
  // link form
  // event form


  constructor(private route: ActivatedRoute,
              private router: Router,
              private _snackBar: MatSnackBar,
              // service
              public translate: TranslateService,
              private geographService: GeographService,
              private companyService: CompanyService,
              private personService: PersonService,
              private substationService: SubstationService) {
  }

  ngOnInit() {
    this.orgForms = [
      {
        id: 1,
        code: ' пусто',
        name: ' пусто'
      },
      {
        id: 2,
        code: 'ООО',
        name: 'Общество с ограничеснной отвественностью'
      },
      {
        id: 3,
        code: 'АО',
        name: 'Акционерное общество'
      },
      {
        id: 4,
        code: 'ИП',
        name: 'Индивидуальный предприниматель'
      }
    ];
    // this.orgFormsEng = [
    //   {
    //     id: 1,
    //     code: this.translate.instant('site.forms.editforms.empty'),
    //     name: this.translate.instant('site.forms.editforms.empty')
    //   },
    //   {
    //     id: 2,
    //     code: 'LLC',
    //     name: 'Limited liability company'
    //   },
    //   {
    //     id: 3,
    //     code: 'JSC',
    //     name: 'Joint-Stock Company'
    //   },
    //   {
    //     id: 4,
    //     code: 'IE',
    //     name: 'Individual entrepreneur'
    //   }
    // ];

    // COMPANY
    // definde columns
    this.columnsGridCompanies =
      [
        {text: 'Id', datafield: 'id', width: 50},
        {text: 'geographId', datafield: 'geographId', width: 150, hidden: true},
        {text: 'Адрес', datafield: 'geographFullName', width: 400},
        {text: 'Код', datafield: 'code', width: 150},
        {text: 'Наименование', datafield: 'name', width: 150},
        {text: 'ИНН', datafield: 'inn', width: 150},
        {text: 'orgFormId', datafield: 'orgFormId', width: 150, hidden: true},
        {text: 'Организационная форма', datafield: 'orgFormCode', width: 150},
        {text: 'Коментарий', datafield: 'comments', width: 150}
      ];
    this.listBoxSourceCompanies =
      [
        {label: 'Id', value: 'id', checked: true},
        {label: 'geographId', value: 'geographId', checked: false},
        {label: 'Адрес', value: 'geographFullName', checked: true},
        {label: 'Код', value: 'code', checked: true},
        {label: 'Наименование', value: 'name', checked: true},
        {label: 'ИНН', value: 'inn', checked: true},
        {label: 'orgFormId', value: 'orgFormId', checked: false},
        {label: 'Организационная форма', value: 'orgFormCode', checked: true},
        {label: 'Коментарий', value: 'comments', checked: true}
      ];
    this.columnsGridCompaniesEng =
      [
        {text: 'Id', datafield: 'id', width: 50},
        {text: 'geographId', datafield: 'geographId', width: 150, hidden: true},
        {text: 'Address', datafield: 'geographFullName', width: 400},
        {text: 'Code', datafield: 'code', width: 150},
        {text: 'Name', datafield: 'name', width: 150},
        {text: 'INN', datafield: 'inn', width: 150},
        {text: 'orgFormId', datafield: 'orgFormId', width: 150, hidden: true},
        {text: 'Organizational form', datafield: 'orgFormCode', width: 150},
        {text: 'Comments', datafield: 'comments', width: 150}
      ];
    this.listBoxSourceCompaniesEng =
      [
        {label: 'Id', value: 'id', checked: true},
        {label: 'geographId', value: 'geographId', checked: false},
        {label: 'Address', value: 'geographFullName', checked: true},
        {label: 'Code', value: 'code', checked: true},
        {label: 'Name', value: 'name', checked: true},
        {label: 'INN', value: 'inn', checked: true},
        {label: 'orgFormId', value: 'orgFormId', checked: false},
        {label: 'Organizational form', value: 'orgFormCode', checked: true},
        {label: 'Comments', value: 'comments', checked: true}
      ];

    // jqxgrid
    this.sourceForJqxGridCompanies = {
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
    this.settingWinForEditFormCompanies = {
      code: 'editFormCompany',
      name: this.translate.instant('site.forms.editforms.edit'),
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
    this.sourceForEditFormCompanies = [
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
        selectName: 'без адрес'
      },

      {
        nameField: 'code',
        type: 'jqxTextArea',
        source: [],
        theme: 'material',
        width: '280',
        height: '40',
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
        height: '60',
        placeHolder: 'Наименоваие:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'inn',
        type: 'jqxTextArea',
        source: [],
        theme: 'material',
        width: '280',
        height: '20',
        placeHolder: 'ИНН:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'orgForms',
        type: 'jqxComboBox',
        source: this.orgForms,
        theme: 'material',
        width: '285',
        height: '20',
        placeHolder: 'Орг. форма:',
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
    this.sourceForEditFormCompaniesEng = [
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
        selectName: 'без адрес'
      },

      {
        nameField: 'code',
        type: 'jqxTextArea',
        source: [],
        theme: 'material',
        width: '280',
        height: '40',
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
        height: '60',
        placeHolder: 'Name:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'inn',
        type: 'jqxTextArea',
        source: [],
        theme: 'material',
        width: '280',
        height: '20',
        placeHolder: 'INN:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'orgForms',
        type: 'jqxComboBox',
        source: this.orgForms,
        theme: 'material',
        width: '285',
        height: '20',
        placeHolder: 'Organizational form:',
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

    // PERSON
    // definde columns
    this.columnsGridPersons =
      [
        {text: 'Id', datafield: 'id', width: 50},
        {text: 'geographId', datafield: 'geographId', width: 150, hidden: true},
        {text: 'Адрес', datafield: 'geographFullName', width: 400},
        {text: 'Код', datafield: 'code', width: 150},
        {text: 'ИНН', datafield: 'inn', width: 150},
        {text: 'Имя', datafield: 'nameFirst', width: 150},
        {text: 'Фамилия', datafield: 'nameSecond', width: 150},
        {text: 'Отчество', datafield: 'nameThird', width: 150},
        {text: 'Коментарий', datafield: 'comments', width: 150}
      ];
    this.listBoxSourcePersons =
      [
        {label: 'Id', value: 'id', checked: true},
        {label: 'geographId', value: 'geographId', checked: false},
        {label: 'Адрес', value: 'geographFullName', checked: true},
        {label: 'Код', value: 'code', checked: true},
        {label: 'ИНН', value: 'inn', checked: true},
        {label: 'Имя', value: 'nameFirst', checked: true},
        {label: 'Фамилия', value: 'nameSecond', checked: true},
        {label: 'Отчество', value: 'nameThird', checked: true},
        {label: 'Коментарий', value: 'comments', checked: true}
      ];
    this.columnsGridPersonsEng =
      [
        {text: 'Id', datafield: 'id', width: 50},
        {text: 'geographId', datafield: 'geographId', width: 150, hidden: true},
        {text: 'Address', datafield: 'geographFullName', width: 400},
        {text: 'Code', datafield: 'code', width: 150},
        {text: 'INN', datafield: 'inn', width: 150},
        {text: 'Second name', datafield: 'nameFirst', width: 150},
        {text: 'Second name', datafield: 'nameSecond', width: 150},
        {text: 'Third name', datafield: 'nameThird', width: 150},
        {text: 'Comments', datafield: 'comments', width: 150}
      ];
    this.listBoxSourcePersonsEng =
      [
        {label: 'Id', value: 'id', checked: true},
        {label: 'geographId', value: 'geographId', checked: false},
        {label: 'Address', value: 'geographFullName', checked: true},
        {label: 'Code', value: 'code', checked: true},
        {label: 'INN', value: 'inn', checked: true},
        {label: 'First name', value: 'nameFirst', checked: true},
        {label: 'Second name', value: 'nameSecond', checked: true},
        {label: 'Third name', value: 'nameThird', checked: true},
        {label: 'Comments', value: 'comments', checked: true}
      ];

    // jqxgrid
    this.sourceForJqxGridPersons = {
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
    this.settingWinForEditFormPersons = {
      code: 'editFormPerson',
      name: this.translate.instant('site.forms.editforms.edit'),
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
    this.sourceForEditFormPersons = [
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
        selectName: 'найти адрес'
      },
      {
        nameField: 'code',
        type: 'jqxTextArea',
        source: [],
        theme: 'material',
        width: '280',
        height: '20',
        placeHolder: 'код:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'inn',
        type: 'jqxTextArea',
        source: [],
        theme: 'material',
        width: '280',
        height: '20',
        placeHolder: 'ИНН:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'nameFirst',
        type: 'jqxTextArea',
        source: [],
        theme: 'material',
        width: '280',
        height: '20',
        placeHolder: 'Имя:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'nameSecond',
        type: 'jqxTextArea',
        source: [],
        theme: 'material',
        width: '280',
        height: '20',
        placeHolder: 'Фамилия:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'nameThird',
        type: 'jqxTextArea',
        source: [],
        theme: 'material',
        width: '280',
        height: '20',
        placeHolder: 'Отчество:',
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
    this.sourceForEditFormPersonsEng = [
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
        selectName: 'найти адрес'
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
        nameField: 'inn',
        type: 'jqxTextArea',
        source: [],
        theme: 'material',
        width: '280',
        height: '20',
        placeHolder: 'INN:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'nameFirst',
        type: 'jqxTextArea',
        source: [],
        theme: 'material',
        width: '280',
        height: '20',
        placeHolder: 'First name:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'nameSecond',
        type: 'jqxTextArea',
        source: [],
        theme: 'material',
        width: '280',
        height: '20',
        placeHolder: 'Second name:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'nameThird',
        type: 'jqxTextArea',
        source: [],
        theme: 'material',
        width: '280',
        height: '20',
        placeHolder: 'Third name:',
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

    // SUBSTATION
    // definde columns
    this.columnsGridSubstations =
      [
        {text: 'Id', datafield: 'id', width: 50},
        {text: 'geographId', datafield: 'geographId', width: 150, hidden: true},
        {text: 'Адрес', datafield: 'geographFullName', width: 400},
        {text: 'Код', datafield: 'code', width: 150},
        {text: 'Наименование', datafield: 'name', width: 150},
        {text: 'ИНН', datafield: 'inn', width: 150},
        {text: 'orgFormId', datafield: 'orgFormId', width: 150, hidden: true},
        {text: 'Организационная форма', datafield: 'orgFormCode', width: 150},
        {text: 'Мощность', datafield: 'power', width: 150},
        {text: 'Коментарий', datafield: 'comments', width: 150}
      ];
    this.listBoxSourceSubstations =
      [
        {label: 'Id', value: 'id', checked: true},
        {label: 'geographId', value: 'geographId', checked: false},
        {label: 'Адрес', value: 'geographFullName', checked: true},
        {label: 'Код', value: 'code', checked: true},
        {label: 'Наименование', value: 'name', checked: true},
        {label: 'ИНН', value: 'inn', checked: true},
        {label: 'orgFormId', value: 'orgFormId', checked: false},
        {label: 'Организационная форма', value: 'orgFormCode', checked: true},
        {label: 'Мощность', value: 'power', checked: true},
        {label: 'Коментарий', value: 'comments', checked: true}
      ];
    this.columnsGridSubstationsEng =
      [
        {text: 'Id', datafield: 'id', width: 50},
        {text: 'geographId', datafield: 'geographId', width: 150, hidden: true},
        {text: 'Address', datafield: 'geographFullName', width: 400},
        {text: 'Code', datafield: 'code', width: 150},
        {text: 'Name', datafield: 'name', width: 150},
        {text: 'INN', datafield: 'inn', width: 150},
        {text: 'orgFormId', datafield: 'orgFormId', width: 150, hidden: true},
        {text: 'Organizational form', datafield: 'orgFormCode', width: 150},
        {text: 'Power', datafield: 'power', width: 150},
        {text: 'Comments', datafield: 'comments', width: 150}
      ];
    this.listBoxSourceSubstationsEng =
      [
        {label: 'Id', value: 'id', checked: true},
        {label: 'geographId', value: 'geographId', checked: false},
        {label: 'Address', value: 'geographFullName', checked: true},
        {label: 'Code', value: 'code', checked: true},
        {label: 'Name', value: 'name', checked: true},
        {label: 'INN', value: 'inn', checked: true},
        {label: 'orgFormId', value: 'orgFormId', checked: false},
        {label: 'Organizational form', value: 'orgFormCode', checked: true},
        {label: 'Power', value: 'power', checked: true},
        {label: 'Comments', value: 'comments', checked: true}
      ];

    // jqxgrid
    this.sourceForJqxGridSubstations = {
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
    this.settingWinForEditFormSubstations = {
      code: 'editFormSubstation',
      name: this.translate.instant('site.forms.editforms.edit'),
      theme: 'material',
      isModal: true,
      modalOpacity: 0.3,
      width: 450,
      maxWidth: 450,
      minWidth: 450,
      height: 650,
      maxHeight: 650,
      minHeight: 650,
      coordX: 500,
      coordY: 65
    };
    this.sourceForEditFormSubstations = [
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
        selectName: 'найти адрес'
      },
      {
        nameField: 'code',
        type: 'jqxTextArea',
        source: [],
        theme: 'material',
        width: '280',
        height: '40',
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
        height: '60',
        placeHolder: 'Наименоваие:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'inn',
        type: 'jqxTextArea',
        source: [],
        theme: 'material',
        width: '280',
        height: '20',
        placeHolder: 'ИНН:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'orgForms',
        type: 'jqxComboBox',
        source: this.orgForms,
        theme: 'material',
        width: '285',
        height: '20',
        placeHolder: 'Орг. форма:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'power',
        type: 'jqxNumberInput',
        source: [],
        theme: 'material',
        width: '280',
        height: '20',
        placeHolder: 'Мощнось:',
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
    this.sourceForEditFormSubstationsEng = [
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
        selectName: 'найти адрес'
      },
      {
        nameField: 'code',
        type: 'jqxTextArea',
        source: [],
        theme: 'material',
        width: '280',
        height: '40',
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
        height: '60',
        placeHolder: 'Name:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'inn',
        type: 'jqxTextArea',
        source: [],
        theme: 'material',
        width: '280',
        height: '20',
        placeHolder: 'INN:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'orgForms',
        type: 'jqxComboBox',
        source: this.orgForms,
        theme: 'material',
        width: '285',
        height: '20',
        placeHolder: 'Organizational form:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'power',
        type: 'jqxNumberInput',
        source: [],
        theme: 'material',
        width: '280',
        height: '20',
        placeHolder: 'Power:',
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

  ngOnDestroy() {
    if (this.oSubCompanies) {
      this.oSubCompanies.unsubscribe();
    }
    if (this.oSubPersons) {
      this.oSubPersons.unsubscribe();
    }
    if (this.oSubSubstations) {
      this.oSubSubstations.unsubscribe();
    }
  }

  // GRID

  getSourceForJqxGrid(dictionaryType: any) {
    switch (dictionaryType) {
      case 'companies':
        this.onGetCompanies.emit();
        this.companiesSimpleDictionary.loading = false;
        this.companiesSimpleDictionary.reloading = false;
        break;
      case 'persons':
        this.onGetPersons.emit();
        this.personsSimpleDictionary.loading = false;
        this.personsSimpleDictionary.reloading = false;
        break;
      case 'substations':
        this.onGetSubstations.emit();
        this.substationsSimpleDictionary.loading = false;
        this.substationsSimpleDictionary.reloading = false;
        break;
      default:
        break;
    }
  }

  getHeadline() {
    let headline: any;
    switch (this.router.url) {
      case '/dictionary/contragent/companies':
        if (this.siteMap[1].children[1].children[0].disabled !== false) {
          headline = this.translate.instant('site.menu.administration.right-page.not-right');
        } else {
          headline = this.translate.instant('site.menu.dictionarys.contragent-page.company.companies-headline');
        }
        break;
      case '/dictionary/contragent/substations':
        if (this.siteMap[1].children[1].children[1].disabled !== false) {
          headline = this.translate.instant('site.menu.administration.right-page.not-right');
        } else {
          headline = this.translate.instant('site.menu.dictionarys.contragent-page.substation.substations-headline');
        }
        break;
      case '/dictionary/contragent/persons':
        if (this.siteMap[1].children[1].children[2].disabled !== false) {
          headline = this.translate.instant('site.menu.administration.right-page.not-right');
        } else {
          headline = this.translate.instant('site.menu.dictionarys.contragent-page.person.persons-headline');
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
      case 'companies':
        selectObject = saveEditwinObject.selectObject;
        for (let i = 0; i < this.companiesSimpleDictionary.editForm.sourceForEditForm.length; i++) {
          switch (this.companiesSimpleDictionary.editForm.sourceForEditForm[i].nameField) {
            case 'geographs':
              selectObject.geographId = +this.companiesSimpleDictionary.editForm.sourceForEditForm[i].selectId;
              selectObject.geographFullName = this.companiesSimpleDictionary.editForm.sourceForEditForm[i].selectName;
              break;
            case 'orgForms':
              selectObject.orgFormId = +this.companiesSimpleDictionary.editForm.sourceForEditForm[i].selectId;
              selectObject.orgFormCode = this.companiesSimpleDictionary.editForm.sourceForEditForm[i].selectCode;
              break;
            default:
              break;
          }
        }
        if (saveEditwinObject.typeEditWindow === 'ins') {
          // definde param before ins
          // ins
          this.oSubCompanies = this.companyService.ins(selectObject).subscribe(
            response => {
              selectObject.id = +response;
              this.openSnackBar(this.translate.instant('site.menu.dictionarys.contragent-page.company.ins')
                + selectObject.id, this.translate.instant('site.forms.editforms.ok'));
            },
            error =>
              this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok')),
            () => {
              // close edit window
              this.companiesSimpleDictionary.editForm.closeDestroy();
              // update data source
              this.companiesSimpleDictionary.jqxgridComponent.refresh_ins(selectObject.id, selectObject);
              // refresh temp
              this.getSourceForJqxGrid(saveEditwinObject.dictionaryType);
            }
          );
        }
        if (saveEditwinObject.typeEditWindow === 'upd') {
          // definde param befor upd
          this.companiesSimpleDictionary.jqxgridComponent.selectRow.geographId = selectObject.geographId;
          this.companiesSimpleDictionary.jqxgridComponent.selectRow.geographFullName = selectObject.geographFullName;
          this.companiesSimpleDictionary.jqxgridComponent.selectRow.orgFormId = selectObject.orgFormId;
          this.companiesSimpleDictionary.jqxgridComponent.selectRow.orgFormCode = selectObject.orgFormCode;
          this.companiesSimpleDictionary.jqxgridComponent.selectRow.code = selectObject.code;
          this.companiesSimpleDictionary.jqxgridComponent.selectRow.name = selectObject.name;
          this.companiesSimpleDictionary.jqxgridComponent.selectRow.inn = selectObject.inn;
          this.companiesSimpleDictionary.jqxgridComponent.selectRow.comments = selectObject.comments;
          // upd
          this.oSubCompanies = this.companyService.upd(selectObject).subscribe(
            response => {
              this.openSnackBar(this.translate.instant('site.menu.dictionarys.contragent-page.company.upd')
                + this.companiesSimpleDictionary.jqxgridComponent.selectRow.id, this.translate.instant('site.forms.editforms.ok'));
            },
            error =>
              this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok')),
            () => {
              // close edit window
              this.companiesSimpleDictionary.editForm.closeDestroy();
              // update data source
              this.companiesSimpleDictionary.jqxgridComponent.refresh_upd(selectObject.id,
                this.companiesSimpleDictionary.jqxgridComponent.selectRow);
            }
          );
        }
        break;
      case 'persons':
        selectObject = saveEditwinObject.selectObject;
        for (let i = 0; i < this.personsSimpleDictionary.editForm.sourceForEditForm.length; i++) {
          switch (this.personsSimpleDictionary.editForm.sourceForEditForm[i].nameField) {
            case 'geographs':
              selectObject.geographId = +this.personsSimpleDictionary.editForm.sourceForEditForm[i].selectId;
              selectObject.geographFullName = this.personsSimpleDictionary.editForm.sourceForEditForm[i].selectName;
              break;
            default:
              break;
          }
        }
        if (saveEditwinObject.typeEditWindow === 'ins') {
          // definde param before ins
          // ins
          this.oSubPersons = this.personService.ins(selectObject).subscribe(
            response => {
              selectObject.id = +response;
              this.openSnackBar(this.translate.instant('site.menu.dictionarys.contragent-page.person.ins')
                + selectObject.id, this.translate.instant('site.forms.editforms.ok'));
            },
            error =>
              this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok')),
            () => {
              // close edit window
              this.personsSimpleDictionary.editForm.closeDestroy();
              // update data source
              this.personsSimpleDictionary.jqxgridComponent.refresh_ins(selectObject.id, selectObject);
              // refresh temp
              this.getSourceForJqxGrid(saveEditwinObject.dictionaryType);
            }
          );
        }
        if (saveEditwinObject.typeEditWindow === 'upd') {
          // definde param befor upd
          this.personsSimpleDictionary.jqxgridComponent.selectRow.geographId = selectObject.geographId;
          this.personsSimpleDictionary.jqxgridComponent.selectRow.geographFullName = selectObject.geographFullName;
          this.personsSimpleDictionary.jqxgridComponent.selectRow.code = selectObject.code;
          this.personsSimpleDictionary.jqxgridComponent.selectRow.nameFirst = selectObject.nameFirst;
          this.personsSimpleDictionary.jqxgridComponent.selectRow.nameSecond = selectObject.nameSecond;
          this.personsSimpleDictionary.jqxgridComponent.selectRow.nameThird = selectObject.nameThird;
          this.personsSimpleDictionary.jqxgridComponent.selectRow.inn = selectObject.inn;
          this.personsSimpleDictionary.jqxgridComponent.selectRow.comments = selectObject.comments;
          // upd
          this.oSubPersons = this.personService.upd(selectObject).subscribe(
            response => {
              this.openSnackBar(this.translate.instant('site.menu.dictionarys.contragent-page.person.upd')
                + this.personsSimpleDictionary.jqxgridComponent.selectRow.id, this.translate.instant('site.forms.editforms.ok'));
            },
            error =>
              this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok')),
            () => {
              // close edit window
              this.personsSimpleDictionary.editForm.closeDestroy();
              // update data source
              this.personsSimpleDictionary.jqxgridComponent.refresh_upd(
                this.personsSimpleDictionary.jqxgridComponent.selectRow.id, this.personsSimpleDictionary.jqxgridComponent.selectRow);
            }
          );
        }
        break;
      case 'substations':
        selectObject = saveEditwinObject.selectObject;
        for (let i = 0; i < this.substationsSimpleDictionary.editForm.sourceForEditForm.length; i++) {
          switch (this.substationsSimpleDictionary.editForm.sourceForEditForm[i].nameField) {
            case 'geographs':
              selectObject.geographId = +this.substationsSimpleDictionary.editForm.sourceForEditForm[i].selectId;
              selectObject.geographFullName = this.substationsSimpleDictionary.editForm.sourceForEditForm[i].selectName;
              break;
            case 'orgForms':
              selectObject.orgFormId = +this.substationsSimpleDictionary.editForm.sourceForEditForm[i].selectId;
              selectObject.orgFormCode = this.substationsSimpleDictionary.editForm.sourceForEditForm[i].selectCode;
              break;
            default:
              break;
          }
        }
        if (saveEditwinObject.typeEditWindow === 'ins') {
          // definde param before ins
          // ins
          this.oSubSubstations = this.substationService.ins(selectObject).subscribe(
            response => {
              selectObject.id = +response;
              this.openSnackBar(this.translate.instant('site.menu.dictionarys.contragent-page.substation.ins')
                + selectObject.id, this.translate.instant('site.forms.editforms.ok'));
            },
            error =>
              this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok')),
            () => {
              // close edit window
              this.substationsSimpleDictionary.editForm.closeDestroy();
              // update data source
              this.substationsSimpleDictionary.jqxgridComponent.refresh_ins(selectObject.id, selectObject);
              // refresh temp
              this.getSourceForJqxGrid(saveEditwinObject.dictionaryType);
            }
          );
        }
        if (saveEditwinObject.typeEditWindow === 'upd') {
          // definde param befor upd
          this.substationsSimpleDictionary.jqxgridComponent.selectRow.geographId = selectObject.geographId;
          this.substationsSimpleDictionary.jqxgridComponent.selectRow.geographFullName = selectObject.geographFullName;
          this.substationsSimpleDictionary.jqxgridComponent.selectRow.orgFormId = selectObject.orgFormId;
          this.substationsSimpleDictionary.jqxgridComponent.selectRow.orgFormCode = selectObject.orgFormCode;
          this.substationsSimpleDictionary.jqxgridComponent.selectRow.code = selectObject.code;
          this.substationsSimpleDictionary.jqxgridComponent.selectRow.name = selectObject.name;
          this.substationsSimpleDictionary.jqxgridComponent.selectRow.inn = selectObject.inn;
          this.substationsSimpleDictionary.jqxgridComponent.selectRow.comments = selectObject.comments;
          this.substationsSimpleDictionary.jqxgridComponent.selectRow.power = selectObject.power;
          // upd
          this.oSubSubstations = this.substationService.upd(selectObject).subscribe(
            response => {
              this.openSnackBar(this.translate.instant('site.menu.dictionarys.contragent-page.substation.upd')
                + this.substationsSimpleDictionary.jqxgridComponent.selectRow.id, this.translate.instant('site.forms.editforms.ok'));
            },
            error =>
              this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok')),
            () => {
              // close edit window
              this.substationsSimpleDictionary.editForm.closeDestroy();
              // update data source
              this.substationsSimpleDictionary.jqxgridComponent.refresh_upd(
                this.substationsSimpleDictionary.jqxgridComponent.selectRow.id,
                this.substationsSimpleDictionary.jqxgridComponent.selectRow);
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
      case 'companies':
        if (okEvenwinObject.actionEventWindow === 'del') {
          if (+okEvenwinObject.id >= 0) {
            this.companyService.del(+okEvenwinObject.id).subscribe(
              response => {
                this.openSnackBar(this.translate.instant('site.menu.dictionarys.contragent-page.company.del'),
                  this.translate.instant('site.forms.editforms.ok'));
              },
              error =>
                this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok')),
              () => {
                this.companiesSimpleDictionary.jqxgridComponent.refresh_del([+okEvenwinObject.id]);
                // refresh temp
                this.getSourceForJqxGrid(okEvenwinObject.dictionaryType);
              }
            );
          }
        }
        break;
      case 'persons':
        if (okEvenwinObject.actionEventWindow === 'del') {
          if (+okEvenwinObject.id >= 0) {
            this.personService.del(+okEvenwinObject.id).subscribe(
              response => {
                this.openSnackBar(this.translate.instant('site.menu.dictionarys.contragent-page.person.del'),
                  this.translate.instant('site.forms.editforms.ok'));
              },
              error =>
                this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok')),
              () => {
                this.personsSimpleDictionary.jqxgridComponent.refresh_del([+okEvenwinObject.id]);
                // refresh temp
                this.getSourceForJqxGrid(okEvenwinObject.dictionaryType);
              }
            );
          }
        }
        break;
      case 'substations':
        if (okEvenwinObject.actionEventWindow === 'del') {
          if (+okEvenwinObject.id >= 0) {
            this.substationService.del(+okEvenwinObject.id).subscribe(
              response => {
                this.openSnackBar(this.translate.instant('site.menu.dictionarys.contragent-page.substation.del'),
                  this.translate.instant('site.forms.editforms.ok'));
              },
              error =>
                this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok')),
              () => {
                this.substationsSimpleDictionary.jqxgridComponent.refresh_del([+okEvenwinObject.id]);
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
