import {AfterViewInit, Component, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {MaterialService} from '../../../shared/classes/material.service';

import {NodeService} from '../../../shared/services/node/node.service';
import {EventWindowComponent} from '../../../shared/components/event-window/event-window.component';
import {Node, Fixture, Contract, Geograph, Owner, EquipmentType} from '../../../shared/interfaces';
import {NodeeditFormComponent} from '../node-masterdetails-page/nodelist-page/nodeedit-form/nodeedit-form.component';
import {FixtureService} from '../../../shared/services/fixture/fixture.service';


declare var ymaps: any;


@Component({
  selector: 'app-nodemap-page',
  templateUrl: './nodemap-page.component.html',
  styleUrls: ['./nodemap-page.component.css']
})

export class NodemapPageComponent implements OnInit, AfterViewInit, OnDestroy {

  // variables from master component
  @Input() geographs: Geograph[];
  @Input() ownerNodes: Owner[];
  @Input() nodeTypes: EquipmentType[];
  @Input() contractNodes: Contract[];

  // determine the functions that need to be performed in the parent component
  @Output() onRefreshGrid = new EventEmitter();

  // define variables - link to view objects
  @ViewChild('editWindow') editWindow: NodeeditFormComponent;
  @ViewChild('eventWindow') eventWindow: EventWindowComponent;
  @ViewChild('warningEventWindow') warningEventWindow: string;

  // other variables
  nodes: Node[];
  saveNode: Node = new Node();
  saveFixture: Fixture = new Fixture();
  delNodeId: number;
  moveNodeId: number;
  n_coord: number;
  e_coord: number;
  map: any;
  actionEventWindow = '';
  oSub: Subscription;
  offset = 0;
  limit = 1000000000000;
  draggableIcon = false;

  constructor(private zone: NgZone,
              public router: Router,
              public route: ActivatedRoute,
              private nodeService: NodeService,
              private fixtureService: FixtureService) {
  }

  ngOnInit() {
    this.mapInit();
  }

  ngAfterViewInit() {

  }

  ngOnDestroy() {
    if (this.oSub) {
      this.oSub.unsubscribe();
    }
    if (this.map) {
      this.map.destroy();
    }
    if (this.eventWindow) {
      this.eventWindow.destroyEventWindow();
    }
    if (this.editWindow) {
      this.editWindow.destroyWindow();
    }
  }

  // map initialization
  mapInit(): void {
    ymaps.ready().then(() => {
      this.map = new ymaps.Map('node_yamaps', {
        center: [60.0503, 30.4269],
        zoom: 17,
        controls: ['zoomControl']
      });

      // Refresh map
      // this.getAll();

      // buttons on the map init
      this.buttonsInit();
    });
  }

  // buttons on the map init
  buttonsInit() {
    const ButtonLayout = ymaps.templateLayoutFactory.createClass([
        `<div class="fr">
                  <Button id="insItem"
                    class="btn btn-small waves-effect waves-orange white blue-text"
                    style="margin: 2px 2px 2px 2px;"
                  >
                    <i class="material-icons">add</i>
                  </Button>
                  <Button id="refreshMap"
                    class="btn btn-small waves-effect waves-orange white blue-text"
                    style="margin: 2px 2px 2px 2px;"
                  >
                    <i class="material-icons">refresh</i>
                  </Button>
                  <Button 
                    class="btn btn-small waves-effect waves-orange white blue-text"
                    style="margin: 2px 2px 2px 2px;"
                  >
                    <label class="blue-text">
                      <input type="checkbox" id="moveIcons"/>
                      <span>Двигать узлы</span>
                    </label>
                  </Button>
        
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

    this.map.controls.add(buttonIns, {
      right: 5,
      top: 5
    });
  }

  // get a set of objects
  getAll() {
    this.oSub = this.nodeService.getAll({}).subscribe(nodes => {
      this.nodes = nodes;
      this.addItemsToMap();
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
      `<div class="fr">
        <jqxTooltip [position]="'bottom'" [name]="'updTooltip'"
                    [content]="'Редактировать узел'">
          <Button id="updItems"
            class="btn btn-small waves-effect waves-orange white blue-text"
            style="margin: 2px 2px 2px 2px;"
          >
            <i class="material-icons">edit</i>
          </Button>
        </jqxTooltip>
        
        <jqxTooltip [position]="'bottom'" [name]="'delTooltip'"
                    [content]="'Удалить узел'">
          <Button id="delItems"
            class="btn btn-small waves-effect waves-orange white blue-text"
            style="margin: 2px 2px 2px 2px;"
          >
            <i class="material-icons">delete</i>
          </Button>
        </jqxTooltip>
        
        <jqxTooltip [position]="'bottom'" [name]="'delTooltip'"
                    [content]="'Удалить узел с карты'">
          <Button id="visibilityItems"
            class="btn btn-small waves-effect waves-orange white blue-text"
            style="margin: 2px 2px 2px 25px;"
          >
            <i class="material-icons">pin_drop</i>
          </Button>
        </jqxTooltip>
      </div>
            
      <table class="table table-sm">
      <tbody>
      <tr><th>Договор</th><td>{{properties.node.contractCode}}</td></tr>
      <tr><th>Географическое понятие</th><td>{{properties.node.geographCode}}</td></tr>
      <tr><th>Тип узла</th><td>{{properties.node.nodeTypeCode}}</td></tr>
      <tr><th>Владелец</th><td>{{properties.node.ownerCode}}</td></tr>
      <tr><th>Широта</th><td>{{properties.node.n_coordinate}}</td></tr>
      <tr><th>Долгота</th><td>{{properties.node.e_coordinate}}</td></tr>
      <tr><th>Серийный номер</th><td>{{properties.node.serialNumber}}</td></tr>
      <tr><th>Коментарий</th><td>{{properties.node.comment}}</td></tr>
      </tbody>
      </table>`, {
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
              mapComponent.editWindow.positionWindow({x: 600, y: 90});
              mapComponent.editWindow.openWindow(properties._data.node, 'upd');
            };
          };
        }).call(this),

        visibilityItems: (function () {
          const mapComponent: NodemapPageComponent = this;
          return function (properties: any) {
            return function () {
              mapComponent.warningEventWindow = 'Очистить координаты узла (убрать с карты)?';
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
              mapComponent.warningEventWindow = 'Удалить узел?';
              mapComponent.actionEventWindow = 'del';
              mapComponent.eventWindow.openEventWindow();
              mapComponent.delNodeId = properties._data.node.nodeId;
            };
          };
        }).call(this)
      }
    );

    this.map.geoObjects.removeAll();
    this.map.geoObjects.add(collection);
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

          mapComponent.warningEventWindow = 'Вы уверены, что требуется изменить координаты узла?';
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
    this.map.events.add('click', this.mapClickIns, this);
  }

  mapClickIns(event: any) {
    this.map.events.remove('click', this.mapClickIns, this);
    const coords = event.get('coords');

    // this.saveNode.nodeId = 1;
    this.saveNode.contractId = 1;
    this.saveNode.nodeTypeId = 1;
    this.saveNode.geographId = 1;
    this.saveNode.n_coordinate = coords[0];
    this.saveNode.e_coordinate = coords[1];
    this.saveNode.comment = 'пусто';
    this.saveNode.serialNumber = 'пусто';

    this.oSub = this.nodeService.ins(this.saveNode).subscribe(
      response => {
        this.saveNode.nodeId = +response;
        MaterialService.toast(`Узел/столб c id = ${this.saveNode.nodeId} был добавлен.`);
      },
      error => MaterialService.toast(error.error.message),
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
      this.saveFixture.serialNumber = 'пусто';
      this.saveFixture.comment = 'пусто';

      this.oSub = this.fixtureService.ins(this.saveFixture).subscribe(
        response => {
          this.saveFixture.fixtureId = +response;
          MaterialService.toast(`Светильник c id = ${this.saveFixture.fixtureId} был добавлен.`);
        },
        error => MaterialService.toast(error.error.message),
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
        MaterialService.toast(`Место положения узла/столба c id = ${node.nodeId} изменилось.`);
      },
      error => MaterialService.toast(error.error.message),
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
          MaterialService.toast(`Узел/столб c id = ${this.saveNode.nodeId} был убран с карты.`);
        },
        error => MaterialService.toast(error.error.message),
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
          MaterialService.toast('Узел/столб удален!');
        },
        error => MaterialService.toast(error.error.message),
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

  // save result edit window
  saveEditwinBtn() {
    // refresh map
    this.refreshMap();
    // refresh grid
    this.onRefreshGrid.emit();
  }
}
