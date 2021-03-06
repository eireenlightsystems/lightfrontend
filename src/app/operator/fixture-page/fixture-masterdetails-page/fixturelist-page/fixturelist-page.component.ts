// angular lib
import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs/index';
import {isUndefined} from 'util';
import {TranslateService} from '@ngx-translate/core';
import {MatSnackBar} from '@angular/material';
// jqwidgets
// app interfaces
import {
  Contract,
  EquipmentType,
  FilterFixture,
  Fixture, FixtureType,
  HeightType,
  Installer,
  ItemsLinkForm, NavItem,
  Owner,
  SettingButtonPanel,
  SettingWinForEditForm,
  SourceForEditForm,
  SourceForFilter,
  SourceForJqxGrid,
  SourceForLinkForm,
  Substation
} from '../../../../shared/interfaces';
// app services
import {FixtureService} from '../../../../shared/services/fixture/fixture.service';
// app components
import {JqxgridComponent} from '../../../../shared/components/jqxgrid/jqxgrid.component';
import {ButtonPanelComponent} from '../../../../shared/components/button-panel/button-panel.component';
import {FilterTableComponent} from '../../../../shared/components/filter-table/filter-table.component';
import {EditFormComponent} from '../../../../shared/components/edit-form/edit-form.component';
import {LinkFormComponent} from '../../../../shared/components/link-form/link-form.component';
import {EventWindowComponent} from '../../../../shared/components/event-window/event-window.component';


const STEP = 1000000000000;


@Component({
  selector: 'app-fixturelist-page',
  templateUrl: './fixturelist-page.component.html',
  styleUrls: ['./fixturelist-page.component.css']
})
export class FixturelistPageComponent implements OnInit, OnChanges, OnDestroy {

  // variables from parent component
  @Input() siteMap: NavItem[];
  @Input() ownerFixtures: Owner[];
  @Input() fixtureTypes: FixtureType[];
  @Input() substations: Substation[];
  @Input() contractFixtures: Contract[];
  @Input() installers: Installer[];
  @Input() heightTypes: HeightType[];
  @Input() selectContractId: string;
  @Input() selectNodeId: number;
  @Input() fixtureGroupId: string;
  @Input() heightGrid: number;
  @Input() isMasterGrid: boolean;
  @Input() selectionmode: string;
  @Input() settingButtonPanel: SettingButtonPanel;
  @Input() currentLang: string;

  // determine the functions that need to be performed in the parent component
  @Output() onRefreshChildGrid = new EventEmitter<number>();

  // define variables - link to view objects
  @ViewChild('jqxgridComponent', {static: false}) jqxgridComponent: JqxgridComponent;
  @ViewChild('buttonPanel', {static: false}) buttonPanel: ButtonPanelComponent;
  @ViewChild('filterForm', {static: false}) filterForm: FilterTableComponent;
  @ViewChild('editForm', {static: false}) editForm: EditFormComponent;
  @ViewChild('linkForm', {static: false}) linkForm: LinkFormComponent;
  @ViewChild('linkFormGrFix', {static: false}) linkFormGrFix: LinkFormComponent;
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
  items: Fixture[] = [];
  // grid
  oSub: Subscription;
  selectItemId = 0;
  sourceForJqxGrid: SourceForJqxGrid;
  // filter
  filter: FilterFixture = {
    geographId: '',
    ownerId: '',
    fixtureTypeId: '',
    substationId: '',
    modeId: '',
    contractId: '',
    nodeId: ''
  };
  sourceForFilter: SourceForFilter[];
  isFilterFormInit = false;
  filterSelect = '';
  modes = [
    {
      id: 0,
      code: 'Выкл.'
    },
    {
      id: 1,
      code: 'Вкл.'
    }
  ];
  // edit form
  settingWinForEditForm: SettingWinForEditForm;
  sourceForEditForm: SourceForEditForm[];
  isEditFormInit = false;
  typeEditWindow = '';
  // link form
  oSubForLinkWin: Subscription;
  oSubLink: Subscription;
  sourceForLinkForm: SourceForLinkForm;
  sourceGrFixForLinkForm: SourceForLinkForm;
  isLinkFormInit = false;
  isLinkFormGrFixInit = false;
  // event form
  warningEventWindow = '';
  actionEventWindow = '';


  constructor(private _snackBar: MatSnackBar,
              // service
              public translate: TranslateService,
              private fixtureService: FixtureService) {
  }

  ngOnInit() {
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
        valueMember: 'fixtureId',
        sortcolumn: ['fixtureId'],
        sortdirection: 'desc',
        selectId: []
      }
    };
    // definde edit form
    this.settingWinForEditForm = {
      code: 'editFormFixture',
      name: 'Add/edit fixtures',
      theme: 'material',
      isModal: true,
      modalOpacity: 0.3,
      width: 450,
      maxWidth: 500,
      minWidth: 460,
      height: 550,
      maxHeight: 550,
      minHeight: 550,
      coordX: 500,
      coordY: 65
    };

    if (this.isMasterGrid) {
      if (+this.fixtureGroupId === 0) {
        this.getDisabledButtons();
      } else {
        this.refreshGrid();
      }
    } else {
      // disabled/available buttons
      this.getAvailabilityButtons();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.currentLang) {
      if (changes.currentLang.currentValue === 'ru') {
        // definde columns
        if (this.isMasterGrid) {
          this.columnsGrid =
            [
              {text: 'fixtureId', datafield: 'fixtureId', width: 150},
              {text: 'Адрес', datafield: 'geographFullName', width: 400},
              {text: 'Договор', datafield: 'contractCode', width: 150, hidden: true},
              {text: 'Владелец', datafield: 'ownerCode', width: 150},
              {text: 'Тип светильника', datafield: 'fixtureTypeCode', width: 150},
              {text: 'Подстанция', datafield: 'substationCode', width: 150},
              {text: 'Установщик', datafield: 'installerCode', width: 150, hidden: true},
              {text: 'Высота', datafield: 'heightTypeCode', width: 150},
              {text: 'Серийный номер', datafield: 'serialNumber', width: 150},
              {text: 'Коментарий', datafield: 'comment', width: 150},
              {text: 'Режим', datafield: 'flgLight', width: 150, hidden: true},
            ];
          this.listBoxSource =
            [
              {label: 'fixtureId', value: 'fixtureId', checked: true},
              {label: 'Адрес', value: 'geographFullName', checked: true},
              {label: 'Договор', value: 'contractCode', checked: false},
              {label: 'Владелец', value: 'ownerCode', checked: true},
              {label: 'Тип светильника', value: 'fixtureTypeCode', checked: true},
              {label: 'Подстанция', value: 'substationCode', checked: true},
              {label: 'Установщик', value: 'installerCode', checked: false},
              {label: 'Высота', value: 'heightTypeCode', checked: true},
              {label: 'Серийный номер', value: 'serialNumber', checked: true},
              {label: 'Коментарий', value: 'comment', checked: true},
              {label: 'Режим', value: 'flgLight', checked: false},
            ];
        } else {
          this.columnsGrid =
            [
              {text: 'fixtureId', datafield: 'fixtureId', width: 150},
              {text: 'Договор', datafield: 'contractCode', width: 150, hidden: true},
              {text: 'Тип светильника', datafield: 'fixtureTypeCode', width: 150},
              {text: 'Подстанция', datafield: 'substationCode', width: 150},
              {text: 'Установщик', datafield: 'installerCode', width: 150, hidden: true},
              {text: 'Высота', datafield: 'heightTypeCode', width: 150},
              {text: 'Серийный номер', datafield: 'serialNumber', width: 150},
              {text: 'Коментарий', datafield: 'comment', width: 150},
              {text: 'Режим', datafield: 'flgLight', width: 150, hidden: true},
            ];
          this.listBoxSource =
            [
              {label: 'fixtureId', value: 'fixtureId', checked: true},
              {label: 'Договор', value: 'contractCode', checked: false},
              {label: 'Тип светильника', value: 'fixtureTypeCode', checked: true},
              {label: 'Подстанция', value: 'substationCode', checked: true},
              {label: 'Установщик', value: 'installerCode', checked: false},
              {label: 'Высота', value: 'heightTypeCode', checked: true},
              {label: 'Серийный номер', value: 'serialNumber', checked: true},
              {label: 'Коментарий', value: 'comment', checked: true},
              {label: 'Режим', value: 'flgLight', checked: false},
            ];
        }
        // definde filter
        this.sourceForFilter = [
          {
            name: 'geographs',
            type: 'ngxSuggestionAddress',
            source: [],
            theme: 'material',
            width: '380',
            height: '45',
            placeHolder: 'Адрес:',
            displayMember: 'code',
            valueMember: 'id',
            defaultValue: '',
            selectId: ''
          },
          {
            name: 'ownerFixtures',
            type: 'jqxComboBox',
            source: this.ownerFixtures,
            theme: 'material',
            width: '380',
            height: '45',
            placeHolder: 'Владелец:',
            displayMember: 'code',
            valueMember: 'id',
            defaultValue: '',
            selectId: ''
          },
          {
            name: 'fixtureTypes',
            type: 'jqxComboBox',
            source: this.fixtureTypes,
            theme: 'material',
            width: '380',
            height: '45',
            placeHolder: 'Тип светильника:',
            displayMember: 'code',
            valueMember: 'id',
            defaultValue: '',
            selectId: ''
          },
          {
            name: 'substations',
            type: 'jqxComboBox',
            source: this.substations,
            theme: 'material',
            width: '380',
            height: '45',
            placeHolder: 'Подстанция:',
            displayMember: 'code',
            valueMember: 'id',
            defaultValue: '',
            selectId: ''
          },
          {
            name: 'modes',
            type: 'jqxComboBox',
            source: this.modes,
            theme: 'material',
            width: '380',
            height: '45',
            placeHolder: 'Вкл./выкл.:',
            displayMember: 'code',
            valueMember: 'id',
            defaultValue: '',
            selectId: ''
          }
        ];
        // definde edit form
        this.sourceForEditForm = [
          {
            nameField: 'contractFixtures',
            type: 'jqxComboBox',
            source: this.contractFixtures,
            theme: 'material',
            width: '285',
            height: '20',
            placeHolder: 'Договор:',
            displayMember: 'code',
            valueMember: 'id',
            selectedIndex: null,
            selectId: '',
            selectCode: '',
            selectName: ''
          },
          {
            nameField: 'fixtureTypes',
            type: 'jqxComboBox',
            source: this.fixtureTypes,
            theme: 'material',
            width: '285',
            height: '20',
            placeHolder: 'Тип светильника:',
            displayMember: 'code',
            valueMember: 'id',
            selectedIndex: null,
            selectId: '',
            selectCode: '',
            selectName: ''
          },
          {
            nameField: 'substations',
            type: 'jqxComboBox',
            source: this.substations,
            theme: 'material',
            width: '285',
            height: '20',
            placeHolder: 'Подстанция:',
            displayMember: 'code',
            valueMember: 'id',
            selectedIndex: null,
            selectId: '',
            selectCode: '',
            selectName: ''
          },
          {
            nameField: 'installers',
            type: 'jqxComboBox',
            source: this.installers,
            theme: 'material',
            width: '285',
            height: '20',
            placeHolder: 'Установщик:',
            displayMember: 'code',
            valueMember: 'id',
            selectedIndex: null,
            selectId: '',
            selectCode: '',
            selectName: ''
          },
          {
            nameField: 'heightTypes',
            type: 'jqxComboBox',
            source: this.heightTypes,
            theme: 'material',
            width: '285',
            height: '20',
            placeHolder: 'Тип высоты:',
            displayMember: 'code',
            valueMember: 'id',
            selectedIndex: null,
            selectId: '',
            selectCode: '',
            selectName: ''
          },
          {
            nameField: 'serialNumber',
            type: 'jqxTextArea',
            source: [],
            theme: 'material',
            width: '280',
            height: '20',
            placeHolder: 'Серийный номер:',
            displayMember: 'code',
            valueMember: 'id',
            selectedIndex: null,
            selectId: '',
            selectCode: '',
            selectName: ''
          },
          {
            nameField: 'comment',
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
            code: 'linkNodeFixtures',
            name: 'Выбрать светильники',
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
            valueMember: 'fixtureId',
            sortcolumn: ['fixtureId'],
            sortdirection: 'desc',
            selectId: []
          }
        };
        this.sourceGrFixForLinkForm = {
          window: {
            code: 'linkGrFixFixtures',
            name: 'Выбрать светильники',
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

            valueMember: 'fixtureId',
            sortcolumn: ['fixtureId'],
            sortdirection: 'desc',
            selectId: []
          }
        };
      } else {
        // definde columns
        if (this.isMasterGrid) {
          this.columnsGrid =
            [
              {text: 'fixtureId', datafield: 'fixtureId', width: 150},
              {text: 'Address', datafield: 'geographFullName', width: 400},
              {text: 'Contract', datafield: 'contractCode', width: 150, hidden: true},
              {text: 'Owner', datafield: 'ownerCode', width: 150},
              {text: 'Type of fixture', datafield: 'fixtureTypeCode', width: 150},
              {text: 'Substation', datafield: 'substationCode', width: 150},
              {text: 'Installer', datafield: 'installerCode', width: 150, hidden: true},
              {text: 'Height', datafield: 'heightTypeCode', width: 150},
              {text: 'Serial number', datafield: 'serialNumber', width: 150},
              {text: 'Comments', datafield: 'comment', width: 150},
              {text: 'Mode', datafield: 'flgLight', width: 150, hidden: true},
            ];
          this.listBoxSource =
            [
              {label: 'fixtureId', value: 'fixtureId', checked: true},
              {label: 'Address', value: 'geographFullName', checked: true},
              {label: 'Contract', value: 'contractCode', checked: false},
              {label: 'Owner', value: 'ownerCode', checked: true},
              {label: 'Type of fixture', value: 'fixtureTypeCode', checked: true},
              {label: 'Substation', value: 'substationCode', checked: true},
              {label: 'Installer', value: 'installerCode', checked: false},
              {label: 'Height', value: 'heightTypeCode', checked: true},
              {label: 'Serial number', value: 'serialNumber', checked: true},
              {label: 'Comments', value: 'comment', checked: true},
              {label: 'Mode', value: 'flgLight', checked: false},
            ];
        } else {
          this.columnsGrid =
            [
              {text: 'fixtureId', datafield: 'fixtureId', width: 150},
              {text: 'Contract', datafield: 'contractCode', width: 150, hidden: true},
              {text: 'Type of fixture', datafield: 'fixtureTypeCode', width: 150},
              {text: 'Substation', datafield: 'substationCode', width: 150},
              {text: 'Installer', datafield: 'installerCode', width: 150, hidden: true},
              {text: 'Height', datafield: 'heightTypeCode', width: 150},
              {text: 'Serial number', datafield: 'serialNumber', width: 150},
              {text: 'Comments', datafield: 'comment', width: 150},
              {text: 'Mode', datafield: 'flgLight', width: 150, hidden: true},
            ];
          this.listBoxSource =
            [
              {label: 'fixtureId', value: 'fixtureId', checked: true},
              {label: 'Contract', value: 'contractCode', checked: false},
              {label: 'Type of fixture', value: 'fixtureTypeCode', checked: true},
              {label: 'Substation', value: 'substationCode', checked: true},
              {label: 'Installer', value: 'installerCode', checked: false},
              {label: 'Height', value: 'heightTypeCode', checked: true},
              {label: 'Serial number', value: 'serialNumber', checked: true},
              {label: 'Comments', value: 'comment', checked: true},
              {label: 'Mode', value: 'flgLight', checked: false},
            ];
        }
        // definde filter
        this.sourceForFilter = [
          {
            name: 'geographs',
            type: 'ngxSuggestionAddress',
            source: [],
            theme: 'material',
            width: '380',
            height: '45',
            placeHolder: 'Adres:',
            displayMember: 'code',
            valueMember: 'id',
            defaultValue: '',
            selectId: ''
          },
          {
            name: 'ownerFixtures',
            type: 'jqxComboBox',
            source: this.ownerFixtures,
            theme: 'material',
            width: '380',
            height: '45',
            placeHolder: 'Owner:',
            displayMember: 'code',
            valueMember: 'id',
            defaultValue: '',
            selectId: ''
          },
          {
            name: 'fixtureTypes',
            type: 'jqxComboBox',
            source: this.fixtureTypes,
            theme: 'material',
            width: '380',
            height: '45',
            placeHolder: 'Fixture type:',
            displayMember: 'code',
            valueMember: 'id',
            defaultValue: '',
            selectId: ''
          },
          {
            name: 'substations',
            type: 'jqxComboBox',
            source: this.substations,
            theme: 'material',
            width: '380',
            height: '45',
            placeHolder: 'Substation:',
            displayMember: 'code',
            valueMember: 'id',
            defaultValue: '',
            selectId: ''
          },
          {
            name: 'modes',
            type: 'jqxComboBox',
            source: this.modes,
            theme: 'material',
            width: '380',
            height: '45',
            placeHolder: 'Mode:',
            displayMember: 'code',
            valueMember: 'id',
            defaultValue: '',
            selectId: ''
          }
        ];
        // definde edit form
        this.sourceForEditForm = [
          {
            nameField: 'contractFixtures',
            type: 'jqxComboBox',
            source: this.contractFixtures,
            theme: 'material',
            width: '285',
            height: '20',
            placeHolder: 'Contract:',
            displayMember: 'code',
            valueMember: 'id',
            selectedIndex: null,
            selectId: '',
            selectCode: '',
            selectName: ''
          },
          {
            nameField: 'fixtureTypes',
            type: 'jqxComboBox',
            source: this.fixtureTypes,
            theme: 'material',
            width: '285',
            height: '20',
            placeHolder: 'Fixture type:',
            displayMember: 'code',
            valueMember: 'id',
            selectedIndex: null,
            selectId: '',
            selectCode: '',
            selectName: ''
          },
          {
            nameField: 'substations',
            type: 'jqxComboBox',
            source: this.substations,
            theme: 'material',
            width: '285',
            height: '20',
            placeHolder: 'Substation:',
            displayMember: 'code',
            valueMember: 'id',
            selectedIndex: null,
            selectId: '',
            selectCode: '',
            selectName: ''
          },
          {
            nameField: 'installers',
            type: 'jqxComboBox',
            source: this.installers,
            theme: 'material',
            width: '285',
            height: '20',
            placeHolder: 'Installer:',
            displayMember: 'code',
            valueMember: 'id',
            selectedIndex: null,
            selectId: '',
            selectCode: '',
            selectName: ''
          },
          {
            nameField: 'heightTypes',
            type: 'jqxComboBox',
            source: this.heightTypes,
            theme: 'material',
            width: '285',
            height: '20',
            placeHolder: 'Height:',
            displayMember: 'code',
            valueMember: 'id',
            selectedIndex: null,
            selectId: '',
            selectCode: '',
            selectName: ''
          },
          {
            nameField: 'serialNumber',
            type: 'jqxTextArea',
            source: [],
            theme: 'material',
            width: '280',
            height: '20',
            placeHolder: 'Serial number:',
            displayMember: 'code',
            valueMember: 'id',
            selectedIndex: null,
            selectId: '',
            selectCode: '',
            selectName: ''
          },
          {
            nameField: 'comment',
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
        this.sourceForLinkForm = {
          window: {
            code: 'linkNodeFixtures',
            name: 'Choose fixtures',
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
            valueMember: 'fixtureId',
            sortcolumn: ['fixtureId'],
            sortdirection: 'desc',
            selectId: []
          }
        };
        this.sourceGrFixForLinkForm = {
          window: {
            code: 'linkGrFixFixtures',
            name: 'Choose fixtures',
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

            valueMember: 'fixtureId',
            sortcolumn: ['fixtureId'],
            sortdirection: 'desc',
            selectId: []
          }
        };
      }
    }
  }

  ngOnDestroy() {
    if (this.oSub) {
      this.oSub.unsubscribe();
    }
    if (this.jqxgridComponent) {
      this.jqxgridComponent.destroyGrid();
    }
    if (this.filterForm) {
      this.filterForm.destroy();
    }
    if (this.buttonPanel) {
      this.buttonPanel.destroy();
    }
    if (this.editForm) {
      this.editForm.destroy();
    }
    if (this.linkForm) {
      this.linkForm.destroy();
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

    // disabled/available buttons
    this.getAvailabilityButtons();

    // if it is master grid, then we need refresh child grid
    if (this.isMasterGrid) {
      this.onRefreshChildGrid.emit(this.selectItemId);
    }
  }

  refreshChildGrid(selectRow: any) {
    this.selectItemId = selectRow.fixtureId;
    // refresh child grid
    this.onRefreshChildGrid.emit(selectRow.fixtureId);
  }

  getAll() {
    if (isUndefined(this.fixtureGroupId)) {
      const params = Object.assign({}, {
          offset: this.offset,
          limit: this.limit
        },
        this.filter);
      this.oSub = this.fixtureService.getAll(params).subscribe(fixtures => {
          this.items = this.items.concat(fixtures);
          this.noMoreItems = fixtures.length < STEP;
          this.loading = false;
          this.reloading = false;
        },
        error => {
          console.log(error.error.message);
        });
    } else {
      this.oSub = this.fixtureService.getFixtureInGroup(this.fixtureGroupId).subscribe(fixtures => {
          this.items = fixtures;
          this.loading = false;
          this.reloading = false;
        },
        error => {
          console.log(error.error.message);
        });
    }
  }

  getAvailabilityButtons() {
    if (!this.isMasterGrid && +this.filter.nodeId === 0) {
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
    this.isEditFormInit = true;
  }

  upd() {
    if (!isUndefined(this.jqxgridComponent.selectRow)) {
      this.typeEditWindow = 'upd';
      this.getSourceForEditForm();
      this.isEditFormInit = true;
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow =
        this.translate.instant('site.menu.operator.fixture-page.fixture-masterdetails-page.fixturelist-page.upd-warning');
      this.eventWindow.openEventWindow();
    }
  }

  del() {
    if (!isUndefined(this.jqxgridComponent.selectRow)) {
      this.eventWindow.okButtonDisabled(false);
      this.actionEventWindow = 'del';
      this.warningEventWindow =
        this.translate.instant('site.menu.operator.fixture-page.fixture-masterdetails-page.fixturelist-page.del-question')
        + this.jqxgridComponent.selectRow.fixtureId + '?';
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow =
        this.translate.instant('site.menu.operator.fixture-page.fixture-masterdetails-page.fixturelist-page.del-warning');
    }
    this.eventWindow.openEventWindow();
  }

  refresh() {
    this.refreshGrid();
  }

  setting() {
    this.jqxgridComponent.initSettingForm();
  }

  filterList() {
    this.isFilterFormInit = true;
    this.getSourceForFilter();
  }

  place() {
    if (+this.selectNodeId > 1) {
      this.isLinkFormInit = true;
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow =
        this.translate.instant('site.menu.operator.fixture-page.fixture-masterdetails-page.fixturelist-page.place-warning');
      this.eventWindow.openEventWindow();
    }
  }

  pinDrop() {
    if (!isUndefined(this.jqxgridComponent.selectRow)) {
      this.eventWindow.okButtonDisabled(false);
      this.actionEventWindow = 'pinDrop';
      this.warningEventWindow =
        this.translate.instant('site.menu.operator.fixture-page.fixture-masterdetails-page.fixturelist-page.pinDrop-question');
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow =
        this.translate.instant('site.menu.operator.fixture-page.fixture-masterdetails-page.fixturelist-page.pinDrop-warning');
    }
    this.eventWindow.openEventWindow();
  }

  groupIn() {
    if (+this.fixtureGroupId > 1) {
      this.isLinkFormGrFixInit = true;
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow =
        this.translate.instant('site.menu.operator.fixture-page.fixture-masterdetails-page.fixturelist-page.groupIn-warning');
      this.eventWindow.openEventWindow();
    }
  }

  groupOut() {
    if (!isUndefined(this.jqxgridComponent.selectRow)) {
      this.eventWindow.okButtonDisabled(false);
      this.actionEventWindow = 'groupOut';
      this.warningEventWindow =
        this.translate.instant('site.menu.operator.fixture-page.fixture-masterdetails-page.fixturelist-page.groupOut-question');
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow =
        this.translate.instant('site.menu.operator.fixture-page.fixture-masterdetails-page.fixturelist-page.groupOut-warning');
    }
    this.eventWindow.openEventWindow();
  }

  switchOn() {

  }

  switchOff() {

  }

  // FILTER

  applyFilter(event: any) {
    this.filter = event;
    this.refreshGrid();
  }

  applyFilterFromFilter(event: any) {
    for (let i = 0; i < event.length; i++) {
      switch (event[i].name) {
        case 'geographs':
          this.filter.geographId = event[i].id;
          break;
        case 'ownerFixtures':
          this.filter.ownerId = event[i].id;
          break;
        case 'fixtureTypes':
          this.filter.fixtureTypeId = event[i].id;
          break;
        case 'substations':
          this.filter.substationId = event[i].id;
          break;
        case 'modes':
          this.filter.modeId = event[i].id;
          break;
        default:
          break;
      }
    }
    this.filterSelect = this.filterForm.getFilterSelect();
    this.refreshGrid();
  }

  getSourceForFilter() {
    if (!isUndefined(this.ownerFixtures)
      && !isUndefined(this.fixtureTypes)
      && !isUndefined(this.substations)) {
      let sourceForFilter: any[];
      sourceForFilter = this.sourceForFilter;
      for (let i = 0; i < sourceForFilter.length; i++) {
        switch (sourceForFilter[i].name) {
          case 'ownerFixtures':
            sourceForFilter[i].source = this.ownerFixtures;
            break;
          case 'fixtureTypes':
            sourceForFilter[i].source = this.fixtureTypes;
            break;
          case 'substations':
            sourceForFilter[i].source = this.substations;
            break;
          default:
            break;
        }
      }
    }
  }

  applyFilterFixtureInGroup(fixtureGroupId: string) {
    this.fixtureGroupId = fixtureGroupId;
    this.refreshGrid();
  }

  destroyFilterForm() {
    this.isFilterFormInit = false;
  }

  // EDIT FORM

  saveEditFormBtn() {
    const selectObject: Fixture = new Fixture();
    for (let i = 0; i < this.editForm.sourceForEditForm.length; i++) {
      switch (this.editForm.sourceForEditForm[i].nameField) {
        case 'contractFixtures':
          selectObject.contractId = +this.editForm.sourceForEditForm[i].selectId;
          selectObject.contractCode = this.editForm.sourceForEditForm[i].selectCode;
          break;
        case 'fixtureTypes':
          selectObject.fixtureTypeId = +this.editForm.sourceForEditForm[i].selectId;
          selectObject.fixtureTypeCode = this.editForm.sourceForEditForm[i].selectCode;
          break;
        case 'substations':
          selectObject.substationId = +this.editForm.sourceForEditForm[i].selectId;
          selectObject.substationCode = this.editForm.sourceForEditForm[i].selectCode;
          break;
        case 'installers':
          selectObject.installerId = +this.editForm.sourceForEditForm[i].selectId;
          selectObject.installerCode = this.editForm.sourceForEditForm[i].selectCode;
          break;
        case 'heightTypes':
          selectObject.heightTypeId = +this.editForm.sourceForEditForm[i].selectId;
          selectObject.heightTypeCode = this.editForm.sourceForEditForm[i].selectCode;
          break;
        case 'serialNumber':
          selectObject.serialNumber = this.editForm.sourceForEditForm[i].selectCode;
          break;
        case 'comment':
          selectObject.comment = this.editForm.sourceForEditForm[i].selectCode;
          break;
        default:
          break;
      }
    }

    if (this.typeEditWindow === 'ins') {
      // definde param befor ins
      selectObject.nodeId = !isUndefined(this.selectNodeId) ? +this.selectNodeId : 1;
      if (selectObject.nodeId === 1) {
        selectObject.e_coordinate = 0;
        selectObject.n_coordinate = 0;
        selectObject.geographCode = this.translate.instant('site.forms.editforms.withoutAddress');
      }
      // ins
      this.oSub = this.fixtureService.ins(selectObject).subscribe(
        response => {
          selectObject.fixtureId = +response;
          this.openSnackBar(this.translate.instant('site.menu.operator.fixture-page.fixture-masterdetails-page.fixturelist-page.ins')
            + selectObject.fixtureId, this.translate.instant('site.forms.editforms.ok'));
        },
        error => {
          this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok'));
          console.log(error.error.message);
        },
        () => {
          // close edit window
          this.editForm.closeDestroy();
          // update data source
          this.jqxgridComponent.refresh_ins(
            selectObject.fixtureId, selectObject);
        }
      );
    }
    if (this.typeEditWindow === 'upd') {
      // definde param befor upd
      this.jqxgridComponent.selectRow.contractId = selectObject.contractId;
      this.jqxgridComponent.selectRow.contractCode = selectObject.contractCode;
      this.jqxgridComponent.selectRow.fixtureTypeId = selectObject.fixtureTypeId;
      this.jqxgridComponent.selectRow.fixtureTypeCode = selectObject.fixtureTypeCode;
      this.jqxgridComponent.selectRow.substationId = selectObject.substationId;
      this.jqxgridComponent.selectRow.substationCode = selectObject.substationCode;
      this.jqxgridComponent.selectRow.installerId = selectObject.installerId;
      this.jqxgridComponent.selectRow.installerCode = selectObject.installerCode;
      this.jqxgridComponent.selectRow.heightTypeId = selectObject.heightTypeId;
      this.jqxgridComponent.selectRow.heightTypeCode = selectObject.heightTypeCode;
      this.jqxgridComponent.selectRow.serialNumber = selectObject.serialNumber;
      this.jqxgridComponent.selectRow.comment = selectObject.comment;

      // upd
      this.oSub = this.fixtureService.upd(this.jqxgridComponent.selectRow).subscribe(
        response => {
          this.openSnackBar(this.translate.instant('site.menu.operator.fixture-page.fixture-masterdetails-page.fixturelist-page.upd')
            + this.jqxgridComponent.selectRow.fixtureId, this.translate.instant('site.forms.editforms.ok'));
        },
        error => {
          this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok'));
          console.log(error.error.message);
        },
        () => {
          // close edit window
          this.editForm.closeDestroy();
          // update data source
          this.jqxgridComponent.refresh_upd(
            this.jqxgridComponent.selectRow.fixtureId, this.jqxgridComponent.selectRow);
        }
      );
    }
  }

  getSourceForEditForm() {
    let sourceForEditForm: any[];
    sourceForEditForm = this.sourceForEditForm;
    for (let i = 0; i < sourceForEditForm.length; i++) {
      if (this.typeEditWindow === 'ins') {
        sourceForEditForm[i].selectedIndex = 0;
        sourceForEditForm[i].selectId = '1';
        sourceForEditForm[i].selectCode = this.translate.instant('site.forms.editforms.empty');
        sourceForEditForm[i].selectName = this.translate.instant('site.forms.editforms.empty');
      }
      switch (sourceForEditForm[i].nameField) {
        case 'contractFixtures':
          sourceForEditForm[i].source = this.contractFixtures;
          if (this.typeEditWindow === 'ins') {
            sourceForEditForm[i].selectId = this.contractFixtures[0].id.toString();
            sourceForEditForm[i].selectCode = this.contractFixtures.find(
              (one: Contract) => one.id === +sourceForEditForm[i].selectId).code;
            sourceForEditForm[i].selectName = this.contractFixtures.find(
              (one: Contract) => one.id === +sourceForEditForm[i].selectId).name;
          }
          if (this.typeEditWindow === 'upd') {
            sourceForEditForm[i].selectId = this.jqxgridComponent.selectRow.contractId.toString();
            sourceForEditForm[i].selectCode = this.contractFixtures.find(
              (contractOne: Contract) => contractOne.id === +this.jqxgridComponent.selectRow.contractId).code;
            sourceForEditForm[i].selectName = this.contractFixtures.find(
              (contractOne: Contract) => contractOne.id === +this.jqxgridComponent.selectRow.contractId).name;
            for (let j = 0; j < this.contractFixtures.length; j++) {
              if (+this.contractFixtures[j].id === +this.jqxgridComponent.selectRow.contractId) {
                sourceForEditForm[i].selectedIndex = j;
                break;
              }
            }
          }
          break;
        case 'fixtureTypes':
          sourceForEditForm[i].source = this.fixtureTypes;
          if (this.typeEditWindow === 'ins') {
            sourceForEditForm[i].selectId = this.fixtureTypes[0].id.toString();
            sourceForEditForm[i].selectCode = this.fixtureTypes.find(
              (one: FixtureType) => one.id === +sourceForEditForm[i].selectId).code;
            sourceForEditForm[i].selectName = this.fixtureTypes.find(
              (one: FixtureType) => one.id === +sourceForEditForm[i].selectId).name;
          }
          if (this.typeEditWindow === 'upd') {
            sourceForEditForm[i].selectId = this.jqxgridComponent.selectRow.fixtureTypeId.toString();
            sourceForEditForm[i].selectCode = this.fixtureTypes.find(
              (sensorType: FixtureType) => sensorType.id === +this.jqxgridComponent.selectRow.fixtureTypeId).code;
            sourceForEditForm[i].selectName = this.fixtureTypes.find(
              (sensorType: FixtureType) => sensorType.id === +this.jqxgridComponent.selectRow.fixtureTypeId).name;
            for (let j = 0; j < this.fixtureTypes.length; j++) {
              if (+this.fixtureTypes[j].id === +this.jqxgridComponent.selectRow.fixtureTypeId) {
                sourceForEditForm[i].selectedIndex = j;
                break;
              }
            }
          }
          break;
        case 'substations':
          sourceForEditForm[i].source = this.substations;
          if (this.typeEditWindow === 'ins') {
            sourceForEditForm[i].selectId = this.substations[0].id.toString();
            sourceForEditForm[i].selectCode = this.substations.find(
              (one: Substation) => one.id === +sourceForEditForm[i].selectId).code;
            sourceForEditForm[i].selectName = this.substations.find(
              (one: Substation) => one.id === +sourceForEditForm[i].selectId).name;
          }
          if (this.typeEditWindow === 'upd') {
            sourceForEditForm[i].selectId = this.jqxgridComponent.selectRow.substationId.toString();
            sourceForEditForm[i].selectCode = this.substations.find(
              (substation: Substation) => substation.id === +this.jqxgridComponent.selectRow.substationId).code;
            sourceForEditForm[i].selectName = this.substations.find(
              (substation: Substation) => substation.id === +this.jqxgridComponent.selectRow.substationId).name;
            for (let j = 0; j < this.substations.length; j++) {
              if (+this.substations[j].id === +this.jqxgridComponent.selectRow.substationId) {
                sourceForEditForm[i].selectedIndex = j;
                break;
              }
            }
          }
          break;
        case 'installers':
          sourceForEditForm[i].source = this.installers;
          if (this.typeEditWindow === 'ins') {
            sourceForEditForm[i].selectId = this.installers[0].id.toString();
            sourceForEditForm[i].selectCode = this.installers.find(
              (one: Installer) => one.id === +sourceForEditForm[i].selectId).code;
            sourceForEditForm[i].selectName = this.installers.find(
              (one: Installer) => one.id === +sourceForEditForm[i].selectId).name;
          }
          if (this.typeEditWindow === 'upd') {
            sourceForEditForm[i].selectId = this.jqxgridComponent.selectRow.installerId.toString();
            sourceForEditForm[i].selectCode = this.installers.find(
              (installer: Installer) => installer.id === +this.jqxgridComponent.selectRow.installerId).code;
            sourceForEditForm[i].selectName = this.installers.find(
              (installer: Installer) => installer.id === +this.jqxgridComponent.selectRow.installerId).name;
            for (let j = 0; j < this.installers.length; j++) {
              if (+this.installers[j].id === +this.jqxgridComponent.selectRow.installerId) {
                sourceForEditForm[i].selectedIndex = j;
                break;
              }
            }
          }
          break;
        case 'heightTypes':
          sourceForEditForm[i].source = this.heightTypes;
          if (this.typeEditWindow === 'ins') {
            sourceForEditForm[i].selectId = this.heightTypes[0].id.toString();
            sourceForEditForm[i].selectCode = this.heightTypes.find(
              (one: HeightType) => one.id === +sourceForEditForm[i].selectId).code;
            sourceForEditForm[i].selectName = this.heightTypes.find(
              (one: HeightType) => one.id === +sourceForEditForm[i].selectId).name;
          }
          if (this.typeEditWindow === 'upd') {
            sourceForEditForm[i].selectId = this.jqxgridComponent.selectRow.heightTypeId.toString();
            sourceForEditForm[i].selectCode = this.heightTypes.find(
              (heightType: HeightType) => heightType.id === +this.jqxgridComponent.selectRow.heightTypeId).code;
            sourceForEditForm[i].selectName = this.heightTypes.find(
              (heightType: HeightType) => heightType.id === +this.jqxgridComponent.selectRow.heightTypeId).name;
            for (let j = 0; j < this.heightTypes.length; j++) {
              if (+this.heightTypes[j].id === +this.jqxgridComponent.selectRow.heightTypeId) {
                sourceForEditForm[i].selectedIndex = j;
                break;
              }
            }
          }
          break;
        case 'serialNumber':
          if (this.typeEditWindow === 'upd') {
            sourceForEditForm[i].selectCode = this.jqxgridComponent.selectRow.serialNumber;
          }
          break;
        case 'comment':
          if (this.typeEditWindow === 'upd') {
            sourceForEditForm[i].selectCode = this.jqxgridComponent.selectRow.comment;
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

  saveLinkFormBtn(event: ItemsLinkForm) {
    if (event.Ids.length > 0) {
      if (event.code === this.sourceForLinkForm.window.code) {
        this.oSubLink = this.fixtureService.setNodeId(+this.selectNodeId, event.Ids).subscribe(
          response => {
            this.openSnackBar(this.translate.instant('site.menu.operator.fixture-page.fixture-masterdetails-page.fixturelist-page.place'),
              this.translate.instant('site.forms.editforms.ok'));
          },
          error => {
            this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok'));
            console.log(error.error.message);
          },
          () => {
            this.linkForm.closeDestroy();
            // refresh table
            this.refreshGrid();
          }
        );
      }
      if (event.code === this.sourceGrFixForLinkForm.window.code) {
        this.oSubLink = this.fixtureService.setFixtureInGroup(+this.fixtureGroupId, event.Ids).subscribe(
          response => {
            this.openSnackBar(this.translate.instant('site.menu.operator.fixture-page.fixture-masterdetails-page.fixturelist-page.groupIn'),
              this.translate.instant('site.forms.editforms.ok'));
          },
          error => {
            this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok'));
            console.log(error.error.message);
          },
          () => {
            this.linkFormGrFix.closeDestroy();
            // refresh table
            this.refreshGrid();
          }
        );
      }
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow =
        this.translate.instant('site.menu.operator.fixture-page.fixture-masterdetails-page.fixturelist-page.groupIn-warning2');
      this.eventWindow.openEventWindow();
    }
  }

  getSourceForLinkForm() {
    this.oSubForLinkWin = this.fixtureService.getAll({nodeId: 1}).subscribe(
      response => {
        this.sourceForLinkForm.grid.source = response;
        this.linkForm.refreshGrid();
      },
      error => {
        this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok'));
        console.log(error.error.message);
      }
    );
  }

  getSourceGrFixForLinkForm() {
    this.oSubForLinkWin = this.fixtureService.getFixtureInGroup('1').subscribe(
      response => {
        this.sourceGrFixForLinkForm.grid.source = response;
        this.linkFormGrFix.refreshGrid();
      },
      error => {
        this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok'));
        console.log(error.error.message);
      }
    );
  }

  destroyLinkForm() {
    this.isLinkFormInit = false;
  }

  destroyLinkFormGrFix() {
    this.isLinkFormGrFixInit = false;
  }

  // EVENT FORM

  okEvenwinBtn() {
    const fixtureIds = [];
    for (let i = 0; i < this.jqxgridComponent.myGrid.widgetObject.selectedrowindexes.length; i++) {
      fixtureIds[i] = this.jqxgridComponent.source_jqxgrid.localdata[
        this.jqxgridComponent.myGrid.widgetObject.selectedrowindexes[i]].fixtureId;
    }

    if (this.actionEventWindow === 'del') {
      const selectedrowindex = this.jqxgridComponent.myGrid.getselectedrowindex();
      const id = this.jqxgridComponent.myGrid.getrowid(selectedrowindex);

      if (+id >= 0) {
        this.fixtureService.del(+id).subscribe(
          response => {
            this.openSnackBar(this.translate.instant('site.menu.operator.fixture-page.fixture-masterdetails-page.fixturelist-page.del'),
              this.translate.instant('site.forms.editforms.ok'));
          },
          error => {
            this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok'))
            console.log(error.error.message);
          },
          () => {
            this.jqxgridComponent.refresh_del([+id]);
          }
        );
      }
    }

    if (this.actionEventWindow === 'pinDrop') {
      this.oSub = this.fixtureService.delNodeId(+this.selectNodeId, fixtureIds).subscribe(
        response => {
          this.openSnackBar(this.translate.instant('site.menu.operator.fixture-page.fixture-masterdetails-page.fixturelist-page.pinDrop'),
            this.translate.instant('site.forms.editforms.ok'));
        },
        error => {
          this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok'));
          console.log(error.error.message);
        },
        () => {
          // refresh table
          this.refreshGrid();
        }
      );
    }

    if (this.actionEventWindow === 'groupOut') {
      this.oSub = this.fixtureService.delFixtureInGroup(+this.fixtureGroupId, fixtureIds).subscribe(
        response => {
          this.openSnackBar(this.translate.instant('site.menu.operator.fixture-page.fixture-masterdetails-page.fixturelist-page.groupOut'),
            this.translate.instant('site.forms.editforms.ok'));
        },
        error => {
          this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok'));
          console.log(error.error.message);
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



