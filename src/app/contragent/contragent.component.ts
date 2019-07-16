import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
// import {DadataConfig, DadataType} from '@kolkov/ngx-dadata';

import {
  Geograph,
  SettingWinForEditForm,
  SourceForEditForm,
  SourceForJqxGrid
} from '../shared/interfaces';
import {Subscription} from 'rxjs';
import {SimpleHandbookComponent} from '../shared/components/simple-handbook/simple-handbook.component';
import {MaterialService} from '../shared/classes/material.service';
import {TranslateService} from '@ngx-translate/core';
import {PersonService} from '../shared/services/contragent/person.service';
import {CompanyService} from '../shared/services/contragent/company.service';
import {SubstationService} from '../shared/services/contragent/substation.service';
import {GeographService} from '../shared/services/geograph/geograph.service';


@Component({
  selector: 'app-contragent',
  templateUrl: './contragent.component.html',
  styleUrls: ['./contragent.component.css']
})
export class ContragentComponent implements OnInit, OnDestroy {

  // variables from master component
  // @Input() geographs: Geograph[];

  // determine the functions that need to be performed in the parent component

  // define variables - link to view objects
  @ViewChild('companies') companies: SimpleHandbookComponent;
  @ViewChild('persons') persons: SimpleHandbookComponent;
  @ViewChild('substations') substations: SimpleHandbookComponent;

  // other variables
  handBookCompanies = 'companies';
  handBookPersons = 'persons';
  handBookSubstations = 'substations';
  geographs: Geograph[];
  geographSub: Subscription;
  orgForms = [
    {
      id: 1,
      code: 'Пусто',
      name: 'Пусто'
    },
    {
      id: 2,
      code: 'ООО',
      name: 'Общество с ограничеснной отвественностью'
    }
  ];
  // main
  // config: DadataConfig = {
  //   apiKey: '1c499d931fc4823b6f940adeb0e5d50cf4e4b792',
  //   type: DadataType.address
  // };

  // grid
  oSubCompanies: Subscription;
  oSubPersons: Subscription;
  oSubSubstations: Subscription;
  sourceForJqxGridCompanies: SourceForJqxGrid;
  sourceForJqxGridPersons: SourceForJqxGrid;
  sourceForJqxGridSubstations: SourceForJqxGrid;
  // filter

  // edit form
  settingWinForEditFormCompanies: SettingWinForEditForm;
  settingWinForEditFormPersons: SettingWinForEditForm;
  settingWinForEditFormSubstations: SettingWinForEditForm;
  sourceForEditFormCompanies: SourceForEditForm[];
  sourceForEditFormPersons: SourceForEditForm[];
  sourceForEditFormSubstations: SourceForEditForm[];

  // link form

  // event form

  constructor(private route: ActivatedRoute,
              private router: Router,
              // service
              private geographService: GeographService,
              public translate: TranslateService,
              private companyService: CompanyService,
              private personService: PersonService,
              private substationService: SubstationService) {
  }

  ngOnInit() {
    // COMPANY

    // jqxgrid
    this.sourceForJqxGridCompanies = {
      listbox: {
        source: [
          {label: 'Id', value: 'id', checked: true},
          {label: 'geographId', value: 'geographId', checked: true},
          {label: 'Адрес', value: 'geographCode', checked: true},
          {label: 'Код', value: 'code', checked: true},
          {label: 'Наименование', value: 'name', checked: true},
          {label: 'ИНН', value: 'inn', checked: true},
          {label: 'orgFormId', value: 'orgFormId', checked: true},
          {label: 'Организационная форма', value: 'orgFormCode', checked: true},
          {label: 'Коментарий', value: 'comments', checked: true}
        ],
        theme: 'material',
        width: 150,
        height: null,
        checkboxes: true,
        filterable: true,
        allowDrag: true
      },
      grid: {
        source: [],
        columns: [
          {text: 'Id', datafield: 'id', width: 50},
          {text: 'geographId', datafield: 'geographId', width: 150},
          {text: 'Адрес', datafield: 'geographCode', width: 150},
          {text: 'Код', datafield: 'code', width: 150},
          {text: 'Наименование', datafield: 'name', width: 150},
          {text: 'ИНН', datafield: 'inn', width: 150},
          {text: 'orgFormId', datafield: 'orgFormId', width: 150},
          {text: 'Организационная форма', datafield: 'orgFormCode', width: 150},
          {text: 'Коментарий', datafield: 'comments', width: 150}
        ],
        theme: 'material',
        width: null,
        height: null,
        columnsresize: true,
        sortable: true,
        filterable: true,
        altrows: true,
        selectionmode: '',
        isMasterGrid: false,

        valueMember: 'id',
        sortcolumn: ['id'],
        sortdirection: 'asc',
        selectId: []
      }
    };

    // definde filter

    // definde window edit form
    this.settingWinForEditFormCompanies = {
      code: 'editFormCompany',
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
    this.sourceForEditFormCompanies = [
      {
        nameField: 'geographs',
        type: 'jqxComboBox',
        source: this.geographs,
        theme: 'material',
        width: '285',
        height: '20',
        placeHolder: 'Геогр. понятие:',
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

    // definde link form

    // PERSON

    // jqxgrid
    this.sourceForJqxGridPersons = {
      listbox: {
        source: [
          {label: 'Id', value: 'id', checked: true},
          {label: 'geographId', value: 'geographId', checked: true},
          {label: 'Адрес', value: 'geographCode', checked: true},
          {label: 'Код', value: 'code', checked: true},
          {label: 'ИНН', value: 'inn', checked: true},
          {label: 'Имя', value: 'nameFirst', checked: true},
          {label: 'Фамилия', value: 'nameSecond', checked: true},
          {label: 'Отчество', value: 'nameThird', checked: true},
          {label: 'Коментарий', value: 'comments', checked: true}
        ],
        theme: 'material',
        width: 150,
        height: null,
        checkboxes: true,
        filterable: true,
        allowDrag: true
      },
      grid: {
        source: [],
        columns: [
          {text: 'Id', datafield: 'id', width: 50},
          {text: 'geographId', datafield: 'geographId', width: 150},
          {text: 'Адрес', datafield: 'geographCode', width: 150},
          {text: 'Код', datafield: 'code', width: 150},
          {text: 'ИНН', datafield: 'inn', width: 150},
          {text: 'Имя', datafield: 'nameFirst', width: 150},
          {text: 'Фамилия', datafield: 'nameSecond', width: 150},
          {text: 'Отчество', datafield: 'nameThird', width: 150},
          {text: 'Коментарий', datafield: 'comments', width: 150}
        ],
        theme: 'material',
        width: null,
        height: null,
        columnsresize: true,
        sortable: true,
        filterable: true,
        altrows: true,
        selectionmode: '',
        isMasterGrid: false,

        valueMember: 'id',
        sortcolumn: ['id'],
        sortdirection: 'asc',
        selectId: []
      }
    };

    // definde filter

    // definde window edit form
    this.settingWinForEditFormPersons = {
      code: 'editFormPerson',
      name: this.translate.instant('site.forms.editforms.edit'),
      theme: 'material',
      isModal: true,
      modalOpacity: 0.3,
      width: 450,
      maxWidth: 450,
      minWidth: 450,
      height: 550,
      maxHeight: 550,
      minHeight: 550,
      coordX: 500,
      coordY: 65
    };

    // definde edit form
    this.sourceForEditFormPersons = [
      {
        nameField: 'geographs',
        type: 'jqxComboBox',
        source: this.geographs,
        theme: 'material',
        width: '285',
        height: '20',
        placeHolder: 'Геогр. понятие:',
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

    // definde link form


    // SUBSTATION

    // jqxgrid
    this.sourceForJqxGridSubstations = {
      listbox: {
        source: [
          {label: 'Id', value: 'id', checked: true},
          {label: 'geographId', value: 'geographId', checked: true},
          {label: 'Адрес', value: 'geographCode', checked: true},
          {label: 'Код', value: 'code', checked: true},
          {label: 'Наименование', value: 'name', checked: true},
          {label: 'ИНН', value: 'inn', checked: true},
          {label: 'orgFormId', value: 'orgFormId', checked: true},
          {label: 'Организационная форма', value: 'orgFormCode', checked: true},
          {label: 'Мощность', value: 'power', checked: true},
          {label: 'Коментарий', value: 'comments', checked: true}
        ],
        theme: 'material',
        width: 150,
        height: null,
        checkboxes: true,
        filterable: true,
        allowDrag: true
      },
      grid: {
        source: [],
        columns: [
          {text: 'Id', datafield: 'id', width: 50},
          {text: 'geographId', datafield: 'geographId', width: 150},
          {text: 'Адрес', datafield: 'geographCode', width: 150},
          {text: 'Код', datafield: 'code', width: 150},
          {text: 'Наименование', datafield: 'name', width: 150},
          {text: 'ИНН', datafield: 'inn', width: 150},
          {text: 'orgFormId', datafield: 'orgFormId', width: 150},
          {text: 'Организационная форма', datafield: 'orgFormCode', width: 150},
          {text: 'Мощность', datafield: 'power', width: 150},
          {text: 'Коментарий', datafield: 'comments', width: 150}
        ],
        theme: 'material',
        width: null,
        height: null,
        columnsresize: true,
        sortable: true,
        filterable: true,
        altrows: true,
        selectionmode: '',
        isMasterGrid: false,

        valueMember: 'id',
        sortcolumn: ['id'],
        sortdirection: 'asc',
        selectId: []
      }
    };

    // definde filter

    // definde window edit form
    this.settingWinForEditFormSubstations = {
      code: 'editFormSubstation',
      name: this.translate.instant('site.forms.editforms.edit'),
      theme: 'material',
      isModal: true,
      modalOpacity: 0.3,
      width: 450,
      maxWidth: 450,
      minWidth: 450,
      height: 550,
      maxHeight: 550,
      minHeight: 550,
      coordX: 500,
      coordY: 65
    };

    // definde edit form
    this.sourceForEditFormSubstations = [
      {
        nameField: 'geographs',
        type: 'jqxComboBox',
        source: this.geographs,
        theme: 'material',
        width: '285',
        height: '20',
        placeHolder: 'Геогр. понятие:',
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

    // definde link form

    this.getAll();

    this.fetch_refbook();
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
    if (this.geographSub) {
      this.geographSub.unsubscribe();
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

  fetch_refbook() {
    // refbook
    this.geographSub = this.geographService.fetch().subscribe(geographs => this.geographs = geographs);
  }

  getSourceForJqxGrid(handBookType: any) {
    switch (handBookType) {
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
      case '/handbook/contragent/companies':
        headline = this.translate.instant('site.menu.handbooks.companies-headline');
        break;
      case '/handbook/contragent/persons':
        headline = this.translate.instant('site.menu.handbooks.persons-headline');
        break;
      case '/handbook/contragent/substations':
        headline = this.translate.instant('site.menu.handbooks.substations-headline');
        break;
      default:
        headline = this.translate.instant('site.menu.handbooks.handbooks-headline');
    }
    return headline;
  }

  saveEditwinBtn(saveEditwinObject: any) {
    let selectObject: any;
    switch (saveEditwinObject.handBookType) {
      case 'companies':

        selectObject = saveEditwinObject.selectObject;
        for (let i = 0; i < this.sourceForEditFormCompanies.length; i++) {
          switch (this.sourceForEditFormCompanies[i].nameField) {
            case 'geographs':
              selectObject.geographId = +this.sourceForEditFormCompanies[i].selectId;
              selectObject.geographCode = this.sourceForEditFormCompanies[i].selectCode;
              break;
            case 'orgForms':
              selectObject.orgFormId = +this.sourceForEditFormCompanies[i].selectId;
              selectObject.orgFormCode = this.sourceForEditFormCompanies[i].selectCode;
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
              MaterialService.toast(`Юридическое лицо c id = ${selectObject.id} было добавлено.`);
            },
            error => MaterialService.toast(error.error.message),
            () => {
              // close edit window
              this.companies.editWindow.closeDestroyWindow();
              // update data source
              this.companies.jqxgridComponent.refresh_ins(selectObject.id, selectObject);
              // refresh temp
              this.getSourceForJqxGrid(saveEditwinObject.handBookType);
            }
          );
        }
        if (saveEditwinObject.typeEditWindow === 'upd') {
          // definde param befor upd
          this.companies.jqxgridComponent.selectRow.geographId = selectObject.geographId;
          this.companies.jqxgridComponent.selectRow.geographCode = selectObject.geographCode;
          this.companies.jqxgridComponent.selectRow.orgFormId = selectObject.orgFormId;
          this.companies.jqxgridComponent.selectRow.orgFormCode = selectObject.orgFormCode;
          this.companies.jqxgridComponent.selectRow.code = selectObject.code;
          this.companies.jqxgridComponent.selectRow.name = selectObject.name;
          this.companies.jqxgridComponent.selectRow.inn = selectObject.inn;
          this.companies.jqxgridComponent.selectRow.comments = selectObject.comments;

          // upd
          this.oSubCompanies = this.companyService.upd(selectObject).subscribe(
            response => {
              MaterialService.toast(`Юридическое лицо c id = ${selectObject.id} было обновлено.`);
            },
            error => MaterialService.toast(error.error.message),
            () => {
              // close edit window
              this.companies.editWindow.closeDestroyWindow();
              // update data source
              this.companies.jqxgridComponent.refresh_upd(selectObject.id, this.companies.jqxgridComponent.selectRow);
            }
          );
        }
        break;
      case 'persons':

        selectObject = saveEditwinObject.selectObject;
        for (let i = 0; i < this.sourceForEditFormPersons.length; i++) {
          switch (this.sourceForEditFormPersons[i].nameField) {
            case 'geographs':
              selectObject.geographId = +this.sourceForEditFormPersons[i].selectId;
              selectObject.geographCode = this.sourceForEditFormPersons[i].selectCode;
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
              MaterialService.toast(`Физическое лицо c id = ${selectObject.id} было добавлено.`);
            },
            error => MaterialService.toast(error.error.message),
            () => {
              // close edit window
              this.persons.editWindow.closeDestroyWindow();
              // update data source
              this.persons.jqxgridComponent.refresh_ins(selectObject.id, selectObject);
              // refresh temp
              this.getSourceForJqxGrid(saveEditwinObject.handBookType);
            }
          );
        }
        if (saveEditwinObject.typeEditWindow === 'upd') {
          // definde param befor upd
          this.persons.jqxgridComponent.selectRow.geographId = selectObject.geographId;
          this.persons.jqxgridComponent.selectRow.geographCode = selectObject.geographCode;
          this.persons.jqxgridComponent.selectRow.code = selectObject.code;
          this.persons.jqxgridComponent.selectRow.nameFirst = selectObject.nameFirst;
          this.persons.jqxgridComponent.selectRow.nameSecond = selectObject.nameSecond;
          this.persons.jqxgridComponent.selectRow.nameThird = selectObject.nameThird;
          this.persons.jqxgridComponent.selectRow.inn = selectObject.inn;
          this.persons.jqxgridComponent.selectRow.comments = selectObject.comments;

          // upd
          this.oSubPersons = this.personService.upd(selectObject).subscribe(
            response => {
              MaterialService.toast(`Физическое лицо c id = ${this.persons.jqxgridComponent.selectRow.id} было обновлено.`);
            },
            error => MaterialService.toast(error.error.message),
            () => {
              // close edit window
              this.persons.editWindow.closeDestroyWindow();
              // update data source
              this.persons.jqxgridComponent.refresh_upd(
                this.persons.jqxgridComponent.selectRow.id, this.persons.jqxgridComponent.selectRow);
            }
          );
        }
        break;
      case 'substations':

        selectObject = saveEditwinObject.selectObject;
        for (let i = 0; i < this.sourceForEditFormSubstations.length; i++) {
          switch (this.sourceForEditFormSubstations[i].nameField) {
            case 'geographs':
              selectObject.geographId = +this.sourceForEditFormSubstations[i].selectId;
              selectObject.geographCode = this.sourceForEditFormSubstations[i].selectCode;
              break;
            case 'orgForms':
              selectObject.orgFormId = +this.sourceForEditFormSubstations[i].selectId;
              selectObject.orgFormCode = this.sourceForEditFormSubstations[i].selectCode;
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
              MaterialService.toast(`Электростанция c id = ${selectObject.id} была добавлена.`);
            },
            error => MaterialService.toast(error.error.message),
            () => {
              // close edit window
              this.substations.editWindow.closeDestroyWindow();
              // update data source
              this.substations.jqxgridComponent.refresh_ins(selectObject.id, selectObject);
              // refresh temp
              this.getSourceForJqxGrid(saveEditwinObject.handBookType);
            }
          );
        }
        if (saveEditwinObject.typeEditWindow === 'upd') {
          // definde param befor upd
          this.substations.jqxgridComponent.selectRow.geographId = selectObject.geographId;
          this.substations.jqxgridComponent.selectRow.geographCode = selectObject.geographCode;
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
              MaterialService.toast(`Электростанция c id = ${this.substations.jqxgridComponent.selectRow.id} была обновлена.`);
            },
            error => MaterialService.toast(error.error.message),
            () => {
              // close edit window
              this.substations.editWindow.closeDestroyWindow();
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

  okEvenwinBtn(okEvenwinObject: any) {
    switch (okEvenwinObject.handBookType) {
      case 'companies':
        if (okEvenwinObject.actionEventWindow === 'del') {
          if (+okEvenwinObject.id >= 0) {
            this.companyService.del(+okEvenwinObject.id).subscribe(
              response => {
                MaterialService.toast('Юридическое лицо было удалено!');
              },
              error => MaterialService.toast(error.error.message),
              () => {
                this.companies.jqxgridComponent.refresh_del([+okEvenwinObject.id]);
                // refresh temp
                this.getSourceForJqxGrid(okEvenwinObject.handBookType);
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
                MaterialService.toast('Физическое лицо было удалено!');
              },
              error => MaterialService.toast(error.error.message),
              () => {
                this.persons.jqxgridComponent.refresh_del([+okEvenwinObject.id]);
                // refresh temp
                this.getSourceForJqxGrid(okEvenwinObject.handBookType);
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
                MaterialService.toast('Электростанция была удалена!');
              },
              error => MaterialService.toast(error.error.message),
              () => {
                this.substations.jqxgridComponent.refresh_del([+okEvenwinObject.id]);
                // refresh temp
                this.getSourceForJqxGrid(okEvenwinObject.handBookType);
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
