// angular lib
import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {MatSnackBar} from '@angular/material/snack-bar';
// jqwidgets
// app interfaces
import {
  SettingWinForEditForm,
  SourceForEditForm,
  SourceForJqxGrid
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
  @Input() heightGrid: number;

  // determine the functions that need to be performed in the parent component

  // define variables - link to view objects
  @ViewChild('companies', {static: false}) companies: SimpleDictionaryComponent;
  @ViewChild('persons', {static: false}) persons: SimpleDictionaryComponent;
  @ViewChild('substations', {static: false}) substations: SimpleDictionaryComponent;

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

    this.getAll();
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

  getAll() {
    this.oSubCompanies = this.companyService.getAll().subscribe(items => {
      this.sourceForJqxGridCompanies.grid.source = items;
    });
    this.oSubPersons = this.personService.getAll().subscribe(items => {
      this.sourceForJqxGridPersons.grid.source = items;
    });
    this.oSubSubstations = this.substationService.getAll().subscribe(items => {
      this.sourceForJqxGridSubstations.grid.source = items;
    });
  }

  getSourceForJqxGrid(dictionaryType: any) {
    switch (dictionaryType) {
      case 'companies':
        this.oSubCompanies = this.companyService.getAll().subscribe(items => {
          this.sourceForJqxGridCompanies.grid.source = items;
          this.companies.loading = false;
          this.companies.reloading = false;
        });
        break;
      case 'persons':
        this.oSubPersons = this.personService.getAll().subscribe(items => {
          this.sourceForJqxGridPersons.grid.source = items;
          this.persons.loading = false;
          this.persons.reloading = false;
        });
        break;
      case 'substations':
        this.oSubSubstations = this.substationService.getAll().subscribe(items => {
          this.sourceForJqxGridSubstations.grid.source = items;
          this.substations.loading = false;
          this.substations.reloading = false;
        });
        break;
      default:
        break;
    }
  }

  getHeadline() {
    let headline: any;
    switch (this.router.url) {
      case '/dictionary/contragent/companies':
        headline = this.translate.instant('site.menu.dictionarys.contragent-page.company.companies-headline');
        break;
      case '/dictionary/contragent/persons':
        headline = this.translate.instant('site.menu.dictionarys.contragent-page.person.persons-headline');
        break;
      case '/dictionary/contragent/substations':
        headline = this.translate.instant('site.menu.dictionarys.contragent-page.substation.substations-headline');
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
        for (let i = 0; i < this.companies.editForm.sourceForEditForm.length; i++) {
          switch (this.companies.editForm.sourceForEditForm[i].nameField) {
            case 'geographs':
              selectObject.geographId = +this.companies.editForm.sourceForEditForm[i].selectId;
              selectObject.geographFullName = this.companies.editForm.sourceForEditForm[i].selectName;
              break;
            case 'orgForms':
              selectObject.orgFormId = +this.companies.editForm.sourceForEditForm[i].selectId;
              selectObject.orgFormCode = this.companies.editForm.sourceForEditForm[i].selectCode;
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
              this.companies.editForm.closeDestroy();
              // update data source
              this.companies.jqxgridComponent.refresh_ins(selectObject.id, selectObject);
            }
          );
        }
        if (saveEditwinObject.typeEditWindow === 'upd') {
          // definde param befor upd
          this.companies.jqxgridComponent.selectRow.geographId = selectObject.geographId;
          this.companies.jqxgridComponent.selectRow.geographFullName = selectObject.geographFullName;
          this.companies.jqxgridComponent.selectRow.orgFormId = selectObject.orgFormId;
          this.companies.jqxgridComponent.selectRow.orgFormCode = selectObject.orgFormCode;
          this.companies.jqxgridComponent.selectRow.code = selectObject.code;
          this.companies.jqxgridComponent.selectRow.name = selectObject.name;
          this.companies.jqxgridComponent.selectRow.inn = selectObject.inn;
          this.companies.jqxgridComponent.selectRow.comments = selectObject.comments;
          // upd
          this.oSubCompanies = this.companyService.upd(selectObject).subscribe(
            response => {
              this.openSnackBar(this.translate.instant('site.menu.dictionarys.contragent-page.company.upd')
                + this.companies.jqxgridComponent.selectRow.id, this.translate.instant('site.forms.editforms.ok'));
            },
            error =>
              this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok')),
            () => {
              // close edit window
              this.companies.editForm.closeDestroy();
              // update data source
              this.companies.jqxgridComponent.refresh_upd(selectObject.id, this.companies.jqxgridComponent.selectRow);
            }
          );
        }
        break;
      case 'persons':
        selectObject = saveEditwinObject.selectObject;
        for (let i = 0; i < this.persons.editForm.sourceForEditForm.length; i++) {
          switch (this.persons.editForm.sourceForEditForm[i].nameField) {
            case 'geographs':
              selectObject.geographId = +this.persons.editForm.sourceForEditForm[i].selectId;
              selectObject.geographFullName = this.persons.editForm.sourceForEditForm[i].selectName;
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
              this.persons.editForm.closeDestroy();
              // update data source
              this.persons.jqxgridComponent.refresh_ins(selectObject.id, selectObject);
            }
          );
        }
        if (saveEditwinObject.typeEditWindow === 'upd') {
          // definde param befor upd
          this.persons.jqxgridComponent.selectRow.geographId = selectObject.geographId;
          this.persons.jqxgridComponent.selectRow.geographFullName = selectObject.geographFullName;
          this.persons.jqxgridComponent.selectRow.code = selectObject.code;
          this.persons.jqxgridComponent.selectRow.nameFirst = selectObject.nameFirst;
          this.persons.jqxgridComponent.selectRow.nameSecond = selectObject.nameSecond;
          this.persons.jqxgridComponent.selectRow.nameThird = selectObject.nameThird;
          this.persons.jqxgridComponent.selectRow.inn = selectObject.inn;
          this.persons.jqxgridComponent.selectRow.comments = selectObject.comments;
          // upd
          this.oSubPersons = this.personService.upd(selectObject).subscribe(
            response => {
              this.openSnackBar(this.translate.instant('site.menu.dictionarys.contragent-page.person.upd')
                + this.persons.jqxgridComponent.selectRow.id, this.translate.instant('site.forms.editforms.ok'));
            },
            error =>
              this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok')),
            () => {
              // close edit window
              this.persons.editForm.closeDestroy();
              // update data source
              this.persons.jqxgridComponent.refresh_upd(
                this.persons.jqxgridComponent.selectRow.id, this.persons.jqxgridComponent.selectRow);
            }
          );
        }
        break;
      case 'substations':
        selectObject = saveEditwinObject.selectObject;
        for (let i = 0; i < this.substations.editForm.sourceForEditForm.length; i++) {
          switch (this.substations.editForm.sourceForEditForm[i].nameField) {
            case 'geographs':
              selectObject.geographId = +this.substations.editForm.sourceForEditForm[i].selectId;
              selectObject.geographFullName = this.substations.editForm.sourceForEditForm[i].selectName;
              break;
            case 'orgForms':
              selectObject.orgFormId = +this.substations.editForm.sourceForEditForm[i].selectId;
              selectObject.orgFormCode = this.substations.editForm.sourceForEditForm[i].selectCode;
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
              this.substations.editForm.closeDestroy();
              // update data source
              this.substations.jqxgridComponent.refresh_ins(selectObject.id, selectObject);
            }
          );
        }
        if (saveEditwinObject.typeEditWindow === 'upd') {
          // definde param befor upd
          this.substations.jqxgridComponent.selectRow.geographId = selectObject.geographId;
          this.substations.jqxgridComponent.selectRow.geographFullName = selectObject.geographFullName;
          this.substations.jqxgridComponent.selectRow.orgFormId = selectObject.orgFormId;
          this.substations.jqxgridComponent.selectRow.orgFormCode = selectObject.orgFormCode;
          this.substations.jqxgridComponent.selectRow.code = selectObject.code;
          this.substations.jqxgridComponent.selectRow.name = selectObject.name;
          this.substations.jqxgridComponent.selectRow.inn = selectObject.inn;
          this.substations.jqxgridComponent.selectRow.comments = selectObject.comments;
          this.substations.jqxgridComponent.selectRow.power = selectObject.power;
          // upd
          this.oSubSubstations = this.substationService.upd(selectObject).subscribe(
            response => {
              this.openSnackBar(this.translate.instant('site.menu.dictionarys.contragent-page.substation.upd')
                + this.substations.jqxgridComponent.selectRow.id, this.translate.instant('site.forms.editforms.ok'));
            },
            error =>
              this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok')),
            () => {
              // close edit window
              this.substations.editForm.closeDestroy();
              // update data source
              this.substations.jqxgridComponent.refresh_upd(
                this.substations.jqxgridComponent.selectRow.id, this.substations.jqxgridComponent.selectRow);
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
                this.companies.jqxgridComponent.refresh_del([+okEvenwinObject.id]);
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
                this.persons.jqxgridComponent.refresh_del([+okEvenwinObject.id]);
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
                this.substations.jqxgridComponent.refresh_del([+okEvenwinObject.id]);
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