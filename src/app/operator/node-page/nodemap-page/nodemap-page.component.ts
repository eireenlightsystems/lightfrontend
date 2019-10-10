// angular lib
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {isUndefined} from 'util';
import {TranslateService} from '@ngx-translate/core';
import {MatSnackBar} from '@angular/material/snack-bar';
// jqwidgets
// app interfaces
import {
  Node,
  Fixture,
  Contract,
  Owner,
  EquipmentType,
  SettingWinForEditForm,
  SourceForEditForm, NodeType, NavItem
} from '../../../shared/interfaces';
// app services
import {NodeService} from '../../../shared/services/node/node.service';
import {FixtureService} from '../../../shared/services/fixture/fixture.service';
// app components
import {EventWindowComponent} from '../../../shared/components/event-window/event-window.component';
import {EditFormComponent} from '../../../shared/components/edit-form/edit-form.component';


declare var ymaps: any;


@Component({
  selector: 'app-nodemap-page',
  templateUrl: './nodemap-page.component.html',
  styleUrls: ['./nodemap-page.component.css']
})

export class NodemapPageComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  // variables from parent component
  @Input() siteMap: NavItem[];
  @Input() ownerNodes: Owner[];
  @Input() nodeTypes: NodeType[];
  @Input() contractNodes: Contract[];
  @Input() currentLang: string;

  // determine the functions that need to be performed in the parent component
  @Output() onRefreshGrid = new EventEmitter();

  // define variables - link to view objects
  @ViewChild('editForm', {static: false}) editForm: EditFormComponent;
  @ViewChild('eventWindow', {static: false}) eventWindow: EventWindowComponent;

  // other variables
  myMap: any;
  nCoord = 60.0503;
  eCoord = 30.4269;
  zoom = 17;
  nodes: Node[];
  saveNode: Node = new Node();
  selectNode: Node = new Node();
  saveFixture: Fixture = new Fixture();
  delNodeId: number;
  moveNodeId: number;
  n_coord: number;
  e_coord: number;
  actionEventWindow = '';
  warningEventWindow = '';
  oSub: Subscription;
  offset = 0;
  limit = 1000000000000;
  draggableIcon = false;
  // edit form
  settingWinForEditForm: SettingWinForEditForm;
  sourceForEditForm: SourceForEditForm[];
  isEditFormInit = false;
  typeEditWindow = '';

  constructor(private _snackBar: MatSnackBar,
              private zone: NgZone,
              public router: Router,
              public route: ActivatedRoute,
              // service
              public translate: TranslateService,
              private nodeService: NodeService,
              private fixtureService: FixtureService) {
  }

  ngOnInit() {
    // definde edit form
    this.settingWinForEditForm = {
      code: 'editFormNode',
      name: 'Add / edit node',
      theme: 'material',
      isModal: true,
      modalOpacity: 0.3,
      width: 450,
      maxWidth: 500,
      minWidth: 460,
      height: 600,
      maxHeight: 600,
      minHeight: 600,
      coordX: 500,
      coordY: 65
    };

    // get all fixtures
    this.getAll();
  }

  ngAfterViewInit() {
    // init map
    this.mapInit();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.currentLang) {
      if (changes.currentLang.currentValue === 'ru') {
        // definde columns

        // definde filter

        // definde edit form
        this.sourceForEditForm = [
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
            selectName: ''
          },
          {
            nameField: 'contractNodes',
            type: 'jqxComboBox',
            source: this.contractNodes,
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
            nameField: 'nodeTypes',
            type: 'jqxComboBox',
            source: this.nodeTypes,
            theme: 'material',
            width: '285',
            height: '20',
            placeHolder: 'Тип узла:',
            displayMember: 'code',
            valueMember: 'id',
            selectedIndex: null,
            selectId: '',
            selectCode: '',
            selectName: ''
          },
          {
            nameField: 'n_coordinate',
            type: 'jqxTextArea',
            source: [],
            theme: 'material',
            width: '280',
            height: '20',
            placeHolder: 'Координата север:',
            displayMember: 'code',
            valueMember: 'id',
            selectedIndex: null,
            selectId: '',
            selectCode: '0',
            selectName: ''
          },
          {
            nameField: 'e_coordinate',
            type: 'jqxTextArea',
            source: [],
            theme: 'material',
            width: '280',
            height: '20',
            placeHolder: 'Координата восток:',
            displayMember: 'code',
            valueMember: 'id',
            selectedIndex: null,
            selectId: '',
            selectCode: '0',
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

      } else {
        // definde columns

        // definde filter

        // definde edit form
        this.sourceForEditForm = [
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
            selectName: ''
          },
          {
            nameField: 'contractNodes',
            type: 'jqxComboBox',
            source: this.contractNodes,
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
            nameField: 'nodeTypes',
            type: 'jqxComboBox',
            source: this.nodeTypes,
            theme: 'material',
            width: '285',
            height: '20',
            placeHolder: 'Node type:',
            displayMember: 'code',
            valueMember: 'id',
            selectedIndex: null,
            selectId: '',
            selectCode: '',
            selectName: ''
          },
          {
            nameField: 'n_coordinate',
            type: 'jqxTextArea',
            source: [],
            theme: 'material',
            width: '280',
            height: '20',
            placeHolder: 'Latitude:',
            displayMember: 'code',
            valueMember: 'id',
            selectedIndex: null,
            selectId: '',
            selectCode: '0',
            selectName: ''
          },
          {
            nameField: 'e_coordinate',
            type: 'jqxTextArea',
            source: [],
            theme: 'material',
            width: '280',
            height: '20',
            placeHolder: 'Longitude:',
            displayMember: 'code',
            valueMember: 'id',
            selectedIndex: null,
            selectId: '',
            selectCode: '0',
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

      }
    }
  }

  ngOnDestroy() {
    if (this.oSub) {
      this.oSub.unsubscribe();
    }
    if (this.myMap) {
      this.myMap.destroy();
    }
    if (this.eventWindow) {
      this.eventWindow.destroyEventWindow();
    }
    if (this.editForm) {
      this.editForm.destroy();
    }
  }

  // map initialization
  mapInit(): void {
    ymaps.ready().then(() => {
      this.myMap = new ymaps.Map('node_yamaps', {
        center: [this.nCoord, this.eCoord],
        zoom: this.zoom,
        controls: ['zoomControl']
      });
      // buttons on the map init
      this.buttonsInit();
    });
  }

  // buttons on the map init
  buttonsInit() {
    const ButtonLayout = ymaps.templateLayoutFactory.createClass([
        this.translate.currentLang === 'ru'
          ?
          `<div class="fr">
          <button id="insItem"
            class="btn btn-small waves-effect waves-yellow white blue-text"
            style="margin: 2px 2px 2px 2px;"
          >
            <i class="material-icons">add</i>
          </button>
          <button id="refreshMap"
            class="btn btn-small waves-effect waves-yellow white blue-text"
            style="margin: 2px 2px 2px 2px;"
          >
            <i class="material-icons">refresh</i>
          </button>
          <button id="moveNode"
            class="btn btn-small waves-effect waves-yellow white blue-text"
            style="margin: 2px 2px 2px 2px;"
          >
            <label class="blue-text" >
              <input type="checkbox" id="moveIcons"/>
              <span>Двигать узлы</span>
            </label>
          </button>
        </div>`
          :
          `<div class="fr">
          <button id="insItem"
            class="btn btn-small waves-effect waves-yellow white blue-text"
            style="margin: 2px 2px 2px 2px;"
          >
            <i class="material-icons">add</i>
          </button>
          <button id="refreshMap"
            class="btn btn-small waves-effect waves-yellow white blue-text"
            style="margin: 2px 2px 2px 2px;"
          >
            <i class="material-icons">refresh</i>
          </button>
          <button id="moveNode"
            class="btn btn-small waves-effect waves-yellow white blue-text"
            style="margin: 2px 2px 2px 2px;"
          >
            <label class="blue-text" >
              <input type="checkbox" id="moveIcons"/>
              <span>Move node</span>
            </label>
          </button>
        </div>`
      ].join(''),
      {
        build: function () {
          ButtonLayout.superclass.build.call(this);
          $('#insItem').bind('click', this.insItem(this.getData().properties));
          $('#refreshMap').bind('click', this.refreshMap(this.getData().properties));
          $('#moveIcons').bind('click', this.moveIcons(this.getData().properties));
        },
        insItem: (function () {
          const mapComponent: NodemapPageComponent = this;
          return function (properties: any) {
            return function () {
              mapComponent.insItem();
            };
          };
        }).call(this),
        refreshMap: (function () {
          const mapComponent: NodemapPageComponent = this;
          return function (properties: any) {
            return function () {
              mapComponent.refreshMap();
            };
          };
        }).call(this),
        moveIcons: (function () {
          const mapComponent: NodemapPageComponent = this;
          return function (properties: any) {
            return function () {
              // change options - move icon
              mapComponent.draggableIcon = !mapComponent.draggableIcon;
              // refresh map
              mapComponent.refreshMap();
            };
          };
        }).call(this)
      },
      ),
      buttonIns = new ymaps.control.Button({
        data: {
          content: 'Жмак-жмак-жмак',
          image: 'images/pen.png',
          title: 'Жмак-жмак-жмак'
        },
        options: {
          layout: ButtonLayout,
          maxWidth: [170, 190, 220]
        }
      });
    this.myMap.controls.add(buttonIns, {
      right: 5,
      top: 5
    });
  }

  // get a set of objects
  getAll() {
    this.oSub = this.nodeService.getAll({}).subscribe(nodes => {
        this.nodes = nodes;
        if (!isUndefined(this.myMap)) {
          this.myMap.setCenter([nodes[0].n_coordinate, nodes[0].e_coordinate], this.zoom);
        }
        // place the objects
        this.addItemsToMap();
      },
      error => {
        console.log(error.error.message);
      });
  }

  // refresh Map
  refreshMap() {
    this.getAll();
  }

  // place the object from the set "getAll()" on the map
  addItemsToMap() {
    const collection = new ymaps.GeoObjectCollection(null, {});
    const BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
      this.translate.currentLang === 'ru'
        ?
        `<div class="fr">
          <button id="updItems"
            class="btn btn-small waves-effect waves-yellow white blue-text"
            style="margin: 2px 2px 2px 2px;"
          >
            <i class="material-icons">edit</i>
          </button>
          <button id="delItems"
            class="btn btn-small waves-effect waves-yellow white blue-text"
            style="margin: 2px 2px 2px 2px;"
          >
            <i class="material-icons">delete</i>
          </button>
          <button id="visibilityItems"
            class="btn btn-small waves-effect waves-yellow white blue-text"
            style="margin: 2px 2px 2px 25px;"
          >
            <i class="material-icons">pin_drop</i>
          </button>
        </div>
        <table class="table table-sm">
          <tbody>
            <tr><th>Договор</th><td>{{properties.node.contractCode}}</td></tr>
            <tr><th>Адрес</th><td>{{properties.node.geographFullName}}</td></tr>
            <tr><th>Тип узла</th><td>{{properties.node.nodeTypeCode}}</td></tr>
            <tr><th>Владелец</th><td>{{properties.node.ownerCode}}</td></tr>
            <tr><th>Широта</th><td>{{properties.node.n_coordinate}}</td></tr>
            <tr><th>Долгота</th><td>{{properties.node.e_coordinate}}</td></tr>
            <tr><th>Серийный номер</th><td>{{properties.node.serialNumber}}</td></tr>
            <tr><th>Коментарий</th><td>{{properties.node.comment}}</td></tr>
          </tbody>
        </table>`
        :
        `<div class="fr">
          <button id="updItems"
            class="btn btn-small waves-effect waves-yellow white blue-text"
            style="margin: 2px 2px 2px 2px;"
          >
            <i class="material-icons">edit</i>
          </button>
          <button id="delItems"
            class="btn btn-small waves-effect waves-yellow white blue-text"
            style="margin: 2px 2px 2px 2px;"
          >
            <i class="material-icons">delete</i>
          </button>
          <button id="visibilityItems"
            class="btn btn-small waves-effect waves-yellow white blue-text"
            style="margin: 2px 2px 2px 25px;"
          >
            <i class="material-icons">pin_drop</i>
          </button>
        </div>
        <table class="table table-sm">
          <tbody>
            <tr><th>Contract</th><td>{{properties.node.contractCode}}</td></tr>
            <tr><th>Address</th><td>{{properties.node.geographFullName}}</td></tr>
            <tr><th>Node type</th><td>{{properties.node.nodeTypeCode}}</td></tr>
            <tr><th>Owner</th><td>{{properties.node.ownerCode}}</td></tr>
            <tr><th>Latitude</th><td>{{properties.node.n_coordinate}}</td></tr>
            <tr><th>Longitude</th><td>{{properties.node.e_coordinate}}</td></tr>
            <tr><th>Serial number</th><td>{{properties.node.serialNumber}}</td></tr>
            <tr><th>Comments</th><td>{{properties.node.comment}}</td></tr>
          </tbody>
        </table>`
      , {
        build: function () {
          BalloonContentLayout.superclass.build.call(this);
          $('#updItems').bind('click', this.updItems(this.getData().properties));
          $('#visibilityItems').bind('click', this.visibilityItems(this.getData().properties));
          $('#delItems').bind('click', this.delItems(this.getData().properties));
        },
        clear: function () {
          // $('#fixtureLightSwitcher').unbind('click', this.toggle);
          BalloonContentLayout.superclass.clear.call(this);
        },
        updItems: (function () {
          const mapComponent: NodemapPageComponent = this;
          return function (properties: any) {
            return function () {
              mapComponent.selectNode = properties._data.node;
              mapComponent.typeEditWindow = 'upd';
              mapComponent.getSourceForEditForm();
              mapComponent.isEditFormInit = !mapComponent.isEditFormInit;
            };
          };
        }).call(this),
        visibilityItems: (function () {
          const mapComponent: NodemapPageComponent = this;
          return function (properties: any) {
            return function () {
              mapComponent.warningEventWindow =
                mapComponent.translate.instant('site.menu.operator.node-page.nodemap-page.move-question1');
              mapComponent.actionEventWindow = 'visibility';
              mapComponent.eventWindow.openEventWindow();
              mapComponent.delNodeId = properties._data.node.nodeId;
            };
          };
        }).call(this),
        delItems: (function () {
          const mapComponent: NodemapPageComponent = this;
          return function (properties: any) {
            return function () {
              mapComponent.warningEventWindow =
                mapComponent.translate.instant('site.menu.operator.node-page.node-masterdetails-page.nodelist-page.del-question')
                + properties._data.node.nodeId + '?';
              mapComponent.actionEventWindow = 'del';
              mapComponent.eventWindow.openEventWindow();
              mapComponent.delNodeId = properties._data.node.nodeId;
            };
          };
        }).call(this)
      }
    );
    this.myMap.geoObjects.removeAll();
    this.myMap.geoObjects.add(collection);
    for (const node of this.nodes) {
      const myGeoObject = new ymaps.GeoObject(
        {
          // description geometry
          geometry: {
            type: 'Point',
            coordinates: [node.n_coordinate, node.e_coordinate]
          },
          // properties
          properties: {
            iconContent: node.nodeId,
            node: node
          }
        },
        {
          // options
          balloonContentLayout: BalloonContentLayout,
          balloonPanelMaxMapArea: 0,
          // icon will be change width
          preset: 'islands#blackStretchyIcon',
          // icon move
          draggable: this.draggableIcon
        });

      const changeCoords = function (mapComponent) {
        return function (e) {
          const cord = e.get('target').geometry.getCoordinates();
          mapComponent.moveNodeId = e.get('target').properties._data.node.nodeId;
          mapComponent.n_coord = cord[0];
          mapComponent.e_coord = cord[1];
          mapComponent.warningEventWindow =
            mapComponent.translate.instant('site.menu.operator.node-page.nodemap-page.move-question2');
          mapComponent.actionEventWindow = 'move';
          mapComponent.eventWindow.openEventWindow();
        };
      }(this);
      // event dragend - getting new coordinates
      myGeoObject.events.add('dragend', changeCoords);
      collection.add(myGeoObject);
    }
  }

  // add empty object with coordinates
  insItem() {
    this.myMap.events.add('click', this.mapClickIns, this);
  }

  mapClickIns(event: any) {
    this.myMap.events.remove('click', this.mapClickIns, this);
    const coords = event.get('coords');
    this.saveNode.contractId = 1;
    this.saveNode.nodeTypeId = 1;
    this.saveNode.geographId = 1;
    this.saveNode.n_coordinate = coords[0];
    this.saveNode.e_coordinate = coords[1];
    this.saveNode.comment = this.translate.instant('site.forms.editforms.empty');
    this.saveNode.serialNumber = this.translate.instant('site.forms.editforms.empty');
    this.oSub = this.nodeService.ins(this.saveNode).subscribe(
      response => {
        this.saveNode.nodeId = +response;
        this.openSnackBar(this.translate.instant('site.menu.operator.node-page.node-masterdetails-page.nodelist-page.ins')
          + this.saveNode.nodeId, this.translate.instant('site.forms.editforms.ok'));
      },
      error => {
        this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok'));
        console.log(error.error.message);
      },
      () => {
        // insert fixture
        this.mapClickInsFixture(this.saveNode.nodeId);
        // refresh map
        this.refreshMap();
        // refresh grid
        this.onRefreshGrid.emit();
      }
    );
  }

  // insert fixture
  mapClickInsFixture(id_node: any) {
    if (this.saveNode.nodeId > 0) {
      this.saveFixture.contractId = 1;
      this.saveFixture.fixtureTypeId = 1;
      this.saveFixture.geographId = 1;
      this.saveFixture.installerId = 1;
      this.saveFixture.substationId = 1;
      this.saveFixture.heightTypeId = 1;
      this.saveFixture.nodeId = this.saveNode.nodeId;
      this.saveFixture.serialNumber = this.translate.instant('site.forms.editforms.empty');
      this.saveFixture.comment = this.translate.instant('site.forms.editforms.empty');
      this.oSub = this.fixtureService.ins(this.saveFixture).subscribe(
        response => {
          this.saveFixture.fixtureId = +response;
          this.openSnackBar(this.translate.instant('site.menu.operator.fixture-page.fixture-masterdetails-page.fixturelist-page.ins')
            + this.saveFixture.fixtureId, this.translate.instant('site.forms.editforms.ok'));
        },
        error => {
          this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok'));
          console.log(error.error.message);
        },
        () => {
        }
      );
    }
  }

  // change of coordinates
  changeCoords(nodeId: number, n_coord: number, e_coord: number) {
    const node: Node = new Node();
    node.nodeId = nodeId;
    node.n_coordinate = n_coord;
    node.e_coordinate = e_coord;
    this.oSub = this.nodeService.upd(node).subscribe(
      response => {
        this.openSnackBar(this.translate.instant('site.menu.operator.node-page.nodemap-page.moved')
          + node.nodeId, this.translate.instant('site.forms.editforms.ok'));
      },
      error => {
        this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok'));
        console.log(error.error.message);
      },
      () => {
        // refresh grid
        this.onRefreshGrid.emit();
      }
    );
  }

  // untie the node from the map
  visibilityItem(id: number) {
    if (+id >= 0) {
      this.saveNode.nodeId = id;
      this.saveNode.n_coordinate = 0;
      this.saveNode.e_coordinate = 0;
      this.oSub = this.nodeService.upd(this.saveNode).subscribe(
        response => {
          this.openSnackBar(this.translate.instant('site.menu.operator.node-page.nodemap-page.del')
            + this.saveNode.nodeId, this.translate.instant('site.forms.editforms.ok'));
        },
        error => {
          this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok'));
          console.log(error.error.message);
        },
        () => {
          // hide event window
          this.eventWindow.hideEventWindow();
          // refresh map
          this.refreshMap();
          // refresh grid
          this.onRefreshGrid.emit();
        }
      );
    }
  }

  // untie the node from the map
  delItem(id: number) {
    if (+id >= 0) {
      this.nodeService.del(+id).subscribe(
        response => {
          this.openSnackBar(this.translate.instant('site.menu.operator.node-page.node-masterdetails-page.nodelist-page.del'),
            this.translate.instant('site.forms.editforms.ok'));
        },
        error => {
          this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok'));
          console.log(error.error.message);
        },
        () => {
          // hide event window
          this.eventWindow.hideEventWindow();
          // refresh map
          this.refreshMap();
          // refresh grid
          this.onRefreshGrid.emit();
        }
      );
    }
  }

  // event window
  okEvenwinBtn() {
    if (this.actionEventWindow === 'move') {
      this.changeCoords(this.moveNodeId, this.n_coord, this.e_coord);
    }
    if (this.actionEventWindow === 'visibility') {
      this.visibilityItem(this.delNodeId);
    }
    if (this.actionEventWindow === 'del') {
      this.delItem(this.delNodeId);
    }
  }

  // EDIT FORM

  saveEditFormBtn() {
    let selectObject: Node = new Node();
    selectObject = this.selectNode;
    for (let i = 0; i < this.editForm.sourceForEditForm.length; i++) {
      switch (this.editForm.sourceForEditForm[i].nameField) {
        case 'geographs':
          selectObject.geographId = +this.editForm.sourceForEditForm[i].selectId;
          selectObject.geographFullName = this.editForm.sourceForEditForm[i].selectName;
          break;
        case 'contractNodes':
          selectObject.contractId = +this.editForm.sourceForEditForm[i].selectId;
          selectObject.contractCode = this.editForm.sourceForEditForm[i].selectCode;
          break;
        case 'nodeTypes':
          selectObject.nodeTypeId = +this.editForm.sourceForEditForm[i].selectId;
          selectObject.nodeTypeCode = this.editForm.sourceForEditForm[i].selectCode;
          break;
        case 'n_coordinate':
          selectObject.n_coordinate = +this.editForm.sourceForEditForm[i].selectCode;
          break;
        case 'e_coordinate':
          selectObject.e_coordinate = +this.editForm.sourceForEditForm[i].selectCode;
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
    if (this.typeEditWindow === 'upd') {
      // upd
      this.oSub = this.nodeService.upd(selectObject).subscribe(
        response => {
          this.openSnackBar(this.translate.instant('site.menu.operator.node-page.node-masterdetails-page.nodelist-page.upd')
            + selectObject.nodeId, this.translate.instant('site.forms.editforms.ok'));
        },
        error => {
          this.openSnackBar(error.error.message, this.translate.instant('site.forms.editforms.ok'));
          console.log(error.error.message);
        },
        () => {
          // close edit window
          this.editForm.closeDestroy();
          // refresh map
          this.refreshMap();
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
      }
      switch (sourceForEditForm[i].nameField) {
        case 'geographs':
          if (this.typeEditWindow === 'ins') {
            sourceForEditForm[i].selectId = '1';
            sourceForEditForm[i].selectName = this.translate.instant('site.forms.editforms.withoutAddress');
          }
          if (this.typeEditWindow === 'upd') {
            sourceForEditForm[i].selectId = this.selectNode.geographId.toString();
            sourceForEditForm[i].selectName = this.selectNode.geographFullName;
          }
          break;
        case 'contractNodes':
          sourceForEditForm[i].source = this.contractNodes;
          if (this.typeEditWindow === 'ins') {
            sourceForEditForm[i].selectId = this.contractNodes[0].id.toString();
            sourceForEditForm[i].selectCode = this.contractNodes.find(
              (one: Contract) => one.id === +sourceForEditForm[i].selectId).code;
            sourceForEditForm[i].selectName = this.contractNodes.find(
              (one: Contract) => one.id === +sourceForEditForm[i].selectId).name;
          }
          if (this.typeEditWindow === 'upd') {
            sourceForEditForm[i].selectId = this.selectNode.contractId.toString();
            sourceForEditForm[i].selectCode = this.contractNodes.find(
              (contractOne: Contract) => contractOne.id === +this.selectNode.contractId).code;
            sourceForEditForm[i].selectName = this.contractNodes.find(
              (contractOne: Contract) => contractOne.id === +this.selectNode.contractId).name;
            for (let j = 0; j < this.contractNodes.length; j++) {
              if (+this.contractNodes[j].id === +this.selectNode.contractId) {
                sourceForEditForm[i].selectedIndex = j;
                break;
              }
            }
          }
          break;
        case 'nodeTypes':
          sourceForEditForm[i].source = this.nodeTypes;
          if (this.typeEditWindow === 'ins') {
            sourceForEditForm[i].selectId = this.nodeTypes[0].id.toString();
            sourceForEditForm[i].selectCode = this.nodeTypes.find(
              (one: NodeType) => one.id === +sourceForEditForm[i].selectId).code;
            sourceForEditForm[i].selectName = this.nodeTypes.find(
              (one: NodeType) => one.id === +sourceForEditForm[i].selectId).name;
          }
          if (this.typeEditWindow === 'upd') {
            sourceForEditForm[i].selectId = this.selectNode.nodeTypeId.toString();
            sourceForEditForm[i].selectCode = this.nodeTypes.find(
              (oneType: NodeType) => oneType.id === +this.selectNode.nodeTypeId).code;
            sourceForEditForm[i].selectName = this.nodeTypes.find(
              (oneType: NodeType) => oneType.id === +this.selectNode.nodeTypeId).name;
            for (let j = 0; j < this.nodeTypes.length; j++) {
              if (+this.nodeTypes[j].id === +this.selectNode.nodeTypeId) {
                sourceForEditForm[i].selectedIndex = j;
                break;
              }
            }
          }
          break;
        case 'n_coordinate':
          if (this.typeEditWindow === 'upd') {
            sourceForEditForm[i].selectCode = this.selectNode.n_coordinate;
          } else {
            sourceForEditForm[i].selectCode = '0';
          }
          break;
        case 'e_coordinate':
          if (this.typeEditWindow === 'upd') {
            sourceForEditForm[i].selectCode = this.selectNode.e_coordinate;
          } else {
            sourceForEditForm[i].selectCode = '0';
          }
          break;
        case 'serialNumber':
          if (this.typeEditWindow === 'upd') {
            sourceForEditForm[i].selectCode = this.selectNode.serialNumber;
          }
          break;
        case 'comment':
          if (this.typeEditWindow === 'upd') {
            sourceForEditForm[i].selectCode = this.selectNode.comment;
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

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }
}
