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
import {NodeTypeService} from '../../shared/services/node/nodeType.service';
import {SensorTypeService} from '../../shared/services/sensor/sensorType.service';
import {GatewayTypeService} from '../../shared/services/gateway/gatewayType.service';
import {FixtureTypeService} from '../../shared/services/fixture/fixtureType.service';
// app components
import {SimpleDictionaryComponent} from '../../shared/components/simple-dictionary/simple-dictionary.component';


@Component({
  selector: 'app-equipment-type',
  templateUrl: './equipment-type.component.html',
  styleUrls: ['./equipment-type.component.css']
})
export class EquipmentTypeComponent implements OnInit, OnDestroy {

  // variables from parent component
  @Input() heightGrid: number;

  // determine the functions that need to be performed in the parent component

  // define variables - link to view objects
  @ViewChild('fixtureType', {static: false}) fixtureType: SimpleDictionaryComponent;
  @ViewChild('nodeType', {static: false}) nodeType: SimpleDictionaryComponent;
  @ViewChild('gatewayType', {static: false}) gatewayType: SimpleDictionaryComponent;
  @ViewChild('sensorType', {static: false}) sensorType: SimpleDictionaryComponent;

  // other variables
  dictionaryFixtureType = 'fixtureType';
  dictionaryNodeType = 'nodeType';
  dictionaryGatewayType = 'gatewayType';
  dictionarySensorType = 'sensorType';
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
  columnsGridFixtureTypes: any[];
  listBoxSourceFixtureTypes: any[];
  columnsGridFixtureTypesEng: any[];
  listBoxSourceFixtureTypesEng: any[];
  columnsGridNodeTypes: any[];
  listBoxSourceNodeTypes: any[];
  columnsGridNodeTypesEng: any[];
  listBoxSourceNodeTypesEng: any[];
  columnsGridGatewayTypes: any[];
  listBoxSourceGatewayTypes: any[];
  columnsGridGatewayTypesEng: any[];
  listBoxSourceGatewayTypesEng: any[];
  columnsGridSensorTypes: any[];
  listBoxSourceSensorTypes: any[];
  columnsGridSensorTypesEng: any[];
  listBoxSourceSensorTypesEng: any[];
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
  sourceForEditFormFixtureTypeEng: SourceForEditForm[];
  sourceForEditFormNodeTypeEng: SourceForEditForm[];
  sourceForEditFormGatewayTypeEng: SourceForEditForm[];
  sourceForEditFormSensorTypeEng: SourceForEditForm[];
  // link form
  // event form


  constructor(private route: ActivatedRoute,
              private router: Router,
              private _snackBar: MatSnackBar,
              // service
              public translate: TranslateService,
              private fixtureTypeService: FixtureTypeService,
              private nodeTypeService: NodeTypeService,
              private gatewayTypeService: GatewayTypeService,
              private sensorTypeService: SensorTypeService) {
  }

  ngOnInit() {
    // FIXTURETYPE
    // definde columns
    this.columnsGridFixtureTypes =
      [
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
      ];
    this.listBoxSourceFixtureTypes =
      [
        {label: 'Id', value: 'id', checked: true},
        {label: 'Код', value: 'code', checked: true},
        {label: 'Наименование', value: 'name', checked: true},
        {label: 'Модель', value: 'model', checked: true},
        {label: 'Высота', value: 'height', checked: true},
        {label: 'Ширина', value: 'width', checked: true},
        {label: 'Вес', value: 'weight', checked: true},
        {label: 'Число ламп', value: 'countlamp', checked: true},
        {label: 'Энергопотребление', value: 'power', checked: true},
        {label: 'Коэффициент мощности', value: 'cos', checked: true},
        {label: 'Степень защиты', value: 'ip', checked: true},
        {label: 'Энергосбережение', value: 'efficiency', checked: true},
        {label: 'Коментарий', value: 'comments', checked: true}
      ];
    this.columnsGridFixtureTypesEng =
      [
        {text: 'Id', datafield: 'id', width: 50},
        {text: 'Code', datafield: 'code', width: 150},
        {text: 'Name', datafield: 'name', width: 150},
        {text: 'Model', datafield: 'model', width: 150},
        {text: 'Height', datafield: 'height', width: 150},
        {text: 'Width', datafield: 'width', width: 150},
        {text: 'Length', datafield: 'length', width: 150},
        {text: 'Weight', datafield: 'weight', width: 150},
        {text: 'Number of lamps', datafield: 'countlamp', width: 150},
        {text: 'Power consumption', datafield: 'power', width: 150},
        {text: 'Power factor', datafield: 'cos', width: 150},
        {text: 'Security rating', datafield: 'ip', width: 150},
        {text: 'Energy Saving', datafield: 'efficiency', width: 150},
        {text: 'Comments', datafield: 'comments', width: 150}
      ];
    this.listBoxSourceFixtureTypesEng =
      [
        {label: 'Id', value: 'id', checked: true},
        {label: 'Code', value: 'code', checked: true},
        {label: 'Name', value: 'name', checked: true},
        {label: 'Model', value: 'model', checked: true},
        {label: 'Height', value: 'height', checked: true},
        {label: 'Width', value: 'width', checked: true},
        {label: 'Weight', value: 'weight', checked: true},
        {label: 'Number of lamps', value: 'countlamp', checked: true},
        {label: 'Power consumption', value: 'power', checked: true},
        {label: 'Power factor', value: 'cos', checked: true},
        {label: 'Security rating', value: 'ip', checked: true},
        {label: 'Energy Saving', value: 'efficiency', checked: true},
        {label: 'Comments', value: 'comments', checked: true}
      ];

    // jqxgrid
    this.sourceForJqxGridFixtureType = {
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
    this.settingWinForEditFormFixtureType = {
      code: 'editFormFixture',
      name: 'Add / edit fixture type',
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
    this.sourceForEditFormFixtureTypeEng = [
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
        nameField: 'model',
        type: 'jqxTextArea',
        source: [],
        theme: 'material',
        width: '280',
        height: '20',
        placeHolder: 'Model:',
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
        placeHolder: 'Height:',
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
        placeHolder: 'Width:',
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
        placeHolder: 'Length:',
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
        placeHolder: 'Weight:',
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
        placeHolder: 'Number of lamps:',
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
        placeHolder: 'Power consumption:',
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
        placeHolder: 'Power factor:',
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
        placeHolder: 'Security rating:',
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
        placeHolder: 'Energy Saving:',
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

    // NODETYPE
    // definde columns
    this.columnsGridNodeTypes =
      [
        {text: 'Id', datafield: 'id', width: 50},
        {text: 'Код', datafield: 'code', width: 150},
        {text: 'Наименование', datafield: 'name', width: 150},
        {text: 'Модель', datafield: 'model', width: 150},
        {text: 'Высота столба/узла', datafield: 'height', width: 150},
        {text: 'Коментарий', datafield: 'comments', width: 150},
      ];
    this.listBoxSourceNodeTypes =
      [
        {label: 'Id', value: 'id', checked: true},
        {label: 'Код', value: 'code', checked: true},
        {label: 'Наименование', value: 'name', checked: true},
        {label: 'Модель', value: 'model', checked: true},
        {label: 'Высота столба/узла', value: 'height', checked: true},
        {label: 'Коментарий', value: 'comments', checked: true},
      ];
    this.columnsGridNodeTypesEng =
      [
        {text: 'Id', datafield: 'id', width: 50},
        {text: 'Code', datafield: 'code', width: 150},
        {text: 'Name', datafield: 'name', width: 150},
        {text: 'Model', datafield: 'model', width: 150},
        {text: 'Height', datafield: 'height', width: 150},
        {text: 'Comments', datafield: 'comments', width: 150},
      ];
    this.listBoxSourceNodeTypesEng =
      [
        {label: 'Id', value: 'id', checked: true},
        {label: 'Code', value: 'code', checked: true},
        {label: 'Name', value: 'name', checked: true},
        {label: 'Model', value: 'model', checked: true},
        {label: 'Height', value: 'height', checked: true},
        {label: 'Comments', value: 'comments', checked: true},
      ];

    // jqxgrid
    this.sourceForJqxGridNodeType = {
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
    this.settingWinForEditFormNodeType = {
      code: 'editFormNode',
      name: 'Add / edit node type',
      theme: 'material',
      isModal: true,
      modalOpacity: 0.3,
      width: 450,
      maxWidth: 450,
      minWidth: 450,
      height: 460,
      maxHeight: 460,
      minHeight: 460,
      coordX: 500,
      coordY: 65
    };
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
    this.sourceForEditFormNodeTypeEng = [
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
        nameField: 'model',
        type: 'jqxTextArea',
        source: [],
        theme: 'material',
        width: '280',
        height: '20',
        placeHolder: 'Model:',
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
        placeHolder: 'Height:',
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

    // GATEWAYTYPE
    // definde columns
    this.columnsGridGatewayTypes =
      [
        {text: 'Id', datafield: 'id', width: 50},
        {text: 'Код', datafield: 'code', width: 150},
        {text: 'Наименование', datafield: 'name', width: 150},
        {text: 'Модель', datafield: 'model', width: 150},
        {text: 'Стандарт связи', datafield: 'communicationStandard', width: 150},
        {text: 'Коментарий', datafield: 'comments', width: 150},
      ];
    this.listBoxSourceGatewayTypes =
      [
        {label: 'Id', value: 'id', checked: true},
        {label: 'Код', value: 'code', checked: true},
        {label: 'Наименование', value: 'name', checked: true},
        {label: 'Модель', value: 'model', checked: true},
        {label: 'Стандарт связи', value: 'communicationStandard', checked: true},
        {label: 'Коментарий', value: 'comments', checked: true},
      ];
    this.columnsGridGatewayTypesEng =
      [
        {text: 'Id', datafield: 'id', width: 50},
        {text: 'Code', datafield: 'code', width: 150},
        {text: 'Name', datafield: 'name', width: 150},
        {text: 'Model', datafield: 'model', width: 150},
        {text: 'Communication standard', datafield: 'communicationStandard', width: 150},
        {text: 'Comments', datafield: 'comments', width: 150},
      ];
    this.listBoxSourceGatewayTypesEng =
      [
        {label: 'Id', value: 'id', checked: true},
        {label: 'Code', value: 'code', checked: true},
        {label: 'Name', value: 'name', checked: true},
        {label: 'Model', value: 'model', checked: true},
        {label: 'Communication standard', value: 'communicationStandard', checked: true},
        {label: 'Comments', value: 'comments', checked: true},
      ];

    // jqxgrid
    this.sourceForJqxGridGatewayType = {
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
    this.settingWinForEditFormGatewayType = {
      code: 'editFormGateway',
      name: 'Add / edit gateway type',
      theme: 'material',
      isModal: true,
      modalOpacity: 0.3,
      width: 450,
      maxWidth: 450,
      minWidth: 450,
      height: 470,
      maxHeight: 470,
      minHeight: 470,
      coordX: 500,
      coordY: 65
    };
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
    this.sourceForEditFormGatewayTypeEng = [
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
        placeHolder: 'Name:',
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
        placeHolder: 'Model:',
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
        placeHolder: 'Communication standard:',
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

    // SENSORTYPE
    // definde columns
    this.columnsGridSensorTypes =
      [
        {text: 'Id', datafield: 'id', width: 50},
        {text: 'Код', datafield: 'code', width: 150},
        {text: 'Наименование', datafield: 'name', width: 150},
        {text: 'Модель', datafield: 'model', width: 150},
        {text: 'Радиус действия', datafield: 'detectionRange', width: 150},
        {text: 'Коментарий', datafield: 'comments', width: 150},
      ];
    this.listBoxSourceSensorTypes =
      [
        {label: 'Id', value: 'id', checked: true},
        {label: 'Код', value: 'code', checked: true},
        {label: 'Наименование', value: 'name', checked: true},
        {label: 'Модель', value: 'model', checked: true},
        {label: 'Радиус действия', value: 'detectionRange', checked: true},
        {label: 'Коментарий', value: 'comments', checked: true},
      ];
    this.columnsGridSensorTypesEng =
      [
        {text: 'Id', datafield: 'id', width: 50},
        {text: 'Code', datafield: 'code', width: 150},
        {text: 'Name', datafield: 'name', width: 150},
        {text: 'Model', datafield: 'model', width: 150},
        {text: 'Radius of action', datafield: 'detectionRange', width: 150},
        {text: 'Comments', datafield: 'comments', width: 150},
      ];
    this.listBoxSourceSensorTypesEng =
      [
        {label: 'Id', value: 'id', checked: true},
        {label: 'Code', value: 'code', checked: true},
        {label: 'Name', value: 'name', checked: true},
        {label: 'Model', value: 'model', checked: true},
        {label: 'Radius of action', value: 'detectionRange', checked: true},
        {label: 'Comments', value: 'comments', checked: true},
      ];

    // jqxgrid
    this.sourceForJqxGridSensorType = {
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
    this.settingWinForEditFormSensorType = {
      code: 'editFormSensor',
      name: 'Add / edit sensor type',
      theme: 'material',
      isModal: true,
      modalOpacity: 0.3,
      width: 450,
      maxWidth: 450,
      minWidth: 450,
      height: 460,
      maxHeight: 460,
      minHeight: 460,
      coordX: 500,
      coordY: 65
    };
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
    this.sourceForEditFormSensorTypeEng = [
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
        placeHolder: 'Name:',
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
        placeHolder: 'Model:',
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
        placeHolder: 'Radius of action:',
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

  getSourceForJqxGrid(dictionaryType: any) {
    switch (dictionaryType) {
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
      case '/dictionary/equipment/fixturetype':
        headline = this.translate.instant('site.menu.dictionarys.equipment-page.fixturetype.fixturetypes-headline');
        break;
      case '/dictionary/equipment/nodetype':
        headline = this.translate.instant('site.menu.dictionarys.equipment-page.nodetype.nodetypes-headline');
        break;
      case '/dictionary/equipment/gatewaytype':
        headline = this.translate.instant('site.menu.dictionarys.equipment-page.gatewaytype.gatewaytypes-headline');
        break;
      case '/dictionary/equipment/sensortype':
        headline = this.translate.instant('site.menu.dictionarys.equipment-page.sensortype.sensortypes-headline');
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
      case 'fixtureType':
        selectObject = saveEditwinObject.selectObject;
        if (saveEditwinObject.typeEditWindow === 'ins') {
          // definde param before ins
          // ins
          this.oSubFixtureType = this.fixtureTypeService.ins(selectObject).subscribe(
            response => {
              selectObject.id = +response;
              this.openSnackBar(this.translate.instant('site.menu.dictionarys.equipment-page.fixturetype.ins')
                + selectObject.id, this.translate.instant('site.forms.editforms.ok'));
            },
            error =>
              this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok')),
            () => {
              // close edit window
              this.fixtureType.editForm.closeDestroy();
              // update data source
              this.fixtureType.jqxgridComponent.refresh_ins(selectObject.id, selectObject);
              // refresh temp
              this.getSourceForJqxGrid(saveEditwinObject.dictionaryType);
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
              this.openSnackBar(this.translate.instant('site.menu.dictionarys.equipment-page.fixturetype.upd')
                + this.fixtureType.jqxgridComponent.selectRow.id, this.translate.instant('site.forms.editforms.ok'));
            },
            error =>
              this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok')),
            () => {
              // close edit window
              this.fixtureType.editForm.closeDestroy();
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
              this.openSnackBar(this.translate.instant('site.menu.dictionarys.equipment-page.nodetype.ins')
                + selectObject.id, this.translate.instant('site.forms.editforms.ok'));
            },
            error =>
              this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok')),
            () => {
              // close edit window
              this.nodeType.editForm.closeDestroy();
              // update data source
              this.nodeType.jqxgridComponent.refresh_ins(selectObject.id, selectObject);
              // refresh temp
              this.getSourceForJqxGrid(saveEditwinObject.dictionaryType);
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
              this.openSnackBar(this.translate.instant('site.menu.dictionarys.equipment-page.nodetype.upd')
                + this.nodeType.jqxgridComponent.selectRow.id, this.translate.instant('site.forms.editforms.ok'));
            },
            error =>
              this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok')),
            () => {
              // close edit window
              this.nodeType.editForm.closeDestroy();
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
              this.openSnackBar(this.translate.instant('site.menu.dictionarys.equipment-page.gatewaytype.ins')
                + selectObject.id, this.translate.instant('site.forms.editforms.ok'));
            },
            error =>
              this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok')),
            () => {
              // close edit window
              this.gatewayType.editForm.closeDestroy();
              // update data source
              this.gatewayType.jqxgridComponent.refresh_ins(selectObject.id, selectObject);
              // refresh temp
              this.getSourceForJqxGrid(saveEditwinObject.dictionaryType);
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
              this.openSnackBar(this.translate.instant('site.menu.dictionarys.equipment-page.gatewaytype.upd')
                + this.gatewayType.jqxgridComponent.selectRow.id, this.translate.instant('site.forms.editforms.ok'));
            },
            error =>
              this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok')),
            () => {
              // close edit window
              this.gatewayType.editForm.closeDestroy();
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
              this.openSnackBar(this.translate.instant('site.menu.dictionarys.equipment-page.sensortype.ins')
                + selectObject.id, this.translate.instant('site.forms.editforms.ok'));
            },
            error =>
              this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok')),
            () => {
              // close edit window
              this.sensorType.editForm.closeDestroy();
              // update data source
              this.sensorType.jqxgridComponent.refresh_ins(selectObject.id, selectObject);
              // refresh temp
              this.getSourceForJqxGrid(saveEditwinObject.dictionaryType);
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
              this.openSnackBar(this.translate.instant('site.menu.dictionarys.equipment-page.sensortype.upd')
                + this.sensorType.jqxgridComponent.selectRow.id, this.translate.instant('site.forms.editforms.ok'));
            },
            error =>
              this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok')),
            () => {
              // close edit window
              this.sensorType.editForm.closeDestroy();
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

  // LINK FORM

  // EVENT FORM

  okEvenwinBtn(okEvenwinObject: any) {
    switch (okEvenwinObject.dictionaryType) {
      case 'fixtureType':
        if (okEvenwinObject.actionEventWindow === 'del') {
          if (+okEvenwinObject.id >= 0) {
            this.fixtureTypeService.del(+okEvenwinObject.id).subscribe(
              response => {
                this.openSnackBar(this.translate.instant('site.menu.dictionarys.equipment-page.fixturetype.del'),
                  this.translate.instant('site.forms.editforms.ok'));
              },
              error =>
                this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok')),
              () => {
                this.fixtureType.jqxgridComponent.refresh_del([+okEvenwinObject.id]);
                // refresh temp
                this.getSourceForJqxGrid(okEvenwinObject.dictionaryType);
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
                this.openSnackBar(this.translate.instant('site.menu.dictionarys.equipment-page.nodetype.del'),
                  this.translate.instant('site.forms.editforms.ok'));
              },
              error =>
                this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok')),
              () => {
                this.nodeType.jqxgridComponent.refresh_del([+okEvenwinObject.id]);
                // refresh temp
                this.getSourceForJqxGrid(okEvenwinObject.dictionaryType);
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
                this.openSnackBar(this.translate.instant('site.menu.dictionarys.equipment-page.gatewaytype.del'),
                  this.translate.instant('site.forms.editforms.ok'));
              },
              error =>
                this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok')),
              () => {
                this.gatewayType.jqxgridComponent.refresh_del([+okEvenwinObject.id]);
                // refresh temp
                this.getSourceForJqxGrid(okEvenwinObject.dictionaryType);
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
                this.openSnackBar(this.translate.instant('site.menu.dictionarys.equipment-page.sensortype.del'),
                  this.translate.instant('site.forms.editforms.ok'));
              },
              error =>
                this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok')),
              () => {
                this.sensorType.jqxgridComponent.refresh_del([+okEvenwinObject.id]);
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
