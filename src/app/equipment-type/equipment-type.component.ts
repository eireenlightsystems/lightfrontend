import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  EquipmentType,
  NodeType, SensorType,
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

@Component({
  selector: 'app-equipment-type',
  templateUrl: './equipment-type.component.html',
  styleUrls: ['./equipment-type.component.css']
})
export class EquipmentTypeComponent implements OnInit, OnDestroy {

  // variables from master component

  // determine the functions that need to be performed in the parent component

  // define variables - link to view objects
  @ViewChild('nodeType') nodeType: SimpleHandbookComponent;

  // other variables
  settingButtonPanel: SettingButtonPanel;
  handBookNodeType = 'nodeType';
  handBookSensorType = 'sensorType';
  // main

  // grid
  oSubNodeType: Subscription;
  oSubSensorType: Subscription;

  // items: EquipmentType[] = [];
  // itemsNodeType: NodeType[] = [];
  // itemsSensorType: SensorType[] = [];

  sourceForJqxGridNodeType: SourceForJqxGrid;
  sourceForJqxGridSensorType: SourceForJqxGrid;
  // filter

  // edit form
  settingWinForEditFormNodeType: SettingWinForEditForm;
  settingWinForEditFormSensorType: SettingWinForEditForm;
  sourceForEditFormNodeType: SourceForEditForm[];
  sourceForEditFormSensorType: SourceForEditForm[];

  // link form

  // event form


  constructor(private route: ActivatedRoute,
              private router: Router,
              private nodeTypeService: NodeTypeService,
              private sensorTypeService: SensorTypeService) {
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
      filterNone: {
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
        height: 500,
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
        height: 500,
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
      maxWidth: 500,
      minWidth: 460,
      height: 480,
      maxHeight: 480,
      minHeight: 480,
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


    // SENSORTYPE

    // jqxgrid
    this.sourceForJqxGridSensorType = {
      listbox: {
        source: [
          {label: 'Id', value: 'id', checked: true},
          {label: 'Код', value: 'code', checked: true},
          {label: 'Наименование', value: 'name', checked: true},
          {label: 'Модель', value: 'model', checked: true},
          {label: 'Коментарий', value: 'comments', checked: true},
        ],
        theme: 'material',
        width: 150,
        height: 500,
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
          {text: 'Коментарий', datafield: 'comments', width: 150},
        ],
        theme: 'material',
        width: null,
        height: 500,
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
      code: 'editFormNode',
      name: 'Добавить/редактировать',
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

    this.getAll();
  }

  ngOnDestroy() {
    if (this.oSubNodeType) {
      this.oSubNodeType.unsubscribe();
    }
    if (this.oSubSensorType) {
      this.oSubSensorType.unsubscribe();
    }
  }

  // GRID

  getAll() {
    this.oSubNodeType = this.nodeTypeService.getAll().subscribe(items => {
      // this.itemsNodeType = items;
      this.sourceForJqxGridNodeType.grid.source = items;
    });
    this.oSubSensorType = this.sensorTypeService.getAll().subscribe(items => {
      // this.itemsSensorType = items;
      this.sourceForJqxGridSensorType.grid.source = items;
    });
  }

  getSourceForJqxGrid(handBookType: any) {
    switch (handBookType) {
      case 'typeFixture':

        break;
      case 'nodeType':
        this.oSubNodeType = this.nodeTypeService.getAll().subscribe(items => {
          this.sourceForJqxGridNodeType.grid.source = items;
          this.nodeType.loading = false;
          this.nodeType.reloading = false;
        });
        break;
      case 'gatewayType':

        break;
      case 'sensorType':

        break;
      default:
        break;
    }
  }

  getHeadline() {
    let headline: any;
    switch (this.router.url) {
      case '/handbook/equipment/nodetype':
        headline = 'Справочник типов узлов';
        break;
      case '/handbook/equipment/sensortype':
        headline = 'Справочник типов датчиков';
        break;
      default:
        headline = 'Выберите справочник для редактирования';
    }
    return headline;
  }

  saveEditwinBtn(saveEditwinObject: any) {
    switch (saveEditwinObject.handBookType) {
      case 'typeFixture':

        break;
      case 'nodeType':
        let selectObject: NodeType;
        selectObject = saveEditwinObject.selectObject;
        if (saveEditwinObject.typeEditWindow === 'ins') {
          // definde param before ins

          // ins
          this.oSubNodeType = this.nodeTypeService.ins(selectObject).subscribe(
            response => {
              selectObject.id = +response;
              MaterialService.toast(`Тип оборудования c id = ${selectObject.id} был добавлен.`);
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
          // this.nodeType.jqxgridComponent.selectRow.code = selectObject.code;
          // this.nodeType.jqxgridComponent.selectRow.name = selectObject.name;
          // this.nodeType.jqxgridComponent.selectRow.model = selectObject.model;
          // this.nodeType.jqxgridComponent.selectRow.comment = selectObject.comments;
          // this.nodeType.jqxgridComponent.selectRow.height = selectObject.height;
          // this.nodeType.jqxgridComponent.selectRow

          // upd
          this.oSubNodeType = this.nodeTypeService.upd(selectObject).subscribe(
            response => {
              MaterialService.toast(`Тип оборудования c id = ${this.nodeType.jqxgridComponent.selectRow.nodeId} был обновлен.`);
            },
            error => MaterialService.toast(error.error.message),
            () => {
              // close edit window
              this.nodeType.editWindow.closeDestroyWindow();
              // update data source
              this.nodeType.jqxgridComponent.refresh_upd(
                this.nodeType.jqxgridComponent.selectRow.nodeId, this.nodeType.jqxgridComponent.selectRow);
            }
          );
        }
        break;
      case 'gatewayType':

        break;
      case 'sensorType':

        break;
      default:
        break;
    }
  }

  okEvenwinBtn(okEvenwinObject: any) {
    switch (okEvenwinObject.handBookType) {
      case 'typeFixture':

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

        break;
      case 'sensorType':

        break;
      default:
        break;
    }

  }
}
