import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  EquipmentType,
  Contract, SensorType,
  SettingButtonPanel,
  SettingWinForEditForm,
  SourceForEditForm,
  SourceForJqxGrid
} from '../shared/interfaces';
import {NodeTypeService} from '../shared/services/node/nodeType.service';
import {Subscription} from 'rxjs';
import {SensorTypeService} from '../shared/services/sensor/sensorType.service';
import {SimpleHandbookComponent} from '../shared/components/simple-handbook/simple-handbook.component';
import {MaterialService} from '../shared/classes/material.service';
import {GatewayTypeService} from '../shared/services/gateway/gatewayType.service';
import {FixtureTypeService} from '../shared/services/fixture/fixtureType.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-equipment-type',
  templateUrl: './equipment-type.component.html',
  styleUrls: ['./equipment-type.component.css']
})
export class EquipmentTypeComponent implements OnInit, OnDestroy {

  // variables from master component

  // determine the functions that need to be performed in the parent component

  // define variables - link to view objects
  @ViewChild('fixtureType') fixtureType: SimpleHandbookComponent;
  @ViewChild('nodeType') nodeType: SimpleHandbookComponent;
  @ViewChild('gatewayType') gatewayType: SimpleHandbookComponent;
  @ViewChild('sensorType') sensorType: SimpleHandbookComponent;

  // other variables
  handBookFixtureType = 'fixtureType';
  handBookNodeType = 'nodeType';
  handBookGatewayType = 'gatewayType';
  handBookSensorType = 'sensorType';
  // main

  // grid
  oSubFixtureType: Subscription;
  oSubNodeType: Subscription;
  oSubGatewayType: Subscription;
  oSubSensorType: Subscription;
  sourceForJqxGridFixtureType: SourceForJqxGrid;
  sourceForJqxGridNodeType: SourceForJqxGrid;
  sourceForJqxGridGatewayType: SourceForJqxGrid;
  sourceForJqxGridSensorType: SourceForJqxGrid;
  // filter

  // edit form
  settingWinForEditFormFixtureType: SettingWinForEditForm;
  settingWinForEditFormNodeType: SettingWinForEditForm;
  settingWinForEditFormGatewayType: SettingWinForEditForm;
  settingWinForEditFormSensorType: SettingWinForEditForm;
  sourceForEditFormFixtureType: SourceForEditForm[];
  sourceForEditFormNodeType: SourceForEditForm[];
  sourceForEditFormGatewayType: SourceForEditForm[];
  sourceForEditFormSensorType: SourceForEditForm[];

  // link form

  // event form


  constructor(private route: ActivatedRoute,
              private router: Router,
              public translate: TranslateService,
              private fixtureTypeService: FixtureTypeService,
              private nodeTypeService: NodeTypeService,
              private gatewayTypeService: GatewayTypeService,
              private sensorTypeService: SensorTypeService) {
  }

  ngOnInit() {
    // FIXTURETYPE

    // jqxgrid
    this.sourceForJqxGridFixtureType = {
      listbox: {
        source: [
          {label: 'Id', value: 'id', checked: true},
          {label: 'Код', value: 'code', checked: true},
          {label: 'Наименование', value: 'name', checked: true},
          {label: 'Модель', value: 'model', checked: true},

          {label: 'Высота', value: 'height', checked: true},
          {label: 'Ширина', value: 'width', checked: true},
          // {label: 'Длина', value: 'length', checked: true},
          {label: 'Вес', value: 'weight', checked: true},

          {label: 'Число ламп', value: 'countlamp', checked: true},
          {label: 'Энергопотребление', value: 'power', checked: true},
          {label: 'Коэффициент мощности', value: 'cos', checked: true},
          {label: 'Степень защиты', value: 'ip', checked: true},
          {label: 'Энергосбережение', value: 'efficiency', checked: true},

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
          {text: 'Код', datafield: 'code', width: 150},
          {text: 'Наименование', datafield: 'name', width: 150},
          {text: 'Модель', datafield: 'model', width: 150},

          {text: 'Высота', datafield: 'height', width: 150},
          {text: 'Ширина', datafield: 'width', width: 150},
          {text: 'Длина', datafield: 'length', width: 150},
          {text: 'Вес', datafield: 'weight', width: 150},

          {text: 'Число ламп', datafield: 'countlamp', width: 150},
          {text: 'Энергопотребление', datafield: 'power', width: 150},
          {text: 'Коэффициент мощности', datafield: 'cos', width: 150},
          {text: 'Степень защиты', datafield: 'ip', width: 150},
          {text: 'Энергосбережение', datafield: 'efficiency', width: 150},

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
    this.settingWinForEditFormFixtureType = {
      code: 'editFormFixture',
      name: 'Добавить/редактировать',
      theme: 'material',
      isModal: true,
      modalOpacity: 0.3,
      width: 500,
      maxWidth: 500,
      minWidth: 500,
      height: 500,
      maxHeight: 500,
      minHeight: 500,
      coordX: 500,
      coordY: 65
    };

    // definde edit form
    this.sourceForEditFormFixtureType = [
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
        nameField: 'model',
        type: 'jqxTextArea',
        source: [],
        theme: 'material',
        width: '280',
        height: '20',
        placeHolder: 'Модель:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },

      {
        nameField: 'height',
        type: 'jqxNumberInput',
        source: [],
        theme: 'material',
        width: '280',
        height: '20',
        placeHolder: 'Высота:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'width',
        type: 'jqxNumberInput',
        source: [],
        theme: 'material',
        width: '280',
        height: '20',
        placeHolder: 'Ширина:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'length',
        type: 'jqxNumberInput',
        source: [],
        theme: 'material',
        width: '280',
        height: '20',
        placeHolder: 'Длина:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'weight',
        type: 'jqxNumberInput',
        source: [],
        theme: 'material',
        width: '280',
        height: '20',
        placeHolder: 'Вес:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },

      {
        nameField: 'countlamp',
        type: 'jqxNumberInput',
        source: [],
        theme: 'material',
        width: '280',
        height: '20',
        placeHolder: 'Число ламп:',
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
        placeHolder: 'Энергопотребление:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'cos',
        type: 'jqxNumberInput',
        source: [],
        theme: 'material',
        width: '280',
        height: '20',
        placeHolder: 'Коэффициент мощности:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'ip',
        type: 'jqxNumberInput',
        source: [],
        theme: 'material',
        width: '280',
        height: '20',
        placeHolder: 'Степень защиты:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'efficiency',
        type: 'jqxNumberInput',
        source: [],
        theme: 'material',
        width: '280',
        height: '20',
        placeHolder: 'Энергосбережение:',
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

    // NODETYPE

    // jqxgrid
    this.sourceForJqxGridNodeType = {
      listbox: {
        source: [
          {label: 'Id', value: 'id', checked: true},
          {label: 'Код', value: 'code', checked: true},
          {label: 'Наименование', value: 'name', checked: true},
          {label: 'Модель', value: 'model', checked: true},
          {label: 'Высота столба/узла', value: 'height', checked: true},
          {label: 'Коментарий', value: 'comments', checked: true},
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
          {text: 'Код', datafield: 'code', width: 150},
          {text: 'Наименование', datafield: 'name', width: 150},
          {text: 'Модель', datafield: 'model', width: 150},
          {text: 'Высота столба/узла', datafield: 'height', width: 150},
          {text: 'Коментарий', datafield: 'comments', width: 150},
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
    this.settingWinForEditFormNodeType = {
      code: 'editFormNode',
      name: 'Добавить/редактировать',
      theme: 'material',
      isModal: true,
      modalOpacity: 0.3,
      width: 450,
      maxWidth: 450,
      minWidth: 450,
      height: 450,
      maxHeight: 450,
      minHeight: 450,
      coordX: 500,
      coordY: 65
    };

    // definde edit form
    this.sourceForEditFormNodeType = [
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
        nameField: 'model',
        type: 'jqxTextArea',
        source: [],
        theme: 'material',
        width: '280',
        height: '20',
        placeHolder: 'Модель:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'height',
        type: 'jqxNumberInput',
        source: [],
        theme: 'material',
        width: '280',
        height: '20',
        placeHolder: 'Высота столба/узла:',
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


    // GATEWAYTYPE

    // jqxgrid
    this.sourceForJqxGridGatewayType = {
      listbox: {
        source: [
          {label: 'Id', value: 'id', checked: true},
          {label: 'Код', value: 'code', checked: true},
          {label: 'Наименование', value: 'name', checked: true},
          {label: 'Модель', value: 'model', checked: true},
          {label: 'Стандарт связи', value: 'communicationStandard', checked: true},
          {label: 'Коментарий', value: 'comments', checked: true},
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
          {text: 'Код', datafield: 'code', width: 150},
          {text: 'Наименование', datafield: 'name', width: 150},
          {text: 'Модель', datafield: 'model', width: 150},
          {text: 'Стандарт связи', datafield: 'communicationStandard', width: 150},
          {text: 'Коментарий', datafield: 'comments', width: 150},
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
    this.settingWinForEditFormGatewayType = {
      code: 'editFormGateway',
      name: 'Добавить/редактировать',
      theme: 'material',
      isModal: true,
      modalOpacity: 0.3,
      width: 450,
      maxWidth: 450,
      minWidth: 450,
      height: 450,
      maxHeight: 450,
      minHeight: 450,
      coordX: 500,
      coordY: 65
    };

    // definde edit form
    this.sourceForEditFormGatewayType = [
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
        selectCode: '0',
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
        selectCode: '0',
        selectName: ''
      },
      {
        nameField: 'model',
        type: 'jqxTextArea',
        source: [],
        theme: 'material',
        width: '280',
        height: '20',
        placeHolder: 'Модель:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'communicationStandard',
        type: 'jqxTextArea',
        source: [],
        theme: 'material',
        width: '280',
        height: '20',
        placeHolder: 'Стандарт связи:',
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

    // SENSORTYPE

    // jqxgrid
    this.sourceForJqxGridSensorType = {
      listbox: {
        source: [
          {label: 'Id', value: 'id', checked: true},
          {label: 'Код', value: 'code', checked: true},
          {label: 'Наименование', value: 'name', checked: true},
          {label: 'Модель', value: 'model', checked: true},
          {label: 'Радиус действия', value: 'detectionRange', checked: true},
          {label: 'Коментарий', value: 'comments', checked: true},
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
          {text: 'Код', datafield: 'code', width: 150},
          {text: 'Наименование', datafield: 'name', width: 150},
          {text: 'Модель', datafield: 'model', width: 150},
          {text: 'Радиус действия', datafield: 'detectionRange', width: 150},
          {text: 'Коментарий', datafield: 'comments', width: 150},
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
    this.settingWinForEditFormSensorType = {
      code: 'editFormSensor',
      name: 'Добавить/редактировать',
      theme: 'material',
      isModal: true,
      modalOpacity: 0.3,
      width: 450,
      maxWidth: 450,
      minWidth: 450,
      height: 450,
      maxHeight: 450,
      minHeight: 450,
      coordX: 500,
      coordY: 65
    };

    // definde edit form
    this.sourceForEditFormSensorType = [
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
        selectCode: '0',
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
        selectCode: '0',
        selectName: ''
      },
      {
        nameField: 'model',
        type: 'jqxTextArea',
        source: [],
        theme: 'material',
        width: '280',
        height: '20',
        placeHolder: 'Модель:',
        displayMember: 'code',
        valueMember: 'id',
        selectedIndex: null,
        selectId: '',
        selectCode: '',
        selectName: ''
      },
      {
        nameField: 'detectionRange',
        type: 'jqxNumberInput',
        source: [],
        theme: 'material',
        width: '280',
        height: '20',
        placeHolder: 'Радиус действия:',
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
  }

  ngOnDestroy() {
    if (this.oSubFixtureType) {
      this.oSubFixtureType.unsubscribe();
    }
    if (this.oSubNodeType) {
      this.oSubNodeType.unsubscribe();
    }
    if (this.oSubGatewayType) {
      this.oSubGatewayType.unsubscribe();
    }
    if (this.oSubSensorType) {
      this.oSubSensorType.unsubscribe();
    }
  }

  // GRID

  getAll() {
    this.oSubFixtureType = this.fixtureTypeService.getAll().subscribe(items => {
      this.sourceForJqxGridFixtureType.grid.source = items;
    });
    this.oSubNodeType = this.nodeTypeService.getAll().subscribe(items => {
      this.sourceForJqxGridNodeType.grid.source = items;
    });
    this.oSubGatewayType = this.gatewayTypeService.getAll().subscribe(items => {
      this.sourceForJqxGridGatewayType.grid.source = items;
    });
    this.oSubSensorType = this.sensorTypeService.getAll().subscribe(items => {
      this.sourceForJqxGridSensorType.grid.source = items;
    });
  }

  getSourceForJqxGrid(handBookType: any) {
    switch (handBookType) {
      case 'fixtureType':
        this.oSubFixtureType = this.fixtureTypeService.getAll().subscribe(items => {
          this.sourceForJqxGridFixtureType.grid.source = items;
          this.fixtureType.loading = false;
          this.fixtureType.reloading = false;
        });
        break;
      case 'nodeType':
        this.oSubNodeType = this.nodeTypeService.getAll().subscribe(items => {
          this.sourceForJqxGridNodeType.grid.source = items;
          this.nodeType.loading = false;
          this.nodeType.reloading = false;
        });
        break;
      case 'gatewayType':
        this.oSubGatewayType = this.gatewayTypeService.getAll().subscribe(items => {
          this.sourceForJqxGridGatewayType.grid.source = items;
          this.gatewayType.loading = false;
          this.gatewayType.reloading = false;
        });
        break;
      case 'sensorType':
        this.oSubSensorType = this.sensorTypeService.getAll().subscribe(items => {
          this.sourceForJqxGridSensorType.grid.source = items;
          this.sensorType.loading = false;
          this.sensorType.reloading = false;
        });
        break;
      default:
        break;
    }
  }

  getHeadline() {
    let headline: any;
    switch (this.router.url) {
      case '/handbook/equipment/fixturetype':
        headline = this.translate.instant( 'site.menu.handbooks.fixturetype-headline');
        break;
      case '/handbook/equipment/nodetype':
        headline = this.translate.instant( 'site.menu.handbooks.nodetype-headline');
        break;
      case '/handbook/equipment/gatewaytype':
        headline = this.translate.instant( 'site.menu.handbooks.gatewaytype-headline');
        break;
      case '/handbook/equipment/sensortype':
        headline = this.translate.instant( 'site.menu.handbooks.sensortype-headline');
        break;
      default:
        headline = this.translate.instant( 'site.menu.handbooks.handbooks-headline');
    ;
  }
    return headline;
  }

  saveEditwinBtn(saveEditwinObject: any) {
    let selectObject: any;
    switch (saveEditwinObject.handBookType) {
      case 'fixtureType':
        selectObject = saveEditwinObject.selectObject;
        if (saveEditwinObject.typeEditWindow === 'ins') {
          // definde param before ins

          // ins
          this.oSubFixtureType = this.fixtureTypeService.ins(selectObject).subscribe(
            response => {
              selectObject.id = +response;
              MaterialService.toast(`Тип светильника c id = ${selectObject.id} был добавлен.`);
            },
            error => MaterialService.toast(error.error.message),
            () => {
              // close edit window
              this.fixtureType.editWindow.closeDestroyWindow();
              // update data source
              this.fixtureType.jqxgridComponent.refresh_ins(selectObject.id, selectObject);
            }
          );
        }
        if (saveEditwinObject.typeEditWindow === 'upd') {
          // definde param befor upd
          this.fixtureType.jqxgridComponent.selectRow.code = selectObject.code;
          this.fixtureType.jqxgridComponent.selectRow.name = selectObject.name;
          this.fixtureType.jqxgridComponent.selectRow.model = selectObject.model;
          this.fixtureType.jqxgridComponent.selectRow.comments = selectObject.comments;

          this.fixtureType.jqxgridComponent.selectRow.height = selectObject.height;
          this.fixtureType.jqxgridComponent.selectRow.width = selectObject.width;
          this.fixtureType.jqxgridComponent.selectRow.length = selectObject.length;
          this.fixtureType.jqxgridComponent.selectRow.weight = selectObject.weight;

          this.fixtureType.jqxgridComponent.selectRow.countlamp = selectObject.countlamp;
          this.fixtureType.jqxgridComponent.selectRow.power = selectObject.power;
          this.fixtureType.jqxgridComponent.selectRow.cos = selectObject.cos;
          this.fixtureType.jqxgridComponent.selectRow.ip = selectObject.ip;
          this.fixtureType.jqxgridComponent.selectRow.efficiency = selectObject.efficiency;

          // upd
          this.oSubFixtureType = this.fixtureTypeService.upd(selectObject).subscribe(
            response => {
              MaterialService.toast(`Тип светильника c id = ${selectObject.id} был обновлен.`);
            },
            error => MaterialService.toast(error.error.message),
            () => {
              // close edit window
              this.fixtureType.editWindow.closeDestroyWindow();
              // update data source
              this.fixtureType.jqxgridComponent.refresh_upd(selectObject.id, this.fixtureType.jqxgridComponent.selectRow);
            }
          );
        }
        break;
      case 'nodeType':
        selectObject = saveEditwinObject.selectObject;
        if (saveEditwinObject.typeEditWindow === 'ins') {
          // definde param before ins

          // ins
          this.oSubNodeType = this.nodeTypeService.ins(selectObject).subscribe(
            response => {
              selectObject.id = +response;
              MaterialService.toast(`Тип узла/столба c id = ${selectObject.id} был добавлен.`);
            },
            error => MaterialService.toast(error.error.message),
            () => {
              // close edit window
              this.nodeType.editWindow.closeDestroyWindow();
              // update data source
              this.nodeType.jqxgridComponent.refresh_ins(selectObject.id, selectObject);
            }
          );
        }
        if (saveEditwinObject.typeEditWindow === 'upd') {
          // definde param befor upd
          this.nodeType.jqxgridComponent.selectRow.code = selectObject.code;
          this.nodeType.jqxgridComponent.selectRow.name = selectObject.name;
          this.nodeType.jqxgridComponent.selectRow.model = selectObject.model;
          this.nodeType.jqxgridComponent.selectRow.comments = selectObject.comments;
          this.nodeType.jqxgridComponent.selectRow.height = selectObject.height;

          // upd
          this.oSubNodeType = this.nodeTypeService.upd(selectObject).subscribe(
            response => {
              MaterialService.toast(`Тип узла/столба c id = ${this.nodeType.jqxgridComponent.selectRow.id} был обновлен.`);
            },
            error => MaterialService.toast(error.error.message),
            () => {
              // close edit window
              this.nodeType.editWindow.closeDestroyWindow();
              // update data source
              this.nodeType.jqxgridComponent.refresh_upd(
                this.nodeType.jqxgridComponent.selectRow.id, this.nodeType.jqxgridComponent.selectRow);
            }
          );
        }
        break;
      case 'gatewayType':
        selectObject = saveEditwinObject.selectObject;
        if (saveEditwinObject.typeEditWindow === 'ins') {
          // definde param before ins

          // ins
          this.oSubGatewayType = this.gatewayTypeService.ins(selectObject).subscribe(
            response => {
              selectObject.id = +response;
              MaterialService.toast(`Тип интернет шлюза c id = ${selectObject.id} был добавлен.`);
            },
            error => MaterialService.toast(error.error.message),
            () => {
              // close edit window
              this.gatewayType.editWindow.closeDestroyWindow();
              // update data source
              this.gatewayType.jqxgridComponent.refresh_ins(selectObject.id, selectObject);
            }
          );
        }
        if (saveEditwinObject.typeEditWindow === 'upd') {
          // definde param befor upd
          this.gatewayType.jqxgridComponent.selectRow.code = selectObject.code;
          this.gatewayType.jqxgridComponent.selectRow.name = selectObject.name;
          this.gatewayType.jqxgridComponent.selectRow.model = selectObject.model;
          this.gatewayType.jqxgridComponent.selectRow.comments = selectObject.comments;
          this.gatewayType.jqxgridComponent.selectRow.communicationStandard = selectObject.communicationStandard;

          // upd
          this.oSubGatewayType = this.gatewayTypeService.upd(selectObject).subscribe(
            response => {
              MaterialService.toast(`Тип интернет шлюза c id = ${this.gatewayType.jqxgridComponent.selectRow.id} был обновлен.`);
            },
            error => MaterialService.toast(error.error.message),
            () => {
              // close edit window
              this.gatewayType.editWindow.closeDestroyWindow();
              // update data source
              this.gatewayType.jqxgridComponent.refresh_upd(
                this.gatewayType.jqxgridComponent.selectRow.id, this.gatewayType.jqxgridComponent.selectRow);
            }
          );
        }

        break;
      case 'sensorType':
        selectObject = saveEditwinObject.selectObject;
        if (saveEditwinObject.typeEditWindow === 'ins') {
          // definde param before ins

          // ins
          this.oSubSensorType = this.sensorTypeService.ins(selectObject).subscribe(
            response => {
              selectObject.id = +response;
              MaterialService.toast(`Тип датчика c id = ${selectObject.id} был добавлен.`);
            },
            error => MaterialService.toast(error.error.message),
            () => {
              // close edit window
              this.sensorType.editWindow.closeDestroyWindow();
              // update data source
              this.sensorType.jqxgridComponent.refresh_ins(selectObject.id, selectObject);
            }
          );
        }
        if (saveEditwinObject.typeEditWindow === 'upd') {
          // definde param befor upd
          this.sensorType.jqxgridComponent.selectRow.code = selectObject.code;
          this.sensorType.jqxgridComponent.selectRow.name = selectObject.name;
          this.sensorType.jqxgridComponent.selectRow.model = selectObject.model;
          this.sensorType.jqxgridComponent.selectRow.comments = selectObject.comments;
          this.sensorType.jqxgridComponent.selectRow.detectionRange = selectObject.detectionRange;

          // upd
          this.oSubSensorType = this.sensorTypeService.upd(selectObject).subscribe(
            response => {
              MaterialService.toast(`Тип датчика c id = ${this.sensorType.jqxgridComponent.selectRow.id} был обновлен.`);
            },
            error => MaterialService.toast(error.error.message),
            () => {
              // close edit window
              this.sensorType.editWindow.closeDestroyWindow();
              // update data source
              this.sensorType.jqxgridComponent.refresh_upd(
                this.sensorType.jqxgridComponent.selectRow.id, this.sensorType.jqxgridComponent.selectRow);
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
      case 'fixtureType':
        if (okEvenwinObject.actionEventWindow === 'del') {
          if (+okEvenwinObject.id >= 0) {
            this.fixtureTypeService.del(+okEvenwinObject.id).subscribe(
              response => {
                MaterialService.toast('Тип оборудования был удален!');
              },
              error => MaterialService.toast(error.error.message),
              () => {
                this.fixtureType.jqxgridComponent.refresh_del([+okEvenwinObject.id]);
              }
            );
          }
        }
        break;
      case 'nodeType':
        if (okEvenwinObject.actionEventWindow === 'del') {
          if (+okEvenwinObject.id >= 0) {
            this.nodeTypeService.del(+okEvenwinObject.id).subscribe(
              response => {
                MaterialService.toast('Тип оборудования был удален!');
              },
              error => MaterialService.toast(error.error.message),
              () => {
                this.nodeType.jqxgridComponent.refresh_del([+okEvenwinObject.id]);
              }
            );
          }
        }
        break;
      case 'gatewayType':
        if (okEvenwinObject.actionEventWindow === 'del') {
          if (+okEvenwinObject.id >= 0) {
            this.gatewayTypeService.del(+okEvenwinObject.id).subscribe(
              response => {
                MaterialService.toast('Тип интернет шлюза был удален!');
              },
              error => MaterialService.toast(error.error.message),
              () => {
                this.gatewayType.jqxgridComponent.refresh_del([+okEvenwinObject.id]);
              }
            );
          }
        }
        break;
      case 'sensorType':
        if (okEvenwinObject.actionEventWindow === 'del') {
          if (+okEvenwinObject.id >= 0) {
            this.sensorTypeService.del(+okEvenwinObject.id).subscribe(
              response => {
                MaterialService.toast('Тип датчика был удален!');
              },
              error => MaterialService.toast(error.error.message),
              () => {
                this.sensorType.jqxgridComponent.refresh_del([+okEvenwinObject.id]);
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
